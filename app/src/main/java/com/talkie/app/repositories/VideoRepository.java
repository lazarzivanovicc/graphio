package com.talkie.app.repositories;

import com.talkie.app.domain.entities.User;
import com.talkie.app.domain.entities.Video;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VideoRepository extends JpaRepository<Video, UUID> {
    List<Video> findByUserId(UUID userId);

    Page<Video> findAllByUser(User user, Pageable pageable);
}
