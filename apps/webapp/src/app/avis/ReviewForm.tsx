'use client';

import { useState } from 'react';
import { submitReview } from '@/app/actions';

export function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) { setError('Veuillez choisir une note.'); return; }
    setLoading(true);
    setError(null);
    const fd = new FormData();
    fd.set('rating', String(rating));
    fd.set('name', name.trim());
    fd.set('jobTitle', jobTitle.trim());
    fd.set('body', body.trim());
    const result = await submitReview(fd);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div style={{
        background: 'var(--ae-surface)', border: '1px solid var(--ae-border)',
        borderRadius: 14, padding: '32px 28px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ae-text)', margin: '0 0 8px' }}>
          Merci pour votre avis !
        </h3>
        <p style={{ fontSize: 14, color: 'var(--ae-text-muted)', margin: 0, lineHeight: 1.6 }}>
          Il sera affiché après validation — généralement sous 24h.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Stars */}
      <div>
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ae-text)', display: 'block', marginBottom: 10 }}>
          Note *
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(s)}
              style={{
                fontSize: 28, background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                filter: (hovered || rating) >= s ? 'none' : 'grayscale(1) opacity(0.3)',
                transition: 'filter 0.1s',
              }}
            >
              ⭐
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ae-text)' }}>Votre prénom *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sophie"
          required
          maxLength={60}
          style={{
            borderRadius: 9, border: '1px solid var(--ae-border)', background: 'var(--ae-surface)',
            color: 'var(--ae-text)', padding: '11px 14px', fontSize: 13, outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Job title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ae-text)' }}>
          Votre métier <span style={{ color: 'var(--ae-text-muted)', fontWeight: 400 }}>(optionnel)</span>
        </label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Développeur React, Responsable RH…"
          maxLength={80}
          style={{
            borderRadius: 9, border: '1px solid var(--ae-border)', background: 'var(--ae-surface)',
            color: 'var(--ae-text)', padding: '11px 14px', fontSize: 13, outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ae-text)' }}>Votre avis *</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Décrivez votre expérience avec Alertemploi…"
          required
          minLength={20}
          maxLength={600}
          rows={4}
          style={{
            borderRadius: 9, border: '1px solid var(--ae-border)', background: 'var(--ae-surface)',
            color: 'var(--ae-text)', padding: '11px 14px', fontSize: 13, outline: 'none',
            resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box',
          }}
        />
        <span style={{ fontSize: 11, color: 'var(--ae-text-subtle)', textAlign: 'right' }}>
          {body.length}/600
        </span>
      </div>

      {error && (
        <div style={{
          borderRadius: 9, background: 'var(--ae-red-bg)', border: '1px solid var(--ae-red-border)',
          padding: '11px 14px', fontSize: 13, color: 'var(--ae-red)',
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !name || !body || !rating}
        style={{
          borderRadius: 9, padding: '12px 0', fontWeight: 600, fontSize: 14, border: 'none',
          background: (loading || !name || !body || !rating) ? 'var(--ae-surface-3)' : 'var(--ae-primary-bg)',
          color: (loading || !name || !body || !rating) ? 'var(--ae-text-muted)' : 'white',
          cursor: (loading || !name || !body || !rating) ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Envoi en cours…' : 'Envoyer mon avis'}
      </button>
    </form>
  );
}
