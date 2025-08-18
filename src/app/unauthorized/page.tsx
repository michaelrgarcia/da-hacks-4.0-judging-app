import { buttonVariants } from "@/app/components/ui/button";
import { unauthMsg } from "@/lib/constants/errorMessages";
import { Home } from "lucide-react";
import Link from "next/link";

function NotFound() {
  return (
    <main className="centered-main">
      <h2 className="mb-5 text-3xl font-bold">Unauthorized</h2>
      <p className="text-xl max-w-100 text-center mb-8">{unauthMsg}</p>
      <Link href="/" className={buttonVariants({ variant: "outline" })}>
        <Home className="h-4 w-4 mr-2" />
        Home
      </Link>
    </main>
  );
}

export default NotFound;
