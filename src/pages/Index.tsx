import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { statsApi, parkingSessionsApi } from "@/lib/api";
import { Car, Clock, ParkingSquare } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ activeSessions: 0, totalVehicles: 0, availableSlots: 0 });
  const [sessions, setSessions] = useState([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (!token || !storedUser) {
      navigate("/login");
      return;
    }
    
    setUser(JSON.parse(storedUser));
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const [statsData, sessionsData] = await Promise.all([
        statsApi.get(),
        parkingSessionsApi.getActive(),
      ]);
      setStats(statsData);
      setSessions(sessionsData);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleExitSession = async (sessionId: number) => {
    try {
      await parkingSessionsApi.exit(sessionId);
      toast({ title: "Success", description: "Vehicle exited successfully" });
      loadData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Parking Management</h1>
            <p className="text-muted-foreground">Welcome, {user?.full_name}</p>
          </div>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSessions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Vehicles</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVehicles}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
              <ParkingSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.availableSlots}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Parking Sessions</CardTitle>
            <CardDescription>Your currently parked vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No active parking sessions</p>
            ) : (
              <div className="space-y-4">
                {sessions.map((session: any) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{session.vehicle_number}</p>
                      <p className="text-sm text-muted-foreground">
                        Slot: {session.slot_number} | Type: {session.vehicle_type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Entry: {new Date(session.entry_time).toLocaleString()}
                      </p>
                    </div>
                    <Button onClick={() => handleExitSession(session.id)} variant="destructive">
                      Exit
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
