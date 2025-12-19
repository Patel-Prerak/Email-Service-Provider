import sys
sys.path.insert(0, 'mail-malware-detection/src')
from predict_with_headers import predict_phishing

# Test 1: Benign text with passing auth (like manual scanner now sends)
result1 = predict_phishing(
    model_path='mail-malware-detection/models/phishing_pipeline.joblib',
    subject='You have to give presentation tomorrow',
    body='',
    receiving_chain='localhost',
    esp='gmail',
    spf_pass=True,
    dkim_pass=True,
    dmarc_pass=True
)

print("TEST 1: Benign text + Passing Auth (Current Manual Scanner)")
print(f"  Risk: {result1['risk_level']}, Confidence: {result1['confidence']:.1%}")
print(f"  Is Phishing: {result1['is_phishing']}")

# Test 2: Same text with failed auth
result2 = predict_phishing(
    model_path='mail-malware-detection/models/phishing_pipeline.joblib',
    subject='You have to give presentation tomorrow',
    body='',
    receiving_chain='',
    esp='unknown',
    spf_pass=False,
    dkim_pass=False,
    dmarc_pass=False
)

print("\nTEST 2: Same text + Failed Auth")
print(f"  Risk: {result2['risk_level']}, Confidence: {result2['confidence']:.1%}")
print(f"  Is Phishing: {result2['is_phishing']}")

# Test 3: Obviously phishing text with passing auth
result3 = predict_phishing(
    model_path='mail-malware-detection/models/phishing_pipeline.joblib',
    subject='URGENT: Verify your account NOW or be suspended!',
    body='Click here immediately to verify your PayPal account',
    receiving_chain='localhost',
    esp='gmail',
    spf_pass=True,
    dkim_pass=True,
    dmarc_pass=True
)

print("\nTEST 3: Phishing text + Passing Auth")
print(f"  Risk: {result3['risk_level']}, Confidence: {result3['confidence']:.1%}")
print(f"  Is Phishing: {result3['is_phishing']}")
