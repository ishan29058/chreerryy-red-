import { useState } from 'react';
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { CAFE_INTERIOR_IMAGE } from '../data/menuData';

const SERVICE_HOURS = [
  { label: 'Morning Coffee Bar & Bakery', hours: 'Daily · 07:30 – 17:00' },
  { label: 'All-Day Kitchen', hours: 'Daily · 08:30 – 16:00' },
  { label: 'Evening Dining Room', hours: 'Tue – Sun · 17:30 – 22:30' },
];

export function AtmosphereReservation() {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="atmosphere"
      className="py-20 sm:py-28 bg-[#EAE7E0] text-[#141416] border-t border-black/[0.06]"
    >
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Architectural Café Interior & Story */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#7A1113] mb-3">
                About Aurora
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#141416] leading-[1.02]">
                Designed for Slow Mornings &amp; Candlelit Evenings
              </h2>
              <p className="mt-4 text-base text-[#141416]/72 leading-relaxed max-w-xl">
                Built around a honed travertine coffee bar and an open wood-hearth
                kitchen, Aurora shifts effortlessly from precision single-origin
                espresso at sunrise to handmade pasta and cellar pours after dusk.
              </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-[#D9D5CA] aspect-[4/3] lg:flex-1 lg:min-h-[340px]">
              {imgError ? (
                <div className="w-full h-full flex items-center justify-center text-sm text-[#141416]/60">
                  Aurora Dining Room Interior
                </div>
              ) : (
                <img
                  src={CAFE_INTERIOR_IMAGE}
                  alt="Aurora Café sunlit travertine espresso bar and walnut dining room"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="grid grid-cols-3 gap-6 pt-2 border-t border-black/10">
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold tabular-nums text-[#141416]">
                  07:30
                </p>
                <p className="text-xs text-[#141416]/60 mt-0.5">
                  Morning espresso bar
                </p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold tabular-nums text-[#141416]">
                  48 hr
                </p>
                <p className="text-xs text-[#141416]/60 mt-0.5">
                  Laminated butter pastry
                </p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold tabular-nums text-[#141416]">
                  17:30
                </p>
                <p className="text-xs text-[#141416]/60 mt-0.5">
                  Evening kitchen service
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Static Restaurant Information — Hours, Location & Contact */}
          <div
            id="visit"
            data-testid="visit-info-card"
            className="lg:col-span-6 bg-white rounded-3xl p-7 sm:p-10 border border-black/[0.06] flex flex-col justify-between"
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#7A1113]">
                Visit Us
              </p>
              <h3 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#141416]">
                Hours, Location &amp; Contact
              </h3>
              <p className="mt-2 text-sm text-[#141416]/68 leading-relaxed">
                Join us at our travertine espresso counter for morning pastries,
                or settle into the sunlit courtyard and main dining room for
                lunch and evening service.
              </p>

              <div className="mt-8 divide-y divide-black/8 border-y border-black/8">
                {/* Address Block */}
                <div className="py-5 flex items-start gap-4">
                  <MapPin
                    className="w-5 h-5 text-[#7A1113] shrink-0 mt-0.5"
                    strokeWidth={1.8}
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#141416]/55">
                      Address
                    </p>
                    <p className="mt-1 text-base font-semibold text-[#141416]">
                      42 Rue de Mercer, Suite 100
                    </p>
                    <p className="text-sm text-[#141416]/68 mt-0.5">
                      SoHo · New York, NY 10013 — Steps from Mercer &amp; Broome
                    </p>
                  </div>
                </div>

                {/* Opening Hours Block */}
                <div className="py-5 flex items-start gap-4">
                  <Clock
                    className="w-5 h-5 text-[#7A1113] shrink-0 mt-0.5"
                    strokeWidth={1.8}
                  />
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#141416]/55 mb-2.5">
                      Opening Hours
                    </p>
                    <dl className="space-y-2 text-sm">
                      {SERVICE_HOURS.map((row) => (
                        <div
                          key={row.label}
                          className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1"
                        >
                          <dt className="text-[#141416]/75">{row.label}</dt>
                          <dd className="font-semibold tabular-nums text-[#141416]">
                            {row.hours}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                {/* Contact Block */}
                <div className="py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex items-start gap-3.5">
                    <Phone
                      className="w-5 h-5 text-[#7A1113] shrink-0 mt-0.5"
                      strokeWidth={1.8}
                    />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#141416]/55">
                        Telephone
                      </p>
                      <a
                        href="tel:+12125550148"
                        className="mt-1 block text-sm font-semibold tabular-nums text-[#141416] hover:text-[#7A1113] transition-colors"
                      >
                        (212) 555-0148
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Mail
                      className="w-5 h-5 text-[#7A1113] shrink-0 mt-0.5"
                      strokeWidth={1.8}
                    />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#141416]/55">
                        Hospitality &amp; Events
                      </p>
                      <a
                        href="mailto:hello@auroracafe.example"
                        className="mt-1 block text-sm font-semibold text-[#141416] hover:text-[#7A1113] transition-colors break-all"
                      >
                        hello@auroracafe.example
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dining Spaces Note */}
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#141416]/55">
                  Dining Spaces
                </p>
                <p className="mt-1.5 text-sm text-[#141416]/72 leading-relaxed">
                  Main Dining Room · Travertine Coffee Bar · Sunlit Courtyard.
                  Private seasonal tastings and intimate gatherings of up to 24
                  guests are hosted by arrangement with our hospitality team.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-black/8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-[#141416]/58">
                Walk-ins welcome daily at our coffee bar and courtyard.
              </p>
              <a
                href="#menu"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#141416] text-white text-xs font-semibold uppercase tracking-[0.08em] hover:bg-[#7A1113] transition-colors whitespace-nowrap shrink-0"
              >
                <span>View Full Menu</span>
                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.2} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
