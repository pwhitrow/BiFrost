/*
table alterations for paginator/scroll loader
*/
ALTER TABLE `_bf`.`_bf_organisations` ADD COLUMN `paginator` TINYINT(1) DEFAULT '0' NOT NULL COMMENT 'paginator or scroll loader?' AFTER `date_registered`;