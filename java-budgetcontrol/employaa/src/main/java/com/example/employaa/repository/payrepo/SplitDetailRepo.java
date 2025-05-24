package com.example.employaa.repository.payrepo;

import com.example.employaa.entity.paymodel.SplitPaymentDetail;
import com.example.employaa.entity.paymodel.SplitPaymentModel;
import com.example.employaa.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SplitDetailRepo extends JpaRepository<SplitPaymentDetail, Long> {
    List<SplitPaymentDetail> findBySplitPayment(SplitPaymentModel splitPaymentModel);
    Optional<SplitPaymentDetail> findBySplitPaymentAndUser(SplitPaymentModel splitPayment, User user);
    List<SplitPaymentDetail> findByUser(User user);

    long countBySplitPaymentAndPaid(SplitPaymentModel splitPayment,boolean paid);
}

