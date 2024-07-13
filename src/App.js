import React from 'react';
import {useState, useEffect} from 'react';


const App = () => {
  const [ value, setValue] = useState(null); //input
  const [ message, setMessage] = useState(null); //output
  const [previousChats, setpreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);  
  
  const createNewChat = () => {
  	setMessage(null);
  	setValue("");
  	setCurrentTitle(null);
  }
  
  const handleClick = (uniqueTitle) => {
  	setCurrentTitle(uniqueTitle);
  }
  
  const getMessages = async () => {
    try {
      const response = await fetch('http://localhost:8000/completions', {
        method: 'POST', // Ensure you're sending a POST request
        headers: {
          'Content-Type': 'application/json',
        },
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
		console.log(currentTitle, value, message)
		if(!currentTitle && value && message){
			setCurrentTitle(value)
		}
		if(currentTitle && value && message){
			setpreviousChats(prevChats => (
			[...prevChats,
				{
					title: currentTitle,
					role: "user",
					content: value
				},
				{
					title: currentTitle,
					role: message.role,
					content: message.content
				}
			
			]
			))
		}
	}, [message, currentTitle])
	
	const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle);
	const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
	
  return (
    <div className="app">
     	<section className="side-bar">
     		<ul className="history">
	     		<nav>
	     			<p>Imagine</p>
	     		</nav>
	     		{uniqueTitles.map((uniqueTitle,index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
     		</ul>
     	     	<button onClick={createNewChat}>+ New Todo List</button>	
     	</section>
     	<section className= "main">
     		{!currentTitle && <h1>Imagine</h1>}
     		<ul className="feed">
     			{currentChat.map((chatMessage, index) => 
     			<li key={index}>
     				<p className ="role">{chatMessage.role}</p>
     				<p>{chatMessage.content}</p>     				
     			</li>)}
     		</ul>     		
     		<div className="bottom-section">
	     		<div className="input-container">
	     			<input value = {value} onChange={(e)=> setValue(e.target.value)}/>
	     			<div id="submit" onClick = {getMessages}>⏩</div>
	     		</div>   			

     		<p className = "info">
     			Imagine is our newest flagship model that provides GROQ-4-level intelligence that is much faster and improves on its capabilities across text, voice, and vision.
     		</p>
     	</div>     		
     	</section>
    </div>
  );
}

export default App;
