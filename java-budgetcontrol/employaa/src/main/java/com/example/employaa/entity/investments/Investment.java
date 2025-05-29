package com.example.employaa.entity.investments;

import com.example.employaa.entity.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "investments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Investment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // @Column(nullable = false)
  //  private Long userId; // Reference to User entity

    @Column(nullable = false)

    @NotNull(message = "Investment name is required")
    private String investmentName;

   // @Enumerated(EnumType.STRING)
    //@Column(nullable = false)
    //private InvestmentType investmentType;

    @Column(nullable = false, precision = 15, scale = 2)

    @NotNull(message = "Investment name is required")
    private BigDecimal amount;

    @Column(precision = 5, scale = 2)

    @NotNull(message = "Investment name is required")
    private BigDecimal interestRate; // Optional

    @Column(nullable = false)

    @NotNull(message = "Investment name is required")
    private Integer duration; // In months

    @Column(nullable = false)

    @NotNull(message = "Investment name is required")
    private LocalDate startDate;

    @Column(nullable = false)

    @NotNull(message = "Investment name is required")
    private LocalDate maturityDate;

    //@Enumerated(EnumType.STRING)
   // @Column(nullable = false)
    //private InvestmentStatus status;

    @Column(precision = 15, scale = 2)
    private BigDecimal returns; // Expected or realized returns


    @Column(nullable = false)
    private BigDecimal currentValue;

    //@Enumerated(EnumType.STRING)
    //private RiskLevel riskLevel;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id") // Foreign key to User
    private User user;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

