import React,{useState} from 'react';
import "./Admin.css"
import Sidebar from '../Components/Sidebar.jsx'
import ContentArea from '../Components/ContentArea.jsx';

const AdminPage=()=>{

  const [activeSection,setActiveSection]=useState('Awards & Prizes');


  return(
    <div className='app-container'>
      
      <header className='app-header'>
        Welcome - Admin Name
          <img src="assets/logo.png" alt="logo" />
      </header>
      

      <div className='app-main'>
         <Sidebar activeSection={activeSection} setActiveSection={setActiveSection}/>
         <ContentArea activeSection={activeSection}/>
      </div>

      <footer className='app-footer'>
        @ 2025 BMS. All rights reserved.
      </footer>
      
    </div>
  )

};
export default AdminPage;