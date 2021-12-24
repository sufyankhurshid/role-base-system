import firebase from 'firebase/app';
import { db } from 'contexts/FirebaseContext';

export function validateAdmin(uid: string) {
  const createCode = firebase.functions().httpsCallable('validateAdmin');
  return createCode({ uid });
}

export function getGetTherapist(userId: string) {
  return db.collection('therapists').where('uid', '==', userId);
}
