package com.modul2AndreiBookstore.demo.controller;

import com.modul2AndreiBookstore.demo.service.LibraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import com.modul2AndreiBookstore.demo.dto.LibraryDTO;
import com.modul2AndreiBookstore.demo.mapper.LibraryMapper;
import com.modul2AndreiBookstore.demo.repository.LibraryRepository.LibraryNameOnly;

import java.util.List;
import java.util.stream.Collectors;

@RestController()
@RequestMapping("/libraries")
public class LibraryController {
    @Autowired
    private LibraryService libraryService;

    @GetMapping()
    public ResponseEntity<List<LibraryDTO>> getAllLibraries() {
        List<LibraryNameOnly> librariesProjection = libraryService.findAllProjected();
        List<LibraryDTO> libraryDTOs = librariesProjection.stream()
                .map(projection -> {
                    LibraryDTO dto = new LibraryDTO();
                    dto.setId(projection.getId());
                    dto.setName(projection.getName());
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(libraryDTOs);
    }
}
