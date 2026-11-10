import React, { useState } from 'react';
import { useCaravan } from '../context/CaravanContext';
import {
  Sun,
  Battery,
  Lightbulb,
  Fan,
  Lock,
  Unlock,
  Radio,
  Flame,
  Droplets,
  AlertTriangle,
} from 'lucide-react';

export const FloorplanViewer: React.FC = () => {
  const { deviceState, toggleActuator, setSecurityMode } = useCaravan();
  const [selectedZone, setSelectedZone] = useState<string>('all');

  const { power, environment, tanks, security, actuators } = deviceState;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="text-base font-semibold text-white font-display">
            Interactive Caravan Cutaway Layout
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Desert Falcon 18XT · Dual-axle chassis · Sensor & actuator spatial telemetry
          </p>
        </div>

        {/* Interactive filter controls */}
        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs">
          <button
            onClick={() => setSelectedZone('all')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              selectedZone === 'all'
                ? 'bg-neutral-800 text-amber-400 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All Subsystems
          </button>
          <button
            onClick={() => setSelectedZone('lighting')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              selectedZone === 'lighting'
                ? 'bg-neutral-800 text-amber-400 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Lighting
          </button>
          <button
            onClick={() => setSelectedZone('security')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              selectedZone === 'security'
                ? 'bg-neutral-800 text-amber-400 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Security & Doors
          </button>
          <button
            onClick={() => setSelectedZone('utilities')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              selectedZone === 'utilities'
                ? 'bg-neutral-800 text-amber-400 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Water & HVAC
          </button>
        </div>
      </div>

      {/* Main Floorplan Schematic SVG */}
      <div className="py-6 flex items-center justify-center">
        <div className="relative w-full max-w-3xl aspect-[2.4/1] bg-neutral-950/80 rounded-2xl border border-neutral-800 p-3 sm:p-4 shadow-inner">
          {/* Subtle grid background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none rounded-2xl"
            style={{
              backgroundImage:
                'radial-gradient(#d4d4d8 1px, transparent 1px), radial-gradient(#d4d4d8 1px, #000 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Caravan Outer Shell Outline */}
          <div className="relative w-full h-full border-2 border-neutral-700 rounded-3xl flex overflow-hidden bg-neutral-900/60">
            {/* Front A-Frame & Hitch (Left side) */}
            <div className="w-[10%] h-full border-r border-dashed border-neutral-700/80 bg-neutral-900/90 flex flex-col items-center justify-between p-2">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider -rotate-90 origin-center my-auto">
                Hitch
              </span>
              <div className="w-full text-center">
                <span className="text-[9px] font-mono text-neutral-400">LP GAS</span>
              </div>
            </div>

            {/* Bedroom / Forward Berth */}
            <div className="w-[32%] h-full border-r border-neutral-700/80 p-2.5 flex flex-col justify-between relative bg-neutral-950/40">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-neutral-300">Queen Berth</span>
                <button
                  onClick={() => toggleActuator('bedroomLightsOn')}
                  className={`p-1.5 rounded-md transition-colors ${
                    actuators.bedroomLightsOn
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                  title="Toggle Bedroom Lights"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Side Window Contact Sensor */}
              <div className="flex items-center justify-between text-[10px] py-1 px-1.5 bg-neutral-900 rounded border border-neutral-800">
                <span className="text-neutral-400">Left Window:</span>
                <span className={security.windowLeftOpen ? 'text-amber-400 font-medium' : 'text-emerald-400'}>
                  {security.windowLeftOpen ? 'Ajar' : 'Latched'}
                </span>
              </div>

              {/* Battery Bank & Inverter Compartment under bed */}
              <div className="p-2 rounded-lg bg-neutral-900/90 border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Battery className="w-3.5 h-3.5 text-amber-400" />
                  <div>
                    <div className="text-[10px] font-medium text-neutral-200">LiFePO4 Bank</div>
                    <div className="text-[10px] font-mono text-neutral-400 tabular-nums">
                      {power.batterySoc}% · {power.batteryVoltage}V
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-neutral-400">Inverter</div>
                  <button
                    onClick={() => toggleActuator('inverterSwitchOn')}
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                      actuators.inverterSwitchOn
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {actuators.inverterSwitchOn ? '230V ON' : 'STANDBY'}
                  </button>
                </div>
              </div>
            </div>

            {/* Central Saloon & Dinette & Galley */}
            <div className="w-[38%] h-full border-r border-neutral-700/80 p-2.5 flex flex-col justify-between relative bg-neutral-950/20">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-neutral-300">Galley & Dinette</span>

                {/* Roof Maxxfan Ventilation */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleActuator('roofVentFanSpeed')}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-colors ${
                      actuators.roofVentFanSpeed !== 'off'
                        ? 'bg-sky-950 text-sky-400 border border-sky-800'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                    title="Roof Vent Fan"
                  >
                    <Fan className={`w-3 h-3 ${actuators.roofVentFanSpeed !== 'off' ? 'animate-spin' : ''}`} />
                    <span className="capitalize">{actuators.roofVentFanSpeed}</span>
                  </button>
                </div>
              </div>

              {/* PIR Motion Sensor Field */}
              <div className="flex items-center justify-between text-[10px] bg-neutral-900/80 px-2 py-1 rounded border border-neutral-800">
                <div className="flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-neutral-400" />
                  <span className="text-neutral-300">PIR Motion:</span>
                </div>
                <span
                  className={`font-medium ${
                    security.pirMotionDetected ? 'text-rose-400 font-semibold' : 'text-neutral-400'
                  }`}
                >
                  {security.pirMotionDetected ? 'MOTION DETECTED' : 'Clear'}
                </span>
              </div>

              {/* Living Lights Dimmer */}
              <div className="p-2 rounded-lg bg-neutral-900/90 border border-neutral-800">
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-neutral-300">Living Cabin LEDs</span>
                  <span className="text-amber-400 font-mono">{actuators.livingLightsPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={actuators.livingLightsPct}
                  onChange={(e) => toggleActuator('livingLightsPct', Number(e.target.value))}
                  className="w-full h-1 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Galley 12V Fridge Status */}
              <div className="flex items-center justify-between text-[10px] px-2 py-1 bg-neutral-900 rounded border border-neutral-800">
                <span className="text-neutral-400">12V Compressor Fridge:</span>
                <span className="font-mono text-emerald-400 tabular-nums">
                  {environment.fridgeTempC}°C
                </span>
              </div>
            </div>

            {/* Rear Entry & En-suite Bathroom */}
            <div className="w-[20%] h-full p-2.5 flex flex-col justify-between bg-neutral-950/40">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-neutral-300">En-suite</span>
                <button
                  onClick={() => toggleActuator('hotWaterBoostOn')}
                  className={`p-1.5 rounded transition-colors ${
                    actuators.hotWaterBoostOn
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                  title="Toggle Hot Water Geyser"
                >
                  <Flame className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Fresh & Grey Water Tanks */}
              <div className="space-y-1.5">
                <div className="text-[9px]">
                  <div className="flex justify-between text-neutral-400 mb-0.5">
                    <span>Fresh</span>
                    <span className="font-mono text-sky-400 tabular-nums">
                      {tanks.freshWaterLiters}L ({Math.round((tanks.freshWaterLiters / tanks.freshWaterCapacityLiters) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-500 h-full rounded-full transition-all"
                      style={{
                        width: `${(tanks.freshWaterLiters / tanks.freshWaterCapacityLiters) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="text-[9px]">
                  <div className="flex justify-between text-neutral-400 mb-0.5">
                    <span>Grey</span>
                    <span className="font-mono text-neutral-300 tabular-nums">
                      {tanks.greyWaterLiters}L ({Math.round((tanks.greyWaterLiters / tanks.greyWaterCapacityLiters) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-neutral-500 h-full rounded-full transition-all"
                      style={{
                        width: `${(tanks.greyWaterLiters / tanks.greyWaterCapacityLiters) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Smart Entrance Door Lock */}
              <div className="pt-1">
                <button
                  onClick={() =>
                    setSecurityMode(
                      security.systemMode === 'disarmed' ? 'camp_mode' : 'disarmed'
                    )
                  }
                  className={`w-full py-1.5 px-2 rounded flex items-center justify-center gap-1.5 text-[10px] font-medium transition-colors ${
                    security.mainDoorLocked
                      ? 'bg-neutral-800 text-amber-400 border border-neutral-700'
                      : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                  }`}
                >
                  {security.mainDoorLocked ? (
                    <>
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>Entry Locked</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3 h-3 text-neutral-400" />
                      <span>Unlocked</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Exterior Awning Strip Annotation (bottom) */}
          <div className="mt-2 flex items-center justify-between px-2 py-1 bg-neutral-900/80 rounded-lg border border-neutral-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-300">Awning Camp LED Strip:</span>
              <button
                onClick={() => toggleActuator('awningStripBugMode')}
                className={`text-[10px] px-2 py-0.5 rounded font-medium transition-colors ${
                  actuators.awningStripBugMode
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {actuators.awningStripBugMode ? '590nm Amber Bug Shield' : 'Warm White'}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-neutral-400">Rooftop Solar:</span>
              <span className="text-[11px] font-mono text-amber-400 font-semibold tabular-nums">
                {power.solarWatts}W
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
