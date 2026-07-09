"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { numero: 500, sufijo: "+", label: "Sesiones realizadas" },
  { numero: 300, sufijo: "+", label: "Eventos cubiertos" },
  { numero: 100, sufijo: "%", label: "Clientes satisfechos" },
  { numero: 10, sufijo: "+", label: "Años de experiencia" },
];

function Counter({
  target,
  sufijo,
  inView,
}: {
  target: number;
  sufijo: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span>
      {count}
      {sufijo}
    </span>
  );
}

export default function Estadisticas() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-24 md:py-32 bg-[#0a0a0a] border-y border-white/5">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center"
            >
              <p className="text-4xl md:text-5xl lg:text-6xl font-[var(--font-heading)] text-white mb-2">
                <Counter
                  target={stat.numero}
                  sufijo={stat.sufijo}
                  inView={isInView}
                />
              </p>
              <p className="text-sm text-white/50 tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
