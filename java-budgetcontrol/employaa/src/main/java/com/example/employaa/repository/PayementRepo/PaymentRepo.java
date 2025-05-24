// PaymentRepository.java
package com.example.employaa.repository.PayementRepo;
import com.example.employaa.entity.payment.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepo extends JpaRepository<Payment, Long> {
    Payment findByOrderId(String orderId);
}