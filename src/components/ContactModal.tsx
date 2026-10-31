import React, { useState, useRef, useEffect } from 'react';
import { Mail, Phone, Send, Check, Copy, Loader2, CheckCircle2, AlertCircle, X, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PERSONAL_INFO } from '../data/portfolioData';
import { sanitizeInput, isValidEmail, checkRateLimit } from '../utils/security';
import { useModalA11y } from '../services/useModalA11y';
import { copyText } from '../services/clientUtils';
import { ui } from '../services/uiClasses';

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

type Template = 'fulltime' | 'contract' | 'general';
type FieldErrors = Partial<Record<'name' | 'company' | 'email' | 'message', string>>;

const TEMPLATE_MESSAGES: Record<Template, string> = {
  fulltime:
    'Hi Jeevan, we are actively hiring for an AI / Industrial IoT Engineer role in Germany. We were impressed by your telemetry and anomaly detection track record at WaDaCon and would like to invite you for a preliminary conversation.',
  contract:
    'Hi Jeevan, we have an upcoming consulting / engineering initiative focused on observability and data pipelines. We would love to discuss your availability for contract work.',
  general: 'Hi Jeevan, I came across your portfolio and would like to connect regarding future technical collaborations.',
};

const TEMPLATE_LABELS: Record<Template, string> = {
  fulltime: 'Full-time role',
  contract: 'Contract / consulting',
  general: 'General',
};

const DEFAULT_MESSAGE =
  'Hi Jeevan, we reviewed your portfolio, especially your work at WaDaCon with Grafana/InfluxDB and your MSc at TU Clausthal. We would like to discuss an opportunity on our team.';

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onOpportunitySubmitted }) => {
  const [template, setTemplate] = useState<Template>('fulltime');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<'email' | 'phone' | null>(null);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const handleClose = () => {
    if (status === 'sending') return;
    onClose();
  };
  useModalA11y(isOpen, handleClose, dialogRef);

  // Reset success/error state each time the modal is reopened (keep typed fields).
  useEffect(() => {
    if (isOpen && status !== 'sending') {
      setStatus((s) => (s === 'success' ? 'idle' : s));
      setErrorMessage(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const mailtoHref = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(
    `Opportunity inquiry from ${company || 'a recruiter'}`
  )}&body=${encodeURIComponent(message)}`;

  const handleSelectTemplate = (type: Template) => {
    setTemplate(type);
    setMessage(TEMPLATE_MESSAGES[type]);
  };

  const validate = (cleanName: string, cleanCompany: string, cleanEmail: string, cleanMessage: string): FieldErrors => {
    const errs: FieldErrors = {};
    if (cleanName.length < 2) errs.name = 'Please enter your name.';
    if (cleanCompany.length < 2) errs.company = 'Please enter your company or organization.';
    if (!isValidEmail(cleanEmail)) errs.email = 'Please enter a valid email address.';
    if (cleanMessage.length < 10) errs.message = 'Please write a short message (at least 10 characters).';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Bots fill hidden fields — pretend success without sending.
    if (honeypot) {
      setStatus('success');
      return;
    }

    const cleanName = sanitizeInput(name, 100);
    const cleanCompany = sanitizeInput(company, 100);
    const cleanEmail = sanitizeInput(email, 120);
    const cleanPhone = sanitizeInput(phone, 30);
    const cleanMessage = sanitizeInput(message, 1500);

    const errs = validate(cleanName, cleanCompany, cleanEmail, cleanMessage);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstKey = Object.keys(errs)[0];
      dialogRef.current?.querySelector<HTMLElement>(`#contact-${firstKey}`)?.focus();
      return;
    }

    const rateLimit = checkRateLimit({ key: 'contact_form', maxRequests: 4, windowMs: 300000 });
    if (!rateLimit.allowed) {
      setErrorMessage(`Too many messages in a short time. Please try again in ${rateLimit.retryAfterSeconds}s, or email directly.`);
      setStatus('error');
      return;
    }

    setStatus('sending');

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${PERSONAL_INFO.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          company: cleanCompany,
          email: cleanEmail,
          phone: cleanPhone || 'Not provided',
          inquiry_type: TEMPLATE_LABELS[template],
          message: cleanMessage,
          _subject: `Portfolio inquiry from ${cleanName} (${cleanCompany})`,
          _replyto: cleanEmail,
          _template: 'table',
          _captcha: 'false',
          _honey: '',
        }),
      });

      // formsubmit returns { success: "true" | "false", message } — HTTP 200 alone isn't proof of delivery.
      let data: { success?: string | boolean; message?: string } = {};
      try {
        data = await response.json();
      } catch {
        // non-JSON body
      }
      const delivered = response.ok && (data.success === true || data.success === 'true');
      if (!delivered) {
        throw new Error(data.message || `Request failed (${response.status})`);
      }

      setStatus('success');
      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 }, colors: ['#10b981', '#34d399', '#a7f3d0'] });
      } catch {
        // ignore
      }

      if (onOpportunitySubmitted) {
        onOpportunitySubmitted({
          company: cleanCompany,
          contact: cleanName,
          email: cleanEmail,
          role:
            template === 'fulltime'
              ? 'Full-Time Engineering Role'
              : template === 'contract'
                ? 'Contract IoT/AI Project'
                : 'General Connection',
          message: cleanMessage,
        });
        // Let an already-mounted PortfolioTracker pick up the new entry.
        window.dispatchEvent(new Event('jeevan-pipeline-updated'));
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        `Your message could not be sent${err instanceof Error && err.message ? ` (${err.message})` : ''}. You can retry, or email ${PERSONAL_INFO.email} directly.`
      );
    }
  };

  const handleCopy = async (text: string, type: 'email' | 'phone') => {
    if (await copyText(text)) {
      setCopied(type);
      window.setTimeout(() => setCopied(null), 2000);
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setErrorMessage(null);
    setFieldErrors({});
  };

  const fieldClass = (key: keyof FieldErrors) =>
    `${ui.input} ${fieldErrors[key] ? '!border-rose-500/70 focus:!ring-rose-500/30' : ''}`;

  const FieldError = ({ id }: { id: keyof FieldErrors }) =>
    fieldErrors[id] ? (
      <p id={`contact-${id}-error`} className="mt-1 text-xs text-rose-400">
        {fieldErrors[id]}
      </p>
    ) : null;

  return (
    <div className={ui.overlay} onMouseDown={(e) => e.target === e.currentTarget && handleClose()}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        tabIndex={-1}
        className={`${ui.panel} max-w-xl overflow-hidden`}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-800 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 id="contact-modal-title" className="font-display font-bold text-lg text-white">
              Contact Jeevan Dutta
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Open to opportunities · Hamburg, Germany</p>
          </div>
          <button type="button" onClick={handleClose} className={ui.iconBtn} aria-label="Close contact form">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Direct contact */}
        <div className="px-5 sm:px-6 py-3 border-b border-slate-800 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleCopy(PERSONAL_INFO.email, 'email')}
            className={`${ui.btnGhost} border border-slate-800 max-w-full`}
            aria-label={`Copy email address ${PERSONAL_INFO.email}`}
          >
            <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-mono truncate">{PERSONAL_INFO.email}</span>
            {copied === 'email' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
          <button
            type="button"
            onClick={() => handleCopy(PERSONAL_INFO.phone, 'phone')}
            className={`${ui.btnGhost} border border-slate-800`}
            aria-label={`Copy phone number ${PERSONAL_INFO.phone}`}
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono">{PERSONAL_INFO.phone}</span>
            {copied === 'phone' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {status === 'success' ? (
            <div className="text-center py-6 space-y-4" role="status">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-xl text-white">Message sent</h4>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  Thank you{name ? `, ${name}` : ''}. Jeevan will get back to you at{' '}
                  <span className="text-emerald-400 font-mono">{email}</span>.
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2">
                <button type="button" onClick={onClose} className={ui.btnPrimary} data-autofocus>
                  Done
                </button>
                <button type="button" onClick={resetForm} className={ui.btnSecondary}>
                  <RotateCcw className="w-3.5 h-3.5" />
                  Send another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {status === 'error' && errorMessage && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1.5">
                    <p>{errorMessage}</p>
                    <a href={mailtoHref} className="inline-flex items-center gap-1 font-semibold text-rose-100 underline underline-offset-2">
                      <Mail className="w-3 h-3" /> Open in email app instead
                    </a>
                  </div>
                </div>
              )}

              {/* Honeypot */}
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

              <fieldset>
                <legend className={ui.label}>Inquiry type</legend>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(TEMPLATE_LABELS) as Template[]).map((t) => (
                    <button
                      type="button"
                      key={t}
                      aria-pressed={template === t}
                      onClick={() => handleSelectTemplate(t)}
                      className={`${ui.chip(template === t)} justify-center !px-2 text-center !whitespace-normal leading-tight`}
                    >
                      {TEMPLATE_LABELS[t]}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="contact-name" className={ui.label}>
                    Your name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sabine Weber"
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                    className={fieldClass('name')}
                  />
                  <FieldError id="name" />
                </div>
                <div>
                  <label htmlFor="contact-company" className={ui.label}>
                    Company *
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    autoComplete="organization"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company or organization"
                    aria-invalid={!!fieldErrors.company}
                    aria-describedby={fieldErrors.company ? 'contact-company-error' : undefined}
                    className={fieldClass('company')}
                  />
                  <FieldError id="company" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="contact-email" className={ui.label}>
                    Work email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                    className={fieldClass('email')}
                  />
                  <FieldError id="email" />
                </div>
                <div>
                  <label htmlFor="contact-phone" className={ui.label}>
                    Phone <span className="font-normal text-slate-500">(optional)</span>
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+49 …"
                    className={ui.input}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className={ui.label}>
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  aria-invalid={!!fieldErrors.message}
                  aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
                  className={`${fieldClass('message')} leading-relaxed resize-y`}
                />
                <FieldError id="message" />
              </div>

              <div className="pt-1 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                <a href={mailtoHref} className={`${ui.btnGhost} justify-center`}>
                  <Mail className="w-3.5 h-3.5" />
                  Use my email app
                </a>
                <button type="submit" disabled={status === 'sending'} className={ui.btnPrimary}>
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Sending…
                    </>
                  ) : status === 'error' ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      Try again
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send message
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
