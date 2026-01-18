CREATE INDEX IF NOT EXISTS "idx_blogs_created_at" ON "blogs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_menu_items_category" ON "menu_items" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_reservations_date" ON "reservations" USING btree ("date");