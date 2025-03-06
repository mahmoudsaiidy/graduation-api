require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./modules/user');
const Chat = require('./modules/chat');
const cors = require('cors');
const ngrok = require('ngrok');
const axios = require("axios");

app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb+srv://ai:10203040@cluster0.1ipyd.mongodb.net/").then(r => console.log('connect to db'))
.catch(e => console.log('connect faild', e));


app.use('/users', require('./routes/user_routes')); // login and register



async function Update(email, message, response) {
    try {
        const exist = await Chat.findOne({ email });

        if (exist) {
            exist.chat.push({ message, response }); 
            await exist.save();
            console.log("Chat updated successfully:", exist);

        } else {
            // if the user the one calling then this case hase been handled 
            const newChat = new Chat({
                email,
                chat: [{ message, response }]  
            });
            await newChat.save();
            console.log("New chat document created:", newChat);
        }
    } catch (err) {
        console.log("Error updating chat:", err);
    }
}

app.post('/chat-with-ai', async (req, res) => {
    try {
        const { email, message } = req.body;
        const response = await axios.post("https://5146-104-198-111-1.ngrok-free.app/chat", { email, message });

        if(typeof response.data === 'string'){
            response.data = JSON.parse(response.data)
        }

        let filterResponse = response.data.response.replace(/\n+/g, ' ').replace(/\*/g, '');

        await Update(email, message, filterResponse);
        console.log(response.data);
        res.json(filterResponse);

    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ err: "Error communicating with AI server" });
    }
});


app.post('/all-chat', async (req, res) => {
    try {
        const { email } = req.body;

        let chatData = await Chat.findOne({ email }).lean();
        if (!chatData) {
            chatData = new Chat({
                email,
                chat: []
            });
            await chatData.save();
        }

        chatData.chat = chatData.chat.map(({ _id, ...rest }) => rest);
        console.log(chatData.chat);
        res.json(chatData.chat);

    } catch (err) {
        console.log("Error fetching chat:", err);
        res.status(500).json({ err: "Internal Server Error" });
    }
});    

app.use((req, res)=>{
    res.send({msg: "online"});
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => { console.log('online'); });
