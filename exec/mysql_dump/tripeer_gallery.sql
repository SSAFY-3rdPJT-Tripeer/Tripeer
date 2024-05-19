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
-- Table structure for table `gallery`
--

DROP TABLE IF EXISTS `gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery` (
  `gallery_id` bigint NOT NULL AUTO_INCREMENT,
  `plan_day_id` bigint NOT NULL,
  `url` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`gallery_id`),
  KEY `FK_plan_day_TO_gallery_1` (`plan_day_id`),
  CONSTRAINT `FK_plan_day_TO_gallery_1` FOREIGN KEY (`plan_day_id`) REFERENCES `plan_day` (`plan_day_id`)
) ENGINE=InnoDB AUTO_INCREMENT=214 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery`
--

LOCK TABLES `gallery` WRITE;
/*!40000 ALTER TABLE `gallery` DISABLE KEYS */;
INSERT INTO `gallery` VALUES (163,482,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/20/20240608/a867c477-8f4f-496e-9487-bbada5634cc6KakaoTalk_20240414_204540425_02.jpg'),(164,482,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/20/20240608/532d9abd-5817-4c34-9309-a35a3ba4232fKakaoTalk_20240414_204540425_03.jpg'),(165,482,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/20/20240608/410b6e53-99b0-4b17-b59a-493e66462b46KakaoTalk_20240414_204540425_04.jpg'),(166,482,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/20/20240608/6a2650d4-3105-4715-a302-827db85b726fKakaoTalk_20240414_204540425_06.jpg'),(167,483,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/20/20240609/f81eb31d-0413-4c5d-8909-bc072dd8a22aKakaoTalk_20240211_003923237.jpg'),(168,483,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/20/20240609/ae46ba15-efea-42fa-be08-5176cb9daeafKakaoTalk_20240211_003923237_01.jpg'),(169,483,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/20/20240609/1d021290-bad6-4aad-b96f-e148d4bebec7KakaoTalk_20240211_003923237_02.jpg'),(170,483,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/20/20240609/4d83b820-8688-477b-be95-d111a8fd827cKakaoTalk_20240211_003923237_03.jpg'),(171,492,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/41/20240518/71d86685-3925-4fc3-bd8c-5146b98f9eablullu_ham.png'),(172,492,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/41/20240518/c951b03b-9b7f-49f8-a3fb-a5469cbc98a6noonduck_01.png'),(173,492,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/41/20240518/cc9bba99-736e-4596-9079-3d2c7785ebebloopy_3.png'),(174,492,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/41/20240518/a24b2c43-f814-426b-8438-6c27144de249wink_last.png'),(175,492,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/41/20240518/3ed724bf-d03c-47dc-af18-4916ae6fa8e4고뇌.png'),(176,500,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/42/20240514/c0419a66-5037-4b6f-9a95-4e6840823036test_img.png'),(177,500,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/41/20240514/35b4c209-cfd1-4f79-b9a9-16640e77a27bggul_dm2.png'),(178,515,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/32/20240514/685c4448-7e91-449a-8a3f-dc7124d4f430e8 유형민 반명re (1).jpg'),(179,544,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240613/aa4659dd-eb06-4cb9-833f-29783acb61b68C1D373B-85E9-431D-8405-DED5964E4357.jpg'),(180,544,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240613/781f2fe5-a59b-4947-8732-c672ba9d6b71증명사진_page-0001.jpg'),(181,544,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240613/085af20c-5402-45a7-867b-4ec0fd3fe133증사.jpg'),(185,544,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240613/374dfedf-bb72-4795-91b5-8c5dcc1b8af28C1D373B-85E9-431D-8405-DED5964E4357.jpg'),(188,545,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240614/4431ca4a-b285-4ccd-8bf9-710ff6eee7c7defaultProfile.png'),(190,545,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240614/14f10352-3a23-4b43-b5b5-406fbd69334eKakaoTalk_20240414_204540425.jpg'),(191,545,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240614/91684825-c348-49a7-be63-c15d186b2393KakaoTalk_20240414_204540425_01.jpg'),(192,545,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240614/8957c8cd-ed4e-42d7-8c97-c6b97f785483KakaoTalk_20240414_204540425_02.jpg'),(193,545,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240614/c1bbf0b9-598e-4255-99ab-bc36f3b63fa0KakaoTalk_20240414_204540425_03.jpg'),(194,545,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240614/0db8ee82-2476-4db9-a4f4-43416af2b100KakaoTalk_20240414_204540425_04.jpg'),(195,545,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240614/5282cd96-1feb-46c3-80f1-dd4c4b6c74e7KakaoTalk_20240414_204540425_05.jpg'),(196,545,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240614/448abe2a-8748-4c3e-b8f8-675c6c119528KakaoTalk_20240414_204540425_06.jpg'),(197,545,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240614/63caa548-810a-4a86-8d48-e7ce473985faKakaoTalk_20240414_204540425_07.jpg'),(198,545,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240614/1b649ec4-385e-449b-92d8-791d2e94aa2cKakaoTalk_20240414_204540425_08.jpg'),(199,545,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240614/17737ec8-5616-4262-99de-c053b8c08ff9KakaoTalk_20240414_204540425_09.jpg'),(200,545,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240614/7f9c9b9a-d58d-4e10-9d9c-81541343f6c9KakaoTalk_20240414_204540425_10.jpg'),(201,545,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240614/3c886ea2-eb4a-4e71-ba56-857a35b2c72fKakaoTalk_20240414_204540425_11.jpg'),(202,545,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240614/1515be09-885f-49d2-a209-9834f1dbedffKakaoTalk_20240414_204540425_12.jpg'),(203,545,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240614/b73eb39f-d6ba-4543-85ec-d023eafbc479KakaoTalk_20240414_205041819.jpg'),(204,545,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240614/5bbee8f6-aa39-4f8c-9d70-86ad1799ead4KakaoTalk_20240414_205041819_01.jpg'),(205,545,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240614/6c65f372-de75-43e6-a629-6e9dd8136b6eKakaoTalk_20240414_205041819_02.jpg'),(206,545,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240614/8e275014-2e7f-4f6e-b990-0f2b272b17f3KakaoTalk_20240414_205041819_03.jpg'),(207,545,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240614/e613adda-c92b-42ab-8f1a-57ea0046a9faKakaoTalk_20240414_205041819_04.jpg'),(208,545,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/2/20240614/a44fd7da-3ed6-446d-9ae7-ff26f5718c44KakaoTalk_20240414_205041819_05.jpg'),(209,619,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/25/20240523/036a629c-72e9-4abb-a7a0-bb2ef9d5745fKakaoTalk_20240414_204540425_11.jpg'),(210,619,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/25/20240523/59bab87c-d94e-4b8f-a156-0e0f8a4ca09cKakaoTalk_20240414_204540425_02.jpg'),(211,619,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/25/20240523/ed277cb3-3d4f-4d3b-ba1b-d93b73144e07KakaoTalk_20240414_204540425_03.jpg'),(213,619,'https://tripeer207.s3.ap-northeast-2.amazonaws.com/Gallery/25/20240523/c5ae5ecb-bbff-44f8-8a2f-bd64d725f89aKakaoTalk_20240414_204540425_06.jpg');
/*!40000 ALTER TABLE `gallery` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-17 13:11:58
