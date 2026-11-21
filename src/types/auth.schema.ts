import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Format email tidak valid")
    .default("developertester1@gmail.com"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .default("123123123"),
});
export type LoginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  username: z.string().min(6, "Username minimal 6 karakter"),
  phoneNumber: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(20, "Nomor telepon maksimal 20 digit"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  displayName: z
    .string()
    .min(3, "Nama tampilan minimal 3 karakter")
    .max(100, "Nama tampilan maksimal 100 karakter"),
  dateOfBirth: z
    .string()
    .refine((date) => {
      const parsedDate = Date.parse(date);
      return !isNaN(parsedDate);
    }, "Format tanggal tidak valid")
    .optional(),
  userRole: z
    .enum(["user", "travel_agent_manager", "travel_agent_member", "admin"])
    .optional()
    .default("user"),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
});
export type RegisterSchemaType = z.infer<typeof registerSchema>;
