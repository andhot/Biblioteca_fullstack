package com.modul2AndreiBookstore.demo.mapper;

import com.modul2AndreiBookstore.demo.dto.AdministratorDTO;
import com.modul2AndreiBookstore.demo.entities.Administrator;

import java.time.format.DateTimeFormatter;

public class AdministratorMapper {
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public static Administrator administratorDTO2Administrator(AdministratorDTO administratorDTO) {
        Administrator administrator = new Administrator();
        administrator.setId(administratorDTO.getId());
        administrator.setFirstName(administratorDTO.getFirstName());
        administrator.setLastName(administratorDTO.getLastName());
        administrator.setEmail(administratorDTO.getEmail());
        administrator.setPassword(administratorDTO.getPassword());
        administrator.setVerificationCode(administratorDTO.getVerificationCode());
        administrator.setActive(administratorDTO.isActive());
        return administrator;
    }

    public static AdministratorDTO administrator2AdministratorDTO(Administrator administrator) {
        AdministratorDTO administratorDTO = new AdministratorDTO();
        administratorDTO.setId(administrator.getId());
        administratorDTO.setFirstName(administrator.getFirstName());
        administratorDTO.setLastName(administrator.getLastName());
        administratorDTO.setEmail(administrator.getEmail());
        administratorDTO.setPassword(administrator.getPassword());
        administratorDTO.setVerificationCode(administrator.getVerificationCode());
        administratorDTO.setActive(administrator.isActive());
        
        if (administrator.getCreatedAt() != null) {
            administratorDTO.setCreatedAt(administrator.getCreatedAt().format(formatter));
        }
        
        if (administrator.getLastLogin() != null) {
            administratorDTO.setLastLogin(administrator.getLastLogin().format(formatter));
        }
        
        return administratorDTO;
    }

    public static Administrator administratorDTO2AdministratorWithoutPassword(AdministratorDTO administratorDTO) {
        Administrator administrator = new Administrator();
        administrator.setId(administratorDTO.getId());
        administrator.setFirstName(administratorDTO.getFirstName());
        administrator.setLastName(administratorDTO.getLastName());
        administrator.setEmail(administratorDTO.getEmail());
        administrator.setVerificationCode(administratorDTO.getVerificationCode());
        administrator.setActive(administratorDTO.isActive());
        return administrator;
    }
} 