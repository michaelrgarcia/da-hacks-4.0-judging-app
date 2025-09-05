import { v } from "convex/values";
import { noAuthMsg, notDirectorMsg } from "../constants/errorMessages";
import { PresentationSlot } from "../types/presentations";
import { mutation, MutationCtx } from "./_generated/server";
import { getCurrentUser } from "./user";
import { presentationSlotValidator } from "./validators";

async function patchPresentations(
  ctx: MutationCtx,
  newPresentations: PresentationSlot[]
) {
  const user = await getCurrentUser(ctx);

  if (!user) return { success: false, message: noAuthMsg };

  if (user.role !== "director") {
    return { success: false, message: notDirectorMsg };
  }

  const panel = await ctx.db.query("panel").first();

  if (!panel) return { success: false, message: "Panel not found." };

  if (!panel.judgingActive)
    return { success: false, message: "Please wait until judging begins." };

  await ctx.db.patch(panel._id, { presentations: newPresentations });

  return {
    success: true,
    message: `Presentations patched.`,
  };
}

export const beginPresentation = mutation({
  args: {
    newPresentations: v.array(presentationSlotValidator),
    projectName: v.string(),
  },
  handler: async (ctx, args) => {
    const { success } = await patchPresentations(ctx, args.newPresentations);

    if (success) {
      return {
        success: true,
        message: `Presentation for ${args.projectName} has began.`,
      };
    } else {
      return {
        success: false,
        message: `Failed to begin presentation for ${args.projectName}.`,
      };
    }
  },
});

export const endPresentation = mutation({
  args: {
    newPresentations: v.array(presentationSlotValidator),
    projectName: v.string(),
    projectDevpostId: v.string(),
  },
  handler: async (ctx, args) => {
    const { success } = await patchPresentations(ctx, args.newPresentations);

    const panel = await ctx.db.query("panel").first();

    if (!panel) return { success: false, message: "Panel not found." };

    const projectIndex = panel.projects.findIndex(
      (p) => p.devpostId === args.projectDevpostId
    );

    if (projectIndex === -1)
      return { success: false, message: "Could not find project." };

    const newProjects = [...panel.projects];
    newProjects[projectIndex] = {
      ...newProjects[projectIndex],
      hasPresented: true,
    };

    await ctx.db.patch(panel._id, { projects: newProjects });

    if (success) {
      return {
        success: true,
        message: `Presentation for ${args.projectName} has ended.`,
      };
    } else {
      return {
        success: false,
        message: `Failed to end presentation for ${args.projectName}.`,
      };
    }
  },
});

export const pausePresentation = mutation({
  args: {
    newPresentations: v.array(presentationSlotValidator),
    projectName: v.string(),
  },
  handler: async (ctx, args) => {
    const { success } = await patchPresentations(ctx, args.newPresentations);

    if (success) {
      return {
        success: true,
        message: `Presentation for ${args.projectName} paused.`,
      };
    } else {
      return {
        success: false,
        message: `Failed to pause presentation for ${args.projectName}.`,
      };
    }
  },
});

export const resumePresentation = mutation({
  args: {
    newPresentations: v.array(presentationSlotValidator),
    projectName: v.string(),
  },
  handler: async (ctx, args) => {
    const { success } = await patchPresentations(ctx, args.newPresentations);

    if (success) {
      return {
        success: true,
        message: `Presentation for ${args.projectName} resumed.`,
      };
    } else {
      return {
        success: false,
        message: `Failed to resume presentation for ${args.projectName}.`,
      };
    }
  },
});
