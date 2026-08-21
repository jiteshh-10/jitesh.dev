import type { Education, Experience, Project, SkillGroup, SocialLink } from '@/types/portfolio'

export const projects: Project[] = [
  { slug: 'echodrop', name: 'EchoDrop', tagline: 'Communication after the internet disappears.', description: 'An offline-first communication concept for situations where conventional connectivity is unavailable or unreliable.', problem: 'What happens when the internet disappears?', solution: 'EcoDrop explores Delay/Disruption Tolerant Networking through store-carry-forward communication between nearby devices.', technologies: ['DTN', 'Device-to-device communication'], concepts: ['Offline-first architecture', 'Store-Carry-Forward', 'Connectivity constraints'], status: 'Flagship project', accent: 'turquoise', github: 'https://github.com/jiteshh-10/echo-drop' },
  { slug: 'contexta', name: 'Contexta', tagline: 'Read information with more context.', description: 'A context-oriented reading and knowledge project focused on helping people interact with information more thoughtfully.', problem: 'Information is easier to consume than it is to understand in context.', solution: 'A reading experience shaped around context, relationships, and clearer understanding.', technologies: ['TODO: verify technology'], concepts: ['Context-aware experience', 'Knowledge interaction'], status: 'Project archive', accent: 'purple', github: 'https://github.com/jiteshh-10/contexta' },
  { slug: 'habitualz', name: 'Habitualz', tagline: 'Track habits. Maintain consistency.', description: 'A habit tracking application focused on helping users create and maintain habits over time.', problem: 'Consistency is difficult to see when progress is scattered across days.', solution: 'Habitualz gives habits a simple place to be tracked and understood.', technologies: ['Flutter', 'Firebase', 'Firestore'], concepts: ['Habit tracking', 'Progress over time'], status: 'Project archive', accent: 'yellow' },
  { slug: 'minimizurl', name: 'MinimizUrl', tagline: 'Turn a long URL into a small identifier.', description: 'A URL shortening system that explores backend fundamentals from API design to persistence.', problem: 'Long URLs are difficult to share and manage.', solution: 'Generate a compact Base62 identifier, persist the mapping, and expose it through REST APIs.', technologies: ['Java 17', 'Spring Boot', 'REST APIs', 'JWT', 'Database persistence'], concepts: ['Base62', 'Authentication', 'API design'], status: 'Project archive', accent: 'coral' },
]

export const experience: Experience[] = [
  { company: 'Cognizant', role: 'Java Full Stack / Software Development training and project work', period: 'GenC / Digital Nurture', note: 'Worked in a team context around an Investment Portfolio & Trade Execution Management System.', modules: ['Investor Onboarding & KYC', 'Portfolio Construction & Asset Allocation', 'Trade Order Capture & Execution', 'Settlement & Custody Management', 'Performance Reporting & Risk Analytics'], technologies: ['Java', 'Spring Boot', 'Spring MVC', 'REST APIs', 'Spring Security', 'Spring Data JPA / Hibernate', 'MySQL', 'Thymeleaf', 'JUnit', 'Mockito', 'Git/GitHub', 'Agile', 'PMD', 'Checkstyle'] },
  { company: 'Freelance Software Development', role: 'Client projects', period: 'Requirements → Development → Delivery', note: 'I have also built software based on requirements outside my personal projects. Client and project details remain private.', modules: ['TODO: add verified freelance projects'] },
]

export const skillGroups: SkillGroup[] = [
  { label: 'Languages', skills: ['Java', 'JavaScript', 'SQL', 'PL/SQL', 'Dart'] },
  { label: 'Backend', skills: ['Spring Boot', 'Spring MVC', 'Spring Security', 'Spring Data JPA', 'REST APIs', 'JWT'] },
  { label: 'Frontend', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS', 'Bootstrap', 'Thymeleaf'] },
  { label: 'Mobile', skills: ['Flutter'] },
  { label: 'Databases', skills: ['MySQL', 'MongoDB', 'Firebase / Firestore'] },
  { label: 'Testing & tools', skills: ['Figma', 'JUnit 5', 'Mockito', 'Postman', 'Git', 'GitHub', 'Maven', 'IntelliJ IDEA'] },
  { label: 'Code quality', skills: ['PMD', 'Checkstyle', 'SpotBugs'] },
  { label: 'AI / development tools', skills: ['AI-assisted development tools'] },
]

export const education: Education[] = [{ school: 'LNCT Excellence, Bhopal', program: 'B.Tech — Computer Science & Engineering', period: 'Academic record', results: ['10th: 95.4%', '12th: 96.4%', 'CGPA: 7.81'] }]
export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/jiteshh-10' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/jitesh-sen-0377141ab' },
  { label: 'LeetCode', href: 'https://leetcode.com/u/JiteshSen' },
  { label: 'Email', href: 'mailto:jiteshsen2002@gmail.com' },
  { label: 'Resume', href: '#' },
]
