import type { Infer } from "convex/values";
import { projectValidator, scoreValidator } from "../convex/validators";

export type Score = Infer<typeof scoreValidator>;

export type Project = Infer<typeof projectValidator>;
