pipeline {
    agent any
    stages {
        stage('Clonar repositório') {
            steps {
                git branch: 'main', url: 'https://github.com/ivaneidepmn/integracao-continua.git'
            }
        }
        stage('Instalar dependências necessárias') {
            steps {
                sh 'npm install'
            }
        }
        stage('Executar testes') {
            steps {
                sh 'NO_COLOR=1 npm run cy:run'
            }
        }
    }
    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'Pipeline succeeded.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
