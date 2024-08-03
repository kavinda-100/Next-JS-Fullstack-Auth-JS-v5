import z from "zod"

export const ZodLoginValidation = z.object({
  email: z.string({message : "email is required"}).email({ message: "Invalid email address" }),
  password: z.string({message : "password is required"}).min(4, {message: "password is required"}),
})

export const ZodSignUpValidation = z.object({
  name: z.string({message : "name is required"}).min(4, {message: "name is required"}),
  email: z.string({message : "email is required"}).email({ message: "Invalid email address" }),
  password: z.string({message : "password is required"}).min(6, {message: "minimum 6 characters required"}),
})