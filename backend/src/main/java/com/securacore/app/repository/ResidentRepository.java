package com.securacore.app.repository;

import com.securacore.app.entity.Resident;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResidentRepository extends JpaRepository<Resident,Integer> {
    List<Resident> findByNameContainingIgnoreCaseOrFlatNoContainingIgnoreCaseOrEmailContainingIgnoreCaseOrContactContaining(
            String name, String flatNo, String email, String contact);
}
