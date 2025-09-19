import os
from pathlib import Path
from argofilechecker_python_wrapper import FileChecker, ValidationResult
from argofilechecker_python_wrapper.models import ResultType

jar_path ="./file_checker_exec-2.9.3.jar"
spec_path = "./file_checker_spec"

# get FileChecker :
fileChecker = FileChecker(jar_path, spec_path)
# check files :
validationResults = fileChecker.check_files(["./test_data/1902735_tech.nc", "./test_data/3901682_tech.nc", "./test_data/3901682_tech_bad_long_name.nc", "./test_data/6903283_tech_No-Timeseries.nc"],"coriolis")

for fileChecker_result in validationResults :
    print (fileChecker_result.result.value)
    if (fileChecker_result.result == ResultType.FAILURE or fileChecker_result.result == ResultType.ERROR ):
        print(*fileChecker_result.errors_messages)
        print(*fileChecker_result.warnings_messages)
