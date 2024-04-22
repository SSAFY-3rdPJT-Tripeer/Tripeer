# react-dockerizing/Dockerfile

# 1. Build stage: Node.js 기반으로 애플리케이션 빌드
FROM node:20-alpine as build

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사
COPY package*.json ./

# 의존성 패키지 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# 2. Serve stage: serve를 사용하여 애플리케이션 서빙
FROM node:20-alpine

# 시간대 설정
ENV TZ=Asia/Seoul

# 작업 디렉토리 설정
WORKDIR /app

# serve 패키지 전역 설치
RUN npm install -g serve

# build stage에서 빌드된 파일 복사
COPY --from=build /app/dist /app

# 3000번 포트 열기
EXPOSE 3000

# serve로 애플리케이션 서빙
CMD ["npm", "start"]
