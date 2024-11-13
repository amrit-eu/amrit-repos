"""Example importable module."""

__all__: tuple[str] = ("hello",)


def hello() -> str:
    """Return a Hello World string that can be printed.

    Returns:
        A printable string with the content of "Hello World!".

    """
    return "Hello World!"
