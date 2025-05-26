package com.modul2AndreiBookstore.demo.controller;

import com.modul2AndreiBookstore.demo.dto.StatisticsDTO;
import com.modul2AndreiBookstore.demo.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/statistics")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/global")
    public ResponseEntity<StatisticsDTO> getGlobalStatistics() {
        StatisticsDTO statistics = statisticsService.getGlobalStatistics();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/library/{libraryId}")
    public ResponseEntity<StatisticsDTO> getLibraryStatistics(@PathVariable Long libraryId) {
        StatisticsDTO statistics = statisticsService.getLibraryStatistics(libraryId);
        return ResponseEntity.ok(statistics);
    }
} 