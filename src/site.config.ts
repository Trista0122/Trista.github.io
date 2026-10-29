/**
 * 站点个人信息 —— 只需要改这一个文件。
 */
export const SITE = {
  /** 站名 / 昵称（导航栏、标题、头像字母都从这里取） */
  nickname: 'Trista',
  /** 头像中显示的字母；留空则自动取昵称首字母 */
  avatarLetter: '',
  /** 联系邮箱（占位） */
  email: 'hello@example.com',
  /** GitHub 主页 */
  github: 'https://github.com/Trista0122',
  /** GitHub 用户名（显示用） */
  githubHandle: 'Trista0122',
  /** 一句话介绍 */
  tagline: {
    zh: '在金融与计算机的交叉地带，边做边学。',
    en: 'Learning by building, where finance meets computer science.',
  },
  /** 浏览器标签页 / 搜索引擎的站点描述 */
  description: {
    zh: '一名金融 × 计算机方向本科生的成长型个人主页：项目、学习笔记与思考过程。',
    en: 'A growing personal site of an undergraduate in finance × computer science: projects, notes and thinking in progress.',
  },
} as const;
