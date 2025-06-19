import React, { useState } from 'react';
import API from '../api';

export default function WorkoutLogger() {
  const [exercise, setExercise] = useState('');
  const [reps, setReps]         = useState('');
  const [weight, setWeight]     = useState('');
  const [msg, setMsg]           = useState('');

  const handleLog = async (e) => {
    e.preventDefault();
    try {
      await API.post('/log', {
        exercise,
        reps: Number(reps),
        weight: Number(weight)
      });
      setMsg('✅ Logged successfully!');
      setExercise(''); setReps(''); setWeight('');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      alert('Log error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📝 Workout Logger</h2>
      <form onSubmit={handleLog} style={styles.form}>
        <input
          style={styles.input}
          placeholder="Exercise name"
          required
          value={exercise}
          onChange={e=>setExercise(e.target.value)}
        />
        <input
          style={styles.input}
          type="number"
          placeholder="Reps"
          required
          value={reps}
          onChange={e=>setReps(e.target.value)}
        />
        <input
          style={styles.input}
          type="number"
          placeholder="Weight (kg)"
          required
          value={weight}
          onChange={e=>setWeight(e.target.value)}
        />
        <button style={styles.button}>Log</button>
      </form>
      {msg && <div style={styles.msg}>{msg}</div>}
    </div>
  );
}

const styles = {
  container: { maxWidth: 700, margin: '2rem auto', padding: 20 },
  heading:   { fontSize: '1.8rem', marginBottom: '1rem' },
  form:      { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' },
  input:     { flex:1, padding:'0.5rem', borderRadius:4, border:'1px solid #ccc', minWidth:120 },
  button:    { padding:'0.6rem 1.2rem', background:'#FF851B', color:'#fff', border:'none', borderRadius:4, cursor:'pointer' },
  msg:       { marginTop:'1rem', color:'#2ECC40', fontWeight:'bold' }
};
