"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { clinics, contact, doctor, whatsappHref } from "@/content/site";

type Fields = { name: string; phone: string; clinic: string; time: string; note: string };

function compose(f: Fields) {
  const clinic = clinics.find((c) => c.id === f.clinic)?.name ?? "No preference";
  return [
    `Hello, I would like to book a consultation with ${doctor.name}.`,
    ``,
    `Name: ${f.name}`,
    `Phone: ${f.phone}`,
    `Preferred clinic: ${clinic}`,
    `Preferred time: ${f.time}`,
    f.note ? `Note: ${f.note}` : "",
  ]
    .filter((l, i, a) => l !== "" || i === 1)
    .join("\n")
    .trim();
}

export function BookingForm() {
  const params = useSearchParams();
  const initialClinic = clinics.some((c) => c.id === params.get("clinic")) ? params.get("clinic")! : "";
  const [f, setF] = useState<Fields>({ name: "", phone: "", clinic: initialClinic, time: "Any", note: "" });
  const [error, setError] = useState("");
  const set = (k: keyof Fields) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    if (f.name.trim().length < 2) return "Please enter your name.";
    if (f.phone.replace(/\D/g, "").length < 10) return "Please enter a valid phone number.";
    return "";
  };

  const submit = (channel: "whatsapp" | "email") => (e?: FormEvent) => {
    e?.preventDefault();
    const err = validate();
    setError(err);
    if (err) {
      document.getElementById("booking-error")?.focus();
      return;
    }
    const body = compose(f);
    if (channel === "whatsapp") window.open(whatsappHref(body), "_blank", "noopener");
    else window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent("Consultation request")}&body=${encodeURIComponent(body)}`;
  };

  const input =
    "mt-2 block w-full rounded-[2px] border border-line-strong bg-paper px-4 py-3 text-[0.97rem] text-charcoal placeholder:text-muted/70 focus:border-plum focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum";
  const label = "text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-plum";

  return (
    <form onSubmit={submit("whatsapp")} noValidate className="grid gap-6" aria-describedby="booking-note">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className={label}>Full name</span>
          <input className={input} name="name" autoComplete="name" required value={f.name} onChange={set("name")} />
        </label>
        <label className="block">
          <span className={label}>Phone number</span>
          <input
            className={input}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            value={f.phone}
            onChange={set("phone")}
            placeholder="+91"
          />
        </label>
      </div>
      <fieldset>
        <legend className={label}>Preferred clinic</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {clinics.map((c) => (
            <label
              key={c.id}
              className="flex cursor-pointer items-start gap-3 border border-line-strong bg-paper p-4 has-[:checked]:border-plum has-[:checked]:bg-rose-soft/40"
            >
              <input type="radio" name="clinic" value={c.id} checked={f.clinic === c.id} onChange={set("clinic")} className="mt-1 accent-[#4a2637]" />
              <span>
                <span className="block font-serif text-[1.15rem] leading-tight text-plum">{c.name}</span>
                <span className="mt-1 block text-xs text-muted">{c.timings.map((t) => t.time).join(" · ")}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block">
        <span className={label}>Preferred time</span>
        <select className={input} name="time" value={f.time} onChange={set("time")}>
          <option>Any</option>
          <option>Morning</option>
          <option>Afternoon</option>
          <option>Evening</option>
        </select>
      </label>
      <label className="block">
        <span className={label}>
          Anything we should know? <span className="font-normal tracking-normal text-muted normal-case">(optional)</span>
        </span>
        <textarea
          className={`${input} min-h-28`}
          name="note"
          value={f.note}
          onChange={set("note")}
          maxLength={300}
          placeholder="e.g. first visit, follow-up, preferred day"
        />
      </label>
      <p id="booking-note" className="text-[0.82rem] leading-relaxed text-muted">
        Your request opens in WhatsApp or your email app, ready to send. This website does not store it. Please avoid sharing detailed medical
        information here.
      </p>
      <p id="booking-error" tabIndex={-1} role="alert" className="text-sm font-medium text-rose-ink empty:hidden">
        {error}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="btn btn-primary">
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> Send via WhatsApp
        </button>
        <button type="button" onClick={submit("email")} className="btn btn-secondary">
          <Mail className="h-4 w-4" aria-hidden="true" /> Send via email
        </button>
      </div>
    </form>
  );
}
