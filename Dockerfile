FROM NODE:lts-alpine
WORKDIR /usr/src/app
RUN npm install -g tsc
RUN npx tsc
CMD ["npm", "run", "test"]
