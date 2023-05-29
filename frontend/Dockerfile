# base image
FROM node:12.2.0

# set working directory
WORKDIR /app
# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli@8.0.0

# add app
COPY . /app

EXPOSE 4200
# start app
CMD ng serve --host 0.0.0.0