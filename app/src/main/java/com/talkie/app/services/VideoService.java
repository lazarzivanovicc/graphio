package com.talkie.app.services;

import com.talkie.app.domain.dtos.*;
import com.talkie.app.domain.entities.GraphExistenceStatus;
import com.talkie.app.domain.entities.Video;
import com.talkie.app.domain.mappers.VideoMapper;
import com.talkie.app.repositories.VideoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;


import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VideoService {
    @Value("${ai.url}")
    private String aiServiceUrl;
    private final VideoRepository videoRepository;
    private final RestClient restClient;
    // I have to create DTO's and Mappers
    // I will use RestClient here to send post request to Python microservice
    public Video createVideo(VideoDto request) {
        Video videoToSave = VideoMapper.toEntity(request);
        Video savedVideo = videoRepository.save(videoToSave);
        GraphCreationDto response = addVideoToKnowledgeGraph(savedVideo.getId(), request.getUrl());
        return savedVideo;
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


    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }


    public Optional<Video> getVideoById(UUID id) {
        return videoRepository.findById(id);
    }


    @Transactional
    public Video updateStatusSingleVideo(UUID id, StatusDto request) {
        Optional<Video> optionalVideo = videoRepository.findById(id);

        if (optionalVideo.isPresent()) {
            Video video = optionalVideo.get();
            video.setStatus(request.getStatus());
            return videoRepository.save(video);
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
