import { feature } from 'topojson-client';
import { Feature, FeatureCollection, Geometry } from 'geojson';
import { geoContains } from 'd3-geo';

export async function getWorldData(): Promise<FeatureCollection> {
  const response = await fetch('https://unpkg.com/world-atlas@2.0.2/countries-50m.json');
  const topology = await response.json();
  return feature(topology, topology.objects.countries) as FeatureCollection;
}

export function generateRandomColor(): string {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 25 + Math.floor(Math.random() * 30); // 25-55%
  const lightness = 45 + Math.floor(Math.random() * 20); // 45-65%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export interface CountryData {
  feature: Feature<Geometry>;
  color: string;
}

export function generateCountryColors(features: Feature[]): Map<string, CountryData> {
  const countryColors = new Map<string, CountryData>();
  
  features.forEach((feature) => {
    countryColors.set(feature.properties?.name || '', {
      feature,
      color: generateRandomColor(),
    });
  });
  
  return countryColors;
}

export function findClickedCountry(
  features: Feature[],
  projection: any,
  point: [number, number]
): Feature | undefined {
  const [longitude, latitude] = projection.invert(point);
  return features.find((feature) => geoContains(feature, [longitude, latitude]));
}