import { Vehicle } from "@/types/vehicle";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Car as CarIcon, Phone } from "lucide-react";

interface VehicleListProps {
  vehicles: Vehicle[];
}

const VehicleList = ({ vehicles }: VehicleListProps) => {
  const calculateDuration = (entryTime: string) => {
    const entry = new Date(entryTime);
    const now = new Date();
    const diff = now.getTime() - entry.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: true 
    });
  };

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <CarIcon className="h-16 w-16 mx-auto mb-4 opacity-20" />
        <p>No vehicles currently parked</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id} className="p-4 hover:border-primary/50 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{vehicle.vehicleNumber}</h3>
              <Badge variant="secondary">{vehicle.vehicleType}</Badge>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div className="font-medium text-foreground">
                {calculateDuration(vehicle.entryTime)}
              </div>
              <div className="text-xs">parked</div>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{vehicle.ownerName}</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Entry: {formatTime(vehicle.entryTime)}</span>
            </div>
            
            {vehicle.phoneNumber && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{vehicle.phoneNumber}</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default VehicleList;
