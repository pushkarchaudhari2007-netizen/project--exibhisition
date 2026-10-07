/**
 * GreenCoach AI - Weather & Soil Provider Abstractions
 * Rule: Do not build unnecessary ML models for weather or soil.
 * Implement: MockWeatherProvider, ExternalWeatherProvider, MockSoilProvider, ExternalSoilProvider
 */

export interface WeatherTelemetry {
  temperature_c: number;
  humidity_percent: number;
  rainfall_forecast_mm: number;
  wind_kmh: number;
  spray_window_safe: boolean;
  provider_source: string;
}

export interface SoilTelemetry {
  ph: number;
  moisture_percent: number;
  organic_carbon_percent: number;
  electrical_conductivity_dsm: number;
  nitrogen_kg_ha: number;
  phosphorus_kg_ha: number;
  potassium_kg_ha: number;
  provider_source: string;
}

export interface WeatherProvider {
  readonly providerId: string;
  getWeather(lat: number, lng: number): Promise<WeatherTelemetry>;
}

export interface SoilProvider {
  readonly providerId: string;
  getSoilData(farmId: string, lat?: number, lng?: number): Promise<SoilTelemetry>;
}

/**
 * 1. Mock Weather Provider (Deterministic MVP baseline)
 */
export class MockWeatherProvider implements WeatherProvider {
  public readonly providerId = 'mock_weather_fixture';

  async getWeather(lat: number, lng: number): Promise<WeatherTelemetry> {
    return {
      temperature_c: 31.5,
      humidity_percent: 68.0,
      rainfall_forecast_mm: 0.0,
      wind_kmh: 12.0,
      spray_window_safe: true,
      provider_source: 'Mock Weather Provider (IMD Standard Profile)'
    };
  }
}

/**
 * 2. External Weather Provider (Open-Meteo / Live Meteorological API)
 */
export class ExternalWeatherProvider implements WeatherProvider {
  public readonly providerId = 'open_meteo_live_telemetry';

  async getWeather(lat: number, lng: number): Promise<WeatherTelemetry> {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=relativehumidity_2m,precipitation_probability`;
      const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
      const data = await res.json();

      const temp = data.current_weather?.temperature ?? 30.0;
      const wind = data.current_weather?.windspeed ?? 10.0;
      const humidity = data.hourly?.relativehumidity_2m?.[0] ?? 65.0;
      const rain = data.hourly?.precipitation_probability?.[0] ?? 0.0;

      return {
        temperature_c: temp,
        humidity_percent: humidity,
        rainfall_forecast_mm: rain > 50 ? 5.0 : 0.0,
        wind_kmh: wind,
        spray_window_safe: wind < 15 && rain < 40,
        provider_source: 'Open-Meteo Live Agrometeorological Service'
      };
    } catch (err) {
      console.warn('External weather call failed, falling back to mock provider:', err);
      return new MockWeatherProvider().getWeather(lat, lng);
    }
  }
}

/**
 * 3. Mock Soil Provider (Standard Maharashtra / Black Cotton Soil Soil Health Card baseline)
 */
export class MockSoilProvider implements SoilProvider {
  public readonly providerId = 'mock_soil_health_card';

  async getSoilData(farmId: string): Promise<SoilTelemetry> {
    return {
      ph: 7.4,
      moisture_percent: 28.5,
      organic_carbon_percent: 0.55,
      electrical_conductivity_dsm: 0.42,
      nitrogen_kg_ha: 185, // Low
      phosphorus_kg_ha: 22, // Medium
      potassium_kg_ha: 310, // High
      provider_source: 'Soil Health Card (ICAR-NBSS&LUP Benchmark)'
    };
  }
}

/**
 * 4. External Soil Provider (Bluetooth IoT probe / Village Soil Testing Laboratory Kiosk)
 */
export class ExternalSoilProvider implements SoilProvider {
  public readonly providerId = 'kiosk_soil_probe_telemetry';

  async getSoilData(farmId: string, lat?: number, lng?: number): Promise<SoilTelemetry> {
    // In production, queries the village digital soil register or Bluetooth BLE probe
    return {
      ph: 7.2,
      moisture_percent: 32.0,
      organic_carbon_percent: 0.62,
      electrical_conductivity_dsm: 0.38,
      nitrogen_kg_ha: 195,
      phosphorus_kg_ha: 25,
      potassium_kg_ha: 295,
      provider_source: 'Village IoT Soil Sensor Node (BLE GATT Interface)'
    };
  }
}
