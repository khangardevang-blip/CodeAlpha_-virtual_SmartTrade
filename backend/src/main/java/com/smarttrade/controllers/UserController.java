package com.smarttrade.controllers;
import com.smarttrade.dto.*;
import com.smarttrade.models.*;
import com.smarttrade.repositories.*;
import com.smarttrade.services.TradingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired UserRepository userRepository;
    @Autowired PortfolioRepository portfolioRepository;
    @Autowired TransactionRepository transactionRepository;
    @Autowired TradingService tradingService;

    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        User user = userRepository.findByUsername(getCurrentUsername()).orElseThrow();
        user.setPassword(null); // Hide password
        return ResponseEntity.ok(user);
    }

    @GetMapping("/portfolio")
    public List<Portfolio> getPortfolio() {
        User user = userRepository.findByUsername(getCurrentUsername()).orElseThrow();
        return portfolioRepository.findByUser(user);
    }

    @GetMapping("/transactions")
    public List<Transaction> getTransactions() {
        User user = userRepository.findByUsername(getCurrentUsername()).orElseThrow();
        return transactionRepository.findByUserOrderByTimestampDesc(user);
    }

    @PostMapping("/trade/buy")
    public ResponseEntity<?> buyStock(@RequestBody TradeRequest request) {
        MessageResponse res = tradingService.buyStock(getCurrentUsername(), request.getStockId(), request.getQuantity());
        if(res.getMessage().startsWith("Error")) return ResponseEntity.badRequest().body(res);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/trade/sell")
    public ResponseEntity<?> sellStock(@RequestBody TradeRequest request) {
        MessageResponse res = tradingService.sellStock(getCurrentUsername(), request.getStockId(), request.getQuantity());
        if(res.getMessage().startsWith("Error")) return ResponseEntity.badRequest().body(res);
        return ResponseEntity.ok(res);
    }
}
