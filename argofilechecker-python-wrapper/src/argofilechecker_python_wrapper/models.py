from enum import Enum
from typing import List
from pydantic import BaseModel

class ResultType(str, Enum):
    """Error codes possibles"""

    SUCCESS = "FILE-ACCEPTED"
    FAILURE = "FILE-REJECTED"
    ERROR = "ERROR"

class PhaseType (str, Enum) :
    """File Checker verification phases"""
    OPEN_FILE = "OPEN-FILE"
    FORMAT = "FORMAT-VERIFICATION"
    DATA = "DATA-VALIDATION"
    NAME = "FILE-NAME-CHECK"



class ValidationResult (BaseModel):
    file:str
    result : ResultType
    phase: PhaseType
    errors_number : int
    warnings_number : int
    errors_messages : List[str]
    warnings_messages : List[str]

    def to_string (self) -> str :
        """Summary for humans"""
        status = "FILE ACCEPTED" if self.result == ResultType.SUCCESS else "FILE REJECTED"

        return f"{self.file} : {status} with {len(self.errors_number)} error(s) and {len(self.warnings_number)} warning(s)"
    