import * as io from 'socket.io-client';
import {allOnlineUsers, disconnect, userJoined, newMessage, getAllMessage} from './actions';
import axios from './axios';
import {store} from './start'


let socket;

export function getSocket() {
  if (!socket) {
    socket = io.connect();
    socket.on('connect', function() {
      store.dispatch(allOnlineUsers(socket.id))
    });
    socket.on('userJoined', function(heJustJoined) {
      store.dispatch(userJoined(heJustJoined))
    });

    socket.on('userLeft', function(userLeft) {
      store.dispatch(disconnect(userLeft))
    });

    socket.on('chatMessage', function(messages) {
      store.dispatch(newMessage(messages))
    });
    socket.on('allMessages', function(messages) {
      store.dispatch(getAllMessage(messages))
    })
  }
  return socket;
}
