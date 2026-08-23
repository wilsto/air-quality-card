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

WHO puts a bedroom at 30 dB LAeq at night for sleep, with single events below 45 dB LAmax. Its other 45 dB figure is measured outside the window, not indoors. Long-term exposure above 65 dB is associated with cardiovascular effects, but WHO sets no guideline value there.

## Particulates

*Fine particles penetrate deep into lungs. PM2.5 is the most health-critical air metric.*

### PM1 (`pm1`)

- **Unit**: µg/m³
- **Defaults**: 15 / 37.5 / 50 / 75

The finest fraction, contained inside PM2.5. No authority publishes a scale for it, so these bounds are the WHO 24-hour PM2.5 ones applied here by choice: a good PM1 is not evidence of good air, since the particles between 1 and 2.5 µm are not counted.

### PM2.5 (`pm25`)

- **Unit**: µg/m³
- **Defaults**: 15 / 37.5 / 50 / 75

WHO 2021 guideline: 5 µg/m³ as an annual mean, 15 µg/m³ over 24 hours. The bands on this card are the 24-hour ones. Fine particles cause cardiovascular issues.

### PM4 (`pm4`)

- **Unit**: µg/m³
- **Defaults**: 15 / 37.5 / 50 / 75

The respirable fraction, cut at 4 µm by ISO 7708, and it contains PM2.5. No published scale for it either, so these bounds are the WHO 24-hour PM2.5 ones applied here by choice: the scale can only ever be stricter than published guidance, never more forgiving.

### PM10 (`pm10`)

- **Unit**: µg/m³
- **Defaults**: 45 / 75 / 100 / 150

Larger particles (dust, pollen). WHO 2021 guideline: 15 µg/m³ as an annual mean, 45 µg/m³ over 24 hours. The bands on this card are the 24-hour ones.

### Air Quality Index (`aqi`)

- **Unit**: AQI
- **Defaults**: 50

Air Quality Index: 0-50 Good, 51-100 Moderate, 101-150 Unhealthy for sensitive groups.

## Gases & Chemicals

*CO2 indicates ventilation quality. VOCs and formaldehyde signal chemical pollution.*

### Carbon Monoxide (`co`)

- **Unit**: ppm
- **Defaults**: 6 / 9 / 30 / 87

Colourless and odourless, so the reading is the only warning. Every bound is a WHO indoor air quality guideline value converted at 1 ppm = 1.145 mg/m³ ([WHO Guidelines for Indoor Air Quality: Selected Pollutants](https://www.ncbi.nlm.nih.gov/books/NBK138710/)), and each one belongs to a different exposure time: 6 ppm is the 24-hour figure (7 mg/m³), 9 ppm the 8-hour one (10 mg/m³), 30 ppm the 1-hour one (35 mg/m³), 87 ppm the 15-minute one (100 mg/m³). The bands therefore say how long a level may last, not how bad it is, and all four are set to keep blood carboxyhaemoglobin under 2%, which WHO ties to reduced exercise tolerance in people with ischaemic heart disease, the unborn and adults with heart disease being the groups it names as most at risk. A card displays, it does not sound: this is not a substitute for a CO alarm.

### CO2 (`co2`)

- **Unit**: ppm
- **Defaults**: 500 / 800 / 1000 / 2000

A ventilation signal, not a health threshold: no authority publishes a CO2 guideline value for indoor air. Outdoor baseline: ~420 ppm. Above 1000 ppm the room is under-aired, and above 2000 ppm the Airthings guide these bands come from reports headaches and loss of concentration.

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

Off-gases from pressed wood, carpets. WHO indoor guideline: 100 µg/m³, not to be exceeded over any 30-minute period. Carcinogenic.

### Radon (`radon`)

- **Unit**: Bq/m³
- **Defaults**: 50 / 100 / 150 / 300

Radioactive gas from soil, and a major cause of lung cancer: WHO attributes 3 to 14% of cases to it. WHO reference level: 100 Bq/m³ as an annual average, and no higher than 300 Bq/m³ where 100 cannot be reached.

## Environment

*Atmospheric pressure changes can trigger migraines and affect weather-sensitive people.*

### Atmospheric Pressure (`pressure`)

- **Unit**: hPa
- **Defaults**: 1013

Atmospheric pressure. Rapid changes can trigger migraines in sensitive individuals.
