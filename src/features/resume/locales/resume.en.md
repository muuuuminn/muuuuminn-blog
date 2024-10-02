---
title: "Resume"
date: "2024-09-24"
---

## Basic Information

|               |                                       |
| ------------- | ------------------------------------- |
| Name          | Ohmi Hiroki (近江宏樹)                |
| Date of Birth | 1994/4/13                             |
| Location      | Tokyo, Japan                          |
| Education     | Meiji University, Faculty of Commerce |

## Accounts

- [GitHub](https://github.com/muuuuminn)
- [X(Twitter)](https://x.com/4ho_v)
- Low posting frequency:
  - [Qiita](https://qiita.com/muuuuminn)
  - [Zenn](https://zenn.dev/muuuuminn)

## Career Summary

In 2017, I joined TerraSky as a new graduate SE. In 2019, I joined Yumemi as a front-end engineer. I have worked extensively with Next.js and TypeScript, developing various web applications.

I served as a lead for projects such as a medical reservation site and an entertainment community site. I improved team operations by implementing effective technology choices and weekly retrospectives. I also gained experience in international teams. Over five years, I grew from a member to a leader in CMS development, always seeking efficient development methods, like leveraging Mantine UI and Orval.

I worked on projects with teams of 5 to 20 people, covering everything from requirements definition to operation. I honed my skills in customer negotiations and schedule management, contributing to the team's overall productivity.

## Interests & Focus

- I want to create products that are both useful to people and something I personally like
  - Even better if no one is left unhappy
- I enjoy thinking about usability
- I love gathering knowledge

## Work Mindset

- Never take things for granted
- Always show respect to everyone
- Stay neutral—don’t become too negative or overly positive
  - Maintain a balanced outlook
- Don’t let physical condition affect work—stay in good shape

## Job Preferences

- Remote work
  - If commuting is required, around 30 minutes by train would be ideal
- No dress code

## Detailed Work History

Since I’ve been involved in many projects, I will only list the key ones here.
For more projects, visit [this Notion page](https://muuuuminn.notion.site/2c73b77aa6ae4b3c8fde02813ae7c9d3?v=a08e9ef62a0c4e40b68641924f3fa21d&pvs=4).

::::details Yumemi Inc. (May 2019 – May 2024) / Full-Time / Fully Remote

### Nov 2023 – Mar 2024 / Healthcare / CMS and Reservation Site

- Simultaneously developed a CMS and a reservation site
- The schedule was already delayed
- The project was carried out in collaboration with a partner company
- I joined as the front-end team leader partway through

#### 【Team Size】

20 (Front-end: 9)members

#### 【Role】

Team Leader

#### 【Responsibilities】

Requirements definition, design, development, testing

#### 【Achievements & Initiatives】

- Acted as a communication bridge between designers and the server team
  - I always aimed for this, but especially focused on it for this project
- The project atmosphere was often tense, but I worked hard to remain unaffected and make necessary decisions
- Assigned tasks based on team members' capabilities and schedules
- Delegated tasks to ensure members developed expertise in specific features
  - As understanding deepened, downstream tasks became smoother
  - Addressed concerns of dependence by covering through code reviews
- Implemented authentication using Cognito
- Introduced Orval midway to unify the codebase
- Used GitHub Copilot to auto-generate validation bases for screens with many fields, saving time

#### 【Reflections & Challenges】

- Had to readjust the UI specifications, even after agreement between design and front-end
  - I should have grasped the progress of each UI element upon joining the project

### Mar 2023 – Jan 2024 / Entertainment / Community Site

- Developed a community site where users of a particular game could hold tournaments and interact with each other
- Short deadline

#### 【Team Size】

14 (Front-end: 3)members

#### 【Role】

Team Leader

#### 【Responsibilities】

Requirements definition, design, development, testing, operation & maintenance

#### 【Achievements & Initiatives】

- Given the short deadline relative to project size, I prioritized speed in technology selection
  - For the front-end, I chose Next.js (Page Router) and Mantine UI to streamline development
  - On the back-end, I used OpenAPI, and since we planned to use MSW and Tanstack Query on the front-end, we adopted Orval to auto-generate code
    - Prevented discrepancies and hesitation during mock creation and saved time managing Tanstack Query keys
    - In hindsight, this choice likely prevented significant delays
  - Utilized Scaffdog to auto-generate component templates, speeding up early-stage development
    - The templates facilitated the sharing of component design expectations
- Held weekly retrospectives to share knowledge and concerns
  - The meetings were held in various formats, including LT-style presentations, bug confirmations, and sharing of suggested refactoring points
  - Addressed tasks based on urgency, boosting team ownership
- Provided feedback on design decisions based on technical feasibility and schedule alignment
  - Suggested alternatives and labor-based proposals when needed
  - Also proposed ideas to improve usability

#### 【Reflections & Challenges】

- The test coverage was insufficient
  - Particularly for components with complex state transitions, testing should have been more thorough
  - As a result, there were gaps in specifications and design considerations
  - Merely updating the design documents wasn’t enough; test coverage should have been factored into the estimates

### Nov 2019 – Jul 2020 / Apparel / E-Commerce Site

- Implemented additional features and revamped the existing site
- About 60% of the team were foreign members
- Multiple vendors were involved in the microservice-based architecture
- Onsite work at the client’s location

#### 【Team Size】

20 (Front-end: 9)members

#### 【Role】

Member

#### 【Responsibilities】

Development

#### 【Achievements & Initiatives】

- Implemented SDK-based processes for interacting with the native app, which was difficult to debug locally
  - Had to verify in the development environment step by step
  - Shared points for improvement with the client at the time of leaving
- Proactively participated in code reviews to stay up to date
- Coordinated with other vendors
  - Thought carefully about who to approach to ensure smooth progress
- Learned English expressions
  - Studied synonyms to expand vocabulary and used them in task sharing to improve fluency

#### 【Reflections & Challenges】

- I didn’t realize the intention to reduce the leader’s burden early on
  - Gradually noticed it through casual conversations during lunch breaks and work, understanding the necessary steps
    - From then on, I supported the team by answering questions from members or the PO and sharing information from other vendors

### May 2019 – January 2024 / Entertainment / CMS

- Developed a content management system (CMS) for managing content distributed to an app
- Participated as a member and later worked as the team leader (for approximately 2 years)
- The development process was well-structured and stable
- Releases were scheduled every three months
- Since there was no designer for the CMS, I collaborated with the client to align on the screen design

#### 【Team Size】

20 (Front-end: 3)members

#### 【Role】

Team member, Team leader

#### 【Project Phases】

Requirements definition, design, development, testing, operation, and maintenance

#### 【Achievements and Initiatives】

- Created a team page on Notion for onboarding new members and preparing documentation for team leaders
- Set up a Notion page for task management in line with the development workflow, which was operated for each cycle
- Implemented a feature that saves part of the screen elements as images
- Began gradual refactoring when I became the team leader
  - Managed numerous magic numbers by consolidating them into a constants file
  - Simplified deeply nested styles that made heavy use of SCSS `&`
- Coordinated with the client and back-end team to manage complex status configurations

#### 【Reflections and Challenges】

- Couldn’t complete the refactoring of component design
  - Although it didn’t affect operations, it became a bottleneck for development speed
  - Should have started with areas where the impact was high and the refactoring was easier to implement
- Had a chance to directly ask clients about the usability of the CMS but felt I wasn't able to draw out useful feedback
  - I asked vague questions
  - I should have prepared better-structured questions and formats for the hearing process (e.g., anonymous surveys)

::::

::::details Terrasky Co., Ltd. (April 2017 – December 2019) / Full-Time / On-site

### April 2018 – December 2018 / Bridal / Schedule Management System

- Developed a system to manage resources such as planners and venues on a timeline, specifically for the bridal industry
- Worked on requirements definition and design while also creating a prototype in advance
- Implemented around 70% of the front-end
- Later took on a sub-leader role, managing tasks and acting as a liaison for client consultations

#### 【Team Size】

4 members

#### 【Role】

Team member, Team leader

#### 【Project Phases】

Requirements definition, design, development, testing, operation, and maintenance

#### 【Achievements and Initiatives】

- Began full-fledged front-end development
  - Implemented while studying HTML, CSS, JavaScript, and jQuery
- Developed a rich UI
  - Implemented drag & drop, resizing elements, and calculating the display position of elements
  - The design was inspired by the weekly view in Google Calendar
- Improved performance
  - Adjusted the timing of API calls and rendering
  - Fine-tuned animations while checking the performance in DevTools (details are a bit unclear)
  - Switched to retrieving elements by `id` where possible to optimize element access
- Became proficient at adjusting client requirements and schedules
- Realized the importance of documenting everything in writing
  - When clients requested changes to features that were already fixed in the specifications, having written records made it easier to proceed
- Discovered a bug in the framework
  - As it was not open-source, I couldn’t fix it directly, but I found a workaround and resolved the issue
- Created a user manual for the system

#### 【Reflections and Challenges】

- The implementation took longer than expected, which had some impact on the schedule
  - In hindsight, seeking technical support from external communities, in addition to internal resources, might have been beneficial

::::

## Blog

- [Personal Blog](https://muuuuminn.com/posts)
- [Personal Blog (Author-specific)](https://toritama-diary.com/)

## Skill Keywords

Next.js, Nuxt, TypeScript, React, Vue, JavaScript, HTML, CSS, SCSS, Mantine UI, Bootstrap, Tailwind CSS, Styled components, Emotion, Redux, Vuex, Zustand, Jotai, Tanstack Query, SWR, Apollo Client, GraphQL, MSW, Jest, Storybook, ESLint, Prettier, Git, GitHub Actions, Docker, Vercel, Orval, Zod, OpenAPI, Responsive Design, WebView, CMS Development, WYSIWYG Editor, JIRA, Confluence, Notion, GA4, Cognito, Scrum Development, Agile Development, Requirements Definition, Design, Testing, Operations & Maintenance, Project Management, Team Leadership, Client Negotiations, Estimation, Schedule Management, English

## Links

- [Download Resume in PDF](https://muuuuminn.com/resume.pdf)
- [Unread Articles](https://www.notion.so/muuuuminn/5e044befd9a9486e92f727169a59d6c9?v=ec5ede1125a44b898f8e40369eb871a9&pvs=73)
- [Read Articles](https://www.notion.so/muuuuminn/1d6db77b5bac4bd29ba1c4c54cbbb98e?v=7d25267df5b54f6a8194e746b58d4278)
- [YouTube Channel](https://www.youtube.com/@nyakinyaki/videos)
