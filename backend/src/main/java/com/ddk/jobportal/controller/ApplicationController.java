package com.ddk.jobportal.controller;

import com.ddk.jobportal.entity.Application;
import com.ddk.jobportal.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // Apply for a job
    @PostMapping("/apply/{jobId}")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<Application> applyForJob(
            @PathVariable Long jobId) {

        return ResponseEntity.ok(
                applicationService.applyForJob(jobId)
        );
    }

    // Get my applications
    @GetMapping("/my")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<List<Application>> getMyApplications() {

        return ResponseEntity.ok(
                applicationService.getMyApplications()
        );
    }

    // Get applications for a job
    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<List<Application>> getApplicationsForJob(
            @PathVariable Long jobId) {

        return ResponseEntity.ok(
                applicationService.getApplicationsForJob(jobId)
        );
    }
    // Recruiter: Get applications for my jobs
    @GetMapping("/recruiter")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<Application>> getRecruiterApplications() {

        return ResponseEntity.ok(
                applicationService.getRecruiterApplications()
        );
    }
    // Recruiter: Update application status
    @PutMapping("/{applicationId}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Application> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam String status) {

        return ResponseEntity.ok(
                applicationService.updateApplicationStatus(
                        applicationId,
                        status
                )
        );
    }
}