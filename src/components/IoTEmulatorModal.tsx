import React from 'react';
import { useCaravan } from '../context/CaravanContext';
import {
  X,
  Sliders,
  RotateCcw,
  Sun,
  Thermometer,
  Battery,
  Droplets,
  Lock,
  Radio,
  Sparkles,
  Zap,
} from 'lucide-react';

export const IoTEmulatorModal: React.FC = () => {
  const {
    isEmulatorOpen,
    setIsEmulatorOpen,
    deviceState,
    setDeviceTelemetry,
    applyScenario,
    simulateIntruderBreach,
    resetAllToDefault,
  } = useCaravan();

  if (!isEmulatorOpen) return null;

  const { power, environment, tanks, security } = deviceState;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white font-display">
                IoT Physical Hardware Emulator Sandbox
              </h3>
              <p className="text-xs text-neutral-400">
                Simulate environmental forces, battery levels &amp; edge triggers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetAllToDefault}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              title="Reset to defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsEmulatorOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs">
          {/* Quick Scenario Preset Row */}
          <div>
            <div className="text-neutral-300 font-semibold mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Realistic Field Scenarios:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => applyScenario('kalahari_noon')}
                className="p-2.5 bg-neutral-950 hover:bg-neutral-800 rounded-lg border border-neutral-800 text-left transition-colors"
              >
                <div className="font-semibold text-white">Kalahari Desert Noon</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">41°C heat · 428W solar · high fan</div>
              </button>
              <button
                onClick={() => applyScenario('highveld_storm')}
                className="p-2.5 bg-neutral-950 hover:bg-neutral-800 rounded-lg border border-neutral-800 text-left transition-colors"
              >
                <div className="font-semibold text-white">Highveld Thunderstorm</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Sudden temp drop · open hatch alert</div>
              </button>
              <button
                onClick={() => applyScenario('night_stealth')}
                className="p-2.5 bg-neutral-950 hover:bg-neutral-800 rounded-lg border border-neutral-800 text-left transition-colors"
              >
                <div className="font-semibold text-white">Night Camp Stealth</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">0W solar · bug amber · armed</div>
              </button>
              <button
                onClick={simulateIntruderBreach}
                className="p-2.5 bg-rose-950/60 hover:bg-rose-900/60 rounded-lg border border-rose-800 text-left transition-colors"
              >
                <div className="font-semibold text-rose-300">Intruder Breach Trigger</div>
                <div className="text-[10px] text-rose-400 mt-0.5">PIR + door breach · 110dB siren</div>
              </button>
              <button
                onClick={() => applyScenario('rental_return_checkin')}
                className="p-2.5 bg-neutral-950 hover:bg-neutral-800 rounded-lg border border-neutral-800 text-left transition-colors"
              >
                <div className="font-semibold text-white">Depot Return Check-in</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Low fresh water · full grey tank</div>
              </button>
              <button
                onClick={() => {
                  setDeviceTelemetry('power', { batterySoc: 15, inverterOn: false });
                }}
                className="p-2.5 bg-neutral-950 hover:bg-neutral-800 rounded-lg border border-neutral-800 text-left transition-colors"
              >
                <div className="font-semibold text-white">Critical Low Battery (15%)</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Triggers BMS load shedding rule</div>
              </button>
            </div>
          </div>

          {/* Continuous Sensor Sliders */}
          <div className="space-y-4 pt-2 border-t border-neutral-800">
            <div className="text-neutral-300 font-semibold">Fine Sensor Sliders:</div>

            {/* Solar Radiation */}
            <div>
              <div className="flex justify-between text-neutral-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Solar Array Intake:</span>
                </span>
                <span className="font-mono text-amber-400 font-bold">{power.solarWatts}W</span>
              </div>
              <input
                type="range"
                min="0"
                max="450"
                value={power.solarWatts}
                onChange={(e) =>
                  setDeviceTelemetry('power', {
                    solarWatts: Number(e.target.value),
                    batteryCurrent: Number(e.target.value) > 200 ? 14.5 : -4.2,
                  })
                }
                className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Battery SoC */}
            <div>
              <div className="flex justify-between text-neutral-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <Battery className="w-3.5 h-3.5 text-amber-400" />
                  <span>LiFePO4 Battery SoC:</span>
                </span>
                <span className="font-mono text-white font-bold">{power.batterySoc}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={power.batterySoc}
                onChange={(e) => {
                  const soc = Number(e.target.value);
                  setDeviceTelemetry('power', {
                    batterySoc: soc,
                    batteryVoltage: Number((12.4 + (soc / 100) * 1.2).toFixed(2)),
                  });
                }}
                className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Cabin Temp */}
            <div>
              <div className="flex justify-between text-neutral-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cabin Interior Temp:</span>
                </span>
                <span className="font-mono text-white font-bold">{environment.cabinTempC}°C</span>
              </div>
              <input
                type="range"
                min="14"
                max="45"
                step="0.5"
                value={environment.cabinTempC}
                onChange={(e) =>
                  setDeviceTelemetry('environment', { cabinTempC: Number(e.target.value) })
                }
                className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Fresh Water Level */}
            <div>
              <div className="flex justify-between text-neutral-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-sky-400" />
                  <span>Fresh Water Reservoir:</span>
                </span>
                <span className="font-mono text-sky-400 font-bold">{tanks.freshWaterLiters}L</span>
              </div>
              <input
                type="range"
                min="0"
                max={tanks.freshWaterCapacityLiters}
                value={tanks.freshWaterLiters}
                onChange={(e) =>
                  setDeviceTelemetry('tanks', { freshWaterLiters: Number(e.target.value) })
                }
                className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Discrete Hardware Switches */}
          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <div className="text-neutral-300 font-semibold">Discrete Hardware Switches:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() =>
                  setDeviceTelemetry('security', { mainDoorOpen: !security.mainDoorOpen })
                }
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  security.mainDoorOpen
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : 'bg-neutral-950 text-neutral-300 border-neutral-800'
                }`}
              >
                <div className="font-medium">Main Door</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  {security.mainDoorOpen ? 'Open (Ajar)' : 'Closed (Contact made)'}
                </div>
              </button>

              <button
                onClick={() =>
                  setDeviceTelemetry('security', {
                    pirMotionDetected: !security.pirMotionDetected,
                  })
                }
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  security.pirMotionDetected
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : 'bg-neutral-950 text-neutral-300 border-neutral-800'
                }`}
              >
                <div className="font-medium">PIR Volumetric</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  {security.pirMotionDetected ? 'Motion High (3.3V)' : 'Clear (0V)'}
                </div>
              </button>

              <button
                onClick={() =>
                  setDeviceTelemetry('security', { roofHatchOpen: !security.roofHatchOpen })
                }
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  security.roofHatchOpen
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-neutral-950 text-neutral-300 border-neutral-800'
                }`}
              >
                <div className="font-medium">Roof Pop-Top Hatch</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  {security.roofHatchOpen ? 'Unlatched (Ajar)' : 'Latched Down'}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <span className="text-xs text-neutral-400 font-mono">
            State changes synchronize across all tabs &amp; MQTT bus
          </span>
          <button
            onClick={() => setIsEmulatorOpen(false)}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-lg text-xs transition-colors"
          >
            Apply &amp; Close Sandbox
          </button>
        </div>
      </div>
    </div>
  );
};
