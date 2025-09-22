from typing import List
from argofilechecker_python_wrapper import FileChecker, ValidationResult
from argofilechecker_python_wrapper.models import ResultType

jar_path ="./file_checker_exec-2.9.3-SNAPSHOT.jar"
spec_path = "./file_checker_spec"


# 1) Instantiate the wrapper (explicit paths)
fileChecker = FileChecker(jar_path, spec_path)
# You can also instantiate the checker without arguments if your environment variables are set:
# file_checker = FileChecker()  # reads FILE_CHECKER_JAR / FILE_CHECKER_SPECS

# 2) Validate a list of files from the same DAC
validation_results:List[ValidationResult] = fileChecker.check_files(
        ["./test_data/1902735_tech.nc", "./test_data/3901682_tech.nc", "./test_data/3901682_tech_bad_long_name.nc", "./test_data/6903283_tech_No-Timeseries.nc"],
        "coriolis"
    )

# 3) Iterate over the results
for file_result in validation_results :

    print (file_result.result.value)
    
    if (file_result.result == ResultType.FAILURE or file_result.result == ResultType.ERROR ):
        print(*file_result.errors_messages)
        print(*file_result.warnings_messages)
