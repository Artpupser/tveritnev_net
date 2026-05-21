import React from "react";
import type { AboutProps } from "../../types/landing";

const getSocialIcon = (name: string) => {
  const normalizedName = name.toUpperCase();

  switch (normalizedName) {
    case "VK":
      return (
        <svg
          viewBox="0 0 1024 1024"
          className="w-7 h-7"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="512" cy="512" r="512" style={{ fill: "#2787f5" }} />
          <path
            d="M585.83 271.5H438.17c-134.76 0-166.67 31.91-166.67 166.67v147.66c0 134.76 31.91 166.67 166.67 166.67h147.66c134.76 0 166.67-31.91 166.67-166.67V438.17c0-134.76-32.25-166.67-166.67-166.67zm74 343.18h-35c-13.24 0-17.31-10.52-41.07-34.62-20.71-20-29.87-22.74-35-22.74-7.13 0-9.17 2-9.17 11.88v31.57c0 8.49-2.72 13.58-25.12 13.58-37 0-78.07-22.4-106.93-64.16-43.45-61.1-55.33-106.93-55.33-116.43 0-5.09 2-9.84 11.88-9.84h35c8.83 0 12.22 4.07 15.61 13.58 17.31 49.9 46.17 93.69 58 93.69 4.41 0 6.45-2 6.45-13.24v-51.6c-1.36-23.76-13.92-25.8-13.92-34.28 0-4.07 3.39-8.15 8.83-8.15h55c7.47 0 10.18 4.07 10.18 12.9v69.58c0 7.47 3.39 10.18 5.43 10.18 4.41 0 8.15-2.72 16.29-10.86 25.12-28.17 43.11-71.62 43.11-71.62 2.38-5.09 6.45-9.84 15.28-9.84h35c10.52 0 12.9 5.43 10.52 12.9-4.41 20.37-47.18 80.79-47.18 80.79-3.73 6.11-5.09 8.83 0 15.61 3.73 5.09 16 15.61 24.1 25.12 14.94 17 26.48 31.23 29.53 41.07 3.45 9.84-1.65 14.93-11.49 14.93z"
            style={{ fill: "#fff" }}
          />
        </svg>
      );
    case "MAX":
      return (
        <svg
          viewBox="0 0 1000 1000"
          className="w-7 h-7"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="b">
              <stop offset="0" stopColor="#00f" />
              <stop offset="1" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="a">
              <stop offset="0" stopColor="#4cf" />
              <stop offset=".662" stopColor="#53e" />
              <stop offset="1" stopColor="#93d" />
            </linearGradient>
            <linearGradient
              id="c"
              x1="117.847"
              x2="1000"
              y1="760.536"
              y2="500"
              gradientUnits="userSpaceOnUse"
              href="#a"
            />
            <radialGradient
              id="d"
              cx="-87.392"
              cy="1166.116"
              r="500"
              fx="-87.392"
              fy="1166.116"
              gradientTransform="rotate(51.356 1551.478 559.3)scale(2.42703433 1)"
              gradientUnits="userSpaceOnUse"
              href="#b"
            />
          </defs>
          <rect width="1000" height="1000" fill="url(#c)" ry="249.681" />
          <rect width="1000" height="1000" fill="url(#d)" ry="249.681" />
          <path
            fill="#fff"
            fillRule="evenodd"
            d="M508.211 878.328c-75.007 0-109.864-10.95-170.453-54.75-38.325 49.275-159.686 87.783-164.979 21.9 0-49.456-10.95-91.248-23.36-136.873-14.782-56.21-31.572-118.807-31.572-209.508 0-216.626 177.754-379.597 388.357-379.597 210.785 0 375.947 171.001 375.947 381.604.707 207.346-166.595 376.118-373.94 377.224m3.103-571.585c-102.564-5.292-182.499 65.7-200.201 177.024-14.6 92.162 11.315 204.398 33.397 210.238 10.585 2.555 37.23-18.98 53.837-35.587a189.8 189.8 0 0 0 92.71 33.032c106.273 5.112 197.08-75.794 204.215-181.95 4.154-106.382-77.67-196.486-183.958-202.574Z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "TG":
    case "TELEGRAM":
      return (
        <svg
          viewBox="0 0 240 240"
          className="w-7 h-7"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="tgGradient"
              gradientUnits="userSpaceOnUse"
              x1="-683.305"
              y1="534.845"
              x2="-693.305"
              y2="511.512"
              gradientTransform="matrix(6 0 0 -6 4255 3247)"
            >
              <stop offset="0" stopColor="#37aee2" />
              <stop offset="1" stopColor="#1e96c8" />
            </linearGradient>
            <linearGradient
              id="tgPaperGradient"
              gradientUnits="userSpaceOnUse"
              x1="128.991"
              y1="118.245"
              x2="153.991"
              y2="78.245"
              gradientTransform="matrix(1 0 0 -1 0 242)"
            >
              <stop offset="0" stopColor="#eff7fc" />
              <stop offset="1" stopColor="#ffffff" />
            </linearGradient>
          </defs>
          <path
            id="path2995-1-0"
            fill="url(#tgGradient)"
            d="M240 120c0 66.3-53.7 120-120 120S0 186.3 0 120 53.7 0 120 0s120 53.7 120 120z"
          />
          <path
            id="path2993"
            fill="#c8daea"
            d="M98 175c-3.9 0-3.2-1.5-4.6-5.2L82 132.2 152.8 88l8.3 2.2-6.9 18.8L98 175z"
          />
          <path
            id="path2989"
            fill="#a9c9dd"
            d="M98 175c3 0 4.3-1.4 6-3 2.6-2.5 36-35 36-35l-20.5-5-19 12-2.5 30v1z"
          />
          <path
            id="path2991"
            fill="url(#tgPaperGradient)"
            d="M100 144.4l48.4 35.7c5.5 3 9.5 1.5 10.9-5.1L179 82.2c2-8.1-3.1-11.7-8.4-9.3L55 117.5c-7.9 3.2-7.8 7.6-1.4 9.5l29.7 9.3L152 93c3.2-2 6.2-.9 3.8 1.3L100 144.4z"
          />
        </svg>
      );
    default:
      return (
        <span className="text-xs font-bold text-slate-500 uppercase">
          {name.slice(0, 3)}
        </span>
      );
  }
};

const About: React.FC<AboutProps> = ({
  avatarUrl,
  name,
  skills,
  badges,
  socials,
}) => {
  return (
    <section id="about" className="pt-50 pb-20 select-none">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row gap-12 items-center md:items-start">
        <div className="w-64 h-80 shrink-0 border border-slate-200 rounded-3xl p-3 flex items-center justify-center overflow-hidden group bg-slate-50/50">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover rounded-2xl transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="text-slate-300 font-bold text-center">ФОТО</div>
          )}
        </div>

        <div className="grow flex flex-col gap-6 w-full">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-950">
            {name}
          </h2>

          <div className="border border-slate-200 p-6 rounded-3xl flex flex-col gap-6 bg-slate-50/30">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">
                Преподавание английского:
              </span>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 border border-slate-200 text-slate-950 text-xs font-bold rounded-lg uppercase bg-white shadow-sm"
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

          <div className="border border-slate-200 p-5 rounded-2xl flex flex-wrap gap-4 items-center bg-white">
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
                  title={link.name}
                  className="w-11 h-11 flex items-center justify-center border border-slate-200 hover:border-slate-300 rounded-xl bg-white shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 ease-out"
                >
                  {getSocialIcon(link.name)}
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
