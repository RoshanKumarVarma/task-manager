// pages/Login.jsx
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }               = useContext(AuthContext);
  const navigate                = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        formData
      );
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <p style={styles.subtitle}>Login to your Task Manager</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="roshan@test.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.link}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.linkText}>Register</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container:  { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh' },
  card:       { background:'white', padding:'2rem', borderRadius:'12px', width:'100%', maxWidth:'420px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' },
  title:      { fontSize:'1.8rem', fontWeight:'700', marginBottom:'0.3rem' },
  subtitle:   { color:'#666', marginBottom:'1.5rem' },
  error:      { background:'#fee', color:'#c00', padding:'0.75rem', borderRadius:'8px', marginBottom:'1rem' },
  inputGroup: { marginBottom:'1rem' },
  label:      { display:'block', marginBottom:'0.4rem', fontWeight:'500' },
  input:      { width:'100%', padding:'0.75rem', border:'1px solid #ddd', borderRadius:'8px', fontSize:'1rem' },
  button:     { width:'100%', padding:'0.75rem', background:'#4f46e5', color:'white', border:'none', borderRadius:'8px', fontSize:'1rem', fontWeight:'600', marginTop:'0.5rem' },
  link:       { textAlign:'center', marginTop:'1rem', color:'#666' },
  linkText:   { color:'#4f46e5', fontWeight:'600', textDecoration:'none' },
};

export default Login;