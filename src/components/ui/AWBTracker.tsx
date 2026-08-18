/**
 * AWBTracker.tsx — React Astro Island
 *
 * Client-side Air Waybill (AWB) tracker.
 *
 * VALIDATION: AWB format = 3-digit prefix + 8-digit serial
 *   Examples: 020-12345678, 02012345678
 *   Regex: /^\d{3}-?\d{8}$/
 *
 * INTEGRATION POINT FOR LIVE API:
 *   Replace the simulateTracking() call in handleSubmit with a real fetch:
 *
 *   const res = await fetch('https://your-tracking-api.example.com/track', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ awb: normalized }),
 *   });
 *   const data = await res.json();
 *   setStages(data.stages);  // expected: array of { label, status: 'done'|'active'|'pending' }
 *
 *   Supported live APIs: Cargo ONE, Kale Aviation, airline-specific REST endpoints.
 */

import { useState } from 'react';
import type { FormEvent } from 'react';

const STAGES_ES = [
  'Documento recibido',
  'Verificado',
  'Cargado',
  'En tránsito',
  'Llegó a destino',
];

const STAGES_EN = [
  'Document received',
  'Verified',
  'Loaded',
  'In transit',
  'Arrived at destination',
];

function normalizeAWB(raw: string): string {
  return raw.replace(/[^\d]/g, '');
}

function validateAWB(raw: string): boolean {
  const digits = normalizeAWB(raw);
  return /^\d{11}$/.test(digits);
}

interface Stage {
  label: string;
  status: 'done' | 'active' | 'pending';
}

function buildStages(locale: string, activeIndex: number): Stage[] {
  const labels = locale === 'es' ? STAGES_ES : STAGES_EN;
  return labels.map((label, i) => ({
    label,
    status: i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'pending',
  }));
}

interface AWBTrackerProps {
  locale: string;
}

export default function AWBTracker({ locale = 'es' }: AWBTrackerProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stages, setStages] = useState<Stage[]>([]);
  const [done, setDone] = useState(false);

  const isEs = locale === 'es';

  const placeholders = {
    title: isEs ? 'Consultar Guía Aérea' : 'Track Air Waybill',
    placeholder: isEs ? '000-12345678' : '000-12345678',
    track: isEs ? 'Rastrear' : 'Track',
    tracking: isEs ? 'Rastreando...' : 'Tracking...',
    note: isEs
      ? 'Demostración — para rastrear guías aéreas reales, contacte a nuestro equipo.'
      : 'Demo mode — to track live air waybills, contact our team.',
    invalid: isEs
      ? 'Formato AWB inválido. Use: 000-12345678'
      : 'Invalid AWB format. Use: 000-12345678',
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setDone(false);
    setStages([]);

    if (!validateAWB(value)) {
      setError(placeholders.invalid);
      return;
    }

    setLoading(true);

    // --- INTEGRATION POINT ---
    // Replace this with a real API call (see docstring above)
    await new Promise((r) => setTimeout(r, 1400));
    // ------------------------

    const trackingStages = buildStages(locale, Math.min(3, Math.floor(Math.random() * 5)));
    setStages(trackingStages);
    setLoading(false);
    setDone(true);
  }

  const statusColors = {
    done: 'text-cargo-emerald',
    active: 'text-cargo-light',
    pending: 'text-white/30',
  };

  const dotColors = {
    done: 'bg-cargo-emerald',
    active: 'bg-cargo-light animate-pulse',
    pending: 'bg-white/20',
  };

  return (
    <div className="w-full">
      <div className="glass rounded-2xl p-5 border border-white/10">
        <h3 className="text-sm font-bold text-white mb-1">{placeholders.title}</h3>
        <p className="text-xs text-white/40 mb-4">{placeholders.note}</p>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-3" noValidate>
          <div className="flex-1 relative">
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError('');
              }}
              placeholder={placeholders.placeholder}
              maxLength={12}
              inputMode="numeric"
              className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-white
                placeholder-white/30 font-mono text-sm tracking-wider
                focus:outline-none focus:ring-1 transition-colors
                ${error
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                  : 'border-white/10 focus:border-cargo-emerald focus:ring-cargo-emerald'
                }`}
              aria-label={placeholders.title}
              aria-invalid={!!error}
              aria-describedby={error ? 'awb-error' : undefined}
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !value.trim()}
            className="px-5 py-2.5 rounded-xl bg-cargo-emerald text-white text-sm font-semibold
                       hover:bg-emerald-600 active:scale-95 transition-all
                       disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? placeholders.tracking : placeholders.track}
          </button>
        </form>

        {error && (
          <p id="awb-error" role="alert" className="text-xs text-red-400 mb-2 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}

        {done && stages.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10" role="status" aria-live="polite">
            <div className="space-y-2.5">
              {stages.map((stage, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColors[stage.status]}`} />
                  <span className={`text-xs font-medium ${statusColors[stage.status]}`}>
                    {stage.label}
                  </span>
                  {i < stages.length - 1 && (
                    <div className="flex-1 h-px bg-white/10 ml-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
