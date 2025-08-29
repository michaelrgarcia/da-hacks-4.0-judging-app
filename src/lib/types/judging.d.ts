import type { Infer } from "convex/values";
import { criteria } from "../constants/judging";
import {
  judgingSessionValidator,
  projectValidator,
  scoreValidator,
} from "../convex/validators";
import { UserDoc } from "./user";

export type Score = Infer<typeof scoreValidator>;

export type Project = Infer<typeof projectValidator>;

export type JudgingSession = Infer<typeof judgingSessionValidator>;

export type Criterions = (typeof criteria)[number];
export type Criteria = Record<Criterions, number>;
export type CriteriaLabels = Record<Criterions, string>;

export type Group = { mentorName: string; judges: UserDoc[] };
