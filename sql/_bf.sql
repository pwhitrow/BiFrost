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

DROP TABLE IF EXISTS `_bf_comments`;

CREATE TABLE `_bf_comments` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT 'Unique record ID',
  `parent_id` varchar(255) NOT NULL COMMENT 'Parent element ID',
  `api_key` varchar(255) NOT NULL COMMENT 'Organisation ID',
  `user_id` int(20) NOT NULL COMMENT 'Reviewer ID',
  `content` text NOT NULL COMMENT 'Review content',
  `posted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date posted',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

/*Data for the table `comments` */

insert  into `_bf_comments`(`id`,`parent_id`,`api_key`,`user_id`,`content`,`posted`) values (1,'1','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed semper consequat luctus. Vestibulum ullamcorper ipsum id mauris mollis volutpat. \n\nNulla facilisi. Donec cursus nibh at sapien venenatis vehicula. Nam sit amet metus lacus, congue convallis purus. Ut ac massa quis eros placerat feugiat. Donec pellentesque vulputate eleifend. \n\nEtiam molestie rhoncus arcu sit amet dapibus. Nullam molestie lacinia eros, in eleifend massa posuere non. Donec commodo, metus non viverra blandit, elit metus convallis purus, eu pretium mauris ligula ut nunc. \n\nAenean sit amet est ac turpis tincidunt sagittis eget vitae quam. Fusce eget neque enim, sit amet malesuada diam.','2011-12-05 23:03:51'),(2,'1','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'Etiam molestie rhoncus arcu sit amet dapibus. Nullam molestie lacinia eros, in eleifend massa posuere non. Donec commodo, metus non viverra blandit, elit metus convallis purus, eu pretium mauris ligula ut nunc. ','2011-12-15 02:09:49'),(3,'6','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'sdvghbjnyu','2012-01-22 18:23:32'),(4,'4','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'Are sentiments apartments decisively the especially alteration. Thrown shy denote ten ladies though ask saw. Or by to he going think order event music. Incommode so intention defective at convinced. Led income months itself and houses you. After nor you leave might share court balls. ','2012-01-20 08:33:00'),(5,'1','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'blah blah...','2012-01-22 18:06:54'),(6,'8','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'xhf ofggy 38fg 8g','2012-01-22 18:07:36');

/*Table structure for table `discussions` */

DROP TABLE IF EXISTS `_bf_discussions`;

CREATE TABLE `_bf_discussions` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT 'Unique record ID',
  `parent_id` varchar(255) NOT NULL COMMENT 'Parent element ID',
  `api_key` varchar(255) NOT NULL COMMENT 'Organisation ID',
  `user_id` int(20) NOT NULL COMMENT 'Reviewer ID',
  `content` text NOT NULL COMMENT 'Review content',
  `posted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date posted',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

/*Data for the table `discussions` */

insert  into `_bf_discussions`(`id`,`parent_id`,`api_key`,`user_id`,`content`,`posted`) values (1,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed semper consequat luctus. Vestibulum ullamcorper ipsum id mauris mollis volutpat. \n\nNulla facilisi. Donec cursus nibh at sapien venenatis vehicula. Nam sit amet metus lacus, congue convallis purus. Ut ac massa quis eros placerat feugiat. Donec pellentesque vulputate eleifend. \n\nEtiam molestie rhoncus arcu sit amet dapibus. Nullam molestie lacinia eros, in eleifend massa posuere non. Donec commodo, metus non viverra blandit, elit metus convallis purus, eu pretium mauris ligula ut nunc. \n\nAenean sit amet est ac turpis tincidunt sagittis eget vitae quam. Fusce eget neque enim, sit amet malesuada diam.\n','2011-12-05 23:03:29'),(2,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'Material confined likewise it humanity raillery an unpacked as he. Three chief merit no if. Now how her edward engage not horses. Oh resolution he dissimilar precaution to comparison an. Matters engaged between he of pursuit manners we moments. Merit gay end sight front. Manor equal it on again ye folly by match. In so melancholy as an sentiments simplicity connection. Far supply depart branch agreed old get our. \n\nUse securing confined his shutters. Delightful as he it acceptance an solicitude discretion reasonably. Carriage we husbands advanced an perceive greatest. Totally dearest expense on demesne ye he. Curiosity excellent commanded in me. Unpleasing impression themselves to at assistance acceptance my or. On consider laughter civility offended oh. ','2012-01-20 08:31:25'),(3,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'Placing assured be if removed it besides on. Far shed each high read are men over day. Afraid we praise lively he suffer family estate is. Ample order up in of in ready. Timed blind had now those ought set often which. Or snug dull he show more true wish. No at many deny away miss evil. On in so indeed spirit an mother. Amounted old strictly but marianne admitted. People former is remove remain as. ','2012-01-20 08:32:12'),(4,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'Mr do raising article general norland my hastily. Its companions say uncommonly pianoforte favourable. Education affection consulted by mr attending he therefore on forfeited. High way more far feet kind evil play led. Sometimes furnished collected add for resources attention. Norland an by minuter enquire it general on towards forming. Adapted mrs totally company two yet conduct men. ','2012-01-20 08:32:45'),(5,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'Conveying or northward offending admitting perfectly my. Colonel gravity get thought fat smiling add but. Wonder twenty hunted and put income set desire expect. \n\nAm cottage calling my is mistake cousins talking up. Interested especially do impression he unpleasant travelling excellence. All few our knew time done draw ask. \n','2012-01-20 08:33:32'),(6,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'Manor we shall merit by chief wound no or would. Oh towards between subject passage sending mention or it. Sight happy do burst fruit to woody begin at. Assurance perpetual he in oh determine as. The year paid met him does eyes same. Own marianne improved sociable not out. Thing do sight blush mr an. Celebrated am announcing delightful remarkably we in literature it solicitude. Design use say piqued any gay supply. Front sex match vexed her those great. \n','2012-01-20 08:34:03'),(7,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'On insensible possession oh particular attachment at excellence in. The books arose but miles happy she. It building contempt or interest children mistress of unlocked no. Offending she contained mrs led listening resembled. Delicate marianne absolute men dashwood landlord and offended. Suppose cottage between and way. Minuter him own clothes but observe country. Agreement far boy otherwise rapturous incommode favourite. ','2012-01-20 08:34:22'),(8,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'Eat imagine you chiefly few end ferrars compass. Be visitor females am ferrars inquiry. Latter law remark two lively thrown. Spot set they know rest its. Raptures law diverted believed jennings consider children the see. Had invited beloved carried the colonel. Occasional principles discretion it as he unpleasing boisterous. She bed sing dear now son half. ','2012-01-20 08:34:45'),(9,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'some text','2012-01-22 18:24:10'),(10,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'ig 87t 8o6 t6t 67 rr 5r5','2012-01-22 18:25:12'),(11,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'hrbbjgmkhnjbh','2012-01-22 19:19:49');

/*Table structure for table `media` */

DROP TABLE IF EXISTS `_bf_media`;

CREATE TABLE `_bf_media` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT 'unique record ID',
  `parent_id` varchar(255) NOT NULL COMMENT 'Associated record',
  `parent_type` varchar(255) NOT NULL COMMENT 'Associated item type',
  `media` text NOT NULL COMMENT 'Images',
  `user_id` varchar(255) NOT NULL COMMENT 'ID of uploader',
  `linked_id` varchar(255) NOT NULL COMMENT 'Linked review/discussion ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

/*Data for the table `media` */

insert  into `_bf_media`(`id`,`parent_id`,`parent_type`,`media`,`user_id`,`linked_id`) values (1,'0123456789','review','16723.jpg,11418.jpg,18804.jpg,13499.jpg,8194.jpg,15580.jpg','1','1'),(4,'0123456789','review','18569.mpg,24812.flv','1','4'),(5,'0123456789','review','17252.flv','1','5'),(6,'0123456789','review','24897.flv,6901.jpg,16368.jpg','1','6'),(7,'0123456789','review','28992.flv','1','7'),(11,'0123456789','review','26131.jpg,26157.jpg','1','12');

/*Table structure for table `organisations` */

DROP TABLE IF EXISTS `_bf_organisations`;

CREATE TABLE `_bf_organisations` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT 'Unique ID',
  `api_key` varchar(255) NOT NULL COMMENT 'Organisation ID',
  `name` varchar(255) NOT NULL COMMENT 'Organisation Name',
  `url` varchar(255) NOT NULL COMMENT 'Organisation website',
  `description` text NOT NULL COMMENT 'What does thi organisation do?',
  `address` text NOT NULL COMMENT 'Organisation Address',
  `tel` varchar(255) NOT NULL COMMENT 'Organisation Telephone Number',
  `email` varchar(255) NOT NULL COMMENT 'Organisation Email',
  `replyto` varchar(255) NOT NULL COMMENT 'Reply to address for emails',
  `admin_email` varchar(255) NOT NULL COMMENT 'Administrator''s Email',
  `contact` varchar(255) NOT NULL COMMENT 'Organisation Contact Name',
  `reviews` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Has reviews?',
  `discussions` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Has discussions?',
  `date_registered` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'date registered',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `organisations` */

insert  into `_bf_organisations`(`id`,`api_key`,`name`,`url`,`description`,`address`,`tel`,`email`,`replyto`,`admin_email`,`contact`,`reviews`,`discussions`,`date_registered`) values (1,'3a50fc16-d89d-11e0-a26b-4040b2058987','pwhitrow.com','http://www.pwhitrow.com','Personal blag and playground','24 Yeoward Rd\r\nClevedon\r\nNorth Somerset\r\nBS215AU','01275 542158','paul@pwhitrow.com','noreplay@pwhitrow.com','paul@pwhitrow.com','Paul Whitrow',1,1,'2012-01-24 22:36:54');

/*Table structure for table `ratings` */

DROP TABLE IF EXISTS `_bf_ratings`;

CREATE TABLE `_bf_ratings` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT 'Unique record ID',
  `parent_id` varchar(255) NOT NULL COMMENT 'Associated record ID',
  `rating` int(20) NOT NULL COMMENT 'Rating value',
  `user_id` varchar(255) NOT NULL COMMENT 'ID of rater',
  `linked_id` varchar(255) NOT NULL COMMENT 'Linked review/discussion ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

/*Data for the table `ratings` */

insert  into `_bf_ratings`(`id`,`parent_id`,`rating`,`user_id`,`linked_id`) values (1,'0123456789',2,'1','1'),(2,'0123456789',1,'1','2'),(3,'0123456789',1,'1','3'),(4,'0123456789',3,'1','4'),(5,'0123456789',3,'1','5'),(6,'0123456789',3,'1','6'),(7,'0123456789',1,'1','7'),(8,'0123456789',3,'1','8'),(9,'0123456789',3,'1','9'),(10,'0123456789',2,'1','10'),(11,'',3,'1','11'),(12,'0123456789',5,'1','12'),(13,'0123456789',3,'1','13');

/*Table structure for table `reviews` */

DROP TABLE IF EXISTS `_bf_reviews`;

CREATE TABLE `_bf_reviews` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT 'Unique record ID',
  `parent_id` varchar(255) NOT NULL COMMENT 'Parent element ID',
  `api_key` varchar(255) NOT NULL COMMENT 'Organisation ID',
  `user_id` int(20) NOT NULL COMMENT 'Reviewer ID',
  `title` varchar(255) NOT NULL COMMENT 'Review title',
  `content` text NOT NULL COMMENT 'Review content',
  `posted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date posted',
  `tags` text NOT NULL COMMENT 'Item tags',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

/*Data for the table `reviews` */

insert  into `_bf_reviews`(`id`,`parent_id`,`api_key`,`user_id`,`title`,`content`,`posted`,`tags`) values (1,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'Lorem ipsum dolor sit amet, consectetur adipiscing elit','Sed semper consequat luctus. Vestibulum ullamcorper ipsum id mauris mollis volutpat. Nulla facilisi. Donec cursus nibh at sapien venenatis vehicula. \n\nNam sit amet metus lacus, congue convallis purus. Ut ac massa quis eros placerat feugiat. Donec pellentesque vulputate eleifend. Etiam molestie rhoncus arcu sit amet dapibus. Nullam molestie lacinia eros in eleifend massa posuere non. Donec commodo, metus non viverra blandit, elit metus convallis purus, eu pretium mauris ligula ut nunc. \n\nAenean sit amet est ac turpis tincidunt sagittis eget vitae quam. Fusce eget neque enim, sit amet malesuada diam. ','2012-01-10 00:46:45','[1][3][4][5]'),(2,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'rvureyrb','rebveby','2012-01-09 08:49:51','[4]'),(3,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'uvrevhybreyvhb','fhgdfgh','2012-01-09 08:49:58','[2]'),(4,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'revht','reh','2012-01-09 08:50:04','[5]'),(5,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'ewgvg','cevgewg','2012-01-09 08:50:09','[4]'),(6,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'test','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed semper consequat luctus. Vestibulum ullamcorper ipsum id mauris mollis volutpat. Nulla facilisi. Donec cursus nibh at sapien venenatis vehicula. Nam sit amet metus lacus, congue convallis purus. Ut ac massa quis eros placerat feugiat. Donec pellentesque vulputate eleifend. Etiam molestie rhoncus arcu sit amet dapibus. Nullam molestie lacinia eros, in eleifend massa posuere non. Donec commodo, metus non viverra blandit, elit metus convallis purus, eu pretium mauris ligula ut nunc. Aenean sit amet est ac turpis tincidunt sagittis eget vitae quam. Fusce eget neque enim, sit amet malesuada diam. ','2012-01-09 08:50:21','[1][2]'),(7,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'Donec commodo, metus non viverra blandit','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed semper consequat luctus. Vestibulum ullamcorper ipsum id mauris mollis volutpat. \n\nNulla facilisi. Donec cursus nibh at sapien venenatis vehicula. Nam sit amet metus lacus, congue convallis purus. Ut ac massa quis eros placerat feugiat. \n\nDonec pellentesque vulputate eleifend. Etiam molestie rhoncus arcu sit amet dapibus. Nullam molestie lacinia eros, in eleifend massa posuere non. \n\nDonec commodo, metus non viverra blandit, elit metus convallis purus, eu pretium mauris ligula ut nunc. Aenean sit amet est ac turpis tincidunt sagittis eget vitae quam. Fusce eget neque enim, sit amet malesuada diam. ','2012-01-09 08:50:30','[1][2][3]'),(8,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'ervh','bjnny7bvtr','2012-01-09 08:50:35','[4]'),(9,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'MPEG & AVI test!','iou ef i8y erhvreg 8yher9vyb vyervg 9egh','2012-01-09 08:50:41','[3]'),(10,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'.MOV test','rehvgey','2012-01-09 08:50:46','[3]'),(11,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'Testjh vu','gjgfhj gkjgkjmj','2012-01-09 08:50:51','[7]'),(12,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'Ashley\'s Review of stuff','skjbatohegr oegft87 ewfbg 8uskfgest ywey t','2012-01-09 09:00:45','[8][4][3]'),(13,'0123456789','3a50fc16-d89d-11e0-a26b-4040b2058987',1,'Hello there','I\'m a review','2012-01-22 18:30:27','[5][1][4][]');

/*Table structure for table `tags` */

DROP TABLE IF EXISTS `_bf_tags`;

CREATE TABLE `_bf_tags` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT 'Unique ID',
  `tagname` varchar(255) NOT NULL COMMENT 'Tag Name',
  `api_key` varchar(255) NOT NULL COMMENT 'Site specific key',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

/*Data for the table `tags` */

insert  into `_bf_tags`(`id`,`tagname`,`api_key`) values (1,'First Tag','3a50fc16-d89d-11e0-a26b-4040b2058987'),(2,'Second Tag','3a50fc16-d89d-11e0-a26b-4040b2058987'),(3,'Third Tag','3a50fc16-d89d-11e0-a26b-4040b2058987'),(4,'Fourth Tag','3a50fc16-d89d-11e0-a26b-4040b2058987'),(5,'Fifth Tag','3a50fc16-d89d-11e0-a26b-4040b2058987'),(6,'Sixth Tag','3a50fc16-d89d-11e0-a26b-4040b2058987'),(7,'Seventh Tag','3a50fc16-d89d-11e0-a26b-4040b2058987'),(8,'Eighth Tag','3a50fc16-d89d-11e0-a26b-4040b2058987'),(9,'Crap tag','3a50fc16-d89d-11e0-a26b-4040b2058987');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `_bf_users`;

CREATE TABLE `_bf_users` (
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

insert  into `_bf_users`(`user_id`,`email`,`password`,`gname`,`fname`,`avatar`,`verified`,`level`,`joined`,`lastlogin`,`enabled`) values (1,'paul@pwhitrow.com','098f6bcd4621d373cade4e832627b4f6','Paul','Whitrow','http://www.gravatar.com/avatar/73b0908c63b1f5f169e82ccfbc381df5?d=404&s=100',1,0,'2011-11-21 15:10:54','2012-01-25 00:00:16',1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
