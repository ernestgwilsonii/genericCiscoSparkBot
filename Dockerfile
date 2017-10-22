FROM node:8.7

# Install Utils
RUN apt-get update && apt-get -y upgrade && \
    apt-get -y install traceroute mtr iputils-tracepath iputils-ping telnet mc whois dnsutils tcpdump nmap python-pip snmp jq libonig2 lsof htop expect-dev bridge-utils graphicsmagick

# Create app directory structure
RUN mkdir -p /opt/genericCiscoSparkBot/lib

# Set Docker working directory
WORKDIR /opt/genericCiscoSparkBot

# Copy in app dependencies
COPY *.js /opt/genericCiscoSparkBot/
COPY *.json /opt/genericCiscoSparkBot/
COPY lib/*.js /opt/genericCiscoSparkBot/lib/

# Install Node.js modules
RUN npm install

CMD [ "npm", "start" ]
