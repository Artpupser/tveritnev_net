import React from "react";
import type { ReviewsProps } from "@appTypes/landing";

const Reviews: React.FC<ReviewsProps> = ({ title, row1, row2, row3 }) => {
  const doubleRow = (arr: any[]) => [...arr, ...arr, ...arr];

  return (
    <section id="reviews" className="py-20 select-none overflow-hidden">
      <style>{`
        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        @keyframes scrollRight {
          0% {
            transform: translateX(-33.33%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-ticker-left {
          display: flex;
          width: max-content;
          animation: scrollLeft 45s linear infinite;
        }
        .animate-ticker-right {
          display: flex;
          width: max-content;
          animation: scrollRight 45s linear infinite;
        }
        .animate-ticker-left:hover,
        .animate-ticker-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="container mx-auto max-w-6xl mb-12">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-950">
          {title}
        </h2>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex overflow-hidden select-none w-full">
          <div className="animate-ticker-right gap-6 px-4">
            {doubleRow(row1).map((item, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-3 py-4 px-8 border border-slate-200 hover:border-slate-950 rounded-full bg-white transition-colors duration-250 cursor-pointer whitespace-nowrap text-sm shadow-sm hover:bg-slate-50/50"
              >
                <span className="text-slate-700 leading-relaxed font-medium">
                  “{item.text}”
                </span>
                <span className="text-slate-300">/</span>
                <span className="font-bold text-slate-950 uppercase text-xs tracking-wider">
                  {item.author}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex overflow-hidden select-none w-full">
          <div className="animate-ticker-left gap-6 px-4">
            {doubleRow(row2).map((item, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-3 py-4 px-8 border border-slate-200 hover:border-slate-950 rounded-full bg-slate-50 hover:bg-white transition-colors duration-250 cursor-pointer whitespace-nowrap text-sm shadow-sm"
              >
                <span className="text-slate-700 leading-relaxed font-medium">
                  “{item.text}”
                </span>
                <span className="text-slate-300">/</span>
                <span className="font-bold text-slate-950 uppercase text-xs tracking-wider">
                  {item.author}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex overflow-hidden select-none w-full">
          <div className="animate-ticker-right gap-6 px-4">
            {doubleRow(row3).map((item, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-3 py-4 px-8 border border-slate-200 hover:border-slate-950 rounded-full bg-white transition-colors duration-250 cursor-pointer whitespace-nowrap text-sm shadow-sm hover:bg-slate-50/50"
              >
                <span className="text-slate-700 leading-relaxed font-medium">
                  “{item.text}”
                </span>
                <span className="text-slate-300">/</span>
                <span className="font-bold text-slate-950 uppercase text-xs tracking-wider">
                  {item.author}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;