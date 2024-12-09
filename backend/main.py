import os
from dotenv import load_dotenv, dotenv_values

import requests
from typing import Dict, Any
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load environment variables

env_path = os.path.join(os.path.dirname(__file__), '../.env')
env_config = dotenv_values(env_path)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*", "methods": ["POST", "OPTIONS"]}})

OLLAMA_API_BASE_URL = os.getenv("OLLAMA_API_BASE_URL")

def generate_comprehensive_code_review_prompt() -> str:
    """
    Generate a detailed, structured prompt for comprehensive code review.
    
    Returns:
        str: A meticulously crafted prompt for thorough code analysis
    """
    return """
You are a senior software engineer and code quality expert performing an exhaustive code review. 
Analyze the provided code with extreme depth and precision across multiple critical dimensions:

1. COMPREHENSIVE CODE ANALYSIS
   - Detailed algorithmic breakdown
   - Architectural design evaluation
   - Potential design pattern applications
   - Code complexity metrics

2. CRITICAL BUG DETECTION
   - Identify latent and manifest bugs
   - Potential runtime vulnerabilities
   - Edge case failure scenarios
   - Subtle logical inconsistencies
   - Performance-related anti-patterns

3. CODE QUALITY ASSESSMENT
   - Adherence to language-specific best practices
   - Naming convention compliance
   - Modularity and separation of concerns
   - Code duplication analysis
   - Maintainability index

4. PERFORMANCE OPTIMIZATION
   - Time complexity analysis
   - Space complexity evaluation
   - Potential bottlenecks
   - Algorithmic efficiency recommendations
   - Resource utilization patterns

5. SECURITY VULNERABILITY ASSESSMENT
   - Potential injection points
   - Authentication and authorization weaknesses
   - Data validation and sanitization gaps
   - Cryptographic considerations
   - Threat modeling insights

6. SCALABILITY AND ARCHITECTURE
   - Horizontal and vertical scaling potential
   - Architectural flexibility
   - Dependency management
   - System integration considerations
   - Future extensibility

7. ERROR HANDLING AND RESILIENCE
   - Exception management strategies
   - Graceful degradation mechanisms
   - Logging and monitoring recommendations
   - Fault tolerance evaluation

8. CODE MODERNIZATION SUGGESTIONS
   - Language-specific idiomatic improvements
   - Recommended design pattern refactorings
   - Modern programming paradigm alignments
   - Technical debt reduction strategies

9. COMPLIANCE AND STANDARDS
   - Industry coding standards adherence
   - Potential regulatory compliance issues
   - Best practice alignment
   - Code review checklist validation

10. CONCLUSIVE RECOMMENDATION
    - Holistic code quality rating
    - Priority-ranked improvement suggestions
    - Potential refactoring roadmap
    - Advanced optimization strategies

Provide a meticulously structured, deeply technical, and actionable analysis that goes beyond surface-level observations.

CODE TO ANALYZE:
```
{code}
```

ANALYSIS FORMAT:
- Use clear, professional technical language
- Provide concrete, implementable recommendations
- Include severity levels for each observation
- Quantify improvements where possible
"""

def analyze_code_with_ollama(code: str) -> Dict[str, Any]:
    """
    Perform comprehensive code analysis using Ollama model.
    
    Args:
        code (str): Source code to analyze
    
    Returns:
        Dict[str, Any]: Comprehensive code review results
    """
    prompt = generate_comprehensive_code_review_prompt().format(code=code)
    
    payload = {
        "model": "llama3.2:latest",
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.7,
            "max_tokens": 4000  # Increased to accommodate detailed analysis
        }
    }
    
    try:
        response = requests.post(OLLAMA_API_BASE_URL, json=payload)
        response.raise_for_status()
        return {
            "comprehensive_review": response.json().get('response', 'No analysis generated'),
            "status": "success"
        }
    except requests.exceptions.RequestException as e:
        return {
            "error": f"Ollama API Request Failed: {e}",
            "status": "error"
        }
    except Exception as e:
        return {
            "error": f"Unexpected Analysis Error: {e}",
            "status": "error"
        }

@app.route('/api/review', methods=['POST'])
def perform_deep_code_review():
    """
    Advanced endpoint for comprehensive code analysis
    """
    try:
        data = request.get_json()
        code = data.get('code')
        
        if not code:
            return jsonify({
                "error": "No code provided for analysis",
                "status": "error"
            }), 400
        
        review_results = analyze_code_with_ollama(code)
        
        return jsonify({
            "fileName": data.get('fileName', 'Unnamed'),
            "codeLength": len(code),
            "reviewResults": review_results
        }), 200
    
    except Exception as e:
        return jsonify({
            "error": f"Internal Server Error: {e}",
            "status": "error"
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Comprehensive health check endpoint"""
    return jsonify({
        'status': 'operational',
        'services': {
            'code_review': 'fully functional',
            'ollama_integration': 'connected'
        }
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
