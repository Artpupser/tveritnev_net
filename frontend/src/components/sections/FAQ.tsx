import React, { useState } from "react";
import type { FAQProps } from "@appTypes/landing";

const FAQ: React.FC<FAQProps> = ({ title, items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 select-none">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-950 mb-12">
          {title}
        </h2>

        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-white"
              >
                <button
                  onClick={() => toggleItem(idx)}
                  className="w-full py-5 px-6 flex justify-between items-center text-left font-bold text-slate-900 hover:bg-slate-50/50 transition-colors duration-150 group"
                >
                  <span className="text-sm md:text-base tracking-tight">
                    {item.question}
                  </span>

                  <svg
                    className={`w-4 h-4 text-slate-400 group-hover:text-slate-950 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-45 text-slate-950" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      className={`px-6 pb-6 text-xs md:text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-4 transition-all duration-300 ease-out ${
                        isOpen
                          ? "opacity-100 translate-y-0 delay-75"
                          : "opacity-0 -translate-y-2"
                      }`}
                    >
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
