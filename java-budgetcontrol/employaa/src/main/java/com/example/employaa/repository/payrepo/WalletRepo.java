package com.example.employaa.repository.payrepo;

import com.example.employaa.entity.paymodel.WalletModel;
import com.example.employaa.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WalletRepo extends JpaRepository<WalletModel, Long> {
   // List<WalletModel> findByUser(User user);
Optional<WalletModel> findByUser(User user);

}
