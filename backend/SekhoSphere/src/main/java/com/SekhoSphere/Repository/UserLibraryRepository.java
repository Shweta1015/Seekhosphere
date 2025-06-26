package com.SekhoSphere.Repository;

import com.SekhoSphere.Model.UserLibrary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserLibraryRepository extends JpaRepository<UserLibrary, Long> {
    List<UserLibrary> findByUserEmail(String email);
    boolean existsByUserEmailAndPlaylistId(String email, String playlistId);
    void deleteByUserEmailAndPlaylistId(String email, String playlistId);
}
