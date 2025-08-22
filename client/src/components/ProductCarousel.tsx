import React, { useState } from 'react';

interface CarouselItem {
  url: string;
  type: 'image' | 'video';
  name?: string;
}

interface ProductCarouselProps {
  items: CarouselItem[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ items }) => {
  const [current, setCurrent] = useState(0);
  if (!items || items.length === 0) return null;

  const goPrev = () => setCurrent((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  const goNext = () => setCurrent((prev) => (prev === items.length - 1 ? 0 : prev + 1));

  const currentItem = items[current];

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="flex items-center justify-center bg-gray-100 rounded-lg aspect-video overflow-hidden">
        {currentItem.type === 'image' ? (
          <img src={currentItem.url} alt={currentItem.name || ''} className="object-contain w-full h-full" />
        ) : (
          <video src={currentItem.url} controls className="object-contain w-full h-full" />
        )}
      </div>
      <button
        onClick={goPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-opacity-100 transition"
        aria-label="Previous"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        onClick={goNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-opacity-100 transition"
        aria-label="Next"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
      <div className="flex justify-center gap-2 mt-2">
        {items.map((item, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full ${idx === current ? 'bg-indigo-600' : 'bg-gray-300'}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
