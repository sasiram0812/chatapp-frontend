// Home.js
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { MessageCircle, LogOut } from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';
import './Home.css';
import { auth } from './firebase'; // Make sure path is correct!

const socket = io('https://chatapp-backend-1mk0.onrender.com');

function Home() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch username from Firebase Auth
  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }
    setUserName(auth.currentUser.displayName || auth.currentUser.email);
  }, [navigate]);

  // Socket events: receive messages & chat history
  useEffect(() => {
    socket.on('chat history', (msgs) => {
      setMessages(msgs);
    });
    socket.on('chat message', (data) => {
      setMessages((prev) => [...prev, data]);
    });
    socket.on('update message', ({ index, newText }) => {
      setMessages((prev) => {
        const updated = [...prev];
        if (updated[index]) updated[index].text = newText;
        return updated;
      });
    });
    socket.on('delete message', (index) => {
      setMessages((prev) => prev.filter((_, i) => i !== index));
    });

    socket.emit('get messages');

    return () => {
      socket.off('chat history');
      socket.off('chat message');
      socket.off('update message');
      socket.off('delete message');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    const msg = {
      sender: userName,
      text: message,
      avatarColor: getAvatarColor(userName),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    if (editingIndex !== null) {
      // socket.emit('update message', { index: editingIndex, newText: message }); // handle in backend if desired
      setEditingIndex(null);
    } else {
      socket.emit('chat message', msg);
    }
    setMessage('');
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSend(); };
  const handleEdit = (index) => { setMessage(messages[index].text); setEditingIndex(index); };
  const handleDelete = (index) => { setMessages(messages.filter((_, i) => i !== index)); };
  const handleLogout = async () => { await auth.signOut(); navigate('/login'); };
  const getAvatarColor = (name) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6C5CE7', '#00B894', '#E17055'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="home-container">
      {/* HEADER WITH ANIMATED LOGO */}
      <motion.div
        className="home-header"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70 }}
      >
        <motion.div
          className="home-logo"
        >
          <div className="home-logo">
  <motion.span
    animate={{ y: [0, -3, 0] }}
    transition={{
      repeat: Infinity,
      duration: 1,
      ease: "easeInOut"
    }}
    style={{ display: 'inline-block' }}
  >
    <MessageCircle size={40} className="logo-icon" />
  </motion.span>
  <h1 className="app-name">ChatApp</h1>
</div>

        </motion.div>
        <div className="user-profile">
          <div className="avatar" style={{ backgroundColor: getAvatarColor(userName) }}>
            {userName ? userName.charAt(0).toUpperCase() : ""}
          </div>
          <span className="username">{userName}</span>
          <motion.button onClick={handleLogout} className="logout-btn"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <LogOut size={18} /> Logout
          </motion.button>
        </div>
      </motion.div>

      {/* CHAT BOX */}
      <div className="chat-box">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={msg._id || index}
              className={`message ${msg.sender === userName ? 'sent' : 'received'}`}
              initial={{ opacity: 0, x: msg.sender === userName ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 60 }}
            >
              <div className="avatar" style={{ backgroundColor: msg.avatarColor || getAvatarColor(msg.sender) }}>
                {msg.sender.charAt(0).toUpperCase()}
              </div>
              <div className="message-content">
                <div className="message-meta">
                  <span className="sender">{msg.sender === userName ? 'You' : msg.sender}</span>
                  <span className="timestamp">{msg.time}</span>
                </div>
                <p className="message-text">{msg.text}</p>
                {msg.sender === userName && (
                  <div className="message-actions">
                    <motion.button onClick={() => handleEdit(index)}>Edit</motion.button>
                    <motion.button onClick={() => handleDelete(index)}>Delete</motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef}></div>
      </div>

      {/* CHAT INPUT */}
      <motion.div className="chat-input"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, delay: 0.15 }}
      >
        <input
          type="text"
          placeholder={editingIndex !== null ? "Editing message..." : "Type a message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <motion.button onClick={handleSend}
          whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
          {editingIndex !== null ? 'Update' : 'Send'}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Home;
