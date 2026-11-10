import React from 'react';
import { useCaravan } from '../context/CaravanContext';
import { FloorplanViewer } from './FloorplanViewer';
import {
  Lightbulb,
  Fan,
  Power,
  Flame,
  Droplets,
  ShieldAlert,
  Thermometer,
  Zap,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  X,
  Volume2,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    deviceState,
    toggleActuator,
    setSecurityMode,
    alerts,
    acknowledgeAlert,
    dismissAlert,
  } = useCaravan();

  const { power, environment, tanks, security, actuators } = deviceState;

  const activeCriticalAlert = alerts.find((a) => a.severity === 'critical' && !a.acknowledged);

  return (
    <div className="space-y-6">
      {/* Critical Alarm Banner if Siren is active */}
      {security.sirenActive && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-600 flex items-center justify-between gap-4 text-rose-200 animate-pulse">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <div className="font-semibold text-white">SECURITY ALERT: 110dB Siren Triggered</div>
              <div className="text-xs text-rose-300">
                Unauthorized entry or motion sensor breach detected. Perimeter defense floodlights active.
              </div>
            </div>
          </div>
          <button
            onClick={() => setSecurityMode('disarmed')}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-lg transition-colors shrink-0"
          >
            Disarm Siren & Clear Alarm
          </button>
        </div>
      )}

      {/* Interactive Caravan Layout Cutaway */}
      <FloorplanViewer />

      {/* Central Grid: Subsystems */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Smart Actuators & Lighting Hub */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <h3 className="font-semibold text-white font-display text-base">
                Smart Lighting & Relays
              </h3>
            </div>
            <span className="text-xs text-neutral-400">12V DC Solid State</span>
          </div>

          {/* Living Cabin Dimmer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-200 font-medium">Main Saloon Lighting</span>
              <span className="font-mono text-amber-400 font-semibold">{actuators.livingLightsPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={actuators.livingLightsPct}
              onChange={(e) => toggleActuator('livingLightsPct', Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
            {/* Color Temp Selector */}
            <div className="flex items-center gap-1.5 pt-1 text-[11px]">
              <span className="text-neutral-400">Tone:</span>
              {(['warm', 'neutral', 'cool'] as const).map((temp) => (
                <button
                  key={temp}
                  onClick={() => toggleActuator('livingLightsColorTemp', temp)}
                  className={`px-2 py-0.5 rounded capitalize transition-colors ${
                    actuators.livingLightsColorTemp === temp
                      ? 'bg-neutral-800 text-amber-400 border border-neutral-700 font-medium'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {temp}
                </button>
              ))}
            </div>
          </div>

          {/* Awning Camp Strip */}
          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-200 font-medium">Exterior Awning Camp Strip</span>
              <span className="font-mono text-amber-400">{actuators.awningStripPct}%</span>
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={() => toggleActuator('awningStripBugMode')}
                className={`flex-1 py-1 px-2 rounded text-[11px] font-medium transition-colors ${
                  actuators.awningStripBugMode
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {actuators.awningStripBugMode ? 'Bug-Shield 590nm Amber' : 'Warm White'}
              </button>
              <button
                onClick={() =>
                  toggleActuator('awningStripPct', actuators.awningStripPct > 0 ? 0 : 80)
                }
                className={`py-1 px-3 rounded text-[11px] font-medium transition-colors ${
                  actuators.awningStripPct > 0
                    ? 'bg-neutral-800 text-neutral-200'
                    : 'bg-neutral-900 text-neutral-400'
                }`}
              >
                {actuators.awningStripPct > 0 ? 'Turn Off' : 'Turn On'}
              </button>
            </div>
          </div>

          {/* Quick Toggle Relays */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <button
              onClick={() => toggleActuator('bedroomLightsOn')}
              className={`p-3 rounded-lg border text-left transition-colors flex flex-col justify-between h-20 ${
                actuators.bedroomLightsOn
                  ? 'bg-amber-400/10 border-amber-400/30 text-white'
                  : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-xs">Berth Lights</span>
                <Lightbulb className={`w-3.5 h-3.5 ${actuators.bedroomLightsOn ? 'text-amber-400' : 'text-neutral-600'}`} />
              </div>
              <span className="font-mono text-[11px]">{actuators.bedroomLightsOn ? 'ACTIVE' : 'OFF'}</span>
            </button>

            <button
              onClick={() => toggleActuator('perimeterFloodlightsOn')}
              className={`p-3 rounded-lg border text-left transition-colors flex flex-col justify-between h-20 ${
                actuators.perimeterFloodlightsOn
                  ? 'bg-amber-400/10 border-amber-400/30 text-white'
                  : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-xs">360° Floodlights</span>
                <Zap className={`w-3.5 h-3.5 ${actuators.perimeterFloodlightsOn ? 'text-amber-400' : 'text-neutral-600'}`} />
              </div>
              <span className="font-mono text-[11px]">{actuators.perimeterFloodlightsOn ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Center Column: Climate, Ventilation & Appliances */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-amber-400" />
              <h3 className="font-semibold text-white font-display text-base">
                Climate & Ventilation
              </h3>
            </div>
            <span className="text-xs text-neutral-400">DHT22 Digital Bus</span>
          </div>

          {/* Temperature Comparison Matrix */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[11px]">Cabin Interior</div>
              <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                {environment.cabinTempC}°C
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                Humidity: {environment.cabinHumidityPct}%
              </div>
            </div>

            <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[11px]">Exterior Ambient</div>
              <div className="text-2xl font-bold font-mono text-amber-300 mt-1 tabular-nums">
                {environment.exteriorTempC}°C
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                Humidity: {environment.exteriorHumidityPct}%
              </div>
            </div>
          </div>

          {/* Roof Maxxfan Ventilation Controller */}
          <div className="p-3.5 bg-neutral-950/60 rounded-lg border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fan className={`w-4 h-4 text-sky-400 ${actuators.roofVentFanSpeed !== 'off' ? 'animate-spin' : ''}`} />
                <span className="text-xs font-medium text-white">Roof Maxxfan Exhaust</span>
              </div>
              <button
                onClick={() =>
                  toggleActuator(
                    'roofVentDirection',
                    actuators.roofVentDirection === 'exhaust' ? 'intake' : 'exhaust'
                  )
                }
                className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 uppercase font-mono"
              >
                {actuators.roofVentDirection}
              </button>
            </div>

            {/* Speeds */}
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              {(['off', 'low', 'med', 'high'] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => toggleActuator('roofVentFanSpeed', spd)}
                  className={`py-1.5 rounded text-center capitalize transition-colors font-medium text-[11px] ${
                    actuators.roofVentFanSpeed === spd
                      ? 'bg-sky-400 text-neutral-950 font-semibold'
                      : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>

          {/* 12V Compressor Fridge Status */}
          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800 flex items-center justify-between text-xs">
            <div>
              <div className="font-medium text-white">12V Danfoss/Secop Fridge</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                Target: {environment.fridgeTargetTempC}°C · Freezer: {environment.freezerTempC}°C
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base font-mono font-bold text-emerald-400 tabular-nums">
                {environment.fridgeTempC}°C
              </span>
              <button
                onClick={() => toggleActuator('fridgePowerOn')}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  actuators.fridgePowerOn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-500'
                }`}
                title="Toggle Fridge"
              >
                <Power className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Hot Water Geyser Boost */}
          <div className="flex items-center justify-between p-3 bg-neutral-950/60 rounded-lg border border-neutral-800 text-xs">
            <div>
              <div className="font-medium text-white">Solar Thermal Geyser Boost</div>
              <div className="text-[11px] text-neutral-400">12V / 300W heating element</div>
            </div>
            <button
              onClick={() => toggleActuator('hotWaterBoostOn')}
              className={`px-3 py-1.5 rounded font-medium transition-colors text-xs ${
                actuators.hotWaterBoostOn
                  ? 'bg-rose-500 text-white font-semibold'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {actuators.hotWaterBoostOn ? 'BOOSTING' : 'STANDBY'}
            </button>
          </div>
        </div>

        {/* Right Column: Tanks & Security Perimeter */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-amber-400" />
              <h3 className="font-semibold text-white font-display text-base">
                Tanks & Security
              </h3>
            </div>
            <span className="text-xs text-neutral-400">Ultrasonic Level Probes</span>
          </div>

          {/* Fresh Water Tank */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-medium text-neutral-200">Fresh Water Reservoir</span>
              <span className="font-mono text-sky-400 font-semibold tabular-nums">
                {tanks.freshWaterLiters}L / {tanks.freshWaterCapacityLiters}L
              </span>
            </div>
            <div className="w-full bg-neutral-950 h-2.5 rounded-full overflow-hidden border border-neutral-800">
              <div
                className="bg-sky-500 h-full rounded-full transition-all"
                style={{
                  width: `${(tanks.freshWaterLiters / tanks.freshWaterCapacityLiters) * 100}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-0.5">
              <span>Shurflo 12V 45PSI Pump</span>
              <button
                onClick={() => toggleActuator('hotWaterBoostOn')} // or pump toggle
                className="text-amber-400 hover:underline"
              >
                Pressurized Nominal
              </button>
            </div>
          </div>

          {/* Grey Water Tank */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-medium text-neutral-200">Grey Water Holding Tank</span>
              <span className="font-mono text-neutral-300 font-semibold tabular-nums">
                {tanks.greyWaterLiters}L / {tanks.greyWaterCapacityLiters}L
              </span>
            </div>
            <div className="w-full bg-neutral-950 h-2.5 rounded-full overflow-hidden border border-neutral-800">
              <div
                className={`h-full rounded-full transition-all ${
                  tanks.greyWaterLiters > 60 ? 'bg-amber-500' : 'bg-neutral-600'
                }`}
                style={{
                  width: `${(tanks.greyWaterLiters / tanks.greyWaterCapacityLiters) * 100}%`,
                }}
              />
            </div>
            <div className="text-[11px] text-neutral-400 pt-0.5">
              {tanks.greyWaterLiters > 60
                ? 'High capacity reached · empty at depot/RV dump'
                : 'Tank within safe holding limits'}
            </div>
          </div>

          {/* Security Mode Selector */}
          <div className="p-3.5 bg-neutral-950/60 rounded-lg border border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-white">Smart Perimeter Mode</span>
              <span className="capitalize font-mono text-amber-400">
                {security.systemMode.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                onClick={() => setSecurityMode('disarmed')}
                className={`py-2 px-1 rounded text-center transition-colors font-medium text-[11px] ${
                  security.systemMode === 'disarmed'
                    ? 'bg-neutral-700 text-white font-semibold'
                    : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Disarmed
              </button>
              <button
                onClick={() => setSecurityMode('camp_mode')}
                className={`py-2 px-1 rounded text-center transition-colors font-medium text-[11px] ${
                  security.systemMode === 'camp_mode'
                    ? 'bg-amber-400 text-neutral-950 font-semibold'
                    : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Camp Mode
              </button>
              <button
                onClick={() => setSecurityMode('armed_away')}
                className={`py-2 px-1 rounded text-center transition-colors font-medium text-[11px] ${
                  security.systemMode === 'armed_away'
                    ? 'bg-rose-500 text-white font-semibold'
                    : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Armed Away
              </button>
            </div>

            {/* Deadbolt toggle */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-800/80">
              <span className="text-neutral-400">Main Solenoid Deadbolt</span>
              <button
                onClick={() =>
                  setSecurityMode(
                    security.mainDoorLocked ? 'disarmed' : 'camp_mode'
                  )
                }
                className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium"
              >
                {security.mainDoorLocked ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>LOCKED</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>UNLOCKED</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts Feed */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-white font-display text-base">
              System Telemetry & Alerts
            </h3>
          </div>
          <span className="text-xs text-neutral-400">
            {alerts.length} registered events
          </span>
        </div>

        {alerts.length === 0 ? (
          <div className="py-6 text-center text-xs text-neutral-400">
            All caravan subsystems nominal. No active warnings.
          </div>
        ) : (
          <div className="divide-y divide-neutral-800/80">
            {alerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                className="py-3 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      alert.severity === 'critical'
                        ? 'bg-rose-500'
                        : alert.severity === 'warning'
                        ? 'bg-amber-400'
                        : 'bg-sky-400'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{alert.title}</span>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {alert.timestamp}
                      </span>
                    </div>
                    <p className="text-neutral-400 mt-0.5 text-[11px]">
                      {alert.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="text-[11px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 hover:text-white"
                    >
                      Ack
                    </button>
                  )}
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1 text-neutral-400 hover:text-neutral-200"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
