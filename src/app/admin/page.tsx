"use client";

import { Button } from "@/app/components/ui/button";
import { genericErrMsg } from "@/lib/constants/errorMessages";
import { api } from "@/lib/convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { Loader2, Play, Square } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Leaderboard from "../components/leaderboard/leaderboard";
import Presentations from "../components/presentations/presentations";
import RoleGuard from "../components/role-guard";
import Loading from "../components/ui/loading";

function AdminPage() {
  const [judgingStatusChanging, setJudgingStatusChanging] =
    useState<boolean>(false);

  const panel = useQuery(api.judging.getPanel);

  const beginJudging = useAction(api.judging.beginJudging);
  const endJudging = useMutation(api.judging.endJudging);

  const handleBeginJudging = async () => {
    setJudgingStatusChanging(true);

    try {
      const { success, message } = await beginJudging();

      if (!success) {
        const errorMsg = message;

        throw new Error(errorMsg);
      }
    } catch (err: unknown) {
      console.error("Error starting judging:", err);

      return toast(genericErrMsg);
    } finally {
      setJudgingStatusChanging(false);
    }
  };

  const handleEndJudging = async () => {
    setJudgingStatusChanging(true);

    try {
      const { success, message } = await endJudging();

      if (!success) {
        const errorMsg = message;

        return toast(errorMsg);
      }
    } catch (err: unknown) {
      console.error("Error ending judging:", err);

      return toast(genericErrMsg);
    } finally {
      setJudgingStatusChanging(false);
    }
  };

  if (panel === undefined) {
    return <Loading />;
  }

  const judgingActive = panel?.judgingActive ?? false;

  return (
    <RoleGuard role="director">
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-10 flex flex-col">
          {!judgingActive ? (
            <Button
              onClick={handleBeginJudging}
              size="sm"
              className="shadow-sm cursor-pointer self-center min-w-40"
              disabled={judgingStatusChanging}
            >
              {!judgingStatusChanging ? (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Begin Judging
                </>
              ) : (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </Button>
          ) : (
            <Button
              onClick={handleEndJudging}
              size="sm"
              variant="destructive"
              className="shadow-sm cursor-pointer self-center min-w-40"
            >
              {!judgingStatusChanging ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  End Judging
                </>
              ) : (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </Button>
          )}

          <div className="mb-4">
            <h2 className="text-2xl font-bold">Leaderboard</h2>
            <p className="text-muted-foreground">
              Live rankings based on judge scores
            </p>
          </div>
          <Leaderboard />

          <div className="mb-4">
            <h2 className="text-2xl font-bold ">Presentations</h2>
          </div>
          <Presentations />
        </div>
      </main>
    </RoleGuard>
  );
}

export default AdminPage;
