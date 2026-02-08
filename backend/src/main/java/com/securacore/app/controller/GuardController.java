package com.securacore.app.controller;

import com.securacore.app.dto.Visitor.RequestVisitDTO;
import com.securacore.app.dto.Visitor.RequestVisitStatusDTO;
import com.securacore.app.service.GuardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("guard")
public class GuardController {

    @Autowired
    GuardService guardService;

    @PostMapping("/request-visit")
    public String visitorRequest(@RequestBody RequestVisitDTO visitor){
        return guardService.visitorRequest(visitor);
    }
    @GetMapping("/request-visit-status")
    public List<RequestVisitStatusDTO> visitorRequestStatus(){
        return guardService.visitorRequestStatus();
    }

    @GetMapping("/validate-visit")
    public boolean validateVisit(@RequestParam("visitorId") int visitorId){
        return guardService.validateVisit(visitorId);
    }

    @PostMapping("/package-checkout")
    public String packageCheckout(@RequestBody Map<String, String> body){
        return "Package details added successfully!";
    }

    // Guards can only check in visitors, not check them out or update their status
    // Approval/denial and checkout are the resident's responsibility

    @PostMapping("/visitor/{id}/checkin")
    public String checkinVisitor(@PathVariable("id") int visitorId) {
        return guardService.checkinVisitor(visitorId);
    }

    @PostMapping("/checkin/{guardId}")
    public String guardCheckIn(@PathVariable int guardId) {
        return guardService.guardCheckIn(guardId);
    }

    @PostMapping("/checkout/{guardId}")
    public String guardCheckOut(@PathVariable int guardId) {
        return guardService.guardCheckOut(guardId);
    }
}
