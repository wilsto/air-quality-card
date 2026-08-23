# Air Monitor Card: Sensor Details

This document explains each sensor, why it matters, and what the ideal ranges mean.

## Comfort

*Temperature, humidity, and noise directly affect how comfortable you feel at home.*

### Temperature (`temperature`)

- **Unit**: °C
- **Defaults**: 21

Comfort range: 19-22°C. Below 18°C increases respiratory issues.

### Humidity (`humidity`)

- **Unit**: %
- **Defaults**: 45

Ideal: 40-60%. Below 30% dries mucous membranes. Above 60% promotes mold.

### Noise Level (`noise`)

- **Unit**: dB
- **Defaults**: 40

Below 30 dB for good sleep. Above 65 dB causes stress. WHO recommends <45 dB indoors.

## Particulates

*Fine particles penetrate deep into lungs. PM2.5 is the most health-critical air metric.*

### PM1 (`pm1`)

- **Unit**: µg/m³
- **Defaults**: 15 / 37.5 / 50 / 75

The finest fraction, contained inside PM2.5. No authority publishes a scale for it, so these bounds are the WHO PM2.5 ones applied here by choice: a good PM1 is not evidence of good air, since the particles between 1 and 2.5 µm are not counted.

### PM2.5 (`pm25`)

- **Unit**: µg/m³
- **Defaults**: 15 / 37.5 / 50 / 75

WHO guideline: <15 µg/m³ annual, <45 µg/m³ 24-hour. Fine particles cause cardiovascular issues.

### PM4 (`pm4`)

- **Unit**: µg/m³
- **Defaults**: 15 / 37.5 / 50 / 75

The respirable fraction, cut at 4 µm by ISO 7708, and it contains PM2.5. No published scale for it either, so these bounds are the WHO PM2.5 ones applied here by choice: the scale can only ever be stricter than published guidance, never more forgiving.

### PM10 (`pm10`)

- **Unit**: µg/m³
- **Defaults**: 45 / 75 / 100 / 150

Larger particles (dust, pollen). WHO guideline: <45 µg/m³ annual.

### Air Quality Index (`aqi`)

- **Unit**: AQI
- **Defaults**: 50

Air Quality Index: 0-50 Good, 51-100 Moderate, 101-150 Unhealthy for sensitive groups.

## Gases & Chemicals

*CO2 indicates ventilation quality. VOCs and formaldehyde signal chemical pollution.*

### Carbon Monoxide (`co`)

- **Unit**: ppm
- **Defaults**: 6 / 9 / 30 / 87

### CO2 (`co2`)

- **Unit**: ppm
- **Defaults**: 500 / 800 / 1000 / 2000

Outdoor baseline: ~420 ppm. Above 1000 ppm indicates poor ventilation. Above 2000 ppm causes drowsiness.

### VOC (`voc`)

- **Unit**: ppb
- **Defaults**: 250 / 500 / 1000 / 2000

Volatile organic compounds from paints, cleaners, furniture. Below 250 ppb is good.

### TVOC (`tvoc`)

- **Unit**: µg/m³
- **Defaults**: 300 / 1000 / 3000 / 10000

Total VOC measurement. Useful as a general "chemical pollution" indicator.

### Formaldehyde (`formaldehyde`)

- **Unit**: µg/m³
- **Defaults**: 10 / 30 / 50 / 100

Off-gases from pressed wood, carpets. WHO limit: 100 µg/m³. Carcinogenic.

### Radon (`radon`)

- **Unit**: Bq/m³
- **Defaults**: 50 / 100 / 150 / 300

Radioactive gas from soil. #2 cause of lung cancer. Action level: 100-300 Bq/m³ depending on country.

## Environment

*Atmospheric pressure changes can trigger migraines and affect weather-sensitive people.*

### Atmospheric Pressure (`pressure`)

- **Unit**: hPa
- **Defaults**: 1013

Atmospheric pressure. Rapid changes can trigger migraines in sensitive individuals.
