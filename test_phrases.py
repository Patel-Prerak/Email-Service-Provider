import sys
sys.path.insert(0, 'mail-malware-detection/src')
from predict_with_headers import predict_phishing

test_phrases = [
    "You have to give presentation tomorrow",
    "Meeting at 3pm",
    "Lunch plans for today",
    "Project deadline next week",
    "URGENT: Verify your account NOW",
    "Click here to claim your prize",
    "Your PayPal account has been suspended"
]

print("Testing different phrases with PASSING authentication:\n")
for phrase in test_phrases:
    result = predict_phishing(
        model_path='mail-malware-detection/models/phishing_pipeline.joblib',
        subject=phrase,
        body='',
        receiving_chain='mx.google.com',
        esp='gmail',
        spf_pass=True,
        dkim_pass=True,
        dmarc_pass=True
    )
    
    status = "PHISH" if result['is_phishing'] else "SAFE "
    print(f"[{status}] {result['risk_level']:8s} ({result['confidence']:5.1%}) - {phrase}")
