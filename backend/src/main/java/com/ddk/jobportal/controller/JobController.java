package com.ddk.jobportal.controller;

import com.ddk.jobportal.entity.Job;
import com.ddk.jobportal.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // =========================
    // CREATE JOB
    // =========================

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Job> createJob(@RequestBody Job job) {

        return ResponseEntity.ok(
                jobService.createJob(job)
        );
    }


    // =========================
    // GET ALL JOBS
    // =========================

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {

        return ResponseEntity.ok(
                jobService.getAllJobs()
        );
    }


    // =========================
    // GET JOB BY ID
    // =========================

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'RECRUITER', 'ADMIN')")
    public ResponseEntity<Job> getJobById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                jobService.getJobById(id)
        );
    }


    // =========================
    // UPDATE JOB
    // =========================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Job> updateJob(
            @PathVariable Long id,
            @RequestBody Job job) {

        return ResponseEntity.ok(
                jobService.updateJob(id, job)
        );
    }


    // =========================
    // DELETE JOB
    // =========================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<String> deleteJob(
            @PathVariable Long id) {

        jobService.deleteJob(id);

        return ResponseEntity.ok(
                "Job deleted successfully"
        );
    }
}