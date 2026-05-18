import React from 'react';
import type { PricingProps } from '../../types/landing';

const Pricing: React.FC<PricingProps> = ({ title, plans }) => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 tracking-tight">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`p-8 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col ${
                plan.isPopular 
                  ? 'border-blue-500 shadow-2xl scale-105 bg-blue-50/10' 
                  : 'border-blue-200 hover:border-blue-300'
              }`}
            >
              {plan.isPopular && (
                <span className="bg-blue-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full w-fit mb-4">
                  Хит продаж
                </span>
              )}
              
              <h3 className="text-2xl font-bold mb-1 uppercase tracking-tighter">{plan.name}</h3>
              <div className="text-3xl font-black text-blue-600 mb-4">{plan.price}</div>
              <p className="text-gray-400 mb-8 text-sm leading-relaxed">{plan.description}</p>
              
              <ul className="mb-10 space-y-4 grow">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="text-sm text-gray-700 flex items-start">
                    <span className="mt-1.5 mr-3 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all ${
                plan.isPopular 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-200 hover:bg-blue-600' 
                  : 'bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50'
              }`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;