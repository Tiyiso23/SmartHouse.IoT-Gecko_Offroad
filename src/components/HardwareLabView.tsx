import React, { useState } from 'react';
import { useCaravan } from '../context/CaravanContext';
import {
  Cpu,
  Terminal,
  Activity,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle,
  Copy,
  Send,
  Zap,
} from 'lucide-react';

export const HardwareLabView: React.FC = () => {
  const { deviceState, mqttPackets, setDeviceTelemetry } = useCaravan();
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [tempOffset, setTempOffset] = useState<number>(0.0);
  const [tankZeroCalib, setTankZeroCalib] = useState<number>(0);
  const [customTopic, setCustomTopic] = useState<string>('gecko/caravan/gk01/telemetry/custom');
  const [customPayload, setCustomPayload] = useState<string>(
    JSON.stringify({ event: 'PULSE', value: 42, rssi: -64 }, null, 2)
  );

  const filteredPackets = isPaused
    ? []
    : mqttPackets.filter((p) => {
        if (selectedTopicFilter === 'all') return true;
        return p.topic.includes(selectedTopicFilter);
      });

  const pinouts = [
    { pin: 'GPIO 4', func: 'DHT22 Digital Bus', target: 'Cabin Temp & Humidity Sensor', type: 'Digital In (Pull-up)' },
    { pin: 'GPIO 14', func: 'Reed Contact Bus', target: 'Berth Windows Magnetic Sensors', type: 'Digital In' },
    { pin: 'GPIO 15', func: 'Roof Skylight Reed', target: 'Pop-Top Latch Sensor', type: 'Digital In' },
    { pin: 'GPIO 16', func: 'PWM Mosfet Ch1', target: 'Living Cabin LED Dimmer (0-100%)', type: 'PWM Out (1kHz)' },
    { pin: 'GPIO 17', func: 'Relay Ch2 Coil', target: 'Victron 2000W AC Inverter Switch', type: 'Digital Out' },
    { pin: 'GPIO 18', func: 'Relay Ch3 Coil', target: 'Shurflo 12V Water Pump', type: 'Digital Out' },
    { pin: 'GPIO 19', func: 'PWM Mosfet Ch4', target: 'Roof Maxxfan Exhaust / Intake', type: 'PWM Out' },
    { pin: 'GPIO 21/22', func: 'I2C Bus (SDA/SCL)', target: 'Victron SmartShunt BMS & MPPT', type: 'I2C Master' },
    { pin: 'GPIO 23', func: 'Relay Ch5 (Solenoid)', target: 'Main Entrance Deadbolt Lock', type: 'Pulse Out (500ms)' },
    { pin: 'GPIO 27', func: 'PIR Motion Sensor', target: 'HC-SR501 Infrared Volumetric', type: 'Interrupt In' },
    { pin: 'GPIO 34', func: 'ADC1 Channel 6', target: 'Fresh Water Ultrasonic Probe', type: 'Analog 12-bit' },
    { pin: 'GPIO 35', func: 'ADC1 Channel 7', target: 'Grey Water Ultrasonic Probe', type: 'Analog 12-bit' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Microcontroller Specs */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <h2 className="text-xl font-bold text-white font-display">
              IoT Hardware Lab & ESP32 Telemetry Monitor
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Simulated ESP32-WROOM-32U edge controller · MQTT 3.1.1 protocol over TLS · GPIO bus mapping
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="font-mono text-neutral-400">
              MAC: {deviceState.macAddress}
            </span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="font-mono text-amber-400">
              IP: {deviceState.ipAddress}
            </span>
          </div>
        </div>

        {/* ESP32 Hardware Diagnostics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-xs">
          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
            <span className="text-neutral-400">Microcontroller</span>
            <div className="text-sm font-bold font-mono text-white mt-1">
              ESP32 Dual-Core 240MHz
            </div>
            <span className="text-[11px] text-neutral-400">520KB SRAM · 4MB Flash</span>
          </div>

          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
            <span className="text-neutral-400">Wireless Connectivity</span>
            <div className="text-sm font-bold font-mono text-emerald-400 mt-1">
              LTE-M &amp; Wi-Fi Mesh
            </div>
            <span className="text-[11px] text-neutral-400">RSSI: {deviceState.signalRssi} dBm (Good)</span>
          </div>

          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
            <span className="text-neutral-400">Firmware Build</span>
            <div className="text-sm font-bold font-mono text-amber-400 mt-1">
              {deviceState.firmwareVersion}
            </div>
            <span className="text-[11px] text-neutral-400">OTA Update: Up to date</span>
          </div>

          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
            <span className="text-neutral-400">MQTT Session Status</span>
            <div className="text-sm font-bold font-mono text-sky-400 mt-1">
              ACTIVE (KeepAlive 60s)
            </div>
            <span className="text-[11px] text-neutral-400">Broker: broker.gecko-iot.cloud</span>
          </div>
        </div>
      </div>

      {/* Pinout Mapping Table & Sensor Calibration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Pinout Table */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <h3 className="font-semibold text-white font-display text-base">
                ESP32 GPIO & Peripheral Bus Pinout
              </h3>
              <p className="text-xs text-neutral-400">
                Hardware interface mapping to physical relays, sensors, and actuators
              </p>
            </div>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400">
                  <th className="pb-2 font-medium">Pin / Bus</th>
                  <th className="pb-2 font-medium">Peripheral</th>
                  <th className="pb-2 font-medium">Assigned Subsystem</th>
                  <th className="pb-2 font-medium">Signal Mode</th>
                  <th className="pb-2 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono">
                {pinouts.map((p) => (
                  <tr key={p.pin} className="hover:bg-neutral-950/40">
                    <td className="py-2 text-amber-400 font-semibold">{p.pin}</td>
                    <td className="py-2 text-neutral-200">{p.func}</td>
                    <td className="py-2 text-neutral-400">{p.target}</td>
                    <td className="py-2 text-neutral-500 text-[11px]">{p.type}</td>
                    <td className="py-2 text-right text-emerald-400 font-sans text-xs">Active</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Sensor Calibration & Diagnostic Injection */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="font-semibold text-white font-display text-base">
              Sensor Calibration
            </h3>
            <Sliders className="w-4 h-4 text-amber-400" />
          </div>

          <div className="space-y-4 text-xs">
            {/* DHT22 Offset */}
            <div>
              <div className="flex justify-between text-neutral-300 mb-1">
                <span>DHT22 Temp Offset (°C):</span>
                <span className="font-mono text-amber-400 font-semibold">
                  {tempOffset > 0 ? `+${tempOffset}` : tempOffset}°C
                </span>
              </div>
              <input
                type="range"
                min="-3.0"
                max="3.0"
                step="0.1"
                value={tempOffset}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTempOffset(val);
                  setDeviceTelemetry('environment', {
                    cabinTempC: Number((24.5 + val).toFixed(1)),
                  });
                }}
                className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-neutral-400">
                Calibrates internal thermistor variance against certified lab reference.
              </span>
            </div>

            {/* Ultrasonic Tank Calibration */}
            <div className="pt-2 border-t border-neutral-800">
              <div className="flex justify-between text-neutral-300 mb-1">
                <span>Ultrasonic Zero-Point Offset:</span>
                <span className="font-mono text-sky-400 font-semibold">{tankZeroCalib} mm</span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                step="1"
                value={tankZeroCalib}
                onChange={(e) => setTankZeroCalib(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-neutral-400">
                Corrects acoustic echo delay based on caravan chassis tilt angle.
              </span>
            </div>

            {/* Simulated Raw Hardware Ping */}
            <div className="pt-4 border-t border-neutral-800 space-y-2">
              <div className="font-medium text-white">Manual MQTT Frame Injector</div>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-[11px] font-mono text-neutral-200"
              />
              <textarea
                rows={3}
                value={customPayload}
                onChange={(e) => setCustomPayload(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-[11px] font-mono text-neutral-300"
              />
              <button
                onClick={() => {
                  try {
                    const parsed = JSON.parse(customPayload);
                    setDeviceTelemetry('environment', parsed);
                  } catch (err) {
                    // ignore invalid JSON in demo
                  }
                }}
                className="w-full py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Inject MQTT Packet</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live MQTT Packet Stream Terminal */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-white font-display text-base">
              Live MQTT Telemetry Stream (QoS 1)
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
              <button
                onClick={() => setSelectedTopicFilter('all')}
                className={`px-2 py-0.5 rounded ${
                  selectedTopicFilter === 'all'
                    ? 'bg-neutral-800 text-amber-400 font-medium'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedTopicFilter('telemetry')}
                className={`px-2 py-0.5 rounded ${
                  selectedTopicFilter === 'telemetry'
                    ? 'bg-neutral-800 text-amber-400 font-medium'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Telemetry
              </button>
              <button
                onClick={() => setSelectedTopicFilter('control')}
                className={`px-2 py-0.5 rounded ${
                  selectedTopicFilter === 'control'
                    ? 'bg-neutral-800 text-amber-400 font-medium'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Control
              </button>
              <button
                onClick={() => setSelectedTopicFilter('alerts')}
                className={`px-2 py-0.5 rounded ${
                  selectedTopicFilter === 'alerts'
                    ? 'bg-neutral-800 text-amber-400 font-medium'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Alerts
              </button>
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                isPaused
                  ? 'bg-amber-400 text-neutral-950 font-semibold'
                  : 'bg-neutral-800 text-neutral-300 hover:text-white'
              }`}
            >
              {isPaused ? 'Resume Stream' : 'Pause'}
            </button>
          </div>
        </div>

        {/* Terminal Window */}
        <div className="bg-neutral-950 rounded-xl p-4 font-mono text-xs border border-neutral-800 max-h-72 overflow-y-auto space-y-2">
          {mqttPackets.length === 0 ? (
            <div className="text-neutral-500 py-4 text-center">
              Listening for inbound MQTT packets on broker port 8883...
            </div>
          ) : (
            filteredPackets.map((pkt) => (
              <div
                key={pkt.id}
                className="py-1.5 border-b border-neutral-900/80 flex flex-col gap-1 hover:bg-neutral-900/40 px-2 rounded"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        pkt.direction === 'inbound'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-sky-950 text-sky-400 border border-sky-800'
                      }`}
                    >
                      {pkt.direction}
                    </span>
                    <span className="text-amber-300 font-semibold">{pkt.topic}</span>
                  </div>
                  <span className="text-neutral-500 tabular-nums">{pkt.timestamp}</span>
                </div>
                <div className="text-neutral-400 text-[11px] overflow-x-auto pl-6">
                  {JSON.stringify(pkt.payload)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
