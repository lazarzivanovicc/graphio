package com.talkie.app.services;

import com.talkie.app.domain.dtos.*;
import com.talkie.app.domain.entities.GraphExistenceStatus;
import com.talkie.app.domain.entities.User;
import com.talkie.app.domain.entities.Video;
import com.talkie.app.domain.mappers.VideoMapper;
import com.talkie.app.repositories.VideoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;


import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VideoService {
    @Value("${ai.url}")
    private String aiServiceUrl;
    private final VideoRepository videoRepository;
    private final RestClient restClient;


    public VideoDto createVideo(VideoDto request) {
        Video videoToSave = VideoMapper.toEntity(request);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        videoToSave.setUser(currentUser);
        Video savedVideo = videoRepository.save(videoToSave);
        GraphCreationDto response = addVideoToKnowledgeGraph(savedVideo.getId(), request.getUrl());
        return VideoMapper.toDto(savedVideo);
    }

    public GraphCreationDto addVideoToKnowledgeGraph(UUID id, String videoUrl) {
        HashMap<String, String> request = new HashMap<>();
        request.put("url", videoUrl);
        request.put("id", id.toString());
        ResponseEntity<GraphCreationDto> response = restClient.post()
                .uri(aiServiceUrl + "/videos")
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .toEntity(GraphCreationDto.class);
        return response.getBody();
    }


    public Page<VideoDto> getAllVideos(Pageable pageable) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        Page<Video> videos = videoRepository.findAllByUser(currentUser, pageable);
        return videos.map(VideoMapper::toDto);

    }


    public VideoDto getVideoById(UUID id) {
        Video video = videoRepository.findById(id).orElseThrow(RuntimeException::new);
        return VideoMapper.toDto(video);
    }


    @Transactional
    public VideoDto updateStatusSingleVideo(UUID id, StatusDto request) {
        Optional<Video> optionalVideo = videoRepository.findById(id);

        if (optionalVideo.isPresent()) {
            Video video = optionalVideo.get();
            video.setStatus(request.getStatus());
            return VideoMapper.toDto(videoRepository.save(video));
        } else{
            throw new RuntimeException("No video with the given ID was found");
        }
    }


    public AiResponseDto askQuestion(UUID id, QuestionDto question) {
        Optional<Video> optionalVideo = videoRepository.findById(id);

        if (optionalVideo.isPresent()) {
            Video video = optionalVideo.get();

            if (video.getStatus() != GraphExistenceStatus.EXIST) {
                throw new RuntimeException("Video not added to the knowledge graph yet");
            }

            HashMap<String, String> request = new HashMap<>();
            request.put("query", question.getContent());
            ResponseEntity<AiResponseDto> response = restClient.post()
                    .uri(aiServiceUrl + "/ask")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .toEntity(AiResponseDto.class);

            return response.getBody();
        } else {
            throw new RuntimeException("No video with the given ID was found");
        }
    }
}
