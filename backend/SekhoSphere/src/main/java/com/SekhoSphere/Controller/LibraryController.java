package com.SekhoSphere.Controller;

import com.SekhoSphere.DTOs.LibraryDTO;
import com.SekhoSphere.Model.UserLibrary;
import com.SekhoSphere.Repository.UserLibraryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/library")
public class LibraryController {

    private LibraryDTO dto;
    @Autowired
    private UserLibraryRepository repository;

    //add playlist to library
    @PostMapping("/add")
    public ResponseEntity<?> addToLibrary(@RequestBody LibraryDTO dto) {
        if (!repository.existsByUserEmailAndPlaylistId(dto.getUserEmail(), dto.getPlaylistId())) {
            UserLibrary lib = new UserLibrary(
                    dto.getUserEmail(),
                    dto.getPlaylistId(),
                    dto.getTitle(),
                    dto.getThumbnail(),
                    dto.getSubject()
            );
            repository.save(lib);
            return ResponseEntity.ok("Playlist added.");
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Already added.");
    }

    //Get User's library
    @GetMapping("/{email}")
    public List<UserLibrary> getUserLibrary(@PathVariable String email){
        return repository.findByUserEmail(email);
    }

    //remove playlist from library
    @Transactional
    @DeleteMapping("/{email}/{playlistId}")
    public ResponseEntity<?> removeFromLibrary(@PathVariable String email, @PathVariable String playlistId) {
        repository.deleteByUserEmailAndPlaylistId(email, playlistId);
        return ResponseEntity.ok("Removed.");
    }
}
