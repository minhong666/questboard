CREATE TABLE `user_game_saves` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`schemaVersion` int NOT NULL DEFAULT 2,
	`payload` longtext NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_game_saves_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_game_saves_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `user_game_saves` ADD CONSTRAINT `user_game_saves_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;