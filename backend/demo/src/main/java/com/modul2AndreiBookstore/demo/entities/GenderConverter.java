package com.modul2AndreiBookstore.demo.entities;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class GenderConverter implements AttributeConverter<Gender, String> {

    @Override
    public String convertToDatabaseColumn(Gender gender) {
        if (gender == null) {
            return null;
        }
        // Store enum name in uppercase, consistent with the enum definition
        return gender.name();
    }

    @Override
    public Gender convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return null;
        }
        
        String normalizedDbData = dbData.trim().toUpperCase();
        System.out.println("Converting gender from DB: '" + dbData + "' to normalized: '" + normalizedDbData + "'");
        
        try {
            return Gender.valueOf(normalizedDbData);
        } catch (IllegalArgumentException e) {
            System.err.println("Failed to convert gender value: '" + dbData + "' (normalized: '" + normalizedDbData + "')");
            e.printStackTrace();
            return null;
        }
    }
} 