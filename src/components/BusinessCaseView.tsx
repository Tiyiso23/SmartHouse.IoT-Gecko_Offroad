import React, { useState } from 'react';
import {
  FileText,
  CheckCircle,
  TrendingUp,
  Shield,
  Zap,
  DollarSign,
  Compass,
  ArrowRight,
  Layers,
  Award,
} from 'lucide-react';

export const BusinessCaseView: React.FC = () => {
  const [fleetSize, setFleetSize] = useState<number>(12);
  const [rentalDaysPerYear, setRentalDaysPerYear] = useState<number>(180);
  const [smartRentalPremiumPerDay, setSmartRentalPremiumPerDay] = useState<number>(35); // AUD/USD

  // ROI calculations based on Business Case benefits
  const annualPremiumRevenue = fleetSize * rentalDaysPerYear * smartRentalPremiumPerDay;
  const batteryReplacementsAvoidedPerYear = Math.round(fleetSize * 0.25);
  const batterySavings = batteryReplacementsAvoidedPerYear * 1800; // $1,800 per 200Ah LiFePO4 battery replacement saved
  const inspectionHoursSavedPerYear = fleetSize * (rentalDaysPerYear / 7) * 2; // 2 hours saved per weekly turnover
  const laborSavings = Math.round(inspectionHoursSavedPerYear * 45); // $45/hour technician rate
  const totalAnnualBenefit = annualPremiumRevenue + batterySavings + laborSavings;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <div className="text-xs font-mono text-amber-400 mb-1">
              DOCUMENT TYPE: BUSINESS CASE · VERSION 1.0 (NOV 2026)
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              Gecko Offroad Smart House – IoT Smart Caravan Solution
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Business Analysis Project Team · Prepared for Gecko Offroad Caravans
            </p>
          </div>

          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1.5 self-start md:self-auto">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>FINAL RECOMMENDATION: PROCEED</span>
          </span>
        </div>

        {/* 4 Pillars Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 text-xs">
          <div className="p-4 bg-neutral-950/60 rounded-xl border border-neutral-800 space-y-1">
            <div className="font-semibold text-white">01. Smart Integration</div>
            <p className="text-neutral-400 text-[11px]">
              ESP32 microcontrollers connecting environmental, power, security, and tank sensors.
            </p>
          </div>
          <div className="p-4 bg-neutral-950/60 rounded-xl border border-neutral-800 space-y-1">
            <div className="font-semibold text-white">02. Cloud Architecture</div>
            <p className="text-neutral-400 text-[11px]">
              Firebase Firestore real-time database with local offline mesh fallback.
            </p>
          </div>
          <div className="p-4 bg-neutral-950/60 rounded-xl border border-neutral-800 space-y-1">
            <div className="font-semibold text-white">03. Device Emulation</div>
            <p className="text-neutral-400 text-[11px]">
              Full prototype emulation suite reducing initial hardware CAPEX by 85%.
            </p>
          </div>
          <div className="p-4 bg-neutral-950/60 rounded-xl border border-neutral-800 space-y-1">
            <div className="font-semibold text-white">04. Automation Engine</div>
            <p className="text-neutral-400 text-[11px]">
              Autonomous event-driven actions for cooling, battery shedding, and intruder alarms.
            </p>
          </div>
        </div>
      </div>

      {/* Business Problem vs Solution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-white font-display text-base border-b border-neutral-800 pb-3">
            Business Problem Statement
          </h3>
          <p className="text-xs text-neutral-300">
            Traditional caravans generally rely on manual controls for lighting, monitoring environmental conditions, managing energy consumption and maintaining security:
          </p>
          <ul className="space-y-2 text-xs text-neutral-400">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Limited power visibility:</strong> Caravan owners lack real-time insight into battery state-of-charge, causing unexpected power collapse in remote off-grid locations.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Manual environmental controls:</strong> Lack of automated ventilation results in cabin overheating, food spoilage in 12V fridges, and condensation.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Vulnerable perimeter security:</strong> No remote alerts when windows, roof hatches, or entry doors are breached while away on hikes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>High rental depot turnover costs:</strong> Rental operators spend hours manually testing batteries, plumbing, and locks between customer dispatches.</span>
            </li>
          </ul>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-white font-display text-base border-b border-neutral-800 pb-3">
            Proposed Business Benefits
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800 space-y-1">
              <div className="font-semibold text-amber-300">Operational Benefits</div>
              <p className="text-neutral-400 text-[11px]">
                Centralised fleet telemetry, instant remote diagnostic reports, automated rental return inspections, and reduced manual check times.
              </p>
            </div>
            <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800 space-y-1">
              <div className="font-semibold text-amber-300">Financial Benefits</div>
              <p className="text-neutral-400 text-[11px]">
                Extends LiFePO4 battery lifespan by 3+ years via automated low-voltage shedding. Premium rental pricing tiers ($35/day connected fee).
              </p>
            </div>
            <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800 space-y-1">
              <div className="font-semibold text-amber-300">Customer &amp; Strategic Benefits</div>
              <p className="text-neutral-400 text-[11px]">
                Unrivalled peace of mind with 110dB perimeter siren, automated thermal climate, 590nm bug-shield lights, and competitive brand differentiation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Business Case ROI & Financial Model */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              <span>Interactive Financial Feasibility &amp; ROI Model</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Simulate operational savings and incremental rental revenues for Gecko Offroad Caravans
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-neutral-400">Total Projected Annual Benefit:</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              ${totalAnnualBenefit.toLocaleString()} / yr
            </div>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div>
            <div className="flex justify-between text-neutral-300 mb-1">
              <span>Fleet Size (Smart Caravans):</span>
              <span className="font-mono text-white font-semibold">{fleetSize} units</span>
            </div>
            <input
              type="range"
              min="2"
              max="50"
              value={fleetSize}
              onChange={(e) => setFleetSize(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-neutral-300 mb-1">
              <span>Rental Utilization (Days/Year):</span>
              <span className="font-mono text-white font-semibold">{rentalDaysPerYear} days</span>
            </div>
            <input
              type="range"
              min="60"
              max="300"
              step="10"
              value={rentalDaysPerYear}
              onChange={(e) => setRentalDaysPerYear(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-neutral-300 mb-1">
              <span>Smart IoT Package Premium:</span>
              <span className="font-mono text-white font-semibold">${smartRentalPremiumPerDay}/day</span>
            </div>
            <input
              type="range"
              min="15"
              max="75"
              step="5"
              value={smartRentalPremiumPerDay}
              onChange={(e) => setSmartRentalPremiumPerDay(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
            <span className="text-neutral-400">Premium Rental Revenue</span>
            <div className="text-xl font-bold font-mono text-white">
              +${annualPremiumRevenue.toLocaleString()}
            </div>
            <span className="text-[11px] text-neutral-400">
              Customers paying for connected off-grid smart features
            </span>
          </div>

          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
            <span className="text-neutral-400">Battery Preservation Savings</span>
            <div className="text-xl font-bold font-mono text-emerald-400">
              +${batterySavings.toLocaleString()}
            </div>
            <span className="text-[11px] text-neutral-400">
              BMS protection against deep discharge damage
            </span>
          </div>

          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
            <span className="text-neutral-400">Depot Labor Hours Saved</span>
            <div className="text-xl font-bold font-mono text-sky-400">
              +${laborSavings.toLocaleString()}
            </div>
            <span className="text-[11px] text-neutral-400">
              {inspectionHoursSavedPerYear.toFixed(0)} technician inspection hours automated
            </span>
          </div>
        </div>
      </div>

      {/* Stakeholders & Phased Plan */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-white font-display text-base border-b border-neutral-800 pb-3">
          Stakeholder Analysis &amp; Phased Execution Path
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
            <div className="font-medium text-white">Business Owner</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Project approval &amp; strategic growth</div>
          </div>
          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
            <div className="font-medium text-white">IoT / Systems Engineer</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">ESP32 firmware &amp; sensor calibration</div>
          </div>
          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
            <div className="font-medium text-white">Rental Fleet Operators</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Depot turnover &amp; maintenance audits</div>
          </div>
          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
            <div className="font-medium text-white">Expedition Guests</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Frictionless smart living &amp; security</div>
          </div>
        </div>
      </div>
    </div>
  );
};
