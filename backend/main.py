import os
import json
import requests
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

OLLAMA_API_BASE_URL = "http://localhost:11434/api/generate"

def analyze_code_with_ollama(code):
    """
    Analyze code using a local Ollama model
    
    Args:
        code (str): Source code to analyze
    
    Returns:
        dict: Comprehensive code review results
    """
    try:
        # Comprehensive code review prompt
        prompt = f"""Perform a detailed code review with the following sections:
        1. Summary: Provide a brief overview of the code's purpose
        2. Bugs: Identify any potential bugs or logical errors
        3. Code Style: Evaluate adherence to language-specific style guidelines
        4. Code Structure: Analyze the overall code organization and design
        5. Performance: Assess potential performance bottlenecks
        6. Security: Check for potential security vulnerabilities
        7. Scalability: Evaluate the code's potential for scaling
        8. Readability: Comment on code clarity and readability
        9. Conclusion: Provide overall assessment and improvement recommendations

        Code to review:
        ```
        {code}
        ```

        Provide a structured response with clear sections. Be specific and constructive.
        """
        
        # Ollama API request payload
        payload = {
            "model": "qwen2.5-coder:latest",  # You can change this to your preferred model
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "max_tokens": 2000
            }
        }
        
        # Send request to Ollama
        response = requests.post(OLLAMA_API_BASE_URL, json=payload)
        
        if response.status_code != 200:
            return {
                'error': 'Failed to get response from Ollama',
                'status_code': response.status_code,
                'response_text': response.text
            }
        
        # Parse the response
        result = response.json()
        review_text = result.get('response', '')
        
        # Manually parse the AI response into sections
        sections = {}
        current_section = None
        
        for line in review_text.split('\n'):
            line = line.strip()
            if line.endswith(':'):
                current_section = line[:-1].lower()
                sections[current_section] = ''
            elif current_section and line:
                sections[current_section] += line + ' '
        
        # Clean up sections
        for section, content in sections.items():
            sections[section] = content.strip()
        
        return sections
    
    except Exception as e:
        print(f"Error in Ollama analysis: {e}")
        traceback.print_exc()
        return {
            'error': 'Failed to generate code review',
            'details': str(e)
        }

@app.route('/api/review', methods=['POST'])
def review_code():
    """
    Endpoint to receive code and generate AI-powered review
    """
    try:
        # Get JSON payload
        data = request.get_json()
        code = data.get('code', '')
        file_name = data.get('fileName', 'Unnamed File')
        
        # Validate input
        if not code:
            return jsonify({
                'error': 'No code provided',
                'status': 400
            }), 400
        
        # Analyze code with Ollama
        review_results = analyze_code_with_ollama(code)
        
        # Prepare response
        response = {
            'fileName': file_name,
            'codeLength': len(code),
            'reviewResults': review_results
        }
        
        return jsonify(response), 200
    
    except Exception as e:
        print(f"Error processing code review: {e}")
        traceback.print_exc()
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Code Review Backend with Ollama is running'
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)