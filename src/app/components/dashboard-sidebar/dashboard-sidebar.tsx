"use client";

import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Home,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

type DashboardSidebarProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: string;
  judgingSession: unknown;
  onStartJudging: () => void;
  onStopJudging: () => void;
};

export function DashboardSidebar({
  activeTab,
  onTabChange,
  userRole,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  judgingSession,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStartJudging,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStopJudging,
}: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "judging", label: "Judging Panel", icon: Users },
    { id: "leaderboard", label: "Leaderboard", icon: BarChart3 },
    ...(userRole === "admin"
      ? [{ id: "settings", label: "Settings", icon: Settings }]
      : []),
  ];

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setMobileOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={cn(
          "border-r  flex flex-col transition-all duration-300 z-50",
          // Desktop styles
          "hidden md:flex",
          collapsed ? "w-16" : "w-64",
          // Mobile styles
          "md:relative fixed inset-y-0 left-0",
          mobileOpen ? "flex w-64" : "hidden md:flex"
        )}
      >
        <div className="p-4 border-b ">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div>
                <h2 className="font-semibold">Dashboard</h2>
                <p className="text-sm text-muted-foreground">
                  De Anza Hacks 4.0
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className={cn("h-8 w-8 p-0", "hidden md:flex")}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {!collapsed && (
          <div className="p-4 border-b ">
            <div className="space-y-2">
              {/* <Badge
                variant={judgingSession.isActive ? "default" : "secondary"}
                className="w-full justify-center"
              >
                {judgingSession.isActive
                  ? "Judging Active"
                  : "Judging Inactive"}
              </Badge>
              {judgingSession.currentPresentation && (
                <Badge
                  variant="outline"
                  className="w-full justify-center bg-blue-50 text-blue-700"
                >
                  Presentation Live
                </Badge>
              )} */}
            </div>
          </div>
        )}

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.id}>
                  <Button
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      collapsed && "justify-center px-2"
                    )}
                    onClick={() => handleTabChange(item.id)}
                  >
                    <Icon className="h-4 w-4" />
                    {!collapsed && <span className="ml-2">{item.label}</span>}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>

        {userRole === "admin" && !collapsed && (
          <div className="p-4 border-t ">
            <div className="space-y-2">
              {/* {!judgingSession.isActive ? (
                <Button
                  onClick={onStartJudging}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Judging
                </Button>
              ) : (
                <Button
                  onClick={onStopJudging}
                  variant="destructive"
                  className="w-full"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop Judging
                </Button>
              )} */}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
