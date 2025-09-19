"""File Checker Python wrapper package"""
__version__ = "0.0.0" # version will be updated automatically by poetry_dynamic_versioning


from .file_checker import FileChecker
from .models import ValidationResult, PhaseType, ResultType

__all__ = [
    "FileChecker", 
    "ValidationResult",
    "PhaseType", 
    "ResultType",
    "__version__"
]