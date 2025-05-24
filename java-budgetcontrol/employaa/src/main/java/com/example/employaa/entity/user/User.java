package com.example.employaa.entity.user;



import com.example.employaa.entity.friend.Friend;
import com.example.employaa.entity.paymodel.WalletModel;
import com.example.employaa.entity.splitexpenses.Group;
import com.example.employaa.entity.splitexpenses.GroupUsers;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
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

    private  String FirstName;
    private  String LastName;

    @Column(nullable = false, unique = true)
    private String username;
/////////////////////////////////
@Column(nullable = false)
private boolean admin = false;
    ///////////////////////////////////////////////
    @Column(unique = true, length = 100, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private WalletModel wallet;


    @CreationTimestamp
    @Column(updatable = false, name = "created_at")

    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    /////////////////login new

    @ManyToMany(mappedBy = "users")
    @JsonBackReference
    private List<Group> groups;

    private String stripeCustomerId;

    ////////////////////////friend
    // Add these relationships
    @OneToMany(mappedBy = "requester", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Friend> sentRequests = new ArrayList<>();

    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Friend> receivedRequests = new ArrayList<>();

    ///////////////////
private String stripeAccountId;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER")); // No roles or authorities defined
    }


    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
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
    private String walletAddress;
    // When saving a wallet:
    public void setWallet(WalletModel wallet) {
        this.wallet = wallet;
        wallet.setUser(this); // Ensure bidirectional link
    }


}
