package com.smarttrade.models;
import jakarta.persistence.*;
@Entity
@Table(name = "portfolios")
public class Portfolio {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "user_id") private User user;
    @ManyToOne @JoinColumn(name = "stock_id") private Stock stock;
    private Integer quantity;
    private Double averageBuyPrice;
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Stock getStock() { return stock; }
    public void setStock(Stock stock) { this.stock = stock; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Double getAverageBuyPrice() { return averageBuyPrice; }
    public void setAverageBuyPrice(Double averageBuyPrice) { this.averageBuyPrice = averageBuyPrice; }
}
