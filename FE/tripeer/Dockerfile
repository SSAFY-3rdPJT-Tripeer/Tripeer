# 빌드 스테이지
# Node.js 이미지를 기반으로 함
FROM node:20-alpine as builder

# 애플리케이션의 작업 디렉토리 설정
WORKDIR /app

# 애플리케이션의 package.json 및 package-lock.json 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 애플리케이션의 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# 서비스 스테이지
# Nginx 이미지를 기반으로 함
FROM nginx:stable-alpine

# Nginx 설정 파일을 애플리케이션에 맞게 수정된 버전으로 교체
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# 빌드 스테이지에서 생성된 빌드 아티팩트를 Nginx가 제공할 수 있도록 복사
COPY --from=builder /app/out /usr/share/nginx/html

# 80번 포트를 노출시킴. Nginx는 기본적으로 80번 포트에서 서비스됨
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
