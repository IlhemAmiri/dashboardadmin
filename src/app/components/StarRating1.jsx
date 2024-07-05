import React, { useState } from 'react';

const StarRating1 = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index) => setHoverRating(index);
  const handleMouseLeave = () => setHoverRating(0);
  const handleClick = (index) => setRating(index);

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((index) => (
        <div key={index} className="relative cursor-pointer" style={{ position: 'relative', width: '32px', height: '32px' }}>
          {/* Full star */}
          <svg
            className={`absolute w-8 h-8 ${hoverRating >= index ? 'text-yellow-500' : rating >= index ? 'text-yellow-500' : 'text-gray-300'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.669 5.134a1 1 0 00.95.69h5.412c.969 0 1.371 1.24.588 1.81l-4.385 3.18a1 1 0 00-.364 1.118l1.669 5.134c.3.921-.755 1.688-1.539 1.118l-4.386-3.18a1 1 0 00-1.176 0l-4.386 3.18c-.783.57-1.838-.197-1.539-1.118l1.669-5.134a1 1 0 00-.364-1.118l-4.385-3.18c-.783-.57-.381-1.81.588-1.81h5.412a1 1 0 00.95-.69l1.669-5.134z" />
          </svg>
          {/* Half star */}
          <svg
            className={`absolute w-8 h-8 ${hoverRating >= index - 0.5 ? 'text-yellow-500' : rating >= index - 0.5 ? 'text-yellow-500' : 'text-gray-300'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            style={{ clipPath: 'inset(0 50% 0 0)', left: 0, position: 'absolute' }}
            onMouseEnter={() => handleMouseEnter(index - 0.5)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index - 0.5)}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.669 5.134a1 1 0 00.95.69h5.412c.969 0 1.371 1.24.588 1.81l-4.385 3.18a1 1 0 00-.364 1.118l1.669 5.134c.3.921-.755 1.688-1.539 1.118l-4.386-3.18a1 1 0 00-1.176 0l-4.386 3.18c-.783.57-1.838-.197-1.539-1.118l1.669-5.134a1 1 0 00-.364-1.118l-4.385-3.18c-.783-.57-.381-1.81.588-1.81h5.412a1 1 0 00.95-.69l1.669-5.134z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default StarRating1;
