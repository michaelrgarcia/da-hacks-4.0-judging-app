import { api } from "@/lib/convex/_generated/api";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

async function Home() {
  const token = await convexAuthNextjsToken();
  const user = await fetchQuery(api.user.currentUser, {}, { token });

  if (!user) return redirect("/sign-in");

  switch (user.role) {
    case "judge":
      return redirect("/scoring");

    case "director":
      return redirect("/admin");
  }
}

export default Home;
