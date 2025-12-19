import sys
sys.path.insert(0, 'mail-malware-detection/src')
from predict_with_headers import predict_phishing

# Test the specific phrase the user mentioned
result = predict_phishing(
    model_path='mail-malware-detection/models/phishing_pipeline.joblib',
    subject="You have to give presentation tomorrow",
    body='',
    receiving_chain='mx.google.com',
    esp='gmail',
    spf_pass=True,
    dkim_pass=True,
    dmarc_pass=True
)

print(f"Phrase: 'You have to give presentation tomorrow'")
print(f"Confidence: {result['confidence']*100:.1f}%")
print(f"Risk Level: {result['risk_level']}")
print(f"Is Phishing: {result['is_phishing']}")
print(f"Message: {result['message']}")
