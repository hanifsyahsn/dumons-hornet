import React, { useEffect, useRef, useState } from "react";

interface CountUpProps {
    value: number;
    // Animation length in ms
    duration?: number;
}

const format = (n: number) => new Intl.NumberFormat("id-ID").format(n);

// Number that counts up from 0 the first time it scrolls into view. The server renders
// the final value (crawlers and no-JS see the real number); it only resets to 0 after
// hydration if it's still off screen, and stays put under prefers-reduced-motion.
export function CountUp({ value, duration = 1400 }: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const [shown, setShown] = useState(value);

    useEffect(() => {
        const element = ref.current;
        if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (element.getBoundingClientRect().top < window.innerHeight) return;

        setShown(0);
        let frame = 0;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                const start = performance.now();
                const tick = (now: number) => {
                    const t = Math.min((now - start) / duration, 1);
                    // easeOutCubic: fast start, gentle landing
                    setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
                    if (t < 1) frame = requestAnimationFrame(tick);
                };
                frame = requestAnimationFrame(tick);
            },
            { threshold: 0.6 },
        );
        observer.observe(element);
        return () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [value, duration]);

    return <span ref={ref}>{format(shown)}</span>;
}
