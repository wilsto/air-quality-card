# Changelog

All notable changes to Air Quality Card will be documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/).

## [0.3.0] - 2026-02-23

### Added

- Visual card editor with live preview — configure cards directly from the HA UI
- Cards now appear in the Home Assistant card picker under "Custom cards"
- Sensor list with expand/collapse, entity picker, and delete per sensor
- Preset sensor dropdown with all 12 air quality presets
- Display Options and Colors sections in editor

### Fixed

- Cards no longer crash when multiple monitor cards are on the same dashboard

## [0.2.0] - 2026-02-23

### Changed

- Migrated entire codebase from JavaScript to TypeScript
- Added Lit decorators (@customElement, @property, @state) replacing static properties
- Centralized type system with typed interfaces (CardConfig, SensorData, HomeAssistant)
- Added typescript-eslint support to ESLint configuration

### Added

- TypeScript strict mode with typed sensor registry and card configuration
- Shared `ha/types.ts` module for Home Assistant type definitions

## [0.1.0] - 2026-02-21

### Added

- Initial release as part of monitor-cards monorepo
- Indoor/outdoor air quality sensor monitoring (PM2.5, PM10, CO2, VOC, etc.)
