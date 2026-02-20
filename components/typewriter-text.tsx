"use client";

import React, { useState, useEffect } from "react";

interface TypewriterTextProps {
    phrases: string[];
    speed?: number;
    erasingSpeed?: number;
    waitDelay?: number;
    className?: string;
}

type TypewriterStatus = "typing" | "waiting" | "erasing";

export function TypewriterText({
    phrases,
    speed = 100,
    erasingSpeed = 50,
    waitDelay = 2000,
    className = "",
}: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [status, setStatus] = useState<TypewriterStatus>("typing");

    const currentPhrase = phrases[currentPhraseIndex];

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (status === "typing") {
            if (displayedText.length < currentPhrase.length) {
                timeoutId = setTimeout(() => {
                    setDisplayedText(currentPhrase.slice(0, displayedText.length + 1));
                }, speed);
            } else {
                setStatus("waiting");
            }
        } else if (status === "waiting") {
            timeoutId = setTimeout(() => {
                setStatus("erasing");
            }, waitDelay);
        } else if (status === "erasing") {
            if (displayedText.length > 0) {
                timeoutId = setTimeout(() => {
                    setDisplayedText(displayedText.slice(0, -1));
                }, erasingSpeed);
            } else {
                setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
                setStatus("typing");
            }
        }

        return () => clearTimeout(timeoutId);
    }, [displayedText, status, currentPhrase, phrases.length, speed, erasingSpeed, waitDelay]);

    return (
        <span className={className}>
            {displayedText}
            <span className="animate-pulse border-r-2 border-current ml-1" aria-hidden="true" />
        </span>
    );
}
