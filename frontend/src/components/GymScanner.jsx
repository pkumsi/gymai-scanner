// src/components/GymScanner.jsx
import React, { useState } from 'react';
import API from '../api';

export default function GymScanner() {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const sel = e.target.files[0];
    if (!sel) return;
    setFile(sel);
    setFileType(sel.type.startsWith('video') ? 'video' : 'image');
  };

  const capitalize = (s) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await API.post('/scan', formData);
      setResult(res.data.result);
    } catch (err) {
      alert('Error scanning file: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🏋️ GymAI Equipment Scanner</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          {loading ? 'Scanning…' : 'Scan Now'}
        </button>
      </form>

      {file && (
        fileType === 'image' 
          ? <img src={URL.createObjectURL(file)} alt="preview" style={styles.preview} />
          : <video src={URL.createObjectURL(file)} controls style={styles.preview} />
      )}

      {result && (
        <div style={styles.result}>
          {result.equipment?.map((item, idx) => {
            const name = capitalize(item.name || item.type || `Equipment ${idx+1}`);
            const exercises = item.exercises || [];
            return (
              <div key={idx} style={styles.card}>
                <h3 style={styles.cardTitle}>{name}</h3>
                <ul style={styles.exerciseList}>
                  {exercises.map((ex, i) => {
                    const exName = capitalize(ex.name || ex.exercise || '');
                    const muscles = ex.muscles || ex.target_muscles || ex.targetMuscles || ex.target_muscle_groups || [];
                    return (
                      <li key={i} style={styles.exerciseItem}>
                        <strong>{exName}</strong> — {muscles.map(m => capitalize(m)).join(', ')}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 700,
    margin: '2rem auto',
    padding: 20,
    fontFamily: 'sans-serif',
  },
  heading: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  input: {
    flex: 2,
    padding: '0.6rem',
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  button: {
    flex: 1,
    padding: '0.6rem',
    background: '#0074D9',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
  preview: {
    display: 'block',
    margin: '1rem auto',
    maxHeight: 250,
    borderRadius: 6,
  },
  result: {
    marginTop: '2rem',
  },
  card: {
    background: '#f9f9f9',
    padding: '1rem',
    borderRadius: 6,
    marginBottom: '1rem',
  },
  cardTitle: {
    margin: '0 0 0.5rem',
    fontSize: '1.2rem',
  },
  exerciseList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  exerciseItem: {
    marginBottom: '0.5rem',
  },
};
