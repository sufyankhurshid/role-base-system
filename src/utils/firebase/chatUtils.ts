import firebase from 'firebase/app';
import { db } from 'contexts/FirebaseContext';
import { deCryptMessage } from '../security';

type User = {
  _id?: string | number;
  id?: string | number;
  name?: string;
  avatar?: string;
  fullname?: string;
  chatId?: string;
};

export type ChatItem = {
  chatId: string;
  userId: string;
  therapistId: string;
  user: User;
};

export type Message = {
  _id: string | number;
  text: string;
  createdAt: Date | number;
  user: User;
  image?: string;
  chatId?: string;
  sent: boolean;
  senderId: string;
  received: boolean;
  parentMessage?: Message;
};

export function getMyChats(therapistId: string, onSnapshot: (chats: any) => void) {
  db.collection('chats')
    .where('therapistId', '==', therapistId)
    .get()
    .then(async (snapshot) => {
      const chats: any = snapshot.docs.map((doc) => {
        return {
          chatId: doc.id,
          ...doc.data()
        };
      });

      const userIds = chats.map((chat: any) => {
        return chat.userId;
      });

      if (userIds.length) {
        await getUsersById(userIds)
          .get()
          .then((snap) => {
            const usersData = snap.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id
            }));
            const formattedChats: ChatItem[] = chats.map((chat: ChatItem) => {
              const index = usersData.findIndex((user) => user.id === chat?.userId);
              return { ...chat, user: usersData?.[index] ?? {} };
            });
            onSnapshot(formattedChats);
          });
      }
    });
}

export function getUsersById(ids: string[]) {
  return db.collection('users').where(firebase.firestore.FieldPath.documentId(), 'in', ids);
}

export function getMessages(
  chatId: string,
  limit: number = 100,
  order: firebase.firestore.OrderByDirection = 'asc',
  onSnapshot: (messages: Message[]) => void
) {
  const unlisten = db
    .collection(`messages/${chatId}/conversation`)
    .orderBy('createdAt', order)
    .limit(limit)
    .onSnapshot((snapshot) => {
      const docs = snapshot.docs.map((doc) => {
        const message = doc.data();
        return {
          docId: doc.id,
          ...message,
          text: deCryptMessage(message?.text),
          sent: true,
          createdAt: message?.createdAt?.toDate?.(),
          ...(message?.parentMessage && {
            parentMessage: {
              ...message?.parentMessage,
              text: deCryptMessage(message?.parentMessage?.text)
            }
          })
        };
      });

      const filteredMessages = docs?.filter(({ system }) => !system);

      onSnapshot(filteredMessages?.reverse());
    });

  return unlisten;
}

export function getUnreadChatCount(
  chatId: string,
  therapistId: string,
  onSnapshot: (count: number) => void
) {
  const unlisten = db
    .collection(`messages/${chatId}/conversation`)
    .where('received', '==', false)
    .where('senderId', '!=', therapistId)
    .onSnapshot((snapshot) => {
      const messages = snapshot.docs.map((doc) => doc.data());
      const filteredMessages = messages.filter(({ system }) => !system);
      return onSnapshot(filteredMessages.length);
    });

  return unlisten;
}

export function sendMessage(message: Message, chatId: string) {
  return db.collection(`messages/${chatId}/conversation`).doc().set(message);
}

export function updateMessageStatus(messages: any = [], chatId: string) {
  const batch = db.batch();
  messages.forEach((message: any) => {
    const docRef = db.collection(`messages/${chatId}/conversation`).doc(message.docId);
    batch.update(docRef, { received: true });
  });

  batch.commit();
}

export function setTyping(typing: boolean, chatId: string | undefined, userId: string | undefined) {
  if (chatId && userId) {
    db.collection('messages')
      .doc(chatId)
      .set({ typing: { [userId]: typing } }, { merge: true });
  }
}

export function getChatTyping(chatId: string, onSnapshot: (data: any) => void) {
  const unListen = db
    .collection('messages')
    .doc(chatId)
    .onSnapshot((snapshot) => {
      onSnapshot(snapshot.data());
    });
  return unListen;
}
