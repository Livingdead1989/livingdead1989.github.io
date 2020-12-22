---
title:  "Python Video Course Notes"
date:   2019-12-10 08:00:00 +0000
categories: python
---

# Python Course

[LinkedIn Video Course Link](https://www.linkedin.com/learning/learning-python-2)

## Variables

```
my_useful_variable = 0
```

__global variables vs local variables__

within a function, that function gets its own copy of that variable and by default does not affect the global variable

```
myvariable = 0

def main():
	global myvariable
	myvariable = "Hello"
	print(myvariable)
```

Use of the global keyword means it will not alter the global variable value.

__Remove a variable__

using the `del` command we can remove a variable from that point forward.

```
myvariable = "Hello"

del myvariable

print(myvariable)
```

## Functions

```
def main():
	print("I am a function")

main() # runs the main function
print(main()) # the function will run then the outer print will evaluate to None
print(main) # prints the value of the function
```

__inputting into a function using arguments (args)__

```
def main_args(arg1, arg2):
    print(arg1, " ", arg2)

main_args(10, 20)
```

__setting a default value to a arg__

```
def main_args(arg1, arg2=20)
```

__returning using a function__

```
def main_return(x):
    return x*x*x

main_return(3) # No value printed
print(main_return(3)) # Printing the value we can see the change
```

__calling a function with specific args__

```
def main_args(arg1, arg2):
    print(arg1, " ", arg2)

main_args(arg2=10, arg1=20)
```

__variable amount of args__

```
def multi_add(*args):
```

use of the `*` allows for a variable number of args to be inputted

```
multi_add(10,10,20,30)
```

## IF and Conditional Statements

__IF, ELIF and ELSE statement__

```
if (x < y):
	print("X is less than Y")
elif (x == y):
	print("X is equal to Y")
else:
	print("X is greater than Y")
```

__Conditional statements__

```
st = "x is less than y" if (x < y) else "x is greater than y"
print(st)
```

## Loops

__WHILE__

```
while ( x < 5 ):
	print(x)
	x = x+1
```

__FOR__

```
for x in range(5, 10):
	print(x)
```

for loops can work over things not just numbers, for example an array.

```
days = ["mon", "tue", "wed", "thur", "fri", "sat", "sun"]
for d in days:
	print(d)
```

__Enumerate__

retreive an index ID for items

```
days = ["mon", "tue", "wed", "thur", "fri", "sat", "sun"]
for i,d in enumerate(days):
	print(i, d)
```

__Break statement__

the break statement causes the loop to break if a condition has been met.

```
for x in range(5, 10):
	if(x == 7): break
	print(x)
```

__Continue statement__

the continue statement skips the rest of the loop for that particular iteration

```
for x in range(5, 10):
	if(x % 2 == 0): continue
	print(x)
```

## Classes

like an object constructor or a blueprint for creating objects, the init (initialion) function is always executed with a class and is used to assign object properties or other operations that the class needs.

```
class my_class:
	x = 5
```

The example below sets up a class called Person with 2 properties which are used and can be called seperately.

```
class Person:
	def __init__(self, name, age):
		self.name = name
		self.age = age

person1 = Person("John", 36)

print(person1.name)
print(person1.age)
```


## Date, Time and Datetime

using the date, time and datetime modules

```
from datetime import date
from datetime import time
from datetime import datetime
```

printing todays date

```
today = date.today()
print("Today's date is", today)
```

individual components

```
today.day
today.month
today.year
today.weekday
```

Datetime 

```
today = datetime.now()
print("The current date and time is", today)
```

current time

```
datetime.time(datetime.now())
```

__Formatting time output__

```
now = datetime.now()

print(now.strftime("The current year is: %Y"))
```

* Year
	* %y
	* %Y
* Weekday
	* %a
	* %A
* Month
	* %b
	* %B
* Day of month
	* %d
* locale's date and time
	* %c
* locale's date
	* %x
* locale's time
	* %X

Formatting Time

* 12/24 Hour
	* %I
	* %H
* Minute
	* %M
* Second
	* %S
* Locale's AM/PM
	* %p


__Time Delta__

A span of time

```
from datetime import timedelta

now = datetime.now()

print("One year from now will be:" + str(now + timedelta(days=365)))
```

## Calendars

```
import calendar
```

creating a plain text calendar

```
c = calendar.TextCalendar(calendar.MONDAY)
st = c.formatmonth(2019, 1)
print(st)
```

creating HTML calendar output

```
hc = calendar.HTMLCalendar(calendar.MONDAY)
st = hc.formatmonth(2019, 1)
print(st)
```

## Files

```
f = open("textfile.txt", "w+")
```

opens a file called textfile with write (overwrite) access, the + means to create the file if it doesn't exist.

```
f.write("This is a line\n")
f.close()
```

this will write to that file, overwritting any content then close the file. To append data to the file instead of opening with write access we open with append access

```
f = open("textfile.txt", "a")
```

read the file contents, use of a IF statement checks if the mode is read otherwise do not perform the action.

```
f = open("textfile.txt", "r")

if(f.mode == 'r'):
	print(f.read())
```

read per line

```
f.readlines()
```

__Working with OS path__

Required modules are:

```
import os
from os import path
```

https://docs.python.org/3/library/os.html

Using the OS module we can:

* print the os name:

```
print("The operating system name is " + os.name)
```

* check if an item exists:

```
print("Does the item exist: " + str(path.exists("python.py")))
```

* check if the item is a file:

```
print("Is this item a file? " + str(path.isfile("python.py")))
```

* check if the item is a directory:

```
print("Is this item a directory? " + str(path.isdir("python.py")))
```

* rename a file

```
os.rename("file.txt","fileRenamed.txt")
```

* find the real path:

```
print("The real path of this file is: " + str(path.realpath("python.py")))
```

* split the realpath and file name (printed as a tuple):

```
print("Split the path and file name\n" + str(path.split(path.realpath("python.py"))))
```

__System Shell Methods__

To use the shell utilities we need to import `shutil`.

```
import shutil
```

Using shutil to copy a file, we can use the previous `path.exists` and `path.realpath` to check if the file exists, store its path and add a `.bak` to the end of the path. Then using the `shutil.copy()` we can copy its content into another file.

```
if (path.exists("python.py")):
    src = path.realpath("python.py")
    dst = src + ".bak"

    shutil.copy(src, dst)
```

The above will create another file called python.py.bak

To move over the metadata of the file we need to use the `shutil.copystat()` command after the inital copy.

__Archive Files__

We can archive using the `make_archive` module, which will allow us to create any type of archive file (zip, tar etc).

`from shutil import make_archive`

We create two variables to store the parts of the tuple generated by the `path.split()` command.

```
root_dir, tail = path.split(src)
```

The root_dir will contain the path and the tail will contain the file name, we can then use the `shutil.make_archive()`.

```
shutil.make_archive("archiveName", "zip", root_dir)
```

## Web Data

We can read website data using the urllib request module.

`import urllib.request`

To recieve a response object we can use the request url open and the getcode function.

```
webUrl = urllib.request.urlopen("http://duckduckgo.com")
print("Response Code: " + str(webUrl.getcode()))
```

We can read and print the content of the website by using the read function.

```
data = webUrl.read()
print(data)
```

__Working with JSON data__

https://docs.python.org/3/library/json.html

We need to import the JSON module, building upon our previous reading web data script. 

This will import the json module and `if` the website reports 200 it will pass the data to the function called `printResults`.

The `json.loads()` function, this will load the string data into a python object.

```
import json
import urllib.request

def printResults(data):
    theJSON = json.loads(data)

urlData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
webUrl = urllib.request.urlopen(urlData)

if(webUrl.getcode() == 200):
    data = webUrl.read()
    printResults(data)
else:
	print("Error: Response Code: " + str(webUrl.getcode()) + "\n")
```

We can then access the object like a dictionary.

https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php

```
def printResults(data):
    theJSON = json.loads(data)

    if "title" in theJSON["metadata"]:
    	print(theJSON["metadata"]["title"])
```

Using this method we can keep expanding the data

```
# the number of earthquakes
count = theJSON["metadata"]["count"]
print(str(count) + " events recorded.")

# loop through the location names
for i in theJSON["features"]:
    print(i["properties"]["place"])
print("--------------\n")
```

Using the data to filter. This example filters for quakes with a mag above 4.0

```
# loop through the location names
    for i in theJSON["features"]:
        if(i["properties"]["mag"] >= 4.0):
            # %2.1f string format to 1 decimal place
            print("%2.1f" % i["properties"]["mag"], i["properties"]["place"])
    print("--------------\n")
```

## Resources

https://docs.python.org/

https://python.org
