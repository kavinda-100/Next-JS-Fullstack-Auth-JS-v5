import { useSession} from "next-auth/react";

export default function useCurrentRole() {
  const session = useSession();
  return session?.data?.user.role;
}
