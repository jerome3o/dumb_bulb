# HTTP API for controlling a Tapo L530 Smart Bulb

This is a service exposing an HTTP API that will relay commands to a Tapo Smart bulb on your localnetwork.

## Setup

Docker required, run these commands (with the curly braces replaced with your respective values):

```bash
sudo docker build . -t dumbbulb
sudo docker run -p 8002:8002 \ 
    -e EMAIL={YOUR TAPO EMAIL} \
    -e PASSWORD={YOUR TAPO PASSWORD} \
    -e DEVICEIP={YOUR TAPO BULB IP} \
    dumbbulb
```

Our you could set the above variables in a .env file and run with

```bash
sudo docker run -p 8002:8002 --env-file .env dumbbulb
```

You should be able to turn your lights on and off with `http://localhost:8002/on` and `http://localhost:8002/off` respectively!