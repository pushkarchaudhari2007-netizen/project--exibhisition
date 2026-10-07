/**
 * GreenCoach AI - Location & Geolocation Service
 * Manages device geolocation access, state selection, city resolution, and district synchronization.
 */

export interface UserLocation {
  city: string;
  state: string;
  lat: number;
  lng: number;
  isGps: boolean;
  accuracyMeters?: number;
}

export interface CityInfo {
  city: string;
  state: string;
  lat: number;
  lng: number;
}

/**
 * State -> Cities Registry covering major agricultural states of India
 */
export const STATE_CITIES_REGISTRY: Record<string, CityInfo[]> = {
  'Maharashtra': [
    { city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
    { city: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898 },
    { city: 'Satara', state: 'Maharashtra', lat: 17.6805, lng: 74.0183 },
    { city: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
    { city: 'Solapur', state: 'Maharashtra', lat: 17.6599, lng: 75.9064 },
    { city: 'Kolhapur', state: 'Maharashtra', lat: 16.7050, lng: 74.2433 },
    { city: 'Ahmednagar', state: 'Maharashtra', lat: 19.0948, lng: 74.7480 },
    { city: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', lat: 19.8762, lng: 75.3433 },
    { city: 'Amravati', state: 'Maharashtra', lat: 20.9374, lng: 77.7796 },
    { city: 'Sangli', state: 'Maharashtra', lat: 16.8524, lng: 74.5815 },
    { city: 'Jalgaon', state: 'Maharashtra', lat: 21.0077, lng: 75.5626 },
    { city: 'Latur', state: 'Maharashtra', lat: 18.4088, lng: 76.5604 },
    { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 }
  ],
  'Punjab': [
    { city: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573 },
    { city: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723 },
    { city: 'Jalandhar', state: 'Punjab', lat: 31.3260, lng: 75.5762 },
    { city: 'Patiala', state: 'Punjab', lat: 30.3398, lng: 76.3869 },
    { city: 'Bathinda', state: 'Punjab', lat: 30.2110, lng: 74.9455 },
    { city: 'Firozpur', state: 'Punjab', lat: 30.9237, lng: 74.6133 }
  ],
  'Madhya Pradesh': [
    { city: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
    { city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
    { city: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1765, lng: 75.7885 },
    { city: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864 },
    { city: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828 },
    { city: 'Sagar', state: 'Madhya Pradesh', lat: 23.8388, lng: 78.7378 }
  ],
  'Gujarat': [
    { city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
    { city: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022 },
    { city: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
    { city: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812 },
    { city: 'Junagadh', state: 'Gujarat', lat: 21.5222, lng: 70.4579 },
    { city: 'Anand', state: 'Gujarat', lat: 22.5645, lng: 72.9289 }
  ],
  'Uttar Pradesh': [
    { city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
    { city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
    { city: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319 },
    { city: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463 },
    { city: 'Bareilly', state: 'Uttar Pradesh', lat: 28.3670, lng: 79.4304 },
    { city: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.7606, lng: 83.3732 }
  ],
  'Haryana': [
    { city: 'Karnal', state: 'Haryana', lat: 29.6857, lng: 76.9905 },
    { city: 'Hisar', state: 'Haryana', lat: 29.1492, lng: 75.7217 },
    { city: 'Ambala', state: 'Haryana', lat: 30.3782, lng: 76.7767 },
    { city: 'Rohtak', state: 'Haryana', lat: 28.8955, lng: 76.6066 },
    { city: 'Sirsa', state: 'Haryana', lat: 29.5349, lng: 75.0296 }
  ],
  'Karnataka': [
    { city: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
    { city: 'Belagavi', state: 'Karnataka', lat: 15.8497, lng: 74.4977 },
    { city: 'Mysuru', state: 'Karnataka', lat: 12.2958, lng: 76.6394 },
    { city: 'Dharwad', state: 'Karnataka', lat: 15.4589, lng: 75.0078 },
    { city: 'Raichur', state: 'Karnataka', lat: 16.2120, lng: 77.3439 }
  ],
  'Telangana': [
    { city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
    { city: 'Warangal', state: 'Telangana', lat: 17.9689, lng: 79.5941 },
    { city: 'Nizamabad', state: 'Telangana', lat: 18.6725, lng: 78.0941 },
    { city: 'Karimnagar', state: 'Telangana', lat: 18.4386, lng: 79.1288 }
  ],
  'Andhra Pradesh': [
    { city: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480 },
    { city: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lng: 80.4365 },
    { city: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
    { city: 'Kurnool', state: 'Andhra Pradesh', lat: 15.8281, lng: 78.0373 }
  ],
  'Rajasthan': [
    { city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
    { city: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243 },
    { city: 'Kota', state: 'Rajasthan', lat: 25.2138, lng: 75.8648 },
    { city: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lng: 73.3119 },
    { city: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125 }
  ],
  'Tamil Nadu': [
    { city: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
    { city: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },
    { city: 'Thanjavur', state: 'Tamil Nadu', lat: 10.7870, lng: 79.1378 },
    { city: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460 }
  ],
  'West Bengal': [
    { city: 'Burdwan', state: 'West Bengal', lat: 23.2324, lng: 87.8615 },
    { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
    { city: 'Siliguri', state: 'West Bengal', lat: 26.7271, lng: 88.3953 },
    { city: 'Murshidabad', state: 'West Bengal', lat: 24.1759, lng: 88.2802 }
  ],
  'Bihar': [
    { city: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376 },
    { city: 'Muzaffarpur', state: 'Bihar', lat: 26.1209, lng: 85.3647 },
    { city: 'Gaya', state: 'Bihar', lat: 24.7914, lng: 85.0002 },
    { city: 'Bhagalpur', state: 'Bihar', lat: 25.2425, lng: 86.9842 }
  ]
};

// Flattened list for backwards compatibility
export const SUPPORTED_CITIES: CityInfo[] = Object.values(STATE_CITIES_REGISTRY).flat();

const DEFAULT_LOCATION: UserLocation = {
  city: 'Pune',
  state: 'Maharashtra',
  lat: 18.5204,
  lng: 73.8567,
  isGps: false
};

class LocationManager {
  private currentLocation: UserLocation = DEFAULT_LOCATION;
  private listeners: ((loc: UserLocation) => void)[] = [];

  constructor() {
    this.loadSavedLocation();
  }

  private loadSavedLocation() {
    try {
      const saved = localStorage.getItem('greencoach_user_location');
      if (saved) {
        this.currentLocation = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved location:', e);
    }
  }

  public getLocation(): UserLocation {
    return this.currentLocation;
  }

  public getStates(): string[] {
    return Object.keys(STATE_CITIES_REGISTRY);
  }

  public getCitiesForState(stateName: string): CityInfo[] {
    return STATE_CITIES_REGISTRY[stateName] || [];
  }

  public getStateForCity(cityName: string): string {
    const norm = cityName.toLowerCase().trim();
    for (const [state, cities] of Object.entries(STATE_CITIES_REGISTRY)) {
      if (cities.some(c => c.city.toLowerCase() === norm || norm.includes(c.city.toLowerCase()))) {
        return state;
      }
    }
    return this.currentLocation.state || 'Maharashtra';
  }

  public subscribe(cb: (loc: UserLocation) => void): () => void {
    this.listeners.push(cb);
    cb(this.currentLocation);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    try {
      localStorage.setItem('greencoach_user_location', JSON.stringify(this.currentLocation));
    } catch (e) {
      console.warn('Failed to save location to storage:', e);
    }
    this.listeners.forEach(cb => cb(this.currentLocation));
  }

  public setStateAndCity(stateName: string, cityName: string) {
    const stateCities = this.getCitiesForState(stateName);
    const found = stateCities.find(c => c.city.toLowerCase() === cityName.toLowerCase().trim());

    if (found) {
      this.currentLocation = {
        city: found.city,
        state: found.state,
        lat: found.lat,
        lng: found.lng,
        isGps: false
      };
    } else {
      // Find anywhere in supported cities
      const anyFound = SUPPORTED_CITIES.find(c => c.city.toLowerCase() === cityName.toLowerCase().trim());
      if (anyFound) {
        this.currentLocation = {
          city: anyFound.city,
          state: stateName || anyFound.state,
          lat: anyFound.lat,
          lng: anyFound.lng,
          isGps: false
        };
      } else {
        this.currentLocation = {
          city: cityName.charAt(0).toUpperCase() + cityName.slice(1),
          state: stateName || 'India',
          lat: 18.5204 + (Math.random() - 0.5) * 0.1,
          lng: 73.8567 + (Math.random() - 0.5) * 0.1,
          isGps: false
        };
      }
    }
    this.notify();
  }

  public setCity(cityName: string) {
    const norm = cityName.toLowerCase().trim();
    const found = SUPPORTED_CITIES.find(c => 
      c.city.toLowerCase() === norm || 
      c.city.toLowerCase().includes(norm) || 
      norm.includes(c.city.toLowerCase())
    );

    if (found) {
      this.currentLocation = {
        city: found.city,
        state: found.state,
        lat: found.lat,
        lng: found.lng,
        isGps: false
      };
    } else {
      this.currentLocation = {
        city: cityName.charAt(0).toUpperCase() + cityName.slice(1),
        state: this.currentLocation.state || 'India',
        lat: 18.5204 + (Math.random() - 0.5) * 0.1,
        lng: 73.8567 + (Math.random() - 0.5) * 0.1,
        isGps: false
      };
    }
    this.notify();
  }

  public async requestGpsLocation(): Promise<{ success: boolean; location?: UserLocation; error?: string }> {
    if (!navigator.geolocation) {
      return { success: false, error: 'Geolocation is not supported by your browser.' };
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = position.coords.accuracy;

          try {
            // Reverse geocode via server endpoint
            const res = await fetch(`/api/location/city?lat=${lat}&lng=${lng}`);
            const data = await res.json();
            
            const newLoc: UserLocation = {
              city: data.city || 'Pune',
              state: data.state || 'Maharashtra',
              lat,
              lng,
              isGps: true,
              accuracyMeters: accuracy
            };

            this.currentLocation = newLoc;
            this.notify();
            resolve({ success: true, location: newLoc });
          } catch (err: any) {
            // Find closest city locally
            let closest = SUPPORTED_CITIES[0];
            let minD = Infinity;
            for (const c of SUPPORTED_CITIES) {
              const d = Math.hypot(c.lat - lat, c.lng - lng);
              if (d < minD) {
                minD = d;
                closest = c;
              }
            }
            const fallbackLoc: UserLocation = {
              city: closest.city,
              state: closest.state,
              lat,
              lng,
              isGps: true,
              accuracyMeters: accuracy
            };
            this.currentLocation = fallbackLoc;
            this.notify();
            resolve({ success: true, location: fallbackLoc });
          }
        },
        (error) => {
          let msg = 'Location access denied or unavailable.';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Location permission was denied. You can select your state & city manually.';
          } else if (error.code === error.TIMEOUT) {
            msg = 'Location request timed out. Please try again.';
          }
          resolve({ success: false, error: msg });
        },
        { timeout: 10000, enableHighAccuracy: true, maximumAge: 60000 }
      );
    });
  }
}

export const locationManager = new LocationManager();
