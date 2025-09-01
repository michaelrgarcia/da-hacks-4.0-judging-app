"use client";

import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

function JudgingStatusAnnouncer() {
  const judgingActive = useQuery(api.judging.getJudgingActive);

  const prevIsActiveRef = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    if (judgingActive === null) return;

    if (prevIsActiveRef.current === undefined) {
      prevIsActiveRef.current = judgingActive;

      return;
    }

    if (judgingActive !== prevIsActiveRef.current) {
      if (judgingActive === true) {
        toast("Judging has began.");
      } else if (judgingActive === false) {
        toast("Judging has ended.");
      }

      prevIsActiveRef.current = judgingActive;
    }
  }, [judgingActive]);

  return null;
}

export default JudgingStatusAnnouncer;
