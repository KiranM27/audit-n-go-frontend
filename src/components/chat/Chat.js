import React, { useState, useEffect, useRef } from 'react';
import { Widget, addResponseMessage, addUserMessage, markAllAsRead, deleteMessages } from 'react-chat-widget';
import io from "socket.io-client"
import { connect } from 'react-redux';
import 'react-chat-widget/lib/styles.css';

import logo from '../../logo.svg';
import './chat_style.css'
import axios from 'axios';

function Chat(props) {

  // Setting up the socket.io client
  const socketRef = useRef()
  const [yourSocketId, setYourSocketId] = useState("pladeholder_id")

  useEffect(() => {
    let localMessages;

    for (let i =0; i < props.noMessages; i ++) {
      deleteMessages()
    }
    props.dispatch({ type: 'setNoMessages', noMessages: 0})

    // Setting up socket.io client
    socketRef.current = io.connect("https://www.audit-n-go-backend.technopanther.com")
    socketRef.current.on("socketId", yourSocketId => {
      setYourSocketId(yourSocketId)
      let localSokcetId = yourSocketId;

      socketRef.current.on("message", ({ isAdmin, socketId, audit_id, message }) => {
        if (socketId != localSokcetId) {
          if (audit_id === props.audit_id) {
            if (isAdmin) {
              if (props.loggedInUser.isAdmin) {
                addUserMessage(message)
              } else {
                addResponseMessage(message)
              }
            } else {
              if (props.loggedInUser.isAdmin) {
                addResponseMessage(message)
              } else {
                addUserMessage(message)
              }
            }
          }
          
        }
      });
    })

    axios.get("https://www.audit-n-go-backend.technopanther.com/getMessages/" + props.audit_id)
    .then(res => {
      localMessages = res.data
      console.log("messages retreived from db are ", localMessages)
      // Setting up messsages
      // clearing messages and resetting any residual messages to read
      markAllAsRead()

      // Loading messages
      if (localMessages != null && localMessages.length != 0){
        for (let i = 0; i < localMessages.length; i ++) {
          const localMessage = localMessages[i].chat_details.message
          if (localMessages[i].chat_details.fromAdmin) {
            if (props.loggedInUser.isAdmin) {
              addUserMessage(localMessage)
            } else {
              addResponseMessage(localMessage)
            }
          } else {
            if (props.loggedInUser.isAdmin) {
              addResponseMessage(localMessage)
            } else {
              addUserMessage(localMessage)
            }
          }
        }
        props.dispatch({ type: 'setNoMessages', noMessages: props.noMessages + localMessages.length })
      } else {
        console.log("EHRE");
        if (props.loggedInUser.isAdmin) {
          addUserMessage('Please feel free to use this space for discussions regarding audits !')
          addUserMessage('Hey, I am the admin. How can I help ?')
        } else {
          addResponseMessage('Please feel free to use this space for discussions regarding audits !')
          addResponseMessage('Hey, I am the admin. How can I help ?')
        }
        props.dispatch({ type: "setNoMessages", noMessages: props.noMessages + 2})
      }
    }).catch(e => {
      console.log(e) });
  }, []);

  function handleNewUserMessage (newMessage) {
    socketRef.current.emit("message", { isAdmin: props.loggedInUser.isAdmin, socketId: yourSocketId, 
      audit_id: props.audit_id, message: newMessage})
    props.dispatch({ type: "setNoMessages", noMessages: props.noMessages + 1 })
    axios.post("https://www.audit-n-go-backend.technopanther.com/newMessage", {
      "audit_id": props.audit_id,
      "chat_details": {
        "fromAdmin": props.loggedInUser.isAdmin,
        "message": newMessage
      }
      }).then((response) => {
          console.log("Message sent !")
      }).catch((error) => {
          console.log(error);
      })
  };

    return (
      <div>
        <Widget
          handleNewUserMessage={handleNewUserMessage}
          profileAvatar={logo}
          title="Discussions"
          subtitle="Any queries regarding audits can be clarified here"
					showTimeStamp = { false }
        />
      </div>
    );
}

const mapStateToProps = function(state) {
    return {
        noNotifications: state.noNotifications,
        loggedInUser: state.loggedInUser,
        noMessages: state.noMessages
    }
}
export default connect(mapStateToProps)(Chat);