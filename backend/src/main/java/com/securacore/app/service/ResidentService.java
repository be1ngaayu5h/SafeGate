package com.securacore.app.service;

import com.securacore.app.dto.Resident.CreateResidentDTO;
import com.securacore.app.dto.Resident.ResidentResponseDTO;
import com.securacore.app.dto.Visitor.RequestVisitDTO;
import com.securacore.app.dto.Visitor.RequestVisitStatusDTO;
import com.securacore.app.dto.guard.GuardResponseDTO;
import com.securacore.app.entity.Guard;
import com.securacore.app.entity.Resident;
import com.securacore.app.entity.Visitor;
import com.securacore.app.enums.VisitStatus;
import com.securacore.app.repository.ResidentRepository;
import com.securacore.app.repository.VisitorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ResidentService {
    @Autowired
    ResidentRepository residentRepository;

    @Autowired
    VisitorRepository visitorRepository;

    public String addResident(CreateResidentDTO resident){
        Resident resident1 = new Resident();
        resident1.setName(resident.getName());
        resident1.setEmail(resident.getEmail());
        resident1.setContact(resident.getContact());
        resident1.setPassword(resident.getPassword());
        resident1.setFlatNo(resident.getFlatNo());
        resident1.setEmergencyContact(resident.getEmergencyContact());

       Resident result = residentRepository.save(resident1);
       return "Resident Added Successfully";
    }

    public List<ResidentResponseDTO> getResidents(){
        List<Resident> residents =  residentRepository.findAll();

        List<ResidentResponseDTO> allResidents = new ArrayList<>();
        for (Resident resident : residents) {
            ResidentResponseDTO dto = new ResidentResponseDTO(
                    resident.getId(),
                    resident.getName(),
                    resident.getFlatNo(),
                    resident.getEmail(),
                    resident.getContact(),
                    resident.getEmergencyContact(),
                    resident.getStatus()
            );
            allResidents.add(dto);
        }

        return allResidents;
    }

    public List<ResidentResponseDTO> searchResidents(String searchTerm) {
        List<Resident> residents;
        
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            residents = residentRepository.findAll();
        } else {
            residents = residentRepository.findByNameContainingIgnoreCaseOrFlatNoContainingIgnoreCaseOrEmailContainingIgnoreCaseOrContactContaining(
                searchTerm, searchTerm, searchTerm, searchTerm);
        }

        List<ResidentResponseDTO> searchResults = new ArrayList<>();
        for (Resident resident : residents) {
            ResidentResponseDTO dto = new ResidentResponseDTO(
                    resident.getId(),
                    resident.getName(),
                    resident.getFlatNo(),
                    resident.getEmail(),
                    resident.getContact(),
                    resident.getEmergencyContact(),
                    resident.getStatus()
            );
            searchResults.add(dto);
        }

        return searchResults;
    }

    public ResidentResponseDTO getResidentById(int id) {
        Resident resident = residentRepository.findById(id).orElse(null);
        if (resident != null) {
            return new ResidentResponseDTO(
                    resident.getId(),
                    resident.getName(),
                    resident.getFlatNo(),
                    resident.getEmail(),
                    resident.getContact(),
                    resident.getEmergencyContact(),
                    resident.getStatus()
            );
        }
        return null;
    }

    public String updateResident(int id, CreateResidentDTO residentDTO) {
        Resident resident = residentRepository.findById(id).orElse(null);
        if (resident != null) {
            resident.setName(residentDTO.getName());
            resident.setEmail(residentDTO.getEmail());
            resident.setContact(residentDTO.getContact());
            resident.setFlatNo(residentDTO.getFlatNo());
            resident.setEmergencyContact(residentDTO.getEmergencyContact());
            residentRepository.save(resident);
            return "Resident Updated Successfully";
        }
        return "Resident Not Found";
    }

    public List<RequestVisitStatusDTO> getPendingVisitorRequests(String flatNo) {
        List<Visitor> visitors = visitorRepository.findAllByFlatNo(flatNo);
        List<RequestVisitStatusDTO> pending = new ArrayList<>();
        for (Visitor visitor : visitors) {
            if (visitor.getStatus() == VisitStatus.PENDING &&
                (visitor.getVisitDate() == null || visitor.getVisitDate().equals(LocalDate.now()))) {
                RequestVisitStatusDTO dto = new RequestVisitStatusDTO();
                dto.setId(visitor.getId());
                dto.setName(visitor.getName());
                dto.setFlatNo(visitor.getFlatNo());
                dto.setRelation(visitor.getRelation());
                dto.setPurpose(visitor.getPurpose());
                dto.setCheckInTime(visitor.getCheckInTime());
                dto.setStatus(visitor.getStatus());
                pending.add(dto);
            }
        }
        return pending;
    }

    public List<RequestVisitStatusDTO> getTodayVisits(String flatNo) {
        List<Visitor> visitors = visitorRepository.findAllByFlatNo(flatNo);
        List<RequestVisitStatusDTO> result = new ArrayList<>();
        for (Visitor visitor : visitors) {
            if (visitor.getVisitDate() != null && visitor.getVisitDate().equals(LocalDate.now())) {
                RequestVisitStatusDTO dto = new RequestVisitStatusDTO();
                dto.setId(visitor.getId());
                dto.setName(visitor.getName());
                dto.setFlatNo(visitor.getFlatNo());
                dto.setRelation(visitor.getRelation());
                dto.setPurpose(visitor.getPurpose());
                dto.setCheckInTime(visitor.getCheckInTime());
                dto.setStatus(visitor.getStatus());
                result.add(dto);
            }
        }
        return result;
    }

    public String approveVisit(int visitorId) {
        Visitor visitor = visitorRepository.findById(visitorId).orElse(null);
        if (visitor == null) return "Visitor Not Found";
        visitor.setStatus(VisitStatus.APPROVED);
        if (visitor.getVisitDate() == null) {
            visitor.setVisitDate(LocalDate.now());
        }
        visitorRepository.save(visitor);
        return "Visit Approved";
    }

    public String declineVisit(int visitorId) {
        Visitor visitor = visitorRepository.findById(visitorId).orElse(null);
        if (visitor == null) return "Visitor Not Found";
        visitor.setStatus(VisitStatus.DECLINED);
        visitorRepository.save(visitor);
        return "Visit Declined";
    }

    public String scheduleVisit(RequestVisitDTO request) {
        Visitor visitor = new Visitor();
        visitor.setName(request.getName());
        visitor.setFlatNo(request.getFlatNo());
        visitor.setRelation(request.getRelation());
        visitor.setPurpose(request.getPurpose());
        visitor.setVisitDate(LocalDate.now());
        visitor.setStatus(VisitStatus.APPROVED);
        visitor.setCheckInTime(null);
        visitor.setCheckOutTime(null);
        visitor.setCreatedByResident(true);
        visitorRepository.save(visitor);
        return "Visit Scheduled";
    }

    public List<RequestVisitStatusDTO> getResidentScheduledVisits(String flatNo, LocalDate date) {
        List<Visitor> visitors;
        if (date != null) visitors = visitorRepository.findAllByFlatNoAndVisitDate(flatNo, date);
        else visitors = visitorRepository.findAllByFlatNo(flatNo);

        List<RequestVisitStatusDTO> result = new ArrayList<>();
        for (Visitor visitor : visitors) {
            if (Boolean.TRUE.equals(visitor.getCreatedByResident())) {
                RequestVisitStatusDTO dto = new RequestVisitStatusDTO();
                dto.setId(visitor.getId());
                dto.setName(visitor.getName());
                dto.setFlatNo(visitor.getFlatNo());
                dto.setRelation(visitor.getRelation());
                dto.setPurpose(visitor.getPurpose());
                dto.setCheckInTime(visitor.getCheckInTime());
                dto.setStatus(visitor.getStatus());
                result.add(dto);
            }
        }
        return result;
    }

    public List<RequestVisitStatusDTO> getPendingApprovalsForFlat(String flatNo) {
        List<Visitor> pending = visitorRepository.findAllByFlatNoAndStatus(flatNo, VisitStatus.PENDING);
        List<RequestVisitStatusDTO> result = new ArrayList<>();
        for (Visitor visitor : pending) {
            RequestVisitStatusDTO dto = new RequestVisitStatusDTO();
            dto.setId(visitor.getId());
            dto.setName(visitor.getName());
            dto.setFlatNo(visitor.getFlatNo());
            dto.setRelation(visitor.getRelation());
            dto.setPurpose(visitor.getPurpose());
            dto.setCheckInTime(visitor.getCheckInTime());
            dto.setStatus(visitor.getStatus());
            result.add(dto);
        }
        return result;
    }
}
