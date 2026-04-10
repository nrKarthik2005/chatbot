# Chatbot DevOps Demo

This project demonstrates:
- React + TypeScript + Vite chatbot frontend
- Google AI Studio API usage directly in frontend
- Docker image build and hosting
- Minikube running with Docker driver
- Ansible automation for Minikube setup
- GitHub Actions CI/CD to Docker Hub
- Kubernetes deployment that pulls image from Docker Hub

## Project Structure

- frontend: React + Vite chatbot app
- Dockerfile: Multi-stage build for frontend static site
- ansible/setup-minikube.yml: Installs Docker, kubectl, Minikube and starts cluster
- kubernetes/minikube.yaml: Deployment + Service for Minikube
- .github/workflows/dockerhub-push.yml: Build and push Docker image to Docker Hub

## 1) Frontend Local Run

1. Copy frontend/.env.example to frontend/.env
2. Put your Google AI Studio key in frontend/.env
3. Run:

   cd frontend
   npm install
   npm run dev

## 2) Build Docker Image Locally

From repository root:

docker build -t YOUR_DOCKERHUB_USERNAME/chatbot-frontend:latest --build-arg VITE_GOOGLE_AI_API_KEY=YOUR_GOOGLE_AI_STUDIO_API_KEY .

Run locally:

docker run --rm -p 8080:80 YOUR_DOCKERHUB_USERNAME/chatbot-frontend:latest

Open http://localhost:8080

## 3) Ansible: Setup Minikube In Docker Driver

Use the ephemeral toolbox container instead of installing Ansible directly on host.
The container includes both Ansible and kubectl, and mounts your current directory to /workspace.

PowerShell (from any folder inside this repo):

./run-toolbox.ps1

Run the Minikube setup playbook from the container:

./run-toolbox.ps1 ansible-playbook -i ansible/inventory.ini ansible/setup-minikube.yml --ask-become-pass

Run kubectl from the same toolbox container:

./run-toolbox.ps1 kubectl get nodes

Linux/macOS:

./run-toolbox.sh ansible-playbook -i ansible/inventory.ini ansible/setup-minikube.yml --ask-become-pass

Before running playbook, update ansible/inventory.ini with your Linux target host details.

## 4) GitHub Actions CI/CD to Docker Hub

Set these repository secrets:
- DOCKERHUB_USERNAME
- DOCKERHUB_TOKEN
- GOOGLE_AI_API_KEY

Push to main branch.
Workflow builds image from Dockerfile and pushes:
- DOCKERHUB_USERNAME/chatbot-frontend:latest
- DOCKERHUB_USERNAME/chatbot-frontend:<commit-sha>

## 5) Minikube Deploy: Pull Image and Run

Edit kubernetes/minikube.yaml and replace:
- YOUR_DOCKERHUB_USERNAME/chatbot-frontend:latest

Deploy:

kubectl apply -f kubernetes/minikube.yaml
kubectl get pods
kubectl get svc chatbot-frontend

Get service URL:

minikube service chatbot-frontend --url

Open the URL in browser.

## Notes

- API key is intentionally in frontend build output for demo purposes.
- Do not use this API key approach for production.
