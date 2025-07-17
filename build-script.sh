import React from 'react';

export type Review = {
  serviceTypes?: string[];
  // other review fields
};

interface ReviewCardProps {
  v: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ v }) => {
  const { serviceTypes = [] } = v;

  return (
    <div className="review-card">
      {serviceTypes?.map((serviceType, index) => (
        <span key={index}>{serviceType}</span>
      ))}
    </div>
  );
};

export default ReviewCard;