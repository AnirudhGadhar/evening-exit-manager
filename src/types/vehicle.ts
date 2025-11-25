export interface Vehicle {
  id: string;
  vehicleNumber: string;
  ownerName: string;
  vehicleType: "Car" | "Bike" | "Truck" | "Other";
  entryTime: string;
  phoneNumber?: string;
}
