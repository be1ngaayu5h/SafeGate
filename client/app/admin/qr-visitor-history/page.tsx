"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { QrCode, Calendar, Search, Filter, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface QRVisitorHistory {
  id: number;
  name: string;
  purpose: string;
  visitDate: string;
  relation: string;
  flatNo: string;
  qrCode: string;
  status: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  createdAt: string;
  createdByResident: boolean;
}

export default function QRVisitorHistoryPage() {
  const [visitors, setVisitors] = useState<QRVisitorHistory[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<QRVisitorHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const [filterFlat, setFilterFlat] = useState("");

  useEffect(() => {
    fetchQRVisitors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [visitors, filterDate, filterFlat]);

  const fetchQRVisitors = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/qr-visitor/history');
      if (response.ok) {
        const data = await response.json();
        setVisitors(data);
      } else {
        toast.error("Failed to fetch QR visitor history");
      }
    } catch (error) {
      console.error("Error fetching QR visitors:", error);
      toast.error("Failed to fetch QR visitor history");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...visitors];

    if (filterDate) {
      filtered = filtered.filter(visitor => visitor.visitDate === filterDate);
    }

    if (filterFlat) {
      filtered = filtered.filter(visitor => 
        visitor.flatNo.toLowerCase().includes(filterFlat.toLowerCase())
      );
    }

    setFilteredVisitors(filtered);
  };

  const clearFilters = () => {
    setFilterDate("");
    setFilterFlat("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return "Not checked in";
    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">QR Visitor History</h1>
        <p className="text-gray-600">View and manage QR-based visitor entries</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="filterDate">Filter by Date</Label>
              <Input
                id="filterDate"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                placeholder="Select date"
              />
            </div>
            
            <div>
              <Label htmlFor="filterFlat">Filter by Flat</Label>
              <Input
                id="filterFlat"
                value={filterFlat}
                onChange={(e) => setFilterFlat(e.target.value)}
                placeholder="Enter flat number"
              />
            </div>
            
            <div className="flex items-end gap-2">
              <Button onClick={clearFilters} variant="outline" className="flex-1">
                Clear Filters
              </Button>
              <Button onClick={fetchQRVisitors} variant="outline">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Visitors</p>
                <p className="text-2xl font-bold">{visitors.length}</p>
              </div>
              <QrCode className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Checked In</p>
                <p className="text-2xl font-bold">
                  {visitors.filter(v => v.checkInTime).length}
                </p>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800">✓</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Checked Out</p>
                <p className="text-2xl font-bold">
                  {visitors.filter(v => v.checkOutTime).length}
                </p>
              </div>
              <Badge variant="secondary">↩</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Visitors</p>
                <p className="text-2xl font-bold">
                  {visitors.filter(v => v.visitDate === new Date().toISOString().split('T')[0]).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visitors Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>QR Visitor Records</span>
            <span className="text-sm text-gray-500">
              Showing {filteredVisitors.length} of {visitors.length} visitors
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Loading QR visitor history...</p>
            </div>
          ) : filteredVisitors.length === 0 ? (
            <div className="text-center py-8">
              <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No QR visitors found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Visitor Name</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Visit Date</TableHead>
                    <TableHead>Relation</TableHead>
                    <TableHead>Flat</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisitors.map((visitor) => (
                    <TableRow key={visitor.id}>
                      <TableCell className="font-mono text-sm">{visitor.id}</TableCell>
                      <TableCell className="font-medium">{visitor.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{visitor.purpose}</TableCell>
                      <TableCell>{visitor.visitDate}</TableCell>
                      <TableCell>{visitor.relation}</TableCell>
                      <TableCell className="font-mono">{visitor.flatNo}</TableCell>
                      <TableCell>{getStatusBadge(visitor.status)}</TableCell>
                      <TableCell className="text-sm">
                        {formatDateTime(visitor.checkInTime)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDateTime(visitor.checkOutTime)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(visitor.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
