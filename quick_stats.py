import pandas as pd

df = pd.read_csv('mail-malware-detection/data/raw/phishing_dataset.csv')

benign = df[df['label']==0]
phishing = df[df['label']==1]

print("BENIGN EMAILS:")
print(f"  SPF Pass: {benign['spf_pass'].mean():.1%}")
print(f"  DKIM Pass: {benign['dkim_pass'].mean():.1%}")
print(f"  DMARC Pass: {benign['dmarc_pass'].mean():.1%}")

print("\nPHISHING EMAILS:")
print(f"  SPF Pass: {phishing['spf_pass'].mean():.1%}")
print(f"  DKIM Pass: {phishing['dkim_pass'].mean():.1%}")
print(f"  DMARC Pass: {phishing['dmarc_pass'].mean():.1%}")
