import * as yup from 'yup';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import { Box, Card, FormHelperText, Grid, Stack, TextField, Typography } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
//
import { UploadAvatar } from '../../upload';
import {
  COVERAGE_TYPES,
  COVERAGE_TYPES_LIST,
  ONLINE_THERAPY,
  PROFILE_TYPES_LIST,
  TherapistProfileInputFields,
  THERAPY_TYPE,
  THERAPY_TYPES
} from '../../../@types/therapists';
import {
  createTherapistProfile,
  PROFILE_TYPES,
  saveChangesToTherapistProfile,
  uploadImage
} from '../../../utils/firebase/therapistUtils';
import { RadioButtonGroup } from './RadioButtonGroup';
import languages from '../../../data/languages.json';
import AutoCompleteInput from './AutoCompleteInput';
import { methods, patientTypes, situations, symptoms } from '../../../data/en.json';

// ----------------------------------------------------------------------

type UserNewFormProps = {
  isEdit: boolean;
  currentUser?: TherapistProfileInputFields;
  therapistId?: string;
};

export default function TherapistNewForm({ isEdit, currentUser, therapistId }: UserNewFormProps) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const LANGUAGE_OPTIONS = Object.entries(languages).map(([key, value]) => ({
    label: value,
    value: key
  }));

  const SYMPTOM_OPTIONS = Object.entries(symptoms).map(([numberedIndex, label]) => ({
    label,
    value: numberedIndex
  }));

  const SITUATION_OPTIONS = Object.entries(situations).map(([numberedIndex, label]) => ({
    label,
    value: numberedIndex
  }));

  const METHOD_OPTIONS = Object.entries(methods).map(([numberedIndex, label]) => ({
    label,
    value: numberedIndex
  }));

  const PATIENT_TYPES_OPTIONS = Object.entries(patientTypes).map(([numberedIndex, label]) => ({
    label,
    value: numberedIndex
  }));

  const NewUserSchema = yup.object().shape({
    profileType: yup
      .string()
      .oneOf([...PROFILE_TYPES])
      .required(),
    therapyType: yup
      .string()
      .oneOf([...THERAPY_TYPE])
      .required(),
    avatar: yup.string().required(),
    name: yup.string().required(),
    email: yup.string().email().required(),
    intro: yup.string().required(),
    description: yup.string().required(),
    website: yup.string().url(),
    phone: yup.string().required(),
    coverage: yup
      .string()
      .oneOf([...COVERAGE_TYPES])
      .required(),
    // memberFSP: yup.boolean().required(),
    languages: yup.array().of(yup.string()).required(),
    symptoms: yup.array().of(yup.string()),
    situations: yup.array().of(yup.string()),
    methods: yup.array().of(yup.string()),
    patientTypes: yup.array().of(yup.string()),
    experience: yup.number().required(),
    hourlyRate: yup.number().required(),
    age: yup.string().required(),
    country: yup.string().required(),
    streetAddress: yup.string().required(),
    city: yup.string().required(),
    province: yup.string().required(),
    postalCode: yup.string(),
    uid: yup.string()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      profileType: currentUser?.profileType || PROFILE_TYPES[0],
      therapyType: currentUser?.therapyType || THERAPY_TYPE[1],
      sex: currentUser?.sex || 'male',
      uid: currentUser?.uid || '',
      avatar: currentUser?.avatar,
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      intro: currentUser?.intro || '',
      description: currentUser?.description || '',
      website: currentUser?.website || '',
      phone: currentUser?.phone || '',
      coverage: currentUser?.coverage || COVERAGE_TYPES[0],
      memberFSP: currentUser?.memberFSP || false,
      languages: currentUser?.languages || [],
      symptoms: currentUser?.symptoms || [],
      situations: currentUser?.situations || [],
      methods: currentUser?.methods || [],
      patientTypes: currentUser?.patientTypes,
      country: currentUser?.country || '',
      hourlyRate: currentUser?.hourlyRate || 0,
      experience: currentUser?.experience || 0,
      age: currentUser?.age || new Date().toISOString().split('T')[0],
      onlineTherapy: currentUser?.onlineTherapy || false,
      streetAddress: currentUser?.streetAddress || '',
      city: currentUser?.city || '',
      province: currentUser?.province || '',
      postalCode: currentUser?.postalCode || '',
      online: currentUser?.online || false
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values: TherapistProfileInputFields) => {
      if (isEdit && therapistId) {
        const result = await saveChangesToTherapistProfile({
          id: therapistId,
          accountType: 'therapist',
          ...values
        });

        if (result === 'ok') {
          navigate(-1);
          enqueueSnackbar('Successfully saved changes', { variant: 'success' });
        } else {
          enqueueSnackbar('Failed to save changes', { variant: 'error' });
        }
        return;
      }

      const id = await createTherapistProfile(values);
      if (typeof id === 'string') {
        navigate(-1);
        enqueueSnackbar('Therapist Created Successfully', { variant: 'success' });
      } else {
        enqueueSnackbar('Failed to create therapist', { variant: 'error' });
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  const defaultLanguages = LANGUAGE_OPTIONS.filter((option) =>
    getFieldProps('languages')?.value?.includes(option.value)
  );

  const defaultSymptoms = SYMPTOM_OPTIONS.filter((option) =>
    getFieldProps('symptoms')?.value?.includes(option.value)
  );

  const defaultSituations = SYMPTOM_OPTIONS.filter((option) =>
    getFieldProps('situations')?.value?.includes(option.value)
  );

  const defaultMethods = SYMPTOM_OPTIONS.filter((option) =>
    getFieldProps('methods')?.value?.includes(option.value)
  );

  const defaultPatientTypes = SYMPTOM_OPTIONS.filter((option) =>
    getFieldProps('patientTypes')?.value?.includes(option.value)
  );

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const uploadResult = await uploadImage(file);
        const imgUrl: string = await uploadResult.ref.getDownloadURL();
        setFieldValue('avatar', imgUrl ? imgUrl : URL.createObjectURL(file));
      }
    },
    [setFieldValue]
  );

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3 }}>
              <Box sx={{ mb: 5 }}>
                <UploadAvatar
                  accept="image/*"
                  file={values.avatar}
                  maxSize={3145728}
                  onDrop={handleDrop}
                  error={Boolean(touched.avatar && errors.avatar)}
                  caption={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary'
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.avatar && errors.avatar}
                </FormHelperText>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 3, sm: 2 }}
                  sx={{ justifyContent: 'space-between' }}
                >
                  <RadioButtonGroup
                    title="Profile Type"
                    list={PROFILE_TYPES_LIST}
                    {...getFieldProps('profileType')}
                  />
                  <RadioButtonGroup
                    title={'Therapy Type'}
                    list={THERAPY_TYPES}
                    {...getFieldProps('therapyType')}
                  />
                  <RadioButtonGroup
                    title={'Online Therapy'}
                    list={ONLINE_THERAPY}
                    ischeckbox={true}
                    {...getFieldProps('onlineTherapy')}
                  />
                  <RadioButtonGroup
                    title={'Type of coverage'}
                    list={COVERAGE_TYPES_LIST}
                    {...getFieldProps('coverage')}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Intro"
                    multiline
                    {...getFieldProps('intro')}
                    error={Boolean(touched.intro && errors.intro)}
                    helperText={touched.intro && errors.intro}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    label="Description"
                    {...getFieldProps('description')}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    {...getFieldProps('phone')}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                  <TextField
                    fullWidth
                    label="Website"
                    {...getFieldProps('website')}
                    error={Boolean(touched.website && errors.website)}
                    helperText={touched.website && errors.website}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="Country"
                    placeholder="Country"
                    {...getFieldProps('country')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.country && errors.country)}
                    helperText={touched.country && errors.country}
                  >
                    <option value="" />
                    <option value="Germany">Germany</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Austria">Austria</option>
                    <option value="France">France</option>
                    <option value="Italy">Italy</option>
                  </TextField>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    {...getFieldProps('postalCode')}
                    error={Boolean(touched.postalCode && errors.postalCode)}
                    helperText={touched.postalCode && errors.postalCode}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    {...getFieldProps('streetAddress')}
                    error={Boolean(touched.streetAddress && errors.streetAddress)}
                    helperText={touched.streetAddress && errors.streetAddress}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="City"
                    {...getFieldProps('city')}
                    error={Boolean(touched.city && errors.city)}
                    helperText={touched.city && errors.city}
                  />
                  <TextField
                    fullWidth
                    label="State / Province"
                    {...getFieldProps('province')}
                    error={Boolean(touched.province && errors.province)}
                    helperText={touched.province && errors.province}
                  />
                  <TextField
                    fullWidth
                    label="Experience"
                    {...getFieldProps('experience')}
                    error={Boolean(touched.experience && errors.experience)}
                    helperText={touched.experience && errors.experience}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Hourly Rate"
                    type="number"
                    {...getFieldProps('hourlyRate')}
                    error={Boolean(touched.hourlyRate && errors.hourlyRate)}
                    helperText={touched.hourlyRate && errors.hourlyRate}
                  />
                  <TextField
                    fullWidth
                    label="Date of birth"
                    {...getFieldProps('age')}
                    type="date"
                    error={Boolean(touched.age && errors.age)}
                    helperText={touched.age && errors.age}
                  />
                  <TextField
                    fullWidth
                    label="Auth Id"
                    {...getFieldProps('uid')}
                    error={Boolean(touched.uid && errors.uid)}
                    helperText={touched.uid && errors.uid}
                  />
                </Stack>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 3, sm: 2 }}
                  sx={{ justifyContent: 'space-between' }}
                >
                  <AutoCompleteInput
                    data={LANGUAGE_OPTIONS}
                    title={'Languages'}
                    subTitle="Languages the therapist feels comfortable with"
                    defaultData={defaultLanguages}
                    onChange={(data) => setFieldValue('languages', data)}
                  />
                  <AutoCompleteInput
                    data={PATIENT_TYPES_OPTIONS}
                    title={'Patient Types'}
                    subTitle="Patient types used by this therapist"
                    defaultData={defaultPatientTypes}
                    onChange={(data) => setFieldValue('patientTypes', data)}
                  />
                </Stack>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 3, sm: 2 }}
                  sx={{ justifyContent: 'space-between' }}
                >
                  <AutoCompleteInput
                    data={SITUATION_OPTIONS}
                    title={'Situations'}
                    subTitle="The types of situations the therapist can help with"
                    defaultData={defaultSituations}
                    onChange={(data) => setFieldValue('situations', data)}
                  />

                  <AutoCompleteInput
                    data={METHOD_OPTIONS}
                    title={'Methods'}
                    subTitle="Methods used by this therapist"
                    defaultData={defaultMethods}
                    onChange={(data) => setFieldValue('methods', data)}
                  />
                </Stack>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 3, sm: 2 }}
                  sx={{ justifyContent: 'space-between' }}
                >
                  <AutoCompleteInput
                    data={SYMPTOM_OPTIONS}
                    title={'Symptoms'}
                    subTitle="The types of symptoms the therapist can help with/treat"
                    defaultData={defaultSymptoms}
                    onChange={(data) => setFieldValue('symptoms', data)}
                  />
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Therapist' : 'Save Changes'}
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
