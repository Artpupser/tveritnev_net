import React from "react";
import type { AboutProps } from "../../types/landing";

const About: React.FC<AboutProps> = ({
  avatarUrl,
  name,
  skills,
  badges,
  socials,
}) => {
  return (
    <section id="about" className="pt-50 pb-20">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row gap-12 items-center md:items-start">
        <div className="w-64 h-80 shrink-0 border-2 border-dashed border-blue-200 rounded-3xl p-3 flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <div className="text-gray-300 font-bold text-center">ФОТО</div>
          )}
        </div>

        <div className="grow flex flex-col gap-6 w-full">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-950">
            {name}
          </h2>

          <div className="border-2 border-dashed border-blue-200 p-6 rounded-3xl flex flex-col gap-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">
                Преподавание английского:
              </span>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 border border-dashed border-slate-200 text-slate-950 text-xs font-bold rounded-lg uppercase"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">
                Экскурсии и туризм:
              </span>
              <div className="flex flex-wrap gap-3">
                {badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 border border-slate-200 text-slate-950 bg-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm uppercase"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />{" "}
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="border-2 border-dashed border-blue-200 p-5 rounded-2xl flex flex-wrap gap-4 items-center">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 mr-2">
              Социальные сети:
            </span>
            <div className="flex flex-wrap gap-3">
              {socials.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-bold border-2 border-dashed border-slate-200 hover:border-black rounded-xl transition-all duration-200 active:scale-95 text-slate-600 hover:text-black uppercase"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
