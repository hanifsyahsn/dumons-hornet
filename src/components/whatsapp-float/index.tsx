import React, { useEffect, useState } from "react";
import { WHATSAPP_URL } from "../../constants/brand";
import "./styles.css";

interface WhatsAppFloatProps {
    // Element id of the contact section: the button hides while it's on screen
    // (its own WhatsApp button is right there)
    hideOverId?: string;
}

// Shows once the visitor scrolls past roughly the first screen
const SHOW_AFTER = 600;

// Floating WhatsApp button in the bottom-right corner, so a chat is one tap away from
// any section. Rendered hidden on the server; shown after hydration while scrolled down.
export function WhatsAppFloat({ hideOverId }: WhatsAppFloatProps) {
    const [scrolled, setScrolled] = useState(false);
    const [overContact, setOverContact] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > SHOW_AFTER);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const target = hideOverId ? document.getElementById(hideOverId) : null;
        if (!target) return;
        const observer = new IntersectionObserver(([entry]) => setOverContact(entry.isIntersecting), {
            threshold: 0.25,
        });
        observer.observe(target);
        return () => observer.disconnect();
    }, [hideOverId]);

    const visible = scrolled && !overContact;

    return (
        <a
            className={`wa-float${visible ? " wa-float--visible" : ""}`}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat via WhatsApp"
            aria-hidden={!visible}
            tabIndex={visible ? undefined : -1}
        >
            <span className="wa-float__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />
                </svg>
            </span>
            <span className="wa-float__label">Chat</span>
        </a>
    );
}
