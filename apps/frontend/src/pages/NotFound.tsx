import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  console.log("Page not found");

  // Auto-redirect after countdown
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, countdown * 1000);

    // Update countdown every second

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [countdown, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-orange-500" />
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-gray-500 mb-4">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="text-sm text-muted-foreground">
            Redirecting to home in{" "}
            <span className="font-medium">{countdown}</span> seconds...
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button onClick={() => navigate("/")} className="w-full sm:w-auto">
            Go Home Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
