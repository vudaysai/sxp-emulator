import React, { useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import {
  Widget, addResponseMessage,
  addUserMessage,
  setQuickButtons,
} from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import './chat.css';

const data = JSON.parse(localStorage.getItem("data")) || {};
const botId = data.botId || `${+ new Date()}`;
let socket;
if (data.path) {
  socket = io(data.url, { path: data.path });
} else {
  socket = io(data.url);
}
const appId = data.appId;
const fileServerURL = data.fileServerUrl;

function Chat() {
  useEffect(() => {
    socket.on('joined', (_) => {
      addResponseMessage('Welcome to SXP');
    })
    socket.emit('join', {
      userid: botId,
    })
    socket.on('disconnect', () => {
      socket.open();
    });
    socket.on('new_message', data => {
      if (data.input_type === 'button') {
        setQuickButtons(data.message.buttons.map(button => ({ label: button.text, value: button.value })), false)
        return addResponseMessage(data.message.message);
      } else {
        addResponseMessage(data.message);
      }
    });
  }, []);

  const onFileChange = async (e) => {
    const url = fileServerURL
    const formData = new FormData();
    formData.append('file', e.target.files[0])
    const options = {
      method: 'POST',
      headers: { 'content-type': 'multipart/form-data' },
      data: formData,
      url,
    };
    let response = await axios(options)
    let data = response.data.data
    addUserMessage(`![vertical](${fileServerURL}file/${data[0]})`);
    socket.emit("new_message", {
      attachments: [`${fileServerURL}file/${data[0]}`],
      userid: botId,
      appId: appId,
    })
  }

  const handleNewQuickReplyMessage = (newMessage) => {
    setQuickButtons([], true)
    addUserMessage(newMessage.label)
    socket.emit('new_message', {
      userid: botId,
      appId: appId,
      message: newMessage.value
    })
  };

  const handleNewUserMessage = (newMessage) => {
    setQuickButtons([])
    socket.emit('new_message', {
      userid: botId,
      appId: appId,
      message: newMessage
    })
  };

  const onRestart = () => {
    setQuickButtons([])
    socket.emit('new_message', {
      userid: botId,
      appId: appId,
      message: "::restart"
    })
  }

  const onEdit = () => {
    setQuickButtons([])
    socket.emit('new_message', {
      userid: botId,
      appId: appId,
      message: "::edit"
    })
  }

  if (data && data.url && data.appId) {
    return (
      <Widget
        title="SXP"
        subtitle="Test published services here"
        imagePreview
        showCloseButton={true}
        fullScreenMode={false}
        senderPlaceHolder="Enter Message Here ..."
        handleNewUserMessage={handleNewUserMessage}
        handleQuickButtonClicked={handleNewQuickReplyMessage}
        onRestart={onRestart}
        onEdit={onEdit}
        onFileUpload={onFileChange} />
    );
  } else {
    return null;
  }
}

export default Chat;
