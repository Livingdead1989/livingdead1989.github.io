---
title:  "Learning Python"
date:   2019-08-22 12:00:00 +0000
categories: python, programming, code
---

# Contents
1. [Escaping](#escaping)
1. [Methods](#methods)
1. [Sequence Operations](#sequence-operations)
1. [Lists within Lists](#lists-within-lists)
1. [Referencing](#referencing)
1. [Tuple](#tuple)
1. [Logic](#logic)
1. [Loops](#loops)
1. [Dictionaries](#dictionaries)
1. [Functions](#functions)

# Learning Python

Python is a strongly typed language meaning that it uses types such as strings and integars.

Python is a object-oriented (OOP).

Python is also case sensitive so myName and myname are different from one another.

* 10 - Decimal
* 0b10 - Binary
* 0o10 - Octal
* 0x10 - Hexidecimal

Integer in Python 2 is limited to 32bits for anything greater we use Long (64bit).

Python 3 has those limits removed and can exceed 64bit, Long does not exist anymore.


## Escaping

* `\n` = New Line Break
* `\t` = New Tab
* `\\` = Escape Backslash
* type()
* len()
* [] = Offset
* [6:10] = Slicing
* [6:10:2] = Slicing with a step

## Methods

* .lower() = Change to lower case
* .upper() = Change to upper case
* .capitalize() = Change the first character to uppercase
* .title() = First character in each word is upper
* .swapcase() = swaps case
* .center() = Centers text within a character limit
* .startswith() = Checks and Returns a Boolean value
* .endswith() 
* .strip() = Removes white space by default or any combination of specified characters
* .lstrip() = Removes space on the Left side
* .rstrip() = Removes space on the Right Side
* .split() = Returns a list of words using a delimiter.
* .join() = 
* .index() = First occurrence of
* .count() = Number of occurrences 
* .find() = Returns the lowest index, if value is not found then a -1 is returned

## Sequence Operations

* x in s = Returns a true if s is equal to x
* x  not in s = Returns a true if s is not equal to x
* + = Concat

## Lists within Lists

First List - `routers_list = ['R1','R2','R3']`

Second List - `switches_list = ['S1','S2','S3']`

Combined List - `rs_list = [routers_list, switches_list]`

Results In `rs_list = [['R1','R2','R3'],['S1','S2','S3']]`

Calling each item using `rs_list[0] = ['R1','R2','R3']`

Calliung each sub item `rs_list[0][1] = 'R2'`


## Referencing 

`a = [1,2,3]`

`b = a`

when a is changed so will b as its only referencing. you can use the .copy() method to create a copy of the list.

`c = a.copy()`

or you can `c = list(a)` which creates a copy of the list.


## Tuple 

Tuples are like a list but are immutable, cannot change after creation.

Create a tuple using `tuple1 = ('R1','R2')` or `tuple2 = 'R1', 'R2'`.

## Logic

IF, ELSE statement

```
router = True

if router:
    print ('This is a router')
else:
    print ('This is not a router')
```

IF, ELIF, ELSE statement

```
device = '123'

if device == 'router':
    print ('Router found')
elif device == 'switch':
    print ('Switch found')
else:
    print ('Something else found')
```

## Loops

WHILE loop

```
counter = 1

while counter < 5:
    print (counter)
    counter += 1
```

`break` will stop a loop, `continue` will skip the loop back.

optional `else:` at the end of a while loop if the loop ends normally (no break).

FOR loop

Useful for iterating through a list.

```
vendors = ['cisco', 'hpe']

for vendor in vendors:
    print ('Vendor is: ', vendor)
```

Comparing lists is easy with a sub IF statement.

```
vendors = ['cisco', 'hpe', 'ss']
approved_vendors = ['cisco', 'hpe']

for vendor in vendors:
	if vendor not in approved_vendors:
    	print ('Dodgy vendor is: ', vendor)
```


## Dictionaries

Similar to lists (unordered), order doesn't matter, no offset instead you use keys (keys must be unique).

Dictionaries are immutable.

Calling keys from a dictionary to retrieve its value.

```
 iosv_l2_s1 = {
     'device_type': 'cisco_ios',
     'ip': '192.168.1.10',
     'username': 'admin',
     'password': 'cisco',
 }

 iosv_l2_s1['username']
```

changing a value of a key

`iosv_l2_s1['password'] = 'class'`

adding an additional key

`iosv_l2_s1['secret'] = 'cisco'`

combining dictionaries using the .update() method.

```
iosv_extra = {
    'protocol': 'ssh',
    'login': 'local',
}

iosv_l2_s1.update(iosv_extra)
```

remove keys using the del 

`del iosv_extra['login']`

clear a whole dictionary using the .clear() method

`iosv_extra.clear()`



## Functions 

Named modular code which can be reused.

Defining and calling a function

```
def functionName():
    print ('Hello')

functionName()
```

Function Arguments = `functionName(Arg)`

Named Keyword Arguments = removes confusion with positional arguments.

```
def functionName(username, password):
    return {
        'username': username,
        'password': password,
    }

functionName(username = 'admin', password = 'cisco')

functionName(password = 'cisco', username = 'admin')
```
