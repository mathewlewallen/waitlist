import { RecipeRecord } from "@/db/models";
import { DeepPartial } from "ai";
import { z } from "zod";

export const ingredientSchema = z.object({
  name: z.string(),
  amount: z.string(),
});

export type Ingredient = z.infer<typeof ingredientSchema>;

export const recipeRequestSchema = z.object({
  id: z.string().optional(),
  owner_id: z.string(),
  name: z.string(),
  description: z.string(),
  ingredients: z.array(ingredientSchema),
  instructions: z.array(z.string()),
  is_public: z.boolean().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  created_by_id: z.string().optional(),
});

export const recipesRequestSchema = z.object({
  recipes: z.array(recipeRequestSchema),
});

export type RecipeRequest = z.infer<typeof recipeRequestSchema>;
export type PartialRecipe = DeepPartial<z.infer<typeof recipeRequestSchema>>;

export class Recipe {
  id?: string;
  owner_id?: string;
  name?: string;
  description?: string;
  ingredients?: Ingredient[];
  instructions?: string[];
  is_favorite?: boolean
  is_public?: boolean
  created_at?: Date
  updated_at?: Date
  created_by_id?: string

  static FromAiRequest(request: RecipeRequest): Recipe {
    return {
      id: request.id,
      owner_id: request.owner_id,
      name: request.name,
      description: request.description,
      ingredients: request.ingredients,
      instructions: request.instructions,
      is_public: request.is_public,
      created_at: request.created_at,
      updated_at: request.updated_at,
      created_by_id: request.created_by_id,
    };
  }

  static FromDbRecord(record: RecipeRecord): Recipe {
    return {
      id: record.id,
      owner_id: record.owner_id,
      name: record.name,
      description: record.description ?? "",
      ingredients: record.ingredients as Ingredient[],
      instructions: record.instructions as string[],
      is_public: record.is_public ? true : false,
      created_at: record.created_at,
      updated_at: record.updated_at,
      created_by_id: record.created_by_id,
    };
  }
}