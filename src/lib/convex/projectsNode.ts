"use node";

import { projectsLink } from "../constants/projects";
import type { Project, Score } from "../types/judging";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

import { parse } from "node-html-parser";

export const importFromDevpost = internalAction({
  handler: async (ctx) => {
    const res = await fetch(projectsLink);

    const asText = await res.text();

    const root = parse(asText);
    const gallery = root.querySelector("#submission-gallery");

    if (!gallery)
      return {
        success: false,
        message:
          "Failed to obtain projects from Devpost. There may be no projects submitted.",
      };

    const projectCards = gallery.querySelectorAll(".gallery-item");

    const devpostProjects: Project[] = Array.from(projectCards).map((card) => {
      const devpostLink = card.querySelector(".link-to-software");
      const name = card.querySelector("h5");

      const teamMemberPhotos = card.querySelectorAll(".user-photo");
      const memberOverflow = card.querySelector(".member-overflow")?.lastChild;

      const devpostUrl = devpostLink
        ? (devpostLink.getAttribute("href") ?? "")
        : "";

      const devpostId = devpostUrl !== "" ? devpostUrl.split("/")[4] : "";

      const teamMembers = Array.from(teamMemberPhotos).map((photo) =>
        photo
          ? (photo.getAttribute("alt") ?? "Unknown Member")
          : "Unknown Member"
      );

      if (memberOverflow) {
        const extraMemberCount = memberOverflow
          .toString()
          .split("\n")[2]
          .split(" ")[3];

        for (let i = 0; i < Number(extraMemberCount); i++) {
          teamMembers.push("Unknown Member");
        }
      }

      return {
        devpostUrl,
        devpostId,
        name: name ? name.textContent.trim() : "",
        scores: [] as Score[],
        teamMembers,
      };
    });

    const removalResult: { success: boolean; message: string } =
      await ctx.runMutation(internal.projectsConvex.removeAllProjects);

    if (!removalResult.success)
      return { success: false, message: removalResult.message };

    const insertionResult: { success: boolean; message: string } =
      await ctx.runMutation(internal.projectsConvex.bulkInsertProjects, {
        devpostProjects,
      });

    if (!insertionResult.success)
      return { success: false, message: insertionResult.message };

    return {
      success: true,
      message: "Successfully imported projects from Devpost.",
    };
  },
});
