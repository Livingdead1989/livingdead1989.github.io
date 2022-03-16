---
title: "DPM Unable to Connect"
date: 2021-05-06 14:10:00 +0000
categories: misc
tags: microsoft server dpm sql
description: >- # this means to ignore newlines until "baseurl:"
  How to fix DPM remote administration unable to connect to DPM, verify that the DPM service is running on this computer. Adding SQL permissions
---

This is a very quick guide on how we fixed our DPM's remote administration unable to connect error.

![dpm-error](/assets/images/posts/dpm-error.png)

We needed to give our users/group permission over the SQL database. Follow the steps below:

1. Open Microsoft SQL server management studio
2. Connect to your DPM server
3. Create a new Login, I have used our domain admin group.
4. Under roles include the 'sysadmin' role.
5. Close

![dpm-sql-login-role](/assets/images/posts/dpm-sql-login-role.png)

When we retry our DPM remote administration we will not longer see this error message and instead be presented with our DPM panel.

![dpm-remote-console](/assets/images/posts/dpm-remote-console.png)

I hope this has helped.
