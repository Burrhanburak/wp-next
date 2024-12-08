import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});



export const RegisterSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});


export const ResetSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

export const VerifySchema = z.object({
  code: z.string().min(6, "Verification code must be 6 digits"),
});








// const RegisterSchema = z.object({
//   name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
//   email: z.string().email({ message: "Invalid email address" }),
//   password: z.string()
//     .min(8, { message: "Password must be at least 8 characters long" })
//     .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
//     .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
//     .regex(/[0-9]/, { message: "Password must contain a number" })
//     .regex(/[@$!%*?&#]/, { message: "Password must contain a special character" }),
// });