CREATE TABLE `word` (
	`id` text PRIMARY KEY NOT NULL,
	`target_language` text NOT NULL,
	`lemma` text NOT NULL,
	`part_of_speech` text NOT NULL,
	`gender` text,
	`forms` text,
	`sentence` text NOT NULL,
	`sentence_translations` text NOT NULL,
	`source_url` text,
	`translations` text NOT NULL,
	`review_stage` integer NOT NULL,
	`next_review_at` text,
	`learned_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
