"use client";

import { useRouter } from "next/navigation";

import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
// import { DashboardSidebar } from "../components/dashboard-sidebar/dashboard-sidebar";
// import Link from "next/link";
import { Clock, Trophy, Users } from "lucide-react";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { UserMenu } from "../components/user-menu/user-menu";

export default function DashboardPage() {
  //   const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  //   const [scores, setScores] = useState<Score[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isScoringModalOpen, setIsScoringModalOpen] = useState(false);
  //   const [judgingSession, setJudgingSession] = useState(mockJudgingSession)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState("overview");

  const router = useRouter();

  const currentUser = useQuery(api.user.currentUser);

  useEffect(() => {
    if (currentUser === null) {
      router.push(`/sign-in?redirectTo=${encodeURIComponent("/dashboard")}`);
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

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      {/* <DashboardSidebar
      activeTab={activeTab}
      onTabChange={setActiveTab}
      userRole={currentUser.role}
      judgingSession={judgingSession}
      onStartJudging={handleStartJudging}
      onStopJudging={handleStopJudging}
    /> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className=" border-b  px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="pl-0 md:pl-12 ">
              <h1 className="text-lg sm:text-xl font-semibold ">
                {activeTab === "overview" && "Overview"}
                {activeTab === "schedule" && "Presentation Schedule"}
                {activeTab === "judging" && "Score Entry Panel"}
                {activeTab === "leaderboard" && "Leaderboard"}
                {activeTab === "settings" && "Settings"}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                De Anza Hacks 4.0
              </p>
            </div>

            <UserMenu />
            {/* <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              
              move to a separate tab
              {user.title === "Admin" && (
              <Link href="/admin" className="w-full sm:w-auto">
                <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              </Link>
            )}
             
            </div> */}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {/* {activeTab === "overview" && (
          <DashboardOverview
            projects={mockProjects}
            scores={scores}
            judges={mockJudges}
            userRole={user.role}
            assignedProjects={assignedProjects}
            judgingSession={judgingSession}
          />
        )}

        {activeTab === "schedule" && (
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

          {activeTab === "judging" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Projects
                    </CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {/* assignedProjects.length */}99
                    </div>
                  </CardContent>
                </Card>

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

          {/* {activeTab === "leaderboard" && <Leaderboard projects={mockProjects} scores={scores} />} */}
        </main>
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
