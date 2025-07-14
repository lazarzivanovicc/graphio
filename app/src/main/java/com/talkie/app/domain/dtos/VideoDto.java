package com.talkie.app.domain.dtos;

import com.talkie.app.domain.entities.GraphExistenceStatus;
import lombok.Data;

@Data
public class VideoDto {
    private String title;
    private String description;
    private String url;
    private GraphExistenceStatus status;
}
