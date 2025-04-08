import os
import hashlib
import magic
import yara
from datetime import datetime
from typing import Dict, List, Any, Set, Tuple
import json
import re

class RansomwareAnalyzer:
    def __init__(self):
        self.yara_rules_path = os.path.join(os.path.dirname(__file__), 'rules')
        self.reports_path = os.path.join(os.path.dirname(__file__), '..', 'reports')
        os.makedirs(self.reports_path, exist_ok=True)
        
        # Initialize YARA rules
        self.rules = self._load_yara_rules()

        # Known safe patterns that might trigger false positives
        self.safe_patterns: Set[bytes] = {
            b'encryption_key',  # Common in system files
            b'decrypt_config',  # Common in system files
            b'wallet.dat',     # Common in cryptocurrency software
            b'key_value',      # Common in system files
            b'payment_info',   # Common in legitimate software
        }

        # Common legitimate encryption-related functions
        self.legitimate_crypto_functions: Set[bytes] = {
            b'SSL_encrypt',
            b'SSL_decrypt',
            b'encrypt_config',
            b'decrypt_config',
            b'hash_password',
            b'verify_signature',
        }

    def _load_yara_rules(self) -> yara.Rules:
        """Load YARA rules for ransomware detection"""
        rules_file = os.path.join(self.yara_rules_path, 'ransomware.yar')
        if os.path.exists(rules_file):
            return yara.compile(rules_file)
        return None

    def calculate_file_hash(self, file_path: str) -> str:
        """Calculate SHA-256 hash of the file"""
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()

    def get_file_type(self, file_path: str) -> str:
        """Determine file type using python-magic"""
        return magic.from_file(file_path)

    def _check_pattern_context(self, content: bytes, pattern: bytes, window_size: int = 50) -> Tuple[bool, str]:
        """Check the context around a matched pattern to reduce false positives"""
        try:
            pattern_idx = content.index(pattern)
            start = max(0, pattern_idx - window_size)
            end = min(len(content), pattern_idx + len(pattern) + window_size)
            context = content[start:end]
            
            # Check if pattern appears in a legitimate context
            for safe_pattern in self.legitimate_crypto_functions:
                if safe_pattern in context:
                    return False, ""
            
            # Extract some context around the pattern for the report
            context_str = context.decode('utf-8', errors='ignore')
            return True, context_str
        except ValueError:
            return False, ""

    def analyze_file(self, file_path: str) -> Dict[str, Any]:
        """Perform comprehensive analysis of the ransomware sample"""
        analysis_results = {
            'timestamp': datetime.now().isoformat(),
            'file_info': {
                'name': os.path.basename(file_path),
                'size': os.path.getsize(file_path),
                'type': self.get_file_type(file_path),
                'hash': self.calculate_file_hash(file_path)
            },
            'yara_matches': [],
            'suspicious_patterns': [],
            'risk_level': 'unknown',
            'analysis_details': []
        }

        suspicious_count = 0
        total_checks = 0

        with open(file_path, 'rb') as f:
            content = f.read()

            # Check for encryption-related strings with context
            encryption_keywords = [
                b'encrypt', b'decrypt', b'AES', b'RSA', b'CryptoAPI',
                b'CryptEncrypt', b'CryptDecrypt', b'CryptoServiceProvider'
            ]
            
            for keyword in encryption_keywords:
                total_checks += 1
                is_suspicious, context = self._check_pattern_context(content, keyword)
                if is_suspicious and keyword not in self.safe_patterns:
                    suspicious_count += 1
                    analysis_results['suspicious_patterns'].append(
                        f"Found encryption-related keyword: {keyword.decode('utf-8', errors='ignore')}"
                    )
                    if context:
                        analysis_results['analysis_details'].append({
                            'type': 'encryption_pattern',
                            'pattern': keyword.decode('utf-8', errors='ignore'),
                            'context': context
                        })

            # Check for ransom note patterns with additional context
            ransom_keywords = [
                b'ransom', b'bitcoin', b'wallet',
                b'decrypt_files', b'pay_now', b'payment_instructions',
                b'files_encrypted', b'your_files'
            ]
            
            for keyword in ransom_keywords:
                total_checks += 1
                is_suspicious, context = self._check_pattern_context(content, keyword)
                if is_suspicious and keyword not in self.safe_patterns:
                    suspicious_count += 2  # Ransom-related patterns are weighted more heavily
                    analysis_results['suspicious_patterns'].append(
                        f"Found ransom-related keyword: {keyword.decode('utf-8', errors='ignore')}"
                    )
                    if context:
                        analysis_results['analysis_details'].append({
                            'type': 'ransom_pattern',
                            'pattern': keyword.decode('utf-8', errors='ignore'),
                            'context': context
                        })

        # Run YARA rules if available
        if self.rules:
            matches = self.rules.match(file_path)
            total_checks += len(matches)
            suspicious_count += len(matches) * 2  # YARA matches are weighted more heavily
            analysis_results['yara_matches'] = [
                {
                    'rule_name': match.rule,
                    'strings': [str(s) for s in match.strings],
                    'tags': match.tags
                }
                for match in matches
            ]

        # Calculate risk score (0-100)
        if total_checks > 0:
            risk_score = (suspicious_count / total_checks) * 100
        else:
            risk_score = 0

        # Determine risk level based on score
        if risk_score >= 70:
            analysis_results['risk_level'] = 'high'
        elif risk_score >= 40:
            analysis_results['risk_level'] = 'medium'
        else:
            analysis_results['risk_level'] = 'low'

        analysis_results['risk_score'] = round(risk_score, 2)
        
        # Add analysis summary
        analysis_results['summary'] = {
            'total_checks': total_checks,
            'suspicious_findings': suspicious_count,
            'risk_score': round(risk_score, 2),
            'is_system_binary': 'system' in analysis_results['file_info']['type'].lower() or 'mach-o' in analysis_results['file_info']['type'].lower()
        }

        return analysis_results

    def generate_report(self, analysis_results: Dict[str, Any], file_path: str) -> str:
        """Generate a detailed analysis report"""
        report_filename = f"analysis_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        report_path = os.path.join(self.reports_path, report_filename)
        
        with open(report_path, 'w') as f:
            json.dump(analysis_results, f, indent=4)
        
        return report_path

    def analyze_sample(self, file_path: str) -> Dict[str, Any]:
        """Main method to analyze a ransomware sample and generate report"""
        try:
            # Perform analysis
            analysis_results = self.analyze_file(file_path)
            
            # Generate report
            report_path = self.generate_report(analysis_results, file_path)
            analysis_results['report_path'] = report_path
            
            return analysis_results
        except Exception as e:
            raise Exception(f"Analysis failed: {str(e)}") 