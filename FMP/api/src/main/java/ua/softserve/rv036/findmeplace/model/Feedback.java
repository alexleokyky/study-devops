package ua.softserve.rv036.findmeplace.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
//@NoArgsConstructor
@AllArgsConstructor
@Table(name = "feedbacks")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "comment")
    private String comment;

    @CreatedDate
    @Column(name = "creation_date")
    private Date creationDate;

    @Column(name = "user_id")
    private Long userId;

    @Transient
    private String userName;

    @Transient
    private String avatarUrl;

    @Column(name = "place_id")
    private Long placeId;

    public Feedback(String comment, Date creationDate, Long userId, Long placeId) {
        this.comment = comment;
        this.creationDate = creationDate;
        this.userId = userId;
        this.placeId = placeId;
    }
}
