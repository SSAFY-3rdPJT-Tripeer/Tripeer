# Node 기반 이미지 사용
FROM node:20-alpine as builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 앱 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# Nginx를 사용하여 앱 서빙
FROM nginx:stable-alpine

# Nginx 웹 루트로 작업 디렉토리 설정
WORKDIR /usr/share/nginx/html

# 기존 파일들 제거
RUN rm -rf ./*

# 빌드 스테이지에서 생성된 .next 디렉토리 복사
COPY --from=builder /app/.next .next

# 빌드 스테이지에서 생성된 public 디렉토리 복사
COPY --from=builder /app/public public

# Nginx 구성 파일 복사
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf

# Nginx 실행 (데몬 오프로 설정하여 포그라운드 실행)
ENTRYPOINT ["nginx", "-g", "daemon off;"]

# 포트 80 열기
EXPOSE 80
