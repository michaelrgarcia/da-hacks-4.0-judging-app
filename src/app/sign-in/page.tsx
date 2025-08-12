import type { Metadata } from "next";

import { api } from "@/lib/convex/_generated/api";
import ProviderLogins from "../components/provider-logins/provider-logins";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Card } from "../components/ui/card";

export const metadata: Metadata = {
  title: `Sign In`,
  description: `Sign in to help the judges for De Anza Hacks 4.0!`,
};

async function SignIn() {
  const token = await convexAuthNextjsToken();
  const user = await fetchQuery(api.user.currentUser, {}, { token });

  if (user) return redirect("/dashboard");

  return (
    <main className="centered-main space-y-4">
      <Card className="p-6 items-center">
        <h2 className="text-xl font-bold">Sign In</h2>
        <ProviderLogins />
      </Card>
    </main>
  );
}

export default SignIn;
