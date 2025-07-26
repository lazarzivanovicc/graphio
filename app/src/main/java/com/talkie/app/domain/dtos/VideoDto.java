package com.talkie.app.domain.dtos;

import com.talkie.app.domain.entities.GraphExistenceStatus;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class VideoDto {
    private UUID id;
    private String title;
    private String description;
    private String url;
    private GraphExistenceStatus status;
}
