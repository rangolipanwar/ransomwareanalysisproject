from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from dotenv import load_dotenv
import os
from analysis.ransomware_analyzer import RansomwareAnalyzer
import uuid
import json
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Enable CORS for all routes
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize ransomware analyzer
analyzer = RansomwareAnalyzer()

# Basic configuration
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Add this list of allowed extensions
ALLOWED_EXTENSIONS = {
    'exe', 'dll', 'bin', 'so', 'dylib', 'o', 'obj'
}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "statistics": {
            "total_samples": len(os.listdir(app.config['UPLOAD_FOLDER'])),
            "total_reports": len(os.listdir(analyzer.reports_path))
        }
    })

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        # Generate a unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        filename = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        
        try:
            # Save the file
            file.save(filename)
            
            # Analyze the uploaded file
            analysis_result = analyzer.analyze_sample(filename)
            
            # Generate a report ID
            report_id = str(uuid.uuid4())
            
            # Add metadata to the analysis result
            analysis_result['metadata'] = {
                'original_filename': file.filename,
                'uploaded_filename': unique_filename,
                'report_id': report_id,
                'timestamp': datetime.now().isoformat()
            }
            
            # Save the analysis result as a report
            report_path = os.path.join(analyzer.reports_path, f"analysis_report_{report_id}.json")
            with open(report_path, 'w') as f:
                json.dump(analysis_result, f, indent=4)
            
            return jsonify({
                "message": "File uploaded and analyzed successfully",
                "filename": file.filename,
                "report_id": report_id,
                "analysis": analysis_result
            })
        except Exception as e:
            # Clean up the uploaded file if analysis fails
            if os.path.exists(filename):
                os.remove(filename)
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"}), 400

@app.route('/api/analysis/<filename>', methods=['GET'])
def get_analysis(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    
    try:
        analysis_result = analyzer.analyze_sample(file_path)
        return jsonify(analysis_result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/reports/<report_id>', methods=['GET'])
def get_report(report_id):
    report_path = os.path.join(analyzer.reports_path, f"analysis_report_{report_id}.json")
    if not os.path.exists(report_path):
        return jsonify({"error": "Report not found"}), 404
    
    try:
        with open(report_path, 'r') as f:
            report_data = json.load(f)
        return jsonify(report_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/reports', methods=['GET'])
def list_reports():
    try:
        reports = []
        for filename in os.listdir(analyzer.reports_path):
            if filename.endswith('.json'):
                report_id = filename.replace('analysis_report_', '').replace('.json', '')
                report_path = os.path.join(analyzer.reports_path, filename)
                with open(report_path, 'r') as f:
                    report_data = json.load(f)
                reports.append({
                    'id': report_id,
                    'filename': report_data.get('metadata', {}).get('original_filename', filename),
                    'timestamp': report_data.get('metadata', {}).get('timestamp', ''),
                    'risk_level': report_data.get('risk_level', 'unknown'),
                    'file_type': report_data.get('file_info', {}).get('type', ''),
                    'suspicious_patterns_count': len(report_data.get('suspicious_patterns', [])),
                    'yara_matches_count': len(report_data.get('yara_matches', []))
                })
        return jsonify({"reports": sorted(reports, key=lambda x: x['timestamp'], reverse=True)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001) 