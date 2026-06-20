package com.smarttrade.repositories;
import com.smarttrade.models.Portfolio;
import com.smarttrade.models.Stock;
import com.smarttrade.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    List<Portfolio> findByUser(User user);
    Optional<Portfolio> findByUserAndStock(User user, Stock stock);
    
    @Transactional
    void deleteByUser(User user);
}
