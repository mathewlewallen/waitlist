'use server'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from "./schema";
import { Recipe } from "@/models/recipes";
import { favorites, recipe, users } from "./schema";
import { and, eq } from "drizzle-orm";
import { env } from '@/env'

const connectionString = env.DATABASE_URL
const client = postgres(connectionString, { prepare: false })
const db = drizzle({client, schema});

const allUsers = await db.select().from(users)

export async function saveRecipe(recipe: Recipe, id: string, ownerId: string) {
  await db.insert(recipe).values({
    id: id,
    owner_id: ownerId,
    name: recipe.name,
    description: recipe.description,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    created_at: recipe.createdAt,
    updated_at: recipe.updatedAt,
    created_by_id: recipe.createdById,
    is_public: recipe.isPublic
  }).execute();
}

export async function getRecipeByOwnerId(ownerId: string): Promise<Recipe[]> {
  const r = await db.select().from(recipe)
    .where(eq(recipe.owner_id, ownerId)).execute();
  const favs = await db.select().from(favorites).where(
    eq(favorites.user_id, ownerId)
  ).execute()

  const rval: Recipe[] = [];
  for(const record of r) {
    let recipe = Recipe.FromDbRecord(record);
        recipe.isFavorite = favs.find(f => f.recipe_id === recipe.id) ? true : false;
    rval.push(recipe);
  }
  return rval
}

export async function toggleRecipeFavoriteStatus(recipeId: number, id: string, ownerId: string): Promise<boolean> {
  const fav = await db.select().from(favorites).where(and(
    eq(favorites.recipe_id, recipeId),
    eq(favorites.user_id, ownerId)
  ))
  if(fav && fav.length > 0) {
    await db.delete(favorites).where(and(
      eq(favorites.recipe_id, recipeId),
      eq(favorites.user_id, ownerId)
    )).execute()
    return false
  } else {
    await db.insert(favorites).values({
      id: id,
      user_id: ownerId,
      recipe_id: recipeId
    }).execute()
    return true
  }
}

export async function setRecipeVisibility(recipeId: number, isPublic: boolean, ownerId: string) {
  await db.update(recipe).set({
    is_public: isPublic
  }).where(and(
    eq(recipe.id, recipeId.toString()),
    eq(recipe.owner_id, ownerId)
  )).execute()
}

export async function deleteRecipeRecord(recipeId: number, ownerId: string) {
  await db.delete(recipe).where(and(
    eq(recipe.id, recipeId.toString()),
    eq(recipe.owner_id, ownerId)
  )).execute()
}

export async function getPublicRecipe(recipeId: number): Promise<Recipe | null> {
  const r = await db.select().from(recipe).where(and(
    eq(recipe.id, recipeId.toString()),
    eq(recipe.is_public, true)
  )).execute()
  console.log(r)
  return r.length > 0 ? Recipe.FromDbRecord(r[0]) : null
}

