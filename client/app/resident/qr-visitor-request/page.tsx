"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QrCode, Download, Share2, Users, Calendar, Clock, MapPin, Phone } from "lucide-react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

interface QRVisitorRequest {
  name: string;
  purpose: string;
  visitDate: string;
  relation: string;
  flatNo: string;
}

export default function QRVisitorRequestPage() {
  const [showQRModal, setShowQRModal] = useState(false);
  const [generatedQR, setGeneratedQR] = useState<string>("");
  const [visitorData, setVisitorData] = useState<QRVisitorRequest>({
    name: "",
    purpose: "",
    visitDate: "",
    relation: "",
    flatNo: "A101" // Hardcoded as per existing pattern
  });



  const handleInputChange = (field: keyof QRVisitorRequest, value: string) => {
    setVisitorData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!visitorData.name || !visitorData.purpose || !visitorData.visitDate || !visitorData.relation) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Call the new QR-specific API endpoint
      const response = await fetch('http://localhost:8080/qr-visitor/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitorData)
      });

      if (response.ok) {
        const result = await response.json();
        
        console.log("Backend response:", result); // Debug log
        
        // Generate QR code data with the returned visitor ID
        const qrData = JSON.stringify({
          id: result.visitorId || Date.now(), // Fallback to timestamp if no ID
          name: visitorData.name,
          purpose: visitorData.purpose,
          visitDate: visitorData.visitDate,
          relation: visitorData.relation,
          flatNo: visitorData.flatNo,
          status: "APPROVED",
          createdByResident: true,
          qrCode: result.qrCode || `QR${Date.now()}` // Fallback QR code
        });
        
        console.log("Generated QR data:", qrData); // Debug log
        
        // Test QR code generation
        if (!qrData || qrData === '{}') {
          toast.error("Failed to generate QR data");
          return;
        }
        
        setGeneratedQR(qrData);
        setShowQRModal(true);
        toast.success("QR Visitor request created successfully!");
        
        // Reset form
        setVisitorData({
          name: "",
          purpose: "",
          visitDate: "",
          relation: "",
          flatNo: "A101"
        });
      } else {
        toast.error("Failed to create QR visitor request");
      }
    } catch (error) {
      toast.error("Failed to create QR visitor request");
      console.error(error);
    }
  };

  const downloadQR = () => {
    try {
      // Get the QR code SVG element
      const qrSvg = document.querySelector('svg');
      if (!qrSvg) {
        toast.error("QR code not found");
        return;
      }

      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        toast.error("Canvas context not available");
        return;
      }

      canvas.width = 400;
      canvas.height = 400;

      // Draw white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 400);

      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(qrSvg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          // Draw QR code in center
          ctx.drawImage(img, 50, 50, 300, 300);
          
          // Add visitor info as text overlay
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`${visitorData.name}`, 200, 370);
          ctx.font = '12px Arial';
          ctx.fillText(`${visitorData.visitDate}`, 200, 385);
          
          // Create download link
          const link = document.createElement('a');
          link.download = `qr-visitor-${visitorData.name}-${visitorData.visitDate}.png`;
          link.href = canvas.toDataURL('image/png');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          URL.revokeObjectURL(url);
          toast.success("QR code image downloaded successfully!");
        } catch (error) {
          console.error("Error creating download:", error);
          toast.error("Failed to create QR image download");
        }
      };

      img.onerror = () => {
        toast.error("Failed to load QR code image");
        URL.revokeObjectURL(url);
      };

      img.src = url;
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download QR code");
    }
  };

  const shareQR = () => {
    if (navigator.share) {
      navigator.share({
        title: 'QR Visitor Code',
        text: `QR Code for ${visitorData.name} visiting on ${visitorData.visitDate}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(generatedQR);
      toast.success("QR data copied to clipboard! You can paste this in the security scanner.");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">QR Visitor Request</h1>
        <p className="text-gray-600">Create a QR-based visitor request for security verification</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Request Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              QR Visitor Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Visitor Name *</Label>
                <Input
                  id="name"
                  value={visitorData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter visitor name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="relation">Relation *</Label>
                <Select value={visitorData.relation} onValueChange={(value) => handleInputChange("relation", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Family">Family</SelectItem>
                    <SelectItem value="Friend">Friend</SelectItem>
                    <SelectItem value="Colleague">Colleague</SelectItem>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="purpose">Purpose of Visit *</Label>
                <Textarea
                  id="purpose"
                  value={visitorData.purpose}
                  onChange={(e) => handleInputChange("purpose", e.target.value)}
                  placeholder="Enter purpose of visit"
                  required
                />
              </div>

              <div>
                <Label htmlFor="visitDate">Visit Date *</Label>
                <Input
                  id="visitDate"
                  type="date"
                  value={visitorData.visitDate}
                  onChange={(e) => handleInputChange("visitDate", e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <QrCode className="w-4 h-4 mr-2" />
                Generate QR Code
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              How QR System Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-semibold">1</div>
                <div>
                  <h4 className="font-medium">Fill Visitor Details</h4>
                  <p className="text-sm text-gray-600">Enter all required visitor information including name, purpose, and visit date.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-semibold">2</div>
                <div>
                  <h4 className="font-medium">Generate QR Code</h4>
                  <p className="text-sm text-gray-600">Submit the form to generate a unique QR code for the visitor.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-semibold">3</div>
                <div>
                  <h4 className="font-medium">Share with Visitor</h4>
                  <p className="text-sm text-gray-600">Download or share the QR code with your visitor. They can show it to security for entry.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-semibold">4</div>
                <div>
                  <h4 className="font-medium">Security Verification</h4>
                  <p className="text-sm text-gray-600">Security will scan the QR code to validate the visitor and allow entry.</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• QR codes are valid only for the specified date and time</li>
                <li>• Each visitor should have their own QR code</li>
                <li>• Security will verify the QR code before allowing entry</li>
                <li>• Keep the QR code secure and don't share with unauthorized persons</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Code Modal */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              QR Visitor Code
            </DialogTitle>
            <DialogDescription>
              Generated QR code for visitor entry. Download or share this code with your visitor.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg border inline-block">
                <QRCode
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={generatedQR}
                  viewBox={`0 0 200 200`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <p><strong>Visitor:</strong> {visitorData.name}</p>
                <p><strong>Date:</strong> {visitorData.visitDate}</p>
                <p><strong>Purpose:</strong> {visitorData.purpose}</p>
              </div>
              
              {/* Debug: Show QR data */}
              <details className="mt-4">
                <summary className="text-xs text-gray-500 cursor-pointer">Show QR Data (Debug)</summary>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-32">
                  {generatedQR}
                </pre>
              </details>
            </div>

            <div className="flex gap-2">
              <Button onClick={downloadQR} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download QR Image
              </Button>
              <Button onClick={shareQR} variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            <div className="text-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  console.log("QR Data:", generatedQR);
                  console.log("QR Container:", document.querySelector('.bg-white.p-4.rounded-lg.border.inline-block'));
                }}
              >
                Debug QR Code
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Show this QR code to security for entry verification
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
