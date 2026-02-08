"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Scan,
  Camera,
  Upload,
  User,
  Phone,
  Clock,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { GuardService } from "@/service/guardService";

interface QRScannerModalProps {
  onClose: () => void;
}

export function QRScannerModal({ onClose }: QRScannerModalProps) {
  const [scannedData, setScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Mock scanned visitor data
  const mockScanResult = {
    id: "V001",
    name: "John Smith",
    phone: "+91 9876543210",
    purpose: "Business Meeting",
    date: "2024-08-08",
    timeSlot: "10:00 AM - 11:30 AM",
    flatNumber: "204",
    qrCode: "V001-20240808-1000",
  };

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      setScannedData(mockScanResult);
      setIsScanning(false);
    }, 2000);
  };

  const handleFileUpload = () => {
    // Simulate file upload and QR decode
    setScannedData(mockScanResult);
  };

  const handleAllowEntry = async () => {
    if (!scannedData) return;
    try {
      // In real flow you will parse QR to get visitorId; here we use id mocked as number-like
      const id = parseInt(String(scannedData.id).replace(/\D/g, "")) || 0;
      const resp = await GuardService.validateVisit(id);
      if (resp.data) {
        alert("Entry allowed");
      } else {
        alert("Visit not valid");
      }
    } catch (e) {
      alert("Error validating visit");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scan className="w-5 h-5" />
            QR Code Scanner
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!scannedData ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  {isScanning ? (
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">
                        Scanning QR Code...
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Camera preview will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleScan}
                  disabled={isScanning}
                  className="flex-1"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {isScanning ? "Scanning..." : "Start Camera Scan"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleFileUpload}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload QR Image
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>Point your camera at a visitor QR code or upload an image</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Scan className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-600">
                  QR Code Scanned Successfully!
                </h3>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold">
                        {scannedData.name}
                      </h4>
                      <span className="text-sm text-gray-500">
                        ID: {scannedData.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{scannedData.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{scannedData.purpose}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{scannedData.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          Flat {scannedData.flatNumber}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        <strong>Visit Date:</strong> {scannedData.date}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>QR Code:</strong> {scannedData.qrCode}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button className="flex-1" onClick={handleAllowEntry}>
                  Allow Entry
                </Button>
                <Button variant="outline">View Full Details</Button>
                <Button variant="outline" onClick={() => setScannedData(null)}>
                  Scan Another
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
