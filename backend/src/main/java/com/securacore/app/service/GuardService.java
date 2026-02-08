package com.securacore.app.service;

import com.securacore.app.dto.Visitor.RequestVisitDTO;
import com.securacore.app.dto.Visitor.RequestVisitStatusDTO;
import com.securacore.app.dto.guard.CreateGuardDTO;
import com.securacore.app.dto.guard.GuardResponseDTO;
import com.securacore.app.entity.Guard;
import com.securacore.app.entity.Visitor;
import com.securacore.app.enums.Shift;
import com.securacore.app.enums.VisitStatus;
import com.securacore.app.repository.GuardRepository;
import com.securacore.app.repository.VisitorRepository;
import com.securacore.app.entity.GuardAttendance;
import com.securacore.app.repository.GuardAttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class GuardService {
    @Autowired
    GuardRepository guardRepository;

    @Autowired
    VisitorRepository visitorRepository;

    @Autowired
    GuardAttendanceRepository guardAttendanceRepository;

    public String addGuard(CreateGuardDTO guardDto){
        Guard guard = new Guard();

        guard.setName(guardDto.getName());
        guard.setEmail(guardDto.getEmail());
        guard.setContact(guardDto.getContact());
        guard.setPassword(guardDto.getPassword());
        guard.setShift(guardDto.getShift());

        Guard result = guardRepository.save(guard);
        return "Guard Added Successfully";
    }

    public List<GuardResponseDTO> getGuards(){
        List<Guard> guards =  guardRepository.findAll();

        List<GuardResponseDTO> allGuards = new ArrayList<>();
        for (Guard guard : guards) {
            GuardResponseDTO dto = new GuardResponseDTO(
                    guard.getId(),
                    guard.getName(),
                    guard.getEmail(),
                    guard.getContact(),
                    guard.getShift(),
                    guard.getCheckInTime(),
                    guard.getCheckOutTime()
            );
            allGuards.add(dto);
        }

        return allGuards;

    }

    public List<GuardResponseDTO> guardsOn(Date startDate){
        List<Guard> guards =  guardRepository.findAllByCheckInTime(startDate);

        List<GuardResponseDTO> allGuards = new ArrayList<>();
        for (Guard guard : guards) {
            GuardResponseDTO dto = new GuardResponseDTO(
                    guard.getId(),
                    guard.getName(),
                    guard.getEmail(),
                    guard.getContact(),
                    guard.getShift(),
                    guard.getCheckInTime(),
                    guard.getCheckOutTime()
            );
            allGuards.add(dto);
        }

        return allGuards;
    }

    public List<GuardResponseDTO> searchGuards(String searchTerm) {
        List<Guard> guards;
        
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            guards = guardRepository.findAll();
        } else {
            guards = guardRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrContactContaining(
                searchTerm, searchTerm, searchTerm);
        }

        List<GuardResponseDTO> searchResults = new ArrayList<>();
        for (Guard guard : guards) {
            GuardResponseDTO dto = new GuardResponseDTO(
                    guard.getId(),
                    guard.getName(),
                    guard.getEmail(),
                    guard.getContact(),
                    guard.getShift(),
                    guard.getCheckInTime(),
                    guard.getCheckOutTime()
            );
            searchResults.add(dto);
        }

        return searchResults;
    }

    public GuardResponseDTO getGuardById(int id) {
        Guard guard = guardRepository.findById(id).orElse(null);
        if (guard != null) {
            return new GuardResponseDTO(
                    guard.getId(),
                    guard.getName(),
                    guard.getEmail(),
                    guard.getContact(),
                    guard.getShift(),
                    guard.getCheckInTime(),
                    guard.getCheckOutTime()
            );
        }
        return null;
    }

    public String updateGuard(int id, CreateGuardDTO guardDTO) {
        Guard guard = guardRepository.findById(id).orElse(null);
        if (guard != null) {
            guard.setName(guardDTO.getName());
            guard.setEmail(guardDTO.getEmail());
            guard.setContact(guardDTO.getContact());
            guard.setShift(guardDTO.getShift());
            guardRepository.save(guard);
            return "Guard Updated Successfully";
        }
        return "Guard Not Found";
    }

    public List<GuardResponseDTO> getGuardsByDate(String dateStr) {
        try {
            // Parse the date string to LocalDate and then convert to Date for database query
            LocalDate localDate = LocalDate.parse(dateStr);
            Date date = java.sql.Date.valueOf(localDate);
            
            List<Guard> guards = guardRepository.findAllByCheckInTime(date);
            
            List<GuardResponseDTO> guardsByDate = new ArrayList<>();
            for (Guard guard : guards) {
                GuardResponseDTO dto = new GuardResponseDTO(
                        guard.getId(),
                        guard.getName(),
                        guard.getEmail(),
                        guard.getContact(),
                        guard.getShift(),
                        guard.getCheckInTime(),
                        guard.getCheckOutTime()
                );
                guardsByDate.add(dto);
            }
            
            return guardsByDate;
        } catch (Exception e) {
            // If date parsing fails, return empty list
            return new ArrayList<>();
        }
    }

    public String visitorRequest(RequestVisitDTO visitor){
        Visitor visitor1 = new Visitor();
        visitor1.setName(visitor.getName());
        visitor1.setFlatNo(visitor.getFlatNo());
        visitor1.setRelation(visitor.getRelation());
        visitor1.setPurpose(visitor.getPurpose());
        visitor1.setVisitDate(LocalDate.now());
        visitor1.setCheckInTime(LocalDateTime.now());
        visitor1.setStatus(VisitStatus.PENDING);
        visitorRepository.save(visitor1);
        return "Schedule Visit Success";
    }

    private int id;
    private String name;
    private String flatNo;
    private String relation;
    private String purpose;
    private LocalDateTime checkInTime;
    private VisitStatus status;

    public List<RequestVisitStatusDTO> visitorRequestStatus(){
        List<Visitor> visitors = visitorRepository.findAllByVisitDate(LocalDate.now());

        List<RequestVisitStatusDTO> allVisitors = new ArrayList<>();

        for(Visitor visitor : visitors){
            RequestVisitStatusDTO dto = new RequestVisitStatusDTO();
            dto.setId(visitor.getId());
            dto.setName(visitor.getName());
            dto.setFlatNo(visitor.getFlatNo());
            dto.setRelation(visitor.getRelation());
            dto.setPurpose(visitor.getPurpose());
            dto.setCheckInTime(visitor.getCheckInTime());
            dto.setStatus(visitor.getStatus());

            allVisitors.add(dto);
        }

        return allVisitors;
    }

    public boolean validateVisit(int visitorId) {
        Visitor visitor = visitorRepository.findById(visitorId).orElse(null);
        if (visitor == null) return false;
        if (visitor.getStatus() != VisitStatus.APPROVED) return false;
        if (visitor.getVisitDate() != null && !visitor.getVisitDate().equals(LocalDate.now())) return false;
        if (visitor.getCheckInTime() == null) {
            visitor.setCheckInTime(LocalDateTime.now());
            visitorRepository.save(visitor);
        }
        return true;
    }

    // Guards can only check in visitors, not check them out or update their status
    // Approval/denial and checkout are the resident's responsibility

    public String checkinVisitor(int visitorId) {
        Visitor visitor = visitorRepository.findById(visitorId).orElse(null);
        if (visitor == null) return "Visitor Not Found";
        if (visitor.getStatus() != VisitStatus.APPROVED) return "Visitor not approved";
        if (visitor.getCheckInTime() != null) return "Visitor already checked in";
        
        visitor.setCheckInTime(LocalDateTime.now());
        visitorRepository.save(visitor);
        return "Visitor checked in successfully";
    }

    public String guardCheckIn(int guardId) {
        Guard guard = guardRepository.findById(guardId).orElse(null);
        if (guard == null) return "Guard Not Found";
        LocalDate today = LocalDate.now();
        List<GuardAttendance> todays = guardAttendanceRepository.findAllByGuardAndAttendanceDate(guard, today);
        GuardAttendance attendance = todays.stream().findFirst().orElseGet(() -> {
            GuardAttendance ga = new GuardAttendance();
            ga.setGuard(guard);
            ga.setAttendanceDate(today);
            return ga;
        });
        attendance.setCheckInTime(LocalDateTime.now());
        guardAttendanceRepository.save(attendance);
        return "Guard Checked In";
    }

    public String guardCheckOut(int guardId) {
        Guard guard = guardRepository.findById(guardId).orElse(null);
        if (guard == null) return "Guard Not Found";
        LocalDate today = LocalDate.now();
        List<GuardAttendance> todays = guardAttendanceRepository.findAllByGuardAndAttendanceDate(guard, today);
        GuardAttendance attendance = todays.stream().findFirst().orElseGet(() -> {
            GuardAttendance ga = new GuardAttendance();
            ga.setGuard(guard);
            ga.setAttendanceDate(today);
            return ga;
        });
        attendance.setCheckOutTime(LocalDateTime.now());
        guardAttendanceRepository.save(attendance);
        return "Guard Checked Out";
    }
}
