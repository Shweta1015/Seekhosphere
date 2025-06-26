package com.SekhoSphere.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayListVideo {
    private String videoId;
    private String title;
    private String thumbnailUrl;
}
