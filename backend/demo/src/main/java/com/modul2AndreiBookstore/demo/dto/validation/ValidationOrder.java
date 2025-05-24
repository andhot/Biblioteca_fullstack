package com.modul2AndreiBookstore.demo.dto.validation;

import jakarta.validation.GroupSequence;

@GroupSequence({BasicValidation.class, AdvancedValidation.class})
public interface ValidationOrder {
}
