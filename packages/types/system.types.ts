export interface ISystemStats {
  os: {
    hostname: string;
    platform: string;
    arch: string;
  };
  cpuTemp: number;
  cpuUsage: string[];
  memoryUsage: {
    total: number;
    used: number;
    free: number;
  };
}
