import type { Infer } from "convex/values";
import { presentationSlotValidator } from "../convex/validators";

export type PresentationSlot = Infer<typeof presentationSlotValidator>;
