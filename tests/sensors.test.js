import { describe, test, expect } from 'vitest';
import { AIR_QUALITY_SENSORS } from '../src/sensors.js';
import { translations, getTranslation } from '../src/locales/translations.js';

const SENSOR_KEYS = Object.keys(AIR_QUALITY_SENSORS);

// Indoor air only ever cools or warms towards the outside: temperature is the
// one reading where direction matters more than distance to the setpoint.
const HEATFLOW_SENSORS = ['temperature'];

// This registry mixes two scale models. Most sensors centre on a setpoint;
// CO carries published WHO limits instead, because a safety threshold is not
// an aesthetic preference (see co-preset.test.js). A sensor must commit to
// exactly one of the two, or the scale maths has nothing to stand on.
const isBandSensor = sensor => 'limits' in sensor;

describe('AIR_QUALITY_SENSORS registry', () => {
  // Not a hardcoded count: that only ever gets bumped without thought. What
  // matters is that the registry is populated and every key is well formed.
  test('the registry is populated and every key is well formed', () => {
    expect(SENSOR_KEYS.length).toBeGreaterThan(10);
    SENSOR_KEYS.forEach(k => expect(k).toMatch(/^[a-z][a-z0-9_]*$/));
  });

  test('each sensor should have a name and a unit', () => {
    SENSOR_KEYS.forEach(key => {
      const sensor = AIR_QUALITY_SENSORS[key];
      expect(sensor, `${key} missing name`).toHaveProperty('name');
      expect(sensor, `${key} missing unit`).toHaveProperty('unit');
    });
  });

  test('a setpoint sensor has numeric setpoint and step, and a valid mode', () => {
    SENSOR_KEYS.filter(key => !isBandSensor(AIR_QUALITY_SENSORS[key])).forEach(key => {
      const sensor = AIR_QUALITY_SENSORS[key];
      expect(typeof sensor.setpoint, `${key} setpoint`).toBe('number');
      expect(typeof sensor.step, `${key} step`).toBe('number');
      expect(['heatflow', 'centric'], `${key} has invalid mode`).toContain(sensor.mode);
    });
  });

  test('a band sensor has four ascending limits and a direction', () => {
    SENSOR_KEYS.filter(key => isBandSensor(AIR_QUALITY_SENSORS[key])).forEach(key => {
      const sensor = AIR_QUALITY_SENSORS[key];
      expect(sensor.limits, `${key} limits`).toHaveLength(4);
      sensor.limits.forEach(l => expect(typeof l).toBe('number'));
      const sorted = [...sensor.limits].sort((a, b) => a - b);
      expect(sensor.limits, `${key} limits must ascend`).toEqual(sorted);
      expect(['lower_is_better', 'higher_is_better'], `${key} direction`).toContain(
        sensor.direction,
      );
      // A band sensor must not also carry a setpoint: the card would not know
      // which scale model to trust.
      expect(sensor.setpoint, `${key} mixes both scale models`).toBeUndefined();
    });
  });

  test('only temperature should be heatflow mode', () => {
    SENSOR_KEYS.filter(key => !isBandSensor(AIR_QUALITY_SENSORS[key])).forEach(key => {
      if (HEATFLOW_SENSORS.includes(key)) {
        expect(AIR_QUALITY_SENSORS[key].mode, `${key} should be heatflow`).toBe('heatflow');
      } else {
        expect(AIR_QUALITY_SENSORS[key].mode, `${key} should be centric`).toBe('centric');
      }
    });
  });

  // Concentrations cannot go below zero, and a gauge that suggests they can
  // reads as broken.
  test('a declared min_limit is a number', () => {
    SENSOR_KEYS.forEach(key => {
      const sensor = AIR_QUALITY_SENSORS[key];
      if ('min_limit' in sensor) {
        expect(typeof sensor.min_limit, `${key} min_limit`).toBe('number');
      }
    });
  });
});

describe('Sensor-locale consistency', () => {
  test('every air quality sensor should have a translation in en', () => {
    const enSensors = translations.en.sensor;
    SENSOR_KEYS.forEach(key => {
      expect(enSensors, `Missing en translation for sensor.${key}`).toHaveProperty(key);
    });
  });

  // Other locales are no longer required to carry every key: a missing one now
  // falls back to English rather than rendering `sensor.radon` raw. That way
  // a new sensor ships without anyone inventing Hungarian or Hebrew they cannot
  // verify, and a native speaker can improve it later.
  test('a sensor missing from a locale falls back to English, never to its key', () => {
    const locales = Object.keys(translations).filter(l => l !== 'en');
    SENSOR_KEYS.forEach(key => {
      locales.forEach(lang => {
        const nom = getTranslation(lang, `sensor.${key}`);
        expect(nom, `${lang} renders sensor.${key} raw`).not.toBe(`sensor.${key}`);
      });
    });
  });
});
