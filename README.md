<<<<<<< HEAD
# Ransomware Analysis Framework

A comprehensive platform for analyzing ransomware samples, detecting encryption methods, and monitoring network communication patterns.

## Features

- Modern, responsive web interface
- File upload with drag-and-drop support
- Real-time analysis dashboard
- Network traffic monitoring
- Encryption method detection
- File system change tracking
- Detailed analysis reports

## Tech Stack

- Frontend: React.js with TypeScript
- Backend: Python (Flask)
- Database: MongoDB
- Analysis Tools: Cuckoo Sandbox, Wireshark, Pycryptodome

## Prerequisites

- Node.js (v14 or higher)
- Python 3.8+
- MongoDB
- VirtualBox/VMware
- Cuckoo Sandbox

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ransomware-analysis-framework.git
cd ransomware-analysis-framework
```

2. Install backend dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:
Create a `.env` file in the backend directory with:
```
MONGODB_URI=your_mongodb_uri
SECRET_KEY=your_secret_key
```

## Running the Application

1. Start the backend server:
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

3. Access the application at `http://localhost:3000`

## Project Structure

```
ransomware-analysis-framework/
├── backend/         # Flask backend
├── frontend/        # React frontend
├── sandbox/         # Cuckoo Sandbox setup
├── database/        # MongoDB data storage
├── reports/         # Generated analysis reports
└── docs/           # Documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Security

- All file uploads are scanned for malware
- Network traffic is monitored in an isolated environment
- Analysis is performed in a secure sandbox
- No sensitive data is stored in the database

## Acknowledgments

- Cuckoo Sandbox team
- Wireshark community
- Pycryptodome developers 
=======
# ransomware-analysis-framework
The Ransomware Analysis Framework is a full-stack web application designed to analyze and assess potentially malicious files, especially ransomware samples. Built with a React.js frontend and a Flask backend, this tool allows users to upload executable files and receive an in-depth threat report based on static and dynamic analysis techniques.
>>>>>>> 5d9ec803507dd418297b83e2cae91e2767b75d7a
