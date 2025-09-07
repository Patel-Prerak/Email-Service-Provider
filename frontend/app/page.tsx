'use client';

import { useEffect, useState } from 'react';
import styles from "./page.module.css";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

interface AnalyzedEmail {
  _id: string;
  subject: string;
  receivingChain: string[];
  esp: string;
  createdAt: string;
}

export default function Home() {
  const [emails, setEmails] = useState<AnalyzedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [testEmail, setTestEmail] = useState<string>('');

  useEffect(() => {
    fetchTestEmail();
    fetchEmails();
    const interval = setInterval(fetchEmails, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchTestEmail = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/test-email`);
      const data = await response.json();
      setTestEmail(data.email);
    } catch (error) {
      console.error('Error fetching test email:', error);
    }
  };

  const fetchEmails = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/emails`);
      const data = await response.json();
      setEmails(data);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
          background: 'linear-gradient(135deg, #000000ff 0%, #000000ff 100%)',
          color: 'white',
          
          borderRadius: '2px',
          margin: '1px 0',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
    <div style={{
          background: 'linear-gradient(135deg, #868686ff 10%, #222223ff 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          margin: '20px 0',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
      <main className={styles.main}>
        <h1 style={{ textAlign: "center", fontFamily: "Times New Roman, Times, serif" }}>
          📧 Email Analyzer
        </h1>
        <p style={{ textAlign: "center", fontFamily: "Times New Roman, Times, serif" }}>
          Discover the journey your emails take through the internet
        </p>

        {/* Test  Section */}
        <div style={{
          background: 'linear-gradient(135deg, #000000ff 0%, #6d6d6dff 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          
          boxShadow: '0 4px 6px rgba(114, 111, 111, 0.1)'
        }}>
          <h2 style={{ textAlign: "center", fontFamily: "Times New Roman, Times, serif" }}>How to Test</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <strong>📧 Send email to:</strong>
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '10px',
                borderRadius: '5px',
                fontFamily: 'monospace',
                marginTop: '5px',
                wordBreak: 'break-all'
              }}>
                {testEmail || 'Loading...'}
              </div>
            </div>
            <div>
              <strong>Subject format:</strong>
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '10px',
                borderRadius: '5px',
                fontFamily: 'monospace',
                marginTop: '5px'
              }}>
                analyzer-[your-test-name]
              </div>
            </div>
            <div>
              
              <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                <li>System checks for new emails every 30 seconds</li>
                <li>Extracts the receiving chain from email headers</li>
                <li>Detects the Email Service Provider (ESP)</li>
                <li>Displays results in real-time below</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 2s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p>Loading analyzed emails...</p>
          </div>
        ) : (
          <div>
            <h2>Analyzed Emails ({emails.length})</h2>
            {emails.length === 0 ? (
              <div style={{
                background: 'linear-gradient(135deg, #000000ff 0%, #6d6d6dff 100%)',
                padding: '30px',
                borderRadius: '10px',
                textAlign: 'center',
                border: '2px dashed #050708ff'
              }}>
                <h3>Ready to Analyze!</h3>
                <p>Send a test email using the instructions above to see the analysis results.</p>
                <p><em>The system will automatically detect and analyze emails with subjects starting with "analyzer-"</em></p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {emails.map((email) => (
                  <div key={email._id} style={{
                    border: '1px solid #c5cdd4ff',
                    borderRadius: '10px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, #000000ff 0%, #6d6d6dff 100%)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s'
                  }}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#acb2b7ff' }}>
                      📧 {email.subject}
                    </h3>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '15px' }}>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <h4 style={{ color: '#aeb0b3ff', margin: '0 0 10px 0' }}> Email Service Provider</h4>
                        <div style={{
                          background: '#e0e6edff',
                          color: '#0c0d0eff',
                          padding: '8px 12px',
                          borderRadius: '20px',
                          display: 'inline-block',
                          fontWeight: 'bold'
                        }}>
                          {email.esp}
                        </div>
                      </div>

                      <div style={{ flex: '2', minWidth: '300px' }}>
                        <h4 style={{ color: '#6c757d', margin: '0 0 10px 0' }}>Receiving Chain</h4>
                        <div style={{
                          background: 'linear-gradient(135deg, #000000ff 0%, #6d6d6dff 100%)',
                          padding: '15px',
                          borderRadius: '8px',
                          border: '1px solid #dee2e6'
                        }}>
                          {email.receivingChain.length > 0 ? (
                            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                              {email.receivingChain.map((server, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                  <div style={{
                                    background: '#e0e6edff',
                                    color: '#0c0d0eff',
                                    padding: '5px 10px',
                                    borderRadius: '15px',
                                    fontSize: '0.9em',
                                    fontWeight: 'bold'
                                  }}>
                                    {server}
                                  </div>
                                  {index < email.receivingChain.length - 1 && (
                                    <span style={{ margin: '0 10px', color: '#6c757d' }}>→</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p style={{ color: '#6c757d', margin: 0 }}>No receiving chain data available</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '10px', color: '#6c757d', fontSize: '0.9em' }}>
                      Analyzed at: {new Date(email.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
    </div>
  );
}
