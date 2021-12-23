import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import SurveyNewForm from '../../components/_dashboard/survey/SurveyNewForm';
// utils
import { SURVEY_TYPE } from '../../@types/surveys';

// ----------------------------------------------------------------------

export default function CreateTherapist() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { state } = useLocation();
  const { id: surveyId } = useParams();
  const [survey, setSurvey] = useState<SURVEY_TYPE>(state as SURVEY_TYPE);

  useEffect(() => {
    if (!survey && surveyId) {
      /* getTherapistById(therapistId)
        .then((s) => {
          setSurvey(s);
        })
        .catch((error) => {
          console.log(error);
        });*/
    }
  }, [survey, surveyId]);

  const isEdit = pathname.includes('edit');

  return (
    <Page title="Create Therapists">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs heading={!isEdit ? 'Create a new survey' : 'Edit Survey'} links={[]} />
        <SurveyNewForm isEdit={isEdit} surveyId={surveyId} survey={survey} />
      </Container>
    </Page>
  );
}
