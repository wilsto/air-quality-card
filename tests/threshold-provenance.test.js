import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { AirQualityCard } from '../src/air-quality-card.js';
import { AIR_QUALITY_SENSORS } from '../src/sensors.js';

// A wrong air quality threshold does not look wrong. It gives somebody a green
// badge on air they should have ventilated, and nothing on the card says where
// the number came from. Until this change the card had thirteen presets and one
// published source between them: carbon monoxide. The other twelve centred on a
// setpoint somebody picked, and a reader had no way to tell which was which.
//
// So the rule this file enforces is not "the numbers are right", which no test
// can check. It is: every bound is either quoted from a named source, or
// declared as ours. Those two never blur into each other, and a bound that is
// neither does not ship.
//
// Reference for the shape: packages/aquarium-monitor/tests/nitrogen-bands.test.js.

// Line endings are normalised because git checks the file out with CRLF on
// Windows, which would leave a stray \r on every comment line collected here.
const SOURCE = readFileSync(resolve(__dirname, '../src/sensors.ts'), 'utf8').replace(/\r\n/g, '\n');

// The run of comment lines sitting immediately above a preset. Provenance is
// written next to the values it justifies, not in a document that drifts.
const provenanceBlock = key => {
  const at = SOURCE.indexOf(`\n  ${key}: {`);
  expect(at, `${key} is not declared at the top level of the registry`).toBeGreaterThan(-1);
  const above = SOURCE.slice(0, at).split('\n');
  const block = [];
  for (let i = above.length - 1; i >= 0; i--) {
    const line = above[i].trim();
    if (!line.startsWith('//')) break;
    block.unshift(line);
  }
  return block;
};

const build = (key, value) => {
  const card = new AirQualityCard();
  const entity = `sensor.${key}`;
  card.hass = {
    states: {
      [entity]: { state: String(value), attributes: {}, last_updated: '2026-08-22T10:00:00Z' },
    },
    entities: {},
  };
  card.setConfig({ sensors: { [key]: { entity } } });
  return card.processData()[`${key}_1`];
};

// The delivered scales, with the values spelled out here as well as in the
// source: a threshold that changes has to be changed in two places, one of
// which is a test somebody has to justify touching.
const DELIVERED = {
  co: { unit: 'ppm', limits: [6, 9, 30, 87], ours: [] },
  co2: { unit: 'ppm', limits: [500, 800, 1000, 2000], ours: [500, 800] },
  pm25: { unit: 'µg/m³', limits: [15, 37.5, 50, 75], ours: [] },
  pm10: { unit: 'µg/m³', limits: [45, 75, 100, 150], ours: [] },
  voc: { unit: 'ppb', limits: [250, 500, 1000, 2000], ours: [500, 1000] },
  tvoc: { unit: 'µg/m³', limits: [300, 1000, 3000, 10000], ours: [] },
  formaldehyde: { unit: 'µg/m³', limits: [10, 30, 50, 100], ours: [10, 30] },
  radon: { unit: 'Bq/m³', limits: [50, 100, 150, 300], ours: [50] },
};

describe('every band preset is accounted for', () => {
  // Without this, the file silently stops covering the registry the day someone
  // adds a preset, which is exactly when the check is worth having.
  it('leaves no band sensor undocumented', () => {
    const bandKeys = Object.keys(AIR_QUALITY_SENSORS).filter(
      k => 'limits' in AIR_QUALITY_SENSORS[k],
    );
    expect(bandKeys.sort()).toEqual(Object.keys(DELIVERED).sort());
  });
});

describe.each(Object.entries(DELIVERED))('%s thresholds', (key, expected) => {
  const sensor = AIR_QUALITY_SENSORS[key];

  it('carries the limits it is documented with, in the unit it is documented in', () => {
    expect(sensor.limits).toEqual(expected.limits);
    expect(sensor.unit).toBe(expected.unit);
    expect(sensor.direction).toBe('lower_is_better');
    // A band sensor must not also carry a setpoint: the card would not know
    // which of the two scale models to trust.
    expect(sensor.setpoint).toBeUndefined();
    expect(sensor.mode).toBeUndefined();
    // Concentrations cannot go below zero.
    expect(sensor.min_limit).toBe(0);
  });

  it('states, for each bound, whether it is quoted or ours', () => {
    const block = provenanceBlock(key);
    expected.limits.forEach(value => {
      const marker = new RegExp(`^//\\s+${String(value).replace('.', '\\.')} ${expected.unit} - `);
      const line = block.find(l => marker.test(l));
      expect(line, `${key}: ${value} ${expected.unit} has no provenance line`).toBeDefined();
      const status = expected.ours.includes(value) ? 'OURS' : 'taken as published';
      expect(line, `${key}: ${value} ${expected.unit} is mislabelled`).toContain(status);
    });
  });

  it('names a source when it claims one', () => {
    const block = provenanceBlock(key);
    const quotes = block.some(l => l.includes('taken as published'));
    if (quotes) {
      expect(
        block.some(l => l.includes('https://')),
        `${key} quotes a source it does not name`,
      ).toBe(true);
    }
  });

  it('does not label a bound both ways', () => {
    const block = provenanceBlock(key);
    block
      .filter(l => /^\/\/\s+[\d.]+ \S+ - /.test(l))
      .forEach(line => {
        expect(
          line.includes('OURS') && line.includes('taken as published'),
          `a bound cannot be both quoted and ours: ${line}`,
        ).toBe(false);
      });
  });

  // The scale has to behave the way the provenance says it does: the class
  // changes on the published number, not somewhere after it.
  it('changes class on each bound and not before it', () => {
    const [a, b, c, d] = expected.limits;
    expect([0, a, b, c, d].map(v => build(key, v).state)).toEqual([
      'Good',
      'Fair',
      'Moderate',
      'Poor',
      'Very Poor',
    ]);
    expect([a, b, c, d].map(v => build(key, v - 0.01).state)).toEqual([
      'Good',
      'Fair',
      'Moderate',
      'Poor',
    ]);
  });

  it('opens its scale on the floor rather than on a negative reading', () => {
    expect(build(key, 0).setpoint_class.map(Number)).toEqual([0, ...expected.limits]);
  });
});

// The two presets the PO required to be labelled for what they are. Both would
// otherwise read as health scales, and neither is one.
describe('a scale that is not a health scale says so', () => {
  it('CO2 is declared a ventilation convention, not a health threshold', () => {
    const block = provenanceBlock('co2').join('\n');
    expect(block).toContain('VENTILATION CONVENTION, NOT A HEALTH THRESHOLD');
    expect(block).toContain('No public health authority publishes a CO2 guideline value');
  });

  it('VOC is declared a vendor index, not a standard', () => {
    const block = provenanceBlock('voc').join('\n');
    expect(block).toContain('SENSOR VENDOR INDEX, NOT A STANDARD');
    expect(block).toContain('No authority publishes');
  });

  // The card reports TVOC in µg/m³ and the vendor index is published in ppb.
  // Reusing the ppb numbers would have meant inventing a conversion factor for
  // an unidentified mixture, so TVOC is driven by a source already in µg/m³.
  it('TVOC is not the ppb vendor index wearing a µg/m³ label', () => {
    expect(AIR_QUALITY_SENSORS.tvoc.limits).not.toEqual(AIR_QUALITY_SENSORS.voc.limits);
    expect(provenanceBlock('tvoc').join('\n')).toContain('Umweltbundesamt');
  });
});
