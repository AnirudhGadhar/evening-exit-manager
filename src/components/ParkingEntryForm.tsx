import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vehicle } from "@/types/vehicle";

interface ParkingEntryFormProps {
  onSubmit: (vehicle: Vehicle) => void;
}

const ParkingEntryForm = ({ onSubmit }: ParkingEntryFormProps) => {
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    ownerName: "",
    vehicleType: "",
    phoneNumber: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const vehicle: Vehicle = {
      id: Date.now().toString(),
      vehicleNumber: formData.vehicleNumber.toUpperCase(),
      ownerName: formData.ownerName,
      vehicleType: formData.vehicleType as Vehicle["vehicleType"],
      entryTime: new Date().toISOString(),
      phoneNumber: formData.phoneNumber || undefined,
    };

    onSubmit(vehicle);
    
    // Reset form
    setFormData({
      vehicleNumber: "",
      ownerName: "",
      vehicleType: "",
      phoneNumber: "",
    });
  };

  const isFormValid = formData.vehicleNumber && formData.ownerName && formData.vehicleType;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="vehicleNumber">Vehicle Number*</Label>
        <Input
          id="vehicleNumber"
          placeholder="e.g., MH12AB1234"
          value={formData.vehicleNumber}
          onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ownerName">Owner Name*</Label>
        <Input
          id="ownerName"
          placeholder="Enter owner name"
          value={formData.ownerName}
          onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vehicleType">Vehicle Type*</Label>
        <Select
          value={formData.vehicleType}
          onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
        >
          <SelectTrigger id="vehicleType">
            <SelectValue placeholder="Select vehicle type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Car">Car</SelectItem>
            <SelectItem value="Bike">Bike</SelectItem>
            <SelectItem value="Truck">Truck</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
        <Input
          id="phoneNumber"
          placeholder="Enter phone number"
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full" disabled={!isFormValid}>
        Park Vehicle
      </Button>
    </form>
  );
};

export default ParkingEntryForm;
