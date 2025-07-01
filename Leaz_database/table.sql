-- =====================================================================
-- Document & Binder Database Schema
--
-- This script creates two new tables:
-- 'binders' and 'documents', with a relationship between them.
-- =====================================================================


-- Drop tables in reverse order of creation to avoid foreign key errors.
DROP TABLE IF EXISTS `documents`;
DROP TABLE IF EXISTS `binders`;


-- =====================================================================
-- Create Binders Table
-- =====================================================================
CREATE TABLE `binders` (
    -- `id`: Unique identifier for each binder.
    `id` INT AUTO_INCREMENT PRIMARY KEY,

    -- `name`: The name of the binder, cannot be empty.
    `name` VARCHAR(255) NOT NULL,

    -- `date_created`: Automatically records when the binder was created.
    `date_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =====================================================================
-- Create Documents Table
-- =====================================================================
CREATE TABLE `documents` (
    -- `id`: Unique identifier for each document.
    `id` INT AUTO_INCREMENT PRIMARY KEY,

    -- `title`: The title of the document, cannot be empty.
    `title` VARCHAR(255) NOT NULL,

    -- `content`: The actual text content of the document.
    -- Using LONGTEXT allows for very large documents.
    `content` LONGTEXT,

    -- `version`: An integer to track document versions (e.g., 1, 2, 3).
    `version` INT NOT NULL DEFAULT 1,

    -- `date_created`: Automatically records when the document was first created.
    `date_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- `last_modified`: Records when the document was last updated.
    -- This field updates automatically whenever the row is changed.
    `last_modified` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- `status`: The status of the document (e.g., 'Draft', 'Final').
    `status` ENUM('Draft', 'In Review', 'Final', 'Archived') DEFAULT 'Draft',

    -- `binder_id`: Links to the 'id' in the 'binders' table.
    -- A document does not have to be in a binder.
    `binder_id` INT NULL,

    -- `FOREIGN KEY`: Creates the link between documents and binders.
    -- `ON DELETE SET NULL`: If a binder is deleted, documents inside it
    -- will not be deleted, just un-assigned from the binder.
    FOREIGN KEY (`binder_id`) REFERENCES `binders`(`id`) ON DELETE SET NULL
);


-- =====================================================================
-- Insert Sample Data
-- =====================================================================

-- Create two sample binders.
INSERT INTO `binders` (id, name) VALUES
(1, 'Q3 Client Contracts'),
(2, 'Internal Policies');

-- Create some sample documents.
INSERT INTO `documents` (title, content, status, binder_id) VALUES
('Project Proposal V1', 'This is the first draft of the project proposal...', 'In Review', 1),
('Meeting Notes Q2', 'Discussion points from the Q2 stakeholder meeting...', 'Final', 1),
('Annual Report 2024', 'Initial draft of the 2024 annual report...', 'Draft', 2),
('Onboarding Checklist', 'Checklist for new employee onboarding...', 'Final', NULL);


-- =====================================================================
-- Verify the Data
-- =====================================================================

SELECT * FROM `binders`;
SELECT * FROM `documents`;