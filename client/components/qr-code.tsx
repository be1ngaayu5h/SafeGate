"use client";

import QRCode from "react-qr-code";

export function Qrcode({ isSubmiteed }: { isSubmiteed: boolean }) {
  return (
    <div className="flex flex-col items-center space-y-4 mt-10">
      <h1 className="text-xl font-semibold">
        Enter User details for generating QR Code
      </h1>
      {isSubmiteed && <QRCode value="https://github.com/anshul45" />}
    </div>
  );
}
