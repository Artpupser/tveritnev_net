import React from 'react';
import type { HeroProps } from '../../types/landing';

const Hero: React.FC<HeroProps> = ({ title, description, buttonText }) => {
  return (
    <section className="py-20 px-8">
      <div className="max-w-4xl mx-auto border-2 border-dashed border-blue-200 p-10 rounded-2xl">
        <h1 className="text-4xl font-black mb-4">{title}</h1>
        <p className="text-xl text-gray-500">{description}</p>
        <button className="mt-6 px-8 py-3 bg-black text-white rounded-lg">
          {buttonText}
        </button>
      </div>
    </section>
  );
};

export default Hero;