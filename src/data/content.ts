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
  location: 'Tampa',
} satisfies { name: string; title: Localized<string>; location: string }

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

// Work history is real (from LinkedIn); Food Server excluded per Gavin's call.
export const experienceEntries: ExperienceEntry[] = [
  {
    id: 'role-1',
    kind: 'work',
    period: { en: '2021 — Present', vi: '2021 — Hiện tại' },
    role: { en: 'Software Developer', vi: 'Lập trình viên phần mềm' },
    org: 'Tenex Software Solutions, Inc.',
    highlights: [
      {
        en: 'Updated legacy codebases to modern development standards, improving functionality.',
        vi: 'Cập nhật mã nguồn cũ lên các tiêu chuẩn phát triển hiện đại, giúp cải thiện chức năng hoạt động.',
      },
    ],
  },
  {
    id: 'role-2',
    kind: 'work',
    period: { en: '2020', vi: '2020' },
    role: { en: 'Software Engineer Intern', vi: 'Thực tập sinh Kỹ sư phần mềm' },
    org: 'Tenex Software Solutions, Inc.',
    highlights: [
      { en: 'Coded, tested, and fixed programming errors.', vi: 'Viết mã, kiểm thử và sửa lỗi lập trình.' },
      { en: 'Documented application process flows.', vi: 'Lập tài liệu mô tả luồng xử lý của ứng dụng.' },
    ],
  },
  {
    id: 'role-3',
    kind: 'work',
    period: { en: '2013 — 2020', vi: '2013 — 2020' },
    role: { en: 'Computer Technician', vi: 'Kỹ thuật viên máy tính' },
    org: 'Self-employed',
    highlights: [
      { en: 'Built custom computers to customer specifications.', vi: 'Lắp ráp máy tính theo yêu cầu riêng của khách hàng.' },
      {
        en: 'Disassembled computers to diagnose and examine parts.',
        vi: 'Tháo rời máy tính để chẩn đoán và kiểm tra linh kiện.',
      },
    ],
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

// Real projects (from gavinle.com / Gavin's GitHub). "Operating-System-Project1"
// deliberately excluded — an earlier, less-complete draft of syscall-benchmark.
export const projects: Project[] = [
  {
    id: 'portfolio-site',
    name: 'Personal Portfolio Website',
    category: 'web',
    summary: {
      en: 'A macOS-inspired portfolio with real window management, a dock, Control Center, bilingual content, and full keyboard/accessibility support.',
      vi: 'Một trang portfolio lấy cảm hứng từ macOS với hệ thống quản lý cửa sổ thực thụ, dock, Trung tâm điều khiển, nội dung song ngữ và hỗ trợ đầy đủ cho bàn phím cũng như khả năng tiếp cận.',
    },
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Motion', 'Vite'],
    links: [],
  },
  {
    id: 'syscall-benchmark',
    name: 'Syscall & Context-Switch Benchmark',
    category: 'tools',
    summary: {
      en: 'A C benchmarking tool for Linux that measures the real overhead of a system call and of a context switch — timing repeated syscalls with gettimeofday, and forcing a context switch between two processes via pipe and fork.',
      vi: 'Một công cụ đo hiệu năng viết bằng C cho Linux, đo chi phí thực tế của một lệnh gọi hệ thống (system call) và của một lần chuyển ngữ cảnh (context switch) — tính thời gian các syscall lặp lại bằng gettimeofday, và ép buộc chuyển ngữ cảnh giữa hai tiến trình thông qua pipe và fork.',
    },
    tech: ['C', 'Linux', 'POSIX'],
    links: [{ label: { en: 'Source code', vi: 'Mã nguồn' }, url: 'https://github.com/madebygavin/OS-Project-1' }],
  },
  {
    id: 'memory-simulator',
    name: 'Virtual Memory Simulator',
    category: 'tools',
    summary: {
      en: 'A C simulator that models four page-replacement policies — LRU, FIFO, Random, and a two-partition VMS scheme — against real memory-access trace files, reporting hit rate and disk I/O for each algorithm.',
      vi: 'Một trình mô phỏng viết bằng C, mô hình hoá bốn chính sách thay thế trang (page-replacement) — LRU, FIFO, Random và một cơ chế VMS hai phân vùng — trên các tệp trace truy cập bộ nhớ thực tế, báo cáo tỷ lệ hit và số lần I/O đĩa cho mỗi thuật toán.',
    },
    tech: ['C', 'Memory Management'],
    links: [{ label: { en: 'Source code', vi: 'Mã nguồn' }, url: 'https://github.com/madebygavin/OS-Project-2' }],
  },
  {
    id: 'robot-lab',
    name: 'Raspberry Pi Robot Control',
    category: 'tools',
    summary: {
      en: 'Python control software for a two-wheel Raspberry Pi robot — PWM servo control, wheel-encoder tick counting for speed calibration, and velocity commands in real-world units (inches/sec, rotations/sec).',
      vi: 'Phần mềm điều khiển viết bằng Python cho robot hai bánh chạy trên Raspberry Pi — điều khiển servo bằng PWM, đếm tick từ encoder bánh xe để hiệu chỉnh tốc độ, và ra lệnh vận tốc theo đơn vị thực tế (inch/giây, vòng/giây).',
    },
    tech: ['Python', 'Raspberry Pi'],
    links: [{ label: { en: 'Source code', vi: 'Mã nguồn' }, url: 'https://github.com/madebygavin/RobotLab' }],
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

// ---- ID card (hanging lanyard badge on the desktop) ----
export const idCardStrings = {
  groupLabel: {
    en: 'ID card. Drag it to swing it, or use the button to flip it.',
    vi: 'Thẻ nhân viên. Kéo để đung đưa, hoặc dùng nút để lật thẻ.',
  },
  flipToBack: { en: 'Flip card to see contact details', vi: 'Lật thẻ để xem thông tin liên hệ' },
  flipToFront: { en: 'Flip card to see profile', vi: 'Lật thẻ để xem hồ sơ' },
  underConstruction: { en: 'Under construction', vi: 'Đang xây dựng' },
} satisfies Record<string, Localized<string>>
