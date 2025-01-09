# 빌드 단계
FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

# 실행 단계
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/dist ./dist
RUN npm install --only=production
EXPOSE 3000
CMD ["node", "dist/main.js"]