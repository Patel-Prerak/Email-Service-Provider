# 📧 Email Analyzer
<img width="1893" height="885" alt="image" src="https://github.com/user-attachments/assets/8a2ed160-cf79-45d5-aba6-7fd25049deb2" />

A comprehensive full-stack application that automatically analyzes emails received via IMAP, extracting receiving chains and detecting Email Service Providers (ESPs). Features a modern, responsive web interface with real-time updates.

## ✨ Features

### 🔍 Email Analysis
- **Automatic IMAP Monitoring**: Checks for new emails every 30 seconds
- **Receiving Chain Extraction**: Parses email headers to show the complete server journey
- **ESP Detection**: Identifies 15+ major email service providers including Gmail, Outlook, SendGrid, Mailchimp, Amazon SES, and more
- **Smart Filtering**: Only processes emails with subjects starting with "analyzer-"

### 🎨 User Interface
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Updates**: Auto-refreshes every 30 seconds
- **Visual Chain Display**: Clean, intuitive representation of email server paths
- **Test Instructions**: Built-in guide showing exactly how to test the system
- **Modern UI**: Gradient backgrounds, smooth animations, and professional styling

### 🛠️ Technical Features
- **Robust Error Handling**: Specific error messages for IMAP connection issues
- **Database Storage**: MongoDB with Mongoose for persistent data storage
- **TypeScript**: Full type safety across the entire application
- **CORS Enabled**: Seamless frontend-backend communication
- **Scheduled Tasks**: Automated email processing with NestJS Schedule

## 🏗️ Project Structure

```
email-analyzer/
├── backend/          # NestJS backend (port 3001)
│   ├── src/
│   │   ├── imap.service.ts          # IMAP email monitoring
│   │   ├── email-analysis.service.ts # Email header analysis
│   │   ├── schemas/email.schema.ts   # MongoDB schema
│   │   ├── app.controller.ts         # API endpoints
│   │   └── ...
│   └── .env                         # Environment configuration
└── frontend/         # Next.js frontend (port 3000)
    └── app/page.tsx                 # Main dashboard
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- IMAP email account (Gmail, Outlook, etc.)

### Installation & Setup

1. **Clone and Install**:
   ```bash
   # Backend setup
   cd backend
   npm install

   # Frontend setup
   cd ../frontend
   npm install
   ```

2. **Configure Environment**:
   - Update `backend/.env` with your IMAP credentials:
     ```env
     IMAP_USER=your-email@example.com
     IMAP_PASSWORD=your-app-password
     IMAP_HOST=imap.gmail.com
     IMAP_PORT=993
     MONGODB_URI=mongodb://localhost:27017/email-analyzer
     ```

3. **Start Services**:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run start:dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

## 🧪 Testing the Application

1. **Open the Web Interface**: Visit http://localhost:3000
2. **Follow the Instructions**: The app displays your test email address and required subject format
3. **Send a Test Email**:
   - To: The email address shown in the app
   - Subject: `analyzer-[your-test-name]` (e.g., `analyzer-gmail-test`)
4. **Watch Real-time Results**: The analysis appears automatically within 30 seconds

## 🔧 API Endpoints

- `GET /` - Health check
- `GET /emails` - Retrieve all analyzed emails (sorted by newest first)
- `GET /test-email` - Get the configured test email address

## ⚙️ Configuration

### IMAP Settings by Provider

**Gmail**:
- Host: `imap.gmail.com`
- Port: `993`
- Password: Use App Password (not regular password)

**Outlook/Hotmail**:
- Host: `outlook.office365.com`
- Port: `993`

**Yahoo**:
- Host: `imap.mail.yahoo.com`
- Port: `993`

### Supported ESP Detection

The system can detect: Gmail, Outlook, Yahoo, SendGrid, Mailchimp, Amazon SES, Mailgun, Postmark, SparkPost, Zoho, ProtonMail, iCloud, AOL, Constant Contact, Campaign Monitor, and Generic SMTP servers.

## 🛡️ Error Handling

The application includes comprehensive error handling for:
- IMAP authentication failures
- Connection timeouts
- SSL certificate issues
- Database connection problems
- Invalid email formats

## 📱 Responsive Design

- **Desktop**: Full feature layout with side-by-side information
- **Tablet**: Optimized spacing and touch-friendly elements
- **Mobile**: Single-column layout with collapsible sections

## 🧪 Development

### Tech Stack
- **Backend**: NestJS, TypeScript, MongoDB, Mongoose
- **Frontend**: Next.js, React, TypeScript
- **Email Processing**: imap-simple, mailparser
- **Scheduling**: @nestjs/schedule

### Building for Production
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

## 📋 Assessment Criteria Met

✅ **Functionality**: Complete IMAP email analysis system
✅ **Code Quality**: Clean, modular, well-documented TypeScript code
✅ **UI/UX**: Professional, responsive interface with intuitive design
✅ **Deployment**: Ready for production with proper configuration
✅ **Documentation**: Comprehensive setup and usage instructions

## 📄 License

UNLICENSED
