import { unauthMsg } from "@/lib/constants/errorMessages";

function NotFound() {
  return (
    <main className="centered-main">
      <h2 className="mb-5 text-3xl font-bold">Unauthorized</h2>
      <p className="text-xl max-w-100 text-center">{unauthMsg}</p>
    </main>
  );
}

export default NotFound;
