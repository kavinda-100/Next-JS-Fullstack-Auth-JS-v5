import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const conditionalError = (error: any) => {
    const DEV_MODE = process.env.DEV_MODE as string
    if (DEV_MODE === "development") {
        return {message: error.message ? error.message : "Something went wrong/devMode"}
    }
    else{
        return {message: "Something went wrong"}
    }
}
