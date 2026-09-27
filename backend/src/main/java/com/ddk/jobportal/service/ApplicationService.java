package com.ddk.jobportal.service;

import com.ddk.jobportal.entity.Application;
import com.ddk.jobportal.entity.Job;
import com.ddk.jobportal.entity.User;
import com.ddk.jobportal.repository.ApplicationRepository;
import com.ddk.jobportal.repository.JobRepository;
import com.ddk.jobportal.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository,
            UserRepository userRepository) {

        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    // ==========================================
    // APPLY FOR A JOB
    // ==========================================

    public Application applyForJob(Long jobId) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User applicant = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Applicant not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found with id: " + jobId));

        Application application = Application.builder()
                .job(job)
                .applicant(applicant)
                .status("APPLIED")
                .build();

        return applicationRepository.save(application);
    }


    // ==========================================
    // GET MY APPLICATIONS
    // ==========================================

    public List<Application> getMyApplications() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User applicant = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Applicant not found"));

        return applicationRepository
                .findByApplicantId(applicant.getId());
    }


    // ==========================================
    // GET APPLICATIONS FOR A PARTICULAR JOB
    // ==========================================

    public List<Application> getApplicationsForJob(Long jobId) {

        return applicationRepository.findByJobId(jobId);
    }


    // ==========================================
    // RECRUITER: GET APPLICATIONS FOR MY JOBS
    // ==========================================

    public List<Application> getRecruiterApplications() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Recruiter not found"));

        return applicationRepository.findAll()
                .stream()
                .filter(application ->
                        application.getJob()
                                .getEmployer()
                                .getId()
                                .equals(recruiter.getId()))
                .toList();
    }


    // ==========================================
// RECRUITER: UPDATE APPLICATION STATUS
// ==========================================

    public Application updateApplicationStatus(
            Long applicationId,
            String newStatus) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        // Find logged-in recruiter
        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Recruiter not found"));

        // Find application
        Application application = applicationRepository
                .findById(applicationId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found with id: "
                                        + applicationId));

        // Check that this application belongs to
        // a job posted by the logged-in recruiter
        if (!application.getJob()
                .getEmployer()
                .getId()
                .equals(recruiter.getId())) {

            throw new RuntimeException(
                    "You are not authorized to update this application");
        }

        // Allow only valid statuses
        if (!newStatus.equals("APPLIED")
                && !newStatus.equals("SHORTLISTED")
                && !newStatus.equals("REJECTED")) {

            throw new RuntimeException(
                    "Invalid application status");
        }

        application.setStatus(newStatus);

        return applicationRepository.save(application);
    }
}