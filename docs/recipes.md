# Air Monitor Card: Recipes

Home Assistant `template` sensors that plug into this card. The card reads
entities; these build the entities it cannot build itself. Paste a block into
your Home Assistant configuration, reload templates, and point the card at the
entity it creates.

Every entity id written `sensor.YOUR_SOMETHING` is a placeholder for one of
yours. Nothing on this page is a card option, and nothing here needs a new
release of the card to work.

## Reading the card's own bands from an automation

The card colours a reading and names its band on screen, and that name never
leaves the browser. These sensors put the same name in an entity state, so an
automation can trigger on it:

```yaml
trigger:
  - platform: state
    entity_id: sensor.co_band
    to: "Very Poor"
```

The four boundaries and their order are the card's own, read from the same
registry the card reads, so a threshold that moves in a release moves here
too. What the card does *not* apply, and neither do these, is any per-sensor
`limits` you wrote in your own card configuration: these follow the presets.

**Not verified.** These blocks have not been run on a Home Assistant instance. Their numbers and their band order are checked against the card by a test; their YAML is not.

### Carbon Monoxide (`co`)

| Reading, in ppm | Band |
| --- | --- |
| below 6 | Good |
| 6 to 9 | Fair |
| 9 to 30 | Moderate |
| 30 to 87 | Poor |
| 87 and above | Very Poor |

```yaml
template:
  - sensor:
      - name: "Carbon Monoxide band"
        unique_id: co_band
        state: >
          {% set v = states('sensor.YOUR_CO') | float(0) %}
          {{ 'Good' if v < 6 else 'Fair' if v < 9 else 'Moderate' if v < 30 else 'Poor' if v < 87 else 'Very Poor' }}
        availability: "{{ states('sensor.YOUR_CO') | is_number }}"
```

Sources the registry cites for these bounds: <https://www.ncbi.nlm.nih.gov/books/NBK138710/>.

### CO2 (`co2`)

| Reading, in ppm | Band |
| --- | --- |
| below 500 | Good |
| 500 to 800 | Fair |
| 800 to 1000 | Moderate |
| 1000 to 2000 | Poor |
| 2000 and above | Very Poor |

```yaml
template:
  - sensor:
      - name: "CO2 band"
        unique_id: co2_band
        state: >
          {% set v = states('sensor.YOUR_CO2') | float(0) %}
          {{ 'Good' if v < 500 else 'Fair' if v < 800 else 'Moderate' if v < 1000 else 'Poor' if v < 2000 else 'Very Poor' }}
        availability: "{{ states('sensor.YOUR_CO2') | is_number }}"
```

Not every bound here is a published figure: the registry marks `OURS` the ones it deduced. It cites, alongside them: <https://www.airthings.com/en/contaminants/what-is-carbon-dioxide>.

### PM2.5 (`pm25`)

| Reading, in µg/m³ | Band |
| --- | --- |
| below 15 | Good |
| 15 to 37.5 | Fair |
| 37.5 to 50 | Moderate |
| 50 to 75 | Poor |
| 75 and above | Very Poor |

```yaml
template:
  - sensor:
      - name: "PM2.5 band"
        unique_id: pm25_band
        state: >
          {% set v = states('sensor.YOUR_PM25') | float(0) %}
          {{ 'Good' if v < 15 else 'Fair' if v < 37.5 else 'Moderate' if v < 50 else 'Poor' if v < 75 else 'Very Poor' }}
        availability: "{{ states('sensor.YOUR_PM25') | is_number }}"
```

Sources the registry cites for these bounds: <https://www.ncbi.nlm.nih.gov/books/NBK574591/table/ch3.tab24/>.

### PM10 (`pm10`)

| Reading, in µg/m³ | Band |
| --- | --- |
| below 45 | Good |
| 45 to 75 | Fair |
| 75 to 100 | Moderate |
| 100 to 150 | Poor |
| 150 and above | Very Poor |

```yaml
template:
  - sensor:
      - name: "PM10 band"
        unique_id: pm10_band
        state: >
          {% set v = states('sensor.YOUR_PM10') | float(0) %}
          {{ 'Good' if v < 45 else 'Fair' if v < 75 else 'Moderate' if v < 100 else 'Poor' if v < 150 else 'Very Poor' }}
        availability: "{{ states('sensor.YOUR_PM10') | is_number }}"
```

Sources the registry cites for these bounds: <https://www.ncbi.nlm.nih.gov/books/NBK574591/table/ch3.tab24/>.

### PM1 (`pm1`)

| Reading, in µg/m³ | Band |
| --- | --- |
| below 15 | Good |
| 15 to 37.5 | Fair |
| 37.5 to 50 | Moderate |
| 50 to 75 | Poor |
| 75 and above | Very Poor |

```yaml
template:
  - sensor:
      - name: "PM1 band"
        unique_id: pm1_band
        state: >
          {% set v = states('sensor.YOUR_PM1') | float(0) %}
          {{ 'Good' if v < 15 else 'Fair' if v < 37.5 else 'Moderate' if v < 50 else 'Poor' if v < 75 else 'Very Poor' }}
        availability: "{{ states('sensor.YOUR_PM1') | is_number }}"
```

Not every bound here is a published figure: the registry marks `OURS` the ones it deduced. It cites, alongside them: <https://www.ncbi.nlm.nih.gov/books/NBK574591/table/ch3.tab24/>.

### PM4 (`pm4`)

| Reading, in µg/m³ | Band |
| --- | --- |
| below 15 | Good |
| 15 to 37.5 | Fair |
| 37.5 to 50 | Moderate |
| 50 to 75 | Poor |
| 75 and above | Very Poor |

```yaml
template:
  - sensor:
      - name: "PM4 band"
        unique_id: pm4_band
        state: >
          {% set v = states('sensor.YOUR_PM4') | float(0) %}
          {{ 'Good' if v < 15 else 'Fair' if v < 37.5 else 'Moderate' if v < 50 else 'Poor' if v < 75 else 'Very Poor' }}
        availability: "{{ states('sensor.YOUR_PM4') | is_number }}"
```

Not every bound here is a published figure: the registry marks `OURS` the ones it deduced. It cites, alongside them: <https://www.ncbi.nlm.nih.gov/books/NBK574591/table/ch3.tab24/>, <https://www.osha.gov/annotated-pels/table-z-1>.

### VOC (`voc`)

| Reading, in ppb | Band |
| --- | --- |
| below 250 | Good |
| 250 to 500 | Fair |
| 500 to 1000 | Moderate |
| 1000 to 2000 | Poor |
| 2000 and above | Very Poor |

```yaml
template:
  - sensor:
      - name: "VOC band"
        unique_id: voc_band
        state: >
          {% set v = states('sensor.YOUR_VOC') | float(0) %}
          {{ 'Good' if v < 250 else 'Fair' if v < 500 else 'Moderate' if v < 1000 else 'Poor' if v < 2000 else 'Very Poor' }}
        availability: "{{ states('sensor.YOUR_VOC') | is_number }}"
```

Not every bound here is a published figure: the registry marks `OURS` the ones it deduced. It cites, alongside them: <https://www.airthings.com/what-is-voc>.

### TVOC (`tvoc`)

| Reading, in µg/m³ | Band |
| --- | --- |
| below 300 | Good |
| 300 to 1000 | Fair |
| 1000 to 3000 | Moderate |
| 3000 to 10000 | Poor |
| 10000 and above | Very Poor |

```yaml
template:
  - sensor:
      - name: "TVOC band"
        unique_id: tvoc_band
        state: >
          {% set v = states('sensor.YOUR_TVOC') | float(0) %}
          {{ 'Good' if v < 300 else 'Fair' if v < 1000 else 'Moderate' if v < 3000 else 'Poor' if v < 10000 else 'Very Poor' }}
        availability: "{{ states('sensor.YOUR_TVOC') | is_number }}"
```

Sources the registry cites for these bounds: <https://www.umweltbundesamt.de/system/files/medien/pdfs/Handreichung.pdf>.

### Formaldehyde (`formaldehyde`)

| Reading, in µg/m³ | Band |
| --- | --- |
| below 10 | Good |
| 10 to 30 | Fair |
| 30 to 50 | Moderate |
| 50 to 100 | Poor |
| 100 and above | Very Poor |

```yaml
template:
  - sensor:
      - name: "Formaldehyde band"
        unique_id: formaldehyde_band
        state: >
          {% set v = states('sensor.YOUR_FORMALDEHYDE') | float(0) %}
          {{ 'Good' if v < 10 else 'Fair' if v < 30 else 'Moderate' if v < 50 else 'Poor' if v < 100 else 'Very Poor' }}
        availability: "{{ states('sensor.YOUR_FORMALDEHYDE') | is_number }}"
```

Not every bound here is a published figure: the registry marks `OURS` the ones it deduced. It cites, alongside them: <https://airly.org/en/acceptable-levels-of-formaldehyde-in-air-how-to-test-it>, <https://www.ncbi.nlm.nih.gov/books/NBK138711/>.

### Radon (`radon`)

| Reading, in Bq/m³ | Band |
| --- | --- |
| below 50 | Good |
| 50 to 100 | Fair |
| 100 to 150 | Moderate |
| 150 to 300 | Poor |
| 300 and above | Very Poor |

```yaml
template:
  - sensor:
      - name: "Radon band"
        unique_id: radon_band
        state: >
          {% set v = states('sensor.YOUR_RADON') | float(0) %}
          {{ 'Good' if v < 50 else 'Fair' if v < 100 else 'Moderate' if v < 150 else 'Poor' if v < 300 else 'Very Poor' }}
        availability: "{{ states('sensor.YOUR_RADON') | is_number }}"
```

Not every bound here is a published figure: the registry marks `OURS` the ones it deduced. It cites, alongside them: <https://www.airthings.com/resources/radon-levels>, <https://www.who.int/news-room/fact-sheets/detail/radon-and-health>.

---

*Generated by `scripts/generate-recipes.js`. Edits made here are lost at the
next publish: change the registry, or the recipe in that file.*
