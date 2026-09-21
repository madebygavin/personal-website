export type Localized<T> = { en: T; vi: T }

export type AppId = 'about' | 'skills' | 'experience' | 'projects' | 'contact'

// The only real facts in this file: name and title. Everything else is placeholder
// content to be replaced by Gavin later (see PROJECT_BRIEF.md section 8).
export const profile = {
  name: 'Gavin',
  title: {
    en: 'Software Developer',
    vi: 'Lập trình viên phần mềm',
  },
} satisfies { name: string; title: Localized<string> }

// Dock tooltips + menu bar active-app label (PROJECT_BRIEF.md 7.5 gap #1, 7.6).
export const appNames = {
  about: { en: 'About me', vi: 'Giới thiệu' },
  skills: { en: 'Skills', vi: 'Kỹ năng' },
  experience: { en: 'Experience', vi: 'Kinh nghiệm' },
  projects: { en: 'Projects', vi: 'Dự án' },
  contact: { en: 'Contact', vi: 'Liên hệ' },
} satisfies Record<AppId, Localized<string>>

export const uiStrings = {
  login: { en: 'Login', vi: 'Đăng nhập' },
  logout: { en: 'Log Out', vi: 'Đăng xuất' },
  restart: { en: 'Restart', vi: 'Khởi động lại' },
  loading: { en: 'Loading', vi: 'Đang tải' },
  desktopLabel: { en: 'Desktop', vi: 'Màn hình nền' },
  aboutThisSite: { en: 'About This Site', vi: 'Giới thiệu trang web' },
  close: { en: 'Close', vi: 'Đóng' },
  logoMenuLabel: { en: 'Logo menu', vi: 'Trình đơn logo' },
  controlCenter: { en: 'Control Center', vi: 'Trung tâm điều khiển' },
  appearance: { en: 'Appearance', vi: 'Giao diện' },
  dark: { en: 'Dark', vi: 'Tối' },
  light: { en: 'Light', vi: 'Sáng' },
  brightness: { en: 'Brightness', vi: 'Độ sáng' },
  language: { en: 'Language', vi: 'Ngôn ngữ' },
  builtWith: {
    en: 'Built with React, Vite, Tailwind, Framer Motion',
    vi: 'Được xây dựng bằng React, Vite, Tailwind, Framer Motion',
  },
  viewSource: { en: 'View source on GitHub', vi: 'Xem mã nguồn trên GitHub' },
  minimize: { en: 'Minimize', vi: 'Thu nhỏ' },
  maximize: { en: 'Maximize', vi: 'Phóng to' },
  filterAll: { en: 'All', vi: 'Tất cả' },
  filterWeb: { en: 'Web', vi: 'Web' },
  filterTools: { en: 'Tools', vi: 'Công cụ' },
  back: { en: 'Back', vi: 'Quay lại' },
  notesNavLabel: { en: 'Notes', vi: 'Ghi chú' },
  skillCategoriesNavLabel: { en: 'Skill categories', vi: 'Danh mục kỹ năng' },
  projectFiltersNavLabel: { en: 'Project filters', vi: 'Bộ lọc dự án' },
  contactChannelsNavLabel: { en: 'Contact channels', vi: 'Kênh liên hệ' },
  education: { en: 'Education', vi: 'Học vấn' },
} satisfies Record<string, Localized<string>>

// ---- About me (section 7.8) ----
export interface AboutNote {
  id: string
  title: Localized<string>
  body: Localized<string>
}

// Bio is real (from gavinle.com). Interests and fun facts are still
// TODO(gavin) — no real content for those yet.
export const aboutNotes: AboutNote[] = [
  {
    id: 'bio',
    title: { en: 'Bio', vi: 'Tiểu sử' },
    body: {
      en: 'A software engineer specialising in .NET, Go, and modern web technologies. I build clean, reliable, and scalable applications. I am a dedicated software engineer with strong expertise in the .NET Framework, exceptional teamwork skills, and a proven ability to quickly learn and adapt to new technologies. I thrive in collaborative environments, bringing excellent communication and problem-solving abilities to deliver high-quality software solutions. Whether building robust applications or optimizing existing systems, I am passionate about creating impactful results and exceeding expectations.',
      vi: 'Mình là một kỹ sư phần mềm chuyên về .NET, Go và các công nghệ web hiện đại. Mình xây dựng những ứng dụng gọn gàng, đáng tin cậy và có khả năng mở rộng tốt. Mình có thế mạnh vững chắc về .NET Framework, kỹ năng làm việc nhóm xuất sắc, cùng khả năng học hỏi và thích nghi nhanh với công nghệ mới. Mình phát huy tốt trong môi trường làm việc hợp tác, mang đến khả năng giao tiếp và giải quyết vấn đề tốt để tạo ra các giải pháp phần mềm chất lượng cao. Dù là xây dựng ứng dụng vững chắc hay tối ưu hệ thống hiện có, mình luôn đam mê tạo ra kết quả có giá trị thực sự và vượt kỳ vọng.',
    },
  },
  {
    id: 'interests',
    title: { en: 'Interests', vi: 'Sở thích' },
    body: {
      en: 'Placeholder interests: distributed systems, generative art, mechanical keyboards, and long-distance running.',
      vi: 'Sở thích tạm thời: hệ thống phân tán, nghệ thuật tạo sinh, bàn phím cơ và chạy bộ đường dài.',
    },
  },
  {
    id: 'fun-facts',
    title: { en: 'Fun facts', vi: 'Sự thật thú vị' },
    body: {
      en: 'Placeholder fun fact: this entire desktop is a website pretending to be an operating system.',
      vi: 'Sự thật thú vị tạm thời: toàn bộ "màn hình nền" này thực chất là một trang web giả lập hệ điều hành.',
    },
  },
]

// ---- Skills (section 7.8) ----
export interface Skill {
  name: string
  level: number // 0-100
}

export interface SkillCategory {
  id: string
  label: Localized<string>
  skills: Skill[]
}

// Frontend and Backend are real (from gavinle.com) — Languages and Tools
// still have no real replacement, so they stay as-was pending Gavin.
// TODO(gavin): confirm real proficiency levels for Frontend/Backend — none
// were given, every entry below defaults to 80.
export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    label: { en: 'Languages', vi: 'Ngôn ngữ lập trình' },
    skills: [
      { name: 'TypeScript', level: 90 },
      { name: 'JavaScript', level: 90 },
      { name: 'Python', level: 75 },
      { name: 'Go', level: 55 },
    ],
  },
  {
    id: 'frontend',
    label: { en: 'Frontend', vi: 'Frontend' },
    skills: [
      { name: 'CSS', level: 80 },
      { name: 'HTML', level: 80 },
      { name: 'JavaScript', level: 80 },
      { name: 'React', level: 80 },
    ],
  },
  {
    id: 'backend',
    label: { en: 'Backend', vi: 'Backend' },
    skills: [
      { name: '.NET (VB.NET / C#)', level: 80 },
      { name: 'MySQL', level: 80 },
      { name: 'Go', level: 80 },
      { name: 'Python', level: 80 },
    ],
  },
  {
    id: 'tools',
    label: { en: 'Tools', vi: 'Công cụ' },
    skills: [
      { name: 'Git', level: 90 },
      { name: 'Docker', level: 65 },
      { name: 'Cloudflare Workers', level: 60 },
      { name: 'Figma', level: 55 },
    ],
  },
]

// ---- Experience (section 7.8) ----
export interface ExperienceEntry {
  id: string
  kind: 'work' | 'education'
  period: Localized<string>
  role: Localized<string>
  org: string
  highlights: Localized<string>[]
}

// TODO(gavin): replace with your real roles, dates, and education.
export const experienceEntries: ExperienceEntry[] = [
  {
    id: 'role-1',
    kind: 'work',
    period: { en: '2023 — Present', vi: '2023 — Hiện tại' },
    role: { en: 'Software Developer', vi: 'Lập trình viên phần mềm' },
    org: 'Acme Corp',
    highlights: [
      { en: 'Placeholder highlight about a shipped feature.', vi: 'Điểm nhấn placeholder về một tính năng đã triển khai.' },
      { en: 'Placeholder highlight about improving performance.', vi: 'Điểm nhấn placeholder về việc cải thiện hiệu năng.' },
    ],
  },
  {
    id: 'role-2',
    kind: 'work',
    period: { en: '2021 — 2023', vi: '2021 — 2023' },
    role: { en: 'Frontend Developer', vi: 'Lập trình viên Frontend' },
    org: 'Globex Solutions',
    highlights: [
      { en: 'Placeholder highlight about a UI rebuild.', vi: 'Điểm nhấn placeholder về việc xây dựng lại giao diện.' },
      { en: 'Placeholder highlight about mentoring teammates.', vi: 'Điểm nhấn placeholder về việc hướng dẫn đồng nghiệp.' },
    ],
  },
  {
    id: 'role-3',
    kind: 'work',
    period: { en: '2019 — 2021', vi: '2019 — 2021' },
    role: { en: 'Junior Developer', vi: 'Lập trình viên mới vào nghề' },
    org: 'Initech Labs',
    highlights: [{ en: 'Placeholder highlight about an early project.', vi: 'Điểm nhấn placeholder về một dự án ban đầu.' }],
  },
  {
    id: 'education-1',
    kind: 'education',
    period: { en: '2015 — 2019', vi: '2015 — 2019' },
    role: { en: 'B.S. in Computer Science', vi: 'Cử nhân Khoa học Máy tính' },
    org: 'State University',
    highlights: [
      { en: 'Placeholder note about coursework or honors.', vi: 'Ghi chú placeholder về chương trình học hoặc thành tích.' },
    ],
  },
]

// ---- Projects (section 7.8) ----
export interface ProjectLink {
  label: Localized<string>
  url: string
}

export interface Project {
  id: string
  name: string
  category: 'web' | 'tools'
  summary: Localized<string>
  tech: string[]
  links: ProjectLink[]
}

// TODO(gavin): replace with your real projects, links, and screenshots.
export const projects: Project[] = [
  {
    id: 'project-one',
    name: 'Project Name One',
    category: 'web',
    summary: {
      en: 'Placeholder description of a web project — what it does and why it exists.',
      vi: 'Mô tả placeholder cho một dự án web — dự án làm gì và vì sao nó tồn tại.',
    },
    tech: ['React', 'TypeScript', 'Tailwind CSS'],
    links: [
      { label: { en: 'Live demo', vi: 'Bản demo' }, url: 'https://example.com' },
      { label: { en: 'Source code', vi: 'Mã nguồn' }, url: 'https://github.com/gavin-example/project-one' },
    ],
  },
  {
    id: 'project-two',
    name: 'Project Name Two',
    category: 'web',
    summary: {
      en: 'Placeholder description of another web project, focused on a different problem.',
      vi: 'Mô tả placeholder cho một dự án web khác, tập trung vào một vấn đề khác.',
    },
    tech: ['Next.js', 'Node.js', 'PostgreSQL'],
    links: [{ label: { en: 'Source code', vi: 'Mã nguồn' }, url: 'https://github.com/gavin-example/project-two' }],
  },
  {
    id: 'project-three',
    name: 'CLI Tool Name',
    category: 'tools',
    summary: {
      en: 'Placeholder description of a command-line tool that automates something tedious.',
      vi: 'Mô tả placeholder cho một công cụ dòng lệnh giúp tự động hoá việc gì đó nhàm chán.',
    },
    tech: ['Go'],
    links: [{ label: { en: 'Source code', vi: 'Mã nguồn' }, url: 'https://github.com/gavin-example/cli-tool' }],
  },
  {
    id: 'project-four',
    name: 'Browser Extension Name',
    category: 'tools',
    summary: {
      en: 'Placeholder description of a small browser extension built for a personal workflow.',
      vi: 'Mô tả placeholder cho một tiện ích trình duyệt nhỏ phục vụ quy trình làm việc cá nhân.',
    },
    tech: ['TypeScript'],
    links: [{ label: { en: 'Source code', vi: 'Mã nguồn' }, url: 'https://github.com/gavin-example/extension' }],
  },
]

// ---- Contact (section 7.8) ----
export interface ContactChannel {
  id: 'email' | 'linkedin' | 'github'
  label: Localized<string>
}

export const contactChannels: ContactChannel[] = [
  { id: 'email', label: { en: 'Email', vi: 'Email' } },
  { id: 'linkedin', label: { en: 'LinkedIn', vi: 'LinkedIn' } },
  { id: 'github', label: { en: 'GitHub', vi: 'GitHub' } },
]

// LinkedIn and GitHub are real (from gavinle.com). Email is real but
// TODO(gavin): confirm contact@gavinle.com is still current — carried over
// from the old site's export, not independently confirmed.
export const contactInfo = {
  email: 'contact@gavinle.com',
  linkedinUrl: 'https://www.linkedin.com/in/gavin-le',
  githubUrl: 'https://github.com/madebygavin',
}

export const contactMessage: Localized<string> = {
  en: "Feel free to reach out — whether it's a job opportunity, collaboration, or just a hello!",
  vi: 'Đừng ngại liên hệ với mình — dù là cơ hội việc làm, hợp tác, hay chỉ đơn giản là một lời chào!',
}
