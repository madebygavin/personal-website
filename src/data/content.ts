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
} satisfies Record<string, Localized<string>>
