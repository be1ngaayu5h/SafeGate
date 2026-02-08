"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Home,
  MessageSquare,
  Phone,
  MapPin,
} from "lucide-react";

import AddResidentDialog from "@/components/custom-dialog/add-resident-dialog";
import ViewResidentDialog from "@/components/custom-dialog/view-resident-dialog";
import EditResidentDialog from "@/components/custom-dialog/edit-resident-dialog";
import { useEffect, useState } from "react";
import { AdminService } from "@/service/adminService";

interface Resident {
  contact: string;
  email: string;
  flatNo: string;
  id: number;
  name: string;
  password: string;
  status: boolean;
  emergencyContact: string;
}

const Page = () => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResidents = async (search?: string) => {
    try {
      setLoading(true);
      const response = await AdminService.searchResidents(search);
      setResidents(response.data);
    } catch (error) {
      console.error("Error fetching residents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const handleSearch = () => {
    fetchResidents(searchTerm);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const complaints = [
    {
      id: "C001",
      resident: "John Smith",
      flatNo: "A-101",
      type: "Maintenance",
      subject: "Water leakage in bathroom",
      status: "Open",
      priority: "High",
      date: "2024-01-15",
    },
    {
      id: "C002",
      resident: "Sarah Johnson",
      flatNo: "B-205",
      type: "Noise",
      subject: "Loud music from neighbor",
      status: "In Progress",
      priority: "Medium",
      date: "2024-01-14",
    },
    {
      id: "C003",
      resident: "Mike Davis",
      flatNo: "C-301",
      type: "Security",
      subject: "Broken gate lock",
      status: "Resolved",
      priority: "High",
      date: "2024-01-12",
    },
  ];

  const presentCount = residents.filter((r) => r.status === true).length;
  const notPresentCount = residents.filter((r) => r.status === false).length;
  const totalResidents = residents.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Residents
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalResidents}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Present</p>
                  <p className="text-2xl font-bold text-green-600">
                    {presentCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserX className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Not Present
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {notPresentCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Home className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Occupancy Rate
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round((presentCount / totalResidents) * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Resident Directory</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search residents by name, flat number, email, contact..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </Button>
              <AddResidentDialog onSuccess={() => fetchResidents(searchTerm)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Resident ID</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Flat No.</th>
                    <th className="text-left p-3">Contact</th>
                    <th className="text-left p-3">Emergency Contact</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {residents.map((resident) => (
                    <tr key={resident.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{resident.id}</td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{resident.name}</div>
                          <div className="text-sm text-gray-500">
                            {resident.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          {resident.flatNo}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 text-gray-400 mr-1" />
                          {resident.contact}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 text-gray-400 mr-1" />
                          {resident.emergencyContact || "Not provided"}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={
                            resident.status === true ? "default" : "secondary"
                          }
                          className={
                            resident.status === true
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {resident.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <ViewResidentDialog residentId={resident.id} />
                          <EditResidentDialog
                            residentId={resident.id}
                            onUpdate={() => fetchResidents(searchTerm)}
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
    </div>
  );
};

export default Page;
