package com.securacore.app.repository;

import com.securacore.app.entity.Guard;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Date;
import java.util.List;

public interface GuardRepository extends JpaRepository<Guard,Integer> {
    public List<Guard> findAllByCheckInTime(Date checkInTime);
    List<Guard> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrContactContaining(
            String name, String email, String contact);
}
