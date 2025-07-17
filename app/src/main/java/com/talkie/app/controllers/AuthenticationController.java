package com.talkie.app.controllers;

import com.talkie.app.domain.dtos.AuthenticationResponse;
import com.talkie.app.domain.dtos.LoginRequest;
import com.talkie.app.domain.dtos.RegisterRequest;
import com.talkie.app.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/register-admin")
    public ResponseEntity<AuthenticationResponse> registerAdmin(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.registerAdmin(request));
    }

    @PostMapping("/register-super-admin")
    public ResponseEntity<AuthenticationResponse> registerSuperAdmin(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.registerSuperAdmin(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authenticationService.login(request));
    }
}
