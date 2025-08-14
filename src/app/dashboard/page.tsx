"use client";

import { useRouter } from "next/navigation";

import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
// import { DashboardSidebar } from "../components/dashboard-sidebar/dashboard-sidebar";
// import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Home,
  Menu,
  Presentation,
  Tally5,
  Target,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button, buttonVariants } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { UserMenu } from "../components/user-menu/user-menu";

export default function DashboardPage() {
  //   const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  //   const [scores, setScores] = useState<Score[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isScoringModalOpen, setIsScoringModalOpen] = useState(false);
  //   const [judgingSession, setJudgingSession] = useState(mockJudgingSession)
  const [activeTab, setActiveTab] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const currentUser = useQuery(api.user.currentUser);

  useEffect(() => {
    if (currentUser === null) {
      router.push(`/sign-in?redirectTo=${encodeURIComponent("/dashboard")}`);
    }

    if (currentUser && currentUser.role !== "mentor") {
      router.push("/unauthorized");
    }
  }, [currentUser, router]);

  if (currentUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (currentUser === null) {
    return null;
  }

  //   const handleScoreProject = (projectId: string) => {
  //     const project = mockProjects.find((p) => p.id === projectId)
  //     if (project) {
  //       setSelectedProject(project)
  //       setIsScoringModalOpen(true)
  //     }
  //   }

  //   const handleSubmitScore = (scoreData: Omit<Score, "id" | "submittedAt">) => {
  //     const newScore: Score = {
  //       ...scoreData,
  //       id: Math.random().toString(36).substr(2, 9),
  //       submittedAt: new Date(),
  //     }
  //     setScores((prev) => [...prev, newScore])
  //   }

  //   const handleStartJudging = () => {
  //     setJudgingSession((prev) => ({ ...prev, isActive: true }))
  //   }

  //   const handleStopJudging = () => {
  //     setJudgingSession((prev) => ({ ...prev, isActive: false, currentPresentation: undefined }))
  //   }

  //   const handleStartPresentation = (slotId: string) => {
  //     const slot = judgingSession.presentationSchedule.find((s) => s.id === slotId)
  //     if (!slot) return

  //     setJudgingSession((prev) => ({
  //       ...prev,
  //       currentPresentation: slotId,
  //       presentationSchedule: prev.presentationSchedule.map((s) =>
  //         s.id === slotId
  //           ? {
  //               ...s,
  //               status: "presenting" as const,
  //               timerState: {
  //                 remainingSeconds: s.duration * 60,
  //                 isPaused: false,
  //                 startedAt: new Date(),
  //               },
  //             }
  //           : s,
  //       ),
  //     }))
  //   }

  //   const handleCompletePresentation = (slotId: string) => {
  //     setJudgingSession((prev) => ({
  //       ...prev,
  //       currentPresentation: undefined,
  //       presentationSchedule: prev.presentationSchedule.map((slot) =>
  //         slot.id === slotId ? { ...slot, status: "completed" as const, timerState: undefined } : slot,
  //       ),
  //     }))
  //   }

  //   const handlePauseTimer = (slotId: string) => {
  //     setJudgingSession((prev) => ({
  //       ...prev,
  //       presentationSchedule: prev.presentationSchedule.map((slot) =>
  //         slot.id === slotId && slot.timerState ? { ...slot, timerState: { ...slot.timerState, isPaused: true } } : slot,
  //       ),
  //     }))
  //   }

  //   const handleResumeTimer = (slotId: string) => {
  //     setJudgingSession((prev) => ({
  //       ...prev,
  //       presentationSchedule: prev.presentationSchedule.map((slot) =>
  //         slot.id === slotId && slot.timerState ? { ...slot, timerState: { ...slot.timerState, isPaused: false } } : slot,
  //       ),
  //     }))
  //   }

  //   const handleUpdateTimer = (slotId: string, remainingSeconds: number) => {
  //     setJudgingSession((prev) => ({
  //       ...prev,
  //       presentationSchedule: prev.presentationSchedule.map((slot) =>
  //         slot.id === slotId && slot.timerState
  //           ? { ...slot, timerState: { ...slot.timerState, remainingSeconds } }
  //           : slot,
  //       ),
  //     }))
  //   }

  //   const assignedProjects = mockProjects

  // const getScoredProjectsCount = () => {
  //   const scoredProjectIds = new Set(scores.map((s) => s.projectId))
  //   return scoredProjectIds.size
  // }

  // const getCompletionRate = () => {
  //   const totalAssigned = userRole === "admin" ? projects.length : assignedProjects.length
  //   const scored = getScoredProjectsCount()
  //   return totalAssigned > 0 ? (scored / totalAssigned) * 100 : 0
  // }

  // const getActiveJudges = () => {
  //   return judges.filter((judge) => scores.some((score) => score.judgeId === judge.id)).length
  // }

  // const getPresentationProgress = () => {
  //   const completed = judgingSession.presentationSchedule.filter((slot: any) => slot.status === "completed").length
  //   const total = judgingSession.presentationSchedule.length
  //   return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 }
  // }

  // const presentationProgress = getPresentationProgress()

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "presentations", label: "Presentations", icon: Presentation },
    { id: "scores", label: "Scores", icon: Tally5 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="flex items-center pl-3.5 pr-4 sm:pr-6 py-4">
          <div className="flex items-center gap-4">
            {/* mobile menu toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            {/* desktop menu toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex h-8 w-8 p-0 cursor-pointer"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>

            <div className="ml-2">
              <h1 className="text-lg sm:text-xl font-semibold">
                {activeTab === "overview" && "Overview"}
                {activeTab === "presentations" && "Presentations"}
                {activeTab === "scores" && "Scores"}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                De Anza Hacks 4.0
              </p>
            </div>
          </div>

          <div className="ml-auto">
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {mobileOpen && (
          <div
            className="fixed inset-0 top-[75px] bg-black/80 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* desktop sidebar */}
        <div
          className={cn(
            "border-r flex-col z-50 bg-background hidden md:flex",
            collapsed ? "w-16 transition-none" : "w-64 transition-all",
            "md:relative"
          )}
        >
          <div className="p-4 border-b min-h-23 max-h-23 flex flex-col justify-center">
            <div className="md:hidden space-y-2">
              <Badge
                variant={
                  currentUser.judgingSession?.isActive ? "default" : "secondary"
                }
                className="w-full justify-center"
              >
                {currentUser.judgingSession?.isActive
                  ? "Judging active"
                  : "Judging inactive"}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "w-full justify-center",
                  currentUser.judgingSession?.currentPresentation
                    ? "text-blue-50 bg-blue-700"
                    : "bg-blue-50 text-blue-700"
                )}
              >
                {currentUser.judgingSession?.currentPresentation
                  ? "Presentation live"
                  : "No presentation live"}
              </Badge>
            </div>
            <div className="hidden md:block">
              {collapsed ? (
                <div className="flex flex-col items-center gap-4">
                  <span
                    className={cn(
                      "h-3 w-3 rounded-full",
                      currentUser.judgingSession?.isActive
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-muted"
                    )}
                  />
                  <span
                    className={cn(
                      "h-3 w-3 rounded-full",
                      currentUser.judgingSession?.currentPresentation
                        ? "bg-blue-500 animate-pulse"
                        : "bg-muted"
                    )}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Badge
                    variant={
                      currentUser.judgingSession?.isActive
                        ? "default"
                        : "secondary"
                    }
                    className={cn(
                      "w-full justify-center",
                      currentUser.judgingSession?.isActive
                        ? "text-blue-50"
                        : "bg-muted"
                    )}
                  >
                    {currentUser.judgingSession?.isActive
                      ? "Judging active"
                      : "Judging inactive"}
                  </Badge>

                  <Badge
                    variant="outline"
                    className={cn(
                      "w-full justify-center",
                      currentUser.judgingSession?.currentPresentation
                        ? "text-blue-50 bg-blue-700"
                        : "bg-blue-50 text-blue-700"
                    )}
                  >
                    {currentUser.judgingSession?.currentPresentation
                      ? "Presentation live"
                      : "No presentation live"}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 flex flex-col p-3.5">
            <ul className="space-y-2 flex-1">
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.id}>
                    <Tooltip delayDuration={400}>
                      <TooltipTrigger
                        className={buttonVariants({
                          className: cn(
                            "w-full justify-start cursor-pointer",
                            collapsed && "justify-center px-2"
                          ),
                          variant: activeTab === item.id ? "default" : "ghost",
                        })}
                        onClick={() => handleTabChange(item.id)}
                      >
                        <Icon className="h-5 w-5" />
                        {collapsed ? (
                          <TooltipContent side="right">
                            <p>{item.label}</p>
                          </TooltipContent>
                        ) : (
                          <span className="ml-2">{item.label}</span>
                        )}
                      </TooltipTrigger>
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* mobile sidebar */}
        <div
          className={cn(
            "border-r flex flex-col z-50 bg-background fixed inset-y-0 left-0 top-[77px] w-64 transform transition-transform duration-300 ease-in-out md:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="p-4 border-b min-h-23 max-h-23 flex flex-col justify-center">
            <div className="space-y-2">
              <Badge
                variant={
                  currentUser.judgingSession?.isActive ? "default" : "secondary"
                }
                className={cn(
                  "w-full justify-center",
                  currentUser.judgingSession?.isActive
                    ? "text-blue-50"
                    : "bg-muted"
                )}
              >
                {currentUser.judgingSession?.isActive
                  ? "Judging active"
                  : "Judging inactive"}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "w-full justify-center",
                  currentUser.judgingSession?.currentPresentation
                    ? "text-blue-50 bg-blue-700"
                    : "bg-blue-50 text-blue-700"
                )}
              >
                {currentUser.judgingSession?.currentPresentation
                  ? "Presentation live"
                  : "No presentation live"}
              </Badge>
            </div>
          </div>

          <nav className="flex-1 flex flex-col p-3.5">
            <ul className="space-y-2 flex-1">
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.id}>
                    <Button
                      variant={activeTab === item.id ? "default" : "ghost"}
                      className="w-full justify-start cursor-pointer"
                      onClick={() => handleTabChange(item.id)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="ml-2">{item.label}</span>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* main content */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="bg-sidebar rounded-lg p-6 text-sidebar-foreground">
                  <h1 className="text-2xl font-bold mb-2">
                    Welcome back, {currentUser.name}!
                  </h1>
                  <p className="text-sidebar-foreground/80">
                    You have {/* assignedProjects.length */}0 projects assigned
                    to your group
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-sm font-medium">
                        Total Projects
                      </CardTitle>
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {/* projects.length */}0
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {/* assignedProjects.length */}0 assigned to your group
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-sm font-medium">
                        Judging Progress
                      </CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      {/* <div className="text-2xl font-bold">{getScoredProjectsCount()}</div>
            <Progress value={getCompletionRate()} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{getCompletionRate().toFixed(0)}% complete</p> */}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-sm font-medium">
                        Presentations
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      {/* <div className="text-2xl font-bold">{presentationProgress.completed}</div>
            <p className="text-xs text-muted-foreground">of {presentationProgress.total} completed</p> */}
                    </CardContent>
                  </Card>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Current Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Current Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        {/* <span className="text-sm font-medium">Judging Session</span>
              <Badge variant={judgingSession.isActive ? "default" : "secondary"}>
                {judgingSession.isActive ? "Active" : "Inactive"}
              </Badge> */}
                      </div>

                      {/* {judgingSession.currentPresentation && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Presentation</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  In Progress
                </Badge>
              </div>
            )} */}

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Time Remaining
                        </span>
                        <span className="text-sm font-bold">2h 30m</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* 

        {activeTab === "presentations" && (
          <PresentationSchedule
            schedule={judgingSession.presentationSchedule}
            projects={mockProjects}
            judges={mockJudges}
            currentPresentation={judgingSession.currentPresentation}
            onStartPresentation={handleStartPresentation}
            onCompletePresentation={handleCompletePresentation}
            onPauseTimer={handlePauseTimer}
            onResumeTimer={handleResumeTimer}
            onUpdateTimer={handleUpdateTimer}
            isAdmin={user.title === "Admin"}
          />
        )} */}

            {activeTab === "scores" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Scores Entered
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {/* scores.length */}88
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {/* {assignedProjects.length * mockJudges.length - scores.length} remaining */}{" "}
                        99 remaining
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="sm:col-span-2 lg:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Time Remaining
                      </CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2h 30m</div>
                      <p className="text-xs text-muted-foreground">
                        Judging ends at 6:00 PM
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {/* user.title */}test - Score Entry
                    </Badge>
                    <span className="text-sm text-slate-600">
                      {currentUser.name}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Enter scores on behalf of judges after their presentations
                  </p>
                </div>
                {/* 
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {assignedProjects.map((project) => {
                const projectScores = scores.filter((s) => s.projectId === project.id)
                const judgeCount = mockJudges.length
                const scoredCount = projectScores.length

                return (
                  <div key={project.id} className="relative">
                    <Badge className="absolute top-2 right-2 z-10 bg-blue-500 text-xs">
                      {scoredCount}/{judgeCount} Judges
                    </Badge>
                    <ProjectCard project={project} onScore={handleScoreProject} />
                  </div>
                )
              })}
            </div> */}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Scoring Modal */}
      {/* <ScoringModal
        project={selectedProject}
        isOpen={isScoringModalOpen}
        onClose={() => setIsScoringModalOpen(false)}
        onSubmit={handleSubmitScore}
      /> */}
    </div>
  );
}
