import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import GymScanner     from './components/GymScanner';
import WorkoutPlanner from './components/WorkoutPlanner';
import ChatBot        from './components/ChatBot';
import WorkoutLogger  from './components/WorkoutLogger';

function App() {
  return (
    <Router>
      <nav style={styles.nav}>
        <NavLink to="/"       style={styles.link} end>🏠 Home</NavLink>
        <NavLink to="/scan"   style={styles.link}>📷 Scanner</NavLink>
        <NavLink to="/plan"   style={styles.link}>📋 Planner</NavLink>
        <NavLink to="/chat"   style={styles.link}>🤖 ChatBot</NavLink>
        <NavLink to="/log"    style={styles.link}>📝 Logger</NavLink>
      </nav>

      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/"      element={<h1>Welcome to ShariraAI!</h1>} />
          <Route path="/scan"  element={<GymScanner />} />
          <Route path="/plan"  element={<WorkoutPlanner />} />
          <Route path="/chat"  element={<ChatBot />} />
          <Route path="/log"   element={<WorkoutLogger />} />
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
  nav: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#eee',
    borderBottom: '1px solid #ccc',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold',
  },
};

export default App;
