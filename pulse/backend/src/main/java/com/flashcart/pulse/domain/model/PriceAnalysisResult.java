package com.flashcart.pulse.domain.model;

import java.math.BigDecimal;
import java.util.List;

public record PriceAnalysisResult(
    BigDecimal currentPrice,
    BigDecimal movingAverage30d,
    double trueDiscountPercentage,
    boolean isFakeDiscount,
    int trustScore,
    List<String> riskFlags
) {}