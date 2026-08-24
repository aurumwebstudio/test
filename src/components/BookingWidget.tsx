"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  MessageSquareText,
  Phone,
  Send,
  UserRound,
} from "lucide-react";
import { services, timeSlots } from "@/lib/studio-data";

type BookingValues = {
  serviceId: string;
  date: string;
  time: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
};

type BookingErrors = Partial<Record<keyof BookingValues, string>>;

const initialValues: BookingValues = {
  serviceId: "",
  date: "",
  time: "",
  fullName: "",
  email: "",
  phone: "",
  message: "",
};

function getTodayInputValue() {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today.toISOString().slice(0, 10);
}

function validate(values: BookingValues, minDate: string): BookingErrors {
  const errors: BookingErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneDigits = values.phone.replace(/\D/g, "");

  if (!values.serviceId) {
    errors.serviceId = "Wybierz usługę, którą chcesz zarezerwować.";
  }

  if (!values.date) {
    errors.date = "Wybierz proponowaną datę wizyty.";
  } else if (values.date < minDate) {
    errors.date = "Wybierz dzisiejszą lub późniejszą datę.";
  }

  if (!values.time) {
    errors.time = "Wybierz proponowaną godzinę.";
  }

  if (!values.fullName.trim()) {
    errors.fullName = "Podaj imię i nazwisko.";
  } else if (values.fullName.trim().length < 3) {
    errors.fullName = "Wpisz pełne imię i nazwisko.";
  }

  if (!values.email.trim()) {
    errors.email = "Podaj adres e-mail.";
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = "Wpisz poprawny adres e-mail.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Podaj numer telefonu.";
  } else if (phoneDigits.length < 9) {
    errors.phone = "Wpisz poprawny numer telefonu.";
  }

  return errors;
}

export function BookingWidget() {
  const minDate = useMemo(() => getTodayInputValue(), []);
  const [values, setValues] = useState<BookingValues>(initialValues);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const selectedService = services.find(
    (service) => service.id === values.serviceId,
  );

  function setField<Field extends keyof BookingValues>(
    field: Field,
    value: BookingValues[Field],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submittedValues: BookingValues = {
      serviceId: String(formData.get("service") ?? ""),
      date: String(formData.get("date") ?? ""),
      time: values.time,
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    const validationErrors = validate(submittedValues, minDate);
    setErrors(validationErrors);
    setValues(submittedValues);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsSubmitting(false);
    setIsSent(true);
  }

  function resetForm() {
    setValues(initialValues);
    setErrors({});
    setFormKey((current) => current + 1);
    setIsSent(false);
  }

  if (isSent) {
    return (
      <div className="booking-widget booking-widget--success" role="status">
        <div className="success-mark" aria-hidden="true">
          <CheckCircle2 size={36} strokeWidth={1.8} />
        </div>
        <p className="eyebrow">Studio Noir</p>
        <h3>Zapytanie wysłane!</h3>
        <p>Salon otrzyma Twoją prośbę i potwierdzi termin.</p>
        <p>
          Na podany adres e-mail otrzymasz informację po decyzji salonu.
        </p>
        <button className="secondary-button" type="button" onClick={resetForm}>
          Wyślij kolejne zapytanie
        </button>
      </div>
    );
  }

  return (
    <form className="booking-widget" key={formKey} onSubmit={handleSubmit} noValidate>
      <div className="widget-heading">
        <p className="eyebrow">Rezerwacja</p>
        <h3>Wybierz wygodny termin</h3>
        <p>
          Wyślij zapytanie, a salon wróci z potwierdzeniem po sprawdzeniu
          dostępności stylisty.
        </p>
      </div>

      <div className="form-grid">
        <label className="field field--wide" htmlFor="service">
          <span>Usługa</span>
          <select
            id="service"
            name="service"
            value={values.serviceId}
            onChange={(event) => setField("serviceId", event.target.value)}
            aria-invalid={Boolean(errors.serviceId)}
            aria-describedby={errors.serviceId ? "service-error" : undefined}
          >
            <option value="">Wybierz usługę</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.price} - {service.duration}
              </option>
            ))}
          </select>
          {errors.serviceId ? (
            <span className="field-error" id="service-error">
              {errors.serviceId}
            </span>
          ) : null}
        </label>

        <label className="field" htmlFor="date">
          <span>Proponowana data</span>
          <span className="input-with-icon">
            <CalendarCheck2 size={18} aria-hidden="true" />
            <input
              id="date"
              name="date"
              type="date"
              min={minDate}
              onChange={(event) => setField("date", event.target.value)}
              required
              aria-invalid={Boolean(errors.date)}
              aria-describedby={errors.date ? "date-error" : undefined}
            />
          </span>
          {errors.date ? (
            <span className="field-error" id="date-error">
              {errors.date}
            </span>
          ) : null}
        </label>

        <fieldset
          className="field fieldset"
          aria-invalid={Boolean(errors.time)}
          aria-describedby={errors.time ? "time-error" : undefined}
        >
          <legend>Proponowana godzina</legend>
          <div className="time-grid">
            {timeSlots.map((time) => (
              <button
                className={values.time === time ? "time-chip is-active" : "time-chip"}
                key={time}
                type="button"
                onClick={() => setField("time", time)}
              >
                <Clock3 size={15} aria-hidden="true" />
                {time}
              </button>
            ))}
          </div>
          {errors.time ? (
            <span className="field-error" id="time-error">
              {errors.time}
            </span>
          ) : null}
        </fieldset>

        <label className="field" htmlFor="fullName">
          <span>Imię i nazwisko</span>
          <span className="input-with-icon">
            <UserRound size={18} aria-hidden="true" />
            <input
              id="fullName"
              name="fullName"
              autoComplete="name"
              onChange={(event) => setField("fullName", event.target.value)}
              placeholder="Jan Kowalski"
              required
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "name-error" : undefined}
            />
          </span>
          {errors.fullName ? (
            <span className="field-error" id="name-error">
              {errors.fullName}
            </span>
          ) : null}
        </label>

        <label className="field" htmlFor="email">
          <span>E-mail</span>
          <span className="input-with-icon">
            <Mail size={18} aria-hidden="true" />
            <input
              id="email"
              name="email"
              type="text"
              inputMode="email"
              autoComplete="email"
              onChange={(event) => setField("email", event.target.value)}
              placeholder="jan@email.pl"
              required
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
          </span>
          {errors.email ? (
            <span className="field-error" id="email-error">
              {errors.email}
            </span>
          ) : null}
        </label>

        <label className="field" htmlFor="phone">
          <span>Telefon</span>
          <span className="input-with-icon">
            <Phone size={18} aria-hidden="true" />
            <input
              id="phone"
              name="phone"
              type="text"
              inputMode="tel"
              autoComplete="tel"
              onChange={(event) => setField("phone", event.target.value)}
              placeholder="+48 500 000 000"
              required
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
          </span>
          {errors.phone ? (
            <span className="field-error" id="phone-error">
              {errors.phone}
            </span>
          ) : null}
        </label>

        <label className="field field--wide" htmlFor="message">
          <span>Wiadomość opcjonalna</span>
          <span className="textarea-with-icon">
            <MessageSquareText size={18} aria-hidden="true" />
            <textarea
              id="message"
              name="message"
              rows={4}
              onChange={(event) => setField("message", event.target.value)}
              placeholder="Np. preferowany stylista albo dodatkowe informacje."
            />
          </span>
        </label>
      </div>

      <div className="booking-footer">
        <div className="booking-summary" aria-live="polite">
          {selectedService ? (
            <>
              <strong>{selectedService.name}</strong>
              <span>
                {selectedService.price} / {selectedService.duration}
              </span>
            </>
          ) : (
            <span>Wybierz usługę, aby zobaczyć podsumowanie.</span>
          )}
        </div>
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="spin-icon" size={18} aria-hidden="true" />
          ) : (
            <Send size={18} aria-hidden="true" />
          )}
          {isSubmitting ? "Wysyłanie..." : "Wyślij zapytanie o termin"}
        </button>
      </div>
    </form>
  );
}
