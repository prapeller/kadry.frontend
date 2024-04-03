FROM node:18.18.0
ENV DIRR=/kadry.frontend
WORKDIR $DIRR
ADD package.json $DIRR
ADD package-lock.json $DIRR
RUN npm install npm@10.4.0 -g
RUN npm ci
ADD . $DIRR
RUN npm run build:prod
CMD ["sleep", "600"]
