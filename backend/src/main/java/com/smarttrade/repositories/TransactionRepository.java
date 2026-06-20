package com.smarttrade.repositories;
import com.smarttrade.models.Transaction;
import com.smarttrade.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserOrderByTimestampDesc(User user);
    
    @Transactional
    void deleteByUser(User user);
}
