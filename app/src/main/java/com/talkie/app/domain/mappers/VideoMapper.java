package com.talkie.app.domain.mappers;

import com.talkie.app.domain.dtos.VideoDto;
import com.talkie.app.domain.entities.Video;

public class VideoMapper {

    public static Video toEntity(VideoDto request) {
        if (request == null) {
            return null;
        }

        return Video.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .url(request.getUrl())
                .status(request.getStatus())
                .build();
    }

    public static VideoDto toDto(Video request) {
        if (request == null) {
            return null;
        }

        return VideoDto.builder()
                .id(request.getId())
                .title(request.getTitle())
                .description(request.getDescription())
                .url(request.getUrl())
                .status(request.getStatus())
                .build();
    }

}
