import React from 'react';
import { App } from './App';
import { socket } from './socket';
import { connect } from 'react-redux';
import { getSocket } from './socket';


class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message:''
    }
    this.handleClick = this.handleKeyPress.bind(this)
  }

  handleKeyPress(e) {
    if (e.key == 'Enter') {
      getSocket().emit('chatMessage', {
        message: e.target.value
      });
      e.target.value = '';
    }
  };

  componenDidUpdate() {
    if (this.elem) {
      this.elem.scrollTop = this.elem.scrollHeight - this.elem.clientHeight;
    }
  }
  render() {

    const {messages, senders} = this.props


    if (!messages) {
      return <div><p>No messages found</p></div>;
    }
    return (
      <div className="realchatcontainer">
        <h1>LIVE CHAT</h1>
      <div className="chatcontainer">
      <div className="chat">
        <div className="messages">
          {
            messages.messages.map((messages, index) =>
            <div key={index} className="senderandhispic">
              <img src={messages.sender.imgurl}/>
              <p>{messages.sender.first}: {messages.message.message}</p>
            </div>)
          }
        </div>
        <div className="textarea">
        <textarea value={this.state.value} onKeyDown={this.handleKeyPress} placeholder="Send a message"/>
      </div>
    </div>
  </div>
</div>
)
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages || { messages:[] }
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
