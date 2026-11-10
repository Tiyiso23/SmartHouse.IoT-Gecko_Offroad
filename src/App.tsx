/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CaravanProvider, useCaravan } from './context/CaravanContext';
import { Navbar } from './components/Navbar';
import { CaravanHero } from './components/CaravanHero';
import { DashboardView } from './components/DashboardView';
import { GoogleMapsFleetView } from './components/GoogleMapsFleetView';
import { PowerEnergyView } from './components/PowerEnergyView';
import { SecurityAlertsView } from './components/SecurityAlertsView';
import { AutomationEngineView } from './components/AutomationEngineView';
import { RentalOperatorView } from './components/RentalOperatorView';
import { HardwareLabView } from './components/HardwareLabView';
import { BusinessCaseView } from './components/BusinessCaseView';
import { IoTEmulatorModal } from './components/IoTEmulatorModal';
import { FirestoreSchemaModal } from './components/FirestoreSchemaModal';

function MainAppContent() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const { quotaExceeded } = useCaravan();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400 selection:text-neutral-950">
      {/* Google Maps Demo Quota Banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Bar Contract Compliant Navigation */}
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Caravan Visual Hero & Quick Actions */}
        <CaravanHero />

        {/* Tab Viewport */}
        {currentTab === 'dashboard' && <DashboardView />}
        {currentTab === 'maps' && <GoogleMapsFleetView />}
        {currentTab === 'power' && <PowerEnergyView />}
        {currentTab === 'security' && <SecurityAlertsView />}
        {currentTab === 'automations' && <AutomationEngineView />}
        {currentTab === 'rental' && <RentalOperatorView />}
        {currentTab === 'hardware' && <HardwareLabView />}
        {currentTab === 'business' && <BusinessCaseView />}
      </main>

      {/* Global Modals */}
      <IoTEmulatorModal />
      <FirestoreSchemaModal />

      {/* Clean Unboxed Footer */}
      <footer className="mt-12 border-t border-neutral-900 bg-neutral-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span>© 2026 Gecko Offroad Caravans</span>
            <span aria-hidden="true">·</span>
            <span>Smart House IoT Solution</span>
            <span aria-hidden="true">·</span>
            <span>Version 1.0 (ESP32 / Firebase)</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <button
              onClick={() => setCurrentTab('maps')}
              className="hover:text-amber-400 transition-colors"
            >
              GPS Geofence Map
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentTab('business')}
              className="hover:text-amber-400 transition-colors"
            >
              Business Case Specification
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentTab('hardware')}
              className="hover:text-amber-400 transition-colors"
            >
              ESP32 Pinout Lab
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentTab('rental')}
              className="hover:text-amber-400 transition-colors"
            >
              Fleet Operator Depot
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CaravanProvider>
      <MainAppContent />
    </CaravanProvider>
  );
}
