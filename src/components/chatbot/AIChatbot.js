import React from "react";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";

const theme = {
  background: "#f5f8fb",
  fontFamily: "Helvetica Neue",
  headerBgColor: "#34cce6",
  headerFontColor: "#fff",
  headerFontSize: "15px",
  botBubbleColor: "#34cce6",
  botFontColor: "#fff",
  userBubbleColor: "#fff",
  userFontColor: "#4a4a4a"
};

const config ={
  width: "350px",
  height: "500px", 
	floating: true,
  headerTitle: "Chat with Panther, the Chatbot",
};

function AIChatbot() {
  return (
    <ThemeProvider theme={theme} className = {"h1 h2 h3 h4 h5 h6"}>
      <ChatBot 
        steps={[
          {
            id:'intro', 
            message:'Do you agree to the Terms and Conditions?', 
            trigger:'intro-user',
          },
          {
            id:'intro-user', 
            options:[
            {value:'y', label:'Yes', trigger:'yes-response'},
            {value:'n', label:'No', trigger:'no-response'},
            ] 
          },
          {
            id:'yes-response', 
            message:'Great!', 
            end:true,
          },
          {
            id:'no-response', 
            message:'Sorry to hear that.', 
            end:true,
          },
        ]}
        {...config}
      />
    </ThemeProvider>
  );
}

export default AIChatbot
