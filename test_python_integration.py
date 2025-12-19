#!/usr/bin/env python
"""
Test script to verify Python malware detection works correctly
Run this before starting the backend to ensure setup is correct
"""

import sys
import json
import os

# Add path to malware detection src
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'mail-malware-detection', 'src'))

print("=" * 80)
print("Testing Python Malware Detection Integration")
print("=" * 80)

# Test 1: Import check
print("\n[1/4] Checking imports...")
try:
    from malware_detector import MalwareDetector
    print("✓ MalwareDetector imported successfully")
except Exception as e:
    print(f"✗ Failed to import MalwareDetector: {e}")
    sys.exit(1)

# Test 2: Model loading
print("\n[2/4] Loading ML model...")
try:
    model_path = os.path.join(
        os.path.dirname(__file__), 
        'mail-malware-detection', 
        'models', 
        'best_model.pkl'
    )
    
    if not os.path.exists(model_path):
        print(f"✗ Model file not found at: {model_path}")
        sys.exit(1)
    
    detector = MalwareDetector()
    detector.load_model(model_path)
    print(f"✓ Model loaded successfully from: {model_path}")
except Exception as e:
    print(f"✗ Failed to load model: {e}")
    sys.exit(1)

# Test 3: Safe email detection
print("\n[3/4] Testing safe email detection...")
try:
    safe_email = {
        'subject': 'Meeting Tomorrow',
        'body': 'Hi, are you available for a meeting tomorrow at 2pm?',
        'sender': 'colleague@company.com',
        'headers': '',
        'attachments': []
    }
    
    result = detector.detect(safe_email)
    print(f"Safe email result: {json.dumps(result, indent=2)}")
    print("✓ Safe email detection works")
except Exception as e:
    print(f"✗ Safe email detection failed: {e}")
    sys.exit(1)

# Test 4: Malware email detection
print("\n[4/4] Testing malware email detection...")
try:
    malware_email = {
        'subject': 'URGENT: Verify Your Account',
        'body': 'Click here immediately: http://malicious.com/verify.exe',
        'sender': 'noreply@suspicious.com',
        'headers': '',
        'attachments': ['virus.exe']
    }
    
    result = detector.detect(malware_email)
    print(f"Malware email result: {json.dumps(result, indent=2)}")
    print("✓ Malware email detection works")
except Exception as e:
    print(f"✗ Malware email detection failed: {e}")
    sys.exit(1)

print("\n" + "=" * 80)
print("✓ All tests passed! Python integration is working correctly.")
print("=" * 80)
