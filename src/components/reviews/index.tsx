import React, { useCallback, useEffect, useRef, useState } from "react";
import "./styles.css";

export interface Review {
    quote: string;
    name: string;
    company: string;
    city: string;
    year: number;
    // Profile photo served from /public (any size, shown square); omitted -> initials
    photo?: string;
}

interface ReviewsProps {
    reviews: Review[];
}

// Autoplay advances every AUTOPLAY_MS; any manual switch (buttons, dots, swipe) stops it
// and it resumes RESUME_MS after the last one. Off entirely under prefers-reduced-motion.
const AUTOPLAY_MS = 7000;
const RESUME_MS = 3 * 60 * 1000;

const initials = (name: string) =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join("");

const pad = (n: number) => String(n).padStart(2, "0");

// Customer reviews carousel: one review per slide on a scroll-snap track, so phones can
// swipe natively; buttons and dots scroll the track (never the page).
export function Reviews({ reviews }: ReviewsProps) {
    const count = reviews.length;
    const trackRef = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReducedMotion(query.matches);
        update();
        query.addEventListener("change", update);
        return () => query.removeEventListener("change", update);
    }, []);

    const goTo = useCallback(
        (target: number) => {
            const track = trackRef.current;
            if (!track || count === 0) return;
            const next = (target + count) % count;
            setIndex(next);
            track.scrollTo({ left: next * track.clientWidth, behavior: reducedMotion ? "auto" : "smooth" });
        },
        [count, reducedMotion],
    );

    // Manual switch: stop autoplay; every further switch restarts the RESUME_MS wait
    // (the resume effect below depends on pauseKey).
    const [pauseKey, setPauseKey] = useState(0);
    const pause = useCallback(() => {
        setPaused(true);
        setPauseKey((key) => key + 1);
    }, []);

    useEffect(() => {
        if (!paused) return;
        const timer = window.setTimeout(() => setPaused(false), RESUME_MS);
        return () => window.clearTimeout(timer);
    }, [paused, pauseKey]);

    const autoplay = count > 1 && !paused && !reducedMotion;

    useEffect(() => {
        if (!autoplay) return;
        const timer = window.setTimeout(() => goTo(index + 1), AUTOPLAY_MS);
        return () => window.clearTimeout(timer);
    }, [autoplay, index, goTo]);

    // Keeps the dots in sync while the track is swiped (or scrolled by goTo)
    const onScroll = () => {
        const track = trackRef.current;
        if (!track || track.clientWidth === 0) return;
        const current = Math.round(track.scrollLeft / track.clientWidth);
        if (current !== index && current >= 0 && current < count) setIndex(current);
    };

    // Re-align on resize, since slide width follows the track width
    useEffect(() => {
        const onResize = () => {
            const track = trackRef.current;
            if (track) track.scrollTo({ left: index * track.clientWidth });
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [index]);

    const onWheel = (event: React.WheelEvent) => {
        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) pause();
    };

    if (count === 0) return null;

    return (
        <div className="reviews" role="region" aria-roledescription="carousel" aria-label="Ulasan pelanggan">
            <div
                className="reviews__track"
                ref={trackRef}
                onScroll={onScroll}
                onTouchStart={pause}
                onWheel={onWheel}
                // Announce slide changes only when the visitor is driving them
                aria-live={autoplay ? "off" : "polite"}
            >
                {reviews.map(({ quote, name, company, city, year, photo }, i) => (
                    <figure
                        className="review"
                        key={`${name}-${i}`}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${i + 1} dari ${count}`}
                        aria-hidden={i !== index}
                    >
                        <div className="review__card">
                            <span className="review__mark" aria-hidden="true">
                                &ldquo;
                            </span>
                            <blockquote className="review__quote">
                                <p>{quote}</p>
                            </blockquote>

                            <figcaption className="review__author">
                                <span className="review__avatar">
                                    {photo ? (
                                        <img src={photo} alt="" loading="lazy" decoding="async" />
                                    ) : (
                                        <span className="review__initials" aria-hidden="true">
                                            {initials(name)}
                                        </span>
                                    )}
                                </span>
                                <span className="review__who">
                                    <span className="review__name">{name}</span>
                                    <span className="review__company">{company}</span>
                                    <span className="review__meta">
                                        {city} &middot; {year}
                                    </span>
                                </span>
                            </figcaption>
                        </div>
                    </figure>
                ))}
            </div>

            {count > 1 && (
                <div className="reviews__controls">
                    <button
                        type="button"
                        className="button button--lg button--dark reviews__arrow"
                        aria-label="Ulasan sebelumnya"
                        onClick={() => {
                            pause();
                            goTo(index - 1);
                        }}
                    >
                        <span aria-hidden="true">&larr;</span>
                    </button>

                    <div className="reviews__status">
                        <span className="reviews__counter">
                            {pad(index + 1)} / {pad(count)}
                        </span>
                        <div className="reviews__dots">
                            {reviews.map((_, i) => (
                                <button
                                    type="button"
                                    key={i}
                                    className={`reviews__dot${i === index ? " reviews__dot--active" : ""}`}
                                    aria-label={`Ulasan ${i + 1}`}
                                    aria-current={i === index}
                                    onClick={() => {
                                        pause();
                                        goTo(i);
                                    }}
                                />
                            ))}
                        </div>
                        {/* Countdown to the next auto switch; restarts on each slide (keyed) */}
                        <span className="reviews__progress" aria-hidden="true">
                            {autoplay && (
                                <span
                                    className="reviews__progress-bar"
                                    key={index}
                                    style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                                />
                            )}
                        </span>
                    </div>

                    <button
                        type="button"
                        className="button button--lg button--dark reviews__arrow"
                        aria-label="Ulasan berikutnya"
                        onClick={() => {
                            pause();
                            goTo(index + 1);
                        }}
                    >
                        <span aria-hidden="true">&rarr;</span>
                    </button>
                </div>
            )}
        </div>
    );
}
