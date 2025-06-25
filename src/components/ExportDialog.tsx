import React, { useState } from 'react';
import { Mail, FileSpreadsheet, X, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';
import { exportToExcel, exportToCSV } from '../utils/export';
import type { Personnel, BurnPlan } from '../types';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  personnel: Personnel[];
  burnPlan: BurnPlan;
  burnPlanHtml: string;
  costSummaryHtml: string;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  personnel,
  burnPlan,
  burnPlanHtml,
  costSummaryHtml,
}) => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Project Proposal Plan');
  const [notes, setNotes] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendEmail = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      setIsSending(true);
      
      const { data, error } = await supabase.functions.invoke('send-proposal', {
        body: {
          email,
          subject,
          notes,
          burnPlanHtml,
          costSummaryHtml,
        },
      });

      if (error) throw error;

      toast.success('Email sent successfully');
      onClose();
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast.error(error.message || 'Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      setIsVerifying(true);
      const { data, error } = await supabase.functions.invoke('verify-email', {
        body: { email }
      });

      if (error) throw error;

      toast.success('Test email sent successfully. Please check your inbox.');
    } catch (error: any) {
      console.error('Error verifying email:', error);
      toast.error(error.message || 'Failed to send test email');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="space-card w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg">Export Proposal Plan</h3>
          <button
            className="text-space-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-space-gray-200 mb-1">
              Email Address
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                className="space-input flex-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="recipient@example.com"
              />
              <button
                className="space-button-outline px-3 py-2 disabled:opacity-50"
                onClick={handleVerifyEmail}
                disabled={isVerifying}
                title="Send test email"
              >
                <Send size={18} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-space-gray-200 mb-1">
              Subject
            </label>
            <input
              type="text"
              className="space-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-space-gray-200 mb-1">
              Additional Notes
            </label>
            <textarea
              className="space-input min-h-[100px] resize-y"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional context or notes..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <button
              className="space-button flex items-center justify-center gap-2 disabled:opacity-50"
              onClick={handleSendEmail}
              disabled={isSending}
            >
              <Mail size={18} />
              {isSending ? 'Sending...' : 'Send Email'}
            </button>

            <button
              className="space-button flex items-center justify-center gap-2"
              onClick={() => exportToExcel(personnel, burnPlan)}
            >
              <FileSpreadsheet size={18} />
              Export to Excel
            </button>

            <button
              className="space-button-outline flex items-center justify-center gap-2"
              onClick={() => exportToCSV(personnel, burnPlan)}
            >
              <FileSpreadsheet size={18} />
              Export to CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;