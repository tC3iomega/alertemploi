export function Logo({ variant = 'page' }: { variant?: 'header' | 'page' }) {
  if (variant === 'header') {
    return (
      <svg width="130" height="28" viewBox="0 0 130 28" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="14" r="10" fill="none" stroke="var(--ae-primary)" strokeWidth="2" />
        <circle cx="12" cy="14" r="3.5" fill="var(--ae-primary)" />
        <line x1="19" y1="7" x2="23" y2="3" stroke="var(--ae-primary)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="2.5" r="3" fill="var(--ae-accent)" />
        <text x="32" y="19" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="700" fill="var(--ae-text)">
          alert<tspan fill="var(--ae-primary)">emploi</tspan>
        </text>
      </svg>
    );
  }
  return (
    <svg width="160" height="36" viewBox="0 0 160 36" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="18" r="13" fill="none" stroke="var(--ae-primary)" strokeWidth="2.5" />
      <circle cx="16" cy="18" r="4.5" fill="var(--ae-primary)" />
      <line x1="25" y1="9" x2="31" y2="4" stroke="var(--ae-primary)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32.5" cy="3" r="4" fill="var(--ae-accent)" />
      <text x="44" y="23" fontFamily="Arial, sans-serif" fontSize="19" fontWeight="700" fill="var(--ae-text)" letterSpacing="-0.5">
        alert<tspan fill="var(--ae-primary)">emploi</tspan>
      </text>
      <text x="45" y="33" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="400" fill="var(--ae-text-subtle)" letterSpacing="1.2">
        TROUVEZ EN PREMIER
      </text>
    </svg>
  );
}
