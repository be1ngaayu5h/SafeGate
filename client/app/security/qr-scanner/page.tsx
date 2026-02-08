"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QrCode, Scan, Upload, Camera, CheckCircle, XCircle, User, Phone, Clock, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";
import jsQR from "jsqr";

interface ScannedQRVisitor {
  id: number;
  name: string;
  purpose: string;
  visitDate: string;
  relation: string;
  flatNo: string;
  status: string;
  createdByResident: boolean;
  qrCode: string;
}

export default function QRScannerPage() {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedQRVisitor | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null);

  const handleScan = () => {
    setIsScanning(true);
    setShowScanner(true);
    
    // For now, we'll show a message about camera functionality
    setTimeout(() => {
      toast.info("Camera scanning requires additional setup. Please use 'Upload QR Image' or 'Manual Entry' for testing.");
      setIsScanning(false);
      setShowScanner(false);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Get image data for QR decoding
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          // Decode QR code using jsQR
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (code) {
            try {
              // Parse the QR data as JSON
              const qrData = JSON.parse(code.data);
              setScannedData(qrData);
              toast.success("QR code decoded successfully!");
            } catch (error) {
              toast.error("Invalid QR code format. Expected JSON data.");
              console.error("QR decode error:", error);
            }
          } else {
            toast.error("No QR code found in the uploaded image.");
          }
        }
      };
      
      img.src = URL.createObjectURL(file);
    }
  };

  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualQRData, setManualQRData] = useState("");

  const handleManualEntry = () => {
    setShowManualEntry(true);
  };

  const handleManualEntrySubmit = () => {
    if (!manualQRData.trim()) {
      toast.error("Please enter QR data");
      return;
    }

    try {
      const parsedData = JSON.parse(manualQRData);
      setScannedData(parsedData);
      setShowManualEntry(false);
      setManualQRData("");
      toast.success("QR data entered successfully!");
    } catch (error) {
      toast.error("Invalid QR data format. Please check the JSON syntax.");
      console.error("Parse error:", error);
    }
  };

  const validateQRVisitor = async () => {
    if (!scannedData) return;
    
    setIsValidating(true);
    try {
      // Call the new QR-specific validation endpoint
      const response = await fetch('http://localhost:8080/qr-visitor/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scannedData)
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.valid) {
          toast.success("QR Visitor validated successfully! Entry allowed.");
          // Record the check-in
          await fetch(`http://localhost:8080/qr-visitor/checkin/${scannedData.id}`, {
            method: 'POST'
          });
          setScannedData(null);
        } else {
          toast.error(result.message || "Invalid QR visitor or visit not approved");
        }
      } else {
        toast.error("Error validating QR visitor");
      }
    } catch (error) {
      toast.error("Error validating QR visitor");
      console.error(error);
    } finally {
      setIsValidating(false);
    }
  };

  const denyEntry = () => {
    toast.error("Entry denied for QR visitor");
    setScannedData(null);
  };

  const resetScanner = () => {
    setScannedData(null);
    setIsScanning(false);
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">QR Code Scanner</h1>
        <p className="text-gray-600">Scan QR visitor codes to validate and allow entry</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="w-5 h-5" />
              Scan QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button 
                onClick={handleScan} 
                disabled={isScanning}
                className="w-full"
                size="lg"
              >
                <Camera className="w-5 h-5 mr-2" />
                {isScanning ? "Scanning..." : "Start Camera Scan"}
              </Button>

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  ref={(input) => setFileInput(input)}
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInput?.click()}
                  className="w-full"
                  size="lg"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload QR Image
                </Button>
              </div>

              <Button 
                variant="outline" 
                onClick={handleManualEntry}
                className="w-full"
                size="lg"
              >
                <QrCode className="w-5 h-5 mr-2" />
                Manual Entry
              </Button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Scanning Options:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Camera Scan:</strong> Use device camera to scan QR codes</li>
                <li>• <strong>Upload Image:</strong> Upload a photo containing QR code</li>
                <li>• <strong>Manual Entry:</strong> Enter QR data manually for testing</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              QR Validation Process
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm font-semibold">1</div>
                <div>
                  <h4 className="font-medium">Scan QR Code</h4>
                  <p className="text-sm text-gray-600">Use camera or upload image to scan visitor QR code.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm font-semibold">2</div>
                <div>
                  <h4 className="font-medium">Review Details</h4>
                  <p className="text-sm text-gray-600">Verify visitor information and visit schedule.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm font-semibold">3</div>
                <div>
                  <h4 className="font-medium">Validate & Allow</h4>
                  <p className="text-sm text-gray-600">Check if visit is valid and allow entry if approved.</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">QR Validation Checks:</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• QR code must be generated by resident</li>
                <li>• Visit date must match current date</li>
                <li>• Current time must be within scheduled time slot</li>
                <li>• Visitor must not be already checked in</li>
                <li>• QR code must be valid and not expired</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scanned Data Display */}
      {scannedData && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              QR Visitor Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{scannedData.name}</p>
                    <p className="text-sm text-gray-500">Visitor Name</p>
                  </div>
                </div>
                

                
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Flat {scannedData.flatNo}</p>
                    <p className="text-sm text-gray-500">Destination</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{scannedData.visitDate}</p>
                    <p className="text-sm text-gray-500">Visit Date</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                
                <div>
                  <p className="font-medium">{scannedData.purpose}</p>
                  <p className="text-sm text-gray-500">Purpose of Visit</p>
                </div>
                
                <div>
                  <p className="font-medium">{scannedData.relation}</p>
                  <p className="text-sm text-gray-500">Relation</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    scannedData.status === "APPROVED" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {scannedData.status}
                  </span>
                  <span className="text-sm text-gray-500">Status</span>
                </div>

                <div>
                  <p className="font-medium">{scannedData.qrCode}</p>
                  <p className="text-sm text-gray-500">QR Code ID</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button 
                onClick={validateQRVisitor} 
                disabled={isValidating}
                className="flex-1"
                size="lg"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {isValidating ? "Validating..." : "Allow Entry"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={denyEntry}
                className="flex-1"
                size="lg"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Deny Entry
              </Button>
              
              <Button 
                variant="outline" 
                onClick={resetScanner}
                size="lg"
              >
                Scan Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scanner Modal */}
      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Scanning QR Code
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Camera scanning coming soon</p>
                  <p className="text-xs text-gray-500 mt-1">Use Upload or Manual Entry for now</p>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>Point your camera at the visitor QR code</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manual Entry Modal */}
      <Dialog open={showManualEntry} onOpenChange={setShowManualEntry}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Manual QR Data Entry
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="qrData">QR Code Data (JSON format)</Label>
              <textarea
                id="qrData"
                value={manualQRData}
                onChange={(e) => setManualQRData(e.target.value)}
                placeholder={`Example:
{
  "id": 123,
  "name": "John Doe",
  "purpose": "Business Meeting",
  "visitDate": "2024-01-15",
  "relation": "Colleague",
  "flatNo": "A101",
  "status": "APPROVED",
  "createdByResident": true,
  "qrCode": "QR12345678"
}`}
                className="w-full h-48 p-3 border rounded-md font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleManualEntrySubmit} className="flex-1">
                Validate QR Data
              </Button>
              <Button variant="outline" onClick={() => setShowManualEntry(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
