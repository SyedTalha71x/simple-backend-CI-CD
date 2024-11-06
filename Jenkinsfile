pipeline{
   agent any
   
    environment {
        NODE_ENV = 'production'
        DOCKER_IMAGE = 'talhahussain913/web01-app'
    }
    
    stages {
         stage('Clone Project') {
            steps {
               git branch: 'master', url: 'https://github.com/SyedTalha71x/simple-backend-CI-CD.git'
            }
         }
         
         stage('Install Dependencies'){
            steps{
               sh 'cd frontend && npm install'
               sh 'cd backend && npm install'
            }
         }
         
         stage('Build'){
            steps{
               sh 'cd frontend && npm run build'
               sh 'cd backend && npm run build'
            }
         }
         
         stage('Test'){
            steps{
               sh 'cd frontend && npm test'
               sh 'cd backend && npm test'
            }
         }
         
         stage('Code Analysis'){
            steps{
              script {
                    withSonarQubeEnv('SonarQube') {
                        sh 'cd backend && sonar-scanner'
                    }
                }
            }
         }
         
         stage('Docker Build and Push'){
            steps{
              script {
                    sh 'docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .'

                    // Log in to Docker Hub using credentials stored in Jenkins
                    withCredentials([usernamePassword(credentialsId: 'jenkins-docker-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                    }

                    // Push the Docker image to Docker Hub
                    sh 'docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}'
                }
            }
         }
         
         stage('Deploy') {
            steps {
                script {
                    sshagent(['ansible-ssh-credentials']) {
                        sh 'ansible-playbook -i inventory deploy.yml --extra-vars "image_tag=${BUILD_NUMBER}"'
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
