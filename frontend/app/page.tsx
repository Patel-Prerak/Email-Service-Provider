'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Search,
  Mail,
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Terminal
} from 'lucide-react';
import EmailCard from './components/EmailCard';
import MalwareCard from './components/MalwareCard';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002';

interface MalwareAnalysis {
  is_phishing: boolean;
  confidence: number;
  risk_level: string;
  message: string;
}

interface AnalyzedEmail {
  _id: string;
  subject: string;
  receivingChain: string[];
  esp: string;
  createdAt: string;
  malwareResult?: MalwareAnalysis;
}

export default function Home() {
  const [emails, setEmails] = useState<AnalyzedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [testEmail, setTestEmail] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'header' | 'malware'>('header');
  const [manualAnalysisEmail, setManualAnalysisEmail] = useState('');
  const [manualAnalysisLoading, setManualAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MalwareAnalysis | null>(null);

  useEffect(() => {
    fetchTestEmail();
    fetchEmails();
    const interval = setInterval(fetchEmails, 30000);
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
      const emailsData = await response.json();
      setEmails(emailsData);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualAnalysis = async () => {
    if (!manualAnalysisEmail) return;
    setManualAnalysisLoading(true);
    setAnalysisResult(null);
    try {
      const response = await fetch(`${BACKEND_URL}/analyze-malware`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: manualAnalysisEmail,
          body: '',
          sender: 'manual-scan@localhost',
          headers: '',
          attachments: [],
          receivingChain: 'localhost',
          esp: 'gmail',
          spfPass: true,
          dkimPass: true,
          dmarcPass: true,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing email:', error);
      alert('Error analyzing email. Check console for details.');
    } finally {
      setManualAnalysisLoading(false);
    }
  };

  // Stats
  const totalEmails = emails.length;
  const phishingCount = emails.filter(e => e.malwareResult?.is_phishing).length;
  const safeCount = emails.filter(e => e.malwareResult && !e.malwareResult.is_phishing).length;

  return (
    <div className="container min-h-screen pb-20">
      {/* Header Section */}
      <header className="flex flex-col items-center justify-center py-12 mb-8 relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
            style={{ background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Email Analysis Suite
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Advanced Header Analysis & AI-Powered Malware Detection
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-4xl">
          <StatCard
            icon={<Mail className="text-blue-400" />}
            label="Total Analyzed"
            value={totalEmails}
            delay={0.1}
          />
          <StatCard
            icon={<Shield className="text-green-400" />}
            label="Safe Emails"
            value={safeCount}
            delay={0.2}
          />
          <StatCard
            icon={<AlertTriangle className="text-red-400" />}
            label="Threats Detected"
            value={phishingCount}
            delay={0.3}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto">
        {/* Tabs */}
        <div className="flex justify-center mb-8 bg-slate-900/50 p-1 rounded-xl inline-flex mx-auto backdrop-blur-sm border border-white/5">
          <TabButton
            active={activeTab === 'header'}
            onClick={() => setActiveTab('header')}
            icon={<Search size={18} />}
            label="Header Analysis"
          />
          <TabButton
            active={activeTab === 'malware'}
            onClick={() => setActiveTab('malware')}
            icon={<Activity size={18} />}
            label="Malware Detection"
          />
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'header' ? (
            <motion.div
              key="header"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass p-6 rounded-xl mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Terminal className="text-accent" />
                  Live Header Inspector
                </h2>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-black/30 p-4 rounded-lg border border-white/5">
                  <div className="flex-1">
                    <div className="text-sm text-muted mb-1">Test Email Address</div>
                    <code className="text-green-400 font-mono bg-black/50 px-3 py-1 rounded">
                      {testEmail || 'Loading...'}
                    </code>
                  </div>
                  <div className="text-sm text-muted text-right">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      System Active
                    </div>
                    <div className="text-xs mt-1">Auto-refreshing every 30s</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="animate-spin mx-auto text-accent mb-4" size={32} />
                    <p className="text-muted">Analyzing incoming traffic...</p>
                  </div>
                ) : (
                  emails.map(email => <EmailCard key={email._id} email={email} />)
                )}
                {!loading && emails.length === 0 && (
                  <EmptyState message="No emails analyzed yet. Send a test email to begin." />
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="malware"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Manual Analysis Card */}
              <div className="glass p-6 rounded-xl mb-8 border-l-4 border-l-red-500">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="text-red-500" />
                  Manual Threat Scanner
                </h2>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={manualAnalysisEmail}
                    onChange={(e) => setManualAnalysisEmail(e.target.value)}
                    placeholder="Enter email subject or content to scan..."
                    className="input flex-1"
                  />
                  <button
                    onClick={handleManualAnalysis}
                    disabled={manualAnalysisLoading || !manualAnalysisEmail}
                    className="btn btn-danger"
                  >
                    {manualAnalysisLoading ? <RefreshCw className="animate-spin" /> : <Search />}
                    Scan Now
                  </button>
                </div>

                {/* Analysis Result */}
                <AnimatePresence>
                  {analysisResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 bg-black/20 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {analysisResult.is_phishing ? (
                            <AlertTriangle className="text-red-500" size={24} />
                          ) : (
                            <CheckCircle className="text-green-500" size={24} />
                          )}
                          <div>
                            <div className="font-bold text-lg">
                              {analysisResult.is_phishing ? 'THREAT DETECTED' : 'SAFE CONTENT'}
                            </div>
                            <div className="text-sm text-muted">{analysisResult.message}</div>
                          </div>
                        </div>
                        <div className={`badge ${analysisResult.risk_level === 'CRITICAL' ? 'badge-critical' :
                            analysisResult.risk_level === 'HIGH' ? 'badge-high' :
                              analysisResult.risk_level === 'MEDIUM' ? 'badge-medium' :
                                'badge-low'
                          }`}>
                          {analysisResult.risk_level} RISK
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${analysisResult.confidence * 100}%`,
                            background: analysisResult.is_phishing ? '#ef4444' : '#10b981'
                          }}
                        />
                      </div>
                      <div className="text-right text-xs text-muted mt-1">
                        Confidence: {(analysisResult.confidence * 100).toFixed(1)}%
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-muted mb-4 pl-2 border-l-2 border-accent-primary">Recent Scans</h3>
                {emails.filter(e => e.malwareResult).map(email => (
                  <MalwareCard key={email._id} email={email} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// Sub-components for cleaner file
function StatCard({ icon, label, value, delay }: { icon: React.ReactNode, label: string, value: number, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass p-6 rounded-xl flex items-center gap-4"
    >
      <div className="p-3 bg-white/5 rounded-lg">{icon}</div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted">{label}</div>
      </div>
    </motion.div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${active
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
        : 'text-muted hover:text-white hover:bg-white/5'
        }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl">
      <Mail className="mx-auto text-muted mb-4 opacity-50" size={48} />
      <p className="text-muted">{message}</p>
    </div>
  );
}
