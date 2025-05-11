PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_locationLog` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`started_at` integer NOT NULL,
	`ended_at` integer NOT NULL,
	`lat` real NOT NULL,
	`long` real NOT NULL,
	`location_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `location`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_locationLog`("id", "name", "description", "started_at", "ended_at", "lat", "long", "location_id", "user_id", "created_at", "updated_at") SELECT "id", "name", "description", "started_at", "ended_at", "lat", "long", "location_id", "user_id", "created_at", "updated_at" FROM `locationLog`;--> statement-breakpoint
DROP TABLE `locationLog`;--> statement-breakpoint
ALTER TABLE `__new_locationLog` RENAME TO `locationLog`;--> statement-breakpoint
PRAGMA foreign_keys=ON;