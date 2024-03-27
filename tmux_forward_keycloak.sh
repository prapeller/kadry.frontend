#!/bin/bash

session="kaisaco_forward_keycloak"

tmux start-server

tmux new-session -d -s $session

tmux send-keys "ssh kaisaco.com -L 127.0.0.1:8090:192.168.140.5:8093" C-m
tmux send-keys "top" C-m

tmux attach-session -t $session
