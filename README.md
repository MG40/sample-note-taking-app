# Sample Note Taking App
This repository contains a simple web application for taking notes, built with Node.js (Express, EJS, Marked) and MongoDB. It demonstrates a structured approach to project organization, separating application source code, containerization assets, and Kubernetes deployment manifests into distinct directories.

## Overview: Why Three Directories?
This project is organized into three main directories to clearly separate different aspects of the application's lifecycle and deployment:

### `01-code/` - Application Source Code
This directory holds the core Node.js application logic, including:

- `index.js`: The main Express server.

- `package.json / package-lock.json`: Node.js project dependencies.

- `views/`: EJS templates for the user interface.

- `public/`: Static assets like CSS and a placeholder for user uploads (uploads/).

- **Purpose**: This is the standalone, runnable application code. It focuses purely on the functionality of the note-taking app.

### `02-container/` - Containerization Assets
This directory contains all files necessary to containerize the 01-code application using Docker:

`Dockerfile`: Instructions to build the Docker image for the Node.js application.

**Purpose**: To package the application into lightweight, portable Docker containers, making it easy to run consistently across different environments.

### `03-k8s/` - Kubernetes Deployment Manifests
This directory houses the YAML manifest files required to deploy and manage the containerized application and its MongoDB database on a Kubernetes cluster:

`k8s-manifests.yaml`: Defines Kubernetes objects like Deployments, Services, PersistentVolumeClaims, and Secrets for MongoDB and the Node.js app.

**Purpose**: To orchestrate the application's deployment, scaling, and management in a production-like Kubernetes environment.

This separation enhances modularity, maintainability, and clarity, allowing different teams or deployment strategies to focus on their respective concerns without intermingling files.

## Getting Started: How to Use This Repository
This repository provides multiple ways to run the Sample Note Taking App, depending on your environment and preference:

### 1. Run Locally (Node.js & MongoDB on Host):
If you want to run the application directly using Node.js and have a MongoDB instance running on your host machine.

- **Instructions:** Refer to the `README.md` inside the `01-code/` directory.

### 2. Run with Docker Compose (Local Docker Containers):
The recommended way for local development. This uses Docker Compose to spin up both the application and a MongoDB database in separate Docker containers.

- **Instructions:** Refer to the `README.md` inside the `02-container/` directory.

### 3. Deploy to Kubernetes (Minikube):
For a more production-like deployment experience using Kubernetes (e.g., Minikube for local testing).

- **Instructions:** Refer to the `README.md` inside the `03-k8s/` directory.

Choose the method that best suits your needs, and follow the detailed instructions in the respective subdirectory's `README.md`.

# Disclaimer
This "Sample Note Taking App" is provided strictly for demonstration, educational, and learning purposes only. It is NOT intended for production use.

**Not Production-Ready:** This application is a simplified example and does not include the robust error handling, comprehensive security measures, advanced scalability patterns, or detailed logging/monitoring typically required for a production environment.

**Security:** While Kubernetes Secrets are used for database credentials in the 03-k8s manifests (a good practice), the default "admin/password" credentials are for demonstration. Always use strong, unique, and securely managed credentials in any real-world deployment.

**No Guarantees or Responsibility:** The owner and contributors of this repository make no guarantees regarding the application's functionality, security, or suitability for any purpose. The owner takes no responsibility for any issues, damages, or consequences arising from the use or misuse of this code.

**Use at Your Own Risk:** You are solely responsible for any decisions made or actions taken based on the information or code provided in this repository.

Please review the code, understand its limitations, and enhance it with appropriate production-grade features and security hardening before considering any deployment beyond development or personal learning.
