import { v } from "convex/values";
import {
  noAuthMsg,
  notDirectorMsg,
  notJudgeMsg,
  waitUntilSubmitMsg,
} from "../constants/errorMessages";
import { defaultDurationMinutes } from "../constants/presentations";
import type { Score } from "../types/judging";
import { PresentationSlot } from "../types/presentations";
import { api, internal } from "./_generated/api";
import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { getCurrentUser } from "./user";
import { projectValidator } from "./validators";

export const listJudges = internalQuery({
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) return null;

    if (user.role !== "director") return null;

    return await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "judge"))
      .collect();
  },
});

export const getPanel = query({
  handler: async (ctx) => {
    return await ctx.db.query("panel").first();
  },
});

export const getJudgingActive = query({
  handler: async (ctx) => {
    const panel = await ctx.db.query("panel").first();

    if (!panel) return null;

    return panel.judgingActive;
  },
});

export const panelSetJudgingActive = internalMutation({
  args: { active: v.boolean() },
  handler: async (ctx, args) => {
    const panel = await ctx.db.query("panel").first();

    if (!panel) return { success: false, message: "Panel not found." };

    await ctx.db.patch(panel._id, { judgingActive: args.active });

    const successMsg = args.active
      ? "Judging is active."
      : "Judging has ended.";

    return { success: true, message: successMsg };
  },
});

export const panelSetProjects = internalMutation({
  args: { projects: v.array(projectValidator) },
  handler: async (ctx, args) => {
    const panel = await ctx.db.query("panel").first();

    if (!panel) {
      await ctx.db.insert("panel", {
        judgingActive: false,
        projects: args.projects,
        presentations: [],
      });
    } else {
      await ctx.db.patch(panel._id, { projects: args.projects });
    }

    return { success: true, message: "Panel projects updated." };
  },
});

export const initializeSessionAfterImport = internalMutation({
  handler: async (ctx) => {
    const judges = await ctx.runQuery(internal.judging.listJudges);

    if (!judges || judges.length === 0) {
      return {
        success: false,
        message: "There are no judges registered.",
      };
    }

    const panel = await ctx.db.query("panel").first();

    if (!panel) return { success: false, message: "Panel not found." };

    if (panel.projects.length === 0)
      return { success: false, message: "No projects found." };

    const allProjectsForSession = panel.projects.map((p) => ({
      devpostId: p.devpostId,
      name: p.name,
      teamMembers: p.teamMembers,
      devpostUrl: p.devpostUrl,
    }));

    const sharedPresentations: PresentationSlot[] = allProjectsForSession.map(
      (project) => ({
        projectName: project.name,
        projectDevpostId: project.devpostId,
        duration: defaultDurationMinutes,
        status: "upcoming",
        timerState: {
          remainingSeconds: defaultDurationMinutes * 60,
          isPaused: false,
        },
      })
    );

    await ctx.db.patch(panel._id, { presentations: sharedPresentations });

    return {
      success: true,
      message: "Shared judging schedule initialized.",
    };
  },
});

export const beginJudging = action({
  handler: async (ctx): Promise<{ success: boolean; message: string }> => {
    const currentUser = await ctx.runQuery(api.user.currentUser);

    if (!currentUser) return { success: false, message: noAuthMsg };

    if (currentUser.role !== "director")
      return { success: false, message: notDirectorMsg };

    const importResult: { success: boolean; message: string } =
      await ctx.runAction(internal.projects.importFromDevpost);

    if (!importResult.success)
      return { success: false, message: importResult.message };

    const initResult: { success: boolean; message: string } =
      await ctx.runMutation(internal.judging.initializeSessionAfterImport);

    if (!initResult.success)
      return { success: false, message: initResult.message };

    return await ctx.runMutation(internal.judging.panelSetJudgingActive, {
      active: true,
    });
  },
});

export const endJudging = mutation({
  handler: async (ctx): Promise<{ success: boolean; message: string }> => {
    const user = await getCurrentUser(ctx);

    if (!user) return { success: false, message: noAuthMsg };

    if (user.role !== "director") {
      return { success: false, message: notDirectorMsg };
    }

    return await ctx.runMutation(internal.judging.panelSetJudgingActive, {
      active: false,
    });
  },
});

export const submitScore = mutation({
  args: {
    projectDevpostId: v.string(),
    criteria: v.record(v.string(), v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    if (!user) return { success: false, message: noAuthMsg };

    if (user.role !== "judge") {
      return { success: false, message: notJudgeMsg };
    }

    const panel = await ctx.db.query("panel").first();

    if (!panel) return { success: false, message: "Panel not found." };

    const project = panel.projects.find(
      (p) => p.devpostId === args.projectDevpostId
    );

    if (!project) return { success: false, message: "Project not found." };

    if (!project.hasPresented)
      return {
        success: false,
        message: waitUntilSubmitMsg,
      };

    const newScore: Score = { judgeId: user._id, criteria: args.criteria };

    const updatedProjects = panel.projects.map((p) => {
      if (p.devpostId !== args.projectDevpostId) return p;

      const existing = p.scores.find((s) => s.judgeId === user._id);

      if (existing) {
        const scoresCopy = p.scores.map((s) =>
          s.judgeId === user._id ? newScore : s
        );

        return { ...p, scores: scoresCopy };
      }

      return { ...p, scores: [...p.scores, newScore] };
    });

    await ctx.db.patch(panel._id, { projects: updatedProjects });

    return { success: true, message: "Successfully submitted score." };
  },
});
