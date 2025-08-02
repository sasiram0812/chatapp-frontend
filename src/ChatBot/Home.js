// Home.js
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import './Home.css';
import { MessageCircle, LogOut } from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const socket = io('https://chatapp-backend-1mk0.onrender.com');

function Home() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const messagesEndRef = useRef(null);

  // ✅ Store username in localStorage so prompt shows only once
  useEffect(() => {
    let name = localStorage.getItem('chatUser');
    if (!name) {
      name = prompt('Enter your name');
      if (!name) {
        navigate('/login');
        return;
      }
      localStorage.setItem('chatUser', name);
    }
    setUserName(name);
  }, [navigate]);

  // ✅ Socket Listeners (messages, update, delete)
  useEffect(() => {
    socket.on('chat message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on('update message', ({ index, newText }) => {
      setMessages((prevMessages) => {
        const updated = [...prevMessages];
        if (updated[index]) updated[index].text = newText;
        return updated;
      });
    });

    socket.on('delete message', (index) => {
      setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
    });

    return () => {
      socket.off('chat message');
      socket.off('update message');
      socket.off('delete message');
    };
  }, []);

  // ✅ Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ Send or Update message
  const handleSend = () => {
    if (!message.trim()) return;

    const msg = {
      sender: userName,
      text: message,
      avatarColor: getAvatarColor(userName),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (editingIndex !== null) {
      socket.emit('update message', { index: editingIndex, newText: message });
      setEditingIndex(null);
    } else {
      socket.emit('chat message', msg);
    }

    setMessage('');
  };

  // ✅ Send message on Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  // ✅ Edit message
  const handleEdit = (index) => {
    setMessage(messages[index].text);
    setEditingIndex(index);
  };

  // ✅ Delete message
  const handleDelete = (index) => {
    socket.emit('delete message', index);
  };

  // ✅ Logout clears localStorage
  const handleLogout = () => {
    localStorage.removeItem('chatUser');
    navigate('/login');
  };

  // ✅ Generate consistent avatar color per user
  const getAvatarColor = (name) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6C5CE7', '#00B894', '#E17055'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="home-container">
      {/* HEADER */}
      <motion.div 
        className="home-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80 }}
      >
        <div className="home-logo">
          <MessageCircle size={40} className="logo-icon" />
          <h1 className="app-name">ChatApp</h1>
        </div>

        <div className="user-profile">
          <div 
            className="avatar" 
            style={{ backgroundColor: getAvatarColor(userName) }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="username">{userName}</span>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout} 
            className="logout-btn"
          >
            <LogOut size={18} /> Logout
          </motion.button>
        </div>
      </motion.div>

      {/* CHAT BOX */}
      <div className="chat-box">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              className={`message ${msg.sender === userName ? 'sent' : 'received'}`}
              initial={{ opacity: 0, x: msg.sender === userName ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: 'spring', stiffness: 60 }}
            >
              {/* Avatar */}
              <div 
                className="avatar" 
                style={{ backgroundColor: msg.avatarColor || getAvatarColor(msg.sender) }}
              >
                {msg.sender.charAt(0).toUpperCase()}
              </div>

              <div className="message-content">
                <div className="message-meta">
                  <span className="sender">{msg.sender === userName ? 'You' : msg.sender}</span>
                  <span className="timestamp">{msg.time}</span>
                </div>
                <p className="message-text">{msg.text}</p>

                {/* Buttons for edit/delete */}
                {msg.sender === userName && (
                  <div className="message-actions">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef}></div>
      </div>

      {/* CHAT INPUT */}
      <motion.div 
        className="chat-input"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 70 }}
      >
        <input
          type="text"
          placeholder={editingIndex !== null ? "Editing message..." : "Type a message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
        >
          {editingIndex !== null ? 'Update' : 'Send'}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Home;
