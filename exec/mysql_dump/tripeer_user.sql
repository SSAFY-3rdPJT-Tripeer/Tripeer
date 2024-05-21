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
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `provider` varchar(45) DEFAULT NULL,
  `provider_id` varchar(128) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `nickname` varchar(30) DEFAULT NULL,
  `birth` date DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `role` varchar(30) DEFAULT NULL,
  `style1` varchar(45) DEFAULT NULL,
  `style2` varchar(45) DEFAULT NULL,
  `style3` varchar(45) DEFAULT NULL,
  `is_online` bit(1) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','admin','부수환짱','admin','2024-04-18','https://tripeer207.s3.ap-northeast-2.amazonaws.com/ProfileImage/1.png','ROLE_ADMIN','문화시설','축제',NULL,_binary ''),(2,'admin','admin2','qwer123@naver.com','admin2','2024-04-17','https://k.kakaocdn.net/dn/UtBeL/btsF3XgHfLw/dQLKdZeqLedVPYKyqOk2P0/img_640x640.jpg','ROLE_USER','축제','패키지',NULL,_binary ''),(3,'google','107280915300627517754',NULL,'손동천',NULL,'https://lh3.googleusercontent.com/a/ACg8ocJu3OK_Rh1znT3LdR6c8L4YDTMe-S7dym2Be7g8RGpo3D1B-prO=s96-c','ROLE_USER',NULL,NULL,NULL,_binary '\0'),(6,'google','104824539890210532044','','진짜양건우','1999-02-21','https://tripeer207.s3.ap-northeast-2.amazonaws.com/ProfileImage/6/f89fd3cb-4fd7-41c7-9094-450ecdd7af26.png','ROLE_USER','문화시설','축제',NULL,_binary '\0'),(7,'naver','2sDHkhU_Yz1wJ_pZcZuOSuuMMHJGgcfeEW8c8yP3wl4','kij8025@naver.com','동천이에요','1996-02-28','https://ssl.pstatic.net/static/pwe/address/img_profile.png','ROLE_USER','관광지','축제',NULL,_binary '\0'),(14,'naver','JUnkEJa5vBYGETt5UfxbEnoyYYf7Dafv1a6MUvLYSQw',NULL,'가짜 양건우','1999-12-12','https://ssl.pstatic.net/static/pwe/address/img_profile.png','ROLE_USER','문화시설','쇼핑','음식점',_binary '\0'),(15,'kakao','3473668995','hmy940424@naver.com','난여행마스터','1994-04-24','https://k.kakaocdn.net/dn/UtBeL/btsF3XgHfLw/dQLKdZeqLedVPYKyqOk2P0/img_640x640.jpg','ROLE_USER','관광지','문화시설','음식점',_binary '\0'),(16,'google','106653190952714909766',NULL,'부수환','1998-11-27','https://lh3.googleusercontent.com/a/ACg8ocIlzK0ksvdE40H06ap5aZON7JLeyBDiUVDheGN9HB2_USrwfA=s96-c','ROLE_USER','음식점','문화시설',NULL,_binary '\0'),(19,'google','110063744898194171157',NULL,'하이건','1995-08-28','https://lh3.googleusercontent.com/a/ACg8ocKnDY5tYNcn_Qmh5VkUIvVclwGDDhvJXbtK9fnEhUPoQY-bbg=s96-c','ROLE_USER','축제',NULL,NULL,_binary '\0'),(20,'google','102394670570485169069','hhh259@naver.com','초코비코비','1996-09-30','https://tripeer207.s3.ap-northeast-2.amazonaws.com/ProfileImage/20/1c93fd1b-109d-4e12-8685-53131c8d64c3.png','ROLE_USER','관광지','음식점',NULL,_binary '\0'),(21,'kakao','3458812935',NULL,'부수환파이팅','1996-07-30','https://k.kakaocdn.net/dn/cAv0l6/btsGBguF2AU/OyVwdfB2xUoSHvR8Mkokwk/img_640x640.jpg','ROLE_USER','음식점','축제','문화시설',_binary '\0'),(22,'admin','admin3',NULL,'admin3','2024-04-18','https://lh3.googleusercontent.com/a/ACg8ocJu3OK_Rh1znT3LdR6c8L4YDTMe-S7dym2Be7g8RGpo3D1B-prO=s96-c','ROLE_ADMIN',NULL,NULL,NULL,_binary ''),(23,'admin','admin4',NULL,'admin4','2024-04-18','https://lh3.googleusercontent.com/a/ACg8ocJu3OK_Rh1znT3LdR6c8L4YDTMe-S7dym2Be7g8RGpo3D1B-prO=s96-c','ROLE_ADMIN',NULL,NULL,NULL,_binary ''),(24,'admin','admin5',NULL,'admin5','2024-04-18','https://tripeer207.s3.ap-northeast-2.amazonaws.com/ProfileImage/24.png','ROLE_ADMIN','문화시설','축제',NULL,_binary ''),(25,'admin','admin6','','admin6','2024-04-18','https://tripeer207.s3.ap-northeast-2.amazonaws.com/ProfileImage/25/3758115e-67f7-4699-83b1-52cb6183f35b.png','ROLE_ADMIN','관광지','문화시설','축제',_binary ''),(26,'admin','admin7','','admin7','2024-04-18','https://lh3.googleusercontent.com/a/ACg8ocJu3OK_Rh1znT3LdR6c8L4YDTMe-S7dym2Be7g8RGpo3D1B-prO=s96-c','ROLE_ADMIN',NULL,NULL,NULL,_binary ''),(27,'admin','admin8','','admin8','2024-04-18','https://lh3.googleusercontent.com/a/ACg8ocJu3OK_Rh1znT3LdR6c8L4YDTMe-S7dym2Be7g8RGpo3D1B-prO=s96-c','ROLE_ADMIN',NULL,NULL,NULL,_binary ''),(29,'kakao','3463523849','','이쑤신장군','1996-09-30','https://k.kakaocdn.net/dn/hr9Mx/btsGC3haFK9/r6Ip0lDmb6FBQ3aWIuluPK/img_640x640.jpg','ROLE_USER','관광지','축제',NULL,_binary '\0'),(30,'del','del','del','del','1996-09-30','https://phinf.pstatic.net/contact/20230723_122/1690069453143s3s4J_JPEG/14.jpg','ROLE_USER','관광지','레포츠',NULL,_binary '\0'),(31,'kakao','3474090669','mywe2365@gmail.com','중간양건우','1999-02-21','https://k.kakaocdn.net/dn/bcPI9Y/btq2y4HlgYq/XLmQYI78n3uHJTJenT20VK/img_640x640.jpg','ROLE_USER','레포츠','문화시설','축제',_binary '\0'),(32,'kakao','3452910272','qkslenltekfl@naver.com','형돈이가랩을한다홍홍','2004-04-04','https://k.kakaocdn.net/dn/UtBeL/btsF3XgHfLw/dQLKdZeqLedVPYKyqOk2P0/img_640x640.jpg','ROLE_USER','관광지','레포츠','쇼핑',_binary '\0'),(33,'google','105361585730160190172','hmy940424@gmail.com','유형민테스트계정','1944-04-04','https://lh3.googleusercontent.com/a/ACg8ocLC5_ymRd_R-wPN5UW9mtKCyQYtnOQumUWh2pT8Ovlru12BIQ=s96-c','ROLE_USER','관광지','문화시설','축제',_binary '\0'),(34,'naver','_ZRWW7wdJebGg0luSTQbK2zjQOo1HX4dVDqm0zicRLU','qkslenltekfl@naver.com','네이버확인','1994-04-24',NULL,'ROLE_USER','관광지','축제',NULL,_binary '\0'),(35,'naver','Mc2qlEGY3lgw2poKaLRYxFRVyoQbr6dC4bm7cQwWh_0',NULL,'가짜해건','1995-08-28','https://ssl.pstatic.net/static/pwe/address/img_profile.png','ROLE_USER','관광지','문화시설',NULL,_binary '\0'),(36,'naver','R5O6avCBKbRugdx02jTy1BaEI4HbtHrXmpISTkCztU4','nv_tkwjsrjatn6@naver.com','te','1980-08-08',NULL,'ROLE_USER','관광지',NULL,NULL,_binary '\0'),(37,'naver','Sdh2QXFLrHJZpWCDbfQWrwpXFzFOgppxOnspItI2kdE','hhh259@naver.com','현지혜짱','1996-09-30','https://phinf.pstatic.net/contact/20230723_122/1690069453143s3s4J_JPEG/14.jpg','ROLE_USER','관광지','레포츠','음식점',_binary '\0'),(38,'kakao','3480375626','dbswjddud@gmail.com','인동불주먹','1996-09-08','https://t1.kakaocdn.net/account_images/default_profile.jpeg.twg.thumb.R640x640','ROLE_USER','축제','레포츠','관광지',_binary '\0'),(39,'naver','-rQRQrxg0bjzB0J0BcY-BxkhexRnihfdZ424rARatkY','rndjdieo119@naver.com','수수환환','1998-11-27','https://ssl.pstatic.net/static/pwe/address/img_profile.png','ROLE_USER','관광지','문화시설','음식점',_binary '\0'),(40,'google','117433487300678396559','skdmlghsska@gmail.com','이희웅','2000-01-10','https://lh3.googleusercontent.com/a/ACg8ocJoHQCkWNvGxSVMfrze0KGv6uFEaNq82zCCW7zXign7o11LtSBl=s96-c','ROLE_USER','관광지','문화시설','축제',_binary '\0'),(41,'kakao','3481525312','@naver','희진','2000-01-01','https://k.kakaocdn.net/dn/nQd0J/btsGO9Vd21x/ZKBkJUP6nMpAZu8018SFZ1/img_640x640.jpg','ROLE_USER','관광지',NULL,NULL,_binary '\0'),(42,'kakao','3481573312','gigajini@mail.com','기가지니','2000-01-01','https://tripeer207.s3.ap-northeast-2.amazonaws.com/ProfileImage/42/3973cce9-7aa8-41f8-9346-49495e425c2d.png','ROLE_USER','레포츠','쇼핑',NULL,_binary '\0'),(43,'s','ss','sss','ffff','1999-01-01','https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/profileImg.png','ROLE_USER','관광지',NULL,NULL,_binary '\0'),(44,'kakao','3439159973','kij8025@naver.com','날놓아줘','1996-02-28','https://k.kakaocdn.net/dn/q0bzV/btsxkFEmp2M/jkr3CXK4OEU0xJjMseW7g0/img_640x640.jpg','ROLE_USER','문화시설','음식점',NULL,_binary '\0');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-17 13:11:51
