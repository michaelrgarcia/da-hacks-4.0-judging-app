"use client";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { api } from "@/lib/convex/_generated/api";
import { PresentationSlot } from "@/lib/types/presentations";
import { useMutation, useQuery } from "convex/react";
import { CheckCircle2, Info, Loader2, Play, Square, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import JudgingIndicator from "../components/judging-indicator/judging-indicator";
import RoleGuard from "../components/role-guard";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import Loading from "../components/ui/loading";

function PresentationsPage() {
  const [presentations, setPresentations] = useState<PresentationSlot[]>();
  const endedProjectsRef = useRef<Set<string>>(new Set());
  const [showNoProjectsDialog, setShowNoProjectsDialog] =
    useState<boolean>(false);

  const currentUser = useQuery(api.user.currentUser);

  const beginPresentation = useMutation(api.presentations.beginPresentation);
  const endPresentation = useMutation(api.presentations.endPresentation);

  useEffect(() => {
    if (currentUser && !currentUser.judgingSession) {
      setShowNoProjectsDialog(true);
    }
  }, [currentUser]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!currentUser?.judgingSession) return;

      const newPresentations: PresentationSlot[] =
        currentUser.judgingSession.presentations.map((slot) => {
          if (
            slot.status === "presenting" &&
            slot.timerState &&
            !slot.timerState.isPaused &&
            slot.timerState.startedAt
          ) {
            const elapsed = Math.floor(
              (Date.now() - slot.timerState.startedAt) / 1000
            );
            const remaining = Math.max(0, slot.duration * 60 - elapsed);

            return {
              ...slot,
              timerState: {
                ...slot.timerState,
                remainingSeconds: remaining,
              },
              status: remaining === 0 ? "completed" : slot.status,
            };
          }

          return slot;
        });

      setPresentations(newPresentations);

      const justFinished = newPresentations.find(
        (slot) =>
          slot.status === "completed" && slot.timerState?.remainingSeconds === 0
      );

      if (
        justFinished &&
        !endedProjectsRef.current.has(justFinished.projectDevpostId)
      ) {
        endedProjectsRef.current.add(justFinished.projectDevpostId);

        void endPresentation({
          newPresentations,
          projectName: justFinished.projectName,
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentUser, endPresentation]);

  const startPresentation = async (projectDevpostId: string) => {
    if (!currentUser?.judgingSession) return;

    const newPresentations: PresentationSlot[] =
      currentUser.judgingSession.presentations.map((slot) =>
        slot.projectDevpostId === projectDevpostId
          ? {
              ...slot,
              status: "presenting",
              timerState: {
                ...slot.timerState,
                startedAt: new Date().getTime(),
              },
            }
          : slot
      );

    setPresentations(newPresentations);

    const project = newPresentations.find(
      (p) => p.projectDevpostId === projectDevpostId
    );

    if (!project) return toast("Could not find corresponding project.");

    const projectName = project.projectName;

    const { success, message } = await beginPresentation({
      newPresentations,
      projectName,
    });

    if (!success) {
      const errorMsg = message;

      return toast(errorMsg);
    }

    return toast(message);
  };

  //   const pausePresentation = (slotId: string) => {
  //     setSchedule((prev) =>
  //       prev.map((slot) =>
  //         slot.id === slotId && slot.timerState
  //           ? {
  //               ...slot,
  //               timerState: {
  //                 ...slot.timerState,
  //                 isPaused: true,
  //               },
  //             }
  //           : slot
  //       )
  //     );
  //   };

  //   const resumePresentation = (slotId: string) => {
  //     setSchedule((prev) =>
  //       prev.map((slot) =>
  //         slot.id === slotId && slot.timerState
  //           ? {
  //               ...slot,
  //               timerState: {
  //                 ...slot.timerState,
  //                 isPaused: false,
  //                 startedAt: new Date(
  //                   Date.now() -
  //                     (slot.duration * 60 - slot.timerState.remainingSeconds) *
  //                       1000
  //                 ),
  //               },
  //             }
  //           : slot
  //       )
  //     );
  //   };

  const stopPresentation = async (projectDevpostId: string) => {
    if (!currentUser?.judgingSession) return;

    const newPresentations: PresentationSlot[] =
      currentUser.judgingSession.presentations.map((slot) =>
        slot.projectDevpostId === projectDevpostId
          ? {
              ...slot,
              status: "completed",
              timerState: {
                remainingSeconds: 0,
                isPaused: true,
                startedAt: undefined,
              },
            }
          : slot
      );

    setPresentations(newPresentations);

    const project = newPresentations.find(
      (p) => p.projectDevpostId === projectDevpostId
    );

    if (!project) throw new Error("Could not find corresponding project.");

    const projectName = project.projectName;

    const { success, message } = await endPresentation({
      newPresentations,
      projectName,
    });

    if (!success) {
      const errorMsg = message;

      return toast(errorMsg);
    }

    return toast(message);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-accent/20 text-accent border-accent";
      case "presenting":
        return "bg-primary text-primary-foreground border-primary";
      case "completed":
        return "bg-foreground/10 text-foreground/60 border-foreground/20";
      default:
        return "bg-muted text-muted-foreground border-transparent";
    }
  };

  if (currentUser === undefined) return <Loading />;

  return (
    <RoleGuard role="mentor">
      <div className="container mx-auto px-6 py-8">
        <Dialog
          open={showNoProjectsDialog}
          onOpenChange={(open) => {
            if (!open) setShowNoProjectsDialog(false);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 mb-2">
                <Info /> Notice
              </DialogTitle>
              <DialogDescription>
                You have not been assigned any judges. If this is a mistake,
                contact Michael from the Tech team.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">OK</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="px-2">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 -mt-3">
              <JudgingIndicator />
            </div>

            <div className="grid gap-6">
              {presentations === undefined && (
                <Loader2 className="animate-spin mx-auto" />
              )}

              {presentations && presentations.length === 0 ? (
                <Card className="py-16">
                  <CardContent className="px-0">
                    <div className="flex flex-col items-center justify-center gap-3 text-center">
                      <div className="rounded-full bg-accent/30 text-accent p-3">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <p className="text-muted-foreground max-w-md">
                        There are no presentations scheduled for you right now.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                presentations &&
                presentations.map((slot) => {
                  if (!currentUser?.judgingSession) return null;

                  const project = currentUser.judgingSession.projects.find(
                    (p) => p.devpostId === slot.projectDevpostId
                  );

                  if (!project) return null;

                  const isActive = slot.status === "presenting";
                  const isCompleted = slot.status === "completed";

                  return (
                    <Card
                      key={slot.projectDevpostId}
                      className={`${isActive ? "ring-2 ring-accent shadow-lg" : isCompleted ? "opacity-50" : ""}`}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="flex items-center justify-between gap-3">
                            <CardTitle className="text-lg font-semibold leading-relaxed truncate max-w-35 lg:max-w-none">
                              {project.name}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className={`${getStatusColor(slot.status)} w-fit`}
                            >
                              {slot.status.charAt(0).toUpperCase() +
                                slot.status.slice(1)}
                            </Badge>
                          </div>

                          {slot.timerState && (
                            <div className="text-center self-center md:text-right">
                              <div
                                className={`text-2xl md:text-3xl font-mono font-bold ${
                                  slot.timerState.remainingSeconds < 60
                                    ? "text-destructive"
                                    : "text-accent"
                                }`}
                              >
                                {formatTime(slot.timerState.remainingSeconds)}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground md:hidden">
                          <Users className="h-4 w-4 shrink-0" />
                          <span className="break-words">
                            {project.teamMembers.join(", ")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="hidden md:flex flex-row sm:hidden items-center gap-3 text-sm text-muted-foreground ">
                            <Users className="h-4 w-4 shrink-0" />
                            <span className="break-words max-w-100">
                              {project.teamMembers.join(", ")}
                            </span>
                          </div>
                          <div className="flex flex-col flex-1 sm:flex-row gap-3 sm:justify-end">
                            {slot.status === "upcoming" && (
                              <Button
                                onClick={() =>
                                  startPresentation(slot.projectDevpostId)
                                }
                                size="lg"
                                className="w-full sm:w-auto cursor-pointer select-none"
                                disabled={!currentUser.judgingSession.isActive}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Start
                              </Button>
                            )}

                            {slot.status === "presenting" &&
                              slot.timerState && (
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    stopPresentation(slot.projectDevpostId)
                                  }
                                  size="lg"
                                  className="w-full sm:w-auto cursor-pointer"
                                >
                                  <Square className="h-4 w-4 mr-2" />
                                  Complete
                                </Button>
                              )}

                            {slot.status === "completed" && (
                              <Badge
                                variant="secondary"
                                className="px-4 py-3 select-none w-full sm:w-auto text-center"
                              >
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

export default PresentationsPage;
