import { z } from "zod";
import { criteria } from "../constants/judging";

const criteriaValue = z.number().min(1).max(5);

export const scoreFormSchema = z.record(z.enum(criteria), criteriaValue);
export type scoreFormSchemaType = z.infer<typeof scoreFormSchema>;
