import { getWorldData } from '@/lib/mapData';
import { WorldMap } from '@/components/ui/world-map';

export default async function Home() {
  const worldData = await getWorldData();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Interactive World Map
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <WorldMap worldData={worldData} />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
            Click on any country to reveal its name
          </p>
        </div>
      </div>
    </div>
  );
}