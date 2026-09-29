package com.claimtrace.iam.user.controller;

import com.claimtrace.iam.dto.ApiResponse;
import com.claimtrace.iam.role.dto.AssignRoleRequest;
import com.claimtrace.iam.user.dto.CreateUserRequest;
import com.claimtrace.iam.user.dto.UpdateStatusRequest;
import com.claimtrace.iam.user.dto.UpdateUserRequest;
import com.claimtrace.iam.user.dto.UserResponse;
import com.claimtrace.iam.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable String id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserResponse createdUser = userService.createUser(request);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable String id,
                                                   @Valid @RequestBody UpdateUserRequest request) {
        UserResponse updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<UserResponse> updateUserStatus(@PathVariable String id,
                                                         @Valid @RequestBody UpdateStatusRequest request) {
        UserResponse updatedUser = userService.updateUserStatus(id, request.getEnabled());
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.ok("User deleted successfully"));
    }

    @PostMapping("/{id}/roles")
    public ResponseEntity<UserResponse> assignRole(@PathVariable String id,
                                                   @Valid @RequestBody AssignRoleRequest request) {
        UserResponse user = userService.assignRoleToUser(id, request.getRole());
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}/roles/{role}")
    public ResponseEntity<UserResponse> removeRole(@PathVariable String id,
                                                   @PathVariable String role) {
        UserResponse user = userService.removeRoleFromUser(id, role);
        return ResponseEntity.ok(user);
    }
}
