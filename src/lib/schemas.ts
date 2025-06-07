import { z } from 'zod';

export const patientFormSchema = z.object({
  id: z.number().optional(),
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  age: z.coerce.number().int().min(0, { message: "Age must be a positive number." }).max(120),
  gender: z.enum(['male', 'female', 'other'], { required_error: "Gender is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Phone number seems too short." }),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Birth date must be YYYY-MM-DD." }),
  bloodGroup: z.string().min(1, { message: "Blood group is required." }),
  height: z.coerce.number().min(1, { message: "Height must be positive." }),
  weight: z.coerce.number().min(1, { message: "Weight must be positive." }),
  addressCity: z.string().min(2, { message: "City is required." }),
  admissionDepartment: z.string().min(2, { message: "Admission department is required." }),
  image: z.string().url({ message: "Image URL must be valid." }).optional().or(z.literal('')),
});
