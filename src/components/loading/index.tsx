import React, { createContext, useContext, useState, type ReactNode } from "react";

interface LoadingContextValue {
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);

interface LoadingProps {
    children: ReactNode;
}

export function Loading({ children }: LoadingProps) {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}

            {loading && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#271b1d]/85 backdrop-blur-sm"
                >
                    {/* From Uiverse.io by clarencedion, recolored Hornet yellow */}
                    <div className="relative">
                        <div className="relative w-32 h-32">
                            <div
                                className="absolute w-full h-full rounded-full border-[3px] border-[#3a2a2d] border-r-[#ffff00] border-b-[#ffff00] animate-spin"
                                style={{ animationDuration: "3s" }}
                            />
                            <div
                                className="absolute w-full h-full rounded-full border-[3px] border-[#3a2a2d] border-t-[#ffff00] animate-spin"
                                style={{ animationDuration: "2s", animationDirection: "reverse" }}
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#ffff00]/20 via-transparent to-[#ffff00]/10 animate-pulse rounded-full blur-sm" />
                    </div>
                    <span className="sr-only">Memuat…</span>
                </div>
            )}
        </LoadingContext.Provider>
    );
}

export function useLoading(): LoadingContextValue | undefined {
    return useContext(LoadingContext);
}
