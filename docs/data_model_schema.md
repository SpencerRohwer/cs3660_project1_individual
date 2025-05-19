# Resources Hub - Data Model & Schema Design

## Overview
This document outlines the data model for the Resources Hub platform, designed to support project showcasing, user management, file storage, version control, and search functionality for Web Programming II courses.

---

## Core Entities

### 1. Users Table
```sql
CREATE TABLE users (
    user_id         SERIAL PRIMARY KEY,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    role            ENUM('student', 'instructor', 'admin') DEFAULT 'student',
    student_id      VARCHAR(50),
    profile_image   VARCHAR(500),
    bio             TEXT,
    github_username VARCHAR(100),
    linkedin_url    VARCHAR(500),
    portfolio_url   VARCHAR(500),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active       BOOLEAN DEFAULT TRUE,
    storage_used_mb DECIMAL(10,2) DEFAULT 0.00,
    storage_limit_mb DECIMAL(10,2) DEFAULT 2048.00
);
```

### 2. Projects Table
```sql
CREATE TABLE projects (
    project_id      SERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    author_id       INT NOT NULL,
    live_demo_url   VARCHAR(500),
    repository_url  VARCHAR(500),
    thumbnail_path  VARCHAR(500),
    is_public       BOOLEAN DEFAULT TRUE,
    is_featured     BOOLEAN DEFAULT FALSE,
    status          ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    view_count      INT DEFAULT 0,
    download_count  INT DEFAULT 0,
    average_rating  DECIMAL(3,2) DEFAULT 0.00,
    total_ratings   INT DEFAULT 0,
    
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### 3. Project Technologies (Many-to-Many relationship)
```sql
CREATE TABLE technologies (
    tech_id         SERIAL PRIMARY KEY,
    name            VARCHAR(100) UNIQUE NOT NULL,
    category        VARCHAR(50),
    color_hex       VARCHAR(7),
    icon_path       VARCHAR(500),
    description     TEXT
);

CREATE TABLE project_technologies (
    project_id      INT,
    tech_id         INT,
    
    PRIMARY KEY (project_id, tech_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (tech_id) REFERENCES technologies(tech_id) ON DELETE CASCADE
);
```

### 4. Project Files & Version Control
```sql
CREATE TABLE project_versions (
    version_id      SERIAL PRIMARY KEY,
    project_id      INT NOT NULL,
    version_number  VARCHAR(20) NOT NULL,
    version_message TEXT,
    created_by      INT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_current      BOOLEAN DEFAULT FALSE,
    total_size_mb   DECIMAL(10,2),
    
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(user_id),
    UNIQUE(project_id, version_number)
);

CREATE TABLE project_files (
    file_id         SERIAL PRIMARY KEY,
    version_id      INT NOT NULL,
    original_name   VARCHAR(255) NOT NULL,
    file_path       VARCHAR(1000) NOT NULL,
    file_type       VARCHAR(100),
    file_size_bytes BIGINT NOT NULL,
    mime_type       VARCHAR(100),
    checksum        VARCHAR(64),
    uploaded_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (version_id) REFERENCES project_versions(version_id) ON DELETE CASCADE
);
```

### 5. Reviews & Comments
```sql
CREATE TABLE project_reviews (
    review_id       SERIAL PRIMARY KEY,
    project_id      INT NOT NULL,
    reviewer_id     INT NOT NULL,
    rating          INT CHECK (rating >= 1 AND rating <= 5),
    comment         TEXT,
    is_public       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE(project_id, reviewer_id)
);

CREATE TABLE review_replies (
    reply_id        SERIAL PRIMARY KEY,
    review_id       INT NOT NULL,
    author_id       INT NOT NULL,
    content         TEXT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (review_id) REFERENCES project_reviews(review_id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### 6. User Activity & Analytics
```sql
CREATE TABLE user_sessions (
    session_id      SERIAL PRIMARY KEY,
    user_id         INT NOT NULL,
    session_token   VARCHAR(255) UNIQUE NOT NULL,
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at      TIMESTAMP NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE project_views (
    view_id         SERIAL PRIMARY KEY,
    project_id      INT NOT NULL,
    viewer_id       INT,
    ip_address      INET,
    referrer        VARCHAR(500),
    viewed_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (viewer_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE download_logs (
    download_id     SERIAL PRIMARY KEY,
    project_id      INT NOT NULL,
    version_id      INT NOT NULL,
    downloader_id   INT,
    ip_address      INET,
    downloaded_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (version_id) REFERENCES project_versions(version_id) ON DELETE CASCADE,
    FOREIGN KEY (downloader_id) REFERENCES users(user_id) ON DELETE SET NULL
);
```

### 7. Search & Tags
```sql
CREATE TABLE tags (
    tag_id          SERIAL PRIMARY KEY,
    name            VARCHAR(100) UNIQUE NOT NULL,
    description     TEXT,
    usage_count     INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_tags (
    project_id      INT,
    tag_id          INT,
    
    PRIMARY KEY (project_id, tag_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE
);

CREATE TABLE search_queries (
    query_id        SERIAL PRIMARY KEY,
    user_id         INT,
    query_text      VARCHAR(500) NOT NULL,
    results_count   INT,
    clicked_result  INT,
    searched_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (clicked_result) REFERENCES projects(project_id) ON DELETE SET NULL
);
```

### 8. Favorites & Collections
```sql
CREATE TABLE user_favorites (
    user_id         INT,
    project_id      INT,
    favorited_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

CREATE TABLE collections (
    collection_id   SERIAL PRIMARY KEY,
    owner_id        INT NOT NULL,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    is_public       BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE collection_projects (
    collection_id   INT,
    project_id      INT,
    added_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (collection_id, project_id),
    FOREIGN KEY (collection_id) REFERENCES collections(collection_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);
```

---

## Indexing Strategy

### Primary Indexes (for performance optimization)
```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_student_id ON users(student_id);

-- Project searches and filtering
CREATE INDEX idx_projects_author ON projects(author_id);
CREATE INDEX idx_projects_status_public ON projects(status, is_public);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_rating ON projects(average_rating DESC);

-- File system
CREATE INDEX idx_project_files_version ON project_files(version_id);
CREATE INDEX idx_project_versions_project ON project_versions(project_id, version_number);

-- Analytics and logs
CREATE INDEX idx_project_views_project_time ON project_views(project_id, viewed_at);
CREATE INDEX idx_download_logs_project_time ON download_logs(project_id, downloaded_at);

-- Search optimization
CREATE INDEX idx_search_queries_text ON search_queries(query_text);
CREATE INDEX idx_tags_name ON tags(name);
```

### Full-Text Search Indexes
```sql
-- Enhanced search capabilities
CREATE FULLTEXT INDEX idx_projects_search 
ON projects(title, description);

CREATE FULLTEXT INDEX idx_technologies_search 
ON technologies(name, description);
```

---

## Data Relationships Summary

**One-to-Many:**
- User → Projects (author relationship)
- Project → Project Versions
- Project Version → Project Files
- Project → Reviews
- Review → Review Replies

**Many-to-Many:**
- Projects ↔ Technologies (via project_technologies)
- Projects ↔ Tags (via project_tags)
- Users ↔ Projects (via user_favorites)
- Collections ↔ Projects (via collection_projects)

**Self-Referencing:**
- Users can follow other users (future enhancement)
- Projects can reference other projects (future enhancement)

---

## Storage Considerations

### File Storage Strategy
- **Local Storage:** Development environment
- **Cloud Storage:** Production (AWS S3, Google Cloud Storage)
- **CDN Integration:** Static assets and thumbnails
- **Backup Strategy:** Daily automated backups with 30-day retention

### Performance Optimization
- **Database Connection Pooling:** Prevent connection exhaustion
- **Caching Layer:** Redis for frequent queries and session data
- **Search Engine:** Elasticsearch for advanced search capabilities
- **Image Processing:** Automatic thumbnail generation and optimization

---

## Security & Privacy

### Data Protection
- All passwords hashed using bcrypt with salt rounds ≥ 12
- File uploads scanned for malware
- User data anonymization for analytics
- GDPR compliance for data deletion requests

### Access Control
- Role-based permissions (student, instructor, admin)
- Project visibility controls (public, private, class-only)
- File access logging for audit trails
- Rate limiting on API endpoints

---

This data model provides a robust foundation for the Resources Hub platform, supporting all required features while maintaining scalability and performance considerations.