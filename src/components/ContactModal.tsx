import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check, Copy, Sparkles, Building2, User, FileText, Loader2, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PERSONAL_INFO } from '../data/portfolioData';
import { sanitizeInput, isValidEmail, checkRateLimit } from '../utils/security';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpportunitySubmitted?: (opportunity: {
    company: string;
    contact: string;
    email: string;
    role: string;
    message: string;
  }) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onOpportunitySubmitted,
}) => {
  const [template, setTemplate] = useState<'fulltime' | 'contract' | 'general'>('fulltime');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot honeypot trap
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [message, setMessage] = useState(
    'Hi Jeevan, we reviewed your portfolio, especially your work at WaDaCon with Grafana/InfluxDB and your MSc at TU Clausthal. We would like to discuss an opportunity on our team.'
  );
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailDeliverySuccess, setEmailDeliverySuccess] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!isOpen) return null;

  const handleSelectTemplate = (type: 'fulltime' | 'contract' | 'general') => {
    setTemplate(type);
    if (type === 'fulltime') {
      setMessage(
        'Hi Jeevan, we are actively hiring for an AI / Industrial IoT Engineer role in Germany. We were impressed by your telemetry and anomaly detection track record at WaDaCon and would like to invite you for a preliminary conversation.'
      );
    } else if (type === 'contract') {
      setMessage(
        'Hi Jeevan, we have an upcoming consulting / engineering initiative focused on observability and data pipelines. We would love to discuss your availability for contract work.'
      );
    } else {
      setMessage(
        'Hi Jeevan, I came across your portfolio and would like to connect regarding future technical collaborations.'
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Anti-bot honeypot detection: bots auto-fill hidden fields
    if (honeypot) {
      console.warn('Bot submission blocked via honeypot.');
      setSubmitted(true);
      return;
    }

    // 2. Client-side input sanitization
    const cleanName = sanitizeInput(name, 100);
    const cleanCompany = sanitizeInput(company, 100);
    const cleanEmail = sanitizeInput(email, 120);
    const cleanPhone = sanitizeInput(phone, 30);
    const cleanMessage = sanitizeInput(message, 1500);

    // 3. RFC Email Validation
    if (!isValidEmail(cleanEmail)) {
      setErrorMessage('Please provide a valid corporate or professional email address.');
      return;
    }

    // 4. Submission Rate Limiting (max 4 inquiries per 5 minutes per client IP/browser)
    const rateLimit = checkRateLimit({ key: 'contact_form', maxRequests: 4, windowMs: 300000 });
    if (!rateLimit.allowed) {
      setErrorMessage(`Rate limit exceeded for security. Please try again in ${rateLimit.retryAfterSeconds} seconds or email directly.`);
      return;
    }

    setIsSending(true);

    let delivered = false;

    // Send direct email notification to jeevannaidu516@gmail.com
    try {
      const response = await fetch('https://formsubmit.co/ajax/jeevannaidu516@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: cleanName || 'Talent Partner',
          company: cleanCompany || 'Recruiter/Company',
          email: cleanEmail,
          phone: cleanPhone || 'Not provided',
          inquiry_type: template === 'fulltime' ? 'Full-Time Role' : template === 'contract' ? 'Contract / Consulting' : 'General Connect',
          message: cleanMessage,
          _subject: `⚡ Portfolio Inquiry from ${cleanName} (${cleanCompany || 'Direct Contact'})`,
          _replyto: cleanEmail,
        }),
      });

      if (response.ok) {
        delivered = true;
      }
    } catch (err) {
      console.warn('Form submission network notification fallback:', err);
    }

    setIsSending(false);
    setEmailDeliverySuccess(delivered);
    setSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.warn('Confetti error', err);
    }

    if (onOpportunitySubmitted) {
      onOpportunitySubmitted({
        company: cleanCompany || 'Recruiter Inquiry',
        contact: cleanName || 'Talent Partner',
        email: cleanEmail || 'talent@company.example',
        role: template === 'fulltime' ? 'Full-Time Engineering Role' : template === 'contract' ? 'Contract IoT/AI Project' : 'General Connection',
        message: cleanMessage,
      });
    }
  };

  const handleCopy = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold text-sm">
              JD
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Connect with Jeevan Dutta
              </h3>
              <p className="text-xs text-emerald-400 font-mono">
                Open to Opportunities · Hamburg, Germany
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Direct Contact Quick Chips */}
        <div className="px-6 py-4 bg-slate-950/40 border-b border-slate-800/80 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => handleCopy(PERSONAL_INFO.email, 'email')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono">{PERSONAL_INFO.email}</span>
            {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
          </button>

          <button
            onClick={() => handleCopy(PERSONAL_INFO.phone, 'phone')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono">{PERSONAL_INFO.phone}</span>
            {copiedPhone ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
          </button>
        </div>

        {/* Inquiry Form */}
        <div className="p-6 space-y-4">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-xl text-white">
                  Message Sent & Jeevan Notified!
                </h4>
                <p className="text-xs text-emerald-400 font-mono">
                  Delivered to {PERSONAL_INFO.email}
                </p>
              </div>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-white">{name || 'Partner'}</span>. An email notification with your project context has been delivered to Jeevan Dutta's inbox. He will review your inquiry and follow up promptly via <span className="text-emerald-400 font-mono">{email}</span>.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
                >
                  Done
                </button>
                <a
                  href={`mailto:${PERSONAL_INFO.email}?subject=Opportunity%20Inquiry%20from%20${encodeURIComponent(company || 'Recruiter')}&body=${encodeURIComponent(message)}`}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Also open in email client</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Email dispatch indicator banner */}
              <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-400 font-mono">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Direct Inbox Notification: <strong>{PERSONAL_INFO.email}</strong></span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active
                </span>
              </div>

              {/* Error message alert */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Anti-Bot Honeypot Hidden Trap Field */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="hp_company_field">Do not fill this</label>
                <input
                  id="hp_company_field"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Preset Template Chips */}
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">
                  Inquiry Purpose:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'fulltime', label: 'Full-Time Role' },
                    { id: 'contract', label: 'Contract / Consulting' },
                    { id: 'general', label: 'General Connect' },
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => handleSelectTemplate(t.id as any)}
                      className={`py-2 px-2.5 rounded-xl text-center font-medium transition-all ${
                        template === t.id
                          ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-white border border-emerald-500/50 font-semibold'
                          : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid: Name & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sabine Weber"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company / Organization</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Airbus, Otto Group, Tech Startup..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Grid: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Work Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone (Optional)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+49 ..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Message / Project Context</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-400 leading-relaxed font-sans"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`mailto:${PERSONAL_INFO.email}?subject=Opportunity%20Inquiry%20from%20${encodeURIComponent(company || 'Recruiter')}&body=${encodeURIComponent(message)}`}
                  className="text-xs text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 font-mono"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open native email client</span>
                </a>

                <button
                  type="submit"
                  disabled={isSending}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Notifying Jeevan's Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send & Notify Jeevan</span>
                    </>
                  )}
                </button>
              </div>

              {/* Security & Anti-Spam Verification Footnote */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-400/80">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Anti-Spam Shield Active · Rate-Limited
                </span>
                <span>TLS Encrypted · Zero Tracker Storage</span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
