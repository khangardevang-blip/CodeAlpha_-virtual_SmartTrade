package com.smarttrade.repositories;
import com.smarttrade.models.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface StockRepository extends JpaRepository<Stock, Long> {
    Optional<Stock> findBySymbol(String symbol);
}
