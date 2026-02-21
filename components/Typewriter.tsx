'use client';

import { useState, useEffect } from 'react';

interface TypewriterProps {
    text: string;
    speed?: number;
    onComplete?: () => void;
}

export function Typewriter({ text, speed = 25, onComplete }: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);

            return () => clearTimeout(timeout);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, text, speed, onComplete]);

    return <>{displayedText}</>;
}
