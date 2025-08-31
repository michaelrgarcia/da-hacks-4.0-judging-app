import { api } from "@/lib/convex/_generated/api";
import type { Role } from "@/lib/types/user";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

type RoleGuardProps = {
  role: Role;
  children: ReactNode;
};

function RoleGuard({ role, children }: RoleGuardProps) {
  const currentUser = useQuery(api.user.currentUser);

  const router = useRouter();

  useEffect(() => {
    if (currentUser === null) {
      router.push("/sign-in");
    }

    if (currentUser && currentUser.role !== role) {
      router.push("/unauthorized");
    }
  }, [currentUser, router, role]);

  if (currentUser === undefined) return null;
  if (currentUser === null) return null;
  if (currentUser.role !== role) return null;

  return children;
}

export default RoleGuard;
