import React from 'react';
import {App} from './App';
import {connect} from 'react-redux';
import {getFriends, acceptFriendreq, terminFriend} from './actions';
import {Link} from 'react-router';

class Friends extends React.Component {
  componentDidMount() {
    this.props.getFriends();
  };
  render() {
    const {friends, wanabies, getFriends, acceptFriendreq, terminFriend} = this.props

    if (!friends) {
      return null;
    }
    return (<div className="container">
      <div className="friends">
            <h1>FRIEND LIST </h1>
        <p id="yourfriends">YOUR FRIENDS</p>
        <div id="friends">
          {
            friends.map((friends, index) => <div key={index}>
              <div className="nameandpicture">
                <Link to={`/users/${friends.id}`}>
                  <img src={friends.imgurl}/>
                </Link>
                <p>{friends.first} {friends.last}</p>
              </div>
              <button onClick={() => {
                  this.props.terminFriend(friends.id)
                }}>
                Terminate Friend Request
              </button>
            </div>)
          }
        </div>
        <div className="wanabies">
          <p>FRIEND REQUESTS</p>
        </div>
        <div id="wanabies">
          {
            wanabies.map((wanabies, index) => <div key={index}>
              <div className="nameandpicture">
                <Link to={`/users/${wanabies.id}`}>
                  <img src={wanabies.imgurl}/>
                </Link>
                <p>{wanabies.first} {wanabies.last}</p>
              </div>
              <button onClick={() => {
                  this.props.acceptFriendreq(wanabies.id)
                }}>
                Accept Friend Request
              </button>
            </div>)
          }
        </div>
      </div>
    </div>)

  }
};
const mapStateToProps = (state) => {
  console.log('MY STATE', state)
  return {
    friends: state.friends && state.friends.filter(friends => friends.status == '3'),
    wanabies: state.friends && state.friends.filter(friends => friends.status == '1')
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    getFriends: () => dispatch(getFriends()),
    acceptFriendreq: (id) => dispatch(acceptFriendreq(id)),
    terminFriend: (id) => dispatch(terminFriend(id))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Friends);
