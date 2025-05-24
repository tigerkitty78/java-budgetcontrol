package com.example.employaa.entity.splitexpenses;
import com.example.employaa.entity.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;


@Entity
@Data

@Table(name = "group_users")


public class GroupUsers {
    @EmbeddedId
    private GroupUsersID id;


    @ManyToOne
    @MapsId("group_id")
    private Group group;

    @ManyToOne
    @MapsId( "user_id")
    private User user;



}


