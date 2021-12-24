import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, TextField } from '@mui/material';
// utils
//
import { SURVEY_TYPE } from '../../../@types/surveys';

// ----------------------------------------------------------------------

type UserNewFormProps = {
  isEdit: boolean;
  survey?: SURVEY_TYPE;
  surveyId?: string;
};

export default function TherapistNewForm({ isEdit, survey, surveyId }: UserNewFormProps) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const NewSchema = yup.object().shape({
    name: yup.string().required(),
    questions: yup.array(
      yup.object().shape({
        id: yup.string(),
        question: yup.string().required(),
        answers: yup.array(
          yup.object().shape({
            id: yup.string(),
            answer: yup.string().required('Answer is required.')
          })
        )
      })
    )
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: survey?.name || '',
      questions: survey?.questions || []
    },
    validationSchema: NewSchema,
    onSubmit: async (values: SURVEY_TYPE) => {
      if (isEdit && surveyId) {
        const result = undefined;

        if (result === 'ok') {
          navigate(-1);
          enqueueSnackbar('Successfully saved changes', { variant: 'success' });
        } else {
          enqueueSnackbar('Failed to save changes', { variant: 'error' });
        }
        return;
      }

      const id = {};
      if (typeof id === 'string') {
        navigate(-1);
        enqueueSnackbar('Survey Created Successfully', { variant: 'success' });
      } else {
        enqueueSnackbar('Failed to create survey', { variant: 'error' });
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Survey Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Survey' : 'Save Changes'}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
