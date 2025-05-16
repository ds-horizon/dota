-- DOTA Server: Initial Database Schema

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS apps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS deployments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    key VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (app_id) REFERENCES apps(id)
);

CREATE TABLE IF NOT EXISTS releases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deployment_id INT NOT NULL,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    mandatory BOOLEAN DEFAULT FALSE,
    rollout INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deployment_id) REFERENCES deployments(id)
);

-- Add more tables as needed for your features (metrics, sessions, etc.) 