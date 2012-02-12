/*
table alterations for tempuser
*/
CREATE TABLE `_bf`.`_bf_tempusers`( `user_id` VARCHAR(255) NOT NULL COMMENT 'Linked to User table', PRIMARY KEY (`user_id`) ); 
ALTER TABLE `_bf`.`_bf_users` CHANGE `user_id` `user_id` INT(255) NOT NULL AUTO_INCREMENT COMMENT 'Unique USER ID';
ALTER TABLE `_bf`.`_bf_reviews` CHANGE `user_id` `user_id` VARCHAR(255) NOT NULL COMMENT 'Reviewer ID'; 
ALTER TABLE `_bf`.`_bf_discussions` CHANGE `user_id` `user_id` VARCHAR(255) NOT NULL COMMENT 'Reviewer ID';
ALTER TABLE `_bf`.`_bf_comments` CHANGE `user_id` `user_id` VARCHAR(255) NOT NULL COMMENT 'Reviewer ID'; 
ALTER TABLE `_bf`.`_bf_watches` CHANGE `userid` `userid` VARCHAR(255) NOT NULL; 

