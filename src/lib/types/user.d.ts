import type { Infer } from "convex/values";
import { roles } from "../constants/roles";
import { userValidator } from "../convex/validators";

export type User = Infer<typeof userValidator>;

export type Role = (typeof roles)[number];
