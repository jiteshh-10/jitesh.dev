import type { Education, Experience, Project, SkillGroup, SocialLink } from '@/types/portfolio'
import { site } from '@/lib/constants'

export { site }

export const projects: Project[] = [
  {
    slug: 'ecodrop',
    name: 'EchoDrop',
    category: 'ANDROID / OFFLINE SYSTEMS',
    headline: "Communication that survives when the internet doesn't.",
    tagline: 'Messages hop device to device — no network required.',
    description: 'An offline-first Android messaging system designed for unreliable connectivity using Bluetooth Low Energy and delay/disruption-tolerant networking.',
    problem: 'Conventional messaging assumes reliable internet infrastructure.',
    solution: 'Nearby devices store and forward fragmented messages until a destination is reachable, with encryption, deduplication, and expiry built into delivery.',
    engineering: ['BLE GATT communication', 'Store-carry-forward messaging', 'Delay-tolerant networking', 'Fragmentation and reassembly', 'UUID-based deduplication', 'TTL-based expiry', 'Encrypted private messaging'],
    technologies: ['Android', 'Java', 'BLE GATT', 'DTN'],
    concepts: ['Offline-first', 'Store-carry-forward'],
    status: '01 / offline mesh messaging',
    accent: 'turquoise',
    github: 'https://github.com/jiteshh-10/EchoDrop',
    liveUrl: 'https://jiteshh-10.github.io/echo-drop/',
  },
  {
    slug: 'minimizurl',
    name: 'MinimizUrl',
    category: 'BACKEND ENGINEERING',
    headline: 'A production-minded URL shortening backend.',
    tagline: 'Long links in, short codes out — behind real boundaries.',
    description: 'A REST-based URL shortening service designed around layered architecture, secure authentication, collision-resistant short links, asynchronous analytics, and expiring data.',
    problem: 'URL shortening becomes a system problem once authentication, ownership, persistence, expiry, and analytics matter.',
    solution: 'Compact identifiers, secured endpoints, expiring links, and async analytics keep the redirect path small and dependable.',
    engineering: ['Controller-Service-Repository boundaries', 'Java 17 and Spring Boot', 'Spring Security with JWT and RBAC', 'Token expiry', 'Base62 encoding', 'Atomic ID sequences', 'Asynchronous analytics', 'TTL-indexed MongoDB collections'],
    technologies: ['Java', 'Spring Boot', 'Spring Security', 'JWT', 'MongoDB'],
    concepts: ['Base62', 'SOLID', 'RBAC'],
    status: '02 / backend engineering',
    accent: 'coral',
    github: 'https://github.com/jiteshh-10/minimizurl',
  },
  {
    slug: 'contexta',
    name: 'Contexta',
    category: 'MOBILE / AI / READING',
    headline: 'Understand difficult words without leaving the story.',
    tagline: 'Select a word. Get the meaning in context. Keep reading.',
    description: 'An AI-powered reading companion for contextual word explanations, personal vocabulary, and local-first reading workflows.',
    problem: 'Generic dictionary definitions can miss the meaning a word takes from its surrounding literary context.',
    solution: 'Contextual explanations, local caching, and synchronization make help available without repeatedly leaving the reading flow.',
    engineering: ['Contextual word explanations', 'SQLite local caching', 'Firestore synchronization', 'Personal word library', 'Word frequency', 'Difficulty and context tags', 'Reading history', 'Full-text search', 'Export functionality'],
    technologies: ['Flutter', 'Firebase', 'SQLite'],
    concepts: ['Open source', 'Contextual AI', 'Local-first'],
    status: '03 / AI-assisted reading',
    accent: 'purple',
    github: 'https://github.com/jiteshh-10/Contexta',
  },
  {
    slug: 'habitualz',
    name: 'Habitualz',
    category: 'MOBILE / PRODUCT',
    headline: 'A habit tracker built around consistency.',
    tagline: 'Check in daily. Watch the streak grow.',
    description: 'A habit-tracking application focused on persistence, streaks, progress visualization, and lightweight daily interaction.',
    problem: 'Consistency is difficult to understand when progress is scattered across days.',
    solution: 'Habitualz gives daily actions a focused place to persist, repeat, and become visible as progress.',
    engineering: ['Flutter mobile development', 'Habit persistence and daily check-ins', 'Streak and progress tracking', 'Progress history views', 'Firebase / Firestore data layer'],
    technologies: ['Flutter', 'Firebase', 'Firestore'],
    concepts: ['Habit tracking', 'Streaks', 'Progress analytics'],
    status: '04 / mobile product',
    accent: 'yellow',
  },
]

export const experience: Experience[] = [
  {
    company: 'Cognizant Technology Solutions',
    role: 'GenC Intern · ADM Java',
    period: 'APR 2026 — JUL 2026',
    note: 'IPTEMS — an enterprise capital-markets and trade-execution platform built with a five-person Agile team. Contributed across requirements, design, APIs, testing, quality, and delivery.',
    modules: ['Client onboarding', 'Portfolio management', 'Trade execution', 'Settlement', 'Analytics'],
    technologies: ['Java 17', 'Spring Boot', 'Spring Data JPA', 'Spring Security', 'REST APIs', 'Microservices decomposition', 'API Gateway', 'Eureka', 'Config Server', 'OpenFeign', 'JWT & RBAC', 'JUnit 5', 'Mockito', 'PMD · Checkstyle · SpotBugs · JaCoCo', 'Maven & SonarQube quality gates', 'Git'],
  },
  {
    company: 'Cloute',
    role: 'Software Developer · Technology Lead',
    period: 'PRESENT',
    note: 'Client projects led from requirements and estimation through development, iteration, and delivery. Built a Flutter salon-management and billing application covering the full daily workflow.',
    modules: ['Client requirements', 'Estimation', 'Development & delivery', 'Client communication', 'Salon management & billing', 'Wallet transactions', 'Payment tracking', 'Digital receipts', '58mm ESC/POS thermal printing'],
    technologies: ['Flutter', 'Client communication', 'Requirements analysis'],
  },
]

export const certifications = ['Wipro TalentNext Java Full Stack (2025)', 'Postman API Fundamentals Student Expert', 'NPTEL Programming in Java (2024)']

export const bring = [
  { label: 'Engineering', value: 'Backend / Full Stack' },
  { label: 'Delivery', value: 'Requirements → Development → Testing → Delivery' },
  { label: 'Collaboration', value: 'Reviews / Estimation / Client Communication / Agile' },
]

export const skillGroups: SkillGroup[] = [
  { label: 'Languages', skills: ['Java', 'JavaScript', 'SQL', 'PL/SQL'] },
  { label: 'Backend', skills: ['Spring Boot', 'Spring MVC', 'Spring Security', 'REST APIs', 'JWT', 'Microservices'] },
  { label: 'Frontend', skills: ['React', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'Thymeleaf'] },
  { label: 'Mobile', skills: ['Flutter', 'Android'] },
  { label: 'Databases', skills: ['MySQL', 'MongoDB', 'Firebase / Firestore', 'JPA', 'Hibernate'] },
  { label: 'Testing', skills: ['JUnit 5', 'Mockito', 'Postman'] },
  { label: 'Code quality', skills: ['PMD', 'Checkstyle', 'SpotBugs', 'JaCoCo', 'SonarQube'] },
  { label: 'Delivery', skills: ['Maven', 'Git', 'GitHub', 'Docker', 'IntelliJ IDEA'] },
]

export const education: Education[] = [{
  school: 'LNCT Excellence, Bhopal',
  program: 'B.Tech — Computer Science & Engineering',
  period: 'Academic record',
  results: ['10th: 95.4%', '12th: 96.4%', 'Current CGPA: 7.71', '7th Semester SGPA: 8.92'],
}]

export const contactPrimary = { label: 'Start a conversation', href: 'https://linkedin.com/in/jitesh-sen-0377141ab' }
export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/jiteshh-10' },
  { label: 'LeetCode', href: 'https://leetcode.com/u/JiteshSen' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/jitesh-sen-0377141ab' },
]
