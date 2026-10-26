import React, { useCallback, useEffect, useRef, useState } from "react";
import "./styles.css";

export interface Review {
    // Either one quote, or the review as the customer wrote it in labeled parts
    // (e.g. product / service / delivery), shown word for word
    quote?: string;
    points?: { label: string; text: string }[];
    name: string;
    // Omitted when the name says it all (e.g. a shop) -> just the name
    company?: string;
    // Omitted while unknown -> just the year
    city?: string;
    year: number;
    // Customer photo served from /public (any size, cropped square) shown on the poster-style
    // stage beside the review; omitted -> their initials on the same stage
    photo?: string;
    // 1..5 stars; omitted -> no stars
    rating?: number;
}

const STAR_PATH = "M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z";

interface ReviewsProps {
    reviews: Review[];
}

// Autoplay advances every AUTOPLAY_MS; any manual switch (buttons, dots, swipe) stops it
// and it resumes RESUME_MS after the last one. Off entirely under prefers-reduced-motion.
const AUTOPLAY_MS = 7000;
const RESUME_MS = 3 * 60 * 1000;
// Jumps of more than one slide (and the wrap from last to first) fade out, jump, fade
// back in, instead of scrolling past every slide in between. Matches the CSS transition.
const FADE_MS = 180;
// Safety net for settling a programmatic scroll (browsers without the scrollend event)
const SETTLE_MS = 1200;

const initials = (name: string) =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join("");

const pad = (n: number) => String(n).padStart(2, "0");

// A quote up to this many characters, or a review in a single labeled part this short, is
// set bigger (a pull quote), so a short review fills its card with its own words
const SHORT_QUOTE = 200;

const isShort = ({ quote, points }: Pick<Review, "quote" | "points">) =>
    points ? points.length === 1 && points[0].text.length <= SHORT_QUOTE : (quote ?? "").length <= SHORT_QUOTE;

const SPARKLE_PATH = "M12 0c.9 6.4 5.6 11.1 12 12-6.4.9-11.1 5.6-12 12-.9-6.4-5.6-11.1-12-12C6.4 11.1 11.1 6.4 12 0z";
const DROP_PATH = "M12 1C9 7 5 10.5 5 15a7 7 0 0 0 14 0c0-4.5-4-8-7-14z";

// Shape of the ornament in the room around a shorter review; each card takes the next
// one, its bottom room the one after that
const SPACE_LOOKS = [SPARKLE_PATH, STAR_PATH, DROP_PATH];

// Room above or below a shorter review (every slide is as tall as the tallest): split
// evenly so the review sits centered from --medium, all below it on phones. Once it is
// tall enough the CSS puts one ornament in its middle: shapes and chips on a thick ink
// rule (no text, so the eye stays on the review); a phone's tall room below the review
// also gets a big closing quote mark above it
function Space({ look, side }: { look: string; side: "top" | "bottom" }) {
    return (
        <div className={`review__space review__space--${side}`} aria-hidden="true">
            <div className="review__deco">
                {side === "bottom" && <span className="review__closing">&rdquo;</span>}
                <span className="review__deco-row">
                    <span className="review__deco-group">
                        <svg className="review__shape review__shape--1" viewBox="0 0 24 24">
                            <path d={look} />
                        </svg>
                        <span className="review__chip review__chip--1" />
                        <svg className="review__shape review__shape--2" viewBox="0 0 24 24">
                            <path d={look} />
                        </svg>
                        <span className="review__chip review__chip--2" />
                        <svg className="review__shape review__shape--3" viewBox="0 0 24 24">
                            <path d={look} />
                        </svg>
                    </span>
                </span>
            </div>
        </div>
    );
}

// Customer reviews carousel: one review per slide on a scroll-snap track, so phones can
// swipe natively; buttons and dots scroll the track (never the page).
export function Reviews({ reviews }: ReviewsProps) {
    const count = reviews.length;
    const trackRef = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [fading, setFading] = useState(false);
    // Slide a button, dot or autoplay is scrolling to: until the track gets there, scroll
    // events must not move the index (they'd report the slides it passes on the way)
    const targetRef = useRef<number | null>(null);
    const settleTimer = useRef<number | undefined>(undefined);
    const fadeTimer = useRef<number | undefined>(undefined);

    useEffect(
        () => () => {
            window.clearTimeout(settleTimer.current);
            window.clearTimeout(fadeTimer.current);
        },
        [],
    );

    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReducedMotion(query.matches);
        update();
        query.addEventListener("change", update);
        return () => query.removeEventListener("change", update);
    }, []);

    // The slide the track actually shows
    const slideAt = (track: HTMLDivElement) => Math.round(track.scrollLeft / track.clientWidth);

    // Ends a programmatic scroll: snapping is back on and the index follows the track again
    const settle = useCallback(() => {
        window.clearTimeout(settleTimer.current);
        targetRef.current = null;
        const track = trackRef.current;
        if (track) track.style.scrollSnapType = "";
        if (track && track.clientWidth > 0) setIndex(Math.min(Math.max(slideAt(track), 0), count - 1));
    }, [count]);

    const goTo = useCallback(
        (target: number) => {
            const track = trackRef.current;
            if (!track || count === 0 || track.clientWidth === 0) return;
            const next = (target + count) % count;
            const left = next * track.clientWidth;
            const distance = Math.abs(next - slideAt(track));
            if (distance === 0) return;

            setIndex(next);
            targetRef.current = next;
            window.clearTimeout(settleTimer.current);
            // A click during a fade cancels its jump, and with it the fade back in: show the
            // track again here, or it stays transparent (the card vanished on rapid clicks)
            window.clearTimeout(fadeTimer.current);
            fadeTimer.current = undefined;
            setFading(false);
            settleTimer.current = window.setTimeout(settle, SETTLE_MS + FADE_MS);
            // Safari snaps a mandatory scroll-snap track back to the slide it is leaving
            // while a programmatic scroll is under way, so the arrows and dots seemed dead
            // there (swiping still worked). Snapping stays off until settle.
            track.style.scrollSnapType = "none";

            // "auto" is instant here (the track has no scroll-behavior) and, unlike
            // "instant", every browser accepts it
            if (reducedMotion) {
                track.scrollTo({ left, behavior: "auto" });
            } else if (distance > 1) {
                setFading(true);
                fadeTimer.current = window.setTimeout(() => {
                    fadeTimer.current = undefined;
                    track.scrollTo({ left, behavior: "auto" });
                    setFading(false);
                }, FADE_MS);
            } else {
                track.scrollTo({ left, behavior: "smooth" });
            }
        },
        [count, reducedMotion, settle],
    );

    // A swipe takes over from a programmatic scroll still under way
    const onTouchStart = () => {
        pause();
        if (targetRef.current !== null) settle();
    };

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

    // Keeps the dots in sync while the track is swiped. During goTo's own scroll the index
    // already points at the destination, so just wait for the track to arrive.
    const onScroll = () => {
        const track = trackRef.current;
        if (!track || track.clientWidth === 0) return;
        if (targetRef.current !== null) {
            if (Math.abs(track.scrollLeft - targetRef.current * track.clientWidth) < 2) settle();
            return;
        }
        const current = slideAt(track);
        if (current !== index && current >= 0 && current < count) setIndex(current);
    };

    // Re-align on resize, since slide width follows the track width
    useEffect(() => {
        const onResize = () => {
            const track = trackRef.current;
            if (track) track.scrollTo({ left: index * track.clientWidth, behavior: "auto" });
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [index]);

    const onWheel = (event: React.WheelEvent) => {
        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) onTouchStart();
    };

    if (count === 0) return null;

    return (
        <div className="reviews" role="region" aria-roledescription="carousel" aria-label="Ulasan pelanggan">
            <div
                className={`reviews__track${fading ? " reviews__track--fading" : ""}`}
                ref={trackRef}
                onScroll={onScroll}
                // The smooth scroll a fade interrupts ends too: wait for the fade's own jump
                onScrollEnd={() => targetRef.current !== null && fadeTimer.current === undefined && settle()}
                onTouchStart={onTouchStart}
                onWheel={onWheel}
                // Announce slide changes only when the visitor is driving them
                aria-live={autoplay ? "off" : "polite"}
            >
                {reviews.map(({ quote, points, name, company, city, year, photo, rating }, i) => (
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
                            {/* Strip of tape on the corner, numbering the review */}
                            <span className="review__tape" aria-hidden="true">
                                #{pad(i + 1)}
                            </span>

                            {/* Poster-style stage like the promo posters: dark halftone, yellow
                                wedges, white slashes, the photo pinned on it at a tilt */}
                            <div className="review__stage" aria-hidden="true">
                                <span className="review__stage-slashes" />
                                {photo ? (
                                    <img className="review__photo" src={photo} alt="" loading="lazy" decoding="async" />
                                ) : (
                                    <span className="review__photo review__photo--initials">{initials(name)}</span>
                                )}
                            </div>

                            <div className="review__body">
                                <Space look={SPACE_LOOKS[i % SPACE_LOOKS.length]} side="top" />
                                {rating !== undefined && (
                                    <span
                                        className="review__stars"
                                        role="img"
                                        aria-label={`${rating} dari 5 bintang`}
                                    >
                                        {Array.from({ length: 5 }, (_, star) => (
                                            <svg
                                                className={`review__star${star < rating ? " review__star--on" : ""}`}
                                                viewBox="0 0 24 24"
                                                key={star}
                                            >
                                                <path d={STAR_PATH} />
                                            </svg>
                                        ))}
                                    </span>
                                )}
                                {points ? (
                                    <blockquote
                                        className={`review__quote review__quote--points${isShort({ points }) ? " review__quote--short" : ""}`}
                                    >
                                        {points.map(({ label, text }) => (
                                            <div className="review__point" key={label}>
                                                <span className="review__label">{label}</span>
                                                <p>{text}</p>
                                            </div>
                                        ))}
                                    </blockquote>
                                ) : (
                                    <blockquote
                                        className={`review__quote${isShort({ quote }) ? " review__quote--short" : ""}`}
                                    >
                                        <p>{quote}</p>
                                    </blockquote>
                                )}
                                <Space look={SPACE_LOOKS[(i + 1) % SPACE_LOOKS.length]} side="bottom" />

                                <figcaption className="review__author">
                                    <span className="review__who">
                                        <span className="review__name">{name}</span>
                                        {company && <span className="review__company">{company}</span>}
                                        <span className="review__meta">
                                            {city ? <>{city} &middot; {year}</> : year}
                                        </span>
                                    </span>
                                </figcaption>
                            </div>
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
