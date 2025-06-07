import type { z } from 'zod';
import type { patientFormSchema } from '@/lib/schemas';

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female' | 'other'; 
  email: string;
  phone: string;
  birthDate: string;
  bloodGroup: string;
  height: number;
  weight: number;
  address: {
    city: string;
    street?: string; 
  };
  admissionDepartment: string;
  image: string; 
}

// Raw user data from the API
export interface RawUser {
  id: number;
  firstName: string;
  lastName:string;
  age: number;
  gender: 'male' | 'female'; // API provides male/female
  email: string;
  phone: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  address: {
    address: string; // Street address
    city: string;
    // coordinates?: { lat: number; lng: number };
    // postalCode?: string;
    // state?: string;
  };
  company: {
    // address?: any;
    department: string;
    // name?: string;
    // title?: string;
  };
  // ... other fields from dummyjson we might not use directly
}

export type PatientFormData = z.infer<typeof patientFormSchema>;

export interface InitialPatientData {
  patients: Patient[];
  error?: string;
}
