import { createContext, ReactNode, useEffect, useReducer, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';

// @types
import {
  ActionMap,
  AuthState,
  AuthUser,
  FirebaseContextType,
  Roles
} from '../@types/authentication';
//
import { firebaseConfig } from '../config';
import { getGetTherapist, validateAdmin } from '../utils/firebase';

// ----------------------------------------------------------------------

// const ADMIN_EMAILS = ['admin@kyanhealth.com'];

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore();
}

export const db = firebase.firestore();
export const storage = firebase.storage();

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  roles: {}
};

enum Types {
  Initial = 'INITIALISE'
}

type FirebaseAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
    roles?: Roles;
    therapistId?: string;
  };
};

type FirebaseActions = ActionMap<FirebaseAuthPayload>[keyof ActionMap<FirebaseAuthPayload>];

const reducer = (state: AuthState, action: FirebaseActions) => {
  if (action.type === 'INITIALISE') {
    const { roles, therapistId, isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      roles,
      therapistId
    };
  }

  return state;
};

const AuthContext = createContext<FirebaseContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<firebase.firestore.DocumentData | undefined>();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(
    () =>
      firebase.auth().onAuthStateChanged(async (user) => {
        try {
          if (user?.uid) {
            const { data } = await validateAdmin(user?.uid);
            const therapist = await getGetTherapist(user.uid)
              .get()
              .then((snap) => snap?.docs?.[0]?.data());

            if (data?.admin || data?.chat) {
              setProfile(user);

              dispatch({
                type: Types.Initial,
                payload: { isAuthenticated: true, user, roles: data, therapistId: therapist?.id }
              });
            } else {
              throw Error('No access');
            }
          } else {
            throw Error('unable to authorize.');
          }
        } catch (e: any) {
          console.log(e);
          setProfile(undefined);
          dispatch({
            type: Types.Initial,
            payload: { isAuthenticated: false, user: null }
          });
        }
      }), // eslint-disable-next-line
    [dispatch]
  );

  const login = (email: string, password: string) =>
    firebase.auth().signInWithEmailAndPassword(email, password);

  const loginWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  };

  const loginWithFaceBook = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  };

  const loginWithTwitter = () => {
    const provider = new firebase.auth.TwitterAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  };

  const register = (email: string, password: string, firstName: string, lastName: string) =>
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        firebase
          .firestore()
          .collection('users')
          .doc(res.user?.uid)
          .set({
            uid: res.user?.uid,
            email,
            displayName: `${firstName} ${lastName}`
          });
      });

  const logout = async () => {
    await firebase.auth().signOut();
  };

  const resetPassword = async (email: string) => {
    await firebase.auth().sendPasswordResetEmail(email);
  };

  const updateProfile = async (user: AuthUser) => {
    // await firebase.auth().updateCurrentUser(user);
    // return true;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'firebase',
        user: { ...(profile || {}) },
        // @ts-ignore
        roles: state?.roles,
        login,
        register,
        loginWithGoogle,
        loginWithFaceBook,
        loginWithTwitter,
        logout,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
