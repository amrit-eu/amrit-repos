# Code documention
Amrit is a collection of different services/apps written in different lanauges. For consistance we are suggesting the following methods/style are used for documention within code regardless of lanauge.

## code documention styles
We require that each method contains a description of what the method does, the types it takes in as arguments (if these are required or optional) and the type the method returns (if any). 

there are serveral different option on how this documention is presented, if possible we are asking for documention to follow the google style. 

Whatever code documention style is used within a repo must be continued for consistance.

Where possible github action will be deployed to infoucre code documention.

### example
```python
def my_odd_method(parm1: str, param2: int, param3: bool = false):
    """This is a silly example.

    This method takes in a string and a intger and a boolen, if the boolean is false (Default) then the method joins both paramters together in a string. 
    if the boolean is true the method converts the string to an integer and add the integer together.
    This method always out puts a string. 

    Args:
        param1 (str): a vaild calander day (range 1-31).
        param2 (int): a vaild month (range 1-12).
        param3 (bool): Optional - should these values been added (true) or append (false).        
    
    Returns:
        str: a string containing one number. 
    """
    
    if(param3)
        answer = f"{int(param1) + param2}" 
    else 
        answer = f"{param1}{praram2}"
    
    return answer
```
## code comments
If a function/method is complex, ideally it should be broken down into smaller easier to read/understand parts. if this is not possible, say for a complex caluations, then adding inline or multiline code comments are a good soulation. they can a reader understand what is happening and allow for a reviewer to make sure that what is commented and what is coded are infact the same thing. 
