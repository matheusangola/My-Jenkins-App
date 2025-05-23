pipeline {
    agent any
    // environment {
    //     NETLIFY_SITE_ID = "5aee8b40-1dec-427f-a2e9-a479d4cb8102"
    //     NETLIFY_AUTH_TOKEN = credentials('my-react-token')
    // }
    // environment {
    //         AWS_S3_BUCKET = 'my-jenkins-20250320'
    // }
    environment {
            AWS_DOCKER_REGISTRY = '703671926514.dkr.ecr.us-east-1.amazonaws.com'
            APP_NAME = 'my-react-app-image'
            AWS_DEFAULT_REGION = 'us-east-1'
    }
    stages {
        // stage('Docker'){
        //     steps{
        //         sh 'docker build -t my-docker-image .'
        //     }
        // }
        stage('Build') {
            agent {
                docker { 
                    image 'node:20.17.0-alpine' 
                    reuseNode true
                }
            }
            steps {
                sh '''
                ls -la
                    node --version
                    npm -version
                    npm install
                    npm run build
                    ls -la
                '''
            }
        }
        stage('Test') {
            agent {
                docker { 
                    image 'node:20.17.0-alpine' 
                    reuseNode true
                }
            }
            steps {
                sh '''
                    test -f build/index.html
                    npm test
                '''
            }
        }
        stage('Build My Docker Image'){
            agent {
                docker { 
                    image 'amazon/aws-cli'
                    reuseNode true
                    args '-u root -v /var/run/docker.sock:/var/run/docker.sock --entrypoint=""'
                }
            }
            steps{
                withCredentials([usernamePassword(credentialsId: 'myNewestUserKey', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                sh '''
                amazon-linux-extras install docker
                docker build -t $AWS_DOCKER_REGISTRY/$APP_NAME .
                aws ecr get-login-password | docker login --username AWS --password-stdin $AWS_DOCKER_REGISTRY
                docker push $AWS_DOCKER_REGISTRY/$APP_NAME:latest
                '''
            }
            }
        }
        // stage('Deploy') {
        //     agent {
        //         docker { 
        //             image 'my-docker-image' 
        //             reuseNode true
        //         }
        //     }
        //     steps {
        //         sh '''
        //             # npm install netlify-cli
        //             # node_modules/.bin/netlify --version
        //             # echo "Deploring to Site ID: $NETLIFY_SITE_ID"
        //             # node_modules/.bin/netlify status
        //             # node_modules/.bin/netlify deploy --prod --dir=build

        //             #### Custom docker image

        //             netlify --version
        //             echo "Deploring to Site ID: $NETLIFY_SITE_ID"
        //             netlify status
        //             netlify deploy --prod --dir=build

                    
        //         '''
        //     }
        // }
        
        stage('Deploy to AWS') {
            agent {
                docker { 
                    image 'amazon/aws-cli'
                    reuseNode true
                    args '-u root --entrypoint=""'
                }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'myNewestUserKey', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                sh '''
                    aws --version
                    yum install jq -y
                    #aws s3 ls
                    # echo "Hello S3!" > index.html
                    # aws s3 cp index.html s3://my-jenkins-20250320/index.html
                    #aws s3 sync build s3://$AWS_S3_BUCKET
                    LATEST_TD_REVISION=$(aws ecs register-task-definition --cli-input-json file://aws/task-definition.json | jq '.taskDefinition.revision')
                    aws ecs update-service --cluster my-react-cluster --service my-newest-react-app-service --task-definition myNewestTaskDefinition:$LATEST_TD_REVISION
                '''
                }
            }
        }
    }
}

