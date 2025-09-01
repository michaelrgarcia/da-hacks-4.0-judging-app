import { v } from "convex/values";
import { noAuthMsg, notDirectorMsg } from "../constants/errorMessages";
import { mutation } from "./_generated/server";
import { getCurrentUser } from "./user";
import { presentationSlotValidator } from "./validators";

export const beginPresentation = mutation({
  args: {
    newPresentations: v.array(presentationSlotValidator),
    projectName: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    if (!user) return { success: false, message: noAuthMsg };

    if (user.role !== "director") {
      return { success: false, message: notDirectorMsg };
    }

    const panel = await ctx.db.query("panel").first();

    if (!panel) return { success: false, message: "Panel not found." };

    if (!panel.judgingActive)
      return { success: false, message: "Please wait until judging begins." };

    await ctx.db.patch(panel._id, { presentations: args.newPresentations });

    return {
      success: true,
      message: `Presentation for ${args.projectName} has began.`,
    };
  },
});

export const endPresentation = mutation({
  args: {
    newPresentations: v.array(presentationSlotValidator),
    projectName: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    if (!user) return { success: false, message: noAuthMsg };

    if (user.role !== "director") {
      return { success: false, message: notDirectorMsg };
    }

    const panel = await ctx.db.query("panel").first();

    if (!panel) return { success: false, message: "Panel not found." };

    if (!panel.judgingActive)
      return { success: false, message: "Please wait until judging begins." };

    await ctx.db.patch(panel._id, { presentations: args.newPresentations });

    return {
      success: true,
      message: `Presentation for ${args.projectName} ended.`,
    };
  },
});
