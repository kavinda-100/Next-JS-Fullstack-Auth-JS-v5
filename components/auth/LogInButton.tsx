"use client";
import { useRouter } from "next/navigation";
/**
 * @module components/auth/LogInButton
 * @description button that handles the login process in the client side because home page is a severeSide rendered page
 */

type LogInButtonProps = {
  children: React.ReactNode;
  mode?: "model" | "redirect";
  asChild?: boolean;
};

const LogInButton = ({
  children,
  mode = "redirect",
  asChild,
}: LogInButtonProps) => {
  const router = useRouter();

  //if it is model
  if (mode === "model") {
    return <span>TODO: implement the model(dialog)</span>;
  }

  // if it is a redirect
  const onClick = () => {
    router.push("/auth/login");
  };

  return <span onClick={onClick}>{children}</span>;
};

export default LogInButton;
