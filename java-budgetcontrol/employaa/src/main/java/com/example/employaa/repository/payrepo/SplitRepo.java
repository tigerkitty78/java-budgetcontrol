package com.example.employaa.repository.payrepo;

import com.example.employaa.entity.expenses.Expenses;
import com.example.employaa.entity.paymodel.SplitPaymentModel;
import com.example.employaa.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SplitRepo extends JpaRepository<SplitPaymentModel, Integer> {
    List<SplitPaymentModel> findByUser(User user);

//    List<SplitPaymentModel> findByPayer(User user);
}
