package com.modul2AndreiBookstore.demo.mapper;
import com.modul2AndreiBookstore.demo.dto.ReservationDTO;
import com.modul2AndreiBookstore.demo.dto.ExemplaryDTO;
import com.modul2AndreiBookstore.demo.dto.BookDTO;
import com.modul2AndreiBookstore.demo.entities.*;
import java.util.List;

public class ReservationMapper {
    public static Reservation reservationDTO2Reservation(ReservationDTO reservationDTO) {
        Reservation reservation = new Reservation();
        reservation.setStartDate(reservationDTO.getStartDate());
        reservation.setEndDate(reservationDTO.getEndDate());
        reservation.setReservationStatus(reservationDTO.getReservationStatus());
        if (reservationDTO.getUser() != null) {
            reservation.setUser(UserMapper.userDTO2User((reservationDTO.getUser())));
        }
        if (reservationDTO.getExemplary() != null) {
            reservation.setExemplary(ExemplaryMapper.exemplaryDTO2Exemplary(reservationDTO.getExemplary()));
        }
        return reservation;
    }

    public static ReservationDTO reservation2ReservationDTO(Reservation reservation) {
        ReservationDTO reservationDTO = new ReservationDTO();
        reservationDTO.setId(reservation.getId());
        reservationDTO.setStartDate(reservation.getStartDate());
        reservationDTO.setEndDate(reservation.getEndDate());
        reservationDTO.setReservationStatus(reservation.getReservationStatus());
        if (reservation.getUser() != null) {
            reservationDTO.setUser(UserMapper.user2UserDTO(reservation.getUser()));
        }
        if (reservation.getExemplary() != null) {
            reservationDTO.setExemplary(ExemplaryMapper.exemplary2ExemplaryDTO(reservation.getExemplary()));
        }
        return reservationDTO;
    }

    public static List<ReservationDTO> reservationList2ReservationDTOList(List<Reservation> reservations) {
        return reservations.stream()
                .map(ReservationMapper::reservation2ReservationDTO)
                .toList();
    }

    public static ReservationDTO reservation2ReservationDTOWithDetails(Reservation reservation) {
        ReservationDTO reservationDTO = new ReservationDTO();
        reservationDTO.setId(reservation.getId());
        reservationDTO.setStartDate(reservation.getStartDate());
        reservationDTO.setEndDate(reservation.getEndDate());
        reservationDTO.setReservationStatus(reservation.getReservationStatus());
        
        if (reservation.getUser() != null) {
            reservationDTO.setUser(UserMapper.user2UserDTO(reservation.getUser()));
        }
        
        if (reservation.getExemplary() != null) {
            // Create exemplary DTO with book details
            ExemplaryDTO exemplaryDTO = ExemplaryMapper.exemplary2ExemplaryDTO(reservation.getExemplary());
            
            // Add book details if available
            if (reservation.getExemplary().getBook() != null) {
                BookDTO bookDTO = BookMapper.book2BookDTO(reservation.getExemplary().getBook());
                exemplaryDTO.setBook(bookDTO);
            }
            
            reservationDTO.setExemplary(exemplaryDTO);
        }
        
        return reservationDTO;
    }

    public static List<ReservationDTO> reservationList2ReservationDTOListWithDetails(List<Reservation> reservations) {
        return reservations.stream()
                .map(ReservationMapper::reservation2ReservationDTOWithDetails)
                .toList();
    }
}
