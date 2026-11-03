"use client";

import { useState, type FormEvent } from "react";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
// Web3Forms access keys are public by design (they only allow sending to the
// inbox registered with the key), so it is safe to inline into the client bundle.
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

const TOPICS = [
  "General Inquiry",
  "Feedback / Suggestion",
  "Typo or Broken Chapter Report",
  "Copyright / DMCA Request",
  "Collaboration",
] as const;

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-[#f7c6d9] bg-[#fffafc] px-4 py-3 text-sm text-[#2b1f2d] placeholder:text-[#c9a3b3] outline-none transition focus:border-[#f4a7b9] focus:bg-white focus:ring-2 focus:ring-[#f7c6d9]/60 disabled:opacity-60";

const labelClass = "mb-1.5 block font-serif text-sm text-[#2b1f2d]";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: real users never fill this hidden field.
    if (data.get("botcheck")) return;

    if (!ACCESS_KEY) {
      setStatus("error");
      setErrorMessage("The contact form is not configured yet. Please try again later.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const topic = String(data.get("topic") ?? "General Inquiry");
    const payload = {
      access_key: ACCESS_KEY,
      subject: `[Cross The Line] ${topic}`,
      from_name: "Cross The Line Contact Form",
      name: data.get("name"),
      email: data.get("email"),
      topic,
      message: data.get("message"),
      botcheck: "",
    };

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { success?: boolean; message?: string };

      if (res.ok && json.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setErrorMessage(json.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-[#f7c6d9]/70 bg-white p-8 text-center shadow-sm"
      >
        <div className="mb-3 text-4xl">💌</div>
        <h3 className="mb-2 font-serif text-xl font-normal text-[#2b1f2d]">
          Thank you — message received!
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-[#302a2f]/80">
          We read every note and will get back to you by email as soon as we can.
        </p>
        <button
          type="button"
          id="contact-form-send-another"
          onClick={() => setStatus("idle")}
          className="rounded-full border border-[#f4a7b9] px-5 py-2 text-sm font-semibold text-[#d77a95] transition hover:bg-[#fdf0f4]"
        >
          Send another message
        </button>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#f7c6d9]/70 bg-white p-6 shadow-sm sm:p-8"
    >
      {/* Honeypot field (hidden from humans) */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            maxLength={100}
            autoComplete="name"
            placeholder="Your name or nickname"
            disabled={submitting}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            placeholder="you@example.com"
            disabled={submitting}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contact-topic" className={labelClass}>
            Topic
          </label>
          <select
            id="contact-topic"
            name="topic"
            defaultValue={TOPICS[0]}
            disabled={submitting}
            className={inputClass}
          >
            {TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className={labelClass}>
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={6}
            maxLength={5000}
            placeholder="Tell us what's on your mind. For typo reports, please include the novel title and chapter number."
            disabled={submitting}
            className={`${inputClass} resize-y`}
          />
        </div>
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-[#f4a7b9]/60 bg-[#fdf0f4] px-4 py-3 text-sm text-[#a2475f]"
        >
          {errorMessage}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
        <p className="text-xs text-[#302a2f]/60">
          Your email is only used to reply to you.
        </p>
        <button
          type="submit"
          id="contact-form-submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-full bg-[#2b1f2d] px-7 py-3 text-sm font-semibold tracking-wide text-[#f7c6d9] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#3d2c40] hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#f7c6d9]/40 border-t-[#f7c6d9]" />
              Sending…
            </>
          ) : (
            <>Send Message ✉️</>
          )}
        </button>
      </div>
    </form>
  );
}
