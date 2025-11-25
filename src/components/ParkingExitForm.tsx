import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Vehicle } from "@/types/vehicle";
import { Card } from "@/components/ui/card";
import { Clock, User, Car as CarIcon } from "lucide-react";

interface ParkingExitFormProps {
  vehicles: Vehicle[];
  onExit: (vehicleNumber: string) => void;
}

const ParkingExitForm = ({ vehicles, onExit }: ParkingExitFormProps) => {
  const [searchNumber, setSearchNumber] = useState("");
  const [foundVehicle, setFoundVehicle] = useState<Vehicle | null>(null);

  const handleSearch = () => {
    const vehicle = vehicles.find(
      (v) => v.vehicleNumber.toUpperCase() === searchNumber.toUpperCase()
    );
    setFoundVehicle(vehicle || null);
  };

  const handleExit = () => {
    if (foundVehicle) {
      onExit(foundVehicle.vehicleNumber);
      setSearchNumber("");
      setFoundVehicle(null);
    }
  };

  const calculateDuration = (entryTime: string) => {
    const entry = new Date(entryTime);
    const now = new Date();
    const diff = now.getTime() - entry.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="searchNumber">Vehicle Number</Label>
        <div className="flex gap-2">
          <Input
            id="searchNumber"
            placeholder="Enter vehicle number"
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} variant="secondary">
            Search
          </Button>
        </div>
      </div>

      {foundVehicle && (
        <Card className="p-4 space-y-3 border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 text-sm">
            <CarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{foundVehicle.vehicleNumber}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{foundVehicle.vehicleType}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{foundVehicle.ownerName}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Duration: {calculateDuration(foundVehicle.entryTime)}</span>
          </div>
          
          <Button onClick={handleExit} className="w-full" variant="destructive">
            Remove Vehicle
          </Button>
        </Card>
      )}

      {searchNumber && !foundVehicle && (
        <p className="text-sm text-destructive">Vehicle not found in parking</p>
      )}
    </div>
  );
};

export default ParkingExitForm;
