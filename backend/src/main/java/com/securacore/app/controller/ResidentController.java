package com.securacore.app.controller;

import com.securacore.app.dto.Visitor.RequestVisitDTO;
import com.securacore.app.dto.Visitor.RequestVisitStatusDTO;
import com.securacore.app.service.ResidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("resident")
public class ResidentController {

    @Autowired
    ResidentService residentService;

    @GetMapping("/visitor-requests")
    public List<RequestVisitStatusDTO> getVisitorRequests(@RequestParam("flatNo") String flatNo){
        return residentService.getPendingVisitorRequests(flatNo);
    }

    @GetMapping("/today-visits")
    public List<RequestVisitStatusDTO> getTodayVisits(@RequestParam("flatNo") String flatNo){
        return residentService.getTodayVisits(flatNo);
    }

    @PostMapping("/approve-visit/{id}")
    public String approveVisit(@PathVariable int id){
        return residentService.approveVisit(id);
    }

    @PostMapping("/decline-visit/{id}")
    public String declineVisit(@PathVariable int id){
        return residentService.declineVisit(id);
    }

    @PostMapping("/schedule-visit")
    public String scheduleVisit(@RequestBody RequestVisitDTO request){
        return residentService.scheduleVisit(request);
    }

    @GetMapping("/pending-approvals")
    public List<RequestVisitStatusDTO> pendingApprovals(@RequestParam("flatNo") String flatNo) {
        return residentService.getPendingApprovalsForFlat(flatNo);
    }

    @GetMapping("/scheduled-visits")
    public List<RequestVisitStatusDTO> scheduledVisits(
            @RequestParam("flatNo") String flatNo,
            @RequestParam(value = "date", required = false) String date
    ) {
        return residentService.getResidentScheduledVisits(flatNo, date != null ? java.time.LocalDate.parse(date) : null);
    }
}
