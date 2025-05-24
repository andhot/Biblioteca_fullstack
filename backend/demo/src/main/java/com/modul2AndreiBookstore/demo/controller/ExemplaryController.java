package com.modul2AndreiBookstore.demo.controller;


import com.modul2AndreiBookstore.demo.dto.ExemplaryDTO;
import com.modul2AndreiBookstore.demo.entities.Exemplary;
import com.modul2AndreiBookstore.demo.mapper.ExemplaryMapper;
import com.modul2AndreiBookstore.demo.service.ExemplaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController()
@RequestMapping("/exemplaries")
public class ExemplaryController {
    @Autowired
    private ExemplaryService exemplaryService;

    @PostMapping("/{bookId}/{nrExemplaries}")
    public ResponseEntity<?> create(@PathVariable(name = "bookId") Long bookId,
                                    @PathVariable(name = "nrExemplaries") Integer nrExemplaries,
                                    @RequestBody ExemplaryDTO exemplaryDTO) {
        Exemplary exemplaryToCreate = ExemplaryMapper.exemplaryDTO2Exemplary(exemplaryDTO);
        List<Exemplary> createdExemplary = exemplaryService.create(bookId, nrExemplaries, exemplaryToCreate);

        return ResponseEntity.ok(ExemplaryMapper.exemplaryListToDTOList(createdExemplary));
    }

    @GetMapping(path = "/{bookId}")
    public ResponseEntity<?> findPaginated(@PathVariable(name = "bookId") Long bookId,
                                           @RequestParam(required = false) Integer page,
                                           @RequestParam(required = false) Integer size) {
        Page<Exemplary> exemplariesPage = exemplaryService
                .findAllPaginated(bookId, page, size);

        List<ExemplaryDTO> exemplaryDTOs = exemplariesPage.stream()
                .map(ExemplaryMapper::exemplary2ExemplaryDTO)
                .toList();

        return ResponseEntity.ok(exemplaryDTOs);
    }

    @PutMapping("update/{exemplaryId}/{maxBorrowDays}")
    public ResponseEntity<?> updateMaxBorrowDays(@PathVariable(name = "exemplaryId") Long exemplaryId,
                                                 @PathVariable(name = "maxBorrowDays") Integer maxBorrowDays) {
        return ResponseEntity.ok(ExemplaryMapper.exemplary2ExemplaryDTO(
                exemplaryService.updateMaxBorrowDays(exemplaryId, maxBorrowDays)));
    }

    @PutMapping("/{exemplaryId}")
    public ResponseEntity<?> removeExemplary(@PathVariable(name = "exemplaryId") Long exemplaryId) {
        exemplaryService.removeExemplary(exemplaryId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{bookId}/{exemplaryId}")
    public ResponseEntity<?> removeExemplaryFromBook(@PathVariable(name = "bookId") Long bookId,
                                                     @PathVariable(name = "exemplaryId") Long exemplaryId) {
        exemplaryService.removeExemplaryFromBook(bookId, exemplaryId);
        return ResponseEntity.noContent().build();
    }
}
