CREATE DATABASE  IF NOT EXISTS `tripeer` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `tripeer`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: k10d207.p.ssafy.io    Database: tripeer
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `plan_town`
--

DROP TABLE IF EXISTS `plan_town`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan_town` (
  `plan_town_id` bigint NOT NULL AUTO_INCREMENT,
  `plan_id` bigint NOT NULL,
  `city_id` int DEFAULT NULL,
  `town_id` int DEFAULT NULL,
  `city_only_id` int DEFAULT NULL,
  PRIMARY KEY (`plan_town_id`),
  KEY `FK_plan_TO_plan_town_1` (`plan_id`),
  KEY `FK_town_TO_plan_town_1` (`city_id`),
  KEY `FK_town_TO_plan_town_2` (`town_id`),
  KEY `FK_city_TO_plan_town_1` (`city_only_id`),
  CONSTRAINT `FK_city_TO_plan_town_1` FOREIGN KEY (`city_only_id`) REFERENCES `city` (`city_id`),
  CONSTRAINT `FK_plan_TO_plan_town_1` FOREIGN KEY (`plan_id`) REFERENCES `plan` (`plan_id`),
  CONSTRAINT `FK_town_TO_plan_town_1` FOREIGN KEY (`city_id`) REFERENCES `town` (`city_id`),
  CONSTRAINT `FK_town_TO_plan_town_2` FOREIGN KEY (`town_id`) REFERENCES `town` (`town_id`)
) ENGINE=InnoDB AUTO_INCREMENT=317 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan_town`
--

LOCK TABLES `plan_town` WRITE;
/*!40000 ALTER TABLE `plan_town` DISABLE KEYS */;
INSERT INTO `plan_town` VALUES (162,150,NULL,NULL,3),(163,151,NULL,NULL,39),(164,152,NULL,NULL,1),(165,153,NULL,NULL,1),(166,154,NULL,NULL,1),(167,155,3,3,NULL),(168,156,NULL,NULL,6),(169,157,NULL,NULL,6),(170,158,3,4,NULL),(171,159,37,12,NULL),(172,160,3,2,NULL),(173,161,NULL,NULL,1),(174,162,NULL,NULL,7),(175,163,NULL,NULL,1),(176,164,6,3,NULL),(177,164,6,7,NULL),(178,165,NULL,NULL,1),(179,166,NULL,NULL,1),(180,167,NULL,NULL,3),(181,168,NULL,NULL,39),(182,169,6,1,NULL),(183,170,31,30,NULL),(184,171,1,1,NULL),(185,172,NULL,NULL,1),(186,173,NULL,NULL,1),(187,174,4,1,NULL),(188,175,31,30,NULL),(189,176,31,30,NULL),(190,177,NULL,NULL,1),(191,178,31,30,NULL),(192,179,NULL,NULL,1),(193,180,35,2,NULL),(194,181,1,1,NULL),(195,182,31,30,NULL),(196,183,NULL,NULL,1),(197,184,31,30,NULL),(198,185,31,30,NULL),(199,186,32,2,NULL),(200,187,NULL,NULL,1),(201,188,NULL,NULL,1),(202,189,NULL,NULL,1),(203,190,35,4,NULL),(204,191,1,1,NULL),(205,192,37,12,NULL),(206,193,31,30,NULL),(207,194,6,16,NULL),(208,195,1,19,NULL),(209,196,3,1,NULL),(210,197,31,30,NULL),(211,198,NULL,NULL,1),(212,198,1,2,NULL),(213,198,6,1,NULL),(214,198,6,3,NULL),(215,198,6,5,NULL),(216,198,6,7,NULL),(217,198,NULL,NULL,6),(218,199,6,1,NULL),(219,199,6,3,NULL),(220,199,6,4,NULL),(221,199,NULL,NULL,1),(222,199,1,3,NULL),(223,200,31,30,NULL),(224,201,NULL,NULL,1),(225,201,1,1,NULL),(226,201,6,1,NULL),(227,201,6,6,NULL),(228,201,NULL,NULL,6),(229,202,2,3,NULL),(230,203,2,3,NULL),(231,204,31,5,NULL),(232,205,2,3,NULL),(233,206,NULL,NULL,1),(234,207,NULL,NULL,1),(235,207,NULL,NULL,6),(236,208,NULL,NULL,6),(237,208,NULL,NULL,1),(238,209,NULL,NULL,1),(239,209,NULL,NULL,6),(240,210,NULL,NULL,6),(241,210,NULL,NULL,1),(242,211,NULL,NULL,1),(243,211,NULL,NULL,6),(244,212,NULL,NULL,1),(245,213,NULL,NULL,1),(246,213,NULL,NULL,6),(247,214,37,12,NULL),(248,215,35,1,NULL),(249,216,NULL,NULL,1),(250,217,NULL,NULL,6),(251,217,NULL,NULL,1),(252,218,NULL,NULL,1),(253,218,NULL,NULL,6),(254,219,32,1,NULL),(255,220,35,23,NULL),(256,220,35,2,NULL),(257,220,NULL,NULL,7),(258,221,NULL,NULL,32),(259,222,33,2,NULL),(260,223,34,12,NULL),(261,224,34,12,NULL),(262,225,NULL,NULL,6),(263,226,NULL,NULL,6),(264,226,36,1,NULL),(265,226,NULL,NULL,7),(266,227,36,1,NULL),(267,227,NULL,NULL,7),(268,227,NULL,NULL,6),(269,228,36,1,NULL),(270,228,NULL,NULL,6),(271,228,NULL,NULL,7),(272,229,36,1,NULL),(273,229,NULL,NULL,6),(274,229,NULL,NULL,7),(275,230,36,1,NULL),(276,230,NULL,NULL,6),(277,230,NULL,NULL,7),(278,231,36,1,NULL),(279,231,NULL,NULL,6),(280,231,NULL,NULL,7),(281,232,32,7,NULL),(282,232,32,10,NULL),(283,233,NULL,NULL,6),(284,234,NULL,NULL,6),(285,235,36,1,NULL),(286,235,NULL,NULL,6),(287,235,NULL,NULL,7),(288,236,NULL,NULL,4),(289,237,5,2,NULL),(290,238,31,30,NULL),(291,239,6,1,NULL),(292,240,NULL,NULL,6),(293,241,36,1,NULL),(294,242,36,1,NULL),(295,243,NULL,NULL,1),(296,244,36,1,NULL),(297,245,36,1,NULL),(298,245,NULL,NULL,6),(299,245,NULL,NULL,7),(300,246,36,1,NULL),(301,246,NULL,NULL,7),(302,246,NULL,NULL,6),(303,247,36,1,NULL),(304,248,36,1,NULL),(305,249,36,1,NULL),(306,250,36,1,NULL),(307,251,NULL,NULL,1),(308,252,NULL,NULL,1),(310,254,36,1,NULL),(311,255,36,1,NULL),(312,256,NULL,NULL,1),(313,257,NULL,NULL,1),(314,258,NULL,NULL,1),(315,259,NULL,NULL,1),(316,260,NULL,NULL,1);
/*!40000 ALTER TABLE `plan_town` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-17 13:11:54