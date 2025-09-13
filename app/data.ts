type Project = {
  name: string
  description: string
  link: string
  id: string
}

type Experience = {
  company: string
  title: string
  start: string
  end: string
  id: string
}

type BlogPost = {
  title: string
  description: string
  link: string
  uid: string
}

type SocialLink = {
  label: string
  link: string
}

export const PROJECTS: Project[] = [
  {
    name: 'Healthball',
    description:
      'Soccer players injury risk prediction application.',
    link: 'https://pro.motion-primitives.com/',
    id: 'project1',
  },
  {
    name: 'Website Checker',
    description: 'A lightweight monitoring tool that checks website availability and notifies via Slack when downtime is detected.',
    link: 'https://github.com/boonjo/WebsiteChecker/',
    id: 'project2',
  },
]

export const EXPERIENCE: Experience[] = [
  {
    company: 'Samsung',
    title: 'Software Engineer',
    start: '2023',
    end: 'Present',
    id: 'work1',
  }
]

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'The Rise of Injuries in Soccer',
    description: 'Analyzed injury trends in professional soccer and developed a predictive model that estimates player risk by incorporating injury history, match context, and performance factors.',
    link: 'https://blog.joonbo.com/healthball_intro',
    uid: 'blog-1',
  },
  {
    title: 'Sudoku',
    description:
      'Documenting Sudoku solver that visualizes the board, detects empty cells, validates entries, and uses a backtracking algorithm to find a solution.',
    link: 'https://blog.joonbo.com/sudoku',
    uid: 'blog-2',
  }
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Github',
    link: 'https://github.com/boonjo',
  },
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/joonbo',
  },
  {
    label: 'Letterboxd',
    link: 'https://letterboxd.com/boonjo',
  },
]

export const EMAIL = 'joonbo@gmail.com'
