import { useState, useEffect, useRef } from 'react';

interface Props {
  value: string;
}

export const StatCounter = ({ value }: Props) => {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  // Separamos prefijo (ej: "$"), número (ej: "2.5") y sufijo (ej: "B") para no perder decimales
  const match = value.match(/^(\D*)([\d.]+)(.*)$/);
  const [, prefix, numberPart, suffix] = match ?? ['', '', value, ''];
  const targetNumber = parseFloat(numberPart) || 0;
  const decimals = numberPart.includes('.') ? numberPart.split('.')[1].length : 0;

  useEffect(() => {
    // 1. Detectar cuando el elemento entra en pantalla
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.5 });

    if (domRef.current) observer.observe(domRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // 2. Lógica de la animación de los números
    if (isVisible && current < targetNumber) {
      const duration = 1000;
      const steps = 50; 
      const increment = targetNumber / (duration / steps);

      const timer = setInterval(() => {
        setCurrent((prev) => {
          const next = prev + increment;
          if (next >= targetNumber) {
            clearInterval(timer);
            return targetNumber;
          }
          return next;
        });
      }, steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, targetNumber]);

  return (
    <div ref={domRef} className="text-5xl font-black text-[rgb(68,111,182)] mb-2 tracking-tighter drop-shadow-lg">
      {prefix}{current.toFixed(decimals)}{suffix}
    </div>
  );
};