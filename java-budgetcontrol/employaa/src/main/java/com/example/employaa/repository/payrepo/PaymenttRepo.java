package com.example.employaa.repository.payrepo;

import com.example.employaa.entity.paymodel.PaymentModel;
import com.example.employaa.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymenttRepo extends JpaRepository<PaymentModel, Integer> {
    List<PaymentModel> findByUser(User user);

}
