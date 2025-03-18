import React, { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { addChat } from "@/Store/chat";
import { ToastMessage } from "../Home/ToastMessage";
import axios from "axios";
import { BACKEND_END_POINT } from "@/utils/Constants";
import { useDispatch, useSelector } from "react-redux";
import { store } from "@/Store";


const ChatInput = ( {setLoading} ) => {

  // console.log(setLoading)
  const allChats = useSelector((store) => store.chat);
  const {fileURL} = useSelector(store => store.fileURL)
  const dispatch = useDispatch();
  

  const newMessage = useRef(null);



  const handleSend = async (e) => {
    e.preventDefault();




    try {
      
      setLoading(true)

      if (!newMessage.current.value.trim()) return;
    
      const message = {
        id: allChats.length + 1,
        text: newMessage.current.value,
        sender: "user",
        answerFormat : ""
      };
  
      newMessage.current.value = "";
      dispatch(addChat(message));

      const req = 
        {
          "query": message.text,
           "file_url": fileURL
        }
      

        const response = await axios.post(`${BACKEND_END_POINT}/chat`, req, {
          headers: {
            "Content-Type": "application/json",
          },
            withCredentials: true,
          })
          

          console.log(response.data)

        if(response.data.success){
            const botResponse =  {
              id: allChats.length + 2,
              text: response.data.answer,
              sender: "bot",
              answerFormat: response.data.answerFormat
            };
            console.log("Bot answer formate  is: ",response.data.answerFormat);
            console.log("Bot answer is: ",response.data.answer);
            
            dispatch(addChat(botResponse));

        }else{
            ToastMessage("Error", response.data.message);
        }

    } catch (error) {
        ToastMessage("Error", error.message);
    }finally{
      setLoading( false )
    }
  };

  return (
    <form className="flex gap-2 items-center  w-[60%] rounded items-center bg-[#444]" onSubmit={handleSend}>
      <Textarea
        ref={newMessage}
        placeholder="Type your message here."
        id="message" // style is defined in app.css
        className="resize-none border-none focus:border-transparent focus:ring-0 focus:outline-none item-center"
      />
      <button className="mr-3 sendBtn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f1efef"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-send-horizontal"
        >
          <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
          <path d="M6 12h16" />
        </svg>
      </button>
    </form>
  );
};

export default ChatInput;
