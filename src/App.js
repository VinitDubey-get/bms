// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage.jsx';
import AdminPage from './Pages/AdminPage.jsx'




const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage/>}/>
      
     </Routes>
    </Router>
  );
};

export default App;
