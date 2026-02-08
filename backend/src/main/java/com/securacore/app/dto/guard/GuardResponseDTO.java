package com.securacore.app.dto.guard;

import com.securacore.app.enums.Shift;

import java.util.Date;

public class GuardResponseDTO {
    private int id;
    private String name;
    private String email;
    private String contact;
    private Shift shift;
    private Date checkInTime;
    private Date checkOutTime;

    public GuardResponseDTO(int id, String name, String email, String contact, Shift shift, Date checkInTime, Date checkOutTime) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.contact = contact;
        this.shift = shift;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
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

    public Date getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(Date checkInTime) {
        this.checkInTime = checkInTime;
    }

    public Shift getShift() {
        return shift;
    }

    public void setShift(Shift shift) {
        this.shift = shift;
    }

    public Date getCheckOutTime() {
        return checkOutTime;
    }

    public void setCheckOutTime(Date checkOutTime) {
        this.checkOutTime = checkOutTime;
    }
}
