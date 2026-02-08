package com.securacore.app.repository;

import com.securacore.app.entity.Guard;
import com.securacore.app.entity.GuardAttendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface GuardAttendanceRepository extends JpaRepository<GuardAttendance, Integer> {
    List<GuardAttendance> findAllByGuardAndAttendanceDate(Guard guard, LocalDate date);
    List<GuardAttendance> findAllByAttendanceDate(LocalDate date);
}


