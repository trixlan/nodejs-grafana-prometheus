# Aplicacion de NodeJs con Prometheus y Grafana

- Iniciar prometheus para que lea la app de nodejs

Links
https://medium.com/@diego.coder/monitoreo-de-aplicaciones-con-node-js-grafana-y-prometheus-afd2b33e3f91

https://hub.docker.com/r/grafana/grafana
https://grafana.com/docs/grafana/latest/setup-grafana/installation/docker/

https://hub.docker.com/r/prom/prometheus
https://prometheus.io/docs/prometheus/latest/installation/

Adicionales
https://dev.to/oluwatobi2001/optimizing-performance-using-prometheus-with-node-js-for-monitoring-b90
https://jackfiallos.com/m%C3%A9tricas-para-aplicaciones-de-node-js-con-prometheus

```shell
$ podman network create prometheus 
$ podman pod create -n pod-nodejs --network=prometheus -p 3002:3002 
$ podman pod create -n pod-prometheus --network=prometheus -p 9091:9090 
$ podman pod create -n pod-grafana --network=prometheus -p 3001:3000

$ podman build -t node-prometheus .
$ podman run --name nodejs-prometheus --pod pod-nodejs localhost/node-prometheus:latest

$ podman volume create prometheus-data
$ podman run -d --pod pod-prometheus --name prometheus -v prometheus-data:/prometheus -v /home/gercha/Proyectos/grafana/nodejs-grafana-prometheus/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus:latest

$ podman volume create grafana-storage
$ podman run -d --pod pod-grafana --name grafana -v grafana-storage:/var/lib/grafana grafana/grafana:latest
```