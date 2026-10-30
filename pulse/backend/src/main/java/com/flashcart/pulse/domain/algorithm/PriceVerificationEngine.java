package com.flashcart.pulse.domain.algorithm;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.flashcart.pulse.domain.model.PriceAnalysisResult;

@Component
public class PriceVerificationEngine {

    public PriceAnalysisResult analyzePrice(BigDecimal currentPrice, List<BigDecimal> priceHistory30Days, int sellerAgeDays) {
        List<String> flags = new ArrayList<>();
        
        // 1. Calculate 30-Day Moving Average
        BigDecimal sum = priceHistory30Days.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal avg30d = priceHistory30Days.isEmpty() ? currentPrice : 
                sum.divide(BigDecimal.valueOf(priceHistory30Days.size()), 2, RoundingMode.HALF_UP);

        // 2. Compute True Discount % against 30-Day Average
        double trueDiscount = 0.0;
        if (avg30d.compareTo(BigDecimal.ZERO) > 0 && currentPrice.compareTo(avg30d) < 0) {
            BigDecimal diff = avg30d.subtract(currentPrice);
            trueDiscount = diff.divide(avg30d, 4, RoundingMode.HALF_UP).doubleValue() * 100;
        }

        // 3. Detect Price Inflation / Fake Discount Logic
        boolean isFake = false;
        if (!priceHistory30Days.isEmpty()) {
            BigDecimal maxRecentPrice = priceHistory30Days.stream().max(BigDecimal::compareTo).orElse(avg30d);
            // Flag if price was bumped >20% recently right before dropping
            if (maxRecentPrice.compareTo(avg30d.multiply(BigDecimal.valueOf(1.20))) >= 0) {
                isFake = true;
                flags.add("ARTIFICIAL_PRICE_INFLATION_DETECTED");
            }
        }

        // 4. Calculate Seller Trust Score (0 - 100)
        int trustScore = 100;
        if (sellerAgeDays < 30) {
            trustScore -= 30;
            flags.add("NEW_SELLER_ACCOUNT");
        }
        if (isFake) {
            trustScore -= 40;
        }
        if (currentPrice.compareTo(avg30d.multiply(BigDecimal.valueOf(0.30))) < 0) {
            trustScore -= 25;
            flags.add("SUSPICIOUSLY_LOW_PRICE");
        }

        return new PriceAnalysisResult(
            currentPrice, 
            avg30d, 
            Math.round(trueDiscount * 100.0) / 100.0, 
            isFake, 
            Math.max(0, trustScore), 
            flags
        );
    }
}