import { MonitorCardBase, defineCard } from './card-base.js';
import { AIR_QUALITY_SENSORS } from './sensors.js';
import type { SensorsRegistry, CardInfo } from './ha/types.js';
import { buildEntitySuggestion } from './entity-suggestion.js';

declare let __BUILD_TIMESTAMP__: string;
declare let __BUILD_VERSION__: string;

const VERSION = typeof __BUILD_VERSION__ !== 'undefined' ? __BUILD_VERSION__ : 'dev';
const BUILD_TIMESTAMP = typeof __BUILD_TIMESTAMP__ !== 'undefined' ? __BUILD_TIMESTAMP__ : 'dev';
const CARD_VERSION = `${VERSION} (${BUILD_TIMESTAMP})`;

console.info(
  `%c AIR-QUALITY-CARD %c ${CARD_VERSION} `,
  'color: white; background: #00b894; font-weight: 700;',
  'color: #00b894; background: white; font-weight: 700;',
);

(window as any).customCards = (window as any).customCards || [];
/**
 * `air-quality-card` is claimed by four cards on GitHub, ours included, and a
 * fifth already uses `air-quality-monitor-card`. Whichever loads second is
 * simply not there for the user (wilsto/air-quality-card#3, @LouiS22).
 *
 * Renaming outright would break every existing configuration, so the card
 * answers to both: the old name for the installations that already use it, and
 * a canonical one. New cards get the canonical name, from the picker and from
 * the entity suggestion alike.
 *
 * `air-monitor-card` follows the family, next to `pool-monitor-card`,
 * `aquarium-monitor-card` and `sensor-monitor-card`, and `custom:air-monitor-card`
 * had zero occurrences on GitHub when it was chosen (2026-08-16). It is a less
 * obvious name to reach for than "air quality card", which is precisely why
 * four people reached for that one.
 */
const CANONICAL = 'air-monitor-card';
const LEGACY = 'air-quality-card';

(window as any).customCards.push({
  type: CANONICAL,
  name: 'Air Monitor Card',
  description: 'Monitor indoor air quality (CO2, PM2.5, VOC, humidity, temperature, etc.)',
  preview: true,
  documentationURL: 'https://github.com/wilsto/air-quality-card',
  // Home Assistant 2026.6 and later: offer this card when the user picks an
  // entity this card actually has a preset for. Returns null otherwise, so
  // the picker does not fill up with cards that cannot render the reading.
  getEntitySuggestion: buildEntitySuggestion(
    CANONICAL,
    AIR_QUALITY_SENSORS,
    {
      carbon_monoxide: 'co',
      carbon_dioxide: 'co2',
      pm25: 'pm25',
      pm10: 'pm10',
      volatile_organic_compounds: 'voc',
      volatile_organic_compounds_parts: 'voc',
    },
    ['co2', 'co', 'pm25', 'pm10', 'tvoc', 'voc', 'formaldehyde', 'radon', 'aqi'],
  ),
});

export class AirQualityCard extends MonitorCardBase {
  static CARD_INFO: CardInfo = {
    cardType: 'air-monitor-card',
    cardName: 'Air Monitor Card',
    cardDescription:
      'A Home Assistant card for monitoring indoor and outdoor air quality (CO2, PM2.5, VOC, humidity, etc.)',
  };

  static SENSORS: SensorsRegistry = AIR_QUALITY_SENSORS;

  static IMAGE_BASE_URL =
    'https://raw.githubusercontent.com/wilsto/air-quality-card/master/resources';

  static async getConfigElement(): Promise<HTMLElement> {
    await import('./editor.js');
    return document.createElement('air-quality-card-editor');
  }

  static getStubConfig(): Record<string, unknown> {
    return {
      sensors: {
        co2: { entity: '' },
      },
    };
  }
}

defineCard(CANONICAL, AirQualityCard);

/**
 * The legacy name needs its own constructor: `customElements.define` refuses a
 * class that is already registered under another name. A bare subclass is the
 * whole of it, so both names render exactly the same card.
 */
class AirQualityCardLegacy extends AirQualityCard {}
defineCard(LEGACY, AirQualityCardLegacy);
