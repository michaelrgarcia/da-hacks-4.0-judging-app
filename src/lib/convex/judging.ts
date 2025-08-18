import { v } from "convex/values";
import {
  noAuthMsg,
  notDirectorMsg,
  notJudgeMsg,
} from "../constants/errorMessages";
import type { Score } from "../types/judging";
import { api } from "./_generated/api";
import { mutation } from "./_generated/server";
import { getCurrentUser } from "./user";

export const beginJudging = mutation({
  args: { cursor: v.union(v.string(), v.null()), numItems: v.number() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    if (!user) return { success: false, message: noAuthMsg };

    if (user.role !== "director") {
      return { success: false, message: notDirectorMsg };
    }

    const staff = await ctx.db.query("users").paginate(args);

    const { page, isDone, continueCursor } = staff;

    for (const staffMember of page) {
      if (staffMember.judgingSession && staffMember.role !== "director") {
        await ctx.db.patch(staffMember._id, {
          judgingSession: { ...staffMember.judgingSession, isActive: true },
        });
      } else {
        console.warn(`${staffMember.name} is not assigned a group of judges.`);

        continue;
      }
    }

    if (!isDone) {
      await ctx.scheduler.runAfter(0, api.judging.beginJudging, {
        cursor: continueCursor,
        numItems: args.numItems,
      });
    } else {
      return { success: true, message: "Judging has began." };
    }
  },
});

export const endJudging = mutation({
  args: { cursor: v.union(v.string(), v.null()), numItems: v.number() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    if (!user) return { success: false, message: noAuthMsg };

    if (user.role !== "director") {
      return { success: false, message: notDirectorMsg };
    }

    const staff = await ctx.db.query("users").paginate(args);

    const { page, isDone, continueCursor } = staff;

    for (const staffMember of page) {
      if (staffMember.judgingSession && staffMember.role !== "director") {
        await ctx.db.patch(staffMember._id, {
          judgingSession: { ...staffMember.judgingSession, isActive: false },
        });
      } else {
        console.warn(`${staffMember.name} is not assigned a group of judges.`);

        continue;
      }
    }

    if (!isDone) {
      await ctx.scheduler.runAfter(0, api.judging.endJudging, {
        cursor: continueCursor,
        numItems: args.numItems,
      });
    } else {
      return { success: true, message: "Judging has ended." };
    }
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

    if (!user.judgingSession)
      return {
        success: false,
        message:
          "You have not been assigned any projects. If this is a mistake, contact Michael from the Tech team.",
      };

    const project = await ctx.db
      .query("projects")
      .withIndex("by_devpostId", (q) =>
        q.eq("devpostId", args.projectDevpostId)
      )
      .first();

    if (!project)
      return {
        success: false,
        message:
          "This project does not exist. If this is a mistake, contact Michael from the Tech team.",
      };

    const newScore: Score = { judgeId: user._id, criteria: args.criteria };
    const existingScore = project.scores.find(
      (score) => score.judgeId === user._id
    );

    if (existingScore) {
      const existingScoreIndex = project.scores.indexOf(existingScore);

      const scoresCopy = structuredClone(project.scores);
      scoresCopy[existingScoreIndex] = newScore;

      await ctx.db.patch(project._id, { scores: scoresCopy });
    } else {
      await ctx.db.patch(project._id, {
        scores: [...project.scores, newScore],
      });
    }

    return { success: true, message: "Successfully submitted score." };
  },
});
