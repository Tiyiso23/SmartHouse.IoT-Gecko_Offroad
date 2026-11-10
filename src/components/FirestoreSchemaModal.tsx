import React, { useState } from 'react';
import { useCaravan } from '../context/CaravanContext';
import {
  X,
  Database,
  ShieldCheck,
  Code,
  CheckCircle,
  Wifi,
  WifiOff,
  Copy,
} from 'lucide-react';

export const FirestoreSchemaModal: React.FC = () => {
  const {
    isCloudModalOpen,
    setIsCloudModalOpen,
    deviceState,
    cloudSyncMode,
    setCloudSyncMode,
    automationRules,
    alerts,
  } = useCaravan();

  const [activeTab, setActiveTab] = useState<'documents' | 'rules' | 'architecture'>('documents');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isCloudModalOpen) return null;

  const currentDocument = {
    _id: deviceState.id,
    schemaVersion: '1.0.0-gecko-iot',
    metadata: {
      chassisNumber: deviceState.chassisNumber,
      firmware: deviceState.firmwareVersion,
      hardware: deviceState.hardwareChip,
      updatedAt: new Date().toISOString(),
    },
    telemetry: {
      power: deviceState.power,
      environment: deviceState.environment,
      tanks: deviceState.tanks,
      security: deviceState.security,
    },
    actuators: deviceState.actuators,
  };

  const firestoreRulesCode = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function for user role validation
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isCaravanOwner(caravanId) {
      return isAuthenticated() && request.auth.uid == resource.data.ownerUid;
    }
    
    function isRentalOperator() {
      return isAuthenticated() && request.auth.token.role == 'rental_operator';
    }
    
    function isIoTDeviceDaemon() {
      return isAuthenticated() && request.auth.token.role == 'iot_hardware_daemon';
    }

    // Caravans Root Collection
    match /caravans/{caravanId} {
      // Owners and Rental Operators can read telemetry
      allow read: if isCaravanOwner(caravanId) || isRentalOperator();
      
      // Actuators can be updated by owners or operators
      allow update: if (isCaravanOwner(caravanId) || isRentalOperator()) 
                    && request.resource.data.diff(resource.data).affectedKeys()
                        .hasOnly(['actuators', 'security.systemMode']);
                        
      // IoT hardware daemon updates real-time sensor telemetry
      allow write: if isIoTDeviceDaemon();

      // Historical snapshots subcollection (written every 5 minutes)
      match /telemetry_snapshots/{snapshotId} {
        allow read: if isCaravanOwner(caravanId) || isRentalOperator();
        allow create: if isIoTDeviceDaemon();
      }

      // Edge automations subcollection
      match /automations/{ruleId} {
        allow read, write: if isCaravanOwner(caravanId) || isRentalOperator();
      }
    }

    // System and Security Alerts
    match /alerts/{alertId} {
      allow read: if isAuthenticated();
      allow create: if isIoTDeviceDaemon();
      allow update: if isAuthenticated() && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['acknowledged']);
    }
  }
}`;

  const handleCopyRules = () => {
    navigator.clipboard.writeText(firestoreRulesCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Firebase Firestore Cloud Database Architecture
              </h3>
              <p className="text-xs text-neutral-400">
                Document schema, synchronization engine &amp; role security rules
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCloudModalOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Mode Switch & Tabs */}
        <div className="px-5 py-3 border-b border-neutral-800 bg-neutral-950/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'documents'
                  ? 'bg-neutral-800 text-amber-400 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Document Model (JSON)
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'rules'
                  ? 'bg-neutral-800 text-amber-400 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Firestore Security Rules
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'architecture'
                  ? 'bg-neutral-800 text-amber-400 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Sync &amp; Offline Topology
            </button>
          </div>

          {/* Sync Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Connection Mode:</span>
            <button
              onClick={() =>
                setCloudSyncMode(
                  cloudSyncMode === 'firebase_cloud' ? 'local_fallback' : 'firebase_cloud'
                )
              }
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-colors ${
                cloudSyncMode === 'firebase_cloud'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}
            >
              {cloudSyncMode === 'firebase_cloud' ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  <span>Cloud Active</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-400" />
                  <span>Local Mesh Fallback</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'documents' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-neutral-300">
                <span className="font-mono text-amber-400">
                  Collection: /caravans/{deviceState.id}
                </span>
                <span className="text-neutral-500 font-mono text-[11px]">
                  Real-time snapshot
                </span>
              </div>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-300 max-h-96 overflow-y-auto">
                <pre>{JSON.stringify(currentDocument, null, 2)}</pre>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-neutral-300">
                <span className="font-semibold text-white">firestore.rules (RBAC Security)</span>
                <button
                  onClick={handleCopyRules}
                  className="flex items-center gap-1 text-neutral-400 hover:text-white text-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy Rules'}</span>
                </button>
              </div>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-300 max-h-96 overflow-y-auto">
                <pre>{firestoreRulesCode}</pre>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4 text-neutral-300">
              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                <div className="font-semibold text-white text-sm">
                  User → Smart Caravan App → Firebase Firestore → IoT Devices
                </div>
                <p className="text-xs text-neutral-400">
                  Following Section 7 of the Business Case, device emulators and physical ESP32 controllers maintain bidirectional synchronization with Cloud Firestore.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                  <div className="font-semibold text-amber-300">
                    Online Cloud Mode (Firebase Firestore)
                  </div>
                  <p className="text-neutral-400 text-[11px]">
                    Provides caravan owners and rental operators instant global access to telemetry, GPS geofence tracks, and remote locks via Starlink or LTE-M.
                  </p>
                </div>

                <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                  <div className="font-semibold text-amber-300">
                    Local Resilient Mesh (Offline Risk Mitigation)
                  </div>
                  <p className="text-neutral-400 text-[11px]">
                    Mitigates Section 10 Risk 1 &amp; 4: In case of outback signal loss, ESP32 creates local Wi-Fi SoftAP and caches telemetry locally so physical living functions remain 100% operational.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex justify-end">
          <button
            onClick={() => setIsCloudModalOpen(false)}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg text-xs transition-colors"
          >
            Close Schema Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
