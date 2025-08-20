import { v } from "convex/values";
import {
  noAuthMsg,
  notDirectorMsg,
  notJudgeMsg,
} from "../constants/errorMessages";
import type { Group, JudgingSession, Score } from "../types/judging";
import type { User } from "../types/user";
import { api, internal } from "./_generated/api";
import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { getCurrentUser } from "./user";
import { judgingSessionValidator } from "./validators";

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
      if (staffMember.judgingSession) {
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

      return { success: true, message: "Processing..." };
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
      if (staffMember.judgingSession) {
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

      return { success: true, message: "Processing..." };
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

export const getGroups = query({
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) return null;

    if (user.role !== "director") {
      return null;
    }

    const judges = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "judge"))
      .collect();

    const judgesWithSessions = judges.filter((judge) => {
      if (!judge.judgingSession) {
        console.warn(`${judge.name} is not assigned a group of judges.`);

        return false;
      }

      return true;
    });

    const groups = judgesWithSessions.reduce(
      (acc, judge) => {
        const mentorName = judge.judgingSession!.mentorName;

        if (!acc[mentorName]) {
          acc[mentorName] = {
            mentorName,
            judges: [],
          };
        }

        acc[mentorName].judges.push(judge);

        return acc;
      },
      {} as Record<
        string,
        {
          mentorName: string;
          judges: User[];
        }
      >
    );

    const groupsArray = Object.values(groups);

    return groupsArray;
  },
});

export const patchUserJudgingSession = internalMutation({
  args: { userId: v.id("users"), judgingSession: judgingSessionValidator },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { judgingSession: args.judgingSession });
  },
});

export const listNonDirectors = internalQuery({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) return null;

    if (user.role !== "director") return null;

    return await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("role"), "director"))
      .collect();
  },
});

export const createGroups = action({
  handler: async (ctx) => {
    const currentUser = await ctx.runQuery(api.user.currentUser);

    if (!currentUser)
      return { success: false, message: noAuthMsg, groups: [] as Group[] };

    if (currentUser.role !== "director")
      return { success: false, message: notDirectorMsg, groups: [] as Group[] };

    const nonDirectors = await ctx.runQuery(internal.judging.listNonDirectors);

    if (!nonDirectors)
      return {
        success: false,
        message: "There are no judges or mentors.",
        groups: [] as Group[],
      };

    const mentors = nonDirectors.filter((u) => u.role === "mentor");
    const judges = nonDirectors.filter((u) => u.role === "judge");

    const groups: Group[] = mentors.map((mentor, mentorIndex) => {
      const assignedJudges = [];

      for (let i = 0; i < judges.length; i++) {
        if (i % mentors.length === mentorIndex) assignedJudges.push(judges[i]);
      }

      return {
        mentorName: mentor.name || "Unknown Mentor",
        judges: assignedJudges,
      };
    });

    for (let m = 0; m < mentors.length; m++) {
      const mentor = mentors[m];
      const assignedJudges = groups[m]?.judges ?? [];

      const judgeNames = assignedJudges.map((j) => j.name || "Unknown Judge");

      const sessionBase: JudgingSession = {
        projects: [],
        judges: judgeNames,
        presentations: [],
        isActive: false,
        mentorName: mentor.name || "Unknown Mentor",
      };

      await ctx.runMutation(internal.judging.patchUserJudgingSession, {
        userId: mentor._id,
        judgingSession: sessionBase,
      });

      for (const judge of assignedJudges) {
        await ctx.runMutation(internal.judging.patchUserJudgingSession, {
          userId: judge._id,
          judgingSession: sessionBase,
        });
      }
    }

    const removalResult: { success: boolean; message: string } =
      await ctx.runMutation(internal.projectsConvex.removeAllProjects);

    if (!removalResult.success) {
      return { success: false, message: removalResult.message, groups };
    }

    const importResult: { success: boolean; message: string } =
      await ctx.runAction(internal.projectsNode.importFromDevpost);

    if (!importResult.success) {
      return { success: false, message: importResult.message, groups };
    }

    const allProjects = await ctx.runQuery(
      internal.projectsConvex.listAllProjects
    );

    if (!allProjects)
      return {
        success: false,
        message: "Failed to list all projects.",
        groups,
      };

    if (allProjects.length === 0) {
      return {
        success: false,
        message: "No projects available after import.",
        groups,
      };
    }

    const projectsPerGroup: JudgingSession["projects"][] = mentors.map(
      () => []
    );

    for (let i = 0; i < allProjects.length; i++) {
      const g = i % mentors.length;

      projectsPerGroup[g].push({
        devpostId: allProjects[i].devpostId,
        name: allProjects[i].name,
        teamMembers: allProjects[i].teamMembers,
        devpostUrl: allProjects[i].devpostUrl,
        scores: [],
      });
    }

    for (let m = 0; m < mentors.length; m++) {
      const mentor = mentors[m];
      const assignedJudges = groups[m]?.judges ?? [];

      const judgeNames = assignedJudges.map((j) => j.name || "Unknown Judge");

      const sessionWithProjects: JudgingSession = {
        projects: projectsPerGroup[m],
        judges: judgeNames,
        presentations: [],
        isActive: false,
        mentorName: mentor.name || "Unknown Mentor",
      };

      await ctx.runMutation(internal.judging.patchUserJudgingSession, {
        userId: mentor._id,
        judgingSession: sessionWithProjects,
      });

      for (const judge of assignedJudges) {
        await ctx.runMutation(internal.judging.patchUserJudgingSession, {
          userId: judge._id,
          judgingSession: sessionWithProjects,
        });
      }
    }

    return {
      success: true,
      message: "Groups created and projects assigned.",
      groups,
    };
  },
});
