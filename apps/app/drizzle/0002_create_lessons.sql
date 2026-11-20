CREATE TABLE `lesson` (
	`id` text PRIMARY KEY NOT NULL,
	`number` integer NOT NULL,
	`word_ids` text NOT NULL,
	`task_results` text NOT NULL,
	`xp_earned` integer NOT NULL,
	`started_at` text,
	`completed_at` text
);
