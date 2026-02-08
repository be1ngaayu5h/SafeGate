package com.securacore.app.repository;

import com.securacore.app.entity.QRVisitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface QRVisitorRepository extends JpaRepository<QRVisitor, Integer> {
    
    List<QRVisitor> findByFlatNo(String flatNo);
    
    List<QRVisitor> findByVisitDate(LocalDate visitDate);
    
    List<QRVisitor> findByFlatNoAndVisitDate(String flatNo, LocalDate visitDate);
    
    List<QRVisitor> findByStatus(String status);
    
    Optional<QRVisitor> findByQrCode(String qrCode);
    
    List<QRVisitor> findByCreatedByResidentTrue();
}
