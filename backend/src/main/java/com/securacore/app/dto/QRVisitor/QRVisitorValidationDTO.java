package com.securacore.app.dto.QRVisitor;

import java.util.Map;

public class QRVisitorValidationDTO {
    private boolean valid;
    private String message;
    private Map<String, Object> visitor;

    public QRVisitorValidationDTO(boolean valid, String message, Map<String, Object> visitor) {
        this.valid = valid;
        this.message = message;
        this.visitor = visitor;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Map<String, Object> getVisitor() {
        return visitor;
    }

    public void setVisitor(Map<String, Object> visitor) {
        this.visitor = visitor;
    }
}
