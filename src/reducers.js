//REDUCERS======================================================================
export default function(state = {}, action) {
  if (action.type == 'GET_FRIENDS') {
    state = Object.assign({}, state, {friends: action.friends});
  }
  //ACCEPT
  if (action.type == "ACCEPT_FRIEND_REQUEST") {
    state = Object.assign({}, state, {
      friends: state.friends.map(friend => {

        if (friend.id == action.id) {

          return Object.assign({}, friend, {status: 1});
        } else {
          return friends
        }
      })
    });
  }
  //TERMIN
  if (action.type == "TERMINATE_FRIENDSHIP") {
    state = Object.assign({}, state, {
      friends: state.friends.map(friend => {
        if (friend.id == action.id) {
          return Object.assign({}, friend, {status: 2});
        } else {
          return friends
        }
      })
    });
  }

  //SOCKET GET FRIENDS===
  if (action.type == 'GET_ONLINE_USERS') {

    state = Object.assign({}, state, {onlineUsers: action.onlineUsers});
  }

  //USER LEFT ==================================

  if (action.type == 'USER_DISCONNECT') {
    if (!state.onlineUsers) {
      return state
    } else {
      var arr = state.onlineUsers.filter(user => {
        return user.id !== action.userLeft.leftUser.userId
      })
      state = Object.assign({}, state, {
        onlineUsers: state.onlineUsers.filter(user => {
          return user.id !== action.userLeft.leftUser.userId
        })

      });
    }
  }

  //USER JOINDED================================

  if (action.type == 'USER_JOINDED') {

    if (!state.onlineUsers) {
      return state;
    }
    if (state.onlineUsers.some(function(user) {
      return user.id == action.heJustJoined.heJustJoined.id
    })) {
      return state;

    } else {
      state = Object.assign({}, state, {

        onlineUsers: state.onlineUsers.concat(action.heJustJoined.heJustJoined)
      });
    }
  }

  //CHAT==========================================

  if (action.type == 'NEW_MESSAGE_RECEIVED') {
    if (!action.messages) {
      return state
    } else {
      state = Object.assign({}, state, {
        messages: action.messages,
        sender: action.sender
      })
    }
  }

  if (action.type == 'GET_ALL_MESSAGES') {
    if(!action.messages) {
      console.log(action)
      return state
    } else {
      state = Object.assign({}, state, {
        messages: action.messages,
        sender: action.sender
      })
    }
  }
  return state;
}
