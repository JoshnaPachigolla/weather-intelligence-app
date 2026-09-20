import { CurrentWeatherData, DailyForecastData, WeatherIntelligence, ActivityScore, ClothingGuide } from '../types';
import { getWeatherCondition } from './weatherCodes';

export function computeWeatherIntelligence(
  current: CurrentWeatherData,
  daily: DailyForecastData,
  cityName: string
): WeatherIntelligence {
  const temp = current.temperature_2m;
  const apparentTemp = current.apparent_temperature;
  const humidity = current.relative_humidity_2m;
  const windSpeed = current.wind_speed_10m;
  const weatherCode = current.weather_code;
  const condition = getWeatherCondition(weatherCode);

  const todayPrecipMax = daily.precipitation_probability_max?.[0] ?? 0;
  const todayTempMax = daily.temperature_2m_max?.[0] ?? temp;
  const todayTempMin = daily.temperature_2m_min?.[0] ?? temp;

  // Thermal sensation
  let thermalSensation = 'Moderate & Comfortable';
  if (apparentTemp <= -5) thermalSensation = 'Severe Arctic Chill';
  else if (apparentTemp <= 3) thermalSensation = 'Brisk & Frosty';
  else if (apparentTemp <= 11) thermalSensation = 'Crisp & Chilly';
  else if (apparentTemp <= 18) thermalSensation = 'Cool & Invigorating';
  else if (apparentTemp <= 24) thermalSensation = 'Balmy & Pleasant';
  else if (apparentTemp <= 29) thermalSensation = 'Warm & Sun-drenched';
  else if (apparentTemp <= 34) thermalSensation = 'High Thermal Heat';
  else thermalSensation = 'Intense Tropical Heat';

  // Clothing advice formulation
  const clothing: ClothingGuide = {
    primary: '',
    layers: [],
    accessories: [],
    shoes: 'Comfortable everyday sneakers'
  };

  if (apparentTemp < 2) {
    clothing.primary = 'Heavy insulated winter parka & thermal knitwear';
    clothing.layers = ['Thermal moisture-wicking base', 'Wool/fleece mid-layer', 'Down or insulated heavy shell'];
    clothing.accessories = ['Beanie / insulated hat', 'Fleece-lined gloves', 'Wool neck gaiter'];
    clothing.shoes = 'Insulated water-resistant winter boots with tread';
  } else if (apparentTemp < 11) {
    clothing.primary = 'Midweight tailored coat or fleece-lined trench jacket';
    clothing.layers = ['Comfortable cotton tee', 'Knit sweater or structured hoodie', 'Wind-resistant jacket'];
    clothing.accessories = ['Light scarf', 'Casual beanie if windy'];
    clothing.shoes = 'Weather-sealed boots or leather sneakers';
  } else if (apparentTemp < 18) {
    clothing.primary = 'Light bomber, overshirt, or tailored denim jacket';
    clothing.layers = ['Base t-shirt or blouse', 'Long sleeve or light cardigan', 'Casual jacket for evening'];
    clothing.accessories = ['UV sunglasses', 'Watch/light jewelry'];
    clothing.shoes = 'Standard athletic sneakers or loafers';
  } else if (apparentTemp < 25) {
    clothing.primary = 'Breathable cotton button-down or relaxed polo & chinos';
    clothing.layers = ['Light breathable cotton or linen', 'Optional packable overshirt'];
    clothing.accessories = ['Polarized sunglasses', 'Sun visor / baseball cap'];
    clothing.shoes = 'Breathable canvas shoes, loafers, or runners';
  } else {
    clothing.primary = 'Airy linen clothing, shorts, or loose summer apparel';
    clothing.layers = ['Single ultra-breathable moisture-wicking layer'];
    clothing.accessories = ['Wide-brim sunhat or cap', 'High-SPF sun protection', 'UV400 sunglasses'];
    clothing.shoes = 'Lightweight perforated running shoes or breathable sandals';
  }

  // Rain / Wet weather adaptations
  if (condition.isPrecipitating || todayPrecipMax >= 40) {
    clothing.accessories.push(todayPrecipMax >= 60 ? 'Sturdy stormproof umbrella' : 'Compact pocket umbrella');
    clothing.shoes = 'Treated waterproof footwear with wet grip';
    clothing.layers.push('Water-repellent shell layer');
  }

  // Wind adaptations
  if (windSpeed >= 28) {
    clothing.layers.push('Wind-blocking hooded outer layer');
  }

  // Activity Suitability Calculation
  const activities: ActivityScore[] = [];

  // 1. Running & Jogging
  let runScore = 85;
  let runAdvice = 'Ideal running conditions with comfortable aerobic climate.';
  if (apparentTemp < 0) {
    runScore = 45;
    runAdvice = 'Sub-zero temperatures: wear thermal tights and warm up indoors before pacing.';
  } else if (apparentTemp < 8) {
    runScore = 75;
    runAdvice = 'Cool conditions favor long distance runs; wear wind-resistant layers.';
  } else if (apparentTemp > 28) {
    runScore = 50;
    runAdvice = 'Elevated heat strain: schedule runs early morning and hydrate aggressively.';
  } else if (apparentTemp > 34) {
    runScore = 25;
    runAdvice = 'Extreme thermal stress: treadmill or indoor workouts strongly recommended.';
  }
  if (todayPrecipMax >= 60 || condition.isPrecipitating) {
    runScore = Math.min(runScore, 40);
    runAdvice = 'Wet pavement and rainfall will compromise footing and visibility.';
  } else if (windSpeed > 30) {
    runScore = Math.min(runScore, 55);
    runAdvice = 'Gusty winds will introduce heavy resistance on exposed routes.';
  }
  activities.push({
    id: 'running',
    title: 'Running & Jogging',
    score: runScore,
    status: runScore >= 80 ? 'Ideal' : runScore >= 60 ? 'Good' : runScore >= 40 ? 'Moderate' : 'Poor',
    badgeColor: runScore >= 80 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : runScore >= 60 ? 'text-sky-400 border-sky-500/30 bg-sky-500/10' : runScore >= 40 ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    advice: runAdvice,
  });

  // 2. Cycling & Commuting on Two Wheels
  let cycleScore = 85;
  let cycleAdvice = 'Clean dry roads and gentle wind make for a brisk, smooth ride.';
  if (windSpeed > 35) {
    cycleScore = 30;
    cycleAdvice = 'High crosswinds and gusts pose significant balance hazard for cyclists.';
  } else if (windSpeed > 22) {
    cycleScore = 60;
    cycleAdvice = 'Noticeable headwinds; budget extra commute time and monitor corners.';
  }
  if (condition.isPrecipitating || todayPrecipMax >= 50) {
    cycleScore = Math.min(cycleScore, 35);
    cycleAdvice = 'Slick asphalt, reduced rim-brake grip, and splashing; use mudguards and lights.';
  } else if (apparentTemp < 2) {
    cycleScore = Math.min(cycleScore, 45);
    cycleAdvice = 'Watch for black ice on shaded bridges; heavy windproof gloves necessary.';
  }
  activities.push({
    id: 'cycling',
    title: 'Cycling & Micro-mobility',
    score: cycleScore,
    status: cycleScore >= 80 ? 'Ideal' : cycleScore >= 60 ? 'Good' : cycleScore >= 40 ? 'Moderate' : 'Poor',
    badgeColor: cycleScore >= 80 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : cycleScore >= 60 ? 'text-sky-400 border-sky-500/30 bg-sky-500/10' : cycleScore >= 40 ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    advice: cycleAdvice,
  });

  // 3. Outdoor Dining & Patio Gatherings
  let diningScore = 85;
  let diningAdvice = 'Delightful ambient atmosphere for rooftop cafes or al fresco dinners.';
  if (apparentTemp < 14) {
    diningScore = 40;
    diningAdvice = 'Chilly breezes will make open-air dining uncomfortable without patio heaters.';
  } else if (apparentTemp > 31) {
    diningScore = 55;
    diningAdvice = 'High midday heat; seek shaded terraces with misting fans or dine indoors.';
  }
  if (condition.isPrecipitating || todayPrecipMax >= 40) {
    diningScore = Math.min(diningScore, 25);
    diningAdvice = 'Precipitation risk makes covered or indoor dining a safer choice.';
  } else if (windSpeed > 25) {
    diningScore = Math.min(diningScore, 50);
    diningAdvice = 'Windy gusts will flutter napkins and chill hot beverages quickly.';
  }
  activities.push({
    id: 'outdoorDining',
    title: 'Outdoor Dining & Terraces',
    score: diningScore,
    status: diningScore >= 80 ? 'Ideal' : diningScore >= 60 ? 'Good' : diningScore >= 40 ? 'Moderate' : 'Poor',
    badgeColor: diningScore >= 80 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : diningScore >= 60 ? 'text-sky-400 border-sky-500/30 bg-sky-500/10' : diningScore >= 40 ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    advice: diningAdvice,
  });

  // 4. Urban Commute & Daily Travel
  let commuteScore = 90;
  let commuteAdvice = 'Minimal weather disruption expected across surface transit.';
  if (condition.isPrecipitating || todayPrecipMax >= 70) {
    commuteScore = 50;
    commuteAdvice = 'Rainfall may cause taxi delays, crowded platforms, and slick pedestrian paths.';
  } else if (weatherCode >= 71) {
    commuteScore = 35;
    commuteAdvice = 'Snow and ice will slow transit lines; plan for 15-20 min travel buffers.';
  } else if (weatherCode >= 45 && weatherCode <= 48) {
    commuteScore = 60;
    commuteAdvice = 'Dense atmospheric fog will reduce roadway sightlines; drive with low beams.';
  }
  activities.push({
    id: 'commute',
    title: 'Daily Commute & Travel',
    score: commuteScore,
    status: commuteScore >= 80 ? 'Ideal' : commuteScore >= 60 ? 'Good' : commuteScore >= 40 ? 'Moderate' : 'Poor',
    badgeColor: commuteScore >= 80 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : commuteScore >= 60 ? 'text-sky-400 border-sky-500/30 bg-sky-500/10' : commuteScore >= 40 ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    advice: commuteAdvice,
  });

  // Executive AI-style summary
  let headline = `Favorable conditions across ${cityName}`;
  if (condition.isPrecipitating) {
    headline = `Active precipitation in ${cityName} — Plan for damp conditions`;
  } else if (windSpeed > 32) {
    headline = `High wind speeds observed in ${cityName}`;
  } else if (apparentTemp > 30) {
    headline = `Elevated heat index for ${cityName}`;
  } else if (apparentTemp < 5) {
    headline = `Crisp winter chill settled over ${cityName}`;
  }

  const rainPhrase = todayPrecipMax > 40
    ? `precipitation probability peaks at ${todayPrecipMax}% today`
    : `low precipitation risk of ${todayPrecipMax}%`;

  const windPhrase = windSpeed < 12
    ? 'gentle ambient breezes'
    : windSpeed < 25
    ? `moderate winds around ${Math.round(windSpeed)} km/h`
    : `strong gusts reaching ${Math.round(windSpeed)} km/h`;

  const summary = `${cityName} is registering ${Math.round(temp)}°C (feeling like ${Math.round(apparentTemp)}°C) under ${condition.label.toLowerCase()} with ${windPhrase}. With ${rainPhrase}, expect daily temperatures between ${Math.round(todayTempMin)}°C and ${Math.round(todayTempMax)}°C.`;

  // Highlight notes
  const highlightNotes = [
    {
      label: 'Thermal Sensation',
      value: thermalSensation,
      icon: 'Thermometer'
    },
    {
      label: 'Humidity Index',
      value: `${humidity}% (${humidity < 40 ? 'Dry Air' : humidity <= 65 ? 'Optimal Comfort' : 'High Moisture'})`,
      icon: 'Droplets'
    },
    {
      label: 'Atmospheric Wind',
      value: `${Math.round(windSpeed)} km/h (${windSpeed < 15 ? 'Calm' : windSpeed < 30 ? 'Moderate' : 'Gusty'})`,
      icon: 'Wind'
    },
    {
      label: 'Peak Precip Today',
      value: `${todayPrecipMax}% peak probability`,
      icon: 'CloudRain'
    }
  ];

  let alertNotice: string | undefined;
  if (windSpeed >= 40) {
    alertNotice = 'Wind Advisory: Strong gusts exceed 40 km/h. Secure loose outdoor objects and exercise caution when driving high-profile vehicles.';
  } else if (todayPrecipMax >= 75 || condition.code >= 65 || condition.code === 95 || condition.code >= 96) {
    alertNotice = 'Weather Advisory: Substantial precipitation or storm cells present. Keep rain gear accessible and verify transit schedules.';
  } else if (apparentTemp >= 35) {
    alertNotice = 'Heat Health Notice: Elevated apparent temperature. Limit prolonged peak-hour sun exposure and maintain continuous hydration.';
  } else if (apparentTemp <= -5) {
    alertNotice = 'Cold Weather Advisory: Severe frostbite threshold. Cover exposed skin and dress in multi-tiered insulating garments.';
  }

  return {
    headline,
    summary,
    thermalSensation,
    clothing,
    activities,
    highlightNotes,
    alertNotice
  };
}
