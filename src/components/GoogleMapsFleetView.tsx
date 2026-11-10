import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { useCaravan } from '../context/CaravanContext';
import {
  Compass,
  MapPin,
  Shield,
  Battery,
  Sun,
  Navigation,
  Layers,
  Radio,
  Lock,
  Unlock,
  AlertTriangle,
} from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

interface WaypointLocation {
  id: string;
  name: string;
  category: 'campsite' | 'depot' | 'service';
  position: { lat: number; lng: number };
  description: string;
}

const WAYPOINTS: WaypointLocation[] = [
  {
    id: 'camp-kalahari',
    name: 'Kalahari Wilderness Camp #4',
    category: 'campsite',
    position: { lat: -28.4792, lng: 21.2563 },
    description: 'Current expedition camp · 4G LTE-M / Starlink connected · Solar nominal',
  },
  {
    id: 'camp-twee-rivieren',
    name: 'Twee Rivieren Rest Camp',
    category: 'campsite',
    position: { lat: -26.4719, lng: 20.6133 },
    description: 'Fresh water filling station · 230V shore power available',
  },
  {
    id: 'depot-upington',
    name: 'Gecko Upington Operations Depot',
    category: 'depot',
    position: { lat: -28.4478, lng: 21.2561 },
    description: 'Fleet turnover inspection facility · battery diagnostics lab',
  },
  {
    id: 'camp-augrabies',
    name: 'Augrabies Falls Field Station',
    category: 'service',
    position: { lat: -28.5947, lng: 20.3411 },
    description: 'Off-road recovery support · emergency water replenishment',
  },
];

// Helper to pan map when a caravan or waypoint is selected
function MapPanController({ targetCenter }: { targetCenter: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.panTo(targetCenter);
      map.setZoom(14);
    }
  }, [map, targetCenter]);
  return null;
}

export const GoogleMapsFleetView: React.FC = () => {
  const { deviceState, fleet, setSecurityMode, setDeviceTelemetry } = useCaravan();
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>('gk-01');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('hybrid');
  const [targetCenter, setTargetCenter] = useState<{ lat: number; lng: number }>(
    deviceState.security.gpsCoordinates
  );

  const mapsApiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || firebaseConfig.apiKey || '';

  const { security, power } = deviceState;

  // Selected item info
  const selectedFleetItem = fleet.find((f) => f.id === selectedMarkerId);
  const selectedWaypoint = WAYPOINTS.find((w) => w.id === selectedMarkerId);

  return (
    <div className="space-y-6">
      {/* Top Banner: Maps & Fleet Overview */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <span>GOOGLE MAPS PLATFORM · ADVANCED MARKERS &amp; REAL-TIME GPS</span>
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              Caravan Expedition Geofence &amp; Fleet Navigator
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Live GPS tracking · 250m campsite security geofence · Off-road waypoints &amp; depots
            </p>
          </div>

          {/* Map Layer Switcher */}
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs self-start md:self-auto">
            {(['roadmap', 'hybrid', 'satellite', 'terrain'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMapType(type)}
                className={`px-3 py-1 rounded capitalize font-medium transition-colors ${
                  mapType === type
                    ? 'bg-neutral-800 text-amber-400 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Quick Coordinates / Status Strips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-xs">
          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
            <span className="text-neutral-400">Current Position</span>
            <div className="text-sm font-bold font-mono text-white mt-1">
              {security.gpsCoordinates.lat.toFixed(4)}°, {security.gpsCoordinates.lng.toFixed(4)}°
            </div>
            <span className="text-[11px] text-neutral-400">Kalahari North-West Sector</span>
          </div>

          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
            <span className="text-neutral-400">Active Geofence</span>
            <div className="text-sm font-bold font-mono text-emerald-400 mt-1">
              {security.geofenceRadiusMeters}m Safe Radius
            </div>
            <span className="text-[11px] text-neutral-400">
              Offset: {security.distanceFromBaseMeters}m ({security.distanceFromBaseMeters < security.geofenceRadiusMeters ? 'SECURE' : 'BREACH'})
            </span>
          </div>

          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
            <span className="text-neutral-400">GPS Constellation Fix</span>
            <div className="text-sm font-bold font-mono text-sky-400 mt-1">
              12 Satellites (3D Fix)
            </div>
            <span className="text-[11px] text-neutral-400">Accuracy: ±2.4 meters</span>
          </div>

          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
            <span className="text-neutral-400">Closest Support Depot</span>
            <div className="text-sm font-bold font-mono text-amber-400 mt-1">
              Upington (3.5 km)
            </div>
            <span className="text-[11px] text-neutral-400">Fuel &amp; Fresh Water Depot</span>
          </div>
        </div>
      </div>

      {/* Main Google Maps Viewport with Advanced Markers */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-neutral-800 shadow-inner">
          <APIProvider apiKey={mapsApiKey}>
            <Map
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              defaultCenter={security.gpsCoordinates}
              defaultZoom={13}
              mapTypeId={mapType}
              gestureHandling="greedy"
              disableDefaultUI={false}
              className="w-full h-full"
            >
              <MapPanController targetCenter={targetCenter} />

              {/* Advanced Marker: Current Active Caravan (Desert Falcon 18XT) */}
              <AdvancedMarker
                position={security.gpsCoordinates}
                title="Desert Falcon 18XT (Current Unit)"
                onClick={() => setSelectedMarkerId('gk-01')}
              >
                <div className="flex flex-col items-center cursor-pointer group">
                  <div className="px-2 py-1 bg-neutral-950/95 border-2 border-amber-400 rounded-md text-[11px] font-bold text-white shadow-lg whitespace-nowrap flex items-center gap-1.5 transition-transform group-hover:scale-110">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Desert Falcon 18XT</span>
                    <span className="text-amber-400 font-mono text-[10px]">
                      {power.batterySoc}%
                    </span>
                  </div>
                  <div className="w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-amber-400" />
                </div>
              </AdvancedMarker>

              {/* Waypoint Markers */}
              {WAYPOINTS.map((wp) => (
                <AdvancedMarker
                  key={wp.id}
                  position={wp.position}
                  title={wp.name}
                  onClick={() => {
                    setSelectedMarkerId(wp.id);
                    setTargetCenter(wp.position);
                  }}
                >
                  <div className="flex flex-col items-center cursor-pointer group">
                    <div
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold text-white shadow-md whitespace-nowrap flex items-center gap-1 border ${
                        wp.category === 'depot'
                          ? 'bg-sky-950/90 border-sky-400 text-sky-200'
                          : wp.category === 'service'
                          ? 'bg-rose-950/90 border-rose-400 text-rose-200'
                          : 'bg-emerald-950/90 border-emerald-400 text-emerald-200'
                      }`}
                    >
                      <MapPin className="w-3 h-3" />
                      <span>{wp.name}</span>
                    </div>
                  </div>
                </AdvancedMarker>
              ))}

              {/* InfoWindow for Selected Item */}
              {selectedMarkerId === 'gk-01' && (
                <InfoWindow
                  position={security.gpsCoordinates}
                  onCloseClick={() => setSelectedMarkerId(null)}
                >
                  <div className="p-1 text-neutral-900 max-w-xs space-y-1.5 text-xs font-sans">
                    <div className="font-bold text-sm text-neutral-900 font-display">
                      Gecko Desert Falcon 18XT
                    </div>
                    <div className="text-[11px] text-neutral-600">
                      Chassis #{deviceState.chassisNumber} · Kalahari Transfrontier
                    </div>

                    <div className="pt-1.5 border-t border-neutral-200 grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-neutral-500">LiFePO4 Battery:</span>
                        <div className="font-mono font-bold text-amber-700">
                          {power.batterySoc}% ({power.batteryVoltage}V)
                        </div>
                      </div>
                      <div>
                        <span className="text-neutral-500">Solar MPPT:</span>
                        <div className="font-mono font-bold text-emerald-700">
                          {power.solarWatts}W
                        </div>
                      </div>
                    </div>

                    <div className="pt-1 text-[11px] flex items-center justify-between">
                      <span className="text-neutral-500">Security Mode:</span>
                      <span className="font-semibold capitalize text-neutral-900">
                        {security.systemMode.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="pt-2 flex gap-1.5">
                      <button
                        onClick={() =>
                          setSecurityMode(
                            security.mainDoorLocked ? 'disarmed' : 'camp_mode'
                          )
                        }
                        className="flex-1 py-1 px-2 bg-neutral-900 text-white rounded text-[11px] font-semibold flex items-center justify-center gap-1"
                      >
                        {security.mainDoorLocked ? (
                          <>
                            <Unlock className="w-3 h-3" />
                            <span>Unlock</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3" />
                            <span>Lock</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </InfoWindow>
              )}

              {selectedWaypoint && (
                <InfoWindow
                  position={selectedWaypoint.position}
                  onCloseClick={() => setSelectedMarkerId(null)}
                >
                  <div className="p-1 text-neutral-900 max-w-xs space-y-1 text-xs font-sans">
                    <div className="font-bold text-neutral-900">{selectedWaypoint.name}</div>
                    <p className="text-[11px] text-neutral-600">
                      {selectedWaypoint.description}
                    </p>
                    <div className="text-[10px] text-neutral-500 font-mono pt-1">
                      Lat: {selectedWaypoint.position.lat.toFixed(4)}, Lng: {selectedWaypoint.position.lng.toFixed(4)}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        </div>

        {/* Waypoints & Quick Locator Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-medium">Pan To Point:</span>
            <button
              onClick={() => {
                setTargetCenter(security.gpsCoordinates);
                setSelectedMarkerId('gk-01');
              }}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded font-medium text-[11px] transition-colors"
            >
              Current Caravan Location
            </button>
            {WAYPOINTS.map((wp) => (
              <button
                key={wp.id}
                onClick={() => {
                  setTargetCenter(wp.position);
                  setSelectedMarkerId(wp.id);
                }}
                className="px-2.5 py-1 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded font-medium text-[11px] transition-colors"
              >
                {wp.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
            <span>Geofence Boundary:</span>
            <span className="font-mono text-emerald-400">
              {security.distanceFromBaseMeters}m of 250m
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
