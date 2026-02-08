package com.securacore.app.dto.Resident;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class ResidentResponseDTO {
    private int id;
    private String name;
    private String email;
    private String flatNo;
    private String contact;
    private String emergencyContact;
    private boolean status;

    public ResidentResponseDTO(int id, String name, String flatNo, String email, String contact, String emergencyContact, boolean status) {
        this.id = id;
        this.name = name;
        this.flatNo = flatNo;
        this.email = email;
        this.contact = contact;
        this.emergencyContact = emergencyContact;
        this.status = status;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public String getFlatNo() {
        return flatNo;
    }

    public void setFlatNo(String flatNo) {
        this.flatNo = flatNo;
    }
}
