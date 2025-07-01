# Aplicacion de NodeJs con Prometheus y Grafana

Esta guia ayuda a quien quiera apender a tener metricas dentro de aplicaciones creadas con NodeJs

## Despliegue de la App en NodeJs
- Creamos la red de prometheus
```shell
$ podman network create prometheus
```
- Creamos todos los pods
```shell  
$ podman pod create -n pod-nodejs --network=prometheus -p 3002:3002 
$ podman pod create -n pod-prometheus --network=prometheus -p 9091:9090 
$ podman pod create -n pod-grafana --network=prometheus -p 3001:3000
```
- Generamos la imagen de NodeJs
```shell
$ podman build -t node-prometheus .
```
- Iniciamos la App de NodeJs
```shell
$ podman run --name nodejs-prometheus --pod pod-nodejs localhost/node-prometheus:latest
```
- Creamos el volumen para Prometheus
```shell
$ podman volume create prometheus-data
```
- Iniciamos el contenedor de prometheus con las configuraciones de prometheus [prometheus.yml](prometheus.yml)
```shell
$ podman run -d --pod pod-prometheus --name prometheus -v prometheus-data:/prometheus -v /home/gercha/Proyectos/grafana/nodejs-grafana-prometheus/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus:latest
```
- Creamos el volumen para Grafana
```shell
$ podman volume create grafana-storage
```
- Iniciamos el contenedor de grafana
```shell
$ podman run -d --pod pod-grafana --name grafana -v grafana-storage:/var/lib/grafana grafana/grafana:latest
```

Links
---
- [Guia Base](https://medium.com/@diego.coder/monitoreo-de-aplicaciones-con-node-js-grafana-y-prometheus-afd2b33e3f91)
- [Documentacion Grafana](https://hub.docker.com/r/grafana/grafana)
- [Imagen Grafana](https://grafana.com/docs/grafana/latest/setup-grafana/installation/docker/)
- [Documentacion Prometheus](https://hub.docker.com/r/prom/prometheus)
- [Imagen Prometheus](https://prometheus.io/docs/prometheus/latest/installation/)

Adicionales
---
- [Uno](https://dev.to/oluwatobi2001/optimizing-performance-using-prometheus-with-node-js-for-monitoring-b90)
- [Dos](https://jackfiallos.com/m%C3%A9tricas-para-aplicaciones-de-node-js-con-prometheus)