import { InferSelectModel } from "drizzle-orm";
import { recipe } from "./schema";

export type RecipeRecord = InferSelectModel<typeof recipe>;