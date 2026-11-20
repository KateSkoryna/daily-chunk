CREATE TABLE `profile` (
	`id` text PRIMARY KEY NOT NULL,
	`target_language` text NOT NULL,
	`native_language` text NOT NULL,
	`app_language` text NOT NULL,
	`xp` integer NOT NULL,
	`current_streak` integer NOT NULL,
	`longest_streak` integer NOT NULL,
	`last_study_date` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
