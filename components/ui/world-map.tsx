'use client';

import React, { useEffect, useRef, useState } from 'react';
import { geoEquirectangular, geoPath } from 'd3-geo';
import { Feature, FeatureCollection, Geometry } from 'geojson';
import { CountryData, generateCountryColors, findClickedCountry } from '@/lib/mapData';

interface WorldMapProps {
  worldData: FeatureCollection;
}

export function WorldMap({ worldData }: WorldMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countryColors, setCountryColors] = useState<Map<string, CountryData>>(new Map());
  const [dimensions, setDimensions] = useState({ width: 960, height: 500 });

  useEffect(() => {
    setCountryColors(generateCountryColors(worldData.features as Feature[]));
  }, [worldData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Setup projection
    const projection = geoEquirectangular()
      .fitSize([dimensions.width, dimensions.height], worldData);
    const pathGenerator = geoPath(projection, ctx);

    // Draw countries
    worldData.features.forEach((feature: Feature) => {
      const countryName = feature.properties?.name || '';
      const countryData = countryColors.get(countryName);
      
      if (countryData) {
        ctx.beginPath();
        pathGenerator(feature);
        ctx.fillStyle = countryData.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });

  }, [worldData, countryColors, dimensions, selectedCountry]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const projection = geoEquirectangular()
      .fitSize([dimensions.width, dimensions.height], worldData);

    const clickedCountry = findClickedCountry(
      worldData.features as Feature[],
      projection,
      [x, y]
    );

    setSelectedCountry(clickedCountry?.properties?.name || null);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleCanvasClick}
        className="cursor-pointer"
      />
      {selectedCountry && (
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-md shadow-lg">
          <p className="text-sm font-medium">{selectedCountry}</p>
        </div>
      )}
    </div>
  );
}