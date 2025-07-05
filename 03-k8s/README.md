# Sample Note Taking App
Welcome to Sample Note Taking App! This is a simple web application built with Node.js, Express, EJS, and MongoDB that allows you to create and manage your notes. You can write plain text notes or use Markdown for formatting, and even attach images to your notes.

This README focuses on deploying the application to a local Kubernetes cluster using Minikube and discusses general principles of data persistence and backup in this environment.

## Features
- **Create Notes:**  Easily add new notes with a description.

- **Markdown Support:** Write notes using Markdown syntax for rich text formatting.

- **Image Uploads:** Attach images to your notes (JPEG, JPG, PNG, GIF formats supported, up to 5MB).

- **Persistent Storage:** All your notes are saved in a MongoDB database, with data persistence handled by Kubernetes Persistent Volumes.

- **Containerized Deployment:** Application and database run in Docker containers orchestrated by Kubernetes.

- **Responsive Design:** A basic, clean interface that works on various screen sizes.

## Prerequisites
Before you can deploy this application, you need to have the following software installed on your machine:

### Docker:

- Docker is used to build the application's container image.

- How to Install: Download the recommended version from the official Docker website: https://docs.docker.com/get-docker/.

### Minikube:

- Minikube is a tool that runs a single-node Kubernetes cluster locally on your machine.

- How to Install: Follow the instructions on the official Minikube website: https://minikube.sigs.k8s.io/docs/start/.

### kubectl:

- `kubectl` is the command-line tool for running commands against Kubernetes clusters.

- How to Install: It's usually installed automatically with Minikube, or you can install it separately: https://kubernetes.io/docs/tasks/tools/install-kubectl/.

## Installation
Follow these steps to get the project set up on your local machine:

### 1. Clone or Download the Repository:
If you have the code in a Git repository, clone it:

    git clone <your-repository-url>
    cd <your-project-folder>

If you downloaded a ZIP file, extract it and navigate into the project folder.

### 2. Create Necessary Directories:
Ensure these directories exist in your project's root:

- `views:` Contains your EJS template files.

- `public/uploads:` This is where uploaded images will be stored (though this directory will be inside the container, it's good to have it for local context).

You can create them manually or use these commands from your project's root:

    mkdir -p views
    mkdir -p public/uploads

### 3.Place Application Files:

- Make sure your main application file (`app.js` or `index.js`), `Dockerfile`, and `k8s-manifests.yaml` (or whatever you named your Kubernetes manifest file) are all in the project's root directory.

- Place the `index.ejs` file inside the `views` directory.

## Running the Application on Minikube
Follow these steps carefully to deploy your application to your local Minikube cluster.

### 1. Start Minikube Cluster:
If your Minikube cluster is not already running, start it:

    minikube start

### 2. Create Kubernetes Secret for MongoDB Credentials:
This secret stores your database username and password securely. Replace `your_secure_password` with a strong password!

    kubectl create secret generic mongodb-creds \
        --from-literal=username=admin \
        --from-literal=password=your_secure_password

### 3. Configure Docker to use Minikube's Daemon:
This crucial step ensures that the Docker image for your application is built directly into the Minikube VM's Docker environment, making it accessible to Kubernetes.

    eval $(minikube docker-env)

You will see output confirming that your shell's Docker environment variables have been set.

### 4. Build Your Node.js Application Docker Image (into Minikube):
Navigate to your project's root directory (where your Dockerfile is) and build the image:

    docker build -t sample-note-app .

You should see the build process complete successfully. You can verify the image is now in Minikube's Docker daemon by running docker images.

### 5. Apply Kubernetes Manifests:
This command creates all the necessary Kubernetes resources (Deployments, Services, Persistent Volume Claim) for your application and database.

    kubectl apply -f k8s-manifests.yaml

You should see confirmation messages for each resource being created.

### 6. Verify Deployment Status:
It takes a moment for Kubernetes to pull images and start the pods. Check their status:

    kubectl get pods

Wait until both `mongodb-deployment-...` and `note-app-deployment-...` pods show a `STATUS` of `Running` and `READY` as `1/1`.

### 7. Access the Application:
Minikube provides a convenient command to get the URL for NodePort services:

    minikube service note-app-service --url

This command will output the URL (e.g., `http://192.168.49.2:30080)` where your "Sample Note Taking App" is accessible. Copy that URL and paste it into your web browser.

## Usage
- ### Adding a Note:

- Type your note's description into the large text area.

- You can use Markdown syntax (e.g., **bold**, *italic*, # Heading, [link](url)) for formatting.

- To attach an image, click "Choose File" and select an image from your computer.

- Click the "Save Note" button.

- ### Viewing Notes:

- Your notes will appear below the form, with the most recent ones at the top.

- Markdown will be rendered as HTML, and attached images will be displayed.

## Additional Notes on Deployment
### Graceful Startup and MongoDB Connection
Your Node.js application is designed for a graceful startup in dynamic environments like Kubernetes. The initMongo() function within app.js implements a retry mechanism:

- It continuously attempts to connect to the MongoDB database.

- It introduces a 1-second delay between connection attempts, preventing a rapid flood of requests if MongoDB is still initializing or temporarily unavailable.

- The application's web server (Express) will only start listening for incoming requests after a successful connection to MongoDB is established. This ensures that the application is fully functional before it's accessible.

### Kubernetes Data Persistence Flow
When you deploy your application to Kubernetes, the flow for data persistence and application startup is as follows:

**1. Persistent Volume Claim (PVC) Provisioning:** Kubernetes first processes the PersistentVolumeClaim (e.g., mongo-pvc) defined in your manifests. It dynamically provisions the actual underlying storage (PersistentVolume) and binds it to your PVC. This storage is made ready before your database pod attempts to start.

**2. MongoDB Pod Startup and Volume Mounting:** The MongoDB deployment then initiates its pods. Kubernetes ensures that the provisioned persistent volume is correctly mounted to the /data/db directory inside the MongoDB container. The MongoDB database process then starts up, using this mounted volume for its data.

**3. Node.js Application Pod Startup and Database Connection:** Your Node.js application pods start. As soon as the application process begins, its initMongo() function (as described above) begins actively attempting to connect to the MongoDB service. It will patiently retry until MongoDB is fully initialized and ready to accept connections. Only then does your Node.js application's web server become active and accessible.

This sequence ensures that your application always has a ready database connection before it's exposed to users.

## Data Persistence and Backup Strategy
In Kubernetes, applications like this note-taking app, which store data (your notes in MongoDB), are considered stateful. Kubernetes provides mechanisms to ensure this data persists even if pods restart or are rescheduled.

- ### Persistent Volumes (PVs) and Persistent Volume Claims (PVCs):

    - Your MongoDB database uses a PersistentVolumeClaim (mongo-pvc) to request a piece of storage from the Kubernetes cluster.

    - Kubernetes then provisions a PersistentVolume (PV) – which is the actual storage (e.g., a disk on the underlying infrastructure) – and binds it to your PVC.

    - This ensures that your MongoDB data (/data/db inside the container) is stored on this persistent disk, separate from the ephemeral lifecycle of the MongoDB pod. If the pod crashes or is deleted, the data on the PV remains intact.

- ### Backup Considerations for Stateful Applications:
While PVs ensure data persistence within the cluster, they do not inherently provide a backup or disaster recovery solution for your data outside of the cluster. To protect your notes against cluster failure, accidental deletion, or other disasters, a comprehensive backup strategy is essential.

A robust backup strategy for Kubernetes stateful applications typically involves two main components:

### 1.  Backing up Application Data:
- This involves capturing the actual data stored within your Persistent Volumes (e.g., the MongoDB database files).

- The most common method is to use volume snapshots, which create point-in-time copies of the underlying storage. For databases, it's crucial that these snapshots are "application-consistent," meaning the database is in a stable state (e.g., temporarily paused or flushed) when the snapshot is taken to prevent data corruption.

- These snapshots are then usually exported to a durable, off-cluster storage location (like cloud object storage) for long-term retention and disaster recovery.

### 2. Backing up Kubernetes Configuration and Application State:

- This involves capturing the definitions of all your Kubernetes resources that make up your application (Deployments, Services, Persistent Volume Claims, Secrets, ConfigMaps, etc.).

- These YAML manifests themselves are often stored in version control systems (like Git) as part of an Infrastructure as Code (IaC) approach.

- Additionally, specialized tools can capture the live state of your Kubernetes API objects, including their metadata and relationships, which is vital for a complete application restore.

By combining these two aspects, you can ensure that both your application's data and its entire configuration can be fully restored to the same or a different Kubernetes cluster in the event of a disaster.

## Stopping and Cleaning Up
When you're finished using the application and want to free up resources, you can delete the Kubernetes resources:

### 1. Delete Kubernetes Resources:

    kubectl delete -f k8s-manifests.yaml

This will remove the deployments, services, and the Persistent Volume Claim.

### 2. Stop Minikube (Optional):
If you want to stop the Minikube cluster entirely:

    minikube stop

Enjoy using your Sample Note Taking App on Kubernetes!