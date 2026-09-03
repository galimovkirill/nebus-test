FROM node:24

WORKDIR /app
EXPOSE 3000

CMD ["sh", "-c", "npm install && npm run dev -- --host 0.0.0.0"]
