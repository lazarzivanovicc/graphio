package com.talkie.app.services;

import com.talkie.app.config.JwtService;
import com.talkie.app.domain.dtos.AuthenticationResponse;
import com.talkie.app.domain.dtos.LoginRequest;
import com.talkie.app.domain.dtos.RegisterRequest;
import com.talkie.app.domain.entities.Role;
import com.talkie.app.domain.entities.User;
import com.talkie.app.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request){
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        userRepository.save(user);
        var jwt = jwtService.generateToken(user);
        return AuthenticationResponse.builder().accessToken(jwt).build();
    }

    public AuthenticationResponse registerAdmin(RegisterRequest request){
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .build();
        userRepository.save(user);
        var jwt = jwtService.generateToken(user);
        return AuthenticationResponse.builder().accessToken(jwt).build();
    }

    public AuthenticationResponse registerSuperAdmin(RegisterRequest request){
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.SUPERADMIN)
                .build();
        userRepository.save(user);
        var jwt = jwtService.generateToken(user);
        return AuthenticationResponse.builder().accessToken(jwt).build();
    }

    public AuthenticationResponse login(LoginRequest request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        var jwt = jwtService.generateToken(user);
        return AuthenticationResponse.builder().accessToken(jwt).build();
    }
}
