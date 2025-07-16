import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Users, Clock, ArrowLeft, UserPlus, Trash2, RefreshCw, Calendar, AlertCircle, Edit2 } from 'lucide-react';
import './Councils.css';

const StatusCard = ({ status, councilCount, onClick, icon: Icon }) => (
  <div className={`status-card ${status}`} onClick={onClick}>
    <div className="status-header">
      <div className={`status-icon ${status}`}>
        <Icon size={24} />
      </div>
      <div className="status-info">
        <h3>{status === 'current' ? 'Current Members' : 'Past Members'}</h3>
        <span className="council-count">{councilCount} members</span>
      </div>
    </div>
    <div className="status-arrow">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  </div>
);

const CouncilCard = ({ council, onDelete, onMove, onEdit }) => (
  <div className="council-card">
    <div className="council-info">
      <div className="council-details">
        <h4>{council.name}</h4>
        <p className="designation">{council.designation}</p>
        <div className="service-period">
          <Calendar size={14} />
          {council.periodOfService}
        </div>
        <div className={`status-badge ${council.isCurrent ? 'current' : 'past'}`}>
          {council.isCurrent ? 'Current' : 'Past'}
        </div>
      </div>
    </div>
    <div className="council-actions">
      <button 
        className="action-btn edit-btn"
        onClick={() => onEdit(council)}
        title="Edit Member"
      >
        <Edit2 size={16} />
      </button>
      {council.isCurrent && (
        <button 
          className="action-btn move-btn"
          onClick={() => onMove(council.id, false)}
          title="Move to Past"
        >
          <RefreshCw size={16} />
        </button>
      )}
      <button 
        className="action-btn delete-btn"
        onClick={() => onDelete(council.id)}
        title="Delete Member"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

const AddEditCouncilModal = ({ isOpen, onClose, onAdd, onEdit, selectedStatus, editingMember }) => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    periodOfService: '',
    isCurrent: selectedStatus === 'current'
  });
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!editingMember;

  // Initialize form data when editing
  useEffect(() => {
    if (editingMember) {
      setFormData({
        name: editingMember.name || '',
        designation: editingMember.designation || '',
        periodOfService: editingMember.periodOfService || '',
        isCurrent: editingMember.isCurrent
      });
    } else {
      setFormData({
        name: '',
        designation: '',
        periodOfService: '',
        isCurrent: selectedStatus === 'current'
      });
    }
  }, [editingMember, selectedStatus]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.designation || !formData.periodOfService) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditMode) {
        await onEdit(editingMember.id, formData);
      } else {
        await onAdd(formData);
      }
      
      setFormData({
        name: '',
        designation: '',
        periodOfService: '',
        isCurrent: selectedStatus === 'current'
      });
      onClose();
    } catch (error) {
      console.error(`Error ${isEditMode ? 'editing' : 'adding'} council member:`, error);
      alert(`Failed to ${isEditMode ? 'edit' : 'add'} council member. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditMode ? 'Edit Council Member' : 'Add New Council Member'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="add-council-form">
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label>Designation *</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Enter designation/position"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label>Period of Service *</label>
            <input
              type="text"
              name="periodOfService"
              value={formData.periodOfService}
              onChange={handleChange}
              placeholder="e.g., 2020-2024"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label>Status *</label>
            <select
              name="isCurrent"
              value={formData.isCurrent}
              onChange={(e) => setFormData({...formData, isCurrent: e.target.value === 'true'})}
              disabled={isLoading || (isEditMode && !editingMember.isCurrent)}
            >
              <option value={true}>Current Member</option>
              <option value={false}>Past Member</option>
            </select>
            {isEditMode && !editingMember.isCurrent && (
              <small className="form-note">Past members cannot be moved back to current status</small>
            )}
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="submit-btn" 
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Member' : 'Add Member')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Council = () => {
  const [councilMembers, setCouncilMembers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch council members from Firestore
  const fetchCouncilMembers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'council'));
      const councilData = [];
      querySnapshot.forEach((doc) => {
        councilData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setCouncilMembers(councilData);
      setError(null);
    } catch (error) {
      console.error('Error fetching council members:', error);
      setError('Failed to load council members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add new council member
  const handleAddMember = async (memberData) => {
    try {
      const docRef = await addDoc(collection(db, 'council'), memberData);
      const newMember = {
        id: docRef.id,
        ...memberData
      };
      setCouncilMembers(prev => [...prev, newMember]);
    } catch (error) {
      console.error('Error adding council member:', error);
      throw error;
    }
  };

  // Edit existing council member
  const handleEditMember = async (memberId, updatedData) => {
    try {
      await updateDoc(doc(db, 'council', memberId), updatedData);
      
      setCouncilMembers(prev => 
        prev.map(member => 
          member.id === memberId 
            ? { ...member, ...updatedData }
            : member
        )
      );
    } catch (error) {
      console.error('Error updating council member:', error);
      throw error;
    }
  };

  // Delete council member
  const handleDeleteMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this council member?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'council', memberId));
      setCouncilMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (error) {
      console.error('Error deleting council member:', error);
      alert('Failed to delete council member. Please try again.');
    }
  };

  // Move member from current to past (only one direction allowed)
  const handleMoveMember = async (memberId, newStatus) => {
    if (newStatus === true) {
      alert('Past members cannot be moved back to current status.');
      return;
    }

    try {
      await updateDoc(doc(db, 'council', memberId), {
        isCurrent: newStatus
      });
      
      setCouncilMembers(prev => 
        prev.map(member => 
          member.id === memberId 
            ? { ...member, isCurrent: newStatus }
            : member
        )
      );
    } catch (error) {
      console.error('Error updating council member:', error);
      alert('Failed to update council member. Please try again.');
    }
  };

  // Open add modal with specific status
  const handleOpenAddModal = (status = null) => {
    setSelectedStatus(status);
    setEditingMember(null);
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const handleOpenEditModal = (member) => {
    setEditingMember(member);
    setIsAddModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setSelectedStatus(null);
    setEditingMember(null);
  };

  // Go back to overview
  const handleBackToOverview = () => {
    setSelectedStatus(null);
  };

  // Retry loading
  const handleRetry = () => {
    fetchCouncilMembers();
  };

  useEffect(() => {
    fetchCouncilMembers();
  }, []);

  // Filter members based on selected status
  const filteredMembers = selectedStatus 
    ? councilMembers.filter(member => 
        selectedStatus === 'current' ? member.isCurrent : !member.isCurrent
      )
    : councilMembers;

  // Count members by status
  const currentMembersCount = councilMembers.filter(member => member.isCurrent).length;
  const pastMembersCount = councilMembers.filter(member => !member.isCurrent).length;

  // Loading state
  if (loading) {
    return (
      <div className="council-management">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading council members...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="council-management">
        <div className="error-state">
          <AlertCircle size={48} color="#E53E3E" />
          <h3>Error Loading Council Members</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={handleRetry}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="council-management">
      {/* Header */}
      <div className="view-header">
        {selectedStatus && (
          <button className="back-btn" onClick={handleBackToOverview}>
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="view-title">
          {selectedStatus 
            ? `${selectedStatus === 'current' ? 'Current' : 'Past'} Council Members`
            : 'Council Management'
          }
        </h1>
        <button 
          className="add-council-global"
          onClick={() => handleOpenAddModal(selectedStatus)}
        >
          <Plus size={20} />
          Add Member
        </button>
      </div>

      {/* Content */}
      {!selectedStatus ? (
        // Overview - Show status cards
        <div className="council-status-grid">
          <StatusCard
            status="current"
            councilCount={currentMembersCount}
            onClick={() => setSelectedStatus('current')}
            icon={Users}
          />
          <StatusCard
            status="past"
            councilCount={pastMembersCount}
            onClick={() => setSelectedStatus('past')}
            icon={Clock}
          />
        </div>
      ) : (
        // Member List
        <div className="council-list">
          {filteredMembers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <UserPlus size={32} />
              </div>
              <h3>No {selectedStatus} members found</h3>
              <p>
                {selectedStatus === 'current' 
                  ? 'Add current council members to get started.'
                  : 'No past council members to display.'
                }
              </p>
              <button 
                className="add-first-council-btn"
                onClick={() => handleOpenAddModal(selectedStatus)}
              >
                <Plus size={16} />
                Add First Member
              </button>
            </div>
          ) : (
            filteredMembers.map(member => (
              <CouncilCard
                key={member.id}
                council={member}
                onDelete={handleDeleteMember}
                onMove={handleMoveMember}
                onEdit={handleOpenEditModal}
              />
            ))
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AddEditCouncilModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddMember}
        onEdit={handleEditMember}
        selectedStatus={selectedStatus}
        editingMember={editingMember}
      />
    </div>
  );
};

export default Council;