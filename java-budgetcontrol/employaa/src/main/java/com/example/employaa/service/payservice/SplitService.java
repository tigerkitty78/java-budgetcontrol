package com.example.employaa.service.payservice;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.paymodel.SplitPaymentDetail;
import com.example.employaa.entity.paymodel.SplitPaymentModel;
import com.example.employaa.entity.splitexpenses.Group;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.SplitexpensesRepo.GroupRepo;
import com.example.employaa.repository.payrepo.SplitDetailRepo;
import com.example.employaa.repository.payrepo.SplitRepo;
import com.example.employaa.service.UserService.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
@Service

@RequiredArgsConstructor
public class SplitService {

    private final SplitRepo splitRepo;
    private final SplitDetailRepo splitDetailRepo; // <-- New dependency
    private final UserService userService;
    private final JWT_util jwtUtil;
    private final GroupRepo groupRepository;

    // Get authenticated user from token
    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.findByUsername(username);
    }

    // Create a split payment and save the details
    public boolean makeSplitPayment(SplitPaymentModel splitPaymentModel) {
        try {
            User loggedInUser = getAuthenticatedUser();
            System.out.println("Logged in User: " + loggedInUser.getId() + " - " + loggedInUser.getUsername());

            // Fetch the group with users
            Group group = groupRepository.findByIdWithUsers(splitPaymentModel.getGroup().getId())
                    .orElseThrow(() -> new RuntimeException("Group not found"));

            System.out.println("Group fetched: " + group.getId() + " - " + group.getName());

            splitPaymentModel.setGroup(group);

            // Validate group members
            List<User> groupMembers = group.getUsers();
            if (groupMembers == null || groupMembers.isEmpty()) {
                throw new IllegalArgumentException("Group has no members");
            }

            System.out.println("Number of group members (including payer): " + groupMembers.size());
            System.out.println("Group Members:");
            for (User user : groupMembers) {
                System.out.println("- User ID: " + user.getId() + ", Name: " + user.getUsername());
            }

            // Calculate split amount
            int numOfParticipants = groupMembers.size() - 1; // Exclude payer
            if (numOfParticipants <= 0) {
                throw new IllegalArgumentException("No participants in the group");
            }

            System.out.println("Number of participants (excluding payer): " + numOfParticipants);

            double calculatedSplitAmount = splitPaymentModel.getTotalAmount() / numOfParticipants;
            System.out.println("Calculated split amount per participant: " + calculatedSplitAmount);

            // Save SplitPaymentModel
            splitPaymentModel.setUser(loggedInUser);
            splitPaymentModel.setStatus("PENDING");
            splitPaymentModel.setSplitAmount(calculatedSplitAmount);
            SplitPaymentModel savedSplit = splitRepo.save(splitPaymentModel);

            System.out.println("Split payment saved with ID: " + savedSplit.getId());

            // Create SplitPaymentDetail entries
            for (User member : groupMembers) {
                if (!member.getId().equals(loggedInUser.getId())) {
                    SplitPaymentDetail detail = new SplitPaymentDetail();
                    detail.setSplitPayment(savedSplit);
                    detail.setUser(member);
                    detail.setAmountOwed(calculatedSplitAmount);
                    detail.setPaid(false);
                    splitDetailRepo.save(detail);
                    System.out.println("Created split detail for user ID: " + member.getId());
                }
            }

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    // Get all split payments created by the authenticated user
    public List<SplitPaymentModel> getSplitsByUser() {
        User loggedInUser = getAuthenticatedUser();
        return splitRepo.findByUser(loggedInUser);  // Get all split payments for the logged-in user
    }

    public List<SplitPaymentDetail> getSplitsPayable() {
        User loggedInUser = getAuthenticatedUser();
        return splitDetailRepo.findByUser(loggedInUser);  // Get all split payments for the logged-in user
    }

    // Mark a split payment as done, only if created by the authenticated user
    public boolean markAsDone(int id) {
        try {
            User loggedInUser = getAuthenticatedUser();
            SplitPaymentModel split = splitRepo.findById(id).orElse(null);

            if (split == null || !split.getUser().equals(loggedInUser)) {
                return false;
            }

            split.setStatus("DONE");
            splitRepo.save(split);

            // Also, mark all related SplitPaymentDetails as paid
            List<SplitPaymentDetail> details = splitDetailRepo.findBySplitPayment(split);
            for (SplitPaymentDetail detail : details) {
                detail.setPaid(true);
                splitDetailRepo.save(detail);
            }

            return true;
        } catch (Exception e) {
            e.printStackTrace(); // Add for debugging
            return false;
        }
    }

    public boolean payShare(int splitId) {
        try {
            User loggedInUser = getAuthenticatedUser();
            SplitPaymentModel splitPayment = splitRepo.findById(splitId)
                    .orElseThrow(() -> new RuntimeException("Split payment not found"));

            // Find the payment detail for the logged-in user
            SplitPaymentDetail splitDetail = splitDetailRepo.findBySplitPaymentAndUser(splitPayment, loggedInUser)
                    .orElseThrow(() -> new RuntimeException("Payment detail not found for this user"));

            if (splitDetail.isPaid()) {
                return false; // Already paid
            }

            // Mark as paid
            splitDetail.setPaid(true);
            splitDetailRepo.save(splitDetail);

            // Get number of participants (group members excluding payer)
            Group group = splitPayment.getGroup();
            int totalParticipants = group.getUsers().size() - 1; // Subtract payer

            // Update fulfillment status
            long currentlyFulfilled = splitDetailRepo.countBySplitPaymentAndPaid(splitPayment, true);
            splitPayment.setCurrentlyFulfilled((int) currentlyFulfilled);

            // Check if all participants have paid
            if (currentlyFulfilled == totalParticipants) {
                splitPayment.setStatus("DONE");
            }

            splitRepo.save(splitPayment);
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}





//TODO change update to done and make button pay from 4 buttons