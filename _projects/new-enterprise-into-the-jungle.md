---
title: "New Enterprise: Into the Jungle"
layout: project
status: active # active / updated / archived
featured: true
homepage: https://networkingdream.com

description: >
  My journey as Head of IT, covering discovery, standardisation, technical debt reduction, infrastructure improvements,
  self-hosted services, and the realities of managing ICT across a complex estate.

excerpt: >
  Taking over a multi-site educational ICT environment with no handover,
  inconsistent standards, incomplete projects, and years of technical
  debt. Follow the journey as systems are documented, stabilised, and
  improved one step at a time.

tags:
  - ict
  - infrastructure
  - systems-administration
  - self-hosting
  - networking
  - project
  - documentation

started: 2026-04-13
archived: false
updated: 2026-05-31

og_image: /assets/og/projects/new-enterprise-into-the-jungle/new-enterprise-into-the-jungle.png
assets: /assets/og/projects/new-enterprise-into-the-jungle
---

# Into the Jungle

I have worked within the ICT education sector for more than ten years. During that time, I began to grow frustrated with the lack of direction and ownership surrounding many of the systems and services being implemented.

I enjoy the technical side of ICT and believe strongly in ownership, up-skilling teams, and making the most of existing infrastructure before reaching for external solutions. While I understand the benefits of SaaS and cloud platforms, not everything belongs there. I value the freedom, data ownership, simplified billing, and often reduced costs that come with self-hosted services. More importantly, managing systems internally creates opportunities to develop the skills and confidence of the ICT team rather than relying solely on support contracts.

In April 2026, I started as the Head of IT at another educational establishment. Given my mindset at the time, I welcomed the increased responsibility despite knowing it would come with a significant amount of work and more than a little chaos.

The estate I inherited consisted of:

- Three schools across two campuses
  - Active community facilities and services
  - Newly acquired schools with existing infrastructure and support contracts
- Two satellite locations
  - Providing services to external organisations
- Approximately 1,300 students
- Approximately 250 staff
- A mixed server environment consisting of Windows and Linux
- A mixed client environment consisting of Windows, ChromeOS, and macOS

With no formal handover, I started largely blind.

For some, that would be a nightmare. For me, it was an opportunity.

I enjoy reverse engineering systems, understanding how they work, and building the documentation required to support them properly.

The organisation itself is a hive of activity. With a small ICT team and constant operational demands, there would be very few opportunities to disappear into a server room for days at a time while I figured everything out. Instead, I accepted that understanding the environment would be a gradual process alongside supporting the day-to-day needs of the schools.

---

# Welcome to the Chaos

This project is intended to document that journey.

I cannot promise perfectly written articles, deep technical dives into every subject, or even that every decision made will be the correct one. What I can promise is an honest account of the journey, the challenges encountered, the lessons learned, and the solutions implemented along the way.

Hopefully it serves as both a roadmap and an archive.

## First Steps

Before I could even begin assessing the technical environment, I first needed to onboard myself into the organisation.

As an educational establishment, this meant obtaining a valid enhanced DBS certificate and completing the required safeguarding and compliance training.

As a Head of Department and budget holder, there were also administrative tasks that needed completing before I could assume responsibility for accounts, procurement, and financial management.

Alongside this, I needed to familiarise myself with:

- The main campus
- The satellite locations
- The newly acquired schools

The latter would be particularly important, as they would need to be integrated into the wider organisation in preparation for the September term.

There was also some historical tension between the existing ICT support provider and the previous IT management. While I was determined to approach the situation with a clean slate, I knew it had the potential to complicate the transition and increase the challenge of taking ownership of the inherited systems.

## Discovery

With no official handover documentation available, it was time to put on my reverse engineering hat and begin discovering the environment.

My goals were simple:

- Understand what existed
- Understand how it worked
- Understand who owned it
- Document everything

Fortunately, the existing technicians were incredibly helpful in getting me started, providing access to systems, credentials, and valuable historical knowledge.

The discovery process began with:

1. Physical inspection of server rooms and communications cabinets.
2. Reviewing virtual infrastructure and hypervisors.
3. Assessing Active Directory and Group Policy configuration.
4. Identifying, accessing, or reclaiming online accounts and services.
5. Reviewing Microsoft Entra and Google Workspace configurations.

Conversations with the ICT team also proved invaluable. Documentation may tell you how something should work, but the people supporting it every day can often explain how it actually works.

The daily support workload also provided opportunities to learn systems, processes, and recurring pain points from both staff and students.

## Initial Observations

At first glance, the environment appeared to be in reasonable condition.

However, as I started digging deeper, the cracks began to appear.

### Consistency

One of the first things I noticed was the lack of consistency.

Naming standards varied significantly across devices, and there no documented processes governing how things should be done.

Without standards, housekeeping becomes difficult, troubleshooting becomes slower, and technical debt accumulates rapidly.

The issue extended beyond configuration and processes. During my initial survey, I identified roughly four enterprise manufacturers, at least two consumer-grade brands, and a wide range of hardware models in active use.

While some variation is inevitable, the number of platforms significantly increased the support burden. Each manufacturer and model brings its own drivers, firmware, deployment requirements, and warranty processes, creating additional complexity for a small ICT team.

### Broken Systems

A number of systems had clearly suffered from a lack of ongoing maintenance.

The Wi-Fi infrastructure was a good example. Several access points appeared offline, and further investigation revealed that some were simply not connected or had never been fully configured.

At this stage I could only speculate on the root cause. The complexity of the environment combined with limited resources may have contributed, but the important point was that systems were no longer operating as intended.

Other examples included:

- Internet filtering services that lacked appropriate exclusions, breaking browser single sign-on and drive mapping solutions.
- Infrastructure components that had been partially implemented but never fully reviewed.

This highlighted an important lesson: solutions should remain manageable within the capabilities and capacity of the team responsible for supporting them.

### System Building

Device deployment lacked standardisation.

I found systems with:

- Different UEFI administrator passwords
- Secure Boot disabled
- Hardware devices such as webcams and audio disabled
- USB booting left enabled unnecessarily

The team were using a combination of Microsoft Endpoint Configuration Manager (MECM), the free tier of PDQ Deploy, and manual software installation.

The existing task sequences had become bloated with software packages, and available drivers were not handling hardware variations effectively. As a result, technicians often needed to rebuild devices multiple times before achieving a successful deployment.

There were also significant gaps within the MECM configuration itself. For example, client deployment was not automated, resulting in many devices appearing offline despite being operational.

### Incomplete Deployments

Several platforms appeared to have been introduced with good intentions but never fully completed or properly configured.

These quickly found their way onto my "Must Review" list:

- Telephone systems
- Microsoft Intune
- Personnel and visitor sign-in systems
- Printing infrastructure
- Apple device management through Jamf

There were also ongoing projects requiring review and continuation, including the replacement of ageing network switches.

### Security Concerns

Some of the security findings were concerning.

Windows Update had effectively been unmanaged for a prolonged period. Several servers reported that they had not checked for updates since 2023, with uptime figures exceeding 90 days.

I also found:

- Host firewalls disabled
- Inappropriate network profiles
- Shared local and domain administrator accounts
- Credential sharing between staff
- Network infrastructure running firmware several years out of date
- Devices with incorrect system time and date configurations

Shared administrative credentials were particularly concerning as they eliminated accountability and significantly reduced the effectiveness of audit trails.

These issues immediately became priority items, and work began to establish patching schedules, firewall policies, and more appropriate privilege management.

### Cloud and Backup

Cloud services certainly have their place, but they should solve a problem rather than exist for their own sake.

I discovered several examples where cloud services had been introduced without delivering meaningful operational benefits.

One example was a hypervisor cluster witness hosted in the cloud despite suitable on-premises storage already existing.

Backup and disaster recovery arrangements also felt fragmented. Cloud storage allocations appeared poorly planned, backup jobs included systems that added little value, and some critical services were not protected appropriately.

Most concerning was the discovery that an on-premises NAS had been configured to back up cloud services, but synchronisation failures had gone unnoticed for an extended period.

The backups were failing silently, and nobody had realised.

### Bloated Expenditure

I firmly believe in paying for value and supporting products that deliver meaningful benefits.

However, I quickly identified several subscriptions and services that appeared to provide little return on investment.

Examples included:

- Premium-tier AI subscriptions
- Unused web application subscriptions
- Underutilised SaaS platforms
- Legacy leased lines that had never been decommissioned
- Excessive purchasing in some categories

In several cases, expensive security and management platforms had been implemented while fundamental operational practices remained absent.

### Consumer Switching

I also discovered a surprising number of consumer-grade switches deployed throughout the estate.

Some appeared to have been installed as crude solutions to increase port capacity within rooms, while others seemed to have been deployed instead of troubleshooting the problem.

These devices needed to be either replaced with enterprise-grade infrastructure or removed entirely.

Problems introduced by unmanaged consumer switches include:

- Network bottlenecks caused by oversubscribing uplinks
- Reduced visibility during troubleshooting
- Limited support for discovery protocols such as LLDP
- Difficulties implementing security controls
- Poor overall network architecture

Like many temporary solutions, they had simply become permanent.

---

# The Plan

To bring some structure to the chaos, I decided to use [NextCloud Deck](https://apps.nextcloud.com/apps/deck) as a Kanban platform.

A Kanban approach allowed me to:

- Record everything discovered
- Prioritise tasks
- Track progress
- Manage workload
- Maintain visibility across multiple projects

## Priority Scaling

Prioritisation would be based on both urgency and impact.

|            | **Large** | **Medium** | **Small** |
|------------|--------|--------|--------|
| **High** | Critical | High | Medium |
| **Medium** | High | Medium | Low |
| **Low** | Medium | Low | Minimal |


- **Critical**
    - Serious security incident
    - Core services unavailable
    - Teaching and administration halted
- **High**
    - Major outage or security incident
    - Significant staff or student impact
- **Medium**
    - Partial service degradation
    - Reduced efficiency for teaching or administration
- **Low**
    - Localised issue
    - Limited user impact
- **Minimal**
    - No measurable impact on teaching or administration

## Areas of Work

My time would ultimately be divided between several competing priorities:

- Supporting the daily operation of the schools
- Creating documentation and preventative maintenance processes
- Planning holiday-period project work
- Completing existing projects
- Correcting inherited technical debt
- Integrating newly acquired schools
- Whatever unexpected challenges appeared next

Because there are always unexpected challenges.

---

# Implementation

## Looking Ahead

After the first few weeks it became clear that the environment was not fundamentally broken. Instead, it was carrying the weight of years of inconsistent standards, incomplete projects, fragmented ownership, and accumulated technical debt.

Before introducing ambitious new technologies or major transformational projects, I needed visibility, documentation, standardisation, and stability.

The goal was not to rebuild everything.

The goal was to understand it, take ownership of it, and improve it one step at a time.

This is where the journey begins.

## Documentation

Documentation was sparse, inconsistent, heavily AI generated or entirely absent.

I needed a documentation platform that was straightforward, maintainable, and accessible to the team.

After reviewing several options, I selected a self-hosted wiki solution, which I discuss further in my article:

- [Self-Hosted Wiki](https://networkingdream.com/2026/05/03/wiki/)

## Asset Management

An asset management platform already existed, but it primarily served financial and procurement requirements.

To better support ICT operations, I deployed Snipe-IT.

This provides:

- Device lifecycle tracking
- Software licence management
- Contract management
- Improved integration opportunities with other ICT systems

I cover the deployment in:

- [Self-Hosted Asset Management with Snipe-IT](https://networkingdream.com/2026/05/23/snipeit/)

## Ticketing System

A ticketing system was already in place, but it was contributing to workload rather than reducing it.

Poor configuration had resulted in:

- Email chaining issues
- Duplicate tickets
- Additional mailbox administration
- Increased complexity

I ultimately chose to replace it with Zammad.

Benefits included:

- A clean starting point
- Defined ticket workflows
- Clear SLA management
- Improved ticket states
- Removal of unnecessary mailbox management

Further details can be found in:

- [Self-Hosted Ticket System](https://networkingdream.com/2026/05/06/ticketsystem/)

## Network Utilities

A number of lightweight, self-hosted utilities were deployed to improve visibility and operational efficiency.

These included:

- **[Uptime Kuma](https://github.com/louislam/uptime-kuma)** – Service and availability monitoring
- **[LibreSpeed](https://github.com/librespeed/speedtest)** – Privacy-friendly internet speed testing
- **[Speedtest-Tracker](https://github.com/alexjustesen/speedtest-tracker)** – Historical internet performance monitoring
- **[Rackula](https://github.com/RackulaLives/Rackula)** – Rack planning and visualisation
- **[NetDisco](http://netdisco.org/)** – Network discovery and management

Most of these can be deployed quickly using Docker and provide immediate operational value.

I discuss these deployments further in:

- [Docker Network Utilities Server](https://networkingdream.com/2026/05/24/docker-netutil/)


## What's Next?

There is still a significant amount of work ahead, and no doubt a few surprises waiting to be discovered along the way.

Future articles will document the successes, the setbacks, the lessons learned, and the technical decisions made as the environment continues to evolve.

The jungle has been mapped; now the real work begins.