import React from 'react';
import Awards from './sections/Awards.jsx';
import Councils from './sections/Councils.jsx';
import Donors from './sections/Donors.jsx';
import Gallery from './Gallery.jsx';
import Journals from './sections/Journals.jsx';
import Members from './sections/Members.jsx';
import Notices from './sections/Notices.jsx';

import './ContentArea.css';

const ContentArea = ({ activeSection }) => {

  const renderSection=()=>{
    switch(activeSection){
      case 'Awards & Prizes':
        return <Awards/>;
      
      case 'Members':
        return <Members/>;

      case 'Gallery':
        return <Gallery/>;

      case 'Journals':
        return <Journals/>;
      
      case 'Donors':
        return <Donors/>;
      
      case 'Notices':
        return <Notices/>;
      
      case 'Councils':
       return <Councils/>;
    }
  };


  return (
    <div className="content-area">
      <h2 className="section-title">{activeSection}</h2>
      <div className="section-content">
         {renderSection()}
      </div>
    </div>
  );
};

export default ContentArea;
