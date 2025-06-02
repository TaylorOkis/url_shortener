# ----- Stage 1: Build ------ #
FROM  node:alpine AS builder
WORKDIR /apps/url-redis-app
# install all dependencies #
COPY package*.json ./
RUN npm ci
# Copy source + Prisma schema #
COPY . .
# build TS and generate Prisma Client #
RUN npm run build
RUN npm run postinstall

# ----- Stage 2: Production Image ------#
FROM node:alpine AS Production
WORKDIR /app
# only copy package files and innstall prod dependencies #
COPY package.json ./
RUN npm ci --omit-dev
# Copy compiled code, Prisma client, and schema
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma
# expose port and define start command
EXPOSE 5000
CMD ["npm", "start"]
