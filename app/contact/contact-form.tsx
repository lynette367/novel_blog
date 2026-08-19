"use client";

import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate interactive submission feedback
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="contact-form-success">
        <div className="success-icon">✨</div>
        <h3>Thank You!</h3>
        <p>
          Your message has been sent successfully. We appreciate your feedback and will reply as soon as possible.
        </p>
        <button
          type="button"
          className="reset-btn"
          onClick={() => setSubmitted(false)}
        >
          Send Another Message
        </button>

        <style jsx>{`
          .contact-form-success {
            text-align: center;
            padding: 2.5rem 1rem;
          }
          .success-icon {
            font-size: 2.5rem;
            margin-bottom: 0.8rem;
          }
          .contact-form-success h3 {
            font-family: Georgia, serif;
            font-size: 1.5rem;
            color: #3d2b1a;
            margin: 0 0 0.6rem;
          }
          .contact-form-success p {
            color: #6b5240;
            font-size: 0.95rem;
            line-height: 1.6;
            margin: 0 0 1.5rem;
          }
          .reset-btn {
            background: transparent;
            border: 1px solid #8c5a2b;
            color: #8c5a2b;
            padding: 0.6rem 1.4rem;
            border-radius: 4px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s;
          }
          .reset-btn:hover {
            background: #8c5a2b;
            color: #fff;
          }
        `}</style>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h3 className="form-title">Send a Message</h3>

      <div className="form-group">
        <label htmlFor="name">Your Name / Handle</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="e.g. Reader123 (Optional)"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Your Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="your.email@example.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Topic / Category *</label>
        <select id="category" name="category" required defaultValue="general">
          <option value="general">❓ General Question / Inquiry</option>
          <option value="bug">🐛 Report Typo / Site Issue</option>
          <option value="collaboration">🤝 Collaboration / Licensing</option>
          <option value="feedback">💬 Feedback &amp; Suggestion</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="message">Message *</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Write your message here..."
        />
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? "Sending..." : "Send Message"}
      </button>

      <style jsx>{`
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .form-title {
          font-family: Georgia, serif;
          font-size: 1.3rem;
          font-weight: normal;
          color: #3d2b1a;
          margin: 0 0 0.4rem;
          padding-bottom: 0.6rem;
          border-bottom: 1px dashed #d4b896;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #4a3728;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.7rem 0.9rem;
          background: #ffffff;
          border: 1px solid #d4b896;
          border-radius: 4px;
          font-size: 0.93rem;
          color: #2c1f14;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #8c5a2b;
          box-shadow: 0 0 0 3px rgba(140,90,43,0.12);
        }
        .submit-btn {
          background: #3d2b1a;
          color: #f5ede0;
          border: none;
          padding: 0.8rem 1.6rem;
          border-radius: 4px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-top: 0.4rem;
        }
        .submit-btn:hover {
          background: #543b25;
        }
        .submit-btn:active {
          transform: scale(0.99);
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}
