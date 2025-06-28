package com.modul2AndreiBookstore.demo.repository;

import com.modul2AndreiBookstore.demo.entities.Administrator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdministratorRepository extends JpaRepository<Administrator, Long> {
    Optional<Administrator> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<Administrator> findByEmailAndIsActiveTrue(String email);
} 