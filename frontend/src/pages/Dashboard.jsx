// pages/Dashboard.jsx
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import API_URL from '../config';

const Dashboard = () => {
  const { user, logout }       = useContext(AuthContext);
  const [tasks, setTasks]      = useState([]);
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState('');

  // Form state
  const [showForm, setShowForm]   = useState(false);
  const [editingTask, setEditing] = useState(null);
  const [formData, setFormData]   = useState({
    title: '', description: '', status: 'pending', dueDate: ''
  });

  // ⭐ Axios config with JWT token
  const config = {
    headers: { Authorization: `Bearer ${user?.token}` }
  };

  // ─────────────────────────────────────
  // Fetch all tasks on load
  // ─────────────────────────────────────
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks`, config);
      setTasks(res.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────
  // Create or Update Task
  // ─────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        // UPDATE
        const res = await axios.post(`${API_URL}/api/tasks`, formData, config);
        setTasks(tasks.map(t => t._id === editingTask._id ? res.data : t));
      } else {
        // CREATE
        const res = await axios.put(`${API_URL}/api/tasks/${editingTask._id}`, formData, config);
        setTasks([res.data, ...tasks]);
      }
      resetForm();
    } catch (err) {
      setError('Failed to save task');
    }
  };

  // ─────────────────────────────────────
  // Delete Task
  // ─────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`, config);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  // ─────────────────────────────────────
  // Edit Task — prefill form
  // ─────────────────────────────────────
  const handleEdit = (task) => {
    setEditing(task);
    setFormData({
      title:       task.title,
      description: task.description,
      status:      task.status,
      dueDate:     task.dueDate ? task.dueDate.split('T')[0] : ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title:'', description:'', status:'pending', dueDate:'' });
    setEditing(null);
    setShowForm(false);
  };

  // ─────────────────────────────────────
  // Status badge color
  // ─────────────────────────────────────
  const statusColor = {
    'pending':     { background:'#fef3c7', color:'#d97706' },
    'in-progress': { background:'#dbeafe', color:'#2563eb' },
    'completed':   { background:'#dcfce7', color:'#16a34a' },
  };

  return (
    <div style={styles.container}>

      {/* ── NAVBAR ── */}
      <nav style={styles.navbar}>
        <h1 style={styles.navTitle}>📋 Task Manager</h1>
        <div style={styles.navRight}>
          <span style={styles.navUser}>👋 {user?.name}</span>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div style={styles.main}>

        {/* Error */}
        {error && (
          <div style={styles.error}>
            {error}
            <button onClick={() => setError('')} style={styles.closeBtn}>✕</button>
          </div>
        )}

        {/* ── ADD TASK BUTTON ── */}
        <div style={styles.topBar}>
          <h2 style={styles.heading}>
            My Tasks
            <span style={styles.taskCount}>{tasks.length}</span>
          </h2>
          <button
            style={styles.addBtn}
            onClick={() => { resetForm(); setShowForm(!showForm); }}
          >
            {showForm ? '✕ Cancel' : '+ Add Task'}
          </button>
        </div>

        {/* ── TASK FORM ── */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>
              {editingTask ? '✏️ Edit Task' : '➕ New Task'}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                style={styles.input}
                type="text"
                placeholder="Task title *"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
              <textarea
                style={{...styles.input, height:'80px', resize:'vertical'}}
                placeholder="Description (optional)"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
              <div style={styles.formRow}>
                <select
                  style={{...styles.input, flex:1}}
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="in-progress">🔄 In Progress</option>
                  <option value="completed">✅ Completed</option>
                </select>
                <input
                  style={{...styles.input, flex:1}}
                  type="date"
                  value={formData.dueDate}
                  onChange={e => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
              <div style={styles.formButtons}>
                <button type="submit" style={styles.saveBtn}>
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
                <button type="button" style={styles.cancelBtn} onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── TASKS LIST ── */}
        {loading ? (
          <div style={styles.center}>Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div style={styles.empty}>
            <p style={{fontSize:'3rem'}}>📭</p>
            <p>No tasks yet! Click "Add Task" to get started.</p>
          </div>
        ) : (
          <div style={styles.taskGrid}>
            {tasks.map(task => (
              <div key={task._id} style={styles.taskCard}>

                {/* Status Badge */}
                <span style={{...styles.badge, ...statusColor[task.status]}}>
                  {task.status}
                </span>

                {/* Title */}
                <h3 style={{
                  ...styles.taskTitle,
                  textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                  color: task.status === 'completed' ? '#999' : '#111'
                }}>
                  {task.title}
                </h3>

                {/* Description */}
                {task.description && (
                  <p style={styles.taskDesc}>{task.description}</p>
                )}

                {/* Due Date */}
                {task.dueDate && (
                  <p style={styles.dueDate}>
                    📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}

                {/* Action Buttons */}
                <div style={styles.taskActions}>
                  <button
                    style={styles.editBtn}
                    onClick={() => handleEdit(task)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(task._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── STYLES ──
const styles = {
  container:    { minHeight:'100vh', background:'#f0f2f5' },
  navbar:       { background:'#4f46e5', padding:'1rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center' },
  navTitle:     { color:'white', fontSize:'1.4rem', fontWeight:'700' },
  navRight:     { display:'flex', alignItems:'center', gap:'1rem' },
  navUser:      { color:'white', fontWeight:'500' },
  logoutBtn:    { padding:'0.4rem 1rem', background:'rgba(255,255,255,0.2)', color:'white', border:'1px solid rgba(255,255,255,0.4)', borderRadius:'6px', fontWeight:'500' },
  main:         { maxWidth:'900px', margin:'0 auto', padding:'2rem 1rem' },
  error:        { background:'#fee', color:'#c00', padding:'0.75rem 1rem', borderRadius:'8px', marginBottom:'1rem', display:'flex', justifyContent:'space-between' },
  closeBtn:     { background:'none', border:'none', color:'#c00', fontSize:'1rem', cursor:'pointer' },
  topBar:       { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' },
  heading:      { fontSize:'1.5rem', fontWeight:'700', display:'flex', alignItems:'center', gap:'0.5rem' },
  taskCount:    { background:'#4f46e5', color:'white', borderRadius:'999px', padding:'0.1rem 0.6rem', fontSize:'0.9rem' },
  addBtn:       { padding:'0.6rem 1.2rem', background:'#4f46e5', color:'white', border:'none', borderRadius:'8px', fontWeight:'600', fontSize:'0.95rem' },
  formCard:     { background:'white', padding:'1.5rem', borderRadius:'12px', marginBottom:'1.5rem', boxShadow:'0 2px 10px rgba(0,0,0,0.08)' },
  formTitle:    { marginBottom:'1rem', fontWeight:'600', fontSize:'1.1rem' },
  input:        { width:'100%', padding:'0.7rem', border:'1px solid #ddd', borderRadius:'8px', fontSize:'0.95rem', marginBottom:'0.8rem', display:'block' },
  formRow:      { display:'flex', gap:'0.8rem' },
  formButtons:  { display:'flex', gap:'0.8rem', marginTop:'0.5rem' },
  saveBtn:      { padding:'0.65rem 1.5rem', background:'#4f46e5', color:'white', border:'none', borderRadius:'8px', fontWeight:'600' },
  cancelBtn:    { padding:'0.65rem 1.5rem', background:'#f3f4f6', color:'#333', border:'none', borderRadius:'8px', fontWeight:'600' },
  taskGrid:     { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'1rem' },
  taskCard:     { background:'white', padding:'1.25rem', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', display:'flex', flexDirection:'column', gap:'0.5rem' },
  badge:        { display:'inline-block', padding:'0.2rem 0.7rem', borderRadius:'999px', fontSize:'0.78rem', fontWeight:'600', textTransform:'uppercase', width:'fit-content' },
  taskTitle:    { fontSize:'1.05rem', fontWeight:'600' },
  taskDesc:     { color:'#666', fontSize:'0.9rem' },
  dueDate:      { color:'#888', fontSize:'0.85rem' },
  taskActions:  { display:'flex', gap:'0.5rem', marginTop:'0.5rem' },
  editBtn:      { flex:1, padding:'0.4rem', background:'#f0f2f5', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'500' },
  deleteBtn:    { flex:1, padding:'0.4rem', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'500' },
  center:       { textAlign:'center', padding:'3rem', color:'#666' },
  empty:        { textAlign:'center', padding:'3rem', color:'#666', background:'white', borderRadius:'12px' },
};

export default Dashboard;