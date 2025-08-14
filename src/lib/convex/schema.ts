import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { hierarchyValidator, userValidator } from "./validators";

const schema = defineSchema({
  ...authTables,
  users: defineTable(userValidator)
    .index("email", ["email"])
    .index("by_role", ["role"]),
  hierarchy: defineTable(hierarchyValidator),
});

export default schema;
