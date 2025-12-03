package com.ayosnow.backend.repository;

import com.ayosnow.backend.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobTypeRepository extends JpaRepository<JobType, Long> {
}