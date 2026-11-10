export type SecurityState = 'disarmed' | 'camp_mode' | 'armed_away';

export interface PowerTelemetry {
  batterySoc: number; // 0-100%
  batteryVoltage: number; // e.g. 13.25V
  batteryCurrent: number; // Amps (+ is charging, - is discharging)
  batteryCapacityAh: number; // e.g. 200Ah
  batteryTempC: number;
  batteryCycles: number;
  batteryHealthPct: number;
  solarWatts: number; // Current solar intake
  solarPeakWatts: number; // Max capacity e.g. 450W
  solarDailyKwh: number; // Cumulative for today
  inverterOn: boolean;
  inverterLoadWatts: number;
  acSocketsActive: boolean;
  dcLoadWatts: number;
  shorePowerConnected: boolean;
}

export interface EnvironmentTelemetry {
  cabinTempC: number;
  cabinHumidityPct: number;
  exteriorTempC: number;
  exteriorHumidityPct: number;
  fridgeTempC: number;
  fridgeTargetTempC: number;
  freezerTempC: number;
  cabinAqi: number; // 0-100 (good to poor)
}

export interface TanksTelemetry {
  freshWaterLiters: number;
  freshWaterCapacityLiters: number;
  greyWaterLiters: number;
  greyWaterCapacityLiters: number;
  waterPumpActive: boolean;
  waterHeaterActive: boolean;
}

export interface SecurityTelemetry {
  systemMode: SecurityState;
  mainDoorLocked: boolean;
  mainDoorOpen: boolean;
  windowLeftOpen: boolean;
  windowRightOpen: boolean;
  roofHatchOpen: boolean;
  pirMotionDetected: boolean;
  sirenActive: boolean;
  geofenceRadiusMeters: number;
  distanceFromBaseMeters: number;
  gpsCoordinates: { lat: number; lng: number };
}

export interface ActuatorState {
  livingLightsPct: number; // 0-100
  livingLightsColorTemp: 'warm' | 'neutral' | 'cool';
  bedroomLightsOn: boolean;
  awningStripPct: number; // 0-100
  awningStripBugMode: boolean; // Amber bug-repel mode
  perimeterFloodlightsOn: boolean;
  roofVentFanSpeed: 'off' | 'low' | 'med' | 'high';
  roofVentDirection: 'exhaust' | 'intake';
  fridgePowerOn: boolean;
  hotWaterBoostOn: boolean;
  inverterSwitchOn: boolean;
}

export interface CaravanDeviceState {
  id: string;
  name: string;
  model: string;
  chassisNumber: string;
  firmwareVersion: string;
  hardwareChip: string;
  ipAddress: string;
  macAddress: string;
  lastSeen: string;
  signalRssi: number; // dBm
  cloudSyncStatus: 'synced' | 'syncing' | 'offline';
  power: PowerTelemetry;
  environment: EnvironmentTelemetry;
  tanks: TanksTelemetry;
  security: SecurityTelemetry;
  actuators: ActuatorState;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  triggerType: 'temp_high' | 'solar_high' | 'motion_armed' | 'battery_low' | 'door_open_away' | 'night_schedule';
  conditionSummary: string;
  actionSummary: string;
  lastTriggeredAt?: string;
  executionCount: number;
}

export interface AlertNotification {
  id: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'security' | 'power' | 'environment' | 'system';
  title: string;
  message: string;
  acknowledged: boolean;
}

export interface MqttPacket {
  id: string;
  timestamp: string;
  topic: string;
  direction: 'inbound' | 'outbound';
  payload: Record<string, unknown>;
  sizeBytes: number;
}

export interface FleetCaravan {
  id: string;
  name: string;
  model: string;
  chassisNumber: string;
  currentStatus: 'rented' | 'available' | 'maintenance' | 'transit';
  renterName?: string;
  rentalPeriod?: string;
  batteryHealth: number;
  batterySoc: number;
  locationName: string;
  totalTripsKm: number;
  lastInspectionDate: string;
  alertsCount: number;
}
