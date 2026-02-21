# Air Quality Card — Sensor Details

This document explains each sensor, why it matters, and what the ideal ranges mean.

## Comfort

*Temperature, humidity, and noise directly affect how comfortable you feel at home.*

### Temperature

- **Unit**: °C
- **Default setpoint**: 21

Comfort range: 19-22°C. Below 18°C increases respiratory issues.

### Humidity

- **Unit**: %
- **Default setpoint**: 45

Ideal: 40-60%. Below 30% dries mucous membranes. Above 60% promotes mold.

### Noise Level

- **Unit**: dB
- **Default setpoint**: 40

Below 30 dB for good sleep. Above 65 dB causes stress. WHO recommends <45 dB indoors.

## Particulates

*Fine particles penetrate deep into lungs. PM2.5 is the most health-critical air metric.*

### PM2.5

- **Unit**: µg/m³
- **Default setpoint**: 12

WHO guideline: <15 µg/m³ annual, <45 µg/m³ 24-hour. Fine particles cause cardiovascular issues.

### PM10

- **Unit**: µg/m³
- **Default setpoint**: 25

Larger particles (dust, pollen). WHO guideline: <45 µg/m³ annual.

### Air Quality Index

- **Unit**: AQI
- **Default setpoint**: 50

Air Quality Index: 0-50 Good, 51-100 Moderate, 101-150 Unhealthy for sensitive groups.

## Gases & Chemicals

*CO2 indicates ventilation quality. VOCs and formaldehyde signal chemical pollution.*

### CO2

- **Unit**: ppm
- **Default setpoint**: 800

Outdoor baseline: ~420 ppm. Above 1000 ppm indicates poor ventilation. Above 2000 ppm causes drowsiness.

### VOC

- **Unit**: ppb
- **Default setpoint**: 250

Volatile organic compounds from paints, cleaners, furniture. Below 250 ppb is good.

### TVOC

- **Unit**: µg/m³
- **Default setpoint**: 300

Total VOC measurement. Useful as a general "chemical pollution" indicator.

### Formaldehyde

- **Unit**: µg/m³
- **Default setpoint**: 30

Off-gases from pressed wood, carpets. WHO limit: 100 µg/m³. Carcinogenic.

### Radon

- **Unit**: Bq/m³
- **Default setpoint**: 100

Radioactive gas from soil. #2 cause of lung cancer. Action level: 100-300 Bq/m³ depending on country.

## Environment

*Atmospheric pressure changes can trigger migraines and affect weather-sensitive people.*

### Atmospheric Pressure

- **Unit**: hPa
- **Default setpoint**: 1013

Atmospheric pressure. Rapid changes can trigger migraines in sensitive individuals.
