# CodeSense Code Reviewer

CodeSense Code Reviewer is an intelligent code analysis system that automates and streamlines the code review process in modern development environments. Powered by the Ollama Llama 3.2 model, it provides comprehensive code analysis through a responsive web interface and GitHub Actions integration.

## Features

- **Intelligent Code Analysis**: Leverages Ollama Llama 3.2 model to detect security vulnerabilities, performance bottlenecks, and code quality issues
- **Dual-Platform Solution**: Features a responsive web interface (React, TypeScript, Tailwind CSS) and GitHub Actions integration
- **Automated Reporting**: Generates detailed markdown reports for clear communication across development teams
- **Language-Agnostic Support**: Compatible with diverse technology stacks and modern microservices architectures

## System Architecture

### Web Application

#### Frontend
- Framework: React with Vite
- Language: TypeScript
- Styling: Tailwind CSS
- Features: Text paste and file upload support

#### Backend
- Server: Python Flask
- AI Integration: Ollama Llama 3.2 model
- Processing: Custom prompts and response formatting

### GitHub Integration
- Custom YAML workflow for GitHub Actions
- Repository-wide code scanning
- Automated markdown report generation

## Prerequisites

- Node.js and npm (Download from [nodejs.org](https://nodejs.org))
- Python 3 (Download from [python.org](https://python.org))
- Ollama (Installation instructions at [Ollama's GitHub repository](https://github.com/ollama/ollama))

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Rubbershredder/code-reviewer.git
   cd code-reviewer
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env` file in the frontend directory with required environment variables.

3. **Backend Setup**
   ```bash
   cd ../backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
   Create a `.env` file in the backend directory with necessary configuration.

## Running the Application

1. **Start Backend Server**
   ```bash
   # Ensure virtual environment is activated
   python main.py
   ```

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

## GitHub Actions Setup

1. **Configure Repository Settings**
   - Navigate to repository Settings → Actions → General
   - Enable Actions
   - Set "Workflow permissions" to "Read and write"

2. **Create Workflow File**
   - Create `.github/workflows/code-analysis.yml`
   - Copy workflow configuration from `.github/workflows/ai-code-review.yml`

## Expected Outcomes

- Enhanced code quality through immediate AI-powered analysis
- Streamlined development workflow with intuitive interface
- Automated repository management and continuous feedback
- Rapid analysis results for large codebases
- Scalable platform supporting future enhancements

## Contributing

We welcome contributions from the community. Please follow standard GitHub pull request procedures.

## Acknowledgments

- Ollama Llama 3.2 for providing the AI model
- GitHub Actions for continuous integration support

