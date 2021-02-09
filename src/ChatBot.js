import React, { useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import {
  Widget, addResponseMessage,
  addUserMessage,
  setQuickButtons,
  renderCustomComponent
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
const FILE_ROOT_URL = data.fileServerUrl;
const FILE_SUB_URL = data.fileServerPath;

const FormattedMessage = ({ message }) => {
  return (
    <div className="rcw-response">
      <div className="rcw-message-text" dangerouslySetInnerHTML={{ __html: message }} />
      <span className="rcw-timestamp">{new Date().toTimeString().slice(0, 5)}</span>
    </div>
  );
};

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
        setQuickButtons(data.message.buttons.map(button => ({ label: button.text, value: button.value })), true)
        return renderCustomComponent(FormattedMessage, { message: data.message.message }, true);
      } else {
        renderCustomComponent(FormattedMessage, { message: data.message }, true);
      }
    });
  }, []);

  const onFileChange = async (e) => {
    const url = FILE_ROOT_URL + FILE_SUB_URL
    const formData = new FormData();
    formData.append('file', e.target.files[0])
    const options = {
      method: 'POST',
      headers: { 'content-type': 'multipart/form-data' },
      data: formData,
      url,
    };
    let response = await axios(options)
    let data = response.data.data || []

    data.forEach((element) => {
      addUserMessage(`![vertical](${FILE_ROOT_URL}file/${element})`);
    });

    socket.emit("new_message", {
      attachments: data.map(
        (element) => `${FILE_ROOT_URL}file/${element}`
      ),
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
