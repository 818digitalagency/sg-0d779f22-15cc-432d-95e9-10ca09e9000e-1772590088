/**
 * Google Maps Integration
 * Handles map initialization, markers, and interactions
 */

import type { Lead } from "@/types/lead";

export interface MapConfig {
  center: { lat: number; lng: number };
  zoom: number;
  styles?: google.maps.MapTypeStyle[];
  disableDefaultUI?: boolean;
}

export interface MarkerData extends Lead {
  position: { lat: number; lng: number };
}

export interface ClusterOptions {
  enabled: boolean;
  minClusterSize?: number;
  maxZoom?: number;
}

// New Brunswick coordinates
export const NB_COORDINATES = {
  Moncton: { lat: 46.0878, lng: -64.7782 },
  "Saint John": { lat: 45.2733, lng: -66.0633 },
  Fredericton: { lat: 45.9636, lng: -66.6431 },
  Bathurst: { lat: 47.6186, lng: -65.6506 },
  Miramichi: { lat: 47.0282, lng: -65.5015 },
  Edmundston: { lat: 47.3737, lng: -68.3251 },
  Campbellton: { lat: 48.0056, lng: -66.6726 },
  Dieppe: { lat: 46.0997, lng: -64.7243 },
  Riverview: { lat: 46.0607, lng: -64.8072 },
  Quispamsis: { lat: 45.4320, lng: -65.9449 }
};

// Default map center (center of New Brunswick)
export const DEFAULT_CENTER = { lat: 46.5653, lng: -66.4619 };
export const DEFAULT_ZOOM = 7;

class GoogleMapsService {
  private map: google.maps.Map | null = null;
  private markers: google.maps.Marker[] = [];
  private infoWindow: google.maps.InfoWindow | null = null;
  private isLoaded = false;

  /**
   * Check if Google Maps API is loaded
   */
  isApiLoaded(): boolean {
    return typeof google !== "undefined" && typeof google.maps !== "undefined";
  }

  /**
   * Load Google Maps API script
   */
  async loadGoogleMapsApi(): Promise<void> {
    if (this.isApiLoaded()) {
      this.isLoaded = true;
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      throw new Error("Google Maps API key not configured. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to environment variables.");
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.isLoaded = true;
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error("Failed to load Google Maps API"));
      };
      
      document.head.appendChild(script);
    });
  }

  /**
   * Initialize map
   */
  async initMap(element: HTMLElement, config: Partial<MapConfig> = {}): Promise<google.maps.Map> {
    if (!this.isApiLoaded()) {
      await this.loadGoogleMapsApi();
    }

    const mapConfig: google.maps.MapOptions = {
      center: config.center || DEFAULT_CENTER,
      zoom: config.zoom || DEFAULT_ZOOM,
      disableDefaultUI: config.disableDefaultUI ?? false,
      styles: config.styles || this.getDefaultMapStyles(),
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true
    };

    this.map = new google.maps.Map(element, mapConfig);
    this.infoWindow = new google.maps.InfoWindow();
    
    return this.map;
  }

  /**
   * Get default map styles (clean, professional look)
   */
  private getDefaultMapStyles(): google.maps.MapTypeStyle[] {
    return [
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#e9e9e9" }, { lightness: 17 }]
      },
      {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#f5f5f5" }, { lightness: 20 }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [{ color: "#ffffff" }, { lightness: 17 }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#ffffff" }, { lightness: 29 }, { weight: 0.2 }]
      },
      {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [{ color: "#ffffff" }, { lightness: 18 }]
      },
      {
        featureType: "road.local",
        elementType: "geometry",
        stylers: [{ color: "#ffffff" }, { lightness: 16 }]
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#f5f5f5" }, { lightness: 21 }]
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#dedede" }, { lightness: 21 }]
      }
    ];
  }

  /**
   * Add markers to map
   */
  addMarkers(leads: Lead[], onMarkerClick?: (lead: Lead) => void): void {
    if (!this.map) {
      console.error("Map not initialized");
      return;
    }

    // Clear existing markers
    this.clearMarkers();

    leads.forEach(lead => {
      const coordinates = this.getCoordinatesForLead(lead);
      
      if (!coordinates) {
        console.warn(`No coordinates found for ${lead.city}`);
        return;
      }

      const marker = new google.maps.Marker({
        position: coordinates,
        map: this.map,
        title: lead.businessName,
        icon: this.getMarkerIcon(lead.leadScore),
        animation: google.maps.Animation.DROP
      });

      // Add click listener
      marker.addListener("click", () => {
        if (onMarkerClick) {
          onMarkerClick(lead);
        }
        this.showInfoWindow(marker, lead);
      });

      this.markers.push(marker);
    });
  }

  /**
   * Get coordinates for a lead based on city
   */
  private getCoordinatesForLead(lead: Lead): { lat: number; lng: number } | null {
    return NB_COORDINATES[lead.city as keyof typeof NB_COORDINATES] || null;
  }

  /**
   * Get marker icon based on lead score
   */
  private getMarkerIcon(score: number): google.maps.Icon {
    let color = "#94a3b8"; // Default gray
    
    if (score >= 80) {
      color = "#22c55e"; // Green for high score
    } else if (score >= 60) {
      color = "#3b82f6"; // Blue for medium score
    } else if (score >= 40) {
      color = "#f59e0b"; // Orange for low-medium score
    } else {
      color = "#ef4444"; // Red for low score
    }

    return {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: color,
      fillOpacity: 0.9,
      strokeColor: "#ffffff",
      strokeWeight: 2
    };
  }

  /**
   * Show info window for a marker
   */
  private showInfoWindow(marker: google.maps.Marker, lead: Lead): void {
    if (!this.infoWindow) return;

    const content = `
      <div style="padding: 12px; max-width: 300px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1e293b;">
          ${lead.businessName}
        </h3>
        <div style="font-size: 14px; color: #64748b; margin-bottom: 8px;">
          <div style="margin-bottom: 4px;">
            <strong>Industry:</strong> ${lead.industry}
          </div>
          <div style="margin-bottom: 4px;">
            <strong>City:</strong> ${lead.city}
          </div>
          <div style="margin-bottom: 4px;">
            <strong>Lead Score:</strong> 
            <span style="color: ${lead.leadScore >= 70 ? "#22c55e" : lead.leadScore >= 50 ? "#3b82f6" : "#f59e0b"}; font-weight: 600;">
              ${lead.leadScore}
            </span>
          </div>
          ${lead.rating ? `
            <div style="margin-bottom: 4px;">
              <strong>Rating:</strong> ⭐ ${lead.rating} (${lead.reviewCount} reviews)
            </div>
          ` : ""}
        </div>
        ${lead.website ? `
          <a href="${lead.website}" target="_blank" rel="noopener noreferrer" 
             style="color: #3b82f6; text-decoration: none; font-size: 13px;">
            Visit Website →
          </a>
        ` : ""}
      </div>
    `;

    this.infoWindow.setContent(content);
    this.infoWindow.open(this.map, marker);
  }

  /**
   * Clear all markers
   */
  clearMarkers(): void {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }

  /**
   * Fit map bounds to show all markers
   */
  fitBoundsToMarkers(): void {
    if (!this.map || this.markers.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    this.markers.forEach(marker => {
      const position = marker.getPosition();
      if (position) {
        bounds.extend(position);
      }
    });

    this.map.fitBounds(bounds);
  }

  /**
   * Center map on specific coordinates
   */
  centerMap(center: { lat: number; lng: number }, zoom?: number): void {
    if (!this.map) return;
    this.map.setCenter(center);
    if (zoom !== undefined) {
      this.map.setZoom(zoom);
    }
  }

  /**
   * Geocode an address
   */
  async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    if (!this.isApiLoaded()) {
      await this.loadGoogleMapsApi();
    }

    const geocoder = new google.maps.Geocoder();
    
    return new Promise((resolve) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({ lat: location.lat(), lng: location.lng() });
        } else {
          console.error("Geocoding failed:", status);
          resolve(null);
        }
      });
    });
  }

  /**
   * Search places nearby
   */
  async searchNearby(
    location: { lat: number; lng: number },
    radius: number,
    types: string[]
  ): Promise<google.maps.places.PlaceResult[]> {
    if (!this.isApiLoaded()) {
      await this.loadGoogleMapsApi();
    }

    if (!this.map) {
      throw new Error("Map not initialized");
    }

    const service = new google.maps.places.PlacesService(this.map);
    
    return new Promise((resolve, reject) => {
      service.nearbySearch(
        {
          location,
          radius,
          type: types
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            reject(new Error(`Places search failed: ${status}`));
          }
        }
      );
    });
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.clearMarkers();
    this.map = null;
    this.infoWindow = null;
  }
}

export const googleMapsService = new GoogleMapsService();