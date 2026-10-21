type Kind = "aircraft" | "submarine" | "trajectory" | undefined;

export function StudyDiagram({ kind }: { kind: Kind }) {
  if (kind === "submarine") return <SubmarineDiagram />;
  if (kind === "trajectory") return <TrajectoryDiagram />;
  return <AircraftDiagram />;
}

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <figure className="figure-bleed panel" style={{ padding: "1rem 1.25rem" }}>
      <figcaption
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.9rem",
          marginBottom: "0.5rem",
          color: "var(--text-muted)",
        }}
      >
        {title}
      </figcaption>
      {children}
    </figure>
  );
}

function AircraftDiagram() {
  return (
    <Frame title="Animated diagram — dynamic pressure on a generic airframe (SVG)">
      <svg viewBox="0 0 640 220" width="100%" height="220" role="img" aria-label="Aircraft with airflow">
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--accent-strong)" />
          </marker>
        </defs>
        <rect width="640" height="220" fill="transparent" />
        {/* airflow */}
        {[40, 70, 100, 130, 160].map((y, i) => (
          <line
            key={y}
            className="flow-line"
            x1="20"
            y1={y}
            x2="200"
            y2={y - 4 + (i % 2)}
            stroke="var(--accent)"
            strokeWidth="1.5"
            markerEnd="url(#arrow)"
          />
        ))}
        {/* fuselage */}
        <ellipse cx="340" cy="110" rx="150" ry="28" fill="var(--primary)" opacity="0.9" />
        <path d="M220 110 L180 110 L200 95 Z" fill="var(--primary-strong)" />
        <path d="M300 90 L340 40 L380 90 Z" fill="var(--accent)" opacity="0.85" />
        <path d="M300 130 L340 180 L380 130 Z" fill="var(--accent)" opacity="0.85" />
        <path d="M460 100 L520 88 L520 132 L460 120 Z" fill="var(--primary-strong)" />
        <text x="250" y="205" fill="var(--text-muted)" fontSize="12" fontFamily="var(--font-mono)">
          q = ½ρV² · flow lines animate (respects reduced motion)
        </text>
      </svg>
    </Frame>
  );
}

function SubmarineDiagram() {
  return (
    <Frame title="Animated diagram — hull in stratified temperature layers">
      <svg viewBox="0 0 640 220" width="100%" height="220" role="img" aria-label="Submarine hull">
        <rect x="0" y="0" width="640" height="70" fill="var(--accent)" opacity="0.12" />
        <rect x="0" y="70" width="640" height="70" fill="var(--accent)" opacity="0.2" />
        <rect x="0" y="140" width="640" height="80" fill="var(--accent)" opacity="0.28" />
        <ellipse cx="320" cy="120" rx="160" ry="36" fill="var(--primary)" />
        <rect x="300" y="70" width="24" height="30" rx="4" fill="var(--primary-strong)" />
        <circle cx="200" cy="120" r="10" fill="var(--on-primary)" opacity="0.35" />
        {[180, 220, 260].map((x) => (
          <path
            key={x}
            className="flow-line"
            d={`M${x} 160 Q ${x + 20} 180 ${x + 40} 160`}
            fill="none"
            stroke="var(--accent-strong)"
            strokeWidth="1.5"
          />
        ))}
        <text x="24" y="28" fill="var(--text-muted)" fontSize="12" fontFamily="var(--font-mono)">
          20 °C
        </text>
        <text x="24" y="108" fill="var(--text-muted)" fontSize="12" fontFamily="var(--font-mono)">
          11 °C
        </text>
        <text x="24" y="188" fill="var(--text-muted)" fontSize="12" fontFamily="var(--font-mono)">
          2 °C
        </text>
      </svg>
    </Frame>
  );
}

function TrajectoryDiagram() {
  return (
    <Frame title="Animated diagram — patched-conic transfer sketch to Pluto">
      <svg viewBox="0 0 640 220" width="100%" height="220" role="img" aria-label="Transfer orbit">
        <circle cx="120" cy="110" r="18" fill="var(--accent)" />
        <text x="108" y="145" fill="var(--text-muted)" fontSize="11">
          Sun
        </text>
        <circle cx="200" cy="110" r="8" fill="var(--primary)" />
        <text x="188" y="145" fill="var(--text-muted)" fontSize="11">
          Earth
        </text>
        <ellipse
          className="flow-line"
          cx="300"
          cy="110"
          rx="220"
          ry="70"
          fill="none"
          stroke="var(--primary-strong)"
          strokeWidth="2"
        />
        <circle cx="500" cy="90" r="6" fill="var(--accent-strong)" />
        <text x="480" y="70" fill="var(--text-muted)" fontSize="11">
          Pluto
        </text>
        <text x="240" y="205" fill="var(--text-muted)" fontSize="12" fontFamily="var(--font-mono)">
          Δv budget · no gravity assists in this seed model
        </text>
      </svg>
    </Frame>
  );
}
