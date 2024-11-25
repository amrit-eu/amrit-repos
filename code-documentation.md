# Code documentation
AMRIT is a collection of different services/apps written in different languages. For consistence we are suggesting the following methods/style are used for documentation within code regardless of language.

## code documentation styles
We require that each method contains a description of what the method does, the types it takes in as arguments (if these are required or optional) and the type the method returns (if any). 

there are several different option on how this documentation is presented, if possible we are asking for documentation to follow the google style. 

Whatever code documentation style is used within a repo must be continued for consistence.

Where possible github action will be deployed to enforce code documentation.

### example
```python
def my_odd_method(parm1: str, param2: int, param3: bool = false):
    """This is a silly example.

    # This method takes in a string and a integer and a boolean, if the boolean is false (Default) then the method joins both parameters together in a string. 
    if the boolean is true the method converts the string to an integer and add the integer together.
    This method always out puts a string. 

    Args:
        param1 (str): a valid calendar day (range 1-31).
        param2 (int): a valid month (range 1-12).
        param3 (bool): Optional - should these values been added (true) or append (false).        
    
    Returns:
        str: a string containing one number. 
    """
    
    if(param3)
        answer = f"{int(param1) + param2}" 
    else 
        answer = f"{param1}{param2}"
    
    return answer
```
## code comments
If a function/method is complex, ideally it should be broken down into smaller easier to read/understand parts. if this is not possible, say for a complex calculations, then adding inline or multiline code comments are a good solution. they can a reader understand what is happening and allow for a reviewer to make sure that what is commented and what is coded are in fact the same thing. 
