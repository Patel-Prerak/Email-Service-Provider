import pandas as pd
import sys
sys.stdout.reconfigure(encoding='utf-8')


# Load the training data
df = pd.read_csv('mail-malware-detection/data/raw/phishing_dataset.csv')

print("=" * 60)
print("TRAINING DATA ANALYSIS")
print("=" * 60)

print(f"\nTotal samples: {len(df)}")
print(f"Benign (label=0): {len(df[df['label']==0])}")
print(f"Phishing (label=1): {len(df[df['label']==1])}")

print("\n" + "=" * 60)
print("BENIGN EMAILS - Authentication Stats")
print("=" * 60)
benign = df[df['label']==0]
print(f"SPF Pass Rate: {benign['spf_pass'].mean():.2%}")
print(f"DKIM Pass Rate: {benign['dkim_pass'].mean():.2%}")
print(f"DMARC Pass Rate: {benign['dmarc_pass'].mean():.2%}")
print(f"Most common ESP: {benign['esp'].value_counts().head(3).to_dict()}")

print("\n" + "=" * 60)
print("PHISHING EMAILS - Authentication Stats")
print("=" * 60)
phishing = df[df['label']==1]
print(f"SPF Pass Rate: {phishing['spf_pass'].mean():.2%}")
print(f"DKIM Pass Rate: {phishing['dkim_pass'].mean():.2%}")
print(f"DMARC Pass Rate: {phishing['dmarc_pass'].mean():.2%}")
print(f"Most common ESP: {phishing['esp'].value_counts().head(3).to_dict()}")

print("\n" + "=" * 60)
print("SAMPLE BENIGN EMAIL")
print("=" * 60)
sample_benign = benign.iloc[0]
print(f"Subject: {sample_benign['subject']}")
print(f"SPF: {sample_benign['spf_pass']}, DKIM: {sample_benign['dkim_pass']}, DMARC: {sample_benign['dmarc_pass']}")
print(f"ESP: {sample_benign['esp']}")

print("\n" + "=" * 60)
print("SAMPLE PHISHING EMAIL")
print("=" * 60)
sample_phishing = phishing.iloc[0]
print(f"Subject: {sample_phishing['subject']}")
print(f"SPF: {sample_phishing['spf_pass']}, DKIM: {sample_phishing['dkim_pass']}, DMARC: {sample_phishing['dmarc_pass']}")
print(f"ESP: {sample_phishing['esp']}")
