import type { SensorsRegistry } from './ha/types.js';

export const AIR_QUALITY_SENSORS: SensorsRegistry = {
  temperature: {
    name: 'Temperature',
    unit: '°C',
    setpoint: 21,
    step: 1,
    mode: 'heatflow',
  },
  humidity: {
    name: 'Humidity',
    unit: '%',
    setpoint: 45,
    step: 5,
    mode: 'centric',
    min_limit: 0,
  },
  // Carbon monoxide. Thresholds are the WHO indoor air quality guideline values
  // converted to ppm: 7 mg/m3 over 24h, 10 over 8h, 35 over 1h, 100 over 15min.
  // Not our judgement, these are published limits, and CO is a safety matter.
  co: {
    name: 'Carbon Monoxide',
    unit: 'ppm',
    // No artwork for this one: without an explicit icon the card looks for
    // co.png and renders a broken image.
    icon: 'mdi:molecule-co',
    limits: [6, 9, 30, 87],
    direction: 'lower_is_better',
    min_limit: 0,
  },

  co2: {
    name: 'CO2',
    unit: 'ppm',
    setpoint: 800,
    step: 200,
    mode: 'centric',
    min_limit: 0,
  },
  pm25: {
    name: 'PM2.5',
    unit: 'µg/m³',
    setpoint: 12,
    step: 6,
    mode: 'centric',
    min_limit: 0,
  },
  pm10: {
    name: 'PM10',
    unit: 'µg/m³',
    setpoint: 25,
    step: 12,
    mode: 'centric',
    min_limit: 0,
  },
  voc: {
    name: 'VOC',
    unit: 'ppb',
    setpoint: 250,
    step: 100,
    mode: 'centric',
    min_limit: 0,
  },
  tvoc: {
    name: 'TVOC',
    unit: 'µg/m³',
    setpoint: 300,
    step: 100,
    mode: 'centric',
    min_limit: 0,
  },
  formaldehyde: {
    name: 'Formaldehyde',
    unit: 'µg/m³',
    setpoint: 30,
    step: 15,
    mode: 'centric',
    min_limit: 0,
  },
  radon: {
    name: 'Radon',
    unit: 'Bq/m³',
    setpoint: 100,
    step: 50,
    mode: 'centric',
    min_limit: 0,
  },
  aqi: {
    name: 'Air Quality Index',
    unit: 'AQI',
    setpoint: 50,
    step: 25,
    mode: 'centric',
    min_limit: 0,
  },
  pressure: {
    name: 'Atmospheric Pressure',
    unit: 'hPa',
    setpoint: 1013,
    step: 10,
    mode: 'centric',
  },
  noise: {
    name: 'Noise Level',
    unit: 'dB',
    setpoint: 40,
    step: 10,
    mode: 'centric',
    min_limit: 0,
  },
};
