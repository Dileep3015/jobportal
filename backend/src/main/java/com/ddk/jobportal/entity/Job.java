package com.ddk.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String location;

    private String salary;

    private String experience;

    private String jobType;

    private String skills;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "employer_id")
    private User employer;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}