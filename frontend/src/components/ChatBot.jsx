import React, { useState, useRef, useEffect } from 'react';
import API from '../api';

export default function ChatBot() {
  const [msgs, setMsgs] = useState([]);
  const [inp, setInp]  = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  const send = async () => {
    if (!inp.trim()) return;
    const userMsg = { sender: 'You', text: inp };
    setMsgs(m => [...m, userMsg]);
    setLoading(true);
    setInp('');
    try {
      const res = await API.post('/chat', { message: inp });
      const botMsg = { sender: 'Bot', text: res.data.reply };
      setMsgs(m => [...m, botMsg]);
    } catch (e) {
      alert('Chat error: ' + (e.response?.data?.error || e.message));
    } finally {
      setLoading(false);
    }
  };

  // auto-scroll
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [msgs, loading]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🤖 Fitness ChatBot</h2>
      <div style={styles.window}>
        {msgs.map((m, i) => (
          <div key={i} style={m.sender==='Bot'?styles.bot:styles.you}>
            <strong>{m.sender}:</strong> {m.text}
          </div>
        ))}
        {loading && <div style={styles.bot}><em>Bot is typing…</em></div>}
        <div ref={bottomRef} />
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={inp}
          onChange={e => setInp(e.target.value)}
          onKeyDown={e => e.key==='Enter' && send()}
          placeholder="Ask me anything…"
        />
        <button style={styles.button} onClick={send}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 700, margin: '2rem auto', padding: 20 },
  heading:   { fontSize: '1.8rem', marginBottom: '1rem' },
  window:    { height: 350, overflowY: 'auto', border: '1px solid #ccc', padding: 10, borderRadius: 4, marginBottom: '1rem', background: '#fafafa' },
  you:       { textAlign: 'right', margin: '0.5rem 0' },
  bot:       { textAlign: 'left',  margin: '0.5rem 0' },
  inputRow:  { display: 'flex', gap: '0.5rem' },
  input:     { flex: 1, padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' },
  button:    { padding: '0.6rem 1.2rem', background: '#2ECC40', color: '#fff', border:'none', borderRadius:4, cursor:'pointer' }
};
