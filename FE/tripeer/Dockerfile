# Node 기반 이미지 사용
FROM node:20-alpine as builder

# 작업 디렉토리를 /app으로 설정한다
WORKDIR /app

# 컨테이너에 package.json와 package-lock.json 파일을 복사합니다.
COPY package*.json ./

# npm 설치
RUN npm install

COPY . .

# Next.js를 빌드한다
RUN npm run build

# 새로운 단독의 nginx 이미지 생성
FROM nginx

# 오픈할 포트를 적어둔다
EXPOSE 3000

# default.conf을 /etc/nginx/conf.d/ 경로에 있는 default.conf에 복사한다.
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# nextjs build한 결과물을 /usr/share/nginx/html에 복사한다.
COPY --from=build app/out  /usr/share/nginx/html
