import { z } from "zod";
import { criteria } from "../constants/judging";

const criteriaValue = z
  .number()
  .min(1, "Please move the slider to give your rating.")
  .max(5, "Please do not rate this criterion above 5.");

export const scoreFormSchema = z.record(z.enum(criteria), criteriaValue);
export type scoreFormSchemaType = z.infer<typeof scoreFormSchema>;
