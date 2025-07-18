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
-- Verify the Data
-- =====================================================================

SELECT * FROM `binders`;
SELECT * FROM `documents`;