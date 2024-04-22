# Node 기반 이미지 사용
FROM node:20-alpine as builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 관련 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 앱 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# 정적 파일을 선택적으로 내보내기 (정적 사이트 생성시 사용)
# RUN npm run export

# Nginx 사용하여 앱 서빙
FROM nginx:stable-alpine

# Nginx 자산 디렉토리로 작업 디렉토리 설정
WORKDIR /usr/share/nginx/html

# 기본 Nginx 정적 자산 제거
RUN rm -rf ./*

# 빌더 스테이지에서 정적 자산 복사
COPY --from=builder /app/out .

# 컨테이너가 실행되면 80 포트를 외부에 노출
EXPOSE 80

# Nginx를 전역 지시어와 함께 데몬 오프로 실행
ENTRYPOINT ["nginx", "-g", "daemon off;"]

