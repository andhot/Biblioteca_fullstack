package com.modul2AndreiBookstore.demo.mapper;
import com.modul2AndreiBookstore.demo.dto.ExemplaryDTO;
import com.modul2AndreiBookstore.demo.entities.*;
import java.util.List;

public class ExemplaryMapper {
    public static Exemplary exemplaryDTO2Exemplary(ExemplaryDTO exemplaryDTO) {
        Exemplary exemplary = new Exemplary();
        exemplary.setPublisher(exemplaryDTO.getPublisher());
        exemplary.setMaxBorrowDays(exemplaryDTO.getMaxBorrowDays());
        return exemplary;
    }

    public static ExemplaryDTO exemplary2ExemplaryDTO(Exemplary exemplary) {
        ExemplaryDTO exemplaryDTO = new ExemplaryDTO();
        exemplaryDTO.setId(exemplary.getId());
        exemplaryDTO.setPublisher(exemplary.getPublisher());
        exemplaryDTO.setMaxBorrowDays(exemplary.getMaxBorrowDays());
        return exemplaryDTO;
    }

    public static List<ExemplaryDTO> exemplaryListToDTOList(List<Exemplary> exemplaries) {
        return exemplaries.stream()
                .map(ExemplaryMapper::exemplary2ExemplaryDTO)
                .toList();
    }
}