import type { Education, Experience, Project, SkillGroup, SocialLink } from '@/types/portfolio'

export const projects: Project[] = [
  { slug: 'ecodrop', name: 'EchoDrop', tagline: "Communication that survives when the internet doesn't.", description: 'An Android offline-first messaging system designed for unreliable connectivity using BLE GATT and Delay/Disruption Tolerant Networking.', problem: 'Conventional messaging assumes reliable internet infrastructure.', solution: 'Nearby devices store and forward fragmented messages until a destination is reachable, with encryption, deduplication, and expiry built into delivery.', engineering: ['BLE GATT communication', 'Multi-hop DTN delivery', 'Fragmentation and reassembly', 'UUID deduplication', 'TTL expiry', 'Encrypted private messaging'], technologies: ['Android', 'Java', 'BLE GATT', 'DTN'], concepts: ['Offline-first', 'Store-carry-forward'], status: '01 / offline mesh messaging', accent: 'turquoise', github: 'https://github.com/jiteshh-10/EchoDrop', liveUrl: 'https://jiteshh-10.github.io/echo-drop/' },
  { slug: 'minimizurl', name: 'MinimizUrl', tagline: 'A small URL built on serious backend fundamentals.', description: 'A Spring Boot URL shortener built around clean backend boundaries, secure access, compact identifiers, and asynchronous analytics.', problem: 'URL shortening becomes a system problem once authentication, ownership, persistence, expiry, and analytics matter.', solution: 'Compact identifiers, secured endpoints, expiring links, and async analytics keep the redirect path small and dependable.', engineering: ['Java 17 and Spring Boot', 'Controller-Service-Repository boundaries', 'Base62 with atomic ID sequences', 'JWT and RBAC security', 'Async analytics with @Async', 'TTL-indexed MongoDB collections'], technologies: ['Java 17', 'Spring Boot', 'Spring Security', 'JWT', 'MongoDB'], concepts: ['Base62', 'SOLID', 'RBAC'], status: '02 / backend engineering', accent: 'coral', github: 'https://github.com/jiteshh-10/minimizurl' },
  { slug: 'contexta', name: 'Contexta', tagline: 'Understand difficult words without leaving the story.', description: 'An open-source Flutter reading companion that explains words in context while keeping the reader inside the story.', problem: 'Generic dictionary definitions can miss the meaning a word takes from its surrounding literary context.', solution: 'Contextual explanations, local caching, and synchronization make help available without repeatedly leaving the reading flow.', engineering: ['Flutter mobile UI', 'AI-driven contextual explanations', 'SQLite local caching', 'Firestore synchronization', 'Saved vocabulary and reading library', 'CSV, JSON, and Markdown export'], technologies: ['Flutter', 'Firebase', 'SQLite'], concepts: ['Open source', 'Contextual AI', 'Local-first'], status: '03 / open-source AI reading companion', accent: 'purple', github: 'https://github.com/jiteshh-10/Contexta' },
  { slug: 'habitualz', name: 'Habitualz', tagline: 'Track habits. Make consistency visible.', description: 'A mobile habit-tracking product focused on persistence, streaks, progress, and useful feedback over time.', problem: 'Consistency is difficult to understand when progress is scattered across days.', solution: 'Habitualz gives daily actions a focused place to persist, repeat, and become visible as progress.', engineering: ['Flutter mobile development', 'Habit persistence and daily check-ins', 'Streak and progress tracking', 'Analytics and history views', 'Firebase / Firestore data layer'], technologies: ['Flutter', 'Firebase', 'Firestore'], concepts: ['Habit tracking', 'Streaks', 'Progress analytics'], status: '04 / mobile product', accent: 'yellow' },
]

export const experience: Experience[] = [
  { company: 'Cognizant Technology Solutions', role: 'GenC Intern — ADM Java', period: 'Apr 2026 — Jul 2026', note: 'IPTEMS is an enterprise capital-markets and trade-execution platform built in a 5-developer Agile team. Contributed across requirements, design, APIs, testing, quality, and delivery.', modules: ['Client onboarding', 'Portfolio management', 'Trade execution', 'Settlement', 'Analytics'], technologies: ['Java 17', 'Spring Boot', 'Spring Data JPA', 'Spring Security', 'API Gateway', 'Eureka', 'Config Server', 'OpenFeign', 'JWT', 'RBAC', 'JUnit 5', 'Mockito', 'PMD', 'Checkstyle', 'SpotBugs', 'JaCoCo', 'SonarQube', 'Git'] },
  { company: 'Cloute', role: 'Software Developer | Technology Lead', period: 'Ongoing', note: 'Lead client projects from requirements and estimation through development, iteration, and delivery. Built a Flutter salon management and billing application with customer management, service billing, wallets, payment tracking, digital receipts, and 58mm ESC/POS thermal printing.', modules: ['Requirements discussions', 'Estimation', 'Feature implementation', 'Bug fixing', 'Enhancements', 'Client communication', 'Delivery'], technologies: ['Flutter', 'Client communication', 'Requirements analysis'] },
]

export const certifications = ['Wipro TalentNext Java Full Stack (2025)', 'Postman API Fundamentals Student Expert', 'NPTEL Programming in Java (2024)']

export const bring = [
  { label: 'Engineering', value: 'Backend / Full Stack' },
  { label: 'Delivery', value: 'Requirements → Development → Testing → Delivery' },
  { label: 'Collaboration', value: 'Reviews / Estimation / Client Communication / Agile' },
]

export const skillGroups: SkillGroup[] = [
  { label: 'Languages', skills: ['Java', 'JavaScript', 'SQL', 'PL/SQL'] },
  { label: 'Backend', skills: ['Spring Boot', 'Spring MVC', 'Spring Security', 'Spring Data JPA', 'REST APIs', 'JWT'] },
  { label: 'Frontend', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS', 'Bootstrap', 'Thymeleaf'] },
  { label: 'Mobile', skills: ['Flutter'] },
  { label: 'Databases', skills: ['MySQL', 'MongoDB', 'Firebase / Firestore'] },
  { label: 'Testing & tools', skills: ['JUnit 5', 'Mockito', 'Postman', 'Git', 'GitHub', 'Maven', 'IntelliJ IDEA'] },
  { label: 'Code quality', skills: ['PMD', 'Checkstyle', 'SpotBugs'] },
  { label: 'AI / development tools', skills: ['AI-assisted development tools'] },
]

export const education: Education[] = [{ school: 'LNCT Excellence, Bhopal', program: 'B.Tech — Computer Science & Engineering', period: 'Academic record', results: ['10th: 95.4%', '12th: 96.4%', 'Current / most recent CGPA: 7.71', '7th Semester SGPA: 8.92'] }]
export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/jiteshh-10' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/jitesh-sen-0377141ab' },
  { label: 'LeetCode', href: 'https://leetcode.com/u/JiteshSen' },
  { label: 'Email', href: '#' },
  { label: 'Resume', href: '#' },
]
