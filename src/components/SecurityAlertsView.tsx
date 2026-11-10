import React from 'react';
import { useCaravan } from '../context/CaravanContext';
import {
  Shield,
  Lock,
  Unlock,
  Radio,
  MapPin,
  Volume2,
  AlertOctagon,
  Eye,
  CheckCircle,
  AlertTriangle,
  Compass,
} from 'lucide-react';

export const SecurityAlertsView: React.FC = () => {
  const {
    deviceState,
    setSecurityMode,
    setDeviceTelemetry,
    simulateIntruderBreach,
    alerts,
    acknowledgeAlert,
    clearAllAlerts,
  } = useCaravan();

  const { security } = deviceState;

  const securityAlerts = alerts.filter((a) => a.category === 'security');

  return (
    <div className="space-y-6">
      {/* Top Banner: Security Master Console */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <h2 className="text-xl font-bold text-white font-display">
              Smart Security & Perimeter Defense
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Multi-zone magnetic reed sensors, PIR infrared detection, and GPS geofence anchor
            </p>
          </div>

          {/* Alarm Siren Manual Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setDeviceTelemetry('security', { sirenActive: !security.sirenActive })
              }
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                security.sirenActive
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-neutral-800 text-rose-300 hover:bg-neutral-700'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{security.sirenActive ? '110dB SIREN ACTIVE' : 'Test Siren (Panic)'}</span>
            </button>

            <button
              onClick={simulateIntruderBreach}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-950 text-rose-400 border border-rose-800 hover:bg-rose-900/50 transition-colors"
            >
              Simulate Breach
            </button>
          </div>
        </div>

        {/* 3 Security Modes Segmented Switcher */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          <button
            onClick={() => setSecurityMode('disarmed')}
            className={`p-4 rounded-xl border text-left transition-colors ${
              security.systemMode === 'disarmed'
                ? 'bg-neutral-800 border-neutral-600 text-white shadow-sm'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm">Disarmed</span>
              <Unlock className="w-4 h-4 text-neutral-400" />
            </div>
            <p className="text-xs text-neutral-400">
              Perimeter monitoring silent. Doors unlocked for normal day-to-day camp living.
            </p>
          </button>

          <button
            onClick={() => setSecurityMode('camp_mode')}
            className={`p-4 rounded-xl border text-left transition-colors ${
              security.systemMode === 'camp_mode'
                ? 'bg-amber-400/15 border-amber-400/50 text-white shadow-sm'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm text-amber-300">Camp Night Mode</span>
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xs text-neutral-400">
              Exterior doors & hatches locked. PIR motion bypassed inside so occupants can sleep.
            </p>
          </button>

          <button
            onClick={() => setSecurityMode('armed_away')}
            className={`p-4 rounded-xl border text-left transition-colors ${
              security.systemMode === 'armed_away'
                ? 'bg-rose-950/50 border-rose-600 text-white shadow-sm'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm text-rose-400">Armed / Away</span>
              <Shield className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-xs text-neutral-400">
              Full lockdown. Main door, windows, and interior PIR active. Any breach sounds siren.
            </p>
          </button>
        </div>
      </div>

      {/* Sensor Zone Matrix & Geofence Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sensor Zone Status Matrix */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="font-semibold text-white font-display text-base">
              Sensor Zone Status Matrix
            </h3>
            <span className="text-xs text-neutral-400">5 Monitored Portals</span>
          </div>

          <div className="space-y-2.5">
            {/* Zone 1: Main Entrance Door */}
            <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-medium text-white flex items-center gap-2">
                  <span>Zone 1: Heavy-Duty Entrance Door</span>
                  <span className="text-[10px] text-neutral-400 font-mono">GPIO 22 / REED-01</span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Magnetic contact + Smart 12V Solenoid Deadbolt
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-semibold ${
                    security.mainDoorOpen ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {security.mainDoorOpen ? 'DOOR OPEN' : 'CLOSED'}
                </span>
                <button
                  onClick={() =>
                    setDeviceTelemetry('security', { mainDoorOpen: !security.mainDoorOpen })
                  }
                  className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[11px]"
                >
                  Toggle
                </button>
              </div>
            </div>

            {/* Zone 2: Interior PIR Motion */}
            <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-medium text-white flex items-center gap-2">
                  <span>Zone 2: Interior Cabin PIR Motion</span>
                  <span className="text-[10px] text-neutral-400 font-mono">GPIO 27 / HC-SR501</span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  120° wide-angle passive infrared volumetric detector
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-semibold ${
                    security.pirMotionDetected ? 'text-rose-400' : 'text-neutral-400'
                  }`}
                >
                  {security.pirMotionDetected ? 'MOTION DETECTED' : 'Clear'}
                </span>
                <button
                  onClick={() =>
                    setDeviceTelemetry('security', {
                      pirMotionDetected: !security.pirMotionDetected,
                    })
                  }
                  className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[11px]"
                >
                  Toggle
                </button>
              </div>
            </div>

            {/* Zone 3: Left & Right Windows */}
            <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-medium text-white flex items-center gap-2">
                  <span>Zone 3: Berth Double-Glazed Windows</span>
                  <span className="text-[10px] text-neutral-400 font-mono">GPIO 14 / REED-02</span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Port & Starboard magnetic reed latches
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-semibold ${
                    security.windowLeftOpen || security.windowRightOpen
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {security.windowLeftOpen || security.windowRightOpen ? 'WINDOW AJAR' : 'SECURE'}
                </span>
                <button
                  onClick={() =>
                    setDeviceTelemetry('security', {
                      windowLeftOpen: !security.windowLeftOpen,
                    })
                  }
                  className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[11px]"
                >
                  Toggle
                </button>
              </div>
            </div>

            {/* Zone 4: Roof Hatch */}
            <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-medium text-white flex items-center gap-2">
                  <span>Zone 4: Pop-Top Roof Hatch Latches</span>
                  <span className="text-[10px] text-neutral-400 font-mono">GPIO 15 / REED-03</span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Prevents travel or storm damage with unlatched hatch
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-semibold ${
                    security.roofHatchOpen ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {security.roofHatchOpen ? 'HATCH UNLATCHED' : 'LATCHED'}
                </span>
                <button
                  onClick={() =>
                    setDeviceTelemetry('security', {
                      roofHatchOpen: !security.roofHatchOpen,
                    })
                  }
                  className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[11px]"
                >
                  Toggle
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* GPS Geofence & Anti-Theft Tracking */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <h3 className="font-semibold text-white font-display text-base">
                GPS Geofence & Anti-Theft Guard
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400">GPS FIX: 12 SATS</span>
          </div>

          <div className="p-4 bg-neutral-950/80 rounded-lg border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Designated Campsite Anchor:</span>
              <span className="font-mono text-neutral-200">
                {security.gpsCoordinates.lat.toFixed(4)}, {security.gpsCoordinates.lng.toFixed(4)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Geofence Perimeter:</span>
              <span className="font-mono text-amber-400 font-semibold">
                {security.geofenceRadiusMeters} meters radius
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Current Offset From Base:</span>
              <span className="font-mono text-white font-semibold">
                {security.distanceFromBaseMeters} meters
              </span>
            </div>

            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{
                  width: `${(security.distanceFromBaseMeters / security.geofenceRadiusMeters) * 100}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs">
              <span className="text-neutral-300 font-medium">Simulate Movement:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDeviceTelemetry('security', { distanceFromBaseMeters: 14 })}
                  className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[11px]"
                >
                  At Camp (14m)
                </button>
                <button
                  onClick={() => setDeviceTelemetry('security', { distanceFromBaseMeters: 420 })}
                  className="px-2 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded text-[11px]"
                >
                  Geofence Breach (420m)
                </button>
              </div>
            </div>
          </div>

          {/* Security Log */}
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span>Security Event Log</span>
              {securityAlerts.length > 0 && (
                <button onClick={clearAllAlerts} className="text-amber-400 hover:underline">
                  Clear Log
                </button>
              )}
            </div>

            {securityAlerts.length === 0 ? (
              <div className="p-4 bg-neutral-950/40 rounded-lg text-center text-xs text-neutral-500">
                No recent security anomalies or breaches logged.
              </div>
            ) : (
              <div className="space-y-2">
                {securityAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800 text-xs flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold text-rose-400">{alert.title}</div>
                      <p className="text-neutral-400 text-[11px] mt-0.5">{alert.message}</p>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono shrink-0">
                      {alert.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
