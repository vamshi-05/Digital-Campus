import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import useAuth  from '../hooks/useAuth';
import '../styles/notice-board.css';

const NoticeBoard = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'Medium',
    targetAudience: 'All',
    targetDepartments: [],
    targetClasses: [],
    targetRoles: [],
    attachments: [],
    scheduledFor: '',
    expiresAt: '',
    isPublished: false
  });

  // Filters
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    search: '',
    page: 1
  });

  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['General', 'Academic', 'Events', 'Emergency', 'Department-specific'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];
  const targetAudiences = ['All', 'Department', 'Class', 'Role'];
  const roles = ['student', 'faculty', 'departmentAdmin'];

  useEffect(() => {
    fetchNotices();
    fetchUnreadCount();
    if (user.role === 'departmentAdmin' || user.role === 'faculty') {
      fetchDepartments();
      fetchClasses();
    }
  }, [user, filters]);

  const fetchNotices = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);

      const response = await axios.get(`/notice/all?${params}`);
      setNotices(response.data.notices);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('/notice/unread/count');
      setUnreadCount(response.data.unreadCount);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/department/all');
      setDepartments(response.data);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/class/all');
      setClasses(response.data);
    } catch (err) {
      console.error('Failed to fetch classes:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNotice) {
        await axios.put(`/notice/update/${editingNotice._id}`, formData);
        setEditingNotice(null);
      } else {
        await axios.post('/notice/create', formData);
      }
      
      resetForm();
      setShowCreateForm(false);
      fetchNotices();
      fetchUnreadCount();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save notice');
    }
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      category: notice.category,
      priority: notice.priority,
      targetAudience: notice.targetAudience,
      targetDepartments: notice.targetDepartments || [],
      targetClasses: notice.targetClasses || [],
      targetRoles: notice.targetRoles || [],
      attachments: notice.attachments || [],
      scheduledFor: notice.scheduledFor ? new Date(notice.scheduledFor).toISOString().split('T')[0] : '',
      expiresAt: notice.expiresAt ? new Date(notice.expiresAt).toISOString().split('T')[0] : '',
      isPublished: notice.isPublished
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (noticeId) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await axios.delete(`/notice/delete/${noticeId}`);
        fetchNotices();
      } catch (err) {
        setError('Failed to delete notice');
      }
    }
  };

  const handleArchive = async (noticeId) => {
    try {
      await axios.put(`/notice/archive/${noticeId}`);
      fetchNotices();
    } catch (err) {
      setError('Failed to archive notice');
    }
  };

  const handleViewNotice = async (notice) => {
    setSelectedNotice(notice);
    // Mark as read
    try {
      await axios.get(`/notice/${notice._id}`);
      fetchUnreadCount();
    } catch (err) {
      console.error('Failed to mark notice as read:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'General',
      priority: 'Medium',
      targetAudience: 'All',
      targetDepartments: [],
      targetClasses: [],
      targetRoles: [],
      attachments: [],
      scheduledFor: '',
      expiresAt: '',
      isPublished: false
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return '#dc3545';
      case 'High': return '#fd7e14';
      case 'Medium': return '#ffc107';
      case 'Low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Emergency': return '🚨';
      case 'Academic': return '📚';
      case 'Events': return '🎉';
      case 'Department-specific': return '🏢';
      default: return '📢';
    }
  };

  const canCreateNotice = ['admin', 'departmentAdmin', 'faculty'].includes(user.role);
  const canEditNotice = (notice) => {
    return notice.createdBy._id === user._id || user.role === 'admin';
  };

  return (
    <div className="notice-board-container">
      <div className="notice-board-header">
        <div className="header-left">
          <h1>Notice Board</h1>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount} unread</span>
          )}
        </div>
        {canCreateNotice && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'Create Notice'}
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          <input
            type="text"
            placeholder="Search notices..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
            className="search-input"
          />
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

      {/* Create/Edit Notice Form */}
      {showCreateForm && (
        <div className="notice-form-section">
          <h3>{editingNotice ? 'Edit Notice' : 'Create New Notice'}</h3>
          <form onSubmit={handleSubmit} className="notice-form">
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
                <label>Target Audience</label>
                <select
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                >
                  {targetAudiences.map(aud => (
                    <option key={aud} value={aud}>{aud}</option>
                  ))}
                </select>
              </div>
            </div>

            {formData.targetAudience === 'Department' && (
              <div className="form-group">
                <label>Target Departments</label>
                <select
                  multiple
                  value={formData.targetDepartments}
                  onChange={(e) => setFormData({
                    ...formData, 
                    targetDepartments: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                >
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
              </div>
            )}

            {formData.targetAudience === 'Class' && (
              <div className="form-group">
                <label>Target Classes</label>
                <select
                  multiple
                  value={formData.targetClasses}
                  onChange={(e) => setFormData({
                    ...formData, 
                    targetClasses: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                >
                  {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                  ))}
                </select>
              </div>
            )}

            {formData.targetAudience === 'Role' && (
              <div className="form-group">
                <label>Target Roles</label>
                <select
                  multiple
                  value={formData.targetRoles}
                  onChange={(e) => setFormData({
                    ...formData, 
                    targetRoles: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Schedule For (Optional)</label>
                <input
                  type="datetime-local"
                  value={formData.scheduledFor}
                  onChange={(e) => setFormData({...formData, scheduledFor: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Expires At (Optional)</label>
                <input
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows="8"
                required
                placeholder="Enter notice content..."
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                />
                Publish immediately
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingNotice ? 'Update Notice' : 'Create Notice'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingNotice(null);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notices List */}
      <div className="notices-section">
        {loading ? (
          <div className="loading">Loading notices...</div>
        ) : (
          <>
            <div className="notices-grid">
              {notices.map(notice => (
                <div key={notice._id} className="notice-card">
                  <div className="notice-header">
                    <div className="notice-meta">
                      <span className="category-icon">{getCategoryIcon(notice.category)}</span>
                      <span className="category">{notice.category}</span>
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(notice.priority) }}
                      >
                        {notice.priority}
                      </span>
                    </div>
                    <div className="notice-actions">
                      {canEditNotice(notice) && (
                        <>
                          <button 
                            className="btn btn-small btn-secondary"
                            onClick={() => handleEdit(notice)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-small btn-danger"
                            onClick={() => handleDelete(notice._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                      {user.role === 'admin' && (
                        <button 
                          className="btn btn-small btn-secondary"
                          onClick={() => handleArchive(notice._id)}
                        >
                          Archive
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="notice-content" onClick={() => handleViewNotice(notice)}>
                    <h3 className="notice-title">{notice.title}</h3>
                    <p className="notice-excerpt">
                      {notice.content.length > 150 
                        ? notice.content.substring(0, 150) + '...' 
                        : notice.content
                      }
                    </p>
                    <div className="notice-footer">
                      <span className="author">By {notice.createdBy?.name}</span>
                      <span className="date">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </span>
                      {notice.viewCount > 0 && (
                        <span className="views">{notice.viewCount} views</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {notices.length === 0 && (
              <div className="no-data">No notices found for the selected filters.</div>
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

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="modal-overlay" onClick={() => setSelectedNotice(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedNotice.title}</h2>
              <button 
                className="modal-close"
                onClick={() => setSelectedNotice(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="notice-detail-meta">
                <span className="category-icon">{getCategoryIcon(selectedNotice.category)}</span>
                <span className="category">{selectedNotice.category}</span>
                <span 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(selectedNotice.priority) }}
                >
                  {selectedNotice.priority}
                </span>
                <span className="author">By {selectedNotice.createdBy?.name}</span>
                <span className="date">
                  {new Date(selectedNotice.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="notice-detail-content">
                {selectedNotice.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
                <div className="notice-attachments">
                  <h4>Attachments:</h4>
                  <div className="attachments-list">
                    {selectedNotice.attachments.map((attachment, index) => (
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard; 