# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.32)
# Database: job_board_local
# Generation Time: 2022-11-13 21:55:44 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table jb_job_application_status
# ------------------------------------------------------------

DROP TABLE IF EXISTS `jb_job_application_status`;

CREATE TABLE `jb_job_application_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `jb_job_application_status` WRITE;
/*!40000 ALTER TABLE `jb_job_application_status` DISABLE KEYS */;

INSERT INTO `jb_job_application_status` (`id`, `name`, `createdAt`, `updatedAt`, `deletedAt`)
VALUES
	(1,'applied','2022-11-13 21:53:01','2022-11-13 21:53:01',NULL),
	(2,'interviewing','2022-11-13 21:53:01','2022-11-13 21:53:01',NULL),
	(3,'unsuccessful','2022-11-13 21:53:01','2022-11-13 21:53:01',NULL),
	(4,'successful','2022-11-13 21:53:01','2022-11-13 21:53:01',NULL),
	(5,'closed','2022-11-13 21:53:01','2022-11-13 21:53:01',NULL);

/*!40000 ALTER TABLE `jb_job_application_status` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table jb_job_applications
# ------------------------------------------------------------

DROP TABLE IF EXISTS `jb_job_applications`;

CREATE TABLE `jb_job_applications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `JobId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  `coveringLetter` text,
  `JobApplicationStatusId` int(11) DEFAULT NULL,
  `active` int(11) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `JobId` (`JobId`),
  KEY `UserId` (`UserId`),
  KEY `JobApplicationStatusId` (`JobApplicationStatusId`),
  CONSTRAINT `jb_job_applications_ibfk_4` FOREIGN KEY (`JobId`) REFERENCES `jb_jobs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `jb_job_applications_ibfk_5` FOREIGN KEY (`UserId`) REFERENCES `jb_users` (`id`),
  CONSTRAINT `jb_job_applications_ibfk_6` FOREIGN KEY (`JobApplicationStatusId`) REFERENCES `jb_job_application_status` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table jb_job_categories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `jb_job_categories`;

CREATE TABLE `jb_job_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `active` int(11) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `jb_job_categories` WRITE;
/*!40000 ALTER TABLE `jb_job_categories` DISABLE KEYS */;

INSERT INTO `jb_job_categories` (`id`, `name`, `description`, `active`, `createdAt`, `updatedAt`, `deletedAt`)
VALUES
	(1,'Design and UX','',1,'2022-11-12 20:04:41','2022-11-12 20:04:41',NULL),
	(2,'Programming and Technology','',1,'2022-11-12 20:04:52','2022-11-12 20:04:52',NULL);

/*!40000 ALTER TABLE `jb_job_categories` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table jb_jobs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `jb_jobs`;

CREATE TABLE `jb_jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `salary` float(11,2) NOT NULL,
  `salaryType` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `deadline` date NOT NULL,
  `active` int(11) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `jb_jobs` WRITE;
/*!40000 ALTER TABLE `jb_jobs` DISABLE KEYS */;

INSERT INTO `jb_jobs` (`id`, `title`, `salary`, `salaryType`, `description`, `deadline`, `active`, `createdAt`, `updatedAt`, `deletedAt`)
VALUES
	(1,'Web Developer',32000.67,'per-annum','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac tortor ut turpis ornare molestie pretium tempor nibh. In aliquam accumsan sollicitudin. In id lectus pretium, efficitur magna eget, gravida augue. Integer venenatis vulputate elit, et volutpat mauris feugiat ut. Fusce at luctus nisi. Integer interdum gravida dignissim. Quisque mattis ligula ut ex elementum consequat. Nulla sit amet leo a leo congue fringilla. Suspendisse euismod quis metus eu fringilla. Sed facilisis eleifend odio dictum rhoncus. Mauris lobortis sapien a elit ultricies euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc egestas at mi et dapibus. Duis rhoncus rutrum sem sit amet mollis. Nam magna ante, imperdiet vel nisl eget, sodales facilisis risus.','2022-12-31',0,'2022-11-12 22:45:30','2022-11-12 23:24:02',NULL),
	(2,'Web Designer',32000.68,'per-annum','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac tortor ut turpis ornare molestie pretium tempor nibh. In aliquam accumsan sollicitudin. In id lectus pretium, efficitur magna eget, gravida augue. Integer venenatis vulputate elit, et volutpat mauris feugiat ut. Fusce at luctus nisi. Integer interdum gravida dignissim. Quisque mattis ligula ut ex elementum consequat. Nulla sit amet leo a leo congue fringilla. Suspendisse euismod quis metus eu fringilla. Sed facilisis eleifend odio dictum rhoncus. Mauris lobortis sapien a elit ultricies euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc egestas at mi et dapibus. Duis rhoncus rutrum sem sit amet mollis. Nam magna ante, imperdiet vel nisl eget, sodales facilisis risus.','2023-01-15',0,'2022-11-12 22:46:23','2022-11-12 23:25:09',NULL),
	(3,'Lead Developer',45000.00,'per-annum','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac tortor ut turpis ornare molestie pretium tempor nibh. In aliquam accumsan sollicitudin. In id lectus pretium, efficitur magna eget, gravida augue. Integer venenatis vulputate elit, et volutpat mauris feugiat ut. Fusce at luctus nisi. Integer interdum gravida dignissim. Quisque mattis ligula ut ex elementum consequat. Nulla sit amet leo a leo congue fringilla. Suspendisse euismod quis metus eu fringilla. Sed facilisis eleifend odio dictum rhoncus. Mauris lobortis sapien a elit ultricies euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc egestas at mi et dapibus. Duis rhoncus rutrum sem sit amet mollis. Nam magna ante, imperdiet vel nisl eget, sodales facilisis risus.','2023-03-30',0,'2022-11-13 02:31:18','2022-11-13 02:31:18',NULL);

/*!40000 ALTER TABLE `jb_jobs` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table jb_jobs_in_categories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `jb_jobs_in_categories`;

CREATE TABLE `jb_jobs_in_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `JobId` int(11) DEFAULT NULL,
  `JobCategoryId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `JobId` (`JobId`),
  KEY `JobCategoryId` (`JobCategoryId`),
  CONSTRAINT `jb_jobs_in_categories_ibfk_11` FOREIGN KEY (`JobId`) REFERENCES `jb_jobs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `jb_jobs_in_categories_ibfk_12` FOREIGN KEY (`JobCategoryId`) REFERENCES `jb_job_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `jb_jobs_in_categories` WRITE;
/*!40000 ALTER TABLE `jb_jobs_in_categories` DISABLE KEYS */;

INSERT INTO `jb_jobs_in_categories` (`id`, `JobId`, `JobCategoryId`, `createdAt`, `updatedAt`, `deletedAt`)
VALUES
	(1,1,2,'2022-11-12 22:45:30','2022-11-12 22:45:30',NULL),
	(2,2,1,'2022-11-12 22:46:23','2022-11-12 22:46:23',NULL),
	(3,3,2,'2022-11-13 02:31:18','2022-11-13 02:31:18',NULL);

/*!40000 ALTER TABLE `jb_jobs_in_categories` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table jb_jobs_in_locations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `jb_jobs_in_locations`;

CREATE TABLE `jb_jobs_in_locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `JobId` int(11) DEFAULT NULL,
  `LocationId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `JobId` (`JobId`),
  KEY `LocationId` (`LocationId`),
  CONSTRAINT `jb_jobs_in_locations_ibfk_11` FOREIGN KEY (`JobId`) REFERENCES `jb_jobs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `jb_jobs_in_locations_ibfk_12` FOREIGN KEY (`LocationId`) REFERENCES `jb_locations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `jb_jobs_in_locations` WRITE;
/*!40000 ALTER TABLE `jb_jobs_in_locations` DISABLE KEYS */;

INSERT INTO `jb_jobs_in_locations` (`id`, `JobId`, `LocationId`, `createdAt`, `updatedAt`, `deletedAt`)
VALUES
	(1,1,1,'2022-11-12 22:45:30','2022-11-12 22:45:30',NULL),
	(2,1,2,'2022-11-12 22:45:30','2022-11-12 22:45:30',NULL),
	(3,2,1,'2022-11-12 22:46:23','2022-11-12 22:46:23',NULL),
	(4,2,2,'2022-11-12 22:46:23','2022-11-12 22:46:23',NULL),
	(5,3,1,'2022-11-13 02:31:18','2022-11-13 02:31:18',NULL),
	(6,3,2,'2022-11-13 02:31:18','2022-11-13 02:31:18',NULL);

/*!40000 ALTER TABLE `jb_jobs_in_locations` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table jb_locations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `jb_locations`;

CREATE TABLE `jb_locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `active` int(11) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `jb_locations` WRITE;
/*!40000 ALTER TABLE `jb_locations` DISABLE KEYS */;

INSERT INTO `jb_locations` (`id`, `name`, `description`, `active`, `createdAt`, `updatedAt`, `deletedAt`)
VALUES
	(1,'London Office - Camden','A spacious and vibrant office in Camden',1,'2022-11-12 20:04:58','2022-11-12 20:04:58',NULL),
	(2,'Manchester Office - Northern Quater','A spacious and vibrant office in the Northern Quater',1,'2022-11-12 20:05:19','2022-11-12 20:05:19',NULL);

/*!40000 ALTER TABLE `jb_locations` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table jb_users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `jb_users`;

CREATE TABLE `jb_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int(11) NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `middleNames` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `jb_users` WRITE;
/*!40000 ALTER TABLE `jb_users` DISABLE KEYS */;

INSERT INTO `jb_users` (`id`, `email`, `password`, `role`, `createdAt`, `updatedAt`, `deletedAt`, `title`, `firstName`, `surname`, `middleNames`)
VALUES
	(1,'luke@luke.com','$2b$08$thaLY0k1L.iZz5wzTMStOOXefRP9T8BZsNAdALJPaa9uQmEQPKeCu',3,'2022-11-12 20:03:53','2022-11-12 20:03:53',NULL,NULL,NULL,NULL,NULL);

/*!40000 ALTER TABLE `jb_users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
