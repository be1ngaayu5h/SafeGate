"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatePicker from "@/components/custom-date-picker";
import AddSecurityDialog from "@/components/custom-dialog/add-security-dialog";
import ViewGuardDialog from "@/components/custom-dialog/view-guard-dialog";
import EditGuardDialog from "@/components/custom-dialog/edit-guard-dialog";
import { useEffect, useState } from "react";
import { AdminService } from "@/service/adminService";

interface Guard {
  id: number;
  name: string;
  contact: string;
  email: string;
  shift: string;
  checkInTime: string;
  checkOutTime: string;
}

const Page = () => {
  const [guards, setGuards] = useState<Guard[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const fetchGuards = async (search?: string) => {
    try {
      setLoading(true);
      const response = await AdminService.searchGuards(search);
      setGuards(response?.data || []);
    } catch (error) {
      console.error("Error fetching guards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuards();
  }, []);

  const handleSearch = () => {
    fetchGuards(searchTerm);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDateFilter = async () => {
    if (selectedDate) {
      try {
        setLoading(true);
        const dateStr = selectedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
        const response = await AdminService.getGuardsByDate(dateStr);
        setGuards(response?.data || []);
      } catch (error) {
        console.error("Error fetching guards by date:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50  px-4 sm:px-6 lg:px-8 py-8">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">
            Security Personnal Activity
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <main className="max-w-7xl mx-auto space-y-4">
            {/* Guards List */}
            <Card>
              <CardHeader>
                <CardTitle>Active Guards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      name: "John Smith",
                      location: "Gate A",
                      status: "On Duty",
                      arms: "Baton, Radio",
                    },
                    {
                      name: "Sarah Johnson",
                      location: "Building 1",
                      status: "On Duty",
                      arms: "Radio, Keys",
                    },
                    {
                      name: "Mike Davis",
                      location: "Parking",
                      status: "On Break",
                      arms: "Flashlight",
                    },
                    {
                      name: "Lisa Wilson",
                      location: "Gate B",
                      status: "On Duty",
                      arms: "Baton, Radio, Keys",
                    },
                  ].map((guard, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="font-semibold">{guard.name}</div>
                          <div className="text-sm text-gray-600">
                            {guard.location}
                          </div>
                          <Badge
                            variant={
                              guard.status === "On Duty"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {guard.status}
                          </Badge>
                          <div className="text-xs text-gray-500">
                            Arms: {guard.arms}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Secuirty Personnal</CardTitle>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search security personnel by name, email, contact..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={handleSearchInputChange}
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                  <Button onClick={handleSearch} disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                  </Button>
                  <AddSecurityDialog
                    onSuccess={() => fetchGuards(searchTerm)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Contact</th>
                        <th className="text-left p-2">Shift</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Time In</th>
                        <th className="text-left p-2">Time Out</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guards.map((guard) => (
                        <tr key={guard?.id} className="border-b">
                          <td className="p-2">{guard?.name}</td>
                          <td className="p-2">{guard?.contact}</td>
                          <td className="p-2">{guard?.shift}</td>
                          <td className="p-2">{guard?.email}</td>
                          <td className="p-2">{guard?.checkInTime ?? "N/A"}</td>
                          <td className="p-2">
                            {guard?.checkOutTime ?? "N/A"}
                          </td>
                          <td className="p-2">
                            <div className="flex gap-2">
                              <ViewGuardDialog guardId={guard.id} />
                              <EditGuardDialog
                                guardId={guard.id}
                                onUpdate={() => fetchGuards(searchTerm)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </main>
        </TabsContent>
        <TabsContent value="users" className="space-y-5"></TabsContent>
        <TabsContent value="activity" className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Active Secuirty Personnal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Conatct</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Shift</th>
                      <th className="text-left p-2">Time In</th>
                      <th className="text-left p-2">Time Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guards.map((guard) => (
                      <tr key={guard?.id} className="border-b">
                        <td className="p-2">{guard?.name}</td>
                        <td className="p-2">{guard?.contact}</td>
                        <td className="p-2">{guard?.email}</td>
                        <td className="p-2">{guard?.shift}</td>
                        <td className="p-2">{guard?.checkInTime ?? "N/A"}</td>
                        <td className="p-2">{guard?.checkOutTime ?? "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>Search Security Personnel by Date</CardTitle>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <DatePicker date={selectedDate} setDate={setSelectedDate} />
                </div>
                <Button
                  onClick={handleDateFilter}
                  disabled={loading || !selectedDate}
                >
                  {loading ? "Filtering..." : "Filter by Date"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedDate(undefined);
                    fetchGuards();
                  }}
                >
                  Clear Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Conatct</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Shift</th>
                      <th className="text-left p-2">Time In</th>
                      <th className="text-left p-2">Time Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guards.map((guard) => (
                      <tr key={guard?.id} className="border-b">
                        <td className="p-2">{guard?.name}</td>
                        <td className="p-2">{guard?.contact}</td>
                        <td className="p-2">{guard?.email}</td>
                        <td className="p-2">{guard?.shift}</td>
                        <td className="p-2">{guard?.checkInTime ?? "N/A"}</td>
                        <td className="p-2">{guard?.checkOutTime ?? "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
