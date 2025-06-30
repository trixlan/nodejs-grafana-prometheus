FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000 # Or the port your Node.js app listens on
CMD ["node", "index.js"] # Or the command to start your app