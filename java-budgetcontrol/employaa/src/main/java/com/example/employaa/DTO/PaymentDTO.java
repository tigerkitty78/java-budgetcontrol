package com.example.employaa.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data

@Schema(name = "PaymentRequestDTO", description = "Parameters required for a payment")

public class PaymentDTO {

   // @Schema(description = "Name of the payment", required = true)
   // @NotBlank(message = "Name is required")
    //@Size(max = 255)


    //private String name;


    @Schema(description = "Number of the payment")
    private String number;


    @Schema(description = "first_name")
    private String first_name;


    @Schema(description = "last_name")
    private String last_name;


    @Schema(description = "Email of the payment")
    private String email;


    @Schema(description = "Address of the payment")
    private String address;


    @Schema(description = "City of payment")
    private String city;


    @Schema(description = "country of payment")
    private String country;


    @Schema(description = "id of order")
    private String orderId;

    @Schema(description = "descriptions")
    private String items;

    @Schema(description = "currency")
    private String currency;

    @Schema(description = "amount")
    private Double amount;



    //@Schema(description = "Bill value of the payment")
    //private int billValue;


    //@Schema(description = "Card number of the payment")
    //private String cardNumber;


    //@Schema(description = "Card holder of the payment")
    //private String cardHolder;


    //@Schema(description = "Date value of the payment")
    //private String dateValue;


    //@Schema(description = "CVC of the payment")
    //private String cvc;

}