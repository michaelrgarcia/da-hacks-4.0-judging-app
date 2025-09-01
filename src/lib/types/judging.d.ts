import type { Infer } from "convex/values";
import { criteria } from "../constants/judging";
import { projectValidator, scoreValidator } from "../convex/validators";

export type Score = Infer<typeof scoreValidator>;

export type Project = Infer<typeof projectValidator>;

export type Criterions = (typeof criteria)[number];
export type Criteria = Record<Criterions, number>;
export type CriteriaLabels = Record<Criterions, string>;
