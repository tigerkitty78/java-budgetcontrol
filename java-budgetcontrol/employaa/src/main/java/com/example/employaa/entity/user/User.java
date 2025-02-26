package com.example.employaa.entity.user;



import com.example.employaa.entity.splitexpenses.Group;
import com.example.employaa.entity.splitexpenses.GroupUsers;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Table(name = "users")
@Entity
@Data
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(unique = true, length = 100, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    /////////////////login new

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "group_id") // Foreign key in User table
    private Group group;
///////////////////


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(); // No roles or authorities defined
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String toString() {
        return "User{" +
                "createdAt=" + createdAt +
                ", id=" + id +
                ", fullName='" + fullName + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", updatedAt=" + updatedAt +

                '}';
    }

    // No-argument constructor for JPA
    public User() {
    }

    // Parameterized constructor
    public User(Date createdAt, String email, String fullName, List<GroupUsers> groups, Long id, String password, Date updatedAt, String username) {
        this.createdAt = createdAt;
        this.email = email;
        this.fullName = fullName;

        this.id = id;
        this.password = password;
        this.updatedAt = updatedAt;
        this.username = username;
    }


}
