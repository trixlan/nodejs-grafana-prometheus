const express = require("express");
const promClient = require("prom-client");

const app = express();
const port = 3002;

const register = new promClient.Registry();
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({
  register
});

const requestCounter = new promClient.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

app.get("/saludo", (req, res) => {
  requestCounter.inc({ method: req.method, route: res.route , status_code: res.statusCode });
  console.log("Respuesta")
  res.send("Hello World!");
});

const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duración de las solicitudes HTTP en segundos',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.2, 0.5, 1, 2]
});

app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationInMs = (diff[0] * 1e9 + diff[1]) / 1e6;
    httpRequestDurationMicroseconds
    .labels(req.method, req.path, res.statusCode)
    .observe(durationInMs / 1000); // Convertir a segundos
    console.log(`Duracion  ${durationInMs} ${req.method} ${req.path}`);
  });
  next();
});

// Numero de conexiones activas
const activeConnectionsGauge = new promClient.Gauge({
  name: 'active_connections',
  help: 'Número de conexiones activas en tiempo real'
});

app.use((req, res, next) => {
  console.log(`Gauge`);
  activeConnectionsGauge.inc();
  res.on('finish', () => {
    activeConnectionsGauge.dec();
  });
  next();
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
