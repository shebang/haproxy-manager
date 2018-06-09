#!/bin/sh

if [ "$1" = "start" ]; then

  docker-compose up -d
  socat -d UNIX-LISTEN:./var/run/haproxy/haproxy-forward.sock,fork TCP:127.0.0.1:3003 &
  printf "%s" "started socat, pid="
  echo $! | tee var/run/socat.pid 

elif [ "$1" = "stop" ]; then

  pid=$(cat var/run/socat.pid)
  echo "stopping socat pid=$pid"
  kill -TERM $pid
  docker-compose down
fi

