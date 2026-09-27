package com.ddk.jobportal.service;

import com.ddk.jobportal.entity.Job;
import com.ddk.jobportal.entity.JobApplication;
import com.ddk.jobportal.entity.User;
import com.ddk.jobportal.repository.JobApplicationRepository;
import com.ddk.jobportal.repository.JobRepository;
import com.ddk.jobportal.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobApplicationService(
            JobApplicationRepository jobApplicationRepository,
            JobRepository jobRepository,
            UserRepository userRepository) {

        this.jobApplicationRepository = jobApplicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    // Apply for a job
    public JobApplication applyForJob(Long jobId) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User seeker = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found with id: " + jobId));

        JobApplication application = JobApplication.builder()
                .job(job)
                .seeker(seeker)
                .build();

        return jobApplicationRepository.save(application);
    }
}