FROM ubuntu:16.04

RUN apt-get update
RUN apt-get -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" upgrade
RUN apt-get -y install socat sudo
EXPOSE 3002
CMD ["/usr/bin/socat","TCP4-LISTEN:3002,fork,reuseaddr","UNIX-CONNECT:/var/run/haproxy/haproxy.sock"]

