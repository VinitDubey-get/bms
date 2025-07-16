import React from 'react';
import './WhyChoose.css'; 

const WhyChoose = () => {
  const processSteps = [
    {
      number: '1',
      title: ' Publish your Research Papers',
      subtitle: 'For Publishing your own Research Papers in reputed Journals.',
    
    },
    {
      number: '2',
      title: 'Get Unlimited Access ',
       subtitle: ' For getting unlimited access of various mathematical contents.',

    },
    {
      number: '3',
      title: 'Get connected with community',
       subtitle: ' To get connected with a community of fellow mathematician of Bihar and  beyond.',
    },
  ];

  return (
    <section className="bms-how-it-works">
      <div className="bms-container">
        <div className="bms-section-header">
          <span className="bms-section-tag">BECOME A MEMBER</span>
          <h2>Why Should You Join the Bihar Mathematical Society ?</h2>
        </div>
        <div className="bms-process-cards">
          {processSteps.map((step) => (
            <div className="bms-process-card" key={step.number}>
              <div className="bms-card-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.subtitle}</p>
              
             
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
