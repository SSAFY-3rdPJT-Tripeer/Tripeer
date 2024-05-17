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
-- Table structure for table `city`
--

DROP TABLE IF EXISTS `city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `city` (
  `city_id` int NOT NULL,
  `city_name` varchar(30) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `city_img` varchar(255) DEFAULT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  PRIMARY KEY (`city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city`
--

LOCK TABLES `city` WRITE;
/*!40000 ALTER TABLE `city` DISABLE KEYS */;
INSERT INTO `city` VALUES (1,'서울특별시','과거와 현재가 공존하며 하루가 다르게 변하는 서울을 여행하는 일은 매일이 새롭다. 도시 한복판에서 600년의 역사를 그대로 안고 있는 아름다운 고궁들과 더불어 대한민국의 트렌드를 이끌어나가는 예술과 문화의 크고 작은 동네들을 둘러볼 수 있는 서울은 도시 여행에 최적화된 장소다.','https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQA8mp4-ebH6BfY5H7pgjA_D2UlPvCBURBDQfBjt___kqiZNYOx4E0Dm1rTSBPCfuuYbB9Ep6Y5vMEHBtdSED6_iifxZEFVY3RemQgvWg',37.566535,126.9779692),(2,'인천','살짝 비릿한 바다향이 매력적인 인천광역시. 지리적 특징을 잘 이용하여 내륙과 해안 지역의 관광이 두루 발달한 곳이다. 대표적인 해양관광지로는 을왕리 해수욕장을 비롯해 문화의 거리가 갖춰진 월미도 등이 있으며, 한국 속 작은 중국이라 불리는 차이나타운도 인천 여행지로 손꼽힌다. 이 외에도 인천 각처에 오랜 역사 유물들이 산재해 있어 역사를 테마로 여행 코스를 잡아보는 것도 좋다.','https://lh5.googleusercontent.com/p/AF1QipP8nbtYLCYzwpxmMSB-UeWKfZ4IeEb_MMYdflGi=w675-h390-n-k-no',37.4562557,126.7052062),(3,'대전','다양한 테마 여행이 가능한 대전광역시. 맨발로 걸을 수 있는 계족산 황톳길은 온몸으로 자연을 느끼는 여행을 할 수 있으며, 대전 근현대 전시관과 남간정사 등 대전에 있는 역사 문화 공간을 코스로 잡아도 좋다. 아이들이 좋아하는 동물원이 있는 오월드와 가볍게 산책하기 좋은 유림공원도 있어 주말 가족 나들이 코스로도 손색이 없다.','https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcSBBH0wLx8T4487PvikfdsMF1V4pFt-Nn_XtiEPD-Ic0b-vOimNxwmV3cpqeFvSDAllyCoGRnOWR5XeRsXpltwmTh86eMbdAFFADbJ_YQ',36.3504119,127.3845475),(4,'대구','우리나라에서 가장 더운 지역 대구. 하지만 매년 여름 열리는 치맥 페스티벌과 함께라면 더위도 문제없다. 놀이동산 이월드는 가족과 함께 나들이하기에 좋으며, 두류공원도 산책코스로 제격! 음악 분수쇼로 유명한 수성못과 독특한 외관이 인상적인 전시공간 디아크는 대구의 야경 명소로 손꼽힌다. 우리나라 3대 시장인 서문시장 야시장도 대구의 대표 핫플레이스!','https://lh5.googleusercontent.com/p/AF1QipOwoD8xgxPFObnzOUg9t6Lm55tRnECcAEnSxYeg=w675-h390-n-k-no',35.8714354,128.601445),(5,'광주','문화예술의 중심지라 불리는 광주광역시. 예향의 본고장답게 \'맛\'과 \'멋\'이 조화를 이루며 남도의 문화를 이끌어 왔다고 해도 과언이 아니다. 광주의 대표 축제인 광주비엔날레를 중심으로 광주김치대축제, 광주국제영화제 등 5대 축제를 즐길 수 있을 뿐 아니라 문화예술시장으로 재탄생한 대인시장의 야시장에서는 밤여행의 묘미를 즐길 수 있다.','https://lh5.googleusercontent.com/p/AF1QipOl8-euekhnvXyoL_zR6AM8E_y2D2HGKPO3ZQLb=w675-h390-n-k-no',35.1595454,126.8526012),(6,'부산','우리나라 제2의 수도 부산광역시. 부산 대표 관광지로 손꼽히는 해운대는 밤에는 마린시티의 야경이 더해져 더욱 화려한 해변이 된다. 감천문화마을은 사진 찍기에 좋으며, 매해 가을마다 개최되는 아시아 최대 규모의 영화제인 부산국제영화제와 함께 부산의 구석구석을 즐겨보는 것도 좋다. 전통시장 투어가 있을 만큼 먹거리가 가득한 부산의 맛기행은 필수!','https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTFF_JfsANS6ZhWW5DzJjgpdHXSx4INi-iGxs4NNYz9hej97gQwLNmeq4VCoxgk3Dbb0Iu7DH5EfSlwhNpzVYnH9wHUimYU0Z0_vFfhjQ',35.1795543,129.0756416),(7,'울산','울산시는 2017년을 \'울산 방문의 해\'로 지정하고 더욱 풍성한 볼거리를 준비했다. 5월 태화강 봄꽃 대향연을 시작으로 국내 유일의 고래축제 등 다양한 축제가 기다리고 있다. 일출이 가장 빨리 시작되는 간절곶과 해안을 따라 산책하기 좋은 대왕암 공원은 울산의 대표 명소다. 아름다운 생태공원으로 재탄생한 태화강을 따라 대나무가 시원하게 뻗어있는 십리대숲길을 산책할 수 있으며, 태화강대공원을 좀 더 제대로 감상하고 싶다면 태화강 전망대를 이용하면 된다.','https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQ49wnh3ZwkLlnl7Ld-FSP1mAj6WV-XNrybxyr0vKRFk8hHPKVpcS8VJn3oNw4Tg4qTgj0sqKsYkHlnC72e1XnfiDsKz6I9PIp0RDiEsQ',35.5383773,129.3113596),(8,'세종특별자치시','주말 여행지로 좋은 세종특별자치시. 금강수목원은 다양한 식물을 보유하고 있어 아이들을 위한 교육장으로도 좋으며, 딸기 체험이 가능한 농장도 있어 주말 가족 나들이 장소로 제격이다. 세종 호수공원은 여유로운 산책을 즐길 수 있어 데이트 코스로 좋다.','https://lh5.googleusercontent.com/p/AF1QipORnWYjnkWKm8ioXMNbq6dMIN1n9PMz7B9Xyky4=w675-h390-n-k-no',36.5040736,127.2494855),(31,'경기도','문화· 예술· 레저 등 모든 걸 아우르는 경기도. 서울 근교에 위치해 접근성이 좋고 다양한 문화생활을 즐길 수 있어서 주말을 이용한 나들이가 가능하다. 아울렛이 위치한 파주와 여주는 문화 복합 도시로 풍부한 볼거리를 제공하고 있다. 양평이나 가평은 자연과 함께 여유로운 하루를 만끽하고 싶은 이들에게 제격이다.','https://lh5.googleusercontent.com/p/AF1QipPMWP178cn2KZqQB5nd60HJLKKCe_fTNO0EvkfW=w675-h390-n-k-no',37.4138,127.5183),(32,'강원도','빼어난 자연경관으로 유명한 강원도. 래프팅, 패러글라이딩, 라이딩, 스키 등 계절마다 자연을 누리며 각종 레저스포츠를 즐길 수 있다. 그뿐만 아니라, 연말연시가 되면 가장 먼저 떠오르는 정동진은 해돋이 명소로 손꼽히며, 배를 타고 들어가야 하는 남이섬 곳곳에는 운치 있는 메타세콰이어길이 있어 데이트 코스로도 유명하다. 호수를 둘러싼 자전거 길을 따라 느긋하게 춘천을 둘러보는 여행도 추천한다.','https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcR0Sn4RcYnJ-SoTYwe-9X1mYI_iPZdVf9KJhVr8nhEIDNYcJRBKzxip_XivheFch8eET7IHnuQ6rTAhsORlgBhj791ci_Jl02BWsy-swA',37.8228,128.1555),(33,'충청북도','자연을 만끽할 수 있는 충청북도. 충북 대표 여행지 단양은 드라이브 코스로 좋은 충주호에서 하늘을 나는 패러글라이딩이 인기이며, 도담삼봉은 해 질 녘 풍경이 아름답다. 가장 오래된 저수지 의림지가 있는 제천은 출사지로 알려졌으며, 전국 최고의 둘레길이 있는 괴산군의 산막이 옛길을 걸어보는 것도 추천한다.','https://lh5.googleusercontent.com/p/AF1QipMdcl03KHuS9CSkBlgg_1RWphxkE9ezMFCm2XyT=w675-h390-n-k-no',36.8,127.7),(34,'충청남도','백제의 발자취를 고스란히 안고 있는 충청남도. 백제의 수도였던 공주와 부여가 위치해 있어 역사적인 사찰과 문화재를 곳곳에서 만날 수 있다. 또한 당진 왜목마을에서는 서해의 일출을 볼 수 있고, 보령에서는 세계 각지에서 온 여행객들과 온몸에 진흙을 묻히며 마음껏 놀 수 있는 머드축제를 즐기는 색다른 경험을 할 수 있다.','https://lh5.googleusercontent.com/p/AF1QipNGiRsS_hEEL7vpP7R11uy7yUGO-npa3IY6PL5W=w675-h390-n-k-no',36.5184,126.8),(35,'경상북도','민족문화 창달의 대표 경상북도. 신라 천년 고도의 숨결을 간직한 경주를 시작으로 유네스코 세계문화유산에 등재된 안동 하회마을까지. 우리나라의 오랜 전통과 역사의 때가 묻은 지역을 방문하고 싶다면 경상북도만한 곳도 없다. 기상이변으로 방문 자체가 쉽지 않은 울릉도와 독도에도 천혜 절경의 우리땅을 밟아볼 수 있는 기회가 기다리고 있다.','https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcS0YLHz4q9xr--pyg1hoaU2GpWVsyIgs2dBb2qZu7MPq1o38Jlp1XGe_r1hKtRb688Cla4sVNhrQPv4NRpU6Bx8EM95FPjWCwyCMHU8sA',36.4919,128.8889),(36,'경상남도','산악과 해상관광을 함께 누릴 수 있는 경상남도. 통영과 남해를 중심으로 위치한 해상공원은 섬과 바다의 두 가지의 매력을 모두 느낄 수 있어 경상남도 대표 여행지로 손꼽힌다. 봄에는 하얀 눈꽃이 흩날리는 하동벚꽃축제와 순매원 매화축제가, 겨울에는 거제도를 빨갛게 물들이는 동백축제가 열린다. 이외에도 온천여행과 도자기 체험, 딸기 체험 등 다양한 경험이 가능하다.','https://lh5.googleusercontent.com/p/AF1QipOieEWF6JLIqlrEflaNjxU5T4xi8jtKkgkSfu5U=w675-h390-n-k-no',35.4606,128.2132),(37,'전라북도','한국 문화의 원형이 가장 잘 보존되어 있는 전북특별자치도. 도심 중심에 한옥마을을 품고 있는 전주는 전북특별자치도의 대표 관광지이다. 전주의 전통음식 비빔밥을 맛보는 건 필수이며, 한복 체험과 함께 한옥 마을을 걸어보는 것도 하나의 재미! 춘향과 몽룡의 사랑이 시작된 광한루가 있는 남원과 일제 시대의 근대 건축 기행이 가능한 군산과 익산을 함께 여행해보는 것도 좋다.','https://lh5.googleusercontent.com/p/AF1QipPMigHXmj9NPNsJlo7TlgJO8Ta4DbZHnV64CmU=w675-h390-n-k-no',35.7175,127.153),(38,'전라남도','기개 높은 대나무숲을 가진 담양, 보푸른 녹차밭의 보성, 이름만으로도 좋은 여수 밤바다까지 각 지역의 전통과 고유색이 잘 살아있는 전라남도. 순천만의 지평선 끝까지 황금빛으로 물든 갈대밭을 구경하고 싶다면 11월 초에 열리는 순천만갈대축제를 방문해보는 것을 추천한다. 해상관광부터 산악관광까지 두루 갖춘 전라남도에서 색다른 자연의 매력에 흠뻑 빠져보길 바란다.','https://lh5.googleusercontent.com/p/AF1QipMReaQurbH1Z5Gv3EtYL60rufcbaYs4vEIRH2ZQ=w675-h390-n-k-no',34.8679,126.991),(39,'제주도','섬 전체가 하나의 거대한 관광자원인 제주도. 에메랄드빛 물빛이 인상적인 협재 해수욕장은 제주 대표 여행지며, 파도가 넘보는 주상절리와 바다 위 산책로인 용머리 해안은 제주에서만 볼 수 있는 천혜의 자연경관으로 손꼽힌다. 드라마 촬영지로 알려진 섭지코스는 꾸준한 사랑을 받고 있으며 한라봉과 흑돼지, 은갈치 등은 제주를 대표하는 음식이다.','https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTzE4_RYUCn-k0sb_wiO3sRCIvnxOq3b0U8pCgiWeMz5qxYyDbRxFmy0wmv-wE6fLXuB6rC4B1-j7u27attTsFDkIsmCSLs6Bb_PUl5L1w',33.4890113,126.4983023);
/*!40000 ALTER TABLE `city` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-17 13:11:52
