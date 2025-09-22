# ArgoFileChecker Python Wrapper

A lightweight Python wrapper around the **Argo NetCDF File Checker**.  
It runs the File Checker JAR as a **subprocess**, parses the generated XML output files (which are generated in a temporary folder), and returns typed `ValidationResult` objects.

## Installation

### With Poetry

```bash
poetry add argofilechecker-python-wrapper
```

## Run ArgoFileChecker Python Wrapper
The wrapper can receive paths explicitly or through environment variables:

FILE_CHECKER_JAR: path to file_checker_exec-*.jar

FILE_CHECKER_SPECS: path to the file_checker_spec directory

### Usage example
See /test_scripts where a test python script is provided along with a file checker .jar and some netcdf test data.

```bash
cd ./test_scripts
poetry run python .\demo_test.py
```

### Results Values

- ResultType.SUCCESS → the file is accepted by the File Checker.

- ResultType.FAILURE → the file is rejected (errors found).

- ResultType.ERROR → internal error in the checker or parsing failure.

The phase (PhaseType) indicates the stage where the error occurred: opening, format check, data validation, or file name check.

Errors and warnings's number and messages can be accessed also.

For more information see models.py