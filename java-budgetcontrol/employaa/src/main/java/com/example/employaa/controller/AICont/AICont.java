package com.example.employaa.controller.AICont;

import com.example.employaa.DTO.LLMinput;
import com.example.employaa.DTO.UserInputDTO;
import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.expenses.Expenses;
import com.example.employaa.entity.income.Income;
import com.example.employaa.entity.saving.Saving;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.ExpenseRepo.Expensesrepo;
import com.example.employaa.repository.IncomeRepo.IncomeRepo;
import com.example.employaa.repository.SavingsRepo.SavingRepo;
import com.example.employaa.service.UserService.UserService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.util.StdDateFormat;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.http.*;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.*;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Controller
@AllArgsConstructor
@Slf4j
public class AICont {
    private final IncomeRepo incomeRepository;
    private final SavingRepo savingRepository;
    private final Expensesrepo expensesRepository;
    private final JWT_util jwtUtil;
    private final UserService userService;
    private final RestTemplate restTemplate;

    private LocalDate[] getLastMonthDateRange() {
        LocalDate today = LocalDate.now();
        LocalDate firstDayOfLastMonth = today.minusMonths(1).withDayOfMonth(1);
        LocalDate lastDayOfLastMonth = today.minusMonths(1).with(TemporalAdjusters.lastDayOfMonth());

        log.info("Calculated date range: {} to {}", firstDayOfLastMonth, lastDayOfLastMonth);
        return new LocalDate[]{firstDayOfLastMonth, lastDayOfLastMonth};
    }

    private double calculateMonthlyIncome(User user, LocalDate startDate, LocalDate endDate) {
        List<Income> incomes = incomeRepository.findByUserAndInDateBetween(user, startDate, endDate);
        log.debug("Found {} income records between {} and {}", incomes.size(), startDate, endDate);
        incomes.forEach(i -> log.debug("Income: {}", i.getIn_amount()));
        return incomes.stream().mapToDouble(Income::getIn_amount).sum();
    }

    private BigDecimal calculateMonthlySavings(User user, LocalDate startDate, LocalDate endDate) {
        List<Saving> savings = savingRepository.findByUserAndCreatedAtBetween(user, startDate, endDate);
        log.debug("Found {} savings records between {} and {}", savings.size(), startDate, endDate);
        savings.forEach(s -> log.debug("Saving: {}", s.getCurrentBalance()));
        return savings.stream()
                .map(Saving::getCurrentBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }


    private Map<String, Double> categorizeExpenses(User user, LocalDate startDate, LocalDate endDate) {
        List<Expenses> expenses = expensesRepository.findByUserAndDateBetween(user, startDate, endDate);
        log.debug("Found {} expense records between {} and {}", expenses.size(), startDate, endDate);
        double unwanted = 0;
        double basic = 0;

        Set<String> lifestyleCategories = Set.of(
                "Entertainment", "Personal Expenses", "Gifts & Donations", "Miscellaneous"
        );

        for (Expenses expense : expenses) {
            if (lifestyleCategories.contains(expense.getCategory())) {
                unwanted += expense.getAmount();
            } else {
                basic += expense.getAmount();
            }
        }
        return Map.of("unwanted", unwanted, "basic", basic);
    }

    @PostMapping("/generate-ai-request")
    public ResponseEntity<?> generateAIRequest(
            @RequestBody UserInputDTO form
          ) {

        try {
            User user = getAuthenticatedUser();
            LocalDate[] lastMonthRange = getLastMonthDateRange();

            Map<String, Object> requestBody = new LinkedHashMap<>();
            requestBody.put("Age", form.getAge());
            requestBody.put("What is your personal income?",
                    calculateMonthlyIncome(user, lastMonthRange[0], lastMonthRange[1]));
            requestBody.put("How much do you save monthly?",
                    calculateMonthlySavings(user, lastMonthRange[0], lastMonthRange[1]).doubleValue());
//            requestBody.put("Do you live alone and cover your own expenses?", form.getLiveAlone());

            Map<String, Double> expenses = categorizeExpenses(user, lastMonthRange[0], lastMonthRange[1]);

            requestBody.put("Basic Needs Spending", expenses.get("basic"));
            requestBody.put("Unwanted Spending", expenses.get("unwanted"));



//            requestBody.put("What is your job?", form.getJob());
            requestBody.put("Debt", form.getDebt());
            log.debug("Request body: {}", new ObjectMapper().writeValueAsString(requestBody));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                    "https://advice-ai-511116185491.asia-south2.run.app/predict",
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            log.error("AI request failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "AI service unavailable", "details", e.getMessage()));
        }
    }



    @PostMapping("/generate-ai-request2")
    public ResponseEntity<?> generateAIRequest2(
            @RequestBody UserInputDTO form
            ) {

        try {
            User user = getAuthenticatedUser();
            LocalDate[] lastMonthRange = getLastMonthDateRange();

            Map<String, Object> requestBody = new LinkedHashMap<>();
            requestBody.put("Age", form.getAge());
            requestBody.put("What is your personal income?",
                    calculateMonthlyIncome(user, lastMonthRange[0], lastMonthRange[1]));
            requestBody.put("How much do you save monthly?",
                    calculateMonthlySavings(user, lastMonthRange[0], lastMonthRange[1]).doubleValue());
//            requestBody.put("Do you live alone and cover your own expenses?", form.getLiveAlone());

            Map<String, Double> expenses = categorizeExpenses(user, lastMonthRange[0], lastMonthRange[1]);

            requestBody.put("Basic Needs Spending", expenses.get("basic"));
            requestBody.put("Unwanted Spending", expenses.get("unwanted"));



//            requestBody.put("What is your job?", form.getJob());
            requestBody.put("Debt", form.getDebt());
            log.debug("Request body: {}", new ObjectMapper().writeValueAsString(requestBody));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                    "https://advice-ai-511116185491.asia-south2.run.app/predict_recommendations",
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            log.error("AI request failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "AI service unavailable", "details", e.getMessage()));
        }
    }

/////////////////////////////////////////////////////////////////////llm api

    @PostMapping("/generateLLM")
    public ResponseEntity<?> generateLLM(@RequestBody LLMinput form) {
        long methodStart = System.currentTimeMillis();
        try {
            User user = getAuthenticatedUser();
            LocalDate[] lastMonthRange = getLastMonthDateRange();

            // Build request payload
            Map<String, Object> requestBody = new LinkedHashMap<>();
            requestBody.put("job", form.getJob());
            requestBody.put("are_you_employed", form.getEmployed());
            requestBody.put("have_vehicle", form.getVehicle());
            requestBody.put("live_alone", form.getLiveAlone());

            Double income = sanitizeDouble(calculateMonthlyIncome(user, lastMonthRange[0], lastMonthRange[1]));
            Double savings = sanitizeDouble(calculateMonthlySavings(user, lastMonthRange[0], lastMonthRange[1]).doubleValue());

            requestBody.put("income", income);
            requestBody.put("monthly_savings", savings);

            Map<String, Double> expenses = categorizeExpenses(user, lastMonthRange[0], lastMonthRange[1]);
            double basic = sanitizeDouble(expenses.getOrDefault("basic", 0.0));
            double unwanted = sanitizeDouble(expenses.getOrDefault("unwanted", 0.0));

            requestBody.put("basic_needs", basic);
            requestBody.put("unwanted_spending", unwanted);

            int peopleCount = 0;
            try {
                peopleCount = Integer.parseInt(form.getPeopleInHouse());
            } catch (NumberFormatException e) {
                log.warn("Invalid people_in_house: {}", form.getPeopleInHouse());
            }

            requestBody.put("people_in_house", peopleCount);

            if (peopleCount > 1) {
                requestBody.put("basic_needs_family", basic);
                requestBody.put("unwanted_spending_family", unwanted);
                requestBody.put("basic_needs_alone", 0.0);
                requestBody.put("unwanted_spending_alone", 0.0);
            } else {
                requestBody.put("basic_needs_alone", basic);
                requestBody.put("unwanted_spending_alone", unwanted);
                requestBody.put("basic_needs_family", 0.0);
                requestBody.put("unwanted_spending_family", 0.0);
            }

            log.debug("Request body: {}", new ObjectMapper().writeValueAsString(requestBody));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setCacheControl("no-cache, no-store, must-revalidate");
            headers.setPragma("no-cache");
            headers.setExpires(0L);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            String url = "http://127.0.0.1:5001/generate_strategies?ts=" + System.currentTimeMillis();

            long requestStart = System.currentTimeMillis();
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            long requestEnd = System.currentTimeMillis();

            log.info("AI request to {} took {} ms", url, (requestEnd - requestStart));

            long methodEnd = System.currentTimeMillis();
            log.info("Total /generateLLM method execution time: {} ms", (methodEnd - methodStart));

            // Return parsed JSON body directly
            return ResponseEntity.ok(response.getBody());

        } catch (RestClientException e) {
            log.error("AI request failed", e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "AI request failed",
                    "details", e.getMessage(),
                    "rootCause", e.getCause() != null ? e.getCause().getMessage() : "Unknown"
            ));
        } catch (Exception e) {
            log.error("Unexpected error", e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "Unexpected server error",
                    "details", e.getMessage(),
                    "rootCause", e.getCause() != null ? e.getCause().getMessage() : "Unknown"
            ));
        }
    }

    private double sanitizeDouble(Double value) {
        return (value == null || value.isNaN() || value.isInfinite()) ? 0.0 : value;
    }




    ////////////////////////////////////////////////////////////////////////////////////////////
private HttpHeaders createHeaders() {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    return headers;
}

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userService.findByUsername(authentication.getName());

    }
}

