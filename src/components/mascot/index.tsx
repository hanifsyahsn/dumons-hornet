import React from "react";
import {
    ABDOMEN_INK,
    ABDOMEN_ORANGE,
    ABDOMEN_YELLOW,
    HEAD_INK,
    HEAD_ORANGE,
    HEAD_WHITE,
    HEAD_YELLOW,
    MASCOT_FLIP,
    WING_BASE,
    WING_INK,
} from "./paths";
import "./styles.css";

interface MascotProps {
    className?: string;
}

// Hornet mascot: the logo hornet itself (traced from logo.webp, see paths.ts) flying,
// with speed lines. Inline SVG so the wings, bobbing and speed lines can be animated in
// CSS (all motion is off under prefers-reduced-motion). Decorative only.
export function Mascot({ className = "" }: MascotProps) {
    return (
        <svg className={`mascot ${className}`} viewBox="-10 80 920 910" aria-hidden="true">
            <g className="mascot__body">
                {/* Wing flaps around its root at the head; the transform attribute stays on
                    the inner group so the CSS animation doesn't replace it */}
                <g className="mascot__wing">
                    <g transform={MASCOT_FLIP}>
                        <path d={WING_BASE} fill="var(--hornet-white)" />
                        <path d={WING_INK} fill="var(--hornet-ink)" />
                    </g>
                </g>

                <g transform={MASCOT_FLIP}>
                    <path d={ABDOMEN_YELLOW} fill="var(--hornet-yellow)" />
                    <path d={ABDOMEN_ORANGE} fill="var(--hornet-orange)" />
                    <path d={ABDOMEN_INK} fill="var(--hornet-ink)" />

                    <path d={HEAD_YELLOW} fill="var(--hornet-yellow)" />
                    <path d={HEAD_ORANGE} fill="var(--hornet-orange)" />
                    <path d={HEAD_WHITE} fill="var(--hornet-white)" />
                    <path d={HEAD_INK} fill="var(--hornet-ink)" />
                </g>
            </g>

            {/* Speed lines trailing behind */}
            <g className="mascot__lines" stroke="var(--hornet-ink)" strokeWidth="22" strokeLinecap="round">
                <path className="mascot__line" d="M250 700 L 110 760" />
                <path className="mascot__line" d="M290 790 L 60 890" />
                <path className="mascot__line" d="M340 880 L 200 940" />
            </g>
        </svg>
    );
}
