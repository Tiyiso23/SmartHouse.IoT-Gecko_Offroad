import React from 'react';
import { useCaravan } from '../context/CaravanContext';
import {
  Sun,
  Battery,
  Zap,
  Plug,
  Gauge,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Power,
} from 'lucide-react';

export const PowerEnergyView: React.FC = () => {
  const { deviceState, toggleActuator, setDeviceTelemetry } = useCaravan();
  const { power } = deviceState;

  // Compute energy metrics
  const netWatts =
    power.batteryCurrent >= 0
      ? Math.round(power.batteryCurrent * power.batteryVoltage)
      : Math.round(Math.abs(power.batteryCurrent) * power.batteryVoltage);

  const hoursRemaining =
    power.batteryCurrent < 0
      ? (
          ((power.batteryCapacityAh * (power.batterySoc / 100)) /
            Math.abs(power.batteryCurrent))
        ).toFixed(1)
      : 'Infinite (Net Charging)';

  return (
    <div className="space-y-6">
      {/* Top Banner: Power Flow & System Health */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <h2 className="text-xl font-bold text-white font-display">
              Smart Energy & Solar MPPT Architecture
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Gecko 200Ah Lithium LiFePO4 Dual-Cell System · 450W Monocrystalline Rooftop Array
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setDeviceTelemetry('power', {
                  shorePowerConnected: !power.shorePowerConnected,
                  batteryCurrent: !power.shorePowerConnected ? 25.0 : power.batteryCurrent,
                })
              }
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                power.shorePowerConnected
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                  : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-neutral-200'
              }`}
            >
              <Plug className="w-3.5 h-3.5" />
              <span>
                {power.shorePowerConnected ? '230V Shore Grid: Connected' : 'Grid: Disconnected (Off-Grid)'}
              </span>
            </button>
          </div>
        </div>

        {/* Visual Power Bus Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* Node 1: Solar Input */}
          <div className="p-4 bg-neutral-950/80 rounded-xl border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-neutral-300 font-medium">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Rooftop Solar Array</span>
              </div>
              <span className="font-mono text-neutral-400">MPPT 100/30</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white tabular-nums">
                {power.solarWatts}W
              </span>
              <span className="text-xs text-neutral-400">/ 450W Max</span>
            </div>
            <div className="space-y-1 text-xs text-neutral-400 pt-1">
              <div className="flex justify-between">
                <span>Harvest Today:</span>
                <span className="font-mono text-neutral-200 font-semibold">{power.solarDailyKwh} kWh</span>
              </div>
              <div className="flex justify-between">
                <span>Charge State:</span>
                <span className="text-amber-400 font-medium">
                  {power.batterySoc >= 95 ? 'Float Mode' : 'Bulk MPPT'}
                </span>
              </div>
            </div>
          </div>

          {/* Node 2: LiFePO4 Battery Bank */}
          <div className="p-4 bg-neutral-950/80 rounded-xl border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-neutral-300 font-medium">
                <Battery className="w-4 h-4 text-amber-400" />
                <span>200Ah LiFePO4 Bank</span>
              </div>
              <span className="font-mono text-emerald-400 font-medium">BMS ONLINE</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white tabular-nums">
                {power.batterySoc}%
              </span>
              <span className="text-xs font-mono text-neutral-400 tabular-nums">
                ({power.batteryVoltage}V)
              </span>
            </div>
            <div className="space-y-1 text-xs text-neutral-400 pt-1">
              <div className="flex justify-between">
                <span>Net Current:</span>
                <span
                  className={`font-mono font-semibold ${
                    power.batteryCurrent >= 0 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {power.batteryCurrent >= 0 ? `+${power.batteryCurrent}A` : `${power.batteryCurrent}A`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>State of Health:</span>
                <span className="font-mono text-neutral-200">{power.batteryHealthPct}% ({power.batteryCycles} cycles)</span>
              </div>
            </div>
          </div>

          {/* Node 3: Consumption Loads */}
          <div className="p-4 bg-neutral-950/80 rounded-xl border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-neutral-300 font-medium">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Loads & Consumption</span>
              </div>
              <span className="font-mono text-neutral-400">Total Draw</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white tabular-nums">
                {power.inverterLoadWatts + power.dcLoadWatts}W
              </span>
              <span className="text-xs text-neutral-400">Active</span>
            </div>
            <div className="space-y-1 text-xs text-neutral-400 pt-1">
              <div className="flex justify-between">
                <span>230V AC Load:</span>
                <span className="font-mono text-neutral-200">{power.inverterLoadWatts}W</span>
              </div>
              <div className="flex justify-between">
                <span>12V DC Native:</span>
                <span className="font-mono text-neutral-200">{power.dcLoadWatts}W</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inverter & DC Breakers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2000W Inverter Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <h3 className="font-semibold text-white font-display text-base">
                Victron 2000W Pure Sine Inverter
              </h3>
              <p className="text-xs text-neutral-400">
                Powers domestic 230V induction cooktop, laptop chargers, microwave
              </p>
            </div>
            <button
              onClick={() => toggleActuator('inverterSwitchOn')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                power.inverterOn
                  ? 'bg-amber-400 text-neutral-950'
                  : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{power.inverterOn ? '230V AC ACTIVE' : 'INVERTER OFF'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
              <span className="text-neutral-400 text-[11px]">Output Voltage</span>
              <div className="text-xl font-bold font-mono text-white mt-1">230V AC ±2%</div>
              <span className="text-neutral-400 text-[11px]">Pure Sine 50Hz</span>
            </div>

            <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
              <span className="text-neutral-400 text-[11px]">Current Load</span>
              <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                {power.inverterLoadWatts}W
              </div>
              <span className="text-neutral-400 text-[11px]">
                {Math.round((power.inverterLoadWatts / 2000) * 100)}% Capacity
              </span>
            </div>
          </div>

          {/* Quick Inverter Load Simulation */}
          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-medium">Simulate AC Load:</span>
              <span className="font-mono text-neutral-400">{power.inverterLoadWatts}W</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDeviceTelemetry('power', { inverterLoadWatts: 0 })}
                className="px-2 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300"
              >
                Idle (0W)
              </button>
              <button
                onClick={() => setDeviceTelemetry('power', { inverterLoadWatts: 180 })}
                className="px-2 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300"
              >
                Laptop & TV (180W)
              </button>
              <button
                onClick={() => setDeviceTelemetry('power', { inverterLoadWatts: 950 })}
                className="px-2 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300"
              >
                Coffee Machine (950W)
              </button>
              <button
                onClick={() => setDeviceTelemetry('power', { inverterLoadWatts: 1600 })}
                className="px-2 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300"
              >
                Induction Plate (1600W)
              </button>
            </div>
          </div>
        </div>

        {/* DC 12V Circuit Breaker & Sensor Telemetry */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <h3 className="font-semibold text-white font-display text-base">
                12V DC Digital Fuse Block
              </h3>
              <p className="text-xs text-neutral-400">
                Solid-state electronic circuit breakers with telemetry sensing
              </p>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="divide-y divide-neutral-800 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Circuit 1: 12V Danfoss Compressor Fridge</div>
                <div className="text-[11px] text-neutral-400">Continuous 24/7 cooling cycle</div>
              </div>
              <span className="font-mono text-neutral-300">3.8A · 48W</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Circuit 2: Cabin & Awning LED Array</div>
                <div className="text-[11px] text-neutral-400">PWM dimmed interior & exterior</div>
              </div>
              <span className="font-mono text-neutral-300">1.8A · 22W</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Circuit 3: Maxxfan Roof Ventilation</div>
                <div className="text-[11px] text-neutral-400">Thermostatic auto-exhaust</div>
              </div>
              <span className="font-mono text-neutral-300">1.4A · 18W</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Circuit 4: ESP32 IoT Microcontroller Node</div>
                <div className="text-[11px] text-neutral-400">Dual-band telemetry & sensor bus</div>
              </div>
              <span className="font-mono text-neutral-300">0.2A · 2.5W</span>
            </div>
          </div>

          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800 flex items-center justify-between text-xs">
            <span className="text-neutral-400">Estimated Off-Grid Autonomy:</span>
            <span className="font-mono text-amber-400 font-semibold text-sm">
              {hoursRemaining} {power.batteryCurrent < 0 ? 'hours' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
