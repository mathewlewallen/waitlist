import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  boolean,
  json,
  integer,
  varchar
} from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  owner_id: text("owner_id").notNull(),
  created_at: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { mode: "date", precision: 3 }).notNull(),
  is_archived: boolean("is_archived").default(false).notNull(),
});

export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  owner_id: text("owner_id").notNull(),
  is_completed: boolean("is_completed").default(false).notNull(),
  created_at: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { mode: "date", precision: 3 }).notNull(),
  project_id: text("project_id"),
});

export const posts = pgTable("posts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  created_at: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { mode: "date", precision: 3 }).notNull(),
  created_by_id: text("created_by_id").notNull(),
});

export const recipe = pgTable('recipe', {
  id: text("id").primaryKey(),
  owner_id: text('owner_id').notNull(), // user or family id
  name: text("name").notNull(),
  description: text("description"),
  ingredients: json("ingredients").notNull(),
  instructions: json("instructions").notNull(),
  created_at: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { mode: "date", precision: 3 }).notNull(),
  created_by_id: text("created_by_id").notNull(),
  is_public: boolean("is_public").default(false).notNull(),
});

export const favorites = pgTable("favorites", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull(),
  recipe_id: integer("recipe_id").notNull(),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull(),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  provider_account_id: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
  refresh_token_expires_in: integer("refresh_token_expires_in"),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  session_token: text("session_token").notNull(),
  user_id: text("user_id").notNull(),
  expires: timestamp("expires", { mode: "date", precision: 3 }).notNull(),
});

export const users = pgTable('users', {
  id: text("id").primaryKey(),
  name: text('name').notNull(),
  email: text("email"),
  email_verified: timestamp("email_verified", { mode: "date", precision: 3 }),
  image: text("image"),
  img_url: text('img_url').notNull(),
  phone: varchar('phone', { length: 255 }),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date", precision: 3 }).notNull(),
});

export const postsRelations = relations(posts, (helpers) => ({
  created_by: helpers.one(users, {
    relationName: "post_to_user",
    fields: [posts.created_by_id],
    references: [users.id],
  }),
}));

export const recipeRelations = relations(recipe, (helpers) => ({
  user: helpers.one(users, {
    relationName: "recipe_to_user",
    fields: [recipe.owner_id],
    references: [users.id],
  }),
  favorites: helpers.many(favorites, { relationName: "favorite_to_recipe" }),
}));

export const favoritesRelations = relations(favorites, (helpers) => ({
  recipe: helpers.one(recipe, {
    relationName: "favorite_to_recipe",
    fields: [favorites.recipe_id],
    references: [recipe.id],
  }),
  user: helpers.one(users, {
    relationName: "favorite_to_user",
    fields: [favorites.user_id],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, (helpers) => ({
  user: helpers.one(users, {
    relationName: "account_to_user",
    fields: [accounts.user_id],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, (helpers) => ({
  user: helpers.one(users, {
    relationName: "session_to_user",
    fields: [sessions.user_id],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, (helpers) => ({
  accounts: helpers.many(accounts, { relationName: "account_to_user" }),
  posts: helpers.many(posts, { relationName: "post_to_user" }),
  sessions: helpers.many(sessions, { relationName: "session_to_user" }),
  recipe: helpers.many(recipe, { relationName: "recipe_to_user" }),
  favorites: helpers.many(favorites, { relationName: "favorite_to_user" }),
}));
