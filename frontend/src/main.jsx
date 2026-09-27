import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

/* =========================================================
   API CONFIGURATION
   ========================================================= */

const API = "/api";

/* =========================================================
   AUTHENTICATION
   ========================================================= */

function getAuth() {
    try {
        return JSON.parse(
            localStorage.getItem("auth") || "null"
        );
    } catch {
        return null;
    }
}

function saveAuth(data) {
    localStorage.setItem(
        "auth",
        JSON.stringify(data)
    );
}

function clearAuth() {
    localStorage.removeItem("auth");
}

/* =========================================================
   API HELPER
   ========================================================= */

async function api(path, options = {}) {

    const currentAuth = getAuth();

    const headers = {
        ...(options.body
            ? {
                "Content-Type":
                    "application/json"
            }
            : {}),

        ...(currentAuth?.token
            ? {
                Authorization:
                    `Bearer ${currentAuth.token}`
            }
            : {}),

        ...(options.headers || {})
    };

    const response = await fetch(
        `${API}${path}`,
        {
            ...options,
            headers
        }
    );

    const text = await response.text();

    let data = null;

    try {
        data = text
            ? JSON.parse(text)
            : null;
    } catch {
        data = text;
    }

    if (!response.ok) {

        throw new Error(
            data?.message ||
            data?.error ||
            (typeof data === "string"
                ? data
                : `Request failed with status ${response.status}`)
        );
    }

    return data;
}

/* =========================================================
   MAIN APP
   ========================================================= */

function App() {

    const [auth, setAuth] = useState(getAuth());

    const [page, setPage] = useState(
        window.location.hash.replace("#/", "") ||
        "home"
    );

    /* -----------------------------------------------------
       HASH ROUTING
       ----------------------------------------------------- */

    useEffect(() => {

        const handleHashChange = () => {

            const currentPage =
                window.location.hash.replace("#/", "") ||
                "home";

            setPage(currentPage);
        };

        window.addEventListener(
            "hashchange",
            handleHashChange
        );

        return () => {

            window.removeEventListener(
                "hashchange",
                handleHashChange
            );

        };

    }, []);

    /* -----------------------------------------------------
       NAVIGATION
       ----------------------------------------------------- */

    const go = (pageName) => {

        window.location.hash =
            `/${pageName}`;

    };

    /* -----------------------------------------------------
       LOGIN
       ----------------------------------------------------- */

    const handleLogin = (loginData) => {

        saveAuth(loginData);

        setAuth(loginData);

        go("dashboard");
    };

    /* -----------------------------------------------------
       LOGOUT
       ----------------------------------------------------- */

    const handleLogout = () => {

        clearAuth();

        setAuth(null);

        go("home");
    };

    /* =====================================================
       WEBSITE
       ===================================================== */

    return (
        <>

            {/* =================================================
                HEADER
               ================================================= */}

            <header>

                <div
                    className="logo"
                    onClick={() => go("home")}
                >
                    D
                    <span>
                        DDK Job Portal
                    </span>
                </div>


                {/* Navigation */}

                <nav>

                    <button
                        onClick={() =>
                            go("home")
                        }
                    >
                        Home
                    </button>


                    <button
                        onClick={() =>
                            go("jobs")
                        }
                    >
                        Jobs
                    </button>


                    {auth?.role === "JOB_SEEKER" && (

                        <button
                            onClick={() =>
                                go("apps")
                            }
                        >
                            My Applications
                        </button>

                    )}


                    {auth?.role === "RECRUITER" && (

                        <button
                            onClick={() =>
                                go("recruiter")
                            }
                        >
                            Recruiter
                        </button>

                    )}


                    {auth?.role === "ADMIN" && (

                        <button
                            onClick={() =>
                                go("admin")
                            }
                        >
                            Admin
                        </button>

                    )}

                </nav>


                {/* User area */}

                <div>

                    {auth ? (

                        <>

                            <b className="who">
                                {auth.fullName}
                            </b>

                            <button
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </>

                    ) : (

                        <>

                            <button
                                onClick={() =>
                                    go("login")
                                }
                            >
                                Login
                            </button>

                            <button
                                className="primary"
                                onClick={() =>
                                    go("register")
                                }
                            >
                                Register
                            </button>

                        </>

                    )}

                </div>

            </header>


            {/* =================================================
                PAGE ROUTES
               ================================================= */}

            <main>

                {page === "home" && (
                    <Home go={go} />
                )}


                {page === "login" && (
                    <Login
                        setAuth={handleLogin}
                        go={go}
                    />
                )}


                {page === "register" && (
                    <Register go={go} />
                )}


                {page === "jobs" && (
                    <Jobs go={go} />
                )}


                {page === "job" && (
                    <JobDetails go={go} />
                )}


                {page === "apps" && (
                    <ProtectedPage
                        role="JOB_SEEKER"
                        go={go}
                    >
                        <MyApplications />
                    </ProtectedPage>
                )}


                {page === "recruiter" && (
                    <ProtectedPage
                        role="RECRUITER"
                        go={go}
                    >
                        <RecruiterDashboard />
                    </ProtectedPage>
                )}


                {page === "admin" && (
                    <ProtectedPage
                        role="ADMIN"
                        go={go}
                    >
                        <AdminDashboard />
                    </ProtectedPage>
                )}


                {page === "dashboard" && (
                    <Dashboard
                        auth={auth}
                        go={go}
                    />
                )}

            </main>


            {/* =================================================
                FOOTER
               ================================================= */}

            <footer>

                © 2026 DDK Job Portal
                · React + Spring Boot + JWT

            </footer>

        </>
    );
}


/* =========================================================
   HOME
   ========================================================= */

function Home({ go }) {

    return (

        <section className="hero">

            <div>

                <small>
                    SMART JOB SEARCH
                </small>

                <h1>
                    Find your next opportunity.
                </h1>

                <p>
                    Browse jobs, apply securely,
                    and manage your applications
                    from one place.
                </p>

                <button
                    className="primary big"
                    onClick={() => go("jobs")}
                >
                    Explore Jobs
                </button>

            </div>


            <div className="heroBox">

                <b>
                    JOB PORTAL
                </b>

                <h2>
                    One place for seekers
                    and recruiters
                </h2>

                <p>
                    Connected directly to your
                    Spring Boot backend.
                </p>

            </div>

        </section>
    );
}


/* =========================================================
   LOGIN
   ========================================================= */

function Login({ setAuth, go }) {

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const submit = async (event) => {

        event.preventDefault();

        setError("");

        setLoading(true);

        try {

            const data = await api(
                "/auth/login",
                {
                    method: "POST",
                    body: JSON.stringify(form)
                }
            );

            /*
             * Backend LoginResponse:
             *
             * token
             * id
             * fullName
             * email
             * role
             */

            setAuth(data);

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <AuthForm
            title="Welcome Back"
            onSubmit={submit}
        >

            <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) =>
                    setForm({
                        ...form,
                        email: value
                    })
                }
            />


            <Field
                label="Password"
                type="password"
                value={form.password}
                onChange={(value) =>
                    setForm({
                        ...form,
                        password: value
                    })
                }
            />


            {error && (
                <div className="err">
                    {error}
                </div>
            )}


            <button
                className="primary"
                disabled={loading}
            >
                {loading
                    ? "Logging in..."
                    : "Login"}
            </button>


            <p>

                Don't have an account?

                <button
                    type="button"
                    onClick={() =>
                        go("register")
                    }
                >
                    Create account
                </button>

            </p>

        </AuthForm>
    );
}


/* =========================================================
   REGISTER
   ========================================================= */

function Register({ go }) {

    const [form, setForm] = useState({

        fullName: "",
        email: "",
        password: "",
        phone: "",
        role: "JOB_SEEKER"

    });

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const submit = async (event) => {

        event.preventDefault();

        setError("");

        setLoading(true);

        try {

            await api(
                "/auth/register",
                {
                    method: "POST",
                    body: JSON.stringify(form)
                }
            );

            alert(
                "Registration successful. Please login."
            );

            go("login");

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <AuthForm
            title="Create Account"
            onSubmit={submit}
        >

            <Field
                label="Full Name"
                value={form.fullName}
                onChange={(value) =>
                    setForm({
                        ...form,
                        fullName: value
                    })
                }
            />


            <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) =>
                    setForm({
                        ...form,
                        email: value
                    })
                }
            />


            <Field
                label="Phone"
                value={form.phone}
                onChange={(value) =>
                    setForm({
                        ...form,
                        phone: value
                    })
                }
            />


            <Field
                label="Password"
                type="password"
                value={form.password}
                onChange={(value) =>
                    setForm({
                        ...form,
                        password: value
                    })
                }
            />


            <label>

                Role

                <select
                    value={form.role}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            role: event.target.value
                        })
                    }
                >

                    <option value="JOB_SEEKER">
                        Job Seeker
                    </option>

                    <option value="RECRUITER">
                        Recruiter
                    </option>

                    <option value="ADMIN">
                        Admin
                    </option>

                </select>

            </label>


            {error && (
                <div className="err">
                    {error}
                </div>
            )}


            <button
                className="primary"
                disabled={loading}
            >
                {loading
                    ? "Creating..."
                    : "Register"}
            </button>

        </AuthForm>
    );
}


/* =========================================================
   JOB LIST
   ========================================================= */

function Jobs({ go }) {

    const [jobs, setJobs] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        loadJobs();

    }, []);


    const loadJobs = async () => {

        try {

            const data =
                await api("/jobs");

            setJobs(data);

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);

        }

    };


    const filteredJobs =
        jobs.filter((job) => {

            const text = [
                job.title,
                job.description,
                job.companyName,
                job.location,
                job.salary,
                job.experience,
                job.jobType,
                job.skills
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return text.includes(
                search.toLowerCase()
            );

        });


    return (

        <section className="page">

            <small>
                OPPORTUNITIES
            </small>

            <h1>
                Available Jobs
            </h1>


            <input
                className="search"
                placeholder="Search jobs, companies, skills..."
                value={search}
                onChange={(event) =>
                    setSearch(
                        event.target.value
                    )
                }
            />


            {error && (
                <div className="err">
                    {error}
                </div>
            )}


            {loading && (
                <p>
                    Loading jobs...
                </p>
            )}


            {!loading &&
                !error &&
                filteredJobs.length === 0 && (

                    <p>
                        No jobs found.
                    </p>

                )}


            <div className="grid">

                {filteredJobs.map((job) => (

                    <JobCard
                        key={job.id}
                        job={job}
                        go={go}
                    />

                ))}

            </div>

        </section>
    );
}


/* =========================================================
   JOB CARD
   ========================================================= */

function JobCard({ job, go }) {

    const openJob = () => {

        localStorage.setItem(
            "job",
            JSON.stringify(job)
        );

        go("job");
    };


    return (

        <article>

            <div className="mark">
                {job.companyName?.charAt(0) ||
                    "J"}
            </div>


            <h2>
                {job.title}
            </h2>


            <b>
                {job.companyName}
            </b>


            <p>
                📍 {job.location}
            </p>


            <p>
                {job.description}
            </p>


            <strong>
                {job.salary ||
                    "Salary not specified"}
            </strong>


            <button
                className="primary"
                onClick={openJob}
            >
                View Job
            </button>

        </article>
    );
}


/* =========================================================
   JOB DETAILS
   ========================================================= */

function JobDetails({ go }) {

    const [job, setJob] =
        useState(null);

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    useEffect(() => {

        const savedJob =
            localStorage.getItem("job");

        if (savedJob) {

            try {

                setJob(
                    JSON.parse(savedJob)
                );

            } catch {

                setJob(null);

            }

        }

    }, []);


    if (!job) {

        return (

            <section className="page">

                <h1>
                    Job not found
                </h1>

                <button
                    className="primary"
                    onClick={() =>
                        go("jobs")
                    }
                >
                    Back to Jobs
                </button>

            </section>

        );
    }


    const applyForJob = async () => {

        const currentAuth =
            getAuth();


        if (!currentAuth) {

            go("login");

            return;
        }


        if (
            currentAuth.role !==
            "JOB_SEEKER"
        ) {

            setMessage(
                "Only Job Seekers can apply for jobs."
            );

            return;
        }


        setLoading(true);

        setMessage("");


        try {

            await api(
                `/applications/apply/${job.id}`,
                {
                    method: "POST"
                }
            );


            setMessage(
                "Application submitted successfully!"
            );

        } catch (error) {

            setMessage(
                error.message
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <section className="page">

            <button
                onClick={() =>
                    go("jobs")
                }
            >
                ← Back to Jobs
            </button>


            <div className="heroBox">

                <div className="mark">

                    {job.companyName?.charAt(0) ||
                        "J"}

                </div>


                <h1>
                    {job.title}
                </h1>


                <h2>
                    {job.companyName}
                </h2>


                <p>
                    📍 {job.location}
                </p>


                <p>
                    💰 {job.salary ||
                        "Salary not specified"}
                </p>


                <p>
                    👤 {job.experience ||
                        "Experience not specified"}
                </p>


                <p>
                    💼 {job.jobType ||
                        "Full Time"}
                </p>


                <h2>
                    Description
                </h2>

                <p>
                    {job.description}
                </p>


                <h2>
                    Skills
                </h2>

                <p>
                    {job.skills ||
                        "Not specified"}
                </p>


                <button
                    className="primary"
                    onClick={applyForJob}
                    disabled={loading}
                >
                    {loading
                        ? "Applying..."
                        : "Apply for this Job"}
                </button>


                {message && (

                    <div className="ok">
                        {message}
                    </div>

                )}

            </div>

        </section>
    );
}


/* =========================================================
   MY APPLICATIONS
   ========================================================= */

function MyApplications() {

    const [applications, setApplications] =
        useState([]);

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        api("/applications/my")
            .then(setApplications)
            .catch((error) =>
                setError(error.message)
            )
            .finally(() =>
                setLoading(false)
            );

    }, []);


    return (

        <section className="page">

            <small>
                JOB SEEKER
            </small>

            <h1>
                My Applications
            </h1>


            {loading && (
                <p>
                    Loading applications...
                </p>
            )}


            {error && (
                <div className="err">
                    {error}
                </div>
            )}


            {!loading &&
                !error &&
                applications.length === 0 && (

                    <p>
                        You haven't applied
                        for any jobs yet.
                    </p>

                )}


            {applications.map(
                (application) => (

                    <article
                        className="row"
                        key={application.id}
                    >

                        <b>
                            {application.job?.title ||
                                "Job"}
                        </b>

                        <span>
                            {application.job?.companyName ||
                                "Company"}

                            {" · "}

                            {application.status ||
                                "APPLIED"}
                        </span>

                    </article>

                )
            )}

        </section>
    );
}


/* =========================================================
   RECRUITER DASHBOARD
   ========================================================= */

function RecruiterDashboard() {

    const [applications, setApplications] =
        useState([]);

    const [jobs, setJobs] =
        useState([]);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [showCreateForm, setShowCreateForm] =
        useState(false);

    const [loading, setLoading] =
        useState(false);


    const [job, setJob] = useState({

        title: "",
        description: "",
        companyName: "",
        location: "",
        salary: "",
        experience: "",
        jobType: "Full Time",
        skills: ""

    });


    useEffect(() => {

        loadRecruiterData();

    }, []);


    const loadRecruiterData = async () => {

        try {

            const [
                applicationData,
                jobData
            ] = await Promise.all([

                api(
                    "/applications/recruiter"
                ),

                api("/jobs")

            ]);

            setApplications(
                applicationData
            );

            setJobs(jobData);

        } catch (error) {

            setError(
                error.message
            );

        }

    };


    const createJob = async (event) => {

        event.preventDefault();

        setError("");

        setMessage("");

        setLoading(true);


        try {

            await api(
                "/jobs",
                {
                    method: "POST",
                    body: JSON.stringify(job)
                }
            );


            setMessage(
                "Job created successfully!"
            );


            setJob({

                title: "",
                description: "",
                companyName: "",
                location: "",
                salary: "",
                experience: "",
                jobType: "Full Time",
                skills: ""

            });


            setShowCreateForm(false);

            await loadRecruiterData();

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <section className="page">

            <small>
                RECRUITER DASHBOARD
            </small>

            <h1>
                Recruiter Dashboard
            </h1>


            <p>
                {applications.length}
                {" "}
                application(s)
            </p>


            <button
                className="primary"
                onClick={() =>
                    setShowCreateForm(
                        !showCreateForm
                    )
                }
            >
                {showCreateForm
                    ? "Close"
                    : "Create Job"}
            </button>


            {error && (

                <div className="err">
                    {error}
                </div>

            )}


            {message && (

                <div className="ok">
                    {message}
                </div>

            )}


            {/* =================================================
                CREATE JOB
               ================================================= */}

            {showCreateForm && (

                <form
                    className="heroBox"
                    onSubmit={createJob}
                >

                    <h2>
                        Create New Job
                    </h2>


                    <Field
                        label="Job Title"
                        value={job.title}
                        onChange={(value) =>
                            setJob({
                                ...job,
                                title: value
                            })
                        }
                    />


                    <Field
                        label="Company Name"
                        value={job.companyName}
                        onChange={(value) =>
                            setJob({
                                ...job,
                                companyName: value
                            })
                        }
                    />


                    <Field
                        label="Location"
                        value={job.location}
                        onChange={(value) =>
                            setJob({
                                ...job,
                                location: value
                            })
                        }
                    />


                    <Field
                        label="Salary"
                        value={job.salary}
                        onChange={(value) =>
                            setJob({
                                ...job,
                                salary: value
                            })
                        }
                    />


                    <Field
                        label="Experience"
                        value={job.experience}
                        onChange={(value) =>
                            setJob({
                                ...job,
                                experience: value
                            })
                        }
                    />


                    <Field
                        label="Job Type"
                        value={job.jobType}
                        onChange={(value) =>
                            setJob({
                                ...job,
                                jobType: value
                            })
                        }
                    />


                    <Field
                        label="Skills"
                        value={job.skills}
                        onChange={(value) =>
                            setJob({
                                ...job,
                                skills: value
                            })
                        }
                    />


                    <label>

                        Description

                        <textarea
                            rows="6"
                            required
                            value={
                                job.description
                            }
                            onChange={(event) =>
                                setJob({
                                    ...job,
                                    description:
                                        event.target.value
                                })
                            }
                        />

                    </label>


                    <button
                        className="primary"
                        disabled={loading}
                    >
                        {loading
                            ? "Publishing..."
                            : "Publish Job"}
                    </button>

                </form>

            )}


            {/* =================================================
                APPLICATIONS
               ================================================= */}

            <h2>
                Applications
            </h2>


            {applications.length === 0 ? (

                <p>
                    No applications yet.
                </p>

            ) : (

                applications.map(
                    (application) => (

                        <article
                            className="row"
                            key={application.id}
                        >

                            <b>
                                {application.job?.title ||
                                    "Job"}
                            </b>


                            <span>

                                {application.applicant?.fullName ||
                                    application.applicant?.email ||
                                    "Applicant"}

                                {" · "}

                                {application.status ||
                                    "APPLIED"}

                            </span>

                        </article>

                    )
                )

            )}

        </section>
    );
}


/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */

function AdminDashboard() {

    const [result, setResult] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const testAdmin = async () => {

        setLoading(true);

        try {

            const response =
                await api(
                    "/admin/test"
                );

            setResult(response);

        } catch (error) {

            setResult(
                error.message
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <section className="page">

            <small>
                ADMIN
            </small>

            <h1>
                Admin Dashboard
            </h1>


            <p>
                Administration area
            </p>


            <button
                className="primary"
                onClick={testAdmin}
                disabled={loading}
            >
                {loading
                    ? "Testing..."
                    : "Test Admin API"}
            </button>


            {result && (

                <div className="ok">
                    {result}
                </div>

            )}

        </section>
    );
}


/* =========================================================
   DASHBOARD ROUTER
   ========================================================= */

function Dashboard({ auth, go }) {

    if (!auth) {

        go("login");

        return null;
    }


    if (auth.role === "JOB_SEEKER") {

        return (
            <MyApplications />
        );

    }


    if (auth.role === "RECRUITER") {

        return (
            <RecruiterDashboard />
        );

    }


    if (auth.role === "ADMIN") {

        return (
            <AdminDashboard />
        );

    }


    return (

        <section className="page">

            <h1>
                Unknown Role
            </h1>

        </section>

    );
}


/* =========================================================
   FRONTEND ROLE PROTECTION
   ========================================================= */

function ProtectedPage({
    role,
    go,
    children
}) {

    const currentAuth =
        getAuth();


    if (!currentAuth) {

        go("login");

        return null;
    }


    if (currentAuth.role !== role) {

        return (

            <section className="page">

                <h1>
                    403 — Forbidden
                </h1>

                <p>
                    You don't have permission
                    to access this page.
                </p>

                <button
                    className="primary"
                    onClick={() =>
                        go("dashboard")
                    }
                >
                    Go to Dashboard
                </button>

            </section>

        );
    }


    return children;
}


/* =========================================================
   AUTH FORM
   ========================================================= */

function AuthForm({
    title,
    onSubmit,
    children
}) {

    return (

        <section className="auth">

            <form onSubmit={onSubmit}>

                <div className="logo">
                    D
                </div>

                <h1>
                    {title}
                </h1>

                {children}

            </form>

        </section>
    );
}


/* =========================================================
   INPUT FIELD
   ========================================================= */

function Field({
    label,
    type = "text",
    value,
    onChange
}) {

    return (

        <label>

            {label}

            <input
                required
                type={type}
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
            />

        </label>
    );
}


/* =========================================================
   START APPLICATION
   ========================================================= */

createRoot(
    document.getElementById("root")
).render(
    <App />
);