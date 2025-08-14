import { v } from "convex/values";
import { noAuthMsg, notAdminMsg } from "../constants/errorMessages";
import { api } from "./_generated/api";
import { mutation } from "./_generated/server";
import { getCurrentUser } from "./user";

export const beginJudging = mutation({
  args: { cursor: v.union(v.string(), v.null()), numItems: v.number() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    if (!user) return { success: false, message: noAuthMsg };

    if (user.role !== "admin") {
      return { success: false, message: notAdminMsg };
    }

    const staff = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "staff"))
      .paginate(args);

    const { page, isDone, continueCursor } = staff;

    for (const staffMember of page) {
      if (!staffMember.judgingSession) {
        console.warn(`${staffMember.name} is not assigned a group of judges.`);

        continue;
      }

      await ctx.db.patch(staffMember._id, {
        judgingSession: { ...staffMember.judgingSession, isActive: true },
      });
    }

    if (!isDone) {
      await ctx.scheduler.runAfter(0, api.judge.beginJudging, {
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

    if (user.role !== "admin") {
      return { success: false, message: notAdminMsg };
    }

    const staff = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "staff"))
      .paginate(args);

    const { page, isDone, continueCursor } = staff;

    for (const staffMember of page) {
      if (!staffMember.judgingSession) {
        continue;
      }

      await ctx.db.patch(staffMember._id, {
        judgingSession: { ...staffMember.judgingSession, isActive: false },
      });
    }

    if (!isDone) {
      await ctx.scheduler.runAfter(0, api.judge.endJudging, {
        cursor: continueCursor,
        numItems: args.numItems,
      });
    } else {
      return { success: true, message: "Judging has ended." };
    }
  },
});
