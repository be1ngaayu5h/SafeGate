package com.securacore.app.service;

import com.securacore.app.dto.Visitor.VisitorResponseDTO;
import com.securacore.app.entity.Visitor;
import com.securacore.app.enums.VisitStatus;
import com.securacore.app.repository.VisitorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class VisitorService {
    @Autowired
    VisitorRepository visitorRepository;
    public List<Visitor> getVisitors(){
        return visitorRepository.findAll();
    }
    public List<Visitor> flatVisitors(String flat){
        return visitorRepository.findAllByFlatNo(flat);
    }
    public List<VisitorResponseDTO> visitorsOn(LocalDate startDate){
        List<Visitor> visitors = visitorRepository.findAllByVisitDate(startDate);

        List<VisitorResponseDTO> allVisitors = new ArrayList<>();

        for(Visitor visitor : visitors){
            VisitorResponseDTO dto = new VisitorResponseDTO();
            dto.setId(visitor.getId());
            dto.setName(visitor.getName());
            dto.setFlatNo(visitor.getFlatNo());
            dto.setRelation(visitor.getRelation());
            dto.setPurpose(visitor.getPurpose());
            dto.setCheckInTime(visitor.getCheckInTime());
            dto.setCheckOutTime(visitor.getCheckOutTime());
            dto.setStatus(visitor.getStatus());
        allVisitors.add(dto);
        }
        return allVisitors;
    }
}
