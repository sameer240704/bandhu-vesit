import React from 'react';

const ScoreDisplay = ({ score }) => {
  return (
    <div className="absolute top-4 right-4 bg-black/50 text-white p-4 rounded-lg text-xl font-bold z-40">
      Score: {score}
    </div>
  );
};

export default ScoreDisplay; 