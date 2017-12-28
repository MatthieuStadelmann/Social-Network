import axios from './axios';


// getFriend ACTION========
export function getFriends() {
  return axios.get('/getfriends').then(function({data}) {
    return {type: 'GET_FRIENDS', friends: data.data};
  })
};

// acceptFriend ACTION=====
export function acceptFriendreq(id) {
  const data = {
    action: "accept",
    id: id
  }
  return axios.post("/friend-requests/" + id, data).then(() => {
      location.assign('http://localhost:8080/friends/');
    return {type: "ACCEPT_FRIEND_REQUEST", id}
  })
};

// terminateFriend ACTION=====
export function terminFriend(id) {
  const data = {
    action: "terminate",
    id: id
  }
  return axios.post("/friend/" + id, data).then(() => {
        location.assign('http://localhost:8080/friends/');
    return {type: "TERMINATE_FRIENDSHIP", id}
  })
};

//SOCKET
// GET ALL ONLINE USERS =====
export function allOnlineUsers(id) {
  const data = {
    action: "getonlineusers",
    id: id
  };
  return axios.get("/get-all-online-users/" + id, data).then((onlineUsersData) => {
    return {type: "GET_ONLINE_USERS", onlineUsers: onlineUsersData.data.onlineUsersInfos}
  })
};

//DISCONNECT=======
export function disconnect(userLeft) {
  return {type: "USER_DISCONNECT", userLeft }
};
//USER_JOINED

export function userJoined(heJustJoined) {
  return {type: "USER_JOINDED", heJustJoined}
};

//GET A NEW MESAGE
export function newMessage(messages) {
  return {type: "NEW_MESSAGE_RECEIVED", messages}
};

//GET ALL MESSAGES
export function getAllMessage(messages) {
    return{type: "GET_ALL_MESSAGES", messages}
  };
