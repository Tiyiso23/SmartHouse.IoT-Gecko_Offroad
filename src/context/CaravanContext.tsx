import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  CaravanDeviceState,
  AutomationRule,
  AlertNotification,
  MqttPacket,
  FleetCaravan,
  SecurityState,
} from '../types/iot';
import {
  initialCaravanState,
  initialAutomationRules,
  initialAlerts,
  initialFleet,
} from '../data/initialData';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
  testFirestoreConnection,
} from '../lib/firebase';
import {
  User,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';

interface CaravanContextType {
  deviceState: CaravanDeviceState;
  automationRules: AutomationRule[];
  alerts: AlertNotification[];
  mqttPackets: MqttPacket[];
  fleet: FleetCaravan[];
  cloudSyncMode: 'firebase_cloud' | 'local_fallback';
  isEmulatorOpen: boolean;
  isCloudModalOpen: boolean;
  activeScenarioName: string | null;
  currentUser: User | null;
  isAuthLoading: boolean;
  quotaExceeded: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  toggleActuator: (actuatorKey: keyof CaravanDeviceState['actuators'], value?: unknown) => void;
  setSecurityMode: (mode: SecurityState) => void;
  setDeviceTelemetry: <K extends keyof CaravanDeviceState>(
    category: K,
    updates: Partial<CaravanDeviceState[K]>
  ) => void;
  toggleAutomationRule: (ruleId: string) => void;
  addAutomationRule: (rule: Omit<AutomationRule, 'id' | 'executionCount'>) => void;
  triggerAutomationRuleTest: (ruleId: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;
  clearAllAlerts: () => void;
  applyScenario: (scenarioKey: string) => void;
  setCloudSyncMode: (mode: 'firebase_cloud' | 'local_fallback') => void;
  setIsEmulatorOpen: (open: boolean) => void;
  setIsCloudModalOpen: (open: boolean) => void;
  simulateIntruderBreach: () => void;
  resetAllToDefault: () => void;
  generateRentalInspectionReport: (caravanId: string) => {
    reportId: string;
    passed: boolean;
    issues: string[];
    timestamp: string;
    batteryCheck: string;
    tankCheck: string;
    locksCheck: string;
  };
}

const CaravanContext = createContext<CaravanContextType | undefined>(undefined);

export const CaravanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [deviceState, setDeviceState] = useState<CaravanDeviceState>(initialCaravanState);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(initialAutomationRules);
  const [alerts, setAlerts] = useState<AlertNotification[]>(initialAlerts);
  const [fleet] = useState<FleetCaravan[]>(initialFleet);
  const [mqttPackets, setMqttPackets] = useState<MqttPacket[]>([]);
  const [cloudSyncMode, setCloudSyncMode] = useState<'firebase_cloud' | 'local_fallback'>('firebase_cloud');
  const [isEmulatorOpen, setIsEmulatorOpen] = useState<boolean>(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState<boolean>(false);
  const [activeScenarioName, setActiveScenarioName] = useState<string | null>(null);

  // Firebase Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Google Maps Quota state
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);

  // Helper to publish simulated MQTT packet
  const emitMqttPacket = useCallback(
    (topic: string, payload: Record<string, unknown>, direction: 'inbound' | 'outbound' = 'outbound') => {
      const newPacket: MqttPacket = {
        id: 'pkt-' + Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        topic,
        direction,
        payload,
        sizeBytes: JSON.stringify(payload).length + 32,
      };

      setMqttPackets((prev) => [newPacket, ...prev.slice(0, 24)]);
    },
    []
  );

  // Send an alert
  const addAlert = useCallback(
    (severity: 'critical' | 'warning' | 'info', category: 'security' | 'power' | 'environment' | 'system', title: string, message: string) => {
      const newAlert: AlertNotification = {
        id: 'alt-' + Date.now().toString(36),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        severity,
        category,
        title,
        message,
        acknowledged: false,
      };
      setAlerts((prev) => [newAlert, ...prev]);

      emitMqttPacket('gecko/caravan/gk01/alerts', {
        type: 'SYSTEM_ALERT',
        severity,
        title,
        timestamp: new Date().toISOString(),
      });
    },
    [emitMqttPacket]
  );

  // Persist state to Firestore when online and authenticated
  const syncToFirestore = useCallback(
    async (newState: CaravanDeviceState) => {
      if (cloudSyncMode !== 'firebase_cloud' || !auth.currentUser) return;
      const caravanPath = `caravans/${newState.id}`;
      try {
        await setDoc(doc(db, 'caravans', newState.id), {
          ...newState,
          ownerUid: auth.currentUser.uid,
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, caravanPath);
      }
    },
    [cloudSyncMode]
  );

  // Update specific telemetry categories
  const setDeviceTelemetry = useCallback(
    <K extends keyof CaravanDeviceState>(category: K, updates: Partial<CaravanDeviceState[K]>) => {
      setDeviceState((prev) => {
        const updated = {
          ...prev,
          lastSeen: new Date().toLocaleTimeString(),
          [category]: {
            ...(prev[category] as object),
            ...(updates as object),
          },
        };
        syncToFirestore(updated).catch(() => {});
        return updated;
      });

      emitMqttPacket(`gecko/caravan/gk01/${String(category)}`, updates as Record<string, unknown>, 'inbound');
    },
    [emitMqttPacket, syncToFirestore]
  );

  // Toggle actuators
  const toggleActuator = useCallback(
    (actuatorKey: keyof CaravanDeviceState['actuators'], value?: unknown) => {
      setDeviceState((prev) => {
        const currentVal = prev.actuators[actuatorKey];
        let nextVal: unknown;

        if (value !== undefined) {
          nextVal = value;
        } else if (typeof currentVal === 'boolean') {
          nextVal = !currentVal;
        } else if (actuatorKey === 'roofVentFanSpeed') {
          const speeds: ('off' | 'low' | 'med' | 'high')[] = ['off', 'low', 'med', 'high'];
          const nextIdx = (speeds.indexOf(currentVal as 'off' | 'low' | 'med' | 'high') + 1) % speeds.length;
          nextVal = speeds[nextIdx];
        } else {
          nextVal = currentVal;
        }

        const newActuators = {
          ...prev.actuators,
          [actuatorKey]: nextVal,
        };

        // Also sync related subsystems
        let updatedPower = { ...prev.power };
        if (actuatorKey === 'inverterSwitchOn') {
          updatedPower.inverterOn = Boolean(nextVal);
          updatedPower.acSocketsActive = Boolean(nextVal);
          updatedPower.inverterLoadWatts = nextVal ? 180 : 0;
        }

        const updatedState = {
          ...prev,
          lastSeen: new Date().toLocaleTimeString(),
          actuators: newActuators,
          power: updatedPower,
        };

        syncToFirestore(updatedState).catch(() => {});
        return updatedState;
      });

      emitMqttPacket('gecko/caravan/gk01/control', {
        actuator: actuatorKey,
        value: value,
        source: 'user_application',
      });
    },
    [emitMqttPacket, syncToFirestore]
  );

  // Set security mode
  const setSecurityMode = useCallback(
    (mode: SecurityState) => {
      setDeviceState((prev) => {
        const updated = {
          ...prev,
          lastSeen: new Date().toLocaleTimeString(),
          security: {
            ...prev.security,
            systemMode: mode,
            mainDoorLocked: mode === 'armed_away' || mode === 'camp_mode',
            sirenActive: mode === 'disarmed' ? false : prev.security.sirenActive,
          },
        };
        syncToFirestore(updated).catch(() => {});
        return updated;
      });

      addAlert(
        'info',
        'security',
        `Security Mode Set: ${mode === 'armed_away' ? 'Armed Away' : mode === 'camp_mode' ? 'Camp Night Mode' : 'Disarmed'}`,
        `Caravan smart perimeter updated. Door locks ${mode === 'disarmed' ? 'unlocked' : 'locked'}.`
      );

      emitMqttPacket('gecko/caravan/gk01/security/mode', { mode });
    },
    [addAlert, emitMqttPacket, syncToFirestore]
  );

  // Auth methods
  const signInWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setCurrentUser(result.user);
      addAlert('info', 'system', 'Signed In with Google', `Welcome back, ${result.user.displayName || result.user.email}`);

      // Save user profile to Firestore
      const userDocPath = `users/${result.user.uid}`;
      try {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || '',
          role: 'owner',
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, userDocPath);
      }
    } catch (error) {
      console.error('Google Sign In Error:', error);
      addAlert('warning', 'system', 'Sign In Cancelled', 'Authentication window was closed or interrupted.');
    }
  }, [addAlert]);

  const signOutUser = useCallback(async () => {
    try {
      await fbSignOut(auth);
      setCurrentUser(null);
      addAlert('info', 'system', 'Signed Out', 'Local offline profile active.');
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  }, [addAlert]);

  // Toggle automation rules
  const toggleAutomationRule = useCallback((ruleId: string) => {
    setAutomationRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  }, []);

  // Add automation rule
  const addAutomationRule = useCallback((rule: Omit<AutomationRule, 'id' | 'executionCount'>) => {
    const newRule: AutomationRule = {
      ...rule,
      id: 'rule-' + Date.now().toString(36),
      executionCount: 0,
    };
    setAutomationRules((prev) => [newRule, ...prev]);
  }, []);

  // Test trigger automation rule
  const triggerAutomationRuleTest = useCallback(
    (ruleId: string) => {
      const rule = automationRules.find((r) => r.id === ruleId);
      if (!rule) return;

      setAutomationRules((prev) =>
        prev.map((r) =>
          r.id === ruleId
            ? { ...r, executionCount: r.executionCount + 1, lastTriggeredAt: 'Just now (manual test)' }
            : r
        )
      );

      // Execute rule effects
      if (rule.triggerType === 'temp_high') {
        toggleActuator('roofVentFanSpeed', 'high');
        addAlert('info', 'environment', 'Automation Triggered: Cabin Thermal Exhaust', 'Roof vent set to HIGH.');
      } else if (rule.triggerType === 'solar_high') {
        toggleActuator('hotWaterBoostOn', true);
        addAlert('info', 'power', 'Automation Triggered: Solar Surplus Diverter', 'Water heater engaged to store surplus thermal energy.');
      } else if (rule.triggerType === 'battery_low') {
        toggleActuator('inverterSwitchOn', false);
        toggleActuator('livingLightsPct', 15);
        addAlert('warning', 'power', 'Automation Triggered: Battery Shedding', '2000W AC Inverter isolated. Lighting dimmed to 15%.');
      } else if (rule.triggerType === 'motion_armed') {
        setDeviceTelemetry('security', { sirenActive: true });
        toggleActuator('perimeterFloodlightsOn', true);
        addAlert('critical', 'security', 'INTRUDER DETECTED // SIREN ACTIVE', 'PIR motion detected while in Armed Away state. 110dB siren active.');
      } else if (rule.triggerType === 'night_schedule') {
        toggleActuator('awningStripBugMode', true);
        toggleActuator('livingLightsPct', 25);
        setSecurityMode('camp_mode');
        addAlert('info', 'system', 'Automation Triggered: Camp Sunset Routine', 'Amber bug lights enabled and perimeter secured.');
      }
    },
    [automationRules, toggleActuator, addAlert, setDeviceTelemetry, setSecurityMode]
  );

  // Alert actions
  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Simulate an Intruder breach
  const simulateIntruderBreach = useCallback(() => {
    setDeviceState((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        systemMode: 'armed_away',
        mainDoorOpen: true,
        mainDoorLocked: false,
        pirMotionDetected: true,
        sirenActive: true,
      },
      actuators: {
        ...prev.actuators,
        perimeterFloodlightsOn: true,
      },
    }));

    addAlert(
      'critical',
      'security',
      'CRITICAL: UNLAWFUL PERIMETER BREACH',
      'Main entry door opened & interior motion sensor triggered while in Armed Away mode! 110dB siren and 360° floodlights engaged.'
    );

    emitMqttPacket('gecko/caravan/gk01/security/alarm', {
      event: 'INTRUSION_DETECTED',
      zone: 'main_entry_reed_pir',
      siren: true,
      timestamp: new Date().toISOString(),
    });
  }, [addAlert, emitMqttPacket]);

  // Apply predefined off-road scenarios
  const applyScenario = useCallback(
    (scenarioKey: string) => {
      setActiveScenarioName(scenarioKey);
      if (scenarioKey === 'kalahari_noon') {
        setDeviceState((prev) => ({
          ...prev,
          power: {
            ...prev.power,
            batterySoc: 94,
            batteryVoltage: 13.62,
            batteryCurrent: 18.4,
            solarWatts: 428,
            solarDailyKwh: 3.84,
            inverterOn: true,
            inverterLoadWatts: 240,
            shorePowerConnected: false,
          },
          environment: {
            ...prev.environment,
            cabinTempC: 28.5,
            cabinHumidityPct: 22,
            exteriorTempC: 41.2,
            exteriorHumidityPct: 14,
            fridgeTempC: 3.6,
          },
          actuators: {
            ...prev.actuators,
            roofVentFanSpeed: 'high',
            roofVentDirection: 'exhaust',
            fridgePowerOn: true,
            hotWaterBoostOn: true,
          },
        }));
        addAlert('info', 'power', 'Scenario Applied: Kalahari Desert High Noon', 'High solar yield (428W), extreme ambient heat (41.2°C). Cooling fan auto-engaged.');
      } else if (scenarioKey === 'highveld_storm') {
        setDeviceState((prev) => ({
          ...prev,
          power: {
            ...prev.power,
            solarWatts: 32,
            batteryCurrent: -6.2,
          },
          environment: {
            ...prev.environment,
            cabinTempC: 19.8,
            cabinHumidityPct: 76,
            exteriorTempC: 18.2,
            exteriorHumidityPct: 89,
          },
          security: {
            ...prev.security,
            roofHatchOpen: true,
          },
        }));
        addAlert('warning', 'environment', 'Storm Scenario: Highveld Severe Thunderstorm', 'Ambient light collapsed. WARNING: Roof Hatch is detected AJAR during precipitation!');
      } else if (scenarioKey === 'night_stealth') {
        setDeviceState((prev) => ({
          ...prev,
          power: {
            ...prev.power,
            solarWatts: 0,
            batteryCurrent: -3.8,
          },
          environment: {
            ...prev.environment,
            cabinTempC: 22.1,
            exteriorTempC: 14.5,
          },
          security: {
            ...prev.security,
            systemMode: 'camp_mode',
            mainDoorLocked: true,
            mainDoorOpen: false,
            roofHatchOpen: false,
            sirenActive: false,
            pirMotionDetected: false,
          },
          actuators: {
            ...prev.actuators,
            livingLightsPct: 20,
            bedroomLightsOn: false,
            awningStripPct: 70,
            awningStripBugMode: true,
            perimeterFloodlightsOn: false,
            roofVentFanSpeed: 'low',
          },
        }));
        addAlert('info', 'system', 'Scenario Applied: Camp Night Stealth', 'Zero solar intake. Insect bug shield amber active. Perimeter armed.');
      } else if (scenarioKey === 'intruder_breach') {
        simulateIntruderBreach();
      } else if (scenarioKey === 'rental_return_checkin') {
        setDeviceState((prev) => ({
          ...prev,
          tanks: {
            ...prev.tanks,
            freshWaterLiters: 32,
            greyWaterLiters: 68,
          },
          power: {
            ...prev.power,
            batteryCycles: 48,
            batteryHealthPct: 97,
            batterySoc: 64,
          },
          security: {
            ...prev.security,
            mainDoorLocked: true,
            mainDoorOpen: false,
            sirenActive: false,
          },
        }));
        addAlert('info', 'system', 'Rental Return Depot Mode Active', 'Automated equipment diagnostics ready for rental check-in inspection.');
      }
    },
    [addAlert, simulateIntruderBreach]
  );

  // Generate automated rental return inspection report
  const generateRentalInspectionReport = useCallback(
    (caravanId: string) => {
      const caravan = fleet.find((c) => c.id === caravanId) || fleet[0];
      const issues: string[] = [];

      if (deviceState.tanks.greyWaterLiters > 50) {
        issues.push(`Grey water tank at ${Math.round((deviceState.tanks.greyWaterLiters / deviceState.tanks.greyWaterCapacityLiters) * 100)}% capacity. Requires drainage & sanitation.`);
      }
      if (deviceState.tanks.freshWaterLiters < 40) {
        issues.push(`Fresh water tank below 30% (${deviceState.tanks.freshWaterLiters}L remaining). Requires refilling before next dispatch.`);
      }
      if (deviceState.power.batteryHealthPct < 95) {
        issues.push(`Battery health at ${deviceState.power.batteryHealthPct}%. Schedule deep cell impedance check.`);
      }
      if (deviceState.security.roofHatchOpen || deviceState.security.windowLeftOpen || deviceState.security.windowRightOpen) {
        issues.push('One or more hatches/windows are currently unlatched.');
      }

      const passed = issues.length === 0;

      return {
        reportId: 'INSP-' + Math.floor(100000 + Math.random() * 900000),
        passed,
        issues,
        timestamp: new Date().toLocaleString(),
        batteryCheck: `LiFePO4 Health: ${deviceState.power.batteryHealthPct}% | Cycles: ${deviceState.power.batteryCycles} | Current SoC: ${deviceState.power.batterySoc}%`,
        tankCheck: `Fresh: ${deviceState.tanks.freshWaterLiters}L / 150L | Grey: ${deviceState.tanks.greyWaterLiters}L / 80L`,
        locksCheck: `Smart Door: ${deviceState.security.mainDoorLocked ? 'LOCKED (Secure)' : 'UNLOCKED'} | Latches: ${deviceState.security.roofHatchOpen ? 'CHECK ROOF HATCH' : 'SECURE'}`,
      };
    },
    [fleet, deviceState]
  );

  const resetAllToDefault = useCallback(() => {
    setDeviceState(initialCaravanState);
    setAutomationRules(initialAutomationRules);
    setAlerts(initialAlerts);
    setActiveScenarioName(null);
    addAlert('info', 'system', 'System Reset', 'All sensors and actuator relays restored to factory defaults.');
  }, [addAlert]);

  // Auth observer & initial connection test
  useEffect(() => {
    testFirestoreConnection().catch(() => {});

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });

    const handleQuotaExceeded = () => {
      setQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);

    return () => {
      unsubscribe();
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  // Background ticker for micro-sensor fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      setDeviceState((prev) => {
        const solarJitter = prev.power.solarWatts > 0 ? (Math.random() - 0.5) * 4 : 0;
        const currentSolar = Math.max(0, Math.min(450, prev.power.solarWatts + solarJitter));
        
        const baseVoltage = 12.8 + (prev.power.batterySoc / 100) * 0.8;
        const voltageJitter = (Math.random() - 0.5) * 0.02;

        return {
          ...prev,
          lastSeen: new Date().toLocaleTimeString(),
          power: {
            ...prev.power,
            solarWatts: Math.round(currentSolar),
            batteryVoltage: Number((baseVoltage + voltageJitter).toFixed(2)),
          },
          environment: {
            ...prev.environment,
            cabinTempC: Number((prev.environment.cabinTempC + (Math.random() - 0.5) * 0.1).toFixed(1)),
          },
        };
      });

      if (Math.random() > 0.6) {
        emitMqttPacket('gecko/caravan/gk01/telemetry/heartbeat', {
          uptime_sec: 14280 + Math.floor(Date.now() / 1000) % 500,
          rssi_dbm: -66 + Math.floor((Math.random() - 0.5) * 4),
          free_heap_bytes: 184512,
        });
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [emitMqttPacket]);

  return (
    <CaravanContext.Provider
      value={{
        deviceState,
        automationRules,
        alerts,
        mqttPackets,
        fleet,
        cloudSyncMode,
        isEmulatorOpen,
        isCloudModalOpen,
        activeScenarioName,
        currentUser,
        isAuthLoading,
        quotaExceeded,
        signInWithGoogle,
        signOutUser,
        toggleActuator,
        setSecurityMode,
        setDeviceTelemetry,
        toggleAutomationRule,
        addAutomationRule,
        triggerAutomationRuleTest,
        acknowledgeAlert,
        dismissAlert,
        clearAllAlerts,
        applyScenario,
        setCloudSyncMode,
        setIsEmulatorOpen,
        setIsCloudModalOpen,
        simulateIntruderBreach,
        resetAllToDefault,
        generateRentalInspectionReport,
      }}
    >
      {children}
    </CaravanContext.Provider>
  );
};

export const useCaravan = (): CaravanContextType => {
  const context = useContext(CaravanContext);
  if (!context) {
    throw new Error('useCaravan must be used within a CaravanProvider');
  }
  return context;
};
