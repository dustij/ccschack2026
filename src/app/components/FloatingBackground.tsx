import { motion, useTransform, useMotionValue, MotionValue, useSpring } from 'motion/react';
import { useEffect, FC } from 'react';

interface Shape {
  color: string;
  size: string;
  initialX: number;
  initialY: number;
  delay: number;
}

const shapes: Shape[] = [
  { color: 'bg-candy-pink', size: 'w-32 h-32', initialX: 10, initialY: 20, delay: 0 },
  { color: 'bg-candy-purple', size: 'w-48 h-48', initialX: 80, initialY: 10, delay: 2 },
  { color: 'bg-candy-yellow', size: 'w-24 h-24', initialX: 20, initialY: 80, delay: 1 },
  { color: 'bg-candy-blue', size: 'w-40 h-40', initialX: 70, initialY: 60, delay: 3 },
  { color: 'bg-candy-pink', size: 'w-16 h-16', initialX: 40, initialY: 40, delay: 1.5 },
];

export default function FloatingBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
      {shapes.map((shape, i) => (
        <FloatingShape key={i} shape={shape} mouseX={mouseX} mouseY={mouseY} />
      ))}
    </div>
  );
}

interface FloatingShapeProps {
  shape: Shape;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

const FloatingShape: FC<FloatingShapeProps> = ({ shape, mouseX, mouseY }) => {
  const x = useTransform(mouseX, [0, window.innerWidth], [0, (Math.random() - 0.5) * 100]);
  const y = useTransform(mouseY, [0, window.innerHeight], [0, (Math.random() - 0.5) * 100]);
  
  // Add spring animation for smooth, slow mouse interaction
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
        // Glass material enhancement - layered on top of existing bg-candy-* color
        backgroundImage: `
          radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.25), transparent 50%),
          radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.1), transparent 40%),
          radial-gradient(circle at center, rgba(255, 255, 255, 0.05), transparent 70%)
        `,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: `
          inset 0 1px 2px rgba(255, 255, 255, 0.3),
          inset 0 -1px 2px rgba(0, 0, 0, 0.1),
          0 8px 32px rgba(0, 0, 0, 0.15),
          0 0 40px rgba(255, 255, 255, 0.1)
        `,
        transform: 'perspective(1000px) rotateX(1deg) rotateY(1deg)',
      }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 10, -10, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 6 + Math.random() * 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: shape.delay,
      }}
    />
  );
}