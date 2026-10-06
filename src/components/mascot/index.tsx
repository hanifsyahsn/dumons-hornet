import React from "react";
import "./styles.css";

interface MascotProps {
    className?: string;
}

// Hornet mascot: a cartoon take on the logo's hornet (sharp eye, yellow/orange/ink),
// flying with a megaphone. Inline SVG so the wings, bobbing and sound waves can be
// animated in CSS (all motion is off under prefers-reduced-motion). Decorative only.
export function Mascot({ className = "" }: MascotProps) {
    return (
        <svg
            className={`mascot ${className}`}
            viewBox="-46 0 320 240"
            fill="none"
            stroke="var(--hornet-ink)"
            strokeWidth="6"
            strokeLinejoin="round"
            strokeLinecap="round"
            aria-hidden="true"
        >
            <defs>
                <clipPath id="mascot-abdomen">
                    <ellipse cx="190" cy="138" rx="50" ry="32" />
                </clipPath>
            </defs>

            <g className="mascot__body">
                {/* Wings behind the body; each flaps around its root at the thorax */}
                <path
                    className="mascot__wing mascot__wing--back"
                    d="M150 92 C 185 62 232 60 252 80 C 232 104 186 106 150 92 Z"
                    fill="var(--hornet-white)"
                />
                <path
                    className="mascot__wing mascot__wing--front"
                    d="M148 88 C 160 36 206 4 240 14 C 236 50 196 84 148 88 Z"
                    fill="var(--hornet-white)"
                />
                <path className="mascot__wing mascot__wing--front" d="M162 74 C 182 50 206 32 226 26" strokeWidth="4" />

                {/* Striped abdomen, drawn level then tilted: stripes run across it, the logo's
                    orange edge along its belly, stinger at the tip */}
                <g transform="rotate(32 190 138)">
                    <path d="M234 126 L 268 138 L 234 150 Z" fill="var(--hornet-ink)" />
                    <ellipse cx="190" cy="138" rx="50" ry="32" fill="var(--hornet-yellow)" />
                    <g clipPath="url(#mascot-abdomen)" stroke="none">
                        <ellipse cx="196" cy="160" rx="50" ry="14" fill="var(--hornet-orange)" />
                        <rect x="168" y="100" width="14" height="80" fill="var(--hornet-ink)" />
                        <rect x="194" y="100" width="14" height="80" fill="var(--hornet-ink)" />
                        <rect x="220" y="100" width="14" height="80" fill="var(--hornet-ink)" />
                    </g>
                    <ellipse cx="190" cy="138" rx="50" ry="32" />
                </g>

                {/* Thorax and legs */}
                <path d="M128 138 L 120 160 L 108 166 M148 140 L 146 164 L 134 172" strokeWidth="5" />
                <ellipse cx="142" cy="112" rx="28" ry="24" fill="var(--hornet-ink)" />

                {/* Antennae */}
                <path d="M100 52 C 96 30 82 18 66 16" />
                <path d="M118 54 C 126 32 140 22 156 22" />
                <circle cx="64" cy="16" r="7" fill="var(--hornet-ink)" />
                <circle cx="158" cy="22" r="7" fill="var(--hornet-ink)" />

                {/* Head: yellow with an orange cheek, the logo's sharp almond eye under an angry brow */}
                <circle cx="100" cy="100" r="50" fill="var(--hornet-yellow)" />
                <path d="M128 132 C 140 118 146 100 142 82 C 134 104 124 120 106 132 Z" fill="var(--hornet-orange)" stroke="none" />
                <circle cx="100" cy="100" r="50" />
                <path d="M54 88 Q 80 66 114 82 Q 96 110 62 102 Z" fill="var(--hornet-white)" />
                <circle cx="84" cy="90" r="10" fill="var(--hornet-ink)" stroke="none" />
                <circle cx="88" cy="86" r="3.5" fill="var(--hornet-white)" stroke="none" />
                <path d="M48 76 L 118 62 L 114 74 L 54 86 Z" fill="var(--hornet-ink)" />
                <path d="M128 92 Q 134 82 142 84" strokeWidth="5" />

                {/* Grin with a fang */}
                <path d="M66 124 Q 86 140 110 126" />
                <path d="M96 132 L 100 142 L 104 130" fill="var(--hornet-white)" strokeWidth="4" />

                {/* Arm holding the megaphone, pointed forward */}
                <path d="M136 128 C 132 148 122 160 108 164" strokeWidth="9" />
                <path d="M110 154 L 110 176 L 44 202 L 44 128 Z" fill="var(--hornet-orange)" />
                <path d="M110 154 L 110 176 L 92 183 L 92 147 Z" fill="var(--hornet-ink)" />
                <rect x="36" y="124" width="12" height="82" fill="var(--hornet-ink)" />
            </g>

            {/* Sound waves out of the megaphone */}
            <g className="mascot__waves" strokeWidth="6">
                <path className="mascot__wave" d="M18 142 Q 8 165 18 188" />
                <path className="mascot__wave" d="M2 128 Q -14 165 2 202" />
                <path className="mascot__wave" d="M-14 114 Q -36 165 -14 216" />
            </g>
        </svg>
    );
}
