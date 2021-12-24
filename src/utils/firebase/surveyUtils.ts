import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { SURVEY_TYPE } from '../../@types/surveys';

export function useSurveysList() {
  const [surveys, loading, error] = useCollectionData<SURVEY_TYPE>(
    firebase.firestore().collection('surveys'),
    { idField: 'id' }
  );

  return { surveys, loading, error };
}
