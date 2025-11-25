import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Clock } from "lucide-react";
import ParkingEntryForm from "@/components/ParkingEntryForm";
import ParkingExitForm from "@/components/ParkingExitForm";
import VehicleList from "@/components/VehicleList";
import { Vehicle } from "@/types/vehicle";
import { toast } from "sonner";

const Index = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Load vehicles from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("parkedVehicles");
    if (stored) {
      setVehicles(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever vehicles change
  useEffect(() => {
    localStorage.setItem("parkedVehicles", JSON.stringify(vehicles));
  }, [vehicles]);

  // Auto-clear at 6 PM
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      // Check if it's 6 PM (18:00)
      if (hours === 18 && minutes === 0) {
        setVehicles([]);
        localStorage.removeItem("parkedVehicles");
        toast.success("All vehicles cleared at 6 PM");
      }
    };

    // Check every minute
    const interval = setInterval(checkTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleVehicleEntry = (vehicle: Vehicle) => {
    setVehicles([...vehicles, vehicle]);
    toast.success(`Vehicle ${vehicle.vehicleNumber} parked successfully`);
  };

  const handleVehicleExit = (vehicleNumber: string) => {
    setVehicles(vehicles.filter(v => v.vehicleNumber !== vehicleNumber));
    toast.success(`Vehicle ${vehicleNumber} removed successfully`);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Car className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Parking Management System</h1>
          </div>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            All vehicles auto-clear at 6:00 PM daily
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Parked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{vehicles.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cars</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {vehicles.filter(v => v.vehicleType === "Car").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Bikes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {vehicles.filter(v => v.vehicleType === "Bike").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Forms */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="entry" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="entry">Entry</TabsTrigger>
                <TabsTrigger value="exit">Exit</TabsTrigger>
              </TabsList>
              
              <TabsContent value="entry" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Vehicle Entry</CardTitle>
                    <CardDescription>Register a new vehicle</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ParkingEntryForm onSubmit={handleVehicleEntry} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="exit" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Vehicle Exit</CardTitle>
                    <CardDescription>Remove a parked vehicle</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ParkingExitForm 
                      vehicles={vehicles}
                      onExit={handleVehicleExit}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Vehicle List */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Currently Parked Vehicles</CardTitle>
                <CardDescription>
                  {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} in parking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VehicleList vehicles={vehicles} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
