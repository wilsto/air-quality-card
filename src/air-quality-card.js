/**
 * @fileoverview Air Quality Card - Home Assistant custom card for air quality monitoring
 * Extends MonitorCardBase with air quality sensor presets.
 */

import { MonitorCardBase } from './card-base.js';
import { AIR_QUALITY_SENSORS } from './sensors.js';

const VERSION = '0.1.0';
/* global __BUILD_TIMESTAMP__ */
const BUILD_TIMESTAMP = typeof __BUILD_TIMESTAMP__ !== 'undefined' ? __BUILD_TIMESTAMP__ : 'dev';
const CARD_VERSION = `${VERSION} (${BUILD_TIMESTAMP})`;

console.info(
  `%c AIR-QUALITY-CARD %c ${CARD_VERSION} `,
  'color: white; background: #00b894; font-weight: 700;',
  'color: #00b894; background: white; font-weight: 700;',
);

export class AirQualityCard extends MonitorCardBase {
  static CARD_INFO = {
    cardType: 'air-quality-card',
    cardName: 'Air Quality Card',
    cardDescription:
      'A Home Assistant card for monitoring indoor and outdoor air quality (CO2, PM2.5, VOC, humidity, etc.)',
  };

  static SENSORS = AIR_QUALITY_SENSORS;

  static IMAGE_BASE_URL =
    'https://raw.githubusercontent.com/wilsto/air-quality-card/master/resources';
}

customElements.define('air-quality-card', AirQualityCard);
