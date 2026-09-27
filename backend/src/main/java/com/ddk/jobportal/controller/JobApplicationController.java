package com.ddk.jobportal.controller;

import com.ddk.jobportal.entity.JobApplication;
import com.ddk.jobportal.service.JobApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    public JobApplicationController(
            JobApplicationService jobApplicationService) {

        this.jobApplicationService = jobApplicationService;
    }

    // Apply for a job
    @PostMapping("/{jobId}")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<JobApplication> applyForJob(
            @PathVariable Long jobId) {

        return ResponseEntity.ok(
                jobApplicationService.applyForJob(jobId)
        );
    }
}