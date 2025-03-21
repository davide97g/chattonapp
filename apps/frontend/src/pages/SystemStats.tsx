import { Loader } from "@/components/custom/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getSystemDetails } from "@/services/api";
import { ISystemStats } from "@chattonapp/types";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function SystemStats() {
  const navigate = useNavigate();
  const [systemInfo, setSystemInfo] = useState<ISystemStats | null>(null);

  useEffect(() => {
    getSystemDetails().then((data) => setSystemInfo(data));
  }, []);

  if (!systemInfo) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>System Information</CardTitle>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft /> Home
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {[
              ["Hostname", systemInfo.os.hostname],
              ["Platform", systemInfo.os.platform],
              ["Architecture", systemInfo.os.arch],
              ["CPU Temperature", `${systemInfo.cpuTemp.toFixed(1)}°C`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}:</span>
                <span className="text-foreground font-medium">{value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">CPU Usage</h3>
            {systemInfo.cpuUsage.map((usage, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Core {index}</span>
                  <span>{usage}%</span>
                </div>
                <Progress value={parseFloat(usage)} className="h-2" />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Memory Usage
            </h3>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Used</span>
              <span>
                {systemInfo.memoryUsage.used.toFixed(2)} /{" "}
                {systemInfo.memoryUsage.total.toFixed(2)} GB
              </span>
            </div>
            <Progress
              value={
                (systemInfo.memoryUsage.used / systemInfo.memoryUsage.total) *
                100
              }
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
