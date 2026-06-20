package com.smarttrade.controllers;

import com.smarttrade.dto.MessageResponse;
import com.smarttrade.models.User;
import com.smarttrade.repositories.PortfolioRepository;
import com.smarttrade.repositories.TransactionRepository;
import com.smarttrade.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired UserRepository userRepository;
    @Autowired PortfolioRepository portfolioRepository;
    @Autowired TransactionRepository transactionRepository;

    private boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> userOpt = userRepository.findByUsername(auth.getName());
        return userOpt.isPresent() && "ADMIN".equals(userOpt.get().getRole());
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        if (!isAdmin()) return ResponseEntity.status(403).body(new MessageResponse("Error: Unauthorized."));
        
        List<User> users = userRepository.findAll();
        users.forEach(u -> u.setPassword(null)); // Don't send passwords to frontend
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!isAdmin()) return ResponseEntity.status(403).body(new MessageResponse("Error: Unauthorized."));
        
        Optional<User> targetUserOpt = userRepository.findById(id);
        if (targetUserOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found."));
        }
        
        User targetUser = targetUserOpt.get();
        if ("ADMIN".equals(targetUser.getRole())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Cannot delete an administrator."));
        }

        // Cascade delete
        transactionRepository.deleteByUser(targetUser);
        portfolioRepository.deleteByUser(targetUser);
        userRepository.delete(targetUser);
        
        return ResponseEntity.ok(new MessageResponse("User deleted successfully."));
    }
}
