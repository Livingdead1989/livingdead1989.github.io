---
title:  "System Hacking"
date:   2019-10-31 18:00:00 +0000
categories: hacking
---

## System Hacking Overview

Advanced Persistent Threat (APT)

* Stay in the network undetected
* Goal is to obtain high-value information

__Set the Stage__

Information about the systems has been obtained in previous steps: 

* Reconnaissance has been completed
	* Target location
	* Good times for attack
	* How the target operates
	* Valuable data or services identified
* Scanning and Mapping has been completed
	* Make and model of devices
	* Listening services
	* Evidence of data being sent
	* Live systems
	* Operating systems
* Enumeration has identified weaknesses
	* Users (Windows, Linux)
	* Windows groups
	* Networked devices
	* Identified exploitable devices

This stage is System Hacking, which contains the following:

* Obtaining the password
	* Active online attack
		* Dictionary, brute force, or keylogger
	* Passive online attack
		* Packet sniffing, MITM, and reply attacks
	* Offline evaluation
		* Rainbow attacks
* Escalation of privilege
	* Administration level is the aim
	* Unmounted filesystems or development tools
* Executing applications
	* Install spyware with backdoor
* Hiding files and tools
	* Methods:
		* Rootkits
		* Steganography
		* Alternate data streams
* Covering tracks
	* Clean up any evidence
	* Delete or modify logs

__Authenticate a User__

New Technology LAN Manager (NTLM)

* Microsoft proprietary authentication protocol
* Operates within Explorer
* Uses a challenge/response method
* Use Cases:
	* Authenticating to a non-domain server
	* Peer-to-Peer network or workgroup
	* Firewall restricts Kerberos (Port 88)

Kerberos

* Built into Active Directory
* Uses tickets to access services
* Domain Controller
	* Houses user accounts and passwords
	* Acts as the Key Distribution Center (KDC)
		* Authentication service (AS)
		* Ticket-granting service (TGS)
	* Active Directory as its account database

Pluggable Authentication Modules (PAM)

* Authentication
* Account management
* Session management
* Password management

Simple Authentication and Security Layer (SASL)

* Authentication and data security services 
* Used for various connection oriented protcols (LDAP, PAM, Kerberos etc.) to interact together
* Protocol must include a command for identifying and authenticating a user to a server

## Gaining Access

Ways for a user to authenticate:

* What you know: Password
* What you are: Biometric
* What you have: ID Card


__Where are passwords stored?__

Windows:

* Found in %SystemRoot%/system32/config/SAM
* Accessible only with admin privileges
* Not available while operating system is booted

Syskey was introduced to increase security of the SAM against offline cracking

* Encrypts the password hash values
* 128 RC4 Encryption key, stored in the SAM registry hive
* Not accessible while the operating system is booted

Linux:

* /etc/passwd

__How to obtain?__

Passive Online:

* Sniffing of passwords using a packet analysis tool, such as Wireshark
* MITM (Man-in-the-Middle) such as replay attacks

Active Online:

* Password cracking
	* Software
		* L0phtCrack (Paid)
		* Ophtcrack (Open-Source, supports Rainbow tables)
		* John the Ripper (Cross-platform)
		* Cain and Abel (Windows, extra features: password sniff, cracking and voIP capture)
	* Uses patterns
* Trojan
* Guessing
	* Common passwords: https://www.passwordrandom.com/most-popular-passwords
	* Manufacturer defaults: https://cirt.net/passwords
	* Dictionary Attack
	* Brute Force Attack
	* Hybrid Attack - Dictionary combined with Brute Force
* Phishing
* Keylogger
* Spyware

Hash Injections: "Pass the Hash"

* A technique that sends the hash value instead of the plain password
* Can be done against any service accepting LM or NTLM authentication

Offline:

* Using a distributed rainbow table
	* Rainbow tables are tables containing hash values
	* Users authenticate by entering their password which gets converted into a hash then compared
	* Sites:
		* https://www.fileformat.info/tool/hash.htm - Hash Generator
		* https://project-rainbowcrack.com/ - Downloadable Rainbow Tables
		* http://onlinemd5.com/ - MD5 Hash Generator
		* http://reverse-hash-lookup.online-domain-tools.com/ - Reverse Hash Lookup
	* Salting (random string, stored in the database or with the hash string) will help protect against a rainbow attack

Other Methods:

* Shoulder surfing
* Dumpster diving
* Social engineering
* Buying a password

## Privilege Escalation

Administrative accounts are normally protected so access is gained through lower privileged accounts. Escalation takes advantage of a vulnerability in a piece of software or operating system.

Escalation in two ways:

* Horizontal (peer privileged)
* Vertical (higher privileged)

Default accounts are known and targets. Make sure they are and secure as a ethical hacker will test these accounts.

Local access once obtained can be used to collect data, install rootkits, keyloggers, botnet.

Online botnet checker: https://checkip.kaspersky.com/

Once completed the hacker will clean the system to ensure they are undetected.

__Best Practices__

* Restrict Interactive Logon Privileges
	* MFA
	* Logon to certain machines
* Routine Services
	* Run as unprivileged (non-admin)
* Principle of Least Privilege
	* Users and applications have least privilege to complete the job
* Using encryption
	* Additional layer of protection
* Test and Patch
	* Regular patching
* Browser
	* Security settings of IE to zero or low
* Monitor log files
	* Easy to miss alerts if logging to much
* Education and Training
	* Training for all staff

## Spyware

__Malware Categories__

* Spyware
	* Harvests data:
		* Screen Activity
		* Keystrokes
		* Web form data
		* Internet usage
		* Access to sensitive data
	* Affects the machine:
		* Tracking the users
		* Redirection of hyperlinks
		* Pop-ups
		* Poor Performance
* Viruses
* Worms
* Trojans
	* Presented as a useful tool or free download
* Rootkits

__Internet Browsers__

You may want to block third-party cookies, this can break some sites.

Compact privacy policy tells the user how their information is shared, normally third-party cookies are used for tracking.

Disable ActiveX, although these are some benefits this has been known as a security concern allowing the installation of spyware.

__Protect Your Phone__

* Install app that monitors for security vulnerabilties
* Use caution when downloading apps
* Do not use free Wi-Fi hotspots
* Use "Find my phone" features
* Use strong autentication methods

## Keyloggers

Keyloggers are hard to detect and can cause more damage than a virus.

* Software
	* Runs in the background
	* Records every keystroke
	* Stored on the systems hard drive
	* Can log online activity and screen
* Hardware
	* Physically attached to the system
	* Records each keystroke
	* Saves to onboard memory
	* Easy to install
	* Can be installed inside another device or USB
	* No software installed, undetectable by anti-malware

__Best Practices__

* Use a firewall
	* Egress (outbound) filtering
* Anti-spyware and Anti-Malware
* Windows Users Account Control (UAC)
* Avoid free software
* Use a more secure browser
* Password the system
* Use a limited user
* Install using the admin

## Hiding in Plain Sight

__NTFS Alternate Data Streaming (ADS)__

* Providies compatibility with non-Windows file systems
* Stores data in hidden files linked to a regular file
* Streams are not limited in size
* Attackers can hide tools and data

__Steganography__

"Hiding in Plain Sight"

* Three elements
	* Carrier (e.g. Image, Audio, Text)
	* Payload
	* Hidden message

The human eye can only see a range of colours, slightly tweaking these values we can hide data within pixels (demo: https://cs.vu.nl/~ast/books/mos2/zebras.html)

__Detecting Steganography (Steganalysis)__

Image steganography tools:

* Compare against the original
* Watch for a large image
* Blocky artifacts (pixelated)

Tools:
* Stego Analyst
	* Search for evidence in a image and audio file
* Stego Watch
	* Scans the entire file system
	* Flags suspected files
* Stego Break
	* Obtains the passphrase used on a file (Encryption)

## Cover Your Tracks

Hiding files and tools

* Alternate data streams
* Steganography
* Rootkit
	* Hidden Tools
	* Backdoor access
	* Log scrubbers

Hide any trace of activity

* Disable auditing
	* `auditpol` (CMD)
	* Local Security Policy (GUI)

Clean Up - Linux

* Metasploit `meterpreter > clearev`
* Log files `kwrite /var/log/messages`
* Erase Command History `export HISTSIZE=0`
* Shread Command History `shred -zu root/.bash_history`

Clean Up - Windows

* Event Viewer - Clear Log