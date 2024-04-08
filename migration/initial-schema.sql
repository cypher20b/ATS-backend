
CREATE TABLE Applicants (
    ApplicantID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Email VARCHAR(255),
    Phone VARCHAR(20),
    Resume TEXT,
    CoverLetter TEXT
);

CREATE TABLE Recruiters (
    RecruiterID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE,
    Password VARCHAR(255),
    Designation VARCHAR(255),
    Specialty VARCHAR(255),
    Phone VARCHAR(20)
);

CREATE TABLE JobPostings (
    JobID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    Company VARCHAR(255),
    Location VARCHAR(255),
    Category VARCHAR(100),
    EmploymentType VARCHAR(100),
    Salary DECIMAL(10, 2),
    Requirements TEXT,
    Responsibilities TEXT,
    PostedDate DATE,
    ExpiryDate DATE,
    ContactEmail VARCHAR(255),
    ContactPhone VARCHAR(20),
    IsActive BOOLEAN DEFAULT TRUE
);



CREATE TABLE JobRecruiters (
    JobID INT,
    RecruiterID INT,
    FOREIGN KEY (JobID) REFERENCES JobPostings(JobID),
    FOREIGN KEY (RecruiterID) REFERENCES Recruiters(RecruiterID),
    PRIMARY KEY (JobID, RecruiterID)
);

CREATE TABLE Emails (
    EmailID INT AUTO_INCREMENT PRIMARY KEY,
    JobID INT,
    RecruiterID INT,
    ApplicantID INT,
    Subject VARCHAR(255),
    Text TEXT,
    FOREIGN KEY (JobID) REFERENCES JobPostings(JobID),
    FOREIGN KEY (RecruiterID) REFERENCES Recruiters(RecruiterID),
    FOREIGN KEY (ApplicantID) REFERENCES Applicants(ApplicantID)
);

CREATE TABLE Applications (
    ApplicationID INT AUTO_INCREMENT PRIMARY KEY,
    JobID INT UNIQUE,
    ApplicantID INT UNIQUE,
    ApplicationDate DATE,
    Email VARCHAR(255),
    CVScore VARCHAR(10),
    Status ENUM('Submitted', 'Under Review', 'Rejected', 'Shortlisted', 'Hired'),
    FOREIGN KEY (JobID) REFERENCES JobPostings(JobID),
    FOREIGN KEY (ApplicantID) REFERENCES Applicants(ApplicantID)
);

