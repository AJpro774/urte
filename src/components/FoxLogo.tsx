type Props = {
  size?: number;
  variant?: "full" | "mark" | "favicon";
  animate?: boolean;
  className?: string;
};

/** Detailed orange-and-white fox perched on a faceted rock. */
export function FoxLogo({
  size = 96,
  variant = "full",
  animate = false,
  className,
}: Props) {
  const id = "urte-fox";
  if (variant === "favicon") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        className={className}
        aria-hidden
      >
        <path fill="#F26B1D" d="M8 22 L6 8 L12 14 L16 6 L20 14 L26 8 L24 22 Z" />
        <path fill="#FFFFFF" d="M12 18 L16 12 L20 18 Z" />
        <circle cx="13" cy="16" r="1.2" fill="#2A2F35" />
        <circle cx="19" cy="16" r="1.2" fill="#2A2F35" />
        <circle cx="13.4" cy="15.7" r="0.35" fill="#00B8D4" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={`${animate ? "fox-draw" : ""} ${className ?? ""}`}
      role="img"
      aria-label="URTE fox logo"
    >
      <defs>
        <linearGradient id={`${id}-rock`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B7C0C7" />
          <stop offset="55%" stopColor="#8A949C" />
          <stop offset="100%" stopColor="#5E676E" />
        </linearGradient>
      </defs>

      {/* faint orbit cue */}
      <ellipse
        cx="118"
        cy="62"
        rx="48"
        ry="18"
        fill="none"
        stroke="#00B8D4"
        strokeOpacity="0.35"
        strokeWidth="1.2"
        className={animate ? "stroke-draw" : undefined}
      />

      {/* rock */}
      <g>
        <path
          d="M42 156 L70 128 L110 122 L148 132 L168 158 L150 172 L90 178 L52 170 Z"
          fill={`url(#${id}-rock)`}
        />
        <path d="M70 128 L90 150 L110 122 Z" fill="#8A949C" opacity="0.85" />
        <path d="M110 122 L130 148 L148 132 Z" fill="#5E676E" opacity="0.55" />
        <path
          d="M42 156 L70 128 L110 122 L148 132 L168 158"
          fill="none"
          stroke="#2A2F35"
          strokeOpacity="0.25"
          strokeWidth="1"
        />
      </g>

      {/* body */}
      <g>
        <path
          d="M78 128 C70 108 78 86 98 78 C118 70 138 80 146 98 C154 116 148 136 128 144 C108 152 88 146 78 128 Z"
          fill="#F26B1D"
        />
        <path
          d="M92 120 C96 100 112 92 126 98 C130 112 124 130 110 136 C100 140 94 132 92 120 Z"
          fill="#FF9A52"
        />
        <path
          d="M102 118 C106 108 118 106 124 112 C122 124 112 130 104 126 Z"
          fill="#FFFFFF"
        />
      </g>

      {/* head */}
      <g>
        <path d="M108 54 L96 78 L118 72 Z" fill="#B84A0C" />
        <path d="M138 52 L128 76 L148 70 Z" fill="#B84A0C" />
        <path d="M110 56 L102 72 L116 70 Z" fill="#2A2F35" />
        <path d="M136 54 L132 70 L144 68 Z" fill="#2A2F35" />
        <ellipse cx="122" cy="86" rx="28" ry="24" fill="#F26B1D" />
        <path d="M104 90 C112 78 132 76 140 90 C132 102 112 104 104 90 Z" fill="#FFFFFF" />
        <circle cx="112" cy="84" r="3.2" fill="#2A2F35" />
        <circle cx="130" cy="84" r="3.2" fill="#2A2F35" />
        <circle cx="113.1" cy="83.1" r="1" fill="#00B8D4" />
        <ellipse cx="121" cy="94" rx="3" ry="2" fill="#2A2F35" />
      </g>

      {/* legs / paw */}
      <path d="M96 140 L90 156 L102 156 Z" fill="#2A2F35" />
      <path d="M118 146 L126 158 L136 154 L128 144 Z" fill="#2A2F35" />
      <ellipse cx="132" cy="156" rx="8" ry="4" fill="#2A2F35" opacity="0.9" />

      {/* tail */}
      <g className={animate ? "fox-tail-sway" : undefined}>
        <path
          d="M78 132 C48 128 36 150 52 164 C68 176 92 162 98 148 C90 144 86 138 78 132 Z"
          fill="#F26B1D"
        />
        <path
          d="M52 156 C58 166 72 164 78 156 C68 154 58 152 52 156 Z"
          fill="#FFFFFF"
        />
        <path
          d="M78 132 C48 128 36 150 52 164"
          fill="none"
          stroke="#B84A0C"
          strokeWidth="1.5"
          className={animate ? "stroke-draw" : undefined}
        />
      </g>
    </svg>
  );
}
