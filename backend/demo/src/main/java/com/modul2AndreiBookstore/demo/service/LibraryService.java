package com.modul2AndreiBookstore.demo.service;

import com.modul2AndreiBookstore.demo.repository.LibraryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import com.modul2AndreiBookstore.demo.entities.Library;
import com.modul2AndreiBookstore.demo.repository.LibraryRepository.LibraryNameOnly;

@Service
public class LibraryService {
    @Autowired
    private LibraryRepository libraryRepository;

    public List<Library> findAll() {
        return libraryRepository.findAll();
    }

    public List<LibraryNameOnly> findAllProjected() {
        return libraryRepository.findAllProjectedBy();
    }
}