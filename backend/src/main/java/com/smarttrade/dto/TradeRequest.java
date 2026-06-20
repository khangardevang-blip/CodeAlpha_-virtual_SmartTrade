package com.smarttrade.dto;
public class TradeRequest {
    private Long stockId;
    private Integer quantity;
    public Long getStockId() { return stockId; }
    public void setStockId(Long stockId) { this.stockId = stockId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
