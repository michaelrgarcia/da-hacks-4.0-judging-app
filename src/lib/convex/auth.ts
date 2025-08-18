import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";
import { Infer } from "convex/values";
import { hierarchyValidator } from "./validators";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      const existingUser = args.existingUserId
        ? await ctx.db.get(args.existingUserId)
        : null;

      if (existingUser) {
        return existingUser._id;
      }

      const hierarchy: Infer<typeof hierarchyValidator> = await ctx.db
        .query("hierarchy")
        .first();

      const isDirector = hierarchy.directors.some(
        (email) => args.profile.email === email
      );
      const isMentor = hierarchy.mentors.some(
        (email) => args.profile.email === email
      );
      const isJudge = hierarchy.judges!.some(
        (email) => args.profile.email === email
      );

      if (!isDirector && !isMentor && !isJudge)
        return {
          success: false,
          message: `Attempted login by ${args.profile.email}.`,
        };

      return await ctx.db.insert("users", {
        name: args.profile.name,
        email: args.profile.email,
        image: args.profile.image,
        role: isDirector
          ? "director"
          : isMentor
            ? "mentor"
            : isJudge
              ? "judge"
              : undefined,
      });
    },
  },
});
