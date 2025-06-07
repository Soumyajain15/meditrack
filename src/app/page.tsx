import type { Patient, RawUser } from '@/lib/types';
import DashboardClientPage from '@/components/dashboard/dashboard-client-page';

// Helper to transform raw user data to Patient data
const transformRawUserToPatient = (rawUser: RawUser): Patient => {
  return {
    id: rawUser.id,
    firstName: rawUser.firstName,
    lastName: rawUser.lastName,
    age: rawUser.age,
    gender: rawUser.gender as 'male' | 'female', // API guarantees male/female,
    email: rawUser.email,
    phone: rawUser.phone,
    birthDate: rawUser.birthDate, // Assuming API provides YYYY-MM-DD
    bloodGroup: rawUser.bloodGroup,
    height: rawUser.height,
    weight: rawUser.weight,
    address: {
      city: rawUser.address.city,
      street: rawUser.address.address,
    },
    admissionDepartment: rawUser.company?.department || 'N/A', // Handle cases where company or department might be missing
    image: rawUser.image || 'https://placehold.co/100x100.png',
  };
};


async function getInitialPatients(): Promise<Patient[]> {
  try {
    // Fetch a limited number of users for performance; dummyjson default is 30, max 100 per page
    // Use limit=0 to attempt to get all, or a specific limit e.g. 50
    const response = await fetch('https://dummyjson.com/users?limit=50&select=id,firstName,lastName,age,gender,email,phone,birthDate,image,bloodGroup,height,weight,address,company');
    if (!response.ok) {
      console.error("Failed to fetch patients:", response.statusText);
      return [];
    }
    const data = await response.json();
    if (Array.isArray(data.users)) {
       return data.users.map((user: RawUser) => transformRawUserToPatient(user));
    }
    return [];
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return [];
  }
}


export default async function Home() {
  const initialPatients = await getInitialPatients();

  return (
    <main className="flex-grow">
      <DashboardClientPage initialPatients={initialPatients} />
    </main>
  );
}
