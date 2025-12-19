<<<<<<< HEAD
# 📧 Email Analysis Suite
=======
# 📧 Email Analyzer
Want to Watch: [ESP](https://email-service-provider-w82a.vercel.app/)
<img width="1893" height="885" alt="image" src="https://github.com/user-attachments/assets/8a2ed160-cf79-45d5-aba6-7fd25049deb2" />
>>>>>>> 0489496559953400320a550d8b5865d1d80afbbd

A professional-grade **Email Header Analysis and Malware Detection System** designed to identify phishing attempts, analyze email routing, and detect malicious content with high accuracy. This full-stack application combines real-time IMAP monitoring, advanced header forensics, and an AI-powered risk assessment engine.

![Email Analysis Suite Dashboard](https://via.placeholder.com/800x400?text=Email+Analysis+Suite+Dashboard)

---

## 🚀 Features

### 🛡️ Malware & Phishing Detection
- **AI-Powered Analysis**: Utilizes a trained Machine Learning model (Logistic Regression) to detect phishing attempts with high precision.
  > **Why Logistic Regression?**
  > We chose Logistic Regression over more complex models (like Neural Networks or Random Forests) because:
  > 1.  **Interpretability**: In cybersecurity, understanding *why* an email is flagged is crucial. Logistic Regression provides clear feature weights, allowing us to explain exactly which words or headers contributed to the risk score.
  > 2.  **Speed & Efficiency**: It requires minimal computational power, enabling real-time analysis of incoming emails without latency.
  > 3.  **Reliability on Text Data**: When combined with TF-IDF vectorization, it performs exceptionally well on high-dimensional text data, often matching the accuracy of more complex models for binary classification tasks like Phishing vs. Benign.
- **Multi-Feature Inspection**: Analyzes 16+ data points including SPF, DKIM, DMARC status, subject lines, body content, and header anomalies.
- **Real-time Risk Scoring**: Categorizes emails into 4 risk levels: **LOW**, **MEDIUM**, **HIGH**, and **CRITICAL**.
- **Confidence Metrics**: Provides a precise confidence score (0-100%) for every analysis.

### 📨 Advanced Header Forensics
- **Route Visualization**: Extracts and visualizes the full receiving chain of email servers to trace the origin.
- **ESP Detection**: Automatically identifies the Email Service Provider (e.g., Gmail, Outlook, Yahoo, SendGrid).
- **Authentication Checks**: Verifies SPF, DKIM, and DMARC records to prevent spoofing.

### 💻 Modern Dashboard
- **Premium UI/UX**: Built with **Next.js 15**, **Tailwind CSS v4**, and **Framer Motion** for a sleek, dark-themed experience.
- **Live Monitoring**: Auto-refreshes every 30 seconds to show incoming emails in real-time.
- **Manual Scanner**: Includes a tool to manually scan text or subject lines for potential threats.
- **Interactive Visuals**: Glassmorphism effects, smooth animations, and color-coded risk indicators.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4, CSS Modules
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: MongoDB (Mongoose)
- **Email Protocols**: IMAP (imap-simple), Mailparser
- **Scheduling**: @nestjs/schedule

### AI Engine
- **Language**: Python 3.8+
- **Libraries**: Scikit-learn, Pandas, NumPy, Joblib
- **Model**: Logistic Regression Pipeline (TF-IDF + Header Features)

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: v18 or higher
- **Python**: v3.8 or higher
- **MongoDB**: Local instance or MongoDB Atlas URI
- **Email Account**: An IMAP-enabled email account (e.g., Gmail with App Password)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd email-analyzer
```

### 2. Backend Setup
The backend handles email fetching and coordinates with the AI engine.

```bash
cd backend
npm install

# Create .env file
# Copy the example below and fill in your credentials
```

**backend/.env**:
```env
IMAP_USER=your-email@gmail.com
IMAP_PASSWORD=your-app-password
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_TLS=true
MONGODB_URI=mongodb://localhost:27017/email-analyzer
PORT=3002
```

Start the backend:
```bash
npm run start:dev
```
*The backend runs on `http://localhost:3002`*

### 3. AI Engine Setup
The Python engine performs the actual malware detection.

```bash
# Return to root directory
cd ..

# Activate virtual environment (Windows)
& ./.venv/Scripts/Activate.ps1
# OR (Linux/Mac)
# source .venv/bin/activate

# Install dependencies
pip install -r mail-malware-detection/requirements.txt

# (Optional) Retrain the model
python mail-malware-detection/src/train_with_headers.py --data mail-malware-detection/data/raw/phishing_dataset.csv --model-out mail-malware-detection/models/phishing_pipeline.joblib
```

### 4. Frontend Setup
The frontend provides the user interface.

```bash
cd frontend
npm install

# Create .env.local file
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:3002" > .env.local

# Start the dev server
npm run dev
```
*The frontend runs on `http://localhost:3000`*

---

## 📖 Usage Guide

### Automatic Analysis
1.  Ensure both Backend and Frontend servers are running.
2.  Send an email to your configured IMAP account.
    *   **Note**: For the system to pick it up automatically, the subject line must start with `analyzer-` (e.g., `analyzer-Test Email`).
3.  Wait approx. 30 seconds for the system to poll the inbox.
4.  The email will appear on the dashboard with its Risk Score and Header Analysis.

### Manual Scanning
1.  Go to the **"Malware Detection"** tab on the dashboard.
2.  Enter a subject line or email body text into the "Manual Threat Scanner" input.
3.  Click **"Scan Now"**.
4.  The AI model will evaluate the text and return a risk assessment immediately.

---

## 📂 Project Structure

```
email-analyzer/
├── backend/                 # NestJS API Server
│   ├── src/
│   │   ├── app.controller.ts      # API Endpoints
│   │   ├── app.service.ts         # Business Logic
│   │   ├── imap/                  # IMAP Connection Logic
│   │   └── malware-detection/     # Service to call Python script
│   └── ...
├── frontend/                # Next.js Dashboard
│   ├── app/
│   │   ├── components/      # UI Components (EmailCard, MalwareCard)
│   │   ├── globals.css      # Tailwind & Global Styles
│   │   └── page.tsx         # Main Dashboard Page
│   └── ...
├── mail-malware-detection/  # Python ML Engine
│   ├── src/                 # Training & Prediction scripts
│   ├── models/              # Trained .joblib models
│   └── data/                # Training datasets
└── ...
```

---

## 🔧 Troubleshooting

**1. "Turbopack error" in Frontend**
   - We have disabled Turbopack by default. Ensure you run `npm run dev` (which uses Webpack).
   - If issues persist, delete the `.next` folder and restart.

**2. Backend cannot connect to IMAP**
   - Verify your `IMAP_USER` and `IMAP_PASSWORD`.
   - For Gmail, you **must** use an [App Password](https://support.google.com/accounts/answer/185833), not your login password.
   - Ensure IMAP is enabled in your Gmail settings.

**3. Python script fails**
   - Ensure the virtual environment is activated.
   - Check that `scikit-learn` version matches the one used to train the model.
   - Verify the path to the `.joblib` model file in the backend service.

---

## 🔒 Security & Disclaimer
This tool is intended for **educational and defensive security purposes only**.
- Do not use this tool to analyze emails you do not own or have permission to access.
- The AI model provides probabilistic results and should not be the sole factor in security decisions.

---

## 📄 License
This project is UNLICENSED.
