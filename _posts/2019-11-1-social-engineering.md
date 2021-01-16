---
title:  "Social Engineering"
date:   2019-11-6 16:00:00 +0000
categories: hacking
---

## Social Engineering Overview

A con game relying on influence, social skills, and human interaction to obtain information about an organisation or computer system.

Security appliances and anti-malware protection has gotten better, so a hacker will try to attack a softer target - People.

Ways to attack:

* Phone phishing
* Online recon
* Dumpster diving
* Shoulder surfing.

Scam artists work on our emotions:

* May promise free gifts or prices
* Offer important information
* Threaten to take action if you do not reply.

__Four main phases of Social Engineering__

1. Reconnaissance
1. Establishing Trust
1. Exploiting that Trust
1. Exit

__Recognising an attack__

* Watch out for unscheduled utility service calls
* Be hesitant with calls claiming to be from the help desk
* Be aware of anyone who says you will get in trouble if the issue isn't dealt with immediately

__Best Practices__

* Require visitors to check in
* Require visitors to wear a badge
* Be polite and calmly call for verification
* Escort them even when inside the lobby

## Social Engineering Mechanisms

Catfishing is a newer form of social engineering where the attacker poses as a love interest, luring their victim into a relationship.

Browsers are commonly used in social engineering as the portal into the world wide web, a few tips for keeping safe:

* Use a modern browser
* Secure browser settings
* Be careful with extensions
	* They can track
	* Act as a keylogger
	* Insert ads
	* Redirect you
* Use extra protection
	* Anti-exploit (https://www.malwarebytes.com/antiexploit/)
	* Microsoft EMET (Enhanced Mitigation Experience Toolkit, https://support.microsoft.com/en-us/help/2458544/the-enhanced-mitigation-experience-toolkit)

__Mobile based attacks__

Ploys:

* Links to Funny Videos
* Dial a number for a voice mail
* Phony patch - cloned website
* Free offers
* App switch - taking a legimate app and publishing on another site with embedded code

Best Practices:

* Use reputable publishers
* Search under the publishers name
* Don't jailbreak mobile devices
* Look for ratings, comments etc
* Check traffic volumes
* Watch for subscriptions
* Beware of Developers (Permissions)

Social media:

Lack of company policies, oversight on employee actions. Hackers are aware of this common lack of oversight and prey on individuals in an informal environment, appealing to their sense of belonging and fear of what everyone thinks of them.

Reputation Risk:

An organisation cannot control reputation risk as they are an external factor, but it is good practice to monitor for inappropriate disclosure, create and enforce policies.

## Misuse of Trust

Disgruntled employees

Attacks can come from within from disgruntled employees. Hackers will target these employees as they hold little loyalty. 

Reasons:

* Unappreciated
* Overworked
* Underpaid
* Passed up for a promotion

Best Practices to protection against insider (trusted) attacks

* The principle of least privilege
	* Only the privilege needed
	* Shortest time necessary
	* Smallest domain (scope)
* Avoid permission creep
* Auditing and Logging
* Limit access
* Inventory Assets

## Penetration Testing with Social Engineering

__Email and Websites__

Phishing and Pharming

* Send out massive emails
* Bait victims to open and respond
* Message appear urgent
* 1 in 10 will respond

Always go directly to any linked sites, do not use links.

Be aware of counterfeit wesbites, malicious content in advertisements and websites taking advantage of exploited or out of date browsers.

Malicious Emails may have attachments that contain malware

Best Practices:

* Think before opening links or attachments
* Stay away from risky websites
* Keep up to date
* Use a safe search tool

__In person and on the phone__

If the employee is busy they may provide the information without thinking for example a busy receptionist providing a key card because they are swamped with work.

__Social-Engineering Toolkit__

Open-source tool, downloadable or already installed on Kali Linux.

Get the victim to:

* Click on a link
* Open a file
* Goto a malicious site

The toolkit allows for the bait creation but you'll need to use Metasploit to create the exploit.

Attacks from 3 main categories

* Phishing and Spear Phishing
* Generate malicious files
* Create a malicious website

The toolkit: https://www.trustedsec.com/tools/the-social-engineer-toolkit-set/

__SET in Kali Linux__

Make sure that the SET configuration has been updated regularly.

There are lots of options in SET to build the bait but there is a requirement to use Metasploit to deliver the content.

SET should be part of the vulnerabilities tests as we need to test the 'human firewall'.

__Countermeasures__

Defending against social engineering is hard as we cannot just defend using hardware and software alone.

* Policies
* Standards
* Education

__Best Practices__

* Caller ID
	* Seperate Ringtone for Internal and External
* Hesitate before transferring an outside call
	* Take the name, company, telephone number and forward the details, hackers use this to collect data of staff
* Helpdesk Policies
* Only authorised individuals to roam freely
	* Escort when possible
* Contractors to show identification
	* Train receptionists to make a phone call when unsure
* Know your employees
	* Employees to wear appropriate ID
	* Protect their ID badges
	* Remove ID when in public
* Browsers and Web
	* Set privacy settings
	* Read privacy policies
	* Use encryption for portal access
	* Train employees to watch for tells of secure and real sites
	* Review company websites removing sensitive information
* Disposal of Media
	* Use of shredders
	* Storage with lockers
* Passwords
	* Use strong, complex passwords
	* Do not give away passwords
	* Do not leave passwords
	* Challenge question on password reset
* Policies
	* Create and enforce realistic policies
	* Clear and Easy to understand policies
* Education
	* Use caution when giving out information
	* How to spot a phish
	* Train supervisors in security awareness
	* Website dedicated to security including tips
* Entire organisation
	* Reinforce observant behaviour (example: reward employees that spot phishing)
	* Employees at all levels are important to security