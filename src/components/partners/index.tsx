import React, { useState } from "react";
import "./styles.css";

export interface Partner {
    name: string;
    city: string;
    address: string;
    // Google Maps link to the workshop; omitted -> no map button
    mapsUrl?: string;
    // wa.me link of the workshop; omitted -> no chat button
    whatsappUrl?: string;
}

interface PartnersProps {
    partners: Partner[];
}

const ALL = "Semua";
// Cards shown before "Lihat semua" when no city is picked
const INITIAL_COUNT = 9;

// Partner workshops: city filter chips over a card grid. Server-renders the first
// INITIAL_COUNT of all cities; filtering and "show all" work after hydration.
export function Partners({ partners }: PartnersProps) {
    const cities = Array.from(new Set(partners.map((partner) => partner.city))).sort((a, b) =>
        a.localeCompare(b, "id"),
    );
    const [city, setCity] = useState(ALL);
    const [expanded, setExpanded] = useState(false);

    const filtered = city === ALL ? partners : partners.filter((partner) => partner.city === city);
    const limited = city === ALL && !expanded && filtered.length > INITIAL_COUNT;
    const visible = limited ? filtered.slice(0, INITIAL_COUNT) : filtered;

    return (
        <div className="partners">
            {cities.length > 1 && (
                <div className="partners__filters" role="group" aria-label="Pilih kota">
                    {[ALL, ...cities].map((option) => (
                        <button
                            type="button"
                            key={option}
                            className={`partners__chip${option === city ? " partners__chip--active" : ""}`}
                            aria-pressed={option === city}
                            onClick={() => setCity(option)}
                        >
                            <span>{option}</span>
                        </button>
                    ))}
                </div>
            )}

            <ul className="partners__grid">
                {visible.map(({ name, city: partnerCity, address, mapsUrl, whatsappUrl }) => (
                    <li className="partner" key={`${name}-${partnerCity}`}>
                        <span className="partner__city">{partnerCity}</span>
                        <h3 className="partner__name">{name}</h3>
                        <p className="partner__address">{address}</p>

                        {(mapsUrl || whatsappUrl) && (
                            <div className="partner__actions">
                                {mapsUrl && (
                                    <a
                                        className="partner__link"
                                        href={mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Lihat peta
                                    </a>
                                )}
                                {whatsappUrl && (
                                    <a
                                        className="partner__link"
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Chat bengkel
                                    </a>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {limited && (
                <div className="partners__more">
                    <button
                        type="button"
                        className="button button--lg button--white"
                        onClick={() => setExpanded(true)}
                    >
                        <span>Lihat semua ({filtered.length})</span>
                    </button>
                </div>
            )}
        </div>
    );
}
