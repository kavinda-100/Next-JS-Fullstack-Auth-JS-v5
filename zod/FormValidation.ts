import z from "zod"

export const ZodLoginValidation = z.object({
  email: z.string({message : "email is required"}).email({ message: "Invalid email address" }),
  password: z.string({message : "password is required"}).min(4, {message: "password is required"}),
    OTPCode: z.string({message: "OTP is required"}).min(6, {message: "OTP code has 6 digits"}).optional(),
})

export const ZodSignUpValidation = z.object({
  name: z.string({message : "name is required"}).min(4, {message: "name is required"}),
  email: z.string({message : "email is required"}).email({ message: "Invalid email address" }),
  password: z.string({message : "password is required"}).min(6, {message: "minimum 6 characters required"}),
})

export const ZodResetResetPasswordSendEmail = z.object({
  email: z.string({message : "email is required"}).email({ message: "Invalid email address" }),
})

export const ZodResetPassword = z.object({
    password: z.string({ message: "password is required" }).min(6, { message: "minimum 6 characters required" }),
    confirmPassword: z.string({ message: "confirm password is required" }).min(6, { message: "minimum 6 characters required" }),
}).refine(data => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
});
