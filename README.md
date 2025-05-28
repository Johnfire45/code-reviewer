# Secure Code Reviewer

An AI-powered secure code review tool that helps developers identify security vulnerabilities and best practices in their code.

## 🚀 Features

- **Code Upload**: Upload files or paste code directly
- **AI-Powered Analysis**: Uses advanced AI models (Sonnet/Gemini) for intelligent code review
- **Security Focus**: Specialized in identifying security vulnerabilities and best practices
- **Multi-Language Support**: Supports Python, JavaScript, Java, and more
- **Detailed Reports**: Get comprehensive security analysis with explanations
- **Clean UI**: Modern, responsive interface built with React

## 🛠️ Tech Stack

### Frontend
- React.js
- Material-UI or Tailwind CSS
- Axios for API calls

### Backend
- Node.js with Express (or Python with FastAPI)
- Multer for file uploads
- AI Integration (Gemini/OpenAI API)
- Static analysis tools integration

### AI & Analysis
- Google Gemini API (Sonnet)
- Static analysis tools (Bandit, ESLint, etc.)
- Custom security rule engine

## 📁 Project Structure

```
secure-code-reviewer/
├── frontend/          # React frontend application
├── backend/           # API server and analysis engine
├── scripts/           # Utility scripts for development and deployment
├── README.md          # Project documentation
└── docs/              # Additional documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- AI API key (Gemini/OpenAI)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd secure-code-reviewer
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd ../backend
npm install
```

4. Set up environment variables
```bash
# Create .env file in backend directory
GEMINI_API_KEY=your_api_key_here
PORT=5000
```

5. Start the development servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🔧 Configuration

- Add your AI API keys to the backend `.env` file
- Configure supported file types and size limits
- Customize security rules and analysis patterns

## 📝 Usage

1. Open the application in your browser
2. Upload a code file or paste code directly
3. Select the programming language
4. Click "Analyze Code"
5. Review the security findings and recommendations
6. Download the detailed report

## 🤝 Contributing

This project is part of a freelancing portfolio. Contributions and feedback are welcome!

## 📄 License

MIT License

## 👨‍💻 Author

**Harshit Shah**
- Security Engineer transitioning to Full-Stack Development
- Specializing in secure software development and AI integration
- Contact: [Your contact information]

---

*Built with ❤️ for secure coding practices* 