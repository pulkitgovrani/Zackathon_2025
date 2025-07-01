-- =====================================================================
-- Document & Binder Database Schema
--
-- This script creates two new tables:
-- 'binders' and 'documents', with a relationship between them.
-- =====================================================================


-- Also drop the new tables in reverse order of creation to avoid foreign key errors.
-- This makes the script safely re-runnable during development.
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

    -- `name`: The name of the document, cannot be empty.
    `name` VARCHAR(255) NOT NULL,

    -- `date_created`: Automatically records when the document was created.
    `date_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- `status`: The status of the document (e.g., 'Draft', 'Final').
    -- ENUM limits the possible values for this column.
    `status` ENUM('Draft', 'In Review', 'Final', 'Archived') DEFAULT 'Draft',

    -- `binder_id`: An integer that links to the 'id' in the 'binders' table.
    -- This column CAN be NULL, meaning a document doesn't have to be in a binder.
    `binder_id` INT NULL,

    -- `FOREIGN KEY`: This creates the official link between the two tables.
    -- `ON DELETE SET NULL`: If a binder is deleted, the `binder_id` for any
    -- documents inside it will be set to NULL, so the documents aren't lost.
    FOREIGN KEY (`binder_id`) REFERENCES `binders`(`id`) ON DELETE SET NULL
);


-- =====================================================================
-- Insert Sample Data
-- =====================================================================

-- Create two sample binders.
INSERT INTO `binders` (id, name) VALUES (1, 'starting'), (2, 'test');

-- Create some sample documents.
INSERT INTO `documents` (name, status, binder_id) VALUES
('Project Proposal', 'In Review', 1),      -- This document is in Binder #1
('Meeting Notes Q2', 'Final', 1),          -- This document is also in Binder #1
('Annual Report 2024', 'Draft', 2),        -- This document is in Binder #2
('Onboarding Checklist', 'Final', NULL);   -- This document is NOT in any binder


-- =====================================================================
-- Verify the Data
-- =====================================================================

-- Show the contents of the 'binders' table.
SELECT * FROM `binders`;

-- Show the contents of the 'documents' table.
SELECT * FROM `documents`;