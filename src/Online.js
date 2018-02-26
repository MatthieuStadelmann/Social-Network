import React from 'react';
import { App } from './App';
import { connect } from 'react-redux';
import { allOnlineUsers } from './actions';

class Online extends React.Component {
  
  componentDidMount() {
    this.props.allOnlineUsers()
  };

  render() {
    const { allOnlineUsers, onlineUsers } = this.props

    if (!onlineUsers) {
      return null;
    }
    return (
    <div className="onlinenow">
       <h1>ONLINE NOW</h1>
      <div className="onlineusercontainer">
      <div className="onlineUsers">
        {
          onlineUsers.map((onlineUsers, index) => <div key={index}>
            <div className="nameandpicture">
              <img src={onlineUsers.imgurl}/>
              <p>{onlineUsers.first} {onlineUsers.last}</p>
            </div>
          </div>)
        }
      </div>
    </div>
  </div>)
  }
};

const mapStateToProps = (state) => {
  return {onlineUsers: state.onlineUsers}
};
const mapDispatchToProps = (dispatch) => {
  return {
    allOnlineUsers: () => dispatch(allOnlineUsers())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Online);
