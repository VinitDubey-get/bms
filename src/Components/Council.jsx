import React, { useState, useEffect } from 'react';
import { FileText, Crown, UserCheck, History } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import path according to your firebase config
import './Council.css'; 

const CouncilInfo = () => {
  const [currentCouncil, setCurrentCouncil] = useState([]);
  const [pastCouncil, setPastCouncil] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCouncilData = async () => {
      try {
        setLoading(true);
        const councilCollection = collection(db, 'council');
        const councilSnapshot = await getDocs(councilCollection);
        
        const councilData = councilSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Separate current and past members
        const current = councilData.filter(member => member.isCurrent === true);
        const past = councilData.filter(member => member.isCurrent === false);

        setCurrentCouncil(current);
        setPastCouncil(past);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching council data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCouncilData();
  }, []);

  const getIconForDesignation = (designation) => {
    switch (designation?.toLowerCase()) {
      case 'president':
        return <Crown />;
      case 'secretary':
        return <FileText />;
      default:
        return <UserCheck />;
    }
  };

  const groupMembersByDesignation = (members) => {
    return members.reduce((acc, member) => {
      const designation = member.designation || 'Member';
      if (!acc[designation]) {
        acc[designation] = [];
      }
      acc[designation].push(member);
      return acc;
    }, {});
  };

  if (loading) {
    return (
      <div className="bmis-container">
        <div className="current-council-card">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading council information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bmis-container">
        <div className="current-council-card">
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <FileText className="w-12 h-12 mx-auto mb-2" />
              <p className="text-lg font-semibold">Error loading data</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bmis-container">
      
      {/* Current BMS Council */}
      <div className="current-council-card">
        <h2 className="section-title">Current BMS Council</h2>
        
        {currentCouncil.length > 0 ? (
          <div className="council-grid">
            {currentCouncil.map((member) => (
              <div key={member.id} className="council-member president">
                <div className="member-info">
                  <div className="member-icon">
                    {getIconForDesignation(member.designation)}
                  </div>
                  <div className="member-details">
                    <h3>{member.name}</h3>
                    <p>{member.designation} ({member.periodOfService})</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No current council members found.</p>
          </div>
        )}
      </div>

      {/* Past BMS Leadership */}
      <div className="past-leadership-card">
        <div className="past-leadership-header">
          <History />
          <h2>Past BMS Leadership</h2>
        </div>
        
        {pastCouncil.length > 0 ? (
          <div className="past-leadership-grid">
            {Object.entries(groupMembersByDesignation(pastCouncil)).map(([designation, members]) => (
              <div key={designation} className="past-role-section">
                <h3 className="past-role-title">
                  {getIconForDesignation(designation)}
                  {designation}
                </h3>
                <div className="past-members-list">
                  {members.map((member) => (
                    <div key={member.id} className="past-member-item">
                      <p className="past-member-name">{member.name}</p>
                      <p className="past-member-term">({member.periodOfService})</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No past council members found.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default CouncilInfo;