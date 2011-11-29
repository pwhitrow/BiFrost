/*
SQLyog Ultimate v9.02 
MySQL - 5.5.8-log : Database - _bf
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
  `user_id` int(20) NOT NULL COMMENT 'Reviewer ID',
  `content` text NOT NULL COMMENT 'Review content',
  `posted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date posted',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `comments` */

/*Table structure for table `discussions` */

DROP TABLE IF EXISTS `discussions`;

CREATE TABLE `discussions` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT 'Unique record ID',
  `parent_id` varchar(255) NOT NULL COMMENT 'Parent element ID',
  `api_key` varchar(255) NOT NULL COMMENT 'Organisation ID',
  `user_id` int(20) NOT NULL COMMENT 'Reviewer ID',
  `content` text NOT NULL COMMENT 'Review content',
  `posted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date posted',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `discussions` */

/*Table structure for table `media` */

DROP TABLE IF EXISTS `media`;

CREATE TABLE `media` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT 'unique record ID',
  `parent_id` varchar(255) NOT NULL COMMENT 'Associated record',
  `parent_type` varchar(255) NOT NULL COMMENT 'Associated item type',
  `media` text NOT NULL COMMENT 'Images',
  `user_id` varchar(255) NOT NULL COMMENT 'ID of uploader',
  `linked_id` varchar(255) NOT NULL COMMENT 'Linked review/discussion ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `media` */

insert  into `media`(`id`,`parent_id`,`parent_type`,`media`,`user_id`,`linked_id`) values (1,'0123456789','review','16723.jpg,11418.jpg,18804.jpg,13499.jpg,8194.jpg,15580.jpg','1','1');

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
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT 'Unique record ID',
  `parent_id` varchar(255) NOT NULL COMMENT 'Associated record ID',
  `rating` int(20) NOT NULL COMMENT 'Rating value',
  `user_id` varchar(255) NOT NULL COMMENT 'ID of rater',
  `linked_id` varchar(255) NOT NULL COMMENT 'Linked review/discussion ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `ratings` */

insert  into `ratings`(`id`,`parent_id`,`rating`,`user_id`,`linked_id`) values (1,'0123456789',2,'1','1');

/*Table structure for table `reviews` */

DROP TABLE IF EXISTS `reviews`;

CREATE TABLE `reviews` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT 'Unique record ID',
  `parent_id` varchar(255) NOT NULL COMMENT 'Parent element ID',
  `api_key` varchar(255) NOT NULL COMMENT 'Organisation ID',
  `user_id` int(20) NOT NULL COMMENT 'Reviewer ID',
  `title` varchar(255) NOT NULL COMMENT 'Review title',
  `content` text NOT NULL COMMENT 'Review content',
  `posted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date posted',
  `tags` text NOT NULL COMMENT 'Item tags',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `reviews` */

insert  into `reviews`(`id`,`parent_id`,`api_key`,`user_id`,`title`,`content`,`posted`,`tags`) values (1,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'Lorem ipsum dolor sit amet, consectetur adipiscing elit','Sed semper consequat luctus. Vestibulum ullamcorper ipsum id mauris mollis volutpat. Nulla facilisi. Donec cursus nibh at sapien venenatis vehicula. \n\nNam sit amet metus lacus, congue convallis purus. Ut ac massa quis eros placerat feugiat. Donec pellentesque vulputate eleifend. Etiam molestie rhoncus arcu sit amet dapibus. Nullam molestie lacinia eros, in eleifend massa posuere non. Donec commodo, metus non viverra blandit, elit metus convallis purus, eu pretium mauris ligula ut nunc. \n\nAenean sit amet est ac turpis tincidunt sagittis eget vitae quam. Fusce eget neque enim, sit amet malesuada diam. ','2011-11-23 16:20:34','1,3,4,5');

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
  `user_id` int(6) NOT NULL AUTO_INCREMENT COMMENT 'Unique USER ID',
  `email` varchar(255) NOT NULL COMMENT 'user''s email address',
  `password` varbinary(255) NOT NULL COMMENT 'user''s password',
  `gname` varchar(255) NOT NULL COMMENT 'user''s first name',
  `fname` varchar(255) NOT NULL COMMENT 'user''s surname',
  `avatar` varchar(255) NOT NULL COMMENT 'user''s avatar',
  `verified` int(1) NOT NULL DEFAULT '0' COMMENT 'has the user verified their account?',
  `level` int(2) NOT NULL DEFAULT '0' COMMENT 'what level of access to grant',
  `joined` varchar(255) NOT NULL COMMENT 'when the user registered',
  `lastlogin` varchar(255) NOT NULL COMMENT 'when the user last logged in',
  `enabled` int(1) NOT NULL DEFAULT '1' COMMENT 'Flag for disabling account',
  PRIMARY KEY (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `users` */

insert  into `users`(`user_id`,`email`,`password`,`gname`,`fname`,`avatar`,`verified`,`level`,`joined`,`lastlogin`,`enabled`) values (1,'paul@pwhitrow.com','098f6bcd4621d373cade4e832627b4f6','Paul','Whitrow','http://www.gravatar.com/avatar/73b0908c63b1f5f169e82ccfbc381df5?d=404&s=100',1,0,'2011-11-21 15:10:54','2011-11-23 11:38:32',1);

/* Procedure structure for procedure `remove_review_associations` */

/*!50003 DROP PROCEDURE IF EXISTS  `remove_review_associations` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `remove_review_associations`(parent_id CHAR(36))
BEGIN
        DELETE FROM ratings WHERE parent_id IN (
            SELECT parent_id
            FROM reviews
            WHERE parent_id = parent_id
        );
END */$$
DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
