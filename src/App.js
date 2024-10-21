import React, { useState, useEffect, useCallback, useMemo } from 'react';

const App = () => {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const createNewChat = useCallback(() => {
    setMessage(null);
    setValue('');
    setCurrentTitle(null);
  }, []);

  const handleClick = useCallback((uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
  }, []);

  const getMessages = async () => {
    try {
      const response = await fetch('http://localhost:8000/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: value }),
      });

      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      const json = await response.json();
      setMessage(json.choices[0].message);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (currentTitle === null && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats(prevChats => [
        ...prevChats,
        { title: currentTitle, role: 'user', content: value },
        { title: currentTitle, role: message.role, content: message.content },
      ]);
    }
  }, [message, currentTitle, value]);

  const currentChat = useMemo(() => (
    previousChats.filter(chat => chat.title === currentTitle)
  ), [previousChats, currentTitle]);

  const uniqueTitles = useMemo(() => (
    Array.from(new Set(previousChats.map(chat => chat.title)))
  ), [previousChats]);

  return (
    <div className="app">
      <section className="side-bar">
        <ul className="history">
          <nav>
            <p>Imagine</p>
          </nav>
          {uniqueTitles.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <button onClick={createNewChat}>+ New Todo List</button>
      </section>
      <section className="main">
        {!currentTitle && <h1>Imagine</h1>}
        <ul className="feed">
          {currentChat.map((chatMessage, index) => (
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input
              value={value}
              onChange={e => setValue(e.target.value)}
            />
            <div id="submit" onClick={getMessages}> ➡️  </div>
          </div>
          <p className="info">
            Imagine is our newest flagship model that provides GROQ-4-level intelligence that is much faster and improves on its capabilities across text, voice, and vision.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;

