import React, { useEffect, useRef, useState } from "react";
import { MASCOT_VIEWBOX, Mascot, SPEED_LINES } from "../mascot";
import "./styles.css";

// Where the hornet hovers relative to the pointer: up and to the right, so it never sits
// on the text being pointed at
const OFFSET_X = 20;
const OFFSET_Y = -52;
// Once the pointer moves away it waits this long before setting off, counted from the
// first move, so a pointer that keeps moving can't keep it waiting forever...
const DELAY = 350;
// ...then closes this share of the gap per 60fps frame, never faster than MAX_SPEED px
const EASE = 0.06;
const MAX_SPEED = 12;

// The hornet mascot lazily chasing the mouse inside its parent element (which must be
// positioned): it lets the pointer go first, then glides after it, tilting into the
// motion and turning to face where it's heading. Mouse/trackpad only (nothing on touch
// screens) and off under prefers-reduced-motion; the server renders nothing, so it can't
// affect hydration. Decorative only.
export function MascotFollower() {
    const ref = useRef<HTMLDivElement>(null);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const query = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
        setEnabled(window.matchMedia(query).matches);
    }, []);

    useEffect(() => {
        const element = ref.current;
        const area = element?.parentElement;
        if (!enabled || !element || !area) return;

        const pos = { x: 0, y: 0 };
        const target = { x: 0, y: 0 };
        const client = { x: 0, y: 0 };
        let shown = false;
        let chasing = false;
        let facing = 1;
        // When it started waiting to set off (0: not waiting)
        let waitSince = 0;
        let lastFrame = 0;
        let frame = 0;

        const aim = () => {
            const rect = area.getBoundingClientRect();
            target.x = client.x - rect.left + OFFSET_X;
            target.y = client.y - rect.top + OFFSET_Y;
        };

        const draw = (tilt: number) => {
            element.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${tilt}deg)`;
            element.style.setProperty("--facing", String(facing));
        };

        const tick = (now: number) => {
            // Frame-rate independent: steps are scaled to a 60fps frame
            const scale = Math.min((now - lastFrame) / (1000 / 60), 3);
            lastFrame = now;

            const dx = target.x - pos.x;
            const dy = target.y - pos.y;
            const distance = Math.hypot(dx, dy);

            if (!chasing && distance > 4) {
                if (!waitSince) waitSince = now;
                if (now - waitSince >= DELAY) {
                    chasing = true;
                    waitSince = 0;
                }
            } else if (!chasing) {
                // Pointer came back before it set off: the next move waits afresh
                waitSince = 0;
            }

            let tilt = 0;
            if (chasing) {
                const step = Math.min(distance * EASE * scale, MAX_SPEED * scale);
                pos.x += (dx / distance) * step;
                pos.y += (dy / distance) * step;
                // Turn around only on a clear sideways move, so it doesn't flicker
                if (Math.abs(dx) > 24) facing = dx > 0 ? 1 : -1;
                tilt = Math.max(-14, Math.min(14, (dx / distance) * step * 1.6));
                if (distance - step < 1) chasing = false;
            }
            draw(tilt);

            // Keep going while chasing or still waiting to set off; rest otherwise
            frame = chasing || distance > 4 ? requestAnimationFrame(tick) : 0;
        };

        const wake = () => {
            if (frame) return;
            lastFrame = performance.now();
            frame = requestAnimationFrame(tick);
        };

        const onMove = (event: PointerEvent) => {
            if (event.pointerType !== "mouse") return;
            client.x = event.clientX;
            client.y = event.clientY;
            aim();
            if (!shown) {
                // First sight: appear a little off to the side and fly in
                shown = true;
                pos.x = target.x - 90;
                pos.y = target.y + 50;
                draw(0);
                element.classList.add("mascot-follower--shown");
            }
            wake();
        };

        const onLeave = () => {
            shown = false;
            element.classList.remove("mascot-follower--shown");
        };

        // Scrolling moves the area under a still pointer, so re-aim from its last position
        const onScroll = () => {
            if (!shown) return;
            aim();
            wake();
        };

        area.addEventListener("pointermove", onMove);
        area.addEventListener("pointerleave", onLeave);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            area.removeEventListener("pointermove", onMove);
            area.removeEventListener("pointerleave", onLeave);
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(frame);
        };
    }, [enabled]);

    if (!enabled) return null;

    return (
        <div className="mascot-follower" ref={ref} aria-hidden="true">
            <div className="mascot-follower__flip">
                <Mascot />
                {/* The promo mascot's speed lines, drawn without its filter (which smears them
                    into grey at this size): white outline and hard shadow as stroke layers */}
                <svg className="mascot-follower__lines" viewBox={MASCOT_VIEWBOX}>
                    {SPEED_LINES.map((d) => (
                        <g className="mascot__line" key={d}>
                            <path className="mascot-follower__line-shadow" d={d} />
                            <path className="mascot-follower__line-outline" d={d} />
                            <path className="mascot-follower__line-ink" d={d} />
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
}
