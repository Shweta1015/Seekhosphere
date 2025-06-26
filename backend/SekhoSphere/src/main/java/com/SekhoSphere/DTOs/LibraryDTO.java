package com.SekhoSphere.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LibraryDTO {
    private String userEmail;
    private String playlistId;
    private String title;
    private String thumbnail;
    private String subject;
}
