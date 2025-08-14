import { v } from "convex/values";

export const projectValidator = v.object({
  name: v.string(),
  description: v.optional(v.string()),
  teamMembers: v.array(v.string()),
  track: v.string(),
  demoUrl: v.optional(v.string()),
  githubUrl: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
});

export const presentationSlotValidator = v.object({
  projectName: v.string(),
  startTime: v.number(),
  duration: v.number(),
  status: v.union(
    v.literal("upcoming"),
    v.literal("presenting"),
    v.literal("completed")
  ),
  timerState: v.object({
    remainingSeconds: v.number(),
    isPaused: v.boolean(),
    startedAt: v.optional(v.number()),
  }),
});

export const scoreValidator = v.object({
  projectName: v.string(),
  judgeName: v.string(),
  criteria: v.object({
    applicationFeasibility: v.number(),
    functionalityQuality: v.number(),
    creativityInnovation: v.number(),
    technicalComplexity: v.number(),
    presentation: v.number(),
  }),
});

export const judgingSessionValidator = v.object({
  projects: v.array(projectValidator),
  judges: v.array(v.string()),
  presentations: v.array(presentationSlotValidator),
  scores: v.array(scoreValidator),
  isActive: v.boolean(),
  currentPresentation: v.optional(v.string()),
});

export const userValidator = v.object({
  name: v.optional(v.string()),
  image: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerificationTime: v.optional(v.number()),
  phone: v.optional(v.string()),
  phoneVerificationTime: v.optional(v.number()),
  isAnonymous: v.optional(v.boolean()),
  role: v.string(),
  judgingSession: v.optional(judgingSessionValidator),
});

export const hierarchyValidator = v.object({
  directors: v.array(v.string()),
  mentors: v.array(v.string()),
});
