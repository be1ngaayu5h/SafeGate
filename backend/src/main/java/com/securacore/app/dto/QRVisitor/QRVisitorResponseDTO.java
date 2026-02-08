package com.securacore.app.dto.QRVisitor;

public class QRVisitorResponseDTO {
    private int visitorId;
    private String qrCode;
    private String message;
    private boolean success;

    public QRVisitorResponseDTO(int visitorId, String qrCode, String message, boolean success) {
        this.visitorId = visitorId;
        this.qrCode = qrCode;
        this.message = message;
        this.success = success;
    }

    public int getVisitorId() {
        return visitorId;
    }

    public void setVisitorId(int visitorId) {
        this.visitorId = visitorId;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
