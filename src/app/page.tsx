import { api } from "@/lib/convex/_generated/api";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

async function Home() {
  const token = await convexAuthNextjsToken();
  const user = await fetchQuery(api.user.currentUser, {}, { token });

  // CHECK ROLES
  if (user) {
    return redirect("/dashboard");
  } else {
    return redirect("/sign-in");
  }
}

export default Home;
