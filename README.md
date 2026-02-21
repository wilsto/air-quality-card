# Air Quality Card

Home Assistant HACS card for air quality monitoring.

## Installation

Install via [HACS](https://hacs.xyz/) as a custom repository.

## Usage

```yaml
type: custom:air-quality-card
title: Air Quality
sensors:
  pm25:
    entity: sensor.air_pm25
  co2:
    entity: sensor.air_co2
```

Built from [monitor-cards](https://github.com/wilsto/monitor-cards) monorepo.
