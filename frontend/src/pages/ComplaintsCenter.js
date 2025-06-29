import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import '../styles/complaints-center.css';

const ComplaintsCenter = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic',
    priority: 'Medium',
    against: '',
    isAnonymous: false,
    attachments: []
  });

  const [responseData, setResponseData] = useState({
    response: ''
  });

  const [noteData, setNoteData] = useState({
    note: ''
  });

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
    search: '',
    page: 1
  });

  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['Academic', 'Behavioral', 'Infrastructure', 'Administrative', 'Other'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const statuses = ['Open', 'In Progress', 'Under Review', 'Resolved', 'Closed'];

  useEffect(() => {
    fetchComplaints();
    if (user.role === 'departmentAdmin' || user.role === 'admin') {
      fetchUsers();
    }
  }, [user, filters]);

  const fetchComplaints = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);

      const response = await axios.get(`/complaint/all?${params}`);
      setComplaints(response.data.complaints);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/user/all');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/complaint/submit', formData);
      resetForm();
      setShowSubmitForm(false);
      fetchComplaints();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    }
  };

  const handleResponse = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/complaint/response/${selectedComplaint._id}`, responseData);
      setResponseData({ response: '' });
      setShowResponseForm(false);
      fetchComplaints();
      setSelectedComplaint(null);
    } catch (err) {
      setError('Failed to add response');
    }
  };

  const handleNote = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/complaint/note/${selectedComplaint._id}`, noteData);
      setNoteData({ note: '' });
      setShowNoteForm(false);
      fetchComplaints();
      setSelectedComplaint(null);
    } catch (err) {
      setError('Failed to add note');
    }
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await axios.put(`/complaint/status/${complaintId}`, { status: newStatus });
      fetchComplaints();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleAssign = async (complaintId, assignedTo) => {
    try {
      await axios.put(`/complaint/status/${complaintId}`, { assignedTo });
      fetchComplaints();
    } catch (err) {
      setError('Failed to assign complaint');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Academic',
      priority: 'Medium',
      against: '',
      isAnonymous: false,
      attachments: []
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return '#dc3545';
      case 'In Progress': return '#fd7e14';
      case 'Under Review': return '#ffc107';
      case 'Resolved': return '#28a745';
      case 'Closed': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#dc3545';
      case 'High': return '#fd7e14';
      case 'Medium': return '#ffc107';
      case 'Low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const canManageComplaints = ['admin', 'departmentAdmin'].includes(user.role);
  const canSubmitComplaints = ['student', 'faculty'].includes(user.role);

  return (
    <div className="complaints-center-container">
      <div className="complaints-header">
        <h1>Complaints Center</h1>
        {canSubmitComplaints && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowSubmitForm(!showSubmitForm)}
          >
            {showSubmitForm ? 'Cancel' : 'Submit Complaint'}
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          <input
            type="text"
            placeholder="Search complaints or tracking number..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
            className="search-input"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value, page: 1})}
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value, page: 1})}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({...filters, priority: e.target.value, page: 1})}
          >
            <option value="">All Priorities</option>
            {priorities.map(pri => (
              <option key={pri} value={pri}>{pri}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Complaint Form */}
      {showSubmitForm && (
        <div className="complaint-form-section">
          <h3>Submit New Complaint</h3>
          <form onSubmit={handleSubmit} className="complaint-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  {priorities.map(pri => (
                    <option key={pri} value={pri}>{pri}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Against (Optional)</label>
                <select
                  value={formData.against}
                  onChange={(e) => setFormData({...formData, against: e.target.value})}
                >
                  <option value="">Select Person</option>
                  {users.map(usr => (
                    <option key={usr._id} value={usr._id}>
                      {usr.name} - {usr.role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="6"
                required
                placeholder="Please provide detailed description of your complaint..."
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
                />
                Submit anonymously
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Submit Complaint
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setShowSubmitForm(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Complaints List */}
      <div className="complaints-section">
        {loading ? (
          <div className="loading">Loading complaints...</div>
        ) : (
          <>
            <div className="complaints-table-container">
              <table className="complaints-table">
                <thead>
                  <tr>
                    <th>Tracking #</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Complainant</th>
                    <th>Assigned To</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map(complaint => (
                    <tr key={complaint._id}>
                      <td className="tracking-number">{complaint.trackingNumber}</td>
                      <td className="complaint-title">{complaint.title}</td>
                      <td>{complaint.category}</td>
                      <td>
                        <span 
                          className="priority-badge"
                          style={{ backgroundColor: getPriorityColor(complaint.priority) }}
                        >
                          {complaint.priority}
                        </span>
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(complaint.status) }}
                        >
                          {complaint.status}
                        </span>
                      </td>
                      <td>
                        {complaint.isAnonymous ? 'Anonymous' : complaint.complainant?.name}
                      </td>
                      <td>{complaint.assignedTo?.name || 'Unassigned'}</td>
                      <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                      <td className="actions">
                        <button 
                          className="btn btn-small btn-secondary"
                          onClick={() => setSelectedComplaint(complaint)}
                        >
                          View
                        </button>
                        {canManageComplaints && (
                          <select
                            value={complaint.status}
                            onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)}
                            className="status-select"
                          >
                            {statuses.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {complaints.length === 0 && (
              <div className="no-data">No complaints found for the selected filters.</div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="btn btn-secondary"
                  disabled={filters.page <= 1}
                  onClick={() => setFilters({...filters, page: filters.page - 1})}
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {filters.page} of {totalPages}
                </span>
                <button 
                  className="btn btn-secondary"
                  disabled={filters.page >= totalPages}
                  onClick={() => setFilters({...filters, page: filters.page + 1})}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="modal-overlay" onClick={() => setSelectedComplaint(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Complaint Details</h2>
              <button 
                className="modal-close"
                onClick={() => setSelectedComplaint(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="complaint-detail-header">
                <div className="complaint-meta">
                  <span className="tracking-number">{selectedComplaint.trackingNumber}</span>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedComplaint.status) }}
                  >
                    {selectedComplaint.status}
                  </span>
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(selectedComplaint.priority) }}
                  >
                    {selectedComplaint.priority}
                  </span>
                </div>
                <div className="complaint-info">
                  <p><strong>Category:</strong> {selectedComplaint.category}</p>
                  <p><strong>Complainant:</strong> {selectedComplaint.isAnonymous ? 'Anonymous' : selectedComplaint.complainant?.name}</p>
                  <p><strong>Assigned To:</strong> {selectedComplaint.assignedTo?.name || 'Unassigned'}</p>
                  <p><strong>Created:</strong> {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                  {selectedComplaint.resolvedAt && (
                    <p><strong>Resolved:</strong> {new Date(selectedComplaint.resolvedAt).toLocaleString()}</p>
                  )}
                </div>
              </div>

              <div className="complaint-content">
                <h3>{selectedComplaint.title}</h3>
                <p>{selectedComplaint.description}</p>
              </div>

              {selectedComplaint.attachments && selectedComplaint.attachments.length > 0 && (
                <div className="complaint-attachments">
                  <h4>Attachments:</h4>
                  <div className="attachments-list">
                    {selectedComplaint.attachments.map((attachment, index) => (
                      <a 
                        key={index}
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="attachment-link"
                      >
                        📎 {attachment.fileName}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Responses */}
              {selectedComplaint.responses && selectedComplaint.responses.length > 0 && (
                <div className="responses-section">
                  <h4>Responses:</h4>
                  <div className="responses-list">
                    {selectedComplaint.responses.map((response, index) => (
                      <div key={index} className="response-item">
                        <div className="response-header">
                          <span className="responder">{response.respondedBy?.name}</span>
                          <span className="response-date">
                            {new Date(response.respondedAt).toLocaleString()}
                          </span>
                        </div>
                        <p>{response.response}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Internal Notes (Admin Only) */}
              {canManageComplaints && selectedComplaint.internalNotes && selectedComplaint.internalNotes.length > 0 && (
                <div className="notes-section">
                  <h4>Internal Notes:</h4>
                  <div className="notes-list">
                    {selectedComplaint.internalNotes.map((note, index) => (
                      <div key={index} className="note-item">
                        <div className="note-header">
                          <span className="note-author">{note.addedBy?.name}</span>
                          <span className="note-date">
                            {new Date(note.addedAt).toLocaleString()}
                          </span>
                        </div>
                        <p>{note.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="complaint-actions">
                {canManageComplaints && (
                  <>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setShowResponseForm(true)}
                    >
                      Add Response
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setShowNoteForm(true)}
                    >
                      Add Internal Note
                    </button>
                    <select
                      onChange={(e) => handleAssign(selectedComplaint._id, e.target.value)}
                      className="assign-select"
                    >
                      <option value="">Assign to...</option>
                      {users.map(usr => (
                        <option key={usr._id} value={usr._id}>
                          {usr.name} - {usr.role}
                        </option>
                      ))}
                    </select>
                  </>
                )}
                {selectedComplaint.status === 'Resolved' && selectedComplaint.complainant._id === user._id && (
                  <button className="btn btn-primary">
                    Rate Resolution
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Response Form Modal */}
      {showResponseForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Response</h3>
              <button 
                className="modal-close"
                onClick={() => setShowResponseForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleResponse} className="modal-form">
              <div className="form-group">
                <label>Response</label>
                <textarea
                  value={responseData.response}
                  onChange={(e) => setResponseData({...responseData, response: e.target.value})}
                  rows="4"
                  required
                  placeholder="Enter your response..."
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Submit Response</button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowResponseForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Note Form Modal */}
      {showNoteForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Internal Note</h3>
              <button 
                className="modal-close"
                onClick={() => setShowNoteForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleNote} className="modal-form">
              <div className="form-group">
                <label>Note</label>
                <textarea
                  value={noteData.note}
                  onChange={(e) => setNoteData({...noteData, note: e.target.value})}
                  rows="4"
                  required
                  placeholder="Enter internal note..."
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Add Note</button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowNoteForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsCenter; 