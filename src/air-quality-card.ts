import { customElement } from 'lit/decorators.js';
import { MonitorCardBase } from '../../core/src/card-base.js';
import { AIR_QUALITY_SENSORS } from './sensors.js';
import type { SensorsRegistry, CardInfo } from '../../core/src/ha/types.js';

declare let __BUILD_TIMESTAMP__: string;

const VERSION = '0.2.0';
const BUILD_TIMESTAMP = typeof __BUILD_TIMESTAMP__ !== 'undefined' ? __BUILD_TIMESTAMP__ : 'dev';
const CARD_VERSION = `${VERSION} (${BUILD_TIMESTAMP})`;

console.info(
  `%c AIR-QUALITY-CARD %c ${CARD_VERSION} `,
  'color: white; background: #00b894; font-weight: 700;',
  'color: #00b894; background: white; font-weight: 700;',
);

@customElement('air-quality-card')
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
}
