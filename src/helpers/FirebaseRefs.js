import Firebase from 'firebase';

export default {
  chatsRef() {
    return Firebase.database().ref('/chats');
  },

  chatRef(chatId) {
    return Firebase.database().ref(`/chats/${chatId}`);
  },

  chatStatusRef(chatId) {
    return Firebase.database().ref(`chats/${chatId}/status`);
  },

  chatMessagesRef(chatId) {
    return Firebase.database().ref(`chats/${chatId}/messages`);
  },

  chatUsersRef(chatId) {
    return Firebase.database().ref(`chats/${chatId}/users`);
  },

  userRef(uid) {
    return Firebase.database().ref(`users/${uid}`);
  },

  userChatsRef(uid) {
    return Firebase.database().ref(`/users/${uid}/chats`);
  },
};
