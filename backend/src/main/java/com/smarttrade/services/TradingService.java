package com.smarttrade.services;
import com.smarttrade.dto.MessageResponse;
import com.smarttrade.models.*;
import com.smarttrade.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
public class TradingService {
    @Autowired UserRepository userRepository;
    @Autowired StockRepository stockRepository;
    @Autowired PortfolioRepository portfolioRepository;
    @Autowired TransactionRepository transactionRepository;

    @Transactional
    public MessageResponse buyStock(String username, Long stockId, Integer quantity) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Stock stock = stockRepository.findById(stockId).orElseThrow();
        double totalCost = stock.getCurrentPrice() * quantity;
        if (user.getBalance() < totalCost) {
            return new MessageResponse("Error: Insufficient balance!");
        }
        user.setBalance(user.getBalance() - totalCost);
        userRepository.save(user);
        
        Portfolio portfolio = portfolioRepository.findByUserAndStock(user, stock).orElse(new Portfolio());
        portfolio.setUser(user);
        portfolio.setStock(stock);
        int currentQty = portfolio.getQuantity() != null ? portfolio.getQuantity() : 0;
        double currentAvg = portfolio.getAverageBuyPrice() != null ? portfolio.getAverageBuyPrice() : 0.0;
        portfolio.setAverageBuyPrice(((currentQty * currentAvg) + totalCost) / (currentQty + quantity));
        portfolio.setQuantity(currentQty + quantity);
        portfolioRepository.save(portfolio);
        
        Transaction tx = new Transaction();
        tx.setUser(user); tx.setStock(stock); tx.setType("BUY");
        tx.setQuantity(quantity); tx.setPrice(stock.getCurrentPrice());
        transactionRepository.save(tx);
        return new MessageResponse("Successfully bought " + quantity + " shares of " + stock.getSymbol());
    }

    @Transactional
    public MessageResponse sellStock(String username, Long stockId, Integer quantity) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Stock stock = stockRepository.findById(stockId).orElseThrow();
        Portfolio portfolio = portfolioRepository.findByUserAndStock(user, stock).orElse(null);
        if (portfolio == null || portfolio.getQuantity() < quantity) {
            return new MessageResponse("Error: Insufficient shares!");
        }
        double totalRevenue = stock.getCurrentPrice() * quantity;
        user.setBalance(user.getBalance() + totalRevenue);
        userRepository.save(user);
        
        portfolio.setQuantity(portfolio.getQuantity() - quantity);
        portfolioRepository.save(portfolio);
        
        Transaction tx = new Transaction();
        tx.setUser(user); tx.setStock(stock); tx.setType("SELL");
        tx.setQuantity(quantity); tx.setPrice(stock.getCurrentPrice());
        transactionRepository.save(tx);
        return new MessageResponse("Successfully sold " + quantity + " shares of " + stock.getSymbol());
    }
}
