package com.modul2AndreiBookstore.demo.controller;

import com.modul2AndreiBookstore.demo.dto.ReservationDTO;
import com.modul2AndreiBookstore.demo.dto.ReservationSearchDTO;
import com.modul2AndreiBookstore.demo.dto.validation.AdvancedValidation;
import com.modul2AndreiBookstore.demo.dto.validation.ValidationOrder;
import com.modul2AndreiBookstore.demo.entities.Reservation;
import com.modul2AndreiBookstore.demo.mapper.ReservationMapper;
import com.modul2AndreiBookstore.demo.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import com.modul2AndreiBookstore.demo.entities.ReservationStatus;

@RestController()
@RequestMapping("/reservations")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
public class ReservationController {
    @Autowired
    private ReservationService reservationService;

    @RequestMapping(value = "/{userId}/{bookId}", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/{bookId}")
    public ResponseEntity<?> create(@PathVariable Long userId,
                                    @PathVariable Long bookId,
                                    @Validated(ValidationOrder.class)
                                    @RequestBody ReservationDTO reservationDTO) {
        Reservation reservationToCreate = ReservationMapper.reservationDTO2Reservation(reservationDTO);
        Reservation createdReservation = reservationService.create(reservationToCreate, userId, bookId);
        return ResponseEntity.ok(ReservationMapper.reservation2ReservationDTO(createdReservation));
    }

    @GetMapping("/library/{libraryId}")
    public ResponseEntity<?> getReservationsForLibraryInInterval(@PathVariable(name = "libraryId") Long libraryId,
                                                                 @RequestParam(required = false) Integer page,
                                                                 @RequestParam(required = false) Integer size,
                                                                 @RequestParam(required = false) String startDate,
                                                                 @RequestParam(required = false) String endDate,
                                                                 @RequestParam(required = false) List<String> reservationStatusList) {
        // Create ReservationSearchDTO from request parameters
        ReservationSearchDTO reservationSearchDTO = new ReservationSearchDTO();
        if (startDate != null) {
            reservationSearchDTO.setStartDate(LocalDate.parse(startDate));
        }
        if (endDate != null) {
            reservationSearchDTO.setEndDate(LocalDate.parse(endDate));
        }
        if (reservationStatusList != null) {
            reservationSearchDTO.setReservationStatusList(reservationStatusList.stream()
                                                                        .map(status -> ReservationStatus.valueOf(status.toUpperCase()))
                                                                        .collect(Collectors.toList()));
        }

        Page<Reservation> reservations = reservationService.getReservationsForLibraryInInterval(libraryId,
                page, size, reservationSearchDTO);
        List<Reservation> reservationList = reservations.getContent();
        return ResponseEntity.ok(ReservationMapper.reservationList2ReservationDTOList(reservationList));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getReservationsForUserByStatus(@PathVariable(name = "userId") Long userId,
                                                            @RequestParam(required = false) Integer page,
                                                            @RequestParam(required = false) Integer size,
                                                            @Validated(AdvancedValidation.class)
                                                            @RequestBody(required = false) ReservationSearchDTO reservationSearchDTO) {
        Page<Reservation> reservations = reservationService.getReservationsForUserByStatus(userId,
                page, size, reservationSearchDTO);
        List<Reservation> reservationList = reservations.getContent();
        return ResponseEntity.ok(ReservationMapper.reservationList2ReservationDTOList(reservationList));
    }

    @PutMapping("/{librarianId}/{reservationId}")
    public ResponseEntity<?> changeStatus(@PathVariable Long librarianId,
                                          @PathVariable Long reservationId,
                                          @RequestBody ReservationDTO updatedReservationDTO) {
        Reservation reservationToUpdate = ReservationMapper.reservationDTO2Reservation(updatedReservationDTO);
        Reservation updatedReservation = reservationService.changeStatus(librarianId,
                reservationId, reservationToUpdate);
        return ResponseEntity.ok(ReservationMapper.reservation2ReservationDTO(updatedReservation));
    }
}