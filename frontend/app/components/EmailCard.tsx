import React from 'react';
import { motion } from 'framer-motion';
import { Server, Clock, Shield, ArrowRight } from 'lucide-react';

interface EmailCardProps {
  email: {
    _id: string;
    subject: string;
    receivingChain: string[];
    esp: string;
    createdAt: string;
  };
}

export default function EmailCard({ email }: EmailCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 mb-4 glass"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-accent flex items-center gap-2">
          <Shield size={20} />
          {email.subject}
        </h3>
        <span className="text-sm text-muted flex items-center gap-2">
          <Clock size={14} />
          {new Date(email.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm text-muted mb-2 uppercase tracking-wider">ESP Provider</h4>
          <div className="badge badge-medium inline-flex items-center gap-2">
            <Server size={14} />
            {email.esp}
          </div>
        </div>

        <div>
          <h4 className="text-sm text-muted mb-2 uppercase tracking-wider">Receiving Chain</h4>
          <div className="flex flex-col gap-2">
            {email.receivingChain.length > 0 ? (
              email.receivingChain.map((server, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-500" style={{ background: 'var(--accent-primary)' }}></span>
                  <span className="font-mono">{server}</span>
                  {index < email.receivingChain.length - 1 && (
                    <ArrowRight size={12} className="text-muted" />
                  )}
                </div>
              ))
            ) : (
              <span className="text-muted italic">No chain data</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
