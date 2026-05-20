import React, { useState } from "react";
import type { ServiceSwitcherProps } from "../../types/landing";

const ServiceSwitcher: React.FC<ServiceSwitcherProps> = ({
  english,
  guide,
}) => {
  const [activeTab, setActiveTab] = useState<"english" | "guide">("english");

  const currentData = activeTab === "english" ? english : guide;

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="border-2 border-dashed border-blue-200 border-slate-250 rounded-3xl p-8 bg-white relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-dashed border-slate-200 pb-6 mb-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                {activeTab === "english" ? "Образование" : "Активный отдых"}
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-950">
                {currentData.title}
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {currentData.description}
              </p>
            </div>

            <div className="relative flex items-center gap-4 text-xs font-black uppercase tracking-widest pb-2 select-none">
              <button
                onClick={() => setActiveTab("english")}
                className={`w-28 pb-2 text-center transition-colors duration-300 relative z-10 ${
                  activeTab === "english"
                    ? "text-slate-950"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Английский
              </button>

              <span className="text-slate-300 pb-2 z-10">/</span>

              <button
                onClick={() => setActiveTab("guide")}
                className={`w-28 pb-2 text-center transition-colors duration-300 relative z-10 ${
                  activeTab === "guide"
                    ? "text-slate-950"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Экскурсии
              </button>

              <span
                className={`absolute bottom-0 h-0.5 bg-slate-950 transition-all duration-300 ease-in-out ${
                  activeTab === "english" ? "left-0 w-28" : "left-36 w-28"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
            <div className="border-2 border-dashed border-slate-200 p-5 rounded-2xl flex flex-col gap-3 h-fit bg-slate-50/50">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 text-center">
                Быстрая связь:
              </span>

              <a
                href={currentData.vkUrl}
                target="_blank"
                className="w-full py-3 px-4 text-center border-2 border-dashed border-slate-200 hover:border-slate-950 text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95"
              >
                Сообщение VK
              </a>

              <a
                href={currentData.maxUrl}
                target="_blank"
                className="w-full py-3 px-4 text-center border-2 border-dashed border-slate-200 hover:border-slate-950 text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95"
              >
                Сообщение MAX
              </a>

              <a
                href={currentData.tgUrl}
                target="_blank"
                className="w-full py-3 px-4 text-center border-2 border-dashed border-slate-200 hover:border-slate-950 text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95"
              >
                Сообщение Telegram
              </a>
            </div>

            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentData.plans.map((plan, idx) => (
                  <div
                    key={idx}
                    className="p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-white flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-black uppercase tracking-tight text-slate-900">
                        {plan.name}
                      </h4>
                      <div className="text-2xl font-black text-slate-950">
                        {plan.price}
                      </div>
                    </div>

                    <ul className="space-y-2 mb-6 grow">
                      {plan.features.map((feat, fIdx) => (
                        <li
                          key={fIdx}
                          className="text-xs text-slate-500 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-slate-200 pt-6 text-center md:text-left">
                <span className="text-xs font-bold text-slate-400 mr-2 uppercase">
                  Телефон для связи:
                </span>
                <a
                  href={`tel:${currentData.phone}`}
                  className="font-black text-lg text-slate-800 hover:text-slate-950 hover:underline transition-colors"
                >
                  {currentData.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSwitcher;
