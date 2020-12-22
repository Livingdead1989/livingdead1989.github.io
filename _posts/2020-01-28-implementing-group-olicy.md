---
title:  "Implementing Group Policy"
date:   2020-01-28 16:30:44 +0000
categories: windows group policy
---

Course Series: [LinkedIn Learning Video Course](https://www.linkedin.com/learning/windows-server-2019-implementing-group-policy)


## Group Policy Order 

LSDOU

L = Local 

S = Site

D = Domain

OU = Organisation Unit

## Enforce

Apply the GPO no matter what, regardless if the block inheritance has been applied further down in the AD structure.

## Security Filtering

Using security filtering to apply policies to by default authenticated users, this can be changed to limit users, groups or computers. The object must be able to read and apply the group policy object.

Using the delegation tab we can restrict the ability to apply GPO which will result in a block for that user, group or computer.

## WMI

Filtering based on a hardware criteria, requires the use of WMI query language.

## Loopback Processing

Computer GPOs apply at the computer startup and the User GPOs apply when the user logs in. With loopback processing enabled when the user logs in, the computer policy user settings will be applied and no the user GPOs.

Two modes are available, replace and merge. Merging, if there is an error the computer GPO will take precedence.

## Group Policy Troubleshooting

Using CMD we can issue a 'gpupdate' command with various switches to update a single computer.

Using the Group Policy management window we can update based on container, find the OU you want to update, right click and select 'Group Policy Update...'

