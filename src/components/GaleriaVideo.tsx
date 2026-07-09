"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const videos = [
  {
    titulo: "Boda Ana & Carlos",
    thumbnail:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    videoId: "dQw4w9WgXcQ",
  },
  {
    titulo: "XV Años Valentina",
    thumbnail:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80",
    videoId: "dQw4w9WgXcQ",
  },
  {
    titulo: "Sesión Maternidad",
    thumbnail:
      "https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=600&q=80",
    videoId: "dQw4w9WgXcQ",
  },
];

export default function GaleriaVideo() {
  const [videoActivo, setVideoActivo] = useState<string | null>(null);

  return (
    <section className="py-24 md:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-white/50 mb-4">
            En movimiento
          </p>
          <h2 className="text-3xl md:text-5xl font-[var(--font-heading)] text-white mb-6">
            Galería de Video
          </h2>
          <div className="w-16 h-px bg-white/30 mx-auto" />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <AnimatedSection key={video.titulo} delay={index * 0.15}>
              <div
                className="group relative aspect-video overflow-hidden cursor-pointer"
                onClick={() => setVideoActivo(video.videoId)}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('${video.thumbnail}')`,
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-500" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-white/60 flex items-center justify-center group-hover:border-white group-hover:scale-110 transition-all duration-300">
                    <Play
                      size={24}
                      className="text-white ml-1"
                      fill="white"
                    />
                  </div>
                </div>

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-sm text-white/80 tracking-wide">
                    {video.titulo}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {videoActivo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setVideoActivo(null)}
          >
            <button
              onClick={() => setVideoActivo(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
              aria-label="Cerrar video"
            >
              <X size={32} />
            </button>

            <div
              className="w-full max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${videoActivo}?autoplay=1`}
                title="Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
