import { useState } from 'react';
import { Calendar, CheckCircle2, Clock, Users } from 'lucide-react';
import {
  CAFE_INTERIOR_IMAGE,
  RESERVATION_TIME_SLOTS,
  SEATING_PREFERENCES,
} from '../data/menuData';
import {
  generateConfirmationCode,
  validateReservationForm,
  type ReservationFormValues,
} from '../utils/orderLogic';

interface ConfirmedReservation {
  code: string;
  values: ReservationFormValues;
}

export function AtmosphereReservation() {
  const [form, setForm] = useState<ReservationFormValues>({
    guestName: '',
    email: '',
    date: '2026-11-24',
    timeSlot: '07:00 PM',
    partySize: 2,
    seating: SEATING_PREFERENCES[0],
    notes: '',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ReservationFormValues, string>>
  >({});
  const [confirmed, setConfirmed] = useState<ConfirmedReservation | null>(null);
  const [imgError, setImgError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateReservationForm(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    const seed =
      form.guestName.length * 31 +
      form.partySize * 17 +
      form.timeSlot.charCodeAt(0);
    setConfirmed({
      code: generateConfirmationCode('RES', seed),
      values: { ...form },
    });
  };

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
                The Dining Room &amp; Roastery
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

          {/* Right Column: Interactive Table Reservation Form */}
          <div
            id="reservations"
            className="lg:col-span-6 bg-white rounded-3xl p-7 sm:p-10 border border-black/[0.06] flex flex-col justify-between"
          >
            {confirmed ? (
              <div
                data-testid="reservation-confirmed"
                className="my-auto py-8 flex flex-col items-start"
              >
                <div className="w-12 h-12 rounded-full bg-[#141416] text-white flex items-center justify-center mb-5">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7A1113]">
                  Table Reserved
                </p>
                <h3 className="mt-2 font-display text-4xl font-bold text-[#141416]">
                  We Look Forward to Hosting You
                </h3>
                <p className="mt-2 text-sm text-[#141416]/70">
                  Confirmation code{' '}
                  <strong className="font-semibold text-[#141416] tabular-nums">
                    {confirmed.code}
                  </strong>{' '}
                  has been recorded for {confirmed.values.guestName}.
                </p>

                <dl className="mt-6 w-full divide-y divide-black/8 border-y border-black/8 text-sm">
                  <div className="py-3 flex justify-between">
                    <dt className="text-[#141416]/58">Date &amp; Time</dt>
                    <dd className="font-medium tabular-nums">
                      {confirmed.values.date} · {confirmed.values.timeSlot}
                    </dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="text-[#141416]/58">Guests</dt>
                    <dd className="font-medium tabular-nums">
                      {confirmed.values.partySize}{' '}
                      {confirmed.values.partySize === 1 ? 'Guest' : 'Guests'}
                    </dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="text-[#141416]/58">Seating</dt>
                    <dd className="font-medium">{confirmed.values.seating}</dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="text-[#141416]/58">Email</dt>
                    <dd className="font-medium">{confirmed.values.email}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={() => setConfirmed(null)}
                  className="mt-7 px-6 py-3 rounded-full bg-[#141416] text-white text-xs font-semibold uppercase tracking-[0.08em] hover:bg-[#7A1113] transition-colors"
                >
                  Make Another Reservation
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col h-full justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#7A1113]">
                    Reservations
                  </p>
                  <h3 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#141416]">
                    Reserve Your Table
                  </h3>
                  <p className="mt-1.5 text-sm text-[#141416]/65">
                    Walk-ins are always welcome at our coffee bar. Book ahead for
                    brunch and evening dining.
                  </p>

                  <div className="mt-7 space-y-5">
                    {/* Guest Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="res-name"
                          className="block text-xs font-semibold text-[#141416]/80 mb-1.5"
                        >
                          Full Name
                        </label>
                        <input
                          id="res-name"
                          type="text"
                          value={form.guestName}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              guestName: e.target.value,
                            }))
                          }
                          placeholder="Clara Moreau"
                          className="w-full h-11 px-3.5 rounded-xl bg-[#F6F5F0] border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#141416]"
                        />
                        {errors.guestName && (
                          <p
                            role="alert"
                            className="mt-1 text-xs text-[#9E1928] font-medium"
                          >
                            {errors.guestName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="res-email"
                          className="block text-xs font-semibold text-[#141416]/80 mb-1.5"
                        >
                          Email Address
                        </label>
                        <input
                          id="res-email"
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="clara@example.com"
                          className="w-full h-11 px-3.5 rounded-xl bg-[#F6F5F0] border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#141416]"
                        />
                        {errors.email && (
                          <p
                            role="alert"
                            className="mt-1 text-xs text-[#9E1928] font-medium"
                          >
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Date & Party Size */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="res-date"
                          className="flex items-center gap-1.5 text-xs font-semibold text-[#141416]/80 mb-1.5"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Date</span>
                        </label>
                        <input
                          id="res-date"
                          type="date"
                          value={form.date}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              date: e.target.value,
                            }))
                          }
                          className="w-full h-11 px-3.5 rounded-xl bg-[#F6F5F0] border border-black/10 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-[#141416]"
                        />
                        {errors.date && (
                          <p
                            role="alert"
                            className="mt-1 text-xs text-[#9E1928] font-medium"
                          >
                            {errors.date}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="res-party"
                          className="flex items-center gap-1.5 text-xs font-semibold text-[#141416]/80 mb-1.5"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Party Size</span>
                        </label>
                        <select
                          id="res-party"
                          value={form.partySize}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              partySize: Number(e.target.value),
                            }))
                          }
                          className="w-full h-11 px-3.5 rounded-xl bg-[#F6F5F0] border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#141416]"
                        >
                          {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Time Slot Selector */}
                    <div>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-[#141416]/80 mb-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Preferred Time</span>
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {RESERVATION_TIME_SLOTS.map((slot) => {
                          const active = form.timeSlot === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() =>
                                setForm((prev) => ({ ...prev, timeSlot: slot }))
                              }
                              aria-pressed={active}
                              className={`h-10 rounded-xl text-xs font-semibold tabular-nums transition-colors ${
                                active
                                  ? 'bg-[#141416] text-white'
                                  : 'bg-[#F6F5F0] text-[#141416]/80 hover:bg-black/8'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Seating Preference */}
                    <div>
                      <label
                        htmlFor="res-seating"
                        className="block text-xs font-semibold text-[#141416]/80 mb-1.5"
                      >
                        Seating Preference
                      </label>
                      <select
                        id="res-seating"
                        value={form.seating}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            seating: e.target.value,
                          }))
                        }
                        className="w-full h-11 px-3.5 rounded-xl bg-[#F6F5F0] border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#141416]"
                      >
                        {SEATING_PREFERENCES.map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-7 w-full h-12 rounded-full bg-[#141416] text-white text-xs sm:text-sm font-semibold uppercase tracking-[0.1em] hover:bg-[#7A1113] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141416]"
                >
                  Confirm Reservation
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
