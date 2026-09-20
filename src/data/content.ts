export type Localized<T> = { en: T; vi: T }

// The only real facts in this file: name and title. Everything else is placeholder
// content to be replaced by Gavin later (see PROJECT_BRIEF.md section 8).
export const profile = {
  name: 'Gavin',
  title: {
    en: 'Software Developer',
    vi: 'Lập trình viên phần mềm',
  },
} satisfies { name: string; title: Localized<string> }

export const uiStrings = {
  login: { en: 'Login', vi: 'Đăng nhập' },
  logout: { en: 'Log Out', vi: 'Đăng xuất' },
  restart: { en: 'Restart', vi: 'Khởi động lại' },
  loading: { en: 'Loading', vi: 'Đang tải' },
} satisfies Record<string, Localized<string>>
