package com.securacore.app.controller;

import com.securacore.app.dto.QRVisitor.QRVisitorRequestDTO;
import com.securacore.app.dto.QRVisitor.QRVisitorResponseDTO;
import com.securacore.app.dto.QRVisitor.QRVisitorValidationDTO;
import com.securacore.app.service.QRVisitorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("qr-visitor")
@CrossOrigin(origins = "*")
public class QRVisitorController {

    @Autowired
    private QRVisitorService qrVisitorService;

    @PostMapping("/create")
    public QRVisitorResponseDTO createQRVisitor(@RequestBody QRVisitorRequestDTO request) {
        return qrVisitorService.createQRVisitor(request);
    }

    @PostMapping("/validate")
    public QRVisitorValidationDTO validateQRVisitor(@RequestBody Map<String, Object> qrData) {
        return qrVisitorService.validateQRVisitor(qrData);
    }

    @PostMapping("/checkin/{visitorId}")
    public String checkinQRVisitor(@PathVariable int visitorId) {
        return qrVisitorService.checkinQRVisitor(visitorId);
    }

    @PostMapping("/checkout/{visitorId}")
    public String checkoutQRVisitor(@PathVariable int visitorId) {
        return qrVisitorService.checkoutQRVisitor(visitorId);
    }

    @GetMapping("/history")
    public List<Map<String, Object>> getAllQRVisitors() {
        return qrVisitorService.getAllQRVisitors();
    }

    @GetMapping("/history/{flatNo}")
    public List<Map<String, Object>> getQRVisitorsByFlat(@PathVariable String flatNo) {
        return qrVisitorService.getQRVisitorsByFlat(flatNo);
    }

    @GetMapping("/history/date/{date}")
    public List<Map<String, Object>> getQRVisitorsByDate(@PathVariable String date) {
        LocalDate visitDate = LocalDate.parse(date);
        return qrVisitorService.getQRVisitorsByDate(visitDate);
    }

    @GetMapping("/history/flat/{flatNo}/date/{date}")
    public List<Map<String, Object>> getQRVisitorsByFlatAndDate(@PathVariable String flatNo, @PathVariable String date) {
        LocalDate visitDate = LocalDate.parse(date);
        return qrVisitorService.getQRVisitorsByFlatAndDate(flatNo, visitDate);
    }
}
