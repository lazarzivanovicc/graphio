package com.talkie.app.domain.dtos;

import com.talkie.app.domain.entities.GraphExistenceStatus;
import lombok.Data;

@Data
public class StatusDto {
    private GraphExistenceStatus status;
}
