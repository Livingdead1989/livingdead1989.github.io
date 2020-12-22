---
title:  "Ethical Hacking: Footprinting and Reconnaissance"
date:   2019-09-10 20:00:00 +0000
categories: ethical hacking
---
# Overview

Ethical hacking helps system administrators understand how to better protect the assets they manage.

Footprinting and Reconnaissance (method of discovery) is the first stage and involves gathering information about the target.

__Footprinting__: learning as much as possible about the target, including remote access capabilities, open ports and services, and what security mechanisms are in place.

__Reconnaissance__: gathering information about the location of a target by scouting or by setting up covert observation points.

__Sequence of Steps__

* Gather information
* Locate the network range
* Discover active machines
* Determine operating systems
* Define running services
* Map the network

## Competitive Intelligence

Competitive Intelligence (legal) to dig public information can be a great nontechnical approach to footprinting and reconnaissance.

Used in business to help a company learn about its competitors in order to make better business decisions.

## Finding information

* Public Resources
	* Websites
	* Directories
	* Email Addresses
	* Job Sites (idea of systems via tech job postings)
	* Social Networks
* Logical Side
	* Network architecture
	* Defence mechanisms
	* Operating systems
	* Applications

## Questions before beginning

* Who is the target?
* What is the target?
* Where is the target?
* When is the best time for an attack?
* How? (learnt after footprinting)

__Document the Findings__: Its important to document any informations to help build a profile.


## Search Engine Hacking

Using advanced operators and keywords that may possibly yield pages that contain sensitive information such as protected login screens.

[Google hacking](https://en.wikipedia.org/wiki/Google_hacking)

[The Google hacking database](https://www.exploit-db.com/google-hacking-database)

* ext:pdf
* filetype:txt

## Social Engineering

Manipulating people to perform actions or reveal confidential information.

* Telephone, 
* Online, 
* Dumpster diving, 
* Shoulder surfing, 
* Eavesdropping, 
* Phishing, Pharming
* Simple persuasion, 
* Impersonation.

Defence: User Education, Authenication Mechanisms, Simply Questioning.

__Dangers of Social Media__:

* No autentication of users (acceptance)
* Forging someone's identity
* Revealing information (travel plans)
* Sharing of unsafe links

__Examples of Public Search Engines__

* [Anywho.com](https://www.anywho.com/whitepages)
* [Spokeo.com](https://www.spokeo.com/)
* [Zabasearch.com](https://www.zabasearch.com/)
* [Pipl.com](https://pipl.com/)
* [Vitalrec.com](http://www.vitalrec.com/)

## Tracking Reputation 

* [Webhose.io](https://webhose.io/)
* [Twitter Alerts](https://help.twitter.com/en/managing-your-account/how-to-use-twitter-alerts)
* [Images.google.com](https://images.google.com/)
* [Google Alerts](https://www.google.co.uk/alerts)
* [raventools.com](https://raventools.com/)



# Email and Websites

## Email

Finding email addresses on public records/websites, crafting an email lists using gained knowledge of username conventions to target for phishing.

Defence:

* Sender Policy Framework (SPF) = 'The From' field spoofing
* Virus filtering and Antivirus techniques
* Strong Spam Filtering 
* User Education

### Email investigation

Reputation-based solutions for investigating email.

Email headers, tell the story of the journey, the stops etc

* [mxtoolbox.com](https://mxtoolbox.com/) - How to get email headers
* [whatismyip.com](https://www.whatismyip.com/) - Email header analyzer

## Website Mirroring

Download the entire website to examine the content, obtaining emails, phone number and other information.

You can sometimes see concealed comments, directories, links to protected content.

__Free and Paid Tools for Website Mirroring/Extracting__:

* [httrack.com](https://www.httrack.com/)
* [wget](https://www.gnu.org/software/wget/)
* [websiterippercopier.com](http://websiterippercopier.com/)

## OSINT Tools

Open-source intelligence gathering tools

Generates a more targeted discovery

* [Maltego](https://www.paterva.com/)
	* Open-source Data Analysis Software
	* Harvests Domain Names, Whois Information and IP Addresses
	* Person Specific Information: Websites and Associated Companies.

* [Shodan](https://www.shodan.io/)
	* Discovers Devices are Connected to the Internet

* [Metagoofil](https://tools.kali.org/information-gathering/metagoofil)
	* Extracts Metadata from the Target

* [FOCA](https://www.elevenpaths.com/labstools/foca/index.html)
	* Examines Metadata

* [theHarvester](https://tools.kali.org/information-gathering/theharvester)
	* Harvests Info from Public Sources

## DNS

DNS uses port 53 over UDP or TCP (zone transfers only)

__Common Types__

* A = IPv4 Address of Host
* AAAA = IPv6 Address of Host
* PTR = Reverse DNS lookup
* MX = Mail Exchange record

__Dangers of DNS__

* Exposed Zone File
* Flood Attack
	* Similar to a denial of service (DOS).
* Cache Poisoning
	* Changes the DNS Cache on the local name server to point toward a bogus server.
* DNS Footprinting
	* Find information managed by the SOA (Start of Authority).

__Good Practice__

* Restrict zone transfers to authorized servers
* Deny all inbound connection requests to TCP Port 53
* Consider using DNS security (authentication mechanisms)

## Domain Name Generators

When phishing, spoofing the brand in the hyperlink may get someone to click on the link.

Domain names and subdomain names can be used to trick a DNS server into transferring its zone file.

[Domain Name Analyzer](https://domainpunch.com/dna/) is an example of a domain name generator tool.

## ICMP

Internet Control Message Protcol (ICMP) resides in the network layer (OSI Layer 3), used by routers and intermediary devices to communicate updates or error information. 

Also used for network troubleshooting and to test if a device is alive/available on the network.

## Tracert

Traces the route and provides the path and transit times.

Returns the FQDN and the IP address of each gate, used to help paint a picture of the network.

## Pathping

Combines features of ping and tracert.

Shows packet loss at any given router or link by computing statistics at the end.

## Nslookup

Non-interactive mode `nslookup google.co.uk`. 

Interactive mode `nslookup` and then enter what you want to search after `google.co.uk`. 

You can also set other options such as `set type=mx` then `google.co.uk` and you'll get the MX records.

## Domain Information Groper (DIG)

tool used to querying the DNS, native to Linux, installation is required for Windows machine and there are online tools such as [toolbox.googleapps.com](https://toolbox.googleapps.com/apps/main/)

## Steps to Reduce Exposure

* Administrators should use a non-standard format email address
* Keep patches up to date
* Monitor for scanning activity
* Shutdown all unnecessary services
* Use strong autentication methods
* Segment the network
* Shed paper based information


