import React from "react";

const RecommendationList = ({ recommendations }) => {
  if (!recommendations.length) return null;
  return (
    <div className="recommendations-section">
      <h3>S-ar putea să-ți placă și</h3>
      <div className="recommendations-list">
        {recommendations.map(rec => (
          <div key={rec.id} className="recommendation-card">
            <img src={rec.cover_img} alt={rec.title} />
            <div>{rec.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationList;
