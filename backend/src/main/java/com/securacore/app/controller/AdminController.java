package com.securacore.app.controller;

import com.securacore.app.dto.Resident.CreateResidentDTO;
import com.securacore.app.dto.Resident.ResidentResponseDTO;
import com.securacore.app.dto.Visitor.VisitorResponseDTO;
import com.securacore.app.dto.guard.CreateGuardDTO;
import com.securacore.app.dto.guard.GuardResponseDTO;
import com.securacore.app.entity.Visitor;
import com.securacore.app.entity.GuardAttendance;
import com.securacore.app.service.GuardService;
import com.securacore.app.service.ResidentService;
import com.securacore.app.service.VisitorService;
import com.securacore.app.repository.GuardAttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("admin")
public class AdminController {

    @Autowired
    ResidentService residentService;

    @Autowired
    GuardService guardService;

    @Autowired
    VisitorService visitorService;

    @Autowired
    GuardAttendanceRepository guardAttendanceRepository;

    @PostMapping("/add-resident")
    public String addResident(@RequestBody CreateResidentDTO resident){
        System.out.println(resident);
        return residentService.addResident(resident);
    }

    @GetMapping("/get-residents")
    public List<ResidentResponseDTO> getResidents(){
        return residentService.getResidents();
    }

    @PostMapping("/add-guard")
    public String addGuard(@RequestBody CreateGuardDTO guard){
        return guardService.addGuard(guard);
    }

    @GetMapping("/get-guards")
    public List<GuardResponseDTO> getGuards(){
        return guardService.getGuards();
    }

    @GetMapping("/guard/on")
    public List<GuardResponseDTO> guardFrom(@RequestParam("start") Date startDate){
        return guardService.guardsOn(startDate);
    }

    @GetMapping("/visitors/on")
    public List<VisitorResponseDTO> visitorsFrom(@RequestParam("start") LocalDate startDate){
        return visitorService.visitorsOn(startDate) ;
    }

    @GetMapping("/active-visitors")
    public List<VisitorResponseDTO> visitors(){
        return visitorService.visitorsOn(LocalDate.now());
    }

    @GetMapping("/flat-visitor/{flat}")
    public List<Visitor> flatVisitor(@PathVariable String flat){
        return visitorService.flatVisitors(flat);
    }

    @GetMapping("/search-residents")
    public List<ResidentResponseDTO> searchResidents(@RequestParam(value = "search", required = false) String searchTerm){
        return residentService.searchResidents(searchTerm);
    }

    @GetMapping("/resident/{id}")
    public ResidentResponseDTO getResident(@PathVariable int id){
        return residentService.getResidentById(id);
    }

    @PutMapping("/update-resident/{id}")
    public String updateResident(@PathVariable int id, @RequestBody CreateResidentDTO resident){
        return residentService.updateResident(id, resident);
    }

    @GetMapping("/search-guards")
    public List<GuardResponseDTO> searchGuards(@RequestParam(value = "search", required = false) String searchTerm){
        return guardService.searchGuards(searchTerm);
    }

    @GetMapping("/guard/{id}")
    public GuardResponseDTO getGuard(@PathVariable int id){
        return guardService.getGuardById(id);
    }

    @PutMapping("/update-guard/{id}")
    public String updateGuard(@PathVariable int id, @RequestBody CreateGuardDTO guard){
        return guardService.updateGuard(id, guard);
    }

    @GetMapping("/guards-by-date")
    public List<GuardResponseDTO> getGuardsByDate(@RequestParam("date") String date){
        return guardService.getGuardsByDate(date);
    }

    @GetMapping("/guard-attendance")
    public List<GuardAttendance> getGuardAttendance(@RequestParam("date") LocalDate date) {
        return guardAttendanceRepository.findAllByAttendanceDate(date);
    }

}
