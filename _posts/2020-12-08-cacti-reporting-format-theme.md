---
title:  "Cacti Reporting Format Theme"
date:   2020-12-08 13:00:00 +0000
categories: cacti
---

## Cacti Reporting Format Theme

The built-in reporting formats didn't offer a clean look for my reporting emails, I wanted something simple but with more spacing so I overwhelm my eyes when looking at multiple graphs. I decided to create my own based on the  "Cacti Monitoring Format" template, just removing some of the borders and giving some more padding to elements.

Here is a comparison between the new (left) and the old (right) formats.

![Comparing the new and old formats](/assets/images/posts/cacti_report_compare.png)

To create this I needed to place my own format file within Cacti's working directory.

1. SSH into your server

2. Change to the formats directory

   * `cd /var/www/html/cacti/formats/`

3. Create a new file

   * `sudo nano steven_custom_cacti.format`

4. Copy your formatting into that file

   ```text
   # Description: Steven's Custom Cacti Format
   # Theme: modern
   <html>
    <head>
     <title>Cacti Monitoring Report</title>
     <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
     <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
     <meta name="viewport" content="width=device-width, initial-scale=1">
     <meta http-equiv="X-UA-Compatible" content="IE=edge">
     <meta charset="utf-8">
     <style type='text/css'>
     
     html {
     background-color: #FAFAFA;
     font-family: 'Roboto', sans-serif;
     }
     hr {
     border: 0;
     border-top: 1px solid #474747; 
     }
     table {
     width: 100%;
     margin-left: auto;
     margin-right: auto;
     }
     .text_row, .image_row{
     padding: 10px 5px;
     display: block;
     }
     .header {
     margin: 0px auto 0px auto;
     margin-left: auto;
     margin-right: auto;
     padding: 5px;
     }
     .left {text-align: left;}
     .right {text-align: right;}
     .center {text-align: center;}
     .footer {
     display: block;
     text-align: right;
     margin-left: auto;
     margin-right: auto;
     }
     .footer a{
        text-decoration: none;
        color: #474747;
        font-size: 0.9em;
     }
     </style>
    </head>
    <body>
     <div class='header'>
      <h1>Cacti Monitoring Report</h1>
     </div>
     <table>
      <tr>
       <td>
        <center>
         <REPORT>
        </center>
       </td>
      </tr>
     </table>
      
     <div class='footer'>
      <span><a href="https://networkingdream.com" target="_blank">Steven's Custom Cacti Theme</a></span>
     </div>
      
    </body>
   </html>
   ```

5. `ctrl` + `o` to save, `ctrl` + `x` to exit

![Cacti Working Directory](/assets/images/posts/cacti_theme_directory.png)

1. Go to your Cacti web GUI

2. Go into the Reporting tab

3. Go into Details tab

4. Change "Format File to Use" to your new style

   ![Cacti Change Theme Format File to Use](/assets/images/posts/cacti_change_theme.png)

5. Save

That's it, give it a test and you're new style will be applied when sending your reports.
