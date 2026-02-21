'use client';

import { motion, useTransform, useMotionValue, MotionValue, useSpring } from 'motion/react';
import { useEffect, useState, FC } from 'react';

interface Shape {
    color: string;
    size: string;
    initialX: number;
    initialY: number;
    delay: number;
    parallaxStrength: number;
}

const shapes: Shape[] = [
    { color: 'bg-candy-pink', size: 'w-32 h-32', initialX: 10, initialY: 20, delay: 0, parallaxStrength: 60 },
    { color: 'bg-candy-purple', size: 'w-48 h-48', initialX: 80, initialY: 10, delay: 2, parallaxStrength: -80 },
    { color: 'bg-candy-yellow', size: 'w-24 h-24', initialX: 20, initialY: 80, delay: 1, parallaxStrength: 50 },
    { color: 'bg-candy-blue', size: 'w-40 h-40', initialX: 70, initialY: 60, delay: 3, parallaxStrength: -60 },
    { color: 'bg-candy-pink', size: 'w-16 h-16', initialX: 40, initialY: 40, delay: 1.5, parallaxStrength: 40 },
];

export default function FloatingBackground() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [dimensions, setDimensions] = useState({ w: 1440, h: 900 });

    useEffect(() => {
        setDimensions({ w: window.innerWidth, h: window.innerHeight });
        const handle = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handle);
        return () => window.removeEventListener('mousemove', handle);
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
            {shapes.map((shape, i) => (
                <FloatingShape
                    key={i}
                    shape={shape}
                    mouseX={mouseX}
                    mouseY={mouseY}
                    winW={dimensions.w}
                    winH={dimensions.h}
                />
            ))}
        </div>
    );
}

interface FloatingShapeProps {
    shape: Shape;
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
    winW: number;
    winH: number;
}

const FloatingShape: FC<FloatingShapeProps> = ({ shape, mouseX, mouseY, winW, winH }) => {
    const x = useTransform(mouseX, [0, winW], [0, shape.parallaxStrength]);
    const y = useTransform(mouseY, [0, winH], [0, shape.parallaxStrength * 0.6]);
    const springX = useSpring(x, { stiffness: 50, damping: 30, mass: 1 });
    const springY = useSpring(y, { stiffness: 50, damping: 30, mass: 1 });

    return (
        <motion.div
            className={`absolute rounded-[2rem] opacity-60 backdrop-blur-3xl ${shape.color} ${shape.size}`}
            style={{
                left: `${shape.initialX}%`,
                top: `${shape.initialY}%`,
                x: springX,
                y: springY,
                backgroundImage: `
          radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 50%),
          radial-gradient(circle at 70% 70%, rgba(255,255,255,0.1), transparent 40%)
        `,
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: `
          inset 0 1px 2px rgba(255,255,255,0.3),
          0 8px 32px rgba(0,0,0,0.15)
        `,
            }}
            animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{
                duration: 6 + shape.delay,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: shape.delay,
            }}
        />
    );
};
