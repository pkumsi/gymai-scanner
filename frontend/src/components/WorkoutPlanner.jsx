// src/components/WorkoutPlanner.jsx
import React, { useState } from 'react';
import API from '../api';

export default function WorkoutPlanner() {
  const [goals, setGoals] = useState('');
  const [level, setLevel] = useState('beginner');
  const [duration, setDuration] = useState(30);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        goals: goals
          .split(',')
          .map((g) => g.trim())
          .filter(Boolean),
        level,
        duration: Number(duration),
      };
      const res = await API.post('/plan', payload);
      // if backend returned unstructured raw text:
if (res.data.raw_plan) {
  try {
    const parsed = JSON.parse(res.data.raw_plan);
    setPlan(parsed);
  } catch {
    setPlan({ raw: res.data.raw_plan }); // fallback to raw view
  }
} else {
    setPlan(res.data);
  }
} catch (err) {
  alert('Error: ' + (err.response?.data?.error || err.message));
} finally {
  setLoading(false);
}
};

// show form if no plan yet
  if (!plan) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>📋 AI Workout Planner</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Goals (e.g. fat loss, strength)"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            required
          />
          <select
            style={styles.input}
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <input
            style={styles.input}
            type="number"
            min="5"
            max="120"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration (mins)"
            required
          />
          <button type="submit" style={styles.button}>
            {loading ? 'Planning…' : 'Get Plan'}
          </button>
        </form>
      </div>
    );
  }

  // once we have a plan...
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>✅ Your Workout Plan</h2>

      {plan.raw ? (
        <pre style={styles.output}>{plan.raw}</pre>
      ) : (
        <>
          {/* Warm-Up */}
          <h3>Warm-Up</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.cell}>Exercise</th>
                <th style={styles.cell}>Duration</th>
              </tr>
            </thead>
            <tbody>
              {plan.warmup.map((w, i) => (
                <tr key={i}>
                  <td style={styles.cell}>{w.exercise}</td>
                  <td style={styles.cell}>{w.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Circuits */}
          {plan.circuits.map((c, ci) => (
            <div key={ci} style={{ marginBottom: '1.5rem' }}>
              <h3>
                {c.name} ({c.duration}) — {c.rounds} rounds
              </h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.cell}>Exercise</th>
                    <th style={styles.cell}>Sets</th>
                    <th style={styles.cell}>Reps</th>
                    <th style={styles.cell}>Rest</th>
                  </tr>
                </thead>
                <tbody>
                  {c.exercises.map((ex, ei) => (
                    <tr key={ei}>
                      <td style={styles.cell}>{ex.exercise}</td>
                      <td style={styles.cell}>{ex.sets}</td>
                      <td style={styles.cell}>{ex.reps}</td>
                      <td style={styles.cell}>{ex.rest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          {/* Cool-Down */}
          <h3>Cool-Down</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.cell}>Stretch</th>
                <th style={styles.cell}>Duration</th>
              </tr>
            </thead>
            <tbody>
              {plan.cooldown.map((cd, i) => (
                <tr key={i}>
                  <td style={styles.cell}>{cd.exercise}</td>
                  <td style={styles.cell}>{cd.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 800, margin: '2rem auto', padding: 20 },
  heading: { fontSize: '1.8rem', marginBottom: '1rem' },
  form: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginBottom: '1rem',
  },
  input: {
    flex: 1,
    minWidth: 120,
    padding: '0.5rem',
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#0074D9',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '1.5rem',
  },
  cell: {
    border: '1px solid #ccc',
    padding: '0.5rem',
    textAlign: 'left',
  },
  output: {
    whiteSpace: 'pre-wrap',
    background: '#f9f9f9',
    padding: '1rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
};
