import React, { useState } from 'react';
import { useCaravan } from '../context/CaravanContext';
import { AutomationRule } from '../types/iot';
import {
  Cpu,
  Plus,
  Play,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Flame,
  Fan,
  Battery,
  Shield,
  Sun,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AutomationEngineView: React.FC = () => {
  const {
    automationRules,
    toggleAutomationRule,
    addAutomationRule,
    triggerAutomationRuleTest,
  } = useCaravan();

  const [isCreatingRule, setIsCreatingRule] = useState<boolean>(false);
  const [newRuleName, setNewRuleName] = useState<string>('');
  const [newRuleDesc, setNewRuleDesc] = useState<string>('');
  const [newRuleTrigger, setNewRuleTrigger] = useState<AutomationRule['triggerType']>('temp_high');
  const [newRuleCondition, setNewRuleCondition] = useState<string>('Interior Cabin Temp > 29°C');
  const [newRuleAction, setNewRuleAction] = useState<string>('Set Roof Fan to High Exhaust');

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    addAutomationRule({
      name: newRuleName.trim(),
      description: newRuleDesc.trim() || 'Custom user automation routine.',
      enabled: true,
      triggerType: newRuleTrigger,
      conditionSummary: newRuleCondition,
      actionSummary: newRuleAction,
      lastTriggeredAt: 'Never',
    });

    setNewRuleName('');
    setNewRuleDesc('');
    setIsCreatingRule(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Automation Engine Hub */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <h2 className="text-xl font-bold text-white font-display">
              Autonomous Edge Rules Engine
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Event-driven automation triggered by onboard ESP32 microcontrollers without cloud latency
            </p>
          </div>

          <button
            onClick={() => setIsCreatingRule(!isCreatingRule)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-neutral-950 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isCreatingRule ? 'Cancel' : 'Create Automation Rule'}</span>
          </button>
        </div>

        {/* Create Rule Form */}
        {isCreatingRule && (
          <form
            onSubmit={handleCreateRule}
            className="pt-6 pb-2 space-y-4 border-b border-neutral-800"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Rule Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dawn Solar Pre-Cooling"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Trigger Sensor Event
                </label>
                <select
                  value={newRuleTrigger}
                  onChange={(e) => {
                    const trig = e.target.value as AutomationRule['triggerType'];
                    setNewRuleTrigger(trig);
                    if (trig === 'temp_high') {
                      setNewRuleCondition('Cabin Temp > 31°C');
                      setNewRuleAction('Engage Roof Fan to High');
                    } else if (trig === 'solar_high') {
                      setNewRuleCondition('Solar Intake > 350W & Battery > 80%');
                      setNewRuleAction('Engage Hot Water Geyser');
                    } else if (trig === 'battery_low') {
                      setNewRuleCondition('Battery SoC < 20%');
                      setNewRuleAction('Turn Off Inverter & Dim Lights');
                    } else if (trig === 'motion_armed') {
                      setNewRuleCondition('Motion or Door Breach in Armed Mode');
                      setNewRuleAction('Trigger Siren & Floodlights');
                    }
                  }}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="temp_high">Temperature Threshold (DHT22)</option>
                  <option value="solar_high">Solar MPPT Surplus (Victron)</option>
                  <option value="battery_low">Battery Low Voltage Guard (BMS)</option>
                  <option value="motion_armed">Intrusion / Motion (PIR & Reed)</option>
                  <option value="night_schedule">Sunset / Twilight Schedule</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Condition Summary
                </label>
                <input
                  type="text"
                  value={newRuleCondition}
                  onChange={(e) => setNewRuleCondition(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Action Executed
                </label>
                <input
                  type="text"
                  value={newRuleAction}
                  onChange={(e) => setNewRuleAction(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingRule(false)}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs rounded-lg"
              >
                Save Automation
              </button>
            </div>
          </form>
        )}

        {/* Quick Automation Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-xs">
          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
            <span className="text-neutral-400">Total Configured Rules</span>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {automationRules.length}
            </div>
          </div>
          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
            <span className="text-neutral-400">Active Enabled</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
              {automationRules.filter((r) => r.enabled).length}
            </div>
          </div>
          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
            <span className="text-neutral-400">Total Invocations</span>
            <div className="text-xl font-bold font-mono text-amber-400 mt-1">
              {automationRules.reduce((acc, r) => acc + r.executionCount, 0)}
            </div>
          </div>
          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
            <span className="text-neutral-400">Engine Response Time</span>
            <div className="text-xl font-bold font-mono text-sky-400 mt-1">
              &lt; 15ms (Edge)
            </div>
          </div>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {automationRules.map((rule) => (
          <div
            key={rule.id}
            className={`p-5 rounded-xl border transition-colors ${
              rule.enabled
                ? 'bg-neutral-900 border-neutral-800'
                : 'bg-neutral-900/40 border-neutral-850 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-white font-display">
                    {rule.name}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">
                    · {rule.executionCount} executions
                  </span>
                </div>
                <p className="text-xs text-neutral-400 max-w-2xl">
                  {rule.description}
                </p>

                {/* Condition & Action Logic Box */}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                  <div className="px-2.5 py-1 bg-neutral-950 rounded border border-neutral-800 text-neutral-300">
                    <span className="text-neutral-400 font-mono text-[10px] mr-1">IF:</span>
                    <span>{rule.conditionSummary}</span>
                  </div>
                  <span className="text-neutral-600 font-mono">→</span>
                  <div className="px-2.5 py-1 bg-neutral-950 rounded border border-neutral-800 text-amber-300">
                    <span className="text-neutral-400 font-mono text-[10px] mr-1">THEN:</span>
                    <span>{rule.actionSummary}</span>
                  </div>
                </div>
              </div>

              {/* Actions: Enable Toggle & Test Button */}
              <div className="flex items-center gap-3 shrink-0 pt-1">
                <button
                  onClick={() => triggerAutomationRuleTest(rule.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
                  title="Simulate conditions and execute actions immediately"
                >
                  <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>Test Trigger</span>
                </button>

                <button
                  onClick={() => toggleAutomationRule(rule.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    rule.enabled
                      ? 'text-emerald-400 hover:text-emerald-300'
                      : 'text-neutral-500 hover:text-neutral-400'
                  }`}
                  title={rule.enabled ? 'Disable rule' : 'Enable rule'}
                >
                  {rule.enabled ? (
                    <ToggleRight className="w-6 h-6" />
                  ) : (
                    <ToggleLeft className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
