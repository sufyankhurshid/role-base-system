import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import TherapistNewForm from '../../components/_dashboard/user/TherapistNewForm';
import { Therapist } from '../../@types/therapists';
import { getTherapistById } from '../../utils/firebase/therapistUtils';

// ----------------------------------------------------------------------

export default function CreateTherapist() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { state } = useLocation();
  const { id: therapistId } = useParams();
  const [therapist, setTherapist] = useState<Therapist>(state as Therapist);

  useEffect(() => {
    if (!therapist && therapistId) {
      getTherapistById(therapistId)
        .then((t) => {
          setTherapist(t);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [therapist, therapistId]);

  const isEdit = pathname.includes('edit');

  return (
    <Page title="Create Therapists">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new therapist' : 'Edit therapist'}
          links={[]}
        />
        <TherapistNewForm isEdit={isEdit} therapistId={therapistId} currentUser={therapist} />
      </Container>
    </Page>
  );
}
