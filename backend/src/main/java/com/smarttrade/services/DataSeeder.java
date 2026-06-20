package com.smarttrade.services;
import com.smarttrade.models.Stock;
import com.smarttrade.repositories.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
@Component
public class DataSeeder implements CommandLineRunner {
    @Autowired StockRepository stockRepository;
    @Autowired com.smarttrade.repositories.UserRepository userRepository;
    @Autowired org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            com.smarttrade.models.User admin = new com.smarttrade.models.User();
            admin.setUsername("admin");
            admin.setEmail("admin@smarttrade.com");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Admin User Seeded!");
        }

        if (stockRepository.count() == 0) {
            stockRepository.save(createStock("AAPL", "Apple Inc.", 150.0, 148.0));
            stockRepository.save(createStock("TSLA", "Tesla Inc.", 200.0, 195.0));
            stockRepository.save(createStock("GOOGL", "Alphabet Inc.", 2800.0, 2750.0));
            stockRepository.save(createStock("AMZN", "Amazon.com Inc.", 3400.0, 3380.0));
            stockRepository.save(createStock("MSFT", "Microsoft Corp.", 299.0, 290.0));
            stockRepository.save(createStock("NVDA", "NVIDIA Corporation", 450.0, 440.0));
            stockRepository.save(createStock("META", "Meta Platforms Inc.", 300.0, 295.0));
            stockRepository.save(createStock("NFLX", "Netflix Inc.", 400.0, 390.0));
            stockRepository.save(createStock("AMD", "Advanced Micro Devices", 110.0, 105.0));
            stockRepository.save(createStock("INTC", "Intel Corporation", 35.0, 34.5));
            stockRepository.save(createStock("DIS", "The Walt Disney Company", 85.0, 84.0));
            stockRepository.save(createStock("BA", "The Boeing Company", 210.0, 205.0));
            stockRepository.save(createStock("JPM", "JPMorgan Chase & Co.", 145.0, 142.0));
            stockRepository.save(createStock("V", "Visa Inc.", 240.0, 235.0));
            stockRepository.save(createStock("WMT", "Walmart Inc.", 160.0, 158.0));
            System.out.println("Market Data Seeded!");
        }
    }
    private Stock createStock(String symbol, String name, Double current, Double prev) {
        Stock s = new Stock();
        s.setSymbol(symbol); s.setName(name); s.setCurrentPrice(current); s.setPreviousClose(prev);
        return s;
    }
}
