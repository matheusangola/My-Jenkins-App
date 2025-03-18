pipeline {
    agent any
    environment {
        NETLIFY_SITE_ID = "5aee8b40-1dec-427f-a2e9-a479d4cb8102"
        NETLIFY_AUTH_TOKEN = credentials('my-react-token')
    }
    stages {
        stage('Docker'){
            steps{
                sh 'docker build -t my-docker-image .'
            }
        }
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
        stage('Deploy') {
            agent {
                docker { 
                    image 'my-docker-image' 
                    reuseNode true
                }
            }
            steps {
                sh '''
                    # npm install netlify-cli
                    # node_modules/.bin/netlify --version
                    # echo "Deploring to Site ID: $NETLIFY_SITE_ID"
                    # node_modules/.bin/netlify status
                    # node_modules/.bin/netlify deploy --prod --dir=build

                    #### Custom docker image

                    netlify --version
                    echo "Deploring to Site ID: $NETLIFY_SITE_ID"
                    netlify status
                    netlify deploy --prod --dir=build
                '''
            }
        }
    }
}

