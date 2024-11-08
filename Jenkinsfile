pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        DOCKER_IMAGE = 'talhahussain913/web01-app'
        ANSIBLE_SSH_PRIVATE_KEY = credentials('ansible-jenkins-ssh')
    }

    stages {
        stage('Clone Project') {
            steps {
                git branch: 'master', url: 'https://github.com/SyedTalha71x/simple-backend-CI-CD.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install --prefix frontend'
                sh 'npm install --prefix backend'
            }
        }

        stage('Build') {
            steps {
                // Running build for frontend and backend
                sh 'npm run build --prefix frontend'
                sh 'npm run build --prefix backend'
            }
        }

        stage('Test') {
            steps {
                // Running tests for both frontend and backend
                sh 'npm test --prefix frontend'
                sh 'npm test --prefix backend'
            }
        }

        stage('Code Analysis') {
            steps {
                script {
                    // Run SonarQube analysis for both backend and frontend
                    withSonarQubeEnv('SonarQube') {
                        sh 'cd backend && sonar-scanner'
                        sh 'cd frontend && sonar-scanner'
                    }
                }
            }
        }

        stage('Docker Build and Push') {
            steps {
                script {
                    // Build Docker image
                    sh 'docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .'

                    // Log in to Docker Hub using credentials stored in Jenkins
                    withCredentials([usernamePassword(credentialsId: 'jenkins-docker-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                    }

                    // Push Docker image to Docker Hub
                    sh 'docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sshagent(['ansible-jenkins-ssh']) {
                        sh '''
                           ansible-playbook -i inventory.yaml deploy.yml --extra-vars "image_tag=${BUILD_NUMBER}" --ssh-extra-args='-o StrictHostKeyChecking=no'
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs for more details.'
        }
    }
}

