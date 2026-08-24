import {
  ArrowRight,
  CalendarCheck2,
  Check,
  Clock3,
  Star,
} from "lucide-react";
import { BookingWidget } from "@/components/BookingWidget";
import {
  CalendarIcon,
  ScissorsIcon,
  highlights,
  salonInfo,
  services,
} from "@/lib/studio-data";

export default function Home() {
  return (
    <main>
      <header className="site-header" aria-label="Główna nawigacja">
        <a className="brand" href="#top" aria-label="Studio Noir">
          <span>SN</span>
          Studio Noir
        </a>
        <nav className="main-nav">
          <a href="#services">Usługi</a>
          <a href="#info">Informacje</a>
          <a href="#booking">Rezerwacja</a>
        </nav>
        <a className="header-cta" href="#booking">
          <CalendarCheck2 size={17} aria-hidden="true" />
          Umów wizytę
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">Premium hair studio / Warszawa</p>
          <h1>Studio Noir</h1>
          <p className="hero-copy">
            Kameralny salon fryzjerski dla osób, które cenią precyzję,
            spokojną atmosferę i dopracowany efekt od pierwszego cięcia.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="#booking">
              Umów wizytę
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="ghost-link" href="#services">
              Zobacz usługi
            </a>
          </div>
          <div className="hero-highlights" aria-label="Najważniejsze informacje">
            {highlights.map((item) => (
              <div key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--intro" aria-label="Wyróżniki salonu">
        <div className="container intro-grid">
          <div>
            <p className="eyebrow">Dopracowane wizyty</p>
            <h2>Elegancki rytuał, bez zbędnego pośpiechu.</h2>
          </div>
          <div className="intro-points">
            <p>
              Każda wizyta zaczyna się od krótkiej konsultacji, a kończy
              stylizacją dobraną do kształtu twarzy, włosów i codziennego tempa.
            </p>
            <div className="quality-row">
              <span>
                <Check size={16} aria-hidden="true" />
                Rezerwacja bez telefonu
              </span>
              <span>
                <Check size={16} aria-hidden="true" />
                Jasne ceny i czas wizyty
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container section-heading">
          <p className="eyebrow">Usługi</p>
          <h2>Najczęściej wybierane wizyty</h2>
        </div>
        <div className="container services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.id}>
              <div className="service-icon" aria-hidden="true">
                <ScissorsIcon size={22} />
              </div>
              <div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </div>
              <div className="service-meta">
                <span>{service.price}</span>
                <span>
                  <Clock3 size={15} aria-hidden="true" />
                  {service.duration}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--info" id="info">
        <div className="container info-layout">
          <div className="info-copy">
            <p className="eyebrow">Informacje</p>
            <h2>Salon w centrum miasta, zaprojektowany na spokojne wizyty.</h2>
            <p>
              Studio Noir działa w rytmie butikowego salonu: krótkie serie
              rezerwacji, punktualne wizyty i kontakt, który nie ginie w chaosie.
            </p>
            <div className="rating-pill">
              <Star size={17} aria-hidden="true" />
              4.9 na podstawie opinii stałych klientów
            </div>
          </div>
          <div className="info-list">
            {salonInfo.map(({ Icon, label, value }) => (
              <article className="info-item" key={label}>
                <Icon size={21} aria-hidden="true" />
                <div>
                  <h3>{label}</h3>
                  <p>{value}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--booking" id="booking">
        <div className="container booking-layout">
          <div className="booking-copy">
            <p className="eyebrow">Umów wizytę</p>
            <h2>Formularz gotowy do późniejszego osadzenia jako widget.</h2>
            <p>
              Dane są teraz mockowe i zostają tylko w przeglądarce. Ten widok
              pozwala dopracować UX przed podłączeniem właściwej logiki.
            </p>
            <div className="booking-note">
              <CalendarIcon size={20} aria-hidden="true" />
              Salon potwierdza termin po sprawdzeniu dostępności.
            </div>
          </div>
          <BookingWidget />
        </div>
      </section>
    </main>
  );
}
