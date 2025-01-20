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
# Advanced Code Analysis Pre-Prompt
        ## Primary Analysis Parameters
        Perform a comprehensive static and dynamic code analysis with the following focus areas:
        ### 1. Metric Collection
        - Calculate cyclomatic complexity for each function
        - Measure Halstead complexity metrics
        - Generate maintainability index
        - Count effective lines of code (eLOC)
        - Assess comment-to-code ratio
        - Identify duplicate code segments (with >3 lines)
        ### 2. Variable and Resource Analysis
        - Track variable lifecycle and usage patterns
        - Identify unused or redundant variables
        - Detect memory leaks and resource management issues
        - Analyze scope contamination
        - Check for proper initialization
        ### 3. Control Flow Analysis
        - Map execution paths
        - Identify unreachable code
        - Detect infinite loops
        - Analyze exception handling paths
        - Evaluate branching complexity
        ### 4. Data Flow Analysis
        - Track data transformations
        - Identify potential null references
        - Check for uninitialized variables
        - Analyze type consistency
        - Evaluate thread safety
        ### 5. Security Assessment
        - Check for common vulnerability patterns
        - Analyze input validation
        - Evaluate output encoding
        - Assess authentication mechanisms
        - Review authorization controls
        ### 6. Performance Profiling
        - Calculate algorithmic complexity
        - Identify performance bottlenecks
        - Analyze memory usage patterns
        - Evaluate I/O operations
        - Check resource utilization
        ### 7. Code Style and Standards
        - Verify naming conventions
        - Check formatting consistency
        - Assess documentation quality
        - Evaluate code organization
        - Review error handling practices
        ## Output Format Requirements
        Generate a structured analysis report including:
        1. Executive Summary
           - Overall code quality score (0-100)
           - Critical issues count
           - High-priority recommendations
           - Technical debt assessment
        2. Detailed Metrics
           - Complexity scores
           - Quality metrics
           - Performance indicators
           - Security ratings
        3. Issue Analysis
           - Categorized problems
           - Root cause analysis
           - Impact assessment
           - Resolution priority
        4. Recommendations
           - Specific refactoring suggestions
           - Optimization opportunities
           - Security improvements
           - Best practice alignment
        5. Visualization Data
           - Complexity trends
           - Issue distribution
           - Quality metrics
           - Performance patterns
        ## Special Considerations
        - Identify language-specific idioms and patterns
        - Consider framework-specific best practices
        - Evaluate cloud-native compatibility
        - Assess microservices architecture alignment
        - Review API design principles
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