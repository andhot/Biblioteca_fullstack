package com.modul2AndreiBookstore.demo.mapper;

import com.modul2AndreiBookstore.demo.dto.UserDTO;
import com.modul2AndreiBookstore.demo.entities.User;
import com.modul2AndreiBookstore.demo.entities.*;
public class UserMapper {
    public static User userDTO2User(UserDTO userDTO) {
        User user = new User();
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setYearOfBirth(userDTO.getYearOfBirth());
        user.setGender(userDTO.getGender());
        user.setEmail(userDTO.getEmail());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setPassword(userDTO.getPassword());
        user.setVerified(userDTO.isVerified());
        user.setVerificationCode(userDTO.getVerificationCode());
        user.setCountry(userDTO.getCountry());
        return user;
    }

    public static UserDTO user2UserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setYearOfBirth(user.getYearOfBirth());
        userDTO.setGender(user.getGender());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setPassword(user.getPassword());
        userDTO.setVerified(user.isVerified());
        userDTO.setVerificationCode(user.getVerificationCode());
        userDTO.setCountry(user.getCountry());
        return userDTO;
    }
}