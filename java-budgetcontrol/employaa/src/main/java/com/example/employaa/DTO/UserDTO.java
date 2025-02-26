package com.example.employaa.DTO;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    @NotEmpty
    private String fullname;
    @NotEmpty(message = "Email should not be empty")
    @Email
    private String email;
    @NotEmpty(message = "Password should not be empty")
    private String password;

    public UserDTO(String email, String fullname, String password, Long id, String username) {
        this.email = email;
        this.fullname = fullname;
        this.password = password;
        this.id = id;
        this.username = username;
    }

    public @NotEmpty(message = "Email should not be empty") @Email String getEmail() {
        return email;
    }

    public void setEmail(@NotEmpty(message = "Email should not be empty") @Email String email) {
        this.email = email;
    }

    public @NotEmpty String getFullname() {
        return fullname;
    }

    public void setFullname(@NotEmpty String fullname) {
        this.fullname = fullname;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotEmpty(message = "Password should not be empty") String getPassword() {
        return password;
    }

    public void setPassword(@NotEmpty(message = "Password should not be empty") String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    private String username;

    public void setFullName(String fullName) {
        this.fullname = fullName;
    }
}
