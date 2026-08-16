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
(window as any).customCards.push({
  type: 'air-quality-card',
  name: 'Air Quality Card',
  description: 'Monitor indoor air quality (CO2, PM2.5, VOC, humidity, temperature, etc.)',
  preview: true,
  documentationURL: 'https://github.com/wilsto/air-quality-card',
  // Home Assistant 2026.6 and later: offer this card when the user picks an
  // entity this card actually has a preset for. Returns null otherwise, so
  // the picker does not fill up with cards that cannot render the reading.
  getEntitySuggestion: buildEntitySuggestion(
    'air-quality-card',
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
    cardType: 'air-quality-card',
    cardName: 'Air Quality Card',
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

defineCard('air-quality-card', AirQualityCard);
