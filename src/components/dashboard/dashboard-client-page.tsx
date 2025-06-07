"use client";

import React, { useState, useEffect } from 'react';
import type { Patient, PatientFormData, RawUser, InitialPatientData } from '@/lib/types';
import PatientTable from './patient-table';
import PatientForm from './patient-form';
import PageHeader from './page-header';
import GenderDistributionChart from './gender-distribution-chart';
import AgeGroupChart from './age-group-chart';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardClientPageProps {
  initialData: InitialPatientData;
}

// Helper to transform Patient to PatientFormData for the form
const transformPatientToFormData = (patient: Patient): PatientFormData => {
  return {
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName,
    age: patient.age,
    gender: patient.gender,
    email: patient.email,
    phone: patient.phone,
    birthDate: patient.birthDate,
    bloodGroup: patient.bloodGroup,
    height: patient.height,
    weight: patient.weight,
    addressCity: patient.address.city,
    admissionDepartment: patient.admissionDepartment,
    image: patient.image,
  };
};


const DashboardClientPage: React.FC<DashboardClientPageProps> = ({ initialData }) => {
  const [patients, setPatients] = useState<Patient[]>(initialData.patients);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientFormData | null>(null);
  const [patientToDeleteId, setPatientToDeleteId] = useState<number | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    if (initialData.error) {
      toast({
        title: "Error Loading Patient Data",
        description: initialData.error,
        variant: "destructive",
        duration: 10000, // Keep error toast longer
      });
    }
    // Set patients from initialData, which could be empty if there was an error
    setPatients(initialData.patients);

    // Simulate a minimum loading time or stop loading if data/error is definite
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Keep a small delay for perceived performance

    return () => clearTimeout(timer);
  }, [initialData, toast]);


  const handleAddPatient = () => {
    setEditingPatient(null);
    setIsFormOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(transformPatientToFormData(patient));
    setIsFormOpen(true);
  };

  const handleDeletePatient = (patientId: number) => {
    setPatientToDeleteId(patientId);
  };

  const confirmDeletePatient = () => {
    if (patientToDeleteId !== null) {
      setPatients((prevPatients) => prevPatients.filter((p) => p.id !== patientToDeleteId));
      toast({
        title: "Patient Deleted",
        description: `Patient record has been successfully removed.`,
        variant: "destructive",
      });
      setPatientToDeleteId(null);
    }
  };

  const handleFormSubmit = (data: PatientFormData) => {
    const newPatientData: Patient = {
      id: data.id || Date.now(), // Use existing ID or generate new one for adds
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age,
      gender: data.gender,
      email: data.email,
      phone: data.phone,
      birthDate: data.birthDate,
      bloodGroup: data.bloodGroup,
      height: data.height,
      weight: data.weight,
      address: { city: data.addressCity },
      admissionDepartment: data.admissionDepartment,
      image: data.image || 'https://placehold.co/100x100.png',
    };

    if (editingPatient && editingPatient.id) { // Editing existing patient
      setPatients((prevPatients) =>
        prevPatients.map((p) => (p.id === editingPatient.id ? { ...p, ...newPatientData, id: editingPatient.id } : p))
      );
      toast({ title: "Patient Updated", description: `${data.firstName} ${data.lastName}'s record updated.` });
    } else { // Adding new patient
      const newId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
      setPatients((prevPatients) => [{ ...newPatientData, id: newId }, ...prevPatients]);
      toast({ title: "Patient Added", description: `${data.firstName} ${data.lastName} added to records.` });
    }
    setIsFormOpen(false);
    setEditingPatient(null);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-6 p-4 bg-card shadow-sm rounded-lg">
            <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-40" />
            </div>
            <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Skeleton className="h-[380px] rounded-lg" />
            <Skeleton className="h-[380px] rounded-lg" />
        </div>
        <Skeleton className="h-[400px] rounded-lg" />
      </div>
    );
  }


  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader onAddPatient={handleAddPatient} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GenderDistributionChart patients={patients} />
        <AgeGroupChart patients={patients} />
      </div>

      <PatientTable
        patients={patients}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
      />

      <Dialog open={isFormOpen} onOpenChange={(open) => {
        setIsFormOpen(open);
        if (!open) setEditingPatient(null);
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPatient ? 'Edit Patient Record' : 'Add New Patient'}</DialogTitle>
            <DialogDescription>
              {editingPatient ? 'Update the patient details below.' : 'Fill in the details to add a new patient.'}
            </DialogDescription>
          </DialogHeader>
          <PatientForm
            onSubmit={handleFormSubmit}
            initialData={editingPatient}
            onCancel={() => {
                setIsFormOpen(false);
                setEditingPatient(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={patientToDeleteId !== null} onOpenChange={() => setPatientToDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this patient record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPatientToDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePatient} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardClientPage;
