import { describe, test, expect, beforeEach } from 'vitest';
import { AirQualityCard } from '../src/air-quality-card.js';
import { AIR_QUALITY_SENSORS } from '../src/sensors.js';

const validConfig = {
  sensors: {
    co2: { entity: 'sensor.living_room_co2' },
  },
};

describe('AirQualityCard', () => {
  let card;

  beforeEach(() => {
    card = new AirQualityCard();
  });

  describe('static properties', () => {
    test('should have CARD_INFO with required fields', () => {
      expect(AirQualityCard.CARD_INFO).toBeDefined();
      expect(AirQualityCard.CARD_INFO.cardType).toBe('air-monitor-card');
      expect(AirQualityCard.CARD_INFO.cardName).toBe('Air Monitor Card');
      expect(typeof AirQualityCard.CARD_INFO.cardDescription).toBe('string');
    });

    test('should have SENSORS equal to AIR_QUALITY_SENSORS', () => {
      expect(AirQualityCard.SENSORS).toBe(AIR_QUALITY_SENSORS);
    });

    test('should have IMAGE_BASE_URL', () => {
      expect(AirQualityCard.IMAGE_BASE_URL).toContain('air-quality-card');
    });
  });

  // `air-quality-card` is claimed by four cards on GitHub, so the card answers
  // to a canonical name as well: existing configurations keep working, new ones
  // get a name nobody disputes (wilsto/air-quality-card#3). Both names must
  // render the same card, forever.
  describe('dual element registration', () => {
    test('the canonical and the legacy name are both registered', () => {
      expect(customElements.get('air-monitor-card')).toBeDefined();
      expect(customElements.get('air-quality-card')).toBeDefined();
    });

    test('the legacy name renders the same card as the canonical one', () => {
      const Legacy = customElements.get('air-quality-card');
      expect(Object.getPrototypeOf(Legacy)).toBe(AirQualityCard);
    });
  });

  describe('setConfig', () => {
    test('should accept valid configuration', () => {
      expect(() => card.setConfig(validConfig)).not.toThrow();
    });

    test('should throw if sensors key is missing', () => {
      expect(() => card.setConfig({})).toThrow('sensors');
    });

    test('should throw if sensor entity is missing', () => {
      expect(() => card.setConfig({ sensors: { co2: {} } })).toThrow('entity');
    });

    test('should throw on empty sensor array', () => {
      expect(() => card.setConfig({ sensors: { co2: [] } })).toThrow('Empty sensor array');
    });

    test('should merge display defaults', () => {
      card.setConfig(validConfig);
      const cfg = card.getConfig();
      expect(cfg.display.show_names).toBe(true);
      expect(cfg.display.language).toBe('en');
    });

    test('should override display defaults with user values', () => {
      card.setConfig({ ...validConfig, display: { compact: true, language: 'fr' } });
      const cfg = card.getConfig();
      expect(cfg.display.compact).toBe(true);
      expect(cfg.display.language).toBe('fr');
      // other defaults remain
      expect(cfg.display.show_names).toBe(true);
    });

    test('should merge registry defaults into a configured sensor', () => {
      card.setConfig(validConfig);
      const [sensor] = card.getConfig().sensors.co2;
      expect(sensor.setpoint).toBe(AIR_QUALITY_SENSORS.co2.setpoint);
      expect(sensor.unit).toBe(AIR_QUALITY_SENSORS.co2.unit);
    });

    // A band sensor keeps its limits through the merge: losing them would
    // silently turn a WHO safety scale into a centric one around nothing.
    test('should carry band limits through the merge', () => {
      card.setConfig({ sensors: { co: { entity: 'sensor.co' } } });
      const [sensor] = card.getConfig().sensors.co;
      expect(sensor.limits).toEqual(AIR_QUALITY_SENSORS.co.limits);
      expect(sensor.direction).toBe('lower_is_better');
    });

    // A key outside the registry is kept but flagged, so the card can say
    // "unknown sensor" in place rather than silently dropping the entry.
    test('should flag a sensor type the registry does not know', () => {
      card.setConfig({ sensors: { plutonium: { entity: 'sensor.plutonium' } } });
      expect(card.getConfig().sensors.plutonium[0].invalid).toBe(true);
    });
  });
});
