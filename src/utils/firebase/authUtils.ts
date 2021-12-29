import firebase from 'firebase/app';
import { db } from 'contexts/FirebaseContext';

export function validateAdmin(uid: string) {
  const createCode = firebase.functions().httpsCallable('validateAdmin');
  return createCode({ uid });
}

export function getGetTherapist(userId: string) {
  return db.collection('therapists').where('uid', '==', userId);
}

const admin = require('firebase-admin');
const serviceAccount = require('../role-base-system-firebase-adminsdk-kvqdp-59653e7113.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = 'LVz2fW050WY7J9xdviQqBc7u9Qu1';
const roleBaseClaim = {
  therapist: true
};
admin
  .auth()
  .createCustomToken(uid, roleBaseClaim)
  .then((customToken: any) => {
    console.log(customToken);
  })
  .catch((error: any) => {
    console.log('Error creating custom token:', error);
  });
