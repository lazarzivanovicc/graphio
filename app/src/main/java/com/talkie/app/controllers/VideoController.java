package com.talkie.app.controllers;

import com.talkie.app.domain.dtos.AiResponseDto;
import com.talkie.app.domain.dtos.QuestionDto;
import com.talkie.app.domain.dtos.StatusDto;
import com.talkie.app.domain.dtos.VideoDto;
import com.talkie.app.domain.entities.Video;
import com.talkie.app.services.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/videos")
public class VideoController {
    private final VideoService videoService;

    // This will receive DTO and will map it to a class in service
    @PostMapping
    public ResponseEntity<Video> createVideo(@RequestBody VideoDto request) {
        return ResponseEntity.ok(videoService.createVideo(request));
    }

    @GetMapping
    public ResponseEntity<HashMap<String, List<Video>>> getVideos() {
        HashMap<String, List<Video>> response = new HashMap<>();
        response.put("videos", videoService.getAllVideos());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVideoById(@PathVariable UUID id) {
        return ResponseEntity.ok(videoService.getVideoById(id));
    }

    // Change this so it receive just status through query params or something similar
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateVideoStatus(@PathVariable UUID id, @RequestBody StatusDto request) {
        return ResponseEntity.ok(videoService.updateStatusSingleVideo(id, request));
    }

    @PostMapping("/{id}")
    public ResponseEntity<AiResponseDto> askVideoRelatedQuestion(@PathVariable UUID id, @RequestBody QuestionDto question) {
        return ResponseEntity.ok(videoService.askQuestion(id, question));
    }
}
