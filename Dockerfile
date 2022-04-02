FROM node:10.15.3

ARG PORT=3039
ENV PORT=${PORT}

ARG CONFIG_NET=production
ENV CONFIG_NET=${CONFIG_NET}

WORKDIR /opt/amaxweb
COPY . /opt/amaxweb

#RUN npm update
RUN npm install -g pm2@2.10.4
RUN npm install -g @angular/cli@7.1.4
RUN cd /opt/amaxweb && npm install
RUN cd /opt/amaxweb && node patch
RUN cd /opt/amaxweb/server && npm install
RUN cd /opt/amaxweb && ng build --configuration=${CONFIG_NET}

CMD ["pm2-runtime", "/opt/amaxweb/server/ecosystem.config.js", "--web"]

EXPOSE ${PORT}
EXPOSE 9615
