import React from "react";
import type { HeroProps } from "../../types/landing";

const Hero: React.FC<HeroProps> = ({
  title,
  description,
  buttonText,
  videoUrl,
}) => {
  const isVideo = !!videoUrl;

  return (
    <section
      className={`relative pt-44 pb-32 px-8 overflow-hidden min-h-[85vh] flex items-end ${
        isVideo ? "text-white" : "text-slate-900 border-b border-gray-100"
      }`}
    >
      {videoUrl && (
        <>
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/50 z-10" />

          <div className="absolute bottom-0 left-0 right-0 h-50 bg-linear-to-t from-white to-transparent z-10 pointer-events-none" />
        </>
      )}

      <div className="w-full max-w-full px-12 relative z-20">
        <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight tracking-normal max-w-2xl">
          {title}
        </h1>
        <p
          className={`text-base md:text-lg mb-8 leading-relaxed max-w-xl ${
            isVideo ? "text-slate-200" : "text-slate-500"
          }`}
        >
          {description}
        </p>
        {buttonText && (
          <button
            className={`group px-7 py-3.5 rounded-xl font-bold uppercase text-[11px] tracking-widest transition-all duration-150 ease-out flex items-center gap-2.5 w-fit hover:-translate-y-px active:translate-y-px ${
              isVideo
                ? "bg-white text-slate-950 hover:bg-slate-50 active:bg-slate-200"
                : "bg-slate-950 text-white hover:bg-slate-900 active:bg-slate-800"
            }`}
          >
            <span>{buttonText}</span>

            <svg
              className="w-3.5 h-3.5 transition-transform duration-150 ease-out group-hover:translate-x-1 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
};

export default Hero;
