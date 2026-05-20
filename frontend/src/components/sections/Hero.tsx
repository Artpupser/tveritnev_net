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
      className={`relative pt-44 pb-32 px-8 overflow-hidden min-h-[85vh] flex items-center ${
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
        </>
      )}

      <div className="container mx-auto max-w-6xl relative z-20">
        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tighter max-w-3xl">
          {title}
        </h1>
        <p
          className={`text-lg md:text-xl mb-10 leading-relaxed max-w-2xl ${
            isVideo ? "text-gray-200" : "text-gray-500"
          }`}
        >
          {description}
        </p>

        {buttonText && (
          <button
            className={`px-8 py-4 rounded-xl font-bold uppercase text-xs tracking-wider border-2 border-dashed  transition-all duration-200 active:scale-95 ${
              isVideo
                ? "border-blue-200 text-white bg-white/5 hover:bg-white hover:text-black hover:shadow-lg"
                : "border-black/30 text-black bg-black/5 hover:bg-black hover:text-white hover:border-black"
            }`}
          >
            {buttonText}
          </button>
        )}
      </div>
    </section>
  );
};

export default Hero;
