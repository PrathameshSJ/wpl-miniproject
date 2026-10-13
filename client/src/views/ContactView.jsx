import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Star, Send, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../api';

export default function ContactView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Feedback & Suggestions',
    message: '',
    rating: 5,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiFetch('/contact', {
        method: 'POST',
        body: formData,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-16 max-w-5xl mx-auto">
      <div className="text-center max-w-xl mx-auto pt-4">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Get In Touch</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">
          Contact & Customer Feedback
        </h1>
        <p className="text-xs text-ink-muted mt-1.5">
          We’d love to hear about your bakery experience, catering inquiries, or custom cake requests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info Column */}
        <div className="md:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-surface-border shadow-xs space-y-6">
          <h3 className="font-serif font-bold text-xl text-ink">BakeEase Flagship</h3>

          <div className="space-y-4 text-xs text-ink-muted">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-ink text-sm">Bakery Address</p>
                <p className="mt-0.5 leading-relaxed">
                  122 Artisan Lane, Near Pali Hill, Bandra West, Mumbai 400050, Maharashtra, India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-ink text-sm">Phone Hotline</p>
                <p className="mt-0.5">+91 98765 43210 / +91 22 2640 8920</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-ink text-sm">Email Inquiries</p>
                <p className="mt-0.5">hello@bakeease.in / orders@bakeease.in</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-ink text-sm">Baking Hours</p>
                <p className="mt-0.5">Mon–Fri: 7:00 AM – 9:00 PM</p>
                <p>Sat–Sun: 8:00 AM – 10:00 PM</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-warm/80 border border-surface-border text-xs space-y-1">
            <p className="font-bold text-ink">⚡ Catering & Large Orders</p>
            <p className="text-ink-muted text-[11px] leading-relaxed">
              For weddings, corporate events, and custom dessert tables of 50+ guests, please email our head chef directly at catering@bakeease.in.
            </p>
          </div>
        </div>

        {/* Feedback Form Column */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-surface-border shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
                ✓
              </div>
              <h3 className="font-serif font-bold text-2xl text-ink">Thank you for your feedback!</h3>
              <p className="text-xs text-ink-muted max-w-sm mx-auto leading-relaxed">
                Your message has been sent directly to our artisan management team. We truly appreciate your time and review.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: 'Feedback & Suggestions',
                    message: '',
                    rating: 5,
                  });
                }}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-serif font-bold text-xl text-ink">Send Us a Message</h3>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  {error}
                </div>
              )}

              {/* Star rating selector */}
              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1">
                  How was your overall experience?
                </label>
                <div className="flex gap-1 items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 focus:outline-hidden hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formData.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-ink ml-2">
                    {formData.rating} of 5 Stars
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Priya Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border text-xs focus:outline-hidden focus:border-primary bg-surface-card"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border text-xs focus:outline-hidden focus:border-primary bg-surface-card"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border text-xs focus:outline-hidden focus:border-primary bg-surface-card"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border text-xs focus:outline-hidden focus:border-primary bg-surface-card"
                  >
                    <option value="Feedback & Suggestions">Feedback & Suggestions</option>
                    <option value="Custom Cake Inquiry">Custom Cake Inquiry</option>
                    <option value="Event Catering Quote">Event Catering Quote</option>
                    <option value="Order Support">Order Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share your thoughts, suggestions, or dietary questions..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border text-xs focus:outline-hidden focus:border-primary bg-surface-card"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-xs shadow-md shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Submitting...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
