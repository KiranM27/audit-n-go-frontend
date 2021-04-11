import React, { useState, useEffect } from 'react';
import { Widget, addResponseMessage, addUserMessage, markAllAsRead, deleteMessages } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';

import logo from '../../logo.svg';
import './chat_style.css'

function Chat() {

  const [messageInit, setMessageInit] = useState(false)
	const [noMessages, setNoMessages] = useState(0)
	const [messages, setMessages] = useState([])
	// const [messages, setMessages] = useState(["Fucked up beyond all repair", "Situation Normal, All Fucked up", "An Imperial Fuck up"])

	const getCustomLauncher = (handleToggle) =>
    <button onClick={handleToggle}>This is my launcher component!</button>

  useEffect(() => {
		deleteMessages(noMessages)
		markAllAsRead()
		if (messageInit === false) {
    	addResponseMessage('Please feel free to use this space for discussions regarding audits !')
    	addResponseMessage('Hey, I am the admin. How can I help ?', "admin")
      
			setMessageInit(true)
			setNoMessages(noMessages + 1)

			messages.map(message => {
				addUserMessage(message)
				setNoMessages(noMessages + 1)
			})
		}
  }, []);

  const handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
    // Now send the message throught the backend API
  };

    return (
      <div>
        <Widget
          handleNewUserMessage={handleNewUserMessage}
          profileAvatar={logo}
          title="Discussions"
          subtitle="Any queries regarding audits can be clarified here"
					showTimeStamp = { false }
					// launcher={handleToggle => getCustomLauncher(handleToggle)}
        />
      </div>
    );
}

export default Chat;