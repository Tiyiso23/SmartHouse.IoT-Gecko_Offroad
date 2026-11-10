import React from 'react';
import { useCaravan } from '../context/CaravanContext';
import {
  Shield,
  Sun,
  Battery,
  Thermometer,
  Cloud,
  CheckCircle,
  Database,
  Compass,
} from 'lucide-react';

export const CaravanHero: React.FC = () => {
  const {
    deviceState,
    cloudSyncMode,
    setIsCloudModalOpen,
    applyScenario,
    setSecurityMode,
    activeScenarioName,
  } = useCaravan();

  const { power, environment, security } = deviceState;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 mb-8">
      {/* Background Image with carefully calibrated contrast scrim */}
      <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden">
        <img
          src="/src/assets/images/gecko_offroad_caravan_hero_1794305478072.jpg"
          alt="Gecko Offroad 18XT Expedition Caravan in the wild"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        {/* Measured dark scrim for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/30" />

        {/* Content over image */}
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
          {/* Top row: unboxed metadata & cloud sync status */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-300">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white tracking-wide">
                Gecko Offroad Smart House
              </span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span>Desert Falcon 18XT</span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span className="font-mono text-neutral-400">GK-2026-X809</span>
            </div>

            {/* Cloud Sync Status Button */}
            <button
              onClick={() => setIsCloudModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/80 backdrop-blur-sm border border-neutral-700 hover:border-amber-400/50 transition-colors text-xs text-neutral-200"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {cloudSyncMode === 'firebase_cloud'
                  ? 'Firebase Firestore Synced'
                  : 'Local Mesh Fallback'}
              </span>
            </button>
          </div>

          {/* Bottom row: Hero Headline & Quick Scenario Bar */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white font-display max-w-2xl text-balance">
                Intelligent Living for Extreme Off-Road Expeditions
              </h1>
              <p className="text-sm text-neutral-300 mt-1.5 max-w-xl">
                Real-time telemetry, automated energy stewardship, and remote perimeter security for off-grid exploration.
              </p>
            </div>

            {/* Quick Action Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-medium text-neutral-400 mr-1">Quick Scenes:</span>
              <button
                onClick={() => applyScenario('kalahari_noon')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeScenarioName === 'kalahari_noon'
                    ? 'bg-amber-400 text-neutral-950 font-semibold'
                    : 'bg-neutral-900/90 text-neutral-200 hover:bg-neutral-800 border border-neutral-700'
                }`}
              >
                Desert Noon Solar
              </button>
              <button
                onClick={() => applyScenario('night_stealth')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeScenarioName === 'night_stealth'
                    ? 'bg-amber-400 text-neutral-950 font-semibold'
                    : 'bg-neutral-900/90 text-neutral-200 hover:bg-neutral-800 border border-neutral-700'
                }`}
              >
                Camp Night & Sleep
              </button>
              <button
                onClick={() => setSecurityMode('armed_away')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  security.systemMode === 'armed_away'
                    ? 'bg-amber-400 text-neutral-950 font-semibold'
                    : 'bg-neutral-900/90 text-neutral-200 hover:bg-neutral-800 border border-neutral-700'
                }`}
              >
                Hike / Armed Away
              </button>
              <button
                onClick={() => applyScenario('highveld_storm')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeScenarioName === 'highveld_storm'
                    ? 'bg-amber-400 text-neutral-950 font-semibold'
                    : 'bg-neutral-900/90 text-neutral-200 hover:bg-neutral-800 border border-neutral-700'
                }`}
              >
                Storm Guard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4-KPI Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-800 bg-neutral-950/70 border-t border-neutral-800">
        {/* Battery */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
            <Battery className="w-4 h-4 text-amber-400" />
            <span>LiFePO4 Storage</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {power.batterySoc}%
            </span>
            <span className="text-xs font-mono text-neutral-400 tabular-nums">
              {power.batteryVoltage}V · {power.batteryCurrent >= 0 ? `+${power.batteryCurrent}A` : `${power.batteryCurrent}A`}
            </span>
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {power.batteryCurrent > 0 ? 'Charging via Solar MPPT' : 'Runtime ~26 hrs remaining'}
          </div>
        </div>

        {/* Solar MPPT */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Rooftop Solar MPPT</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {power.solarWatts}W
            </span>
            <span className="text-xs font-mono text-neutral-400 tabular-nums">
              / 450W peak
            </span>
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Daily Yield: {power.solarDailyKwh} kWh generated
          </div>
        </div>

        {/* Cabin Climate */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
            <Thermometer className="w-4 h-4 text-amber-400" />
            <span>Cabin Environment</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {environment.cabinTempC}°C
            </span>
            <span className="text-xs font-mono text-neutral-400 tabular-nums">
              {environment.cabinHumidityPct}% RH
            </span>
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Ambient Exterior: {environment.exteriorTempC}°C
          </div>
        </div>

        {/* Security Status */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Perimeter Defense</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white capitalize">
              {security.systemMode.replace('_', ' ')}
            </span>
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {security.mainDoorLocked ? 'Smart Deadbolt Engaged' : 'Unlocked'} · Geofence OK
          </div>
        </div>
      </div>
    </div>
  );
};
