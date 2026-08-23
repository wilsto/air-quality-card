import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { AirQualityCard } from '../src/air-quality-card.js';
import { AIR_QUALITY_SENSORS } from '../src/sensors.js';
import { translations, getTranslation } from '../src/locales/translations.js';

// @ronron261 reported (air-quality-card#6, wilsto/monitor-cards#67) that his
// Sensirion SPS30 publishes four mass fractions, PM1.0, PM2.5, PM4 and PM10,
// and that the card knew only two of them.
//
// The two it did not know have no published scale. That was established before
// they shipped, and it has not changed:
//
//   - WHO 2021 publishes guideline levels and interim targets for PM2.5 and
//     PM10 only. Its chapter on other PM types covers black carbon, ultrafine
//     particles and dust storms as good practice statements, not as guideline
//     values, and ultrafine means PM0.1, not PM1.
//     https://www.ncbi.nlm.nih.gov/books/NBK574594/
//   - Directive (EU) 2024/2881 lists the pollutants it sets assessment
//     thresholds for. PM10 and PM2.5 are on that list. PM1 and PM4 are not.
//     https://eur-lex.europa.eu/eli/dir/2024/2881/oj/eng
//   - Airthings, the vendor guide this card already borrows radon and VOC bands
//     from, publishes none for PM1: "PM2.5 is the officially supported and
//     documented metric for the Airthings View Plus", PM1 is only "also shown".
//   - The one published number touching PM4 is occupational: the respirable
//     fraction, which ISO 7708 defines with the same 4 micrometre cut, carries
//     an OSHA permissible exposure limit of 5 mg/m3 over eight hours for healthy
//     adults at work. That is 5000 ug/m3, over three hundred times the WHO PM2.5
//     24 hour level. https://www.osha.gov/annotated-pels/table-z-1
//
// The PO decided (#67) to ship them anyway, carrying the PM2.5 scale, labelled
// as ours. This file holds that decision to its terms: the numbers are WHO's
// for PM2.5, the choice to apply them here is not WHO's, and the two
// transpositions do not have the same standing.

const TRANSPOSED = ['pm1', 'pm4'];
const WHO_PM25_SCALE = [15, 37.5, 50, 75];

const build = (key, value) => {
  const card = new AirQualityCard();
  const entity = `sensor.${key}`;
  card.hass = {
    states: {
      [entity]: { state: String(value), attributes: {}, last_updated: '2026-08-23T10:00:00Z' },
    },
    entities: {},
  };
  card.setConfig({ sensors: { [key]: { entity } } });
  return card.processData()[`${key}_1`];
};

// Line endings are normalised because git checks the file out with CRLF on
// Windows. Same reader as threshold-provenance.test.js, kept local so the two
// files stay independently deletable.
const SOURCE = readFileSync(resolve(__dirname, '../src/sensors.ts'), 'utf8').replace(/\r\n/g, '\n');

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
  // Stripped of its comment markers and re-flowed onto one line, so matching a
  // sentence does not depend on where the formatter happened to wrap it.
  return block
    .map(l => l.replace(/^\/\/ ?/, ''))
    .join(' ')
    .replace(/\s+/g, ' ');
};

describe('the two SPS30 fractions the card had no scale for', () => {
  it.each(TRANSPOSED)('%s exists, because a sensor in the field reports it', key => {
    expect(AIR_QUALITY_SENSORS[key]).toBeDefined();
    expect(AIR_QUALITY_SENSORS[key].unit).toBe('µg/m³');
    expect(AIR_QUALITY_SENSORS[key].category).toBe('particulates');
  });

  // The label was the one thing about them needing no source, and it was broken
  // before the presets existed: a hand configured pm1 sensor wrote `sensor.pm1`
  // under its bar in every language.
  it.each(Object.keys(translations))('has a name to show in %s', lang => {
    TRANSPOSED.forEach(key => {
      const name = getTranslation(lang, `sensor.${key}`);
      expect(name, `${lang} renders sensor.${key} raw`).not.toBe(`sensor.${key}`);
      expect(name).toBe(key === 'pm1' ? 'PM1' : 'PM4');
    });
  });

  // There is no pm1.png and no pm4.png in the card's resources, so without an
  // explicit icon each would render a broken image. Same defect CO had.
  it.each(TRANSPOSED)('%s carries its own icon rather than asking for artwork', key => {
    expect(AIR_QUALITY_SENSORS[key].icon).toBe('mdi:molecule');
    const d = build(key, 12);
    expect(d.is_mdi).toBe(true);
    expect(d.mdi_icon).toBe('mdi:molecule');
    expect(d.img_src).toBeUndefined();
  });
});

describe('the scale is borrowed, and the code says so rather than implying it', () => {
  it.each(TRANSPOSED)('%s carries the PM2.5 scale, unchanged', key => {
    expect(AIR_QUALITY_SENSORS[key].limits).toEqual(WHO_PM25_SCALE);
    expect(AIR_QUALITY_SENSORS[key].limits).toEqual(AIR_QUALITY_SENSORS.pm25.limits);
  });

  // The bounds are identical to a row whose every bound is quoted, so the only
  // thing separating the two is the status written beside them. If that ever
  // drifts, these become WHO values for a fraction WHO never measured.
  // threshold-provenance.test.js checks the wording bound by bound; this checks
  // the pair cannot be confused.
  it.each(TRANSPOSED)('%s does not inherit pm25 provenance along with pm25 numbers', key => {
    const block = provenanceBlock(key);
    expect(block, `${key} claims a bound is published`).not.toMatch(/taken as published/);
    expect(block, `${key} does not say the bounds are ours`).toMatch(/OURS/);
    expect(block, `${key} does not say the numbers are the PM2.5 ones`).toMatch(/PM2\.5/);
  });
});

// The asymmetry is the part a reader six months from now will not reconstruct
// on their own, and getting it backwards is what would make this dangerous.
// Mass is nested: PM1 <= PM2.5 <= PM4 <= PM10.
describe('the two transpositions do not have the same standing', () => {
  it('says PM4 is prudent, and why', () => {
    const block = provenanceBlock('pm4');
    expect(block).toContain('PRUDENT');
    // A PM4 under the limit guarantees PM2.5 is under it too, because PM2.5 is
    // contained in PM4. The scale can only be harsher than the published one.
    expect(block).toMatch(/PM2\.5 is contained in PM4/);
  });

  it('says PM1 is optimistic, and warns rather than reassures', () => {
    const block = provenanceBlock('pm1');
    expect(block).toContain('OPTIMISTIC');
    // A PM1 under the limit says nothing about PM2.5, which can be far higher.
    expect(block).toMatch(/PM1 is contained in PM2\.5/);
    expect(block).toMatch(/says nothing about PM2\.5, which can be far higher/);
  });

  // Reusing the looser PM10 scale on PM4 would have inverted the containment
  // argument: a PM4 of 40 would read Good while the PM2.5 inside it sat at
  // nearly three times the WHO level. Checked as behaviour, not as prose.
  it('does not let PM4 use the PM10 scale, which would run the argument backwards', () => {
    expect(AIR_QUALITY_SENSORS.pm4.limits).not.toEqual(AIR_QUALITY_SENSORS.pm10.limits);
    expect(build('pm4', 40).state).not.toBe('Good');
    expect(build('pm10', 40).state).toBe('Good');
  });
});
