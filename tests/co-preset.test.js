import { describe, it, expect } from 'vitest';
import { AirQualityCard } from '../src/air-quality-card.js';
import { AIR_QUALITY_SENSORS } from '../src/sensors.js';

// @renevelasco123 on air-quality-card#5 reported the card "does not work" for
// the Amazon Smart Air Quality Monitor. That device measures carbon monoxide,
// and the card had no CO preset — only CO2.
//
// The thresholds are the WHO indoor air quality guideline values converted to
// ppm (7 mg/m3 over 24h, 10 over 8h, 35 over 1h, 100 over 15min). They are
// published limits, not our judgement: CO is a safety matter and a wrong
// threshold here is worse than none.
const build = ppm => {
  const card = new AirQualityCard();
  card.hass = {
    states: {
      'sensor.co': { state: String(ppm), attributes: {}, last_updated: '2026-08-15T10:00:00Z' },
    },
    entities: {},
  };
  card.setConfig({ sensors: { co: { entity: 'sensor.co' } } });
  return card.processData().co_1;
};

describe('carbon monoxide preset', () => {
  it('exists, because the card had CO2 but not CO', () => {
    expect(AIR_QUALITY_SENSORS.co).toBeDefined();
    expect(AIR_QUALITY_SENSORS.co.unit).toBe('ppm');
  });

  it('drives its scale from the WHO thresholds, not from a made-up setpoint', () => {
    expect(AIR_QUALITY_SENSORS.co.limits).toEqual([6, 9, 30, 87]);
    expect(build(3).setpoint_class.map(Number)).toEqual([0, 6, 9, 30, 87]);
  });

  it('reads lower as better', () => {
    expect(build(3).color).not.toBe(build(50).color);
  });
});

// Cards with an IMAGE_BASE_URL look for `<key>.png` and render a broken image
// when the artwork is absent — which is what a new preset always is. A preset
// can therefore declare an MDI icon, and the card must prefer it over guessing
// at a file that does not exist.
describe('a preset can carry its own icon', () => {
  it('declares one, because there is no co.png', () => {
    expect(AIR_QUALITY_SENSORS.co.icon).toBe('mdi:molecule-co');
  });

  it('the card uses it rather than looking for artwork', () => {
    const d = build(3);
    expect(d.is_mdi).toBe(true);
    expect(d.mdi_icon).toBe('mdi:molecule-co');
    expect(d.img_src).toBeUndefined();
  });

  it('a user-supplied icon still wins over the preset', () => {
    const card = new AirQualityCard();
    card.hass = {
      states: { 'sensor.co': { state: '3', attributes: {}, last_updated: '2026-08-15T10:00:00Z' } },
      entities: {},
    };
    card.setConfig({ sensors: { co: { entity: 'sensor.co', icon: 'mdi:alert' } } });
    expect(card.processData().co_1.mdi_icon).toBe('mdi:alert');
  });
});
