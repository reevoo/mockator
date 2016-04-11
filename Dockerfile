FROM quay.io/assemblyline/nodejs:5.10.1

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
