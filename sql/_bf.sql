/*
SQLyog Ultimate v9.20 
MySQL - 5.5.16-log : Database - _bf
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`_bf` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `_bf`;

/*Table structure for table `comments` */

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT 'Unique record ID',
  `parent_id` varchar(255) NOT NULL COMMENT 'Parent element ID',
  `api_key` varchar(255) NOT NULL COMMENT 'Organisation ID',
  `user_id` int(20) unsigned NOT NULL COMMENT 'Reviewer ID',
  `content` text NOT NULL COMMENT 'Review content',
  `posted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date posted',
  PRIMARY KEY (`id`),
  KEY `FK_comments` (`user_id`),
  CONSTRAINT `FK_comments` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `comments` */

/*Table structure for table `discussions` */

DROP TABLE IF EXISTS `discussions`;

CREATE TABLE `discussions` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique record ID',
  `parent_id` varchar(255) NOT NULL COMMENT 'Parent element ID',
  `api_key` varchar(255) NOT NULL COMMENT 'Organisation ID',
  `user_id` int(20) unsigned NOT NULL COMMENT 'Reviewer ID',
  `content` text NOT NULL COMMENT 'Review content',
  `posted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date posted',
  PRIMARY KEY (`id`),
  KEY `FK_discussions` (`user_id`),
  CONSTRAINT `FK_discussions` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `discussions` */

/*Table structure for table `media` */

DROP TABLE IF EXISTS `media`;

CREATE TABLE `media` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'unique record ID',
  `parent_id` varchar(255) NOT NULL COMMENT 'Associated record',
  `parent_type` varchar(255) NOT NULL COMMENT 'Associated item type',
  `media` text NOT NULL COMMENT 'Images',
  `user_id` varchar(255) NOT NULL COMMENT 'ID of uploader',
  `linked_id` int(10) unsigned NOT NULL COMMENT 'Linked review/discussion ID',
  PRIMARY KEY (`id`),
  KEY `FK_media` (`linked_id`),
  CONSTRAINT `FK_media` FOREIGN KEY (`linked_id`) REFERENCES `reviews` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Data for the table `media` */

/*Table structure for table `organisations` */

DROP TABLE IF EXISTS `organisations`;

CREATE TABLE `organisations` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT 'Unique ID',
  `api_key` varchar(255) NOT NULL COMMENT 'Organisation ID',
  `name` varchar(255) NOT NULL COMMENT 'Organisation Name',
  `address` text NOT NULL COMMENT 'Organisation Address',
  `tel` varchar(255) NOT NULL COMMENT 'Organisation Telephone Number',
  `email` varchar(255) NOT NULL COMMENT 'Organisation Email',
  `contact` varchar(255) NOT NULL COMMENT 'Organisation Contact Name',
  `reviews` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Has reviews?',
  `discussions` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Has discussions?',
  `date_registered` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'date registered',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `organisations` */

/*Table structure for table `ratings` */

DROP TABLE IF EXISTS `ratings`;

CREATE TABLE `ratings` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique record ID',
  `parent_id` varchar(255) NOT NULL COMMENT 'Associated record ID',
  `rating` int(20) unsigned NOT NULL COMMENT 'Rating value',
  `user_id` varchar(255) NOT NULL COMMENT 'ID of rater',
  `linked_id` int(10) unsigned NOT NULL COMMENT 'Linked review/discussion ID',
  PRIMARY KEY (`id`),
  KEY `NewIndex1` (`linked_id`),
  CONSTRAINT `FK_ratings` FOREIGN KEY (`linked_id`) REFERENCES `reviews` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

/*Data for the table `ratings` */

/*Table structure for table `reviews` */

DROP TABLE IF EXISTS `reviews`;

CREATE TABLE `reviews` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique record ID',
  `parent_id` varchar(255) NOT NULL COMMENT 'Parent element ID',
  `api_key` varchar(255) NOT NULL COMMENT 'Organisation ID',
  `user_id` int(20) unsigned NOT NULL COMMENT 'Reviewer ID',
  `title` varchar(255) NOT NULL COMMENT 'Review title',
  `content` text NOT NULL COMMENT 'Review content',
  `posted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date posted',
  `tags` text NOT NULL COMMENT 'Item tags',
  PRIMARY KEY (`id`),
  KEY `NewIndex1` (`user_id`),
  CONSTRAINT `FK_reviews` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

/*Data for the table `reviews` */

/*Table structure for table `tags` */

DROP TABLE IF EXISTS `tags`;

CREATE TABLE `tags` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT 'Unique ID',
  `tagname` varchar(255) NOT NULL COMMENT 'Tag Name',
  `api_key` varchar(255) NOT NULL COMMENT 'Site specific key',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

/*Data for the table `tags` */

insert  into `tags`(`id`,`tagname`,`api_key`) values (1,'Tag 1','3a50fc16-d89d-11e0-a26b-4040b2058987'),(2,'Tag 2','3a50fc16-d89d-11e0-a26b-4040b2058987'),(3,'Tag 3','3a50fc16-d89d-11e0-a26b-4040b2058987'),(4,'Tag 4','3a50fc16-d89d-11e0-a26b-4040b2058987'),(5,'Tag 5','3a50fc16-d89d-11e0-a26b-4040b2058987'),(6,'Tag 6','3a50fc16-d89d-11e0-a26b-4040b2058987');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique record ID',
  `user_id` int(20) unsigned NOT NULL COMMENT 'Unique USER ID',
  `email` varchar(255) NOT NULL COMMENT 'user''s email address',
  `password` varbinary(255) NOT NULL COMMENT 'user''s password',
  `gname` varchar(255) NOT NULL COMMENT 'user''s first name',
  `fname` varchar(255) NOT NULL COMMENT 'user''s surname',
  `avatar` varchar(255) NOT NULL COMMENT 'user''s avatar',
  `verified` int(1) unsigned NOT NULL DEFAULT '0' COMMENT 'has the user verified their account?',
  `level` int(2) unsigned NOT NULL DEFAULT '0' COMMENT 'what level of access to grant',
  `joined` varchar(255) NOT NULL COMMENT 'when the user registered',
  `lastlogin` varchar(255) NOT NULL COMMENT 'when the user last logged in',
  `enabled` int(1) unsigned NOT NULL DEFAULT '1' COMMENT 'Flag for disabling account',
  PRIMARY KEY (`id`),
  KEY `NewIndex1` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `users` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
