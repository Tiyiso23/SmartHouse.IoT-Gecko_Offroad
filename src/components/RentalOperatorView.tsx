import React, { useState } from 'react';
import { useCaravan } from '../context/CaravanContext';
import { FleetCaravan } from '../types/iot';
import {
  Compass,
  Battery,
  MapPin,
  ClipboardCheck,
  CheckCircle,
  AlertTriangle,
  FileText,
  Truck,
  ShieldCheck,
  Download,
  Search,
} from 'lucide-react';

export const RentalOperatorView: React.FC = () => {
  const { fleet, generateRentalInspectionReport, applyScenario } = useCaravan();
  const [selectedCaravanId, setSelectedCaravanId] = useState<string>(fleet[0].id);
  const [inspectionResult, setInspectionResult] = useState<{
    reportId: string;
    passed: boolean;
    issues: string[];
    timestamp: string;
    batteryCheck: string;
    tankCheck: string;
    locksCheck: string;
  } | null>(null);

  const selectedCaravan = fleet.find((c) => c.id === selectedCaravanId) || fleet[0];

  const handleRunInspection = () => {
    const report = generateRentalInspectionReport(selectedCaravanId);
    setInspectionResult(report);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Rental Fleet Console */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <h2 className="text-xl font-bold text-white font-display">
              Rental Fleet Operations & Depot Inspection
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Gecko Offroad Caravans commercial rental fleet management, GPS tracking & return audits
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                applyScenario('rental_return_checkin');
                handleRunInspection();
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-neutral-950 transition-colors"
            >
              Simulate Rental Return Check-in
            </button>
          </div>
        </div>

        {/* Fleet KPI Summary Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-xs">
          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
            <span className="text-neutral-400">Total Fleet Size</span>
            <div className="text-xl font-bold font-mono text-white mt-1">4 Units</div>
            <span className="text-[11px] text-neutral-400">2 on expedition · 1 ready · 1 service</span>
          </div>

          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
            <span className="text-neutral-400">Fleet Utilization</span>
            <div className="text-xl font-bold font-mono text-amber-400 mt-1">75.0%</div>
            <span className="text-[11px] text-neutral-400">Target benchmark: &gt; 70%</span>
          </div>

          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
            <span className="text-neutral-400">Average Battery Health</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">96.3%</div>
            <span className="text-[11px] text-neutral-400">Zero cell replacements needed</span>
          </div>

          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
            <span className="text-neutral-400">Inspection Time Saved</span>
            <div className="text-xl font-bold font-mono text-sky-400 mt-1">82%</div>
            <span className="text-[11px] text-neutral-400">Automated IoT sensor diagnostics</span>
          </div>
        </div>
      </div>

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fleet.map((caravan) => (
          <div
            key={caravan.id}
            onClick={() => setSelectedCaravanId(caravan.id)}
            className={`p-5 rounded-xl border cursor-pointer transition-all ${
              selectedCaravanId === caravan.id
                ? 'bg-neutral-900 border-amber-400 shadow-sm shadow-amber-400/10'
                : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white font-display text-base">
                  {caravan.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {caravan.model} · <span className="font-mono">{caravan.chassisNumber}</span>
                </p>
              </div>

              <span
                className={`text-xs px-2.5 py-0.5 rounded font-medium capitalize ${
                  caravan.currentStatus === 'rented'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : caravan.currentStatus === 'available'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {caravan.currentStatus}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-neutral-300">
                <span className="flex items-center gap-1.5 text-neutral-400">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Location:</span>
                </span>
                <span className="truncate max-w-[200px]">{caravan.locationName}</span>
              </div>

              {caravan.renterName && (
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="text-neutral-400">Current Renter:</span>
                  <span className="font-medium text-white">{caravan.renterName}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-neutral-400">Battery State:</span>
                <span className="font-mono text-neutral-200">
                  {caravan.batterySoc}% SoC · {caravan.batteryHealth}% SOH
                </span>
              </div>

              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-neutral-400">Total Expeditions:</span>
                <span className="font-mono text-neutral-200">
                  {caravan.totalTripsKm.toLocaleString()} km logged
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Automated Inspection & Check-in Diagnostic Tool */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              Automated Check-in / Check-out Audit
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Target unit: <span className="font-medium text-white">{selectedCaravan.name}</span> ({selectedCaravan.chassisNumber})
            </p>
          </div>

          <button
            onClick={handleRunInspection}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-colors shrink-0"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Run IoT Diagnostic Audit</span>
          </button>
        </div>

        {inspectionResult ? (
          <div className="p-5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded text-xs font-bold uppercase font-mono ${
                    inspectionResult.passed
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {inspectionResult.passed ? 'PASSED DEPOT AUDIT' : 'ATTENTION REQUIRED'}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  Report #{inspectionResult.reportId}
                </span>
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                {inspectionResult.timestamp}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                <div className="text-neutral-400 font-medium mb-1">Battery Storage Subsystem</div>
                <div className="text-neutral-200 font-mono text-[11px]">
                  {inspectionResult.batteryCheck}
                </div>
              </div>

              <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                <div className="text-neutral-400 font-medium mb-1">Fluids & Tanks Telemetry</div>
                <div className="text-neutral-200 font-mono text-[11px]">
                  {inspectionResult.tankCheck}
                </div>
              </div>

              <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                <div className="text-neutral-400 font-medium mb-1">Security & Portal Latches</div>
                <div className="text-neutral-200 font-mono text-[11px]">
                  {inspectionResult.locksCheck}
                </div>
              </div>
            </div>

            {inspectionResult.issues.length > 0 ? (
              <div className="p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-lg text-xs space-y-1">
                <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Depot Action Items Before Next Rental Dispatch:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-neutral-300 pt-1 text-[11px]">
                  {inspectionResult.issues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  All electronics, batteries, fluids, and safety latches verified nominal. Approved for immediate customer re-dispatch.
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-neutral-400 bg-neutral-950/50 rounded-xl border border-neutral-800/60">
            Click &quot;Run IoT Diagnostic Audit&quot; to fetch real-time telemetry from the ESP32 node and generate an instant equipment turnover certification.
          </div>
        )}
      </div>
    </div>
  );
};
