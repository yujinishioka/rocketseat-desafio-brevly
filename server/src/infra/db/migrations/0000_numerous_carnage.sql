CREATE TABLE "uploads" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"access" integer DEFAULT 0 NOT NULL,
	"remote_key" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uploads_name_unique" UNIQUE("name"),
	CONSTRAINT "uploads_url_unique" UNIQUE("url"),
	CONSTRAINT "uploads_remote_key_unique" UNIQUE("remote_key")
);
