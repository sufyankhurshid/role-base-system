import firebase from 'firebase';
import { ProfileType } from '../utils/firebase/therapistUtils';

export type Appointment = {
  date: firebase.firestore.Timestamp;
  available: boolean;
};

export type Therapist = TherapistProfileInputFields & {
  accountType: 'therapist';
  id: string;
  appointments?: { [key: string]: Appointment };
};

export const COVERAGE_TYPES = ['basic', 'complementary', 'no-insurance'] as const;
export type CoverageType = typeof COVERAGE_TYPES[number];

export const THERAPY_TYPE = ['chat', 'regular'] as const;
export type TherapyType = typeof THERAPY_TYPE[number];

export const THERAPY_TYPES = [
  { value: THERAPY_TYPE[0], label: 'Chat' },
  { value: THERAPY_TYPE[1], label: 'Regular' }
];

export const COVERAGE_TYPES_LIST = [
  { value: COVERAGE_TYPES[0], label: 'Basic' },
  { value: COVERAGE_TYPES[1], label: 'Complementary' },
  { value: COVERAGE_TYPES[2], label: 'No insurance' }
];

export const PROFILE_TYPES_LIST = [
  { value: 'test', label: 'Test' },
  { value: 'production', label: 'Production' }
];

export const ONLINE_THERAPY = [{ value: false, label: 'Online Therapy' }];

export type TherapistProfileBaseInputFields = {
  profileType: ProfileType;
  therapyType: TherapyType;
  sex: 'male' | 'female' | 'other';
  birthdate?: Date;
  uid?: string;
  avatar?: string;
  name: string;
  email: string;
  intro: string;
  description?: string;
  website: string;
  phone: string;
  coverage: CoverageType;
  memberFSP: boolean;
  languages?: string[];
  symptoms?: string[];
  situations?: string[];
  methods?: string[];
  patientTypes?: string[];
  country: string;
  hourlyRate: number;
  experience: number;
  age: string;
  onlineTherapy: boolean;
  streetAddress: string;
  city: string;
  province: string;
  postalCode: string;
  online: boolean;
};

export type TherapistProfileInputFields = TherapistProfileBaseInputFields;

export type TherapistProfileEditInputFields = {
  id: string;
  accountType: 'therapist';
} & Partial<TherapistProfileBaseInputFields>;
