import axios from "axios";
import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
// import { Socket } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { useEffect } from "react";


export const ChatContext = createContext();

export const ChatProvider = ({children}) =>{

    const {socket,axios} = useContext(AuthContext)
    const [messages,setMessages] = useState([]);//store msgs of selected user
    const [users,setUsers] = useState([]);//store the list of users for left side bar
    const [selectedUser,setSelectedUser] = useState(null);//store id of the user to whom want to chat
    const [unseenMessages,setUnseenMessages] = useState({});//store obj in key value (id , no. of useen msgs of the particular user)

    //Function to get all users for sidebar
    const getUsers = async () =>{
        try {
            const {data} = await axios.get("/api/messages/users");
            if (data.success){
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message)   
        }
    }

    //Function to get messages for selected user
    const getMessages = async (userId) =>{
        try {
            const {data} = await axios.get(`/api/messages/${userId}`)
            if(data.success){
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)   
        }
    }

    //Function to send messages to the selected user
    const sendMessage = async (messageData) =>{
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`,messageData);//added await
            if(data.success){
                setMessages((prevMessages) =>[...prevMessages,data.newMessage])//spread operator
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    //Function to subscribe to messages for selected user
    const subscribeToMessages = async () =>{
        if(!socket) return;
        socket.on("newMessage", (newMessage) =>{
            if(selectedUser && newMessage.senderId === selectedUser._id){ //chatbox is open for selected user
                newMessage.seen = true;
                setMessages((prevMessages) =>[...prevMessages,newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }
            else{
                setUnseenMessages((prevUnseenMessages) => ({ // returns an object here
                    ...prevUnseenMessages,[newMessage.senderId] : 
                    prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] +1 : 1
                }))
            }
        })
    }


    //Function to unsubscribe from messages
    const unsubscribeFromMessages = () =>{
        if(socket) socket.off("newMessage");
    }

    useEffect(() =>{
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    },[socket,selectedUser])


    const value ={
        messages,users,selectedUser,getUsers,setMessages,sendMessage,setSelectedUser,
        unseenMessages,setUnseenMessages,getMessages
    }
    return(
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}