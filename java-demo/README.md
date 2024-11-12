# Java api template

## TOOLS

### SDKMAN

SDKMAN, an acronym for “Software Development Kit Manager”, is an interesting tool for Java developers wishing to manage JDK (Java Development Kit) versions efficiently. It greatly simplifies the management of different JDK versions, offering simple control of the Java development environment.

Follow this guide to learn how to use Sdkman : <https://www.baeldung.com/java-sdkman-intro>

### Maven Wrapper

Thanks to the wrapper, Maven is embedded in the project (in a defined version). No need to install Maven on your development workstation, just use the wrapper script included in the project.

## Getting Started

Build the application :

```bash
./mvnw clean install
```

## Quality / linting

### Checkstyle

Checkstyle is a development tool to help programmers write Java code that adheres to a coding standard. It automates the process of checking Java code to spare humans of this boring (but important) task. This makes it ideal for projects that want to enforce a coding standard.

Command to build check / apply coding standard :

```bash
./mvnw spotless:check
./mvnw spotless:apply
```

### Sonarqube

We can also do more extensive Quality contrôle / Linting thanks to Sonarqube and Maven but to automate it, it required a SonarQube server that run somewhere.

In any case, **you can have analysis directly during your devs by adding [SonarLint](https://docs.sonarsource.com/sonarlint/intellij/) plugin to your IDE**. It provides immediate feedback in your IDE as you write code so you can find and fix issues before a commit.

Thanks to Docker it's also possible to run a Sonarqube locally to execute an analysis with Maven :

1. Run Sonarqube locally :

    ```bash
    docker compose -f compose.sonarqube.yaml up
    ```

2. [Generate a global analysis token](https://docs.sonarsource.com/sonarqube/latest/user-guide/managing-tokens/#generating-a-token)

   - login : admin
   - password : sonarqube

3. Execute analysis with Maven :

    ```bash
    ./mvnw -P sonar sonar:sonar -Dsonar.token=REPLACE_BY_YOUR_TOKEN
    ```

4. Consult analysis on the Sonarqube UI running locally : <http://localhost:9000/dashboard?id=fruits&codeScope=overall>

#### Costumized configurations

Sonar analysis can be configured via Maven using the dedicated plugin.

```xml
<plugin>
    <groupId>org.sonarsource.scanner.maven</groupId>
    <artifactId>sonar-maven-plugin</artifactId>
    <version>3.10.0.2594</version>
</plugin>
```

Properties can be override throw properties defined in maven configuration file : `pom.xml`.

```xml
<properties>
    <!-- Sonar Plugin Properties-->
    <sonar.language>java</sonar.language>
    <sonar.java.coveragePlugin>jacoco</sonar.java.coveragePlugin>
    <sonar.dynamicAnalysis>reuseReports</sonar.dynamicAnalysis>
    <sonar.coverage.jacoco.xmlReportPaths>${project.build.directory}/site/jacoco/jacoco.xml</sonar.coverage.jacoco.xmlReportPaths>
    <sonar.projectKey>${project.artifactId}</sonar.projectKey>
    <sonar.projectName>${project.artifactId}</sonar.projectName>
    <sonar.host.url>http://localhost:9000</sonar.host.url>
    <sonar.token>REPLACE_BY_YOUR_TOKEN</sonar.token>
    <sonar.qualitygate.wait>true</sonar.qualitygate.wait>
    <sonar.sources>${project.basedir}</sonar.sources>
    <sonar.exclusions>target/**/*, src/test/**/*</sonar.exclusions>
    <sonar.tests>${project.basedir}</sonar.tests>
    <sonar.tests.inclusions>${project.basedir}/src/test/**/*</sonar.tests.inclusions>
    <sonar.skip>false</sonar.skip>
</properties>
```
