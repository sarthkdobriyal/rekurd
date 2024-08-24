import { Phone } from "lucide-react";
import { title } from "process";
import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ allowed",
  ),
  password: requiredString.min(8, "Must be at least 8 characters"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
  content: requiredString,
  mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
});

export const userContactSchema = z.object({
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  // socialLinks: z.array(z.string()).optional(),
});

export type UserContactValues = z.infer<typeof userContactSchema>;

export const musicalInfoSchema = z.object({
  yearsOfExperience: z.string().optional(),
  title: z.string().optional(),
  genres: z.array(z.string()).optional(),
  primaryInstrument: z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
  }).optional(),
  instruments: z.array(z.string()).optional(),
  bio: z.string().max(10000, "Must be at most 10000 characters").optional(),
  interestedInTutoring: z.boolean().optional(),
  interestedInLearning: z.boolean().optional(),
});




export type MusicalInfoValues = z.infer<typeof musicalInfoSchema>;

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, "Must be at most 1000 characters"),
  email: z.string().email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ allowed",
  ),
  musicalInfo: musicalInfoSchema || null,
  userContact: userContactSchema || null,
});



export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;



export const createCommentSchema = z.object({
  content: requiredString,
});
