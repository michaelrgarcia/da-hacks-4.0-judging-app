import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";

function JudgingIndicator() {
  const currentUser = useQuery(api.user.currentUser);

  if (!currentUser) {
    return null;
  }

  const judgingActive = currentUser.judgingSession
    ? currentUser.judgingSession.isActive
    : false;

  return (
    <div
      className={`p-3 rounded-lg border-2 ${
        judgingActive
          ? "border-green-500 bg-green-500/15"
          : "border-red-500 bg-red-500/15"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-4 h-4 rounded-full ${
            judgingActive
              ? "bg-green-500 shadow-sm animate-pulse"
              : "bg-red-500"
          }`}
        ></div>
        <span
          className={`font-semibold text-lg ${
            judgingActive ? "text-green-500" : "text-red-500"
          }`}
        >
          {judgingActive ? "Judging has began" : "Judging has not began"}
        </span>
      </div>
    </div>
  );
}

export default JudgingIndicator;
