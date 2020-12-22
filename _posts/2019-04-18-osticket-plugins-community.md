---
title:  "osTicket Plugins - Community"
date:   2019-04-18 16:00:00 +0000
categories: osticket
---

# Community Plugins
I will be adding the following plugins: 

1. [Ticket Closer Plugin](https://github.com/clonemeagain/plugin-autocloser)
1. [Attachment Preview](https://github.com/clonemeagain/attachment_preview)


## Ticket Closer Plugin

Download master zip and extract into '\include\plugins\autocloser' then install the plugin by selecting 'Add New Plugin' from the Admin Panel > Manage > Plugins page, then select Install.

Now the plugin is installed we can enable it by selecting the plugin selecting the 'More' option and selecting 'Enable'.

For testing purposes I will be changing the option of 'Max Ticket age in days' to 1 and creating a canned response which gets sent to the client.

### Creating a Canned Response

Make sure that canned responses are enabled via the Admin panel, navigate to Settings > Knowledgebase and enable 'Canned Responses'.

Now we have access to the canned responses we can create our auto closer reponse. From the agent panel goto the Knowledgebase tab and click 'Add New Reponse'.

![Auto Closer Canned Response](/assets/images/posts/auto_closer_canned_response.jpg "Auto Closer Canned Response")

Once you have your canned response configured go back to the auto closer plugin options, scroll down to 'Auto-Reply Canned Response' and select the newly created canned response from the drop down menu.


## Attachment Preview

Download master zip and extract into '\include\plugins\attachment_preview' then install the plugin by selecting 'Add New Plugin' from the Admin Panel > Manage > Plugins page, then select Install.

Now the plugin is installed we can click it for options, I will be unchecking 'Show IE upgrade link' but leaving everything else as its default value. Save the changes then Enable the plugin.

I created a sample ticket to test the plugin.

Plugin Disabled

![Attachment Preview Plugin Disabled](/assets/images/posts/attachment_preview_disabled.jpg "Attachment Preview Plugin Disabled")

Plugin Enabled

![Attachment Preview Plugin Enabled](/assets/images/posts/attachment_preview_enabled.jpg "Attachment Preview Plugin Enabled")

# Other Community Plugins

You may find this curated list useful: [Awesome osTicket](https://github.com/clonemeagain/awesome-osticket)

The osTicket plugin forums: [osTicket Forum - Plugins](https://forum.osticket.com/t/plugins)