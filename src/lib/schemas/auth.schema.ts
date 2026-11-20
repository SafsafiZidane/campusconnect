import { z } from "zod";

export const RegisterStudentSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères."),
  email: z.string().email("Veuillez saisir une adresse email valide."),
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères."),
  speciality: z.string().min(2, "Veuillez indiquer votre filière ou spécialité."),
  level: z.string().min(1, "Veuillez sélectionner votre niveau d'études."),
  skills: z.string().min(2, "Veuillez renseigner au moins une compétence (ex: Python, Mathématiques)."),
  bio: z.string().optional(),
});

export const LoginUserSchema = z.object({
  email: z.string().email("Adresse email invalide."),
  password: z.string().min(1, "Le mot de passe est obligatoire."),
});

export type RegisterStudentFormData = z.infer<typeof RegisterStudentSchema>;
export type LoginUserFormData = z.infer<typeof LoginUserSchema>;
