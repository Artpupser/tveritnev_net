import React from 'react';
import type { FeaturesProps } from '../../types/landing';

const Features: React.FC<FeaturesProps> = ({ items }) => {
  return (
    <section className="py-16 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div key={index} className="p-6 border-2 border-dashed border-blue-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;