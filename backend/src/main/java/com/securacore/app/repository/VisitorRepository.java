package com.securacore.app.repository;

import com.securacore.app.entity.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

public interface VisitorRepository extends JpaRepository<Visitor, Integer> {
    public List<Visitor> findAllByFlatNo(String flatNo);
    public List<Visitor> findAllByVisitDate(LocalDate visitDate);
    public List<Visitor> findAllByFlatNoAndStatus(String flatNo, com.securacore.app.enums.VisitStatus status);
    public List<Visitor> findAllByFlatNoAndVisitDate(String flatNo, LocalDate visitDate);
}
