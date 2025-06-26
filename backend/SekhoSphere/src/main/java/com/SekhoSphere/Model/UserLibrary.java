package com.SekhoSphere.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserLibrary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userEmail;
    private String playlistId;
    private String playlistTitle;
    private String playlistThumbnail;
    private String subject;

    public UserLibrary(String userEmail, String playlistId, String title, String thumbnail, String subject) {
        this.userEmail = userEmail;
        this.playlistId = playlistId;
        this.playlistTitle = title;
        this.playlistThumbnail = thumbnail;
        this.subject = subject;
    }
}
