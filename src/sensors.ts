import type { SensorsRegistry } from './ha/types.js';

export const AIR_QUALITY_SENSORS: SensorsRegistry = {
  temperature: {
    name: 'Temperature',
    unit: '°C',
    setpoint: 21,
    step: 1,
    mode: 'heatflow',
    category: 'comfort',
  },
  humidity: {
    name: 'Humidity',
    unit: '%',
    setpoint: 45,
    step: 5,
    mode: 'centric',
    min_limit: 0,
    category: 'comfort',
  },
  // Carbon monoxide. Not our judgement: every bound is a WHO indoor air quality
  // guideline value, converted from mg/m³ to ppm at 1 ppm = 1.145 mg/m³. CO is a
  // safety matter, and a wrong threshold here is worse than no threshold.
  //
  //    6 ppm - taken as published: WHO 7 mg/m³ over 24 hours.
  //    9 ppm - taken as published: WHO 10 mg/m³ over 8 hours.
  //   30 ppm - taken as published: WHO 35 mg/m³ over 1 hour.
  //   87 ppm - taken as published: WHO 100 mg/m³ over 15 minutes.
  //
  // https://www.ncbi.nlm.nih.gov/books/NBK138710/
  co: {
    name: 'Carbon Monoxide',
    unit: 'ppm',
    // No artwork for this one: without an explicit icon the card looks for
    // co.png and renders a broken image.
    icon: 'mdi:molecule-co',
    limits: [6, 9, 30, 87],
    direction: 'lower_is_better',
    min_limit: 0,
    category: 'gases',
  },

  // Carbon dioxide. THIS IS A VENTILATION CONVENTION, NOT A HEALTH THRESHOLD.
  // No public health authority publishes a CO2 guideline value for indoor air,
  // because at domestic concentrations CO2 is a proxy for how well a room is
  // aired, not a poison. This scale says "open a window". It must never be read
  // as saying "this air is safe to breathe".
  //
  //    500 ppm - OURS, deduced. Sits just above the 250-400 ppm outdoor
  //              background Airthings cites. No source puts a boundary here.
  //    800 ppm - OURS, deduced by interpolation inside the 400-1000 ppm band
  //              Airthings calls "typical of a well ventilated indoor space".
  //              800 circulates widely as a ventilation target, but the primary
  //              document could not be read, so it is not claimed as sourced.
  //   1000 ppm - taken as published: an Airthings band boundary, and the
  //              hundred-year-old Pettenkofer ventilation convention.
  //   2000 ppm - taken as published: the Airthings band boundary above which its
  //              guide reports headaches and loss of concentration.
  //
  // https://www.airthings.com/en/contaminants/what-is-carbon-dioxide
  //
  // @rpirsc13 uses [500, 800, 1200, 2500] (wilsto/air-quality-card#4). The two
  // upper bounds are his own, pushed above the guide's so the old interpolated
  // gradient would break at the right place. The rendering now breaks on the
  // limit itself, so the published numbers are used unmodified.
  co2: {
    name: 'CO2',
    unit: 'ppm',
    limits: [500, 800, 1000, 2000],
    direction: 'lower_is_better',
    min_limit: 0,
    category: 'gases',
  },
  // PM2.5. Every bound is a WHO 2021 published figure for the 24-hour averaging
  // period, taken from the summary table of recommended AQG levels and interim
  // targets. Nothing here is ours.
  //
  //     15 µg/m³ - taken as published: the WHO 24-hour AQG level.
  //   37.5 µg/m³ - taken as published: WHO 24-hour interim target 3.
  //     50 µg/m³ - taken as published: WHO 24-hour interim target 2.
  //     75 µg/m³ - taken as published: WHO 24-hour interim target 1.
  //
  // https://www.ncbi.nlm.nih.gov/books/NBK574591/table/ch3.tab24/
  //
  // Interim target 4 (25 µg/m³) is left out so both particulate scales are read
  // the same way: on PM10 it sits 5 µg/m³ above the guideline level and would
  // make a band too narrow to see. The guidelines also note the 24-hour figures
  // are 99th percentiles, three to four exceedance days a year, which a live
  // reading is not; the scale answers "how does this compare", not "have I
  // breached a guideline".
  //
  // @rpirsc13's [2, 5, 10, 15] is not used: 5 and 15 are the WHO annual and
  // 24-hour AQG levels, but 2 and 10 are his own, and mixing an annual value
  // into a short-term scale compares two different things.
  pm25: {
    name: 'PM2.5',
    unit: 'µg/m³',
    limits: [15, 37.5, 50, 75],
    direction: 'lower_is_better',
    min_limit: 0,
    category: 'particulates',
  },
  // PM10. Same source, same averaging period, same selection as PM2.5.
  //
  //    45 µg/m³ - taken as published: the WHO 24-hour AQG level.
  //    75 µg/m³ - taken as published: WHO 24-hour interim target 3.
  //   100 µg/m³ - taken as published: WHO 24-hour interim target 2.
  //   150 µg/m³ - taken as published: WHO 24-hour interim target 1.
  //
  // https://www.ncbi.nlm.nih.gov/books/NBK574591/table/ch3.tab24/
  pm10: {
    name: 'PM10',
    unit: 'µg/m³',
    limits: [45, 75, 100, 150],
    direction: 'lower_is_better',
    min_limit: 0,
    category: 'particulates',
  },
  // PM1 and PM4 complete the four fractions a common sensor reports (#67), and
  // neither has a published scale. No authority sets one: WHO 2021 covers PM2.5
  // and PM10 only, its chapter on other PM types offering good practice
  // statements rather than guideline values; Directive (EU) 2024/2881 does not
  // list either size among the pollutants it sets assessment thresholds for;
  // and Airthings, the vendor guide this card already borrows radon and VOC
  // bands from, publishes none, calling PM2.5 its "officially supported and
  // documented" metric while PM1 is only "also shown".
  //
  // So both scales below are the PM2.5 scale, transposed. PO decision (#67),
  // taken against the recommendation to ship the names alone. Every bound is
  // OURS: the number is published, its application to this size fraction is
  // not. They are not WHO values for PM1 or PM4, and must never be quoted as
  // such. They are WHO values for PM2.5, used somewhere else on purpose.
  //
  // The two transpositions do not have the same standing, and the difference is
  // the whole reason this comment is long. Mass is nested, PM1 <= PM2.5 <= PM4
  // <= PM10: each fraction contains the smaller ones.

  // PM1. THIS TRANSPOSITION IS OPTIMISTIC, AND A GREEN BAR HERE PROVES NOTHING.
  // PM1 is contained in PM2.5, so a PM1 reading below the limit says nothing
  // about PM2.5, which can be far higher: the particles between 1 and 2.5 µm are
  // not counted here at all. Good PM1 is not evidence of good air. The PM4
  // transposition below runs the other way and is prudent; this one is not.
  //
  //     15 µg/m³ - OURS. The WHO 2021 24-hour AQG level for PM2.5, read off
  //                this table and applied to PM1 by choice.
  //   37.5 µg/m³ - OURS. WHO 24-hour interim target 3 for PM2.5, likewise.
  //     50 µg/m³ - OURS. WHO 24-hour interim target 2 for PM2.5, likewise.
  //     75 µg/m³ - OURS. WHO 24-hour interim target 1 for PM2.5, likewise.
  //
  // https://www.ncbi.nlm.nih.gov/books/NBK574591/table/ch3.tab24/
  //
  // No artwork exists for this one: without an explicit icon the card looks for
  // pm1.png and renders a broken image, as CO did before it got its own.
  pm1: {
    name: 'PM1',
    unit: 'µg/m³',
    icon: 'mdi:molecule',
    limits: [15, 37.5, 50, 75],
    direction: 'lower_is_better',
    min_limit: 0,
    category: 'particulates',
  },
  // PM4. THIS TRANSPOSITION IS PRUDENT, WHICH IS WHY IT IS NOT THE PM10 SCALE.
  // PM2.5 is contained in PM4, so a PM4 reading below the limit guarantees PM2.5
  // is below it too: the scale can only ever be harsher than the published one,
  // never more forgiving. Reusing the looser PM10 scale here would have inverted
  // that and let a PM4 of 40 read Good while its PM2.5 content sat at nearly
  // three times the WHO level.
  //
  //     15 µg/m³ - OURS. The WHO 2021 24-hour AQG level for PM2.5, applied to
  //                PM4 by choice.
  //   37.5 µg/m³ - OURS. WHO 24-hour interim target 3 for PM2.5, likewise.
  //     50 µg/m³ - OURS. WHO 24-hour interim target 2 for PM2.5, likewise.
  //     75 µg/m³ - OURS. WHO 24-hour interim target 1 for PM2.5, likewise.
  //
  // https://www.ncbi.nlm.nih.gov/books/NBK574591/table/ch3.tab24/
  //
  // The only published number that touches this size is occupational and does
  // not belong on a living room card: the respirable fraction, which ISO 7708
  // defines with the same 4 µm cut, carries an OSHA permissible exposure limit
  // of 5 mg/m³ over eight hours for healthy adults at work. That is 5000 µg/m³,
  // over three hundred times the WHO PM2.5 figure above.
  // https://www.osha.gov/annotated-pels/table-z-1
  //
  // No pm4.png either, so the icon is explicit for the same reason as PM1.
  pm4: {
    name: 'PM4',
    unit: 'µg/m³',
    icon: 'mdi:molecule',
    limits: [15, 37.5, 50, 75],
    direction: 'lower_is_better',
    min_limit: 0,
    category: 'particulates',
  },

  // VOC. THIS IS A SENSOR VENDOR INDEX, NOT A STANDARD. No authority publishes
  // a total-VOC guideline value. The reading is a "digital nose" number rather
  // than the measurement of a named substance, so this scale ranks readings
  // against each other and says nothing about health. It answers "is something
  // off-gassing more than usual", never "is this air safe".
  //
  // Shipped on PO decision (#32) against the recommendation to ship nothing.
  // The condition of that decision is this label.
  //
  //    250 ppb - taken as published: the top of the Airthings band described as
  //              "The VOC contents in the air are low".
  //              https://www.airthings.com/what-is-voc
  //    500 ppb - OURS, interpolated between 250 and 2000. No source.
  //   1000 ppb - OURS, interpolated between 250 and 2000. No source.
  //   2000 ppb - taken as published: the Airthings threshold above which its
  //              guide says "consider taking action/ventilating right now".
  //
  // One caveat the guide states and this scale cannot: its middle band reads
  // "Look for VOC sources if this average level persists for a month". It is a
  // month-long average, so a single reading crossing 250 ppb is not what the
  // source is talking about.
  //
  // @rpirsc13's [100, 200, 250, 400] is deliberately not used: only 250 is a
  // boundary of the guide he cites, and his top bound of 400 sits five times
  // below the 2000 ppb at which that guide says to act.
  voc: {
    name: 'VOC',
    unit: 'ppb',
    limits: [250, 500, 1000, 2000],
    direction: 'lower_is_better',
    min_limit: 0,
    category: 'gases',
  },
  // TVOC. Not the vendor index used for `voc` above: that index is published in
  // ppb, this preset reports µg/m³, and converting between the two needs a
  // molecular weight nobody can know for an unidentified mixture. Rather than
  // invent a conversion factor, this scale uses a source already expressed in
  // µg/m³, and a better one: the German Federal Environment Agency's five-level
  // hygienic TVOC rating, whose five levels map exactly onto the five bands.
  //
  //     300 µg/m³ - taken as published: top of Stufe 1, "hygienisch
  //                 unbedenklich", the target value (0.3 mg/m³).
  //    1000 µg/m³ - taken as published: top of Stufe 2, "hygienisch noch
  //                 unbedenklich, erhöhter Lüftungsbedarf" (1 mg/m³).
  //    3000 µg/m³ - taken as published: top of Stufe 3, "hygienisch auffällig",
  //                 an upper limit for rooms in long-term use (3 mg/m³).
  //   10000 µg/m³ - taken as published: top of Stufe 4, "hygienisch bedenklich"
  //                 (10 mg/m³). Above it, Stufe 5 is "hygienisch inakzeptabel".
  //
  // Umweltbundesamt, "Beurteilung von Innenraumluftkontaminationen mittels
  // Referenz- und Richtwerten", Bundesgesundheitsblatt 2007, 50:990-1005.
  // https://www.umweltbundesamt.de/system/files/medien/pdfs/Handreichung.pdf
  //
  // The source has a sixth boundary at 25 mg/m³, above which it says the room
  // should not be occupied at all. A four-limit scale cannot carry it, so the
  // worst band here starts at 10 mg/m³ and covers both. The paper also
  // contradicts itself on the edges of the first and last levels, printing
  // "< 0,3" in its summary and "≤ 0,3" in its table; a 300 µg/m³ reading lands
  // one band either way and the difference is not material to the display.
  tvoc: {
    name: 'TVOC',
    unit: 'µg/m³',
    limits: [300, 1000, 3000, 10000],
    direction: 'lower_is_better',
    min_limit: 0,
    category: 'gases',
  },
  // Formaldehyde. Two of the four bounds are ours, and are marked as such: no
  // authority publishes a graded indoor scale for it, only a single guideline
  // value. The scale is honest about which half of it is borrowed.
  //
  //    10 µg/m³ - OURS, no source. @rpirsc13's own subdivision of the safe zone
  //               (wilsto/air-quality-card#4), which he states is his.
  //    30 µg/m³ - OURS, no source. Same subdivision.
  //    50 µg/m³ - taken as published: the eight-hour figure (about 40 ppb) in
  //               the Airly guide, which cites no authority for it.
  //               https://airly.org/en/acceptable-levels-of-formaldehyde-in-air-how-to-test-it
  //   100 µg/m³ - taken as published: WHO 2010 indoor air quality guideline,
  //               0.1 mg/m³ over any 30-minute period. The only bound here that
  //               carries a health meaning, and the one the scale turns bad on.
  //               https://www.ncbi.nlm.nih.gov/books/NBK138711/
  //
  // The ANSES figures were looked at and dropped: the search returned 10 and
  // 100 µg/m³ for the same long-term value on different pages, so nothing from
  // that trail is used until it is read at the source.
  formaldehyde: {
    name: 'Formaldehyde',
    unit: 'µg/m³',
    limits: [10, 30, 50, 100],
    direction: 'lower_is_better',
    min_limit: 0,
    category: 'gases',
  },
  // Radon. The one pollutant on this card where public health guidance, a
  // national action level and the sensor vendor all agree. Three of the four
  // bounds hold up without us.
  //
  //    50 Bq/m³ - OURS, deduced. The Low/Good boundary of the Airthings scale,
  //               which has no public health counterpart.
  //               https://www.airthings.com/resources/radon-levels
  //   100 Bq/m³ - taken as published: the WHO reference level for the annual
  //               average residential radon concentration.
  //               https://www.who.int/news-room/fact-sheets/detail/radon-and-health
  //   150 Bq/m³ - taken as published, two sources converging: the Airthings
  //               Fair/Poor boundary, and the US EPA action level of 4 pCi/L,
  //               which is 148 Bq/m³.
  //   300 Bq/m³ - taken as published: the ceiling the WHO says a national
  //               reference level should not exceed.
  radon: {
    name: 'Radon',
    unit: 'Bq/m³',
    limits: [50, 100, 150, 300],
    direction: 'lower_is_better',
    min_limit: 0,
    category: 'gases',
  },
  aqi: {
    name: 'Air Quality Index',
    unit: 'AQI',
    setpoint: 50,
    step: 25,
    mode: 'centric',
    min_limit: 0,
    category: 'particulates',
  },
  pressure: {
    name: 'Atmospheric Pressure',
    unit: 'hPa',
    setpoint: 1013,
    step: 10,
    mode: 'centric',
    category: 'environment',
  },
  noise: {
    name: 'Noise Level',
    unit: 'dB',
    setpoint: 40,
    step: 10,
    mode: 'centric',
    min_limit: 0,
    category: 'comfort',
  },
};
