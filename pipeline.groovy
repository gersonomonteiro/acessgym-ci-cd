pipeline {
    agent any

    stages {
        stage('Check and Stop Existing Containers') {
            steps {
                script {
                    def projects = 'accessgym'

                    // Verifique se o serviço está listado em docker-compose ls
                    def serviceListing  = sh(script: "docker-compose ls | grep -w ${projects}", returnStatus: true, returnStdout: true)

                    // Se o serviço estiver listado, pare e remova
                    if (serviceListing == 0) {
                        echo "O serviço ${projects} está up. Parando e removendo..."
                        sh "docker-compose -p ${projects} down -v"
                    } else {
                        echo "O serviço ${projects} não está up."
                    }
                }
                sleep time: 5, unit: 'SECONDS'
            }
        }

        stage('Clone gitHub Repository') {
            steps {
                git(
                    branch: 'main', 
                    credentialsId: 'accessgymToken', 
                    url: 'https://github.com/gersonomonteiro/acessgym-ci-cd.git'
                )
            }
        }        
        
        stage('Start Containers') {
            steps {
                // Iniciar containers usando docker-compose
                script {
                    sh 'docker-compose -p accessgym up -d mysql'
                }
                sleep time: 10, unit: 'SECONDS'
                script {
                    sh 'docker-compose -p accessgym up -d'
                }
            }
        }

        stage('Unit Tests') {
            steps {
                // Iniciar containers usando docker-compose
                sleep time: 5, unit: 'SECONDS'
                script {
                    // Execute os testes unitários do Node.js
                    def testExitCode = sh(script: 'docker-compose run --rm backend npm test', returnStatus: true)

                    // Verifique o código de saída do comando de teste
                    if (testExitCode != 0) {
                        error "Os testes unitários do Node.js falharam. O pipeline será interrompido."
                    }
                }
            }
        }
        
    }
    post {
        success {
            
            echo 'Pipeline executado com sucesso!'
        }

        failure {
            echo 'Pipeline falhou. Por favor, verifique os registros para obter detalhes.'
        }
    }

    
}
