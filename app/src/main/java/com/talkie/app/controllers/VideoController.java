package com.talkie.app.controllers;

import com.talkie.app.domain.dtos.AiResponseDto;
import com.talkie.app.domain.dtos.QuestionDto;
import com.talkie.app.domain.dtos.StatusDto;
import com.talkie.app.domain.dtos.VideoDto;
import com.talkie.app.services.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/videos")
public class VideoController {
    private final VideoService videoService;

    @PostMapping
    public ResponseEntity<VideoDto> createVideo(@RequestBody VideoDto request) {
        return ResponseEntity.ok(videoService.createVideo(request));
    }

    @GetMapping
    public ResponseEntity<Page<VideoDto>> getVideos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "true") boolean ascending
    ) {
        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(videoService.getAllVideos(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VideoDto> getVideoById(@PathVariable UUID id) {
        return ResponseEntity.ok(videoService.getVideoById(id));
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<VideoDto> updateVideoStatus(@PathVariable UUID id, @RequestBody StatusDto request) {
        return ResponseEntity.ok(videoService.updateStatusSingleVideo(id, request));
    }

    @PostMapping("/{id}")
    public ResponseEntity<AiResponseDto> askVideoRelatedQuestion(@PathVariable UUID id, @RequestBody QuestionDto question) {
        return ResponseEntity.ok(videoService.askQuestion(id, question));
    }
}
