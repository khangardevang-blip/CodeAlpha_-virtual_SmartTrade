package com.smarttrade.services;

import com.smarttrade.models.Stock;
import com.smarttrade.repositories.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class MarketSimulatorService {

    @Autowired
    private StockRepository stockRepository;

    private final Random random = new Random();

    // Runs every 3 seconds
    @Scheduled(fixedRate = 3000)
    public void simulateMarket() {
        List<Stock> stocks = stockRepository.findAll();
        if (stocks.isEmpty()) return;

        for (Stock stock : stocks) {
            // Random change between -2% and +2%
            double changePercent = (random.nextDouble() * 4.0) - 2.0; 
            double changeAmount = stock.getCurrentPrice() * (changePercent / 100.0);
            
            double newPrice = stock.getCurrentPrice() + changeAmount;
            
            // Prevent prices from dropping below 1.0
            if (newPrice < 1.0) newPrice = 1.0;

            stock.setCurrentPrice(newPrice);
            stockRepository.save(stock);
        }
    }
}
