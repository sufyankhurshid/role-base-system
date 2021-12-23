import { db, storage } from 'contexts/FirebaseContext';
import firebase from 'firebase/app';
import {
  Therapist,
  TherapistProfileEditInputFields,
  TherapistProfileInputFields
} from '../../@types/therapists';
export const PROFILE_TYPES = ['test', 'production'] as const;
export type ProfileType = typeof PROFILE_TYPES[number];

export function getListTherapists(onSnapshot: (therapists: Therapist[]) => void) {
  const unListen: any = db.collection('therapists').onSnapshot((snapshot) => {
    const therapists: Therapist[] = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id } as Therapist;
    });
    const filteredTherapists: Therapist[] = therapists?.filter((t) => t.profileType !== undefined);
    return onSnapshot(filteredTherapists);
  });
  return unListen;
}

export function uploadImage(file: File): Promise<firebase.storage.UploadTaskSnapshot> {
  return storage
    .ref()
    .child(file.name)
    .put(file)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error(error);
      alert('Image upload failed');
    });
}

export async function createTherapistProfile(
  profileFields: TherapistProfileInputFields
): Promise<Error | string> {
  try {
    const therapistsRef = firebase.firestore().collection('therapists');
    const docRef = await therapistsRef.add({
      ...profileFields,
      accountType: 'therapist'
    });
    return docRef.id;
  } catch (error) {
    console.error(error);
    return error as Error;
  }
}

export async function saveChangesToTherapistProfile(
  profileFields: TherapistProfileEditInputFields
): Promise<Error | 'ok'> {
  try {
    await firebase
      .firestore()
      .collection('therapists')
      .doc(profileFields.id)
      .set({ ...profileFields }, { merge: true });
    return 'ok';
  } catch (error) {
    console.error(error);
    return error as Error;
  }
}

export async function getTherapistById(id: string): Promise<Therapist> {
  const doc = await firebase.firestore().collection('therapists').doc(id).get();
  if (!doc.exists) throw new Error('No therapist with this id exists');
  return { id: doc.id, ...doc.data() } as Therapist;
}

export async function deleteTherapistProfile(id: string): Promise<Error | 'deleted'> {
  try {
    await firebase.firestore().collection('therapists').doc(id).delete();
    return 'deleted';
  } catch (error) {
    console.error(error);
    return error as Error;
  }
}
