#!groovy

@Library('github.com/red-panda-ci/jenkins-pipeline-library@v2.6.1') _

// Initialize global config
cfg = jplConfig('hl-stream', 'node', '', [email:'maurice.ronet.dominguez@gmail.com'])

pipeline {
    agent none

    stages {
        stage ('Initialize') {
            agent { label 'master' }
            steps  {
                deleteDir()
                jplStart(cfg)
            }
        }
        stage ('Test') {
            agent { label 'master' }
            steps  {
                sh "bin/test.sh"
            }
            post {
                always {
                    publishHTML (target: [
                            allowMissing: false,
                            alwaysLinkToLastBuild: false,
                            keepAll: true,
                            reportDir: 'coverage/lcov-report',
                            reportFiles: 'index.html',
                            reportName: "Coverage-Report"
                    ])
                }
            }
        }
        stage ('Build') {
            agent { label 'master' }
            when { expression { cfg.BRANCH_NAME.startsWith('release/v') || cfg.BRANCH_NAME.startsWith('hotfix/v') } }
            steps {
                script {
                    docker.build('<IMAGE-NAME>', '--no-cache .')
                    jplDockerPush (cfg, "<IMAGE-NAME>", "test", "", "https://registry.hub.docker.com", "<JENKINS_CREDENTIALS>")
                }
            }
        }
        stage ('Test deploy') {
            agent { label 'master' }
            when { expression { cfg.BRANCH_NAME.startsWith('release/v') || cfg.BRANCH_NAME.startsWith('hotfix/v') } }
            steps {
                sh "bin/deploy.sh update ${env.RANCHER_HOST} ${env.RANCHER_KEY} ${env.RANCHER_SECRET}"
            }
        }
        stage ('Release confirm') {
            when { expression { cfg.BRANCH_NAME.startsWith('release/v') || cfg.BRANCH_NAME.startsWith('hotfix/v') } }
            steps {
                jplPromoteBuild(cfg)
            }
        }
        stage ('Production deploy') {
            agent { label 'master' }
            when { expression { cfg.BRANCH_NAME.startsWith('release/v') || cfg.BRANCH_NAME.startsWith('hotfix/v') } }
            steps {
                script {
                    docker.build('redpandaci/api-status:latest')
                    jplDockerPush (cfg, "<IMAGE-NAME>", "test", "", "https://registry.hub.docker.com", "<JENKINS_CREDENTIALS>")
                }
                sh "bin/deploy.sh update ${env.RANCHER_HOST} ${env.RANCHER_KEY} ${env.RANCHER_SECRET}"
            }
        }
        stage ('Release finish') {
            agent { label 'master' }
            when { expression { (cfg.BRANCH_NAME.startsWith('release/v') || cfg.BRANCH_NAME.startsWith('hotfix/v')) && cfg.promoteBuild.enabled } }
            steps {
                jplCloseRelease(cfg)
            }
        }
    }

    post {
        always {
            jplPostBuild(cfg)
        }
    }

    options {
        timestamps()
        ansiColor('xterm')
        buildDiscarder(logRotator(artifactNumToKeepStr: '20',artifactDaysToKeepStr: '30'))
        disableConcurrentBuilds()
        skipDefaultCheckout()
        timeout(time: 1, unit: 'DAYS')
    }
}