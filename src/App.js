// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage.jsx';
import AdminPage from './Pages/AdminPage.jsx';
import GalleryPage from './Pages/GalleryPage.jsx';
import MembershipPage from './Pages/MembershipPage.jsx';
import CouncilPage from './Pages/CouncilPage.jsx';
import SocietyPage from './Pages/SocietyPage.jsx';
import JournalPage from './Pages/JournalsPage.jsx';
import DonationPage from './Pages/DonationPage.jsx';
import AwardsPage from './Pages/AwardsPage.jsx';
import ContactPage from './Pages/ContactPage.jsx';
import PrivateRoute from './Components/PrivateRoute.jsx';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<PrivateRoute> <AdminPage/></PrivateRoute>} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/society" element={<SocietyPage />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/journals" element={<JournalPage />} />
        <Route path="/council" element={<CouncilPage />} />
        <Route path="/awards" element={<AwardsPage />} />
        <Route path="/donation" element={<DonationPage />} />
        <Route path="/contact" element={<ContactPage />} />

      </Routes>
    </Router>
  );
};

export default App;
