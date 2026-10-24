// lib/mockData.ts
import { User } from "@/types/auth";

export interface MockUserRecord extends User {
  password: string;
  token: string;
}

export const INITIAL_MOCK_USERS: MockUserRecord[] = [


    // ==========================================
  // SUPER TEST USER (All-in-One Testing)
  // ==========================================
  {
    id: "usr_testmaster",
    name: "Super Test Master",
    username: "testmaster",
    email: "testmaster@frustratedbox.com",
    role: "ADMIN",
    password: "Password@123",
    token: "mock-jwt-testmaster-token",
    managedCommunities: [
      {
        id: "comm-1",
        name: "Tech Life & Code Burnout",
        slug: "tech-life",
        role: "owner",
        pendingReportsCount: 5,
      },
      {
        id: "comm-2",
        name: "Corporate Cage",
        slug: "corporate-cage",
        role: "moderator",
        pendingReportsCount: 2,
      },
      {
        id: "comm-3",
        name: "Midnight Designers",
        slug: "midnight-designers",
        role: "member",
        pendingReportsCount: 0,
      },
    ],
    profile: {
      bio: "QA Architect & Platform Admin. Testing owner spaces, mod queues, and confidential vents.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=testmaster",
      coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
      work: { occupation: "Lead QA Architect", company: "FrustratedBox Core" },
      education: { degree: "M.S. in Chaos Engineering", schoolOrCollege: "MIT" },
      location: { city: "Kathmandu", hometown: "Pokhara" },
      relationshipStatus: "Complicated",
      website: "https://testmaster.dev",
      joinedDate: "January 2026",
    },
    following: ["usr_devbro", "usr_admin"],
  },

  
  // ==========================================
  // 1. SUPER ADMIN & PLATFORM GOVERNANCE
  // ==========================================
  {
    id: "usr_admin",
    name: "Frustrated Admin",
    username: "admin",
    email: "admin@frustratedbox.com",
    role: "ADMIN",
    password: "Password@123",
    token: "mock-jwt-admin-token",
    profile: {
      bio: "Platform architect and ultimate keeper of the cyber void.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=admin",
      location: { city: "Kathmandu", hometown: "Pokhara" },
      work: { occupation: "Lead Engineer", company: "FrustratedBox" },
      joinedDate: "October 2026",
    },
  },

  // ==========================================
  // 2. COMMUNITY OWNERS (Created their own spaces)
  // ==========================================
  {
    id: "usr_devbro",
    name: "Aarav Sharma (DevBro)",
    username: "devbro",
    email: "devbro@gmail.com",
    role: "USER",
    password: "Password@123",
    token: "mock-jwt-devbro-token",
    managedCommunities: [
      {
        id: "comm-1",
        name: "Tech Life & Code Burnout",
        slug: "tech-life",
        role: "owner",
        pendingReportsCount: 2,
      },
      {
        id: "comm-2",
        name: "Corporate Cage",
        slug: "corporate-cage",
        role: "member",
        pendingReportsCount: 0,
      },
    ],
    profile: {
      bio: "Fullstack engineer surviving on caffeine, StackOverflow, and midnight hotfixes.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=devbro",
      location: { city: "Kathmandu" },
      work: {
        occupation: "Senior Software Engineer",
        company: "CloudScale Tech",
      },
      joinedDate: "October 2026",
    },
  },
  {
    id: "usr_mod_sarah",
    name: "Sarah Jenkins",
    username: "sarah_j",
    email: "sarah@gmail.com",
    role: "MODERATOR",
    password: "Password@123",
    token: "mock-jwt-sarah-token",
    managedCommunities: [
      {
        id: "comm-2",
        name: "Corporate Cage",
        slug: "corporate-cage",
        role: "owner",
        pendingReportsCount: 5,
      },
      {
        id: "comm-1",
        name: "Tech Life & Code Burnout",
        slug: "tech-life",
        role: "moderator",
        pendingReportsCount: 1,
      },
    ],
    profile: {
      bio: "Operations director exhausted by syncs that should have been Slack messages.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=sarah-j",
      location: { city: "Lalitpur" },
      work: { occupation: "Operations Director", company: "Nexus Global" },
      joinedDate: "August 2026",
    },
  },
  {
    id: "usr_mod_bikash",
    name: "Bikash Thapa",
    username: "bikash_t",
    email: "bikash@gmail.com",
    role: "MODERATOR",
    password: "Password@123",
    token: "mock-jwt-bikash-token",
    managedCommunities: [
      {
        id: "comm-5",
        name: "Academic Chaos & Exams",
        slug: "academic-chaos",
        role: "owner",
        pendingReportsCount: 3,
      },
    ],
    profile: {
      bio: "Adjunct lecturer and academic advisor witnessing students panic daily.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=bikash-t",
      location: { city: "Bhaktapur" },
      work: { occupation: "Lecturer", company: "TU Engineering" },
      joinedDate: "September 2026",
    },
  },
  {
    id: "usr_anu",
    name: "Dr. Anu Gurung",
    username: "anu_g",
    email: "anu@gmail.com",
    role: "USER",
    password: "Password@123",
    token: "mock-jwt-anu-token",
    managedCommunities: [
      {
        id: "comm-6",
        name: "Happy Mask Falloff",
        slug: "happy-mask",
        role: "owner",
        pendingReportsCount: 1,
      },
    ],
    profile: {
      bio: "Medical resident surviving 36-hour ICU emergency ward rotations.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=anu-g",
      location: { city: "Kathmandu" },
      work: {
        occupation: "Resident Doctor",
        company: "Central Teaching Hospital",
      },
      joinedDate: "July 2026",
    },
  },

  // ==========================================
  // 3. APPOINTED MODERATORS
  // ==========================================
  {
    id: "usr_ktm_coder",
    name: "Pratik Shrestha (KTM_Coder)",
    username: "ktm_coder",
    email: "ktm.coder@gmail.com",
    role: "MODERATOR",
    password: "Password@123",
    token: "mock-jwt-ktmcoder-token",
    managedCommunities: [
      {
        id: "comm-1",
        name: "Tech Life & Code Burnout",
        slug: "tech-life",
        role: "moderator",
        pendingReportsCount: 0,
      },
    ],
    profile: {
      bio: "Refactoring ancient legacy codebases during load-shedding hours.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=ktm-coder",
      location: { city: "Kathmandu" },
      work: { occupation: "Backend Architect" },
      joinedDate: "September 2026",
    },
  },
  {
    id: "usr_suman",
    name: "Suman Karki",
    username: "suman_k",
    email: "suman@gmail.com",
    role: "MODERATOR",
    password: "Password@123",
    token: "mock-jwt-suman-token",
    managedCommunities: [
      {
        id: "comm-2",
        name: "Corporate Cage",
        slug: "corporate-cage",
        role: "moderator",
        pendingReportsCount: 2,
      },
    ],
    profile: {
      bio: "FinTech risk analyst. Wondering where 85% of my monthly salary went.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=suman-k",
      location: { city: "Kathmandu" },
      work: { occupation: "Risk Analyst", company: "FinPay" },
      joinedDate: "September 2026",
    },
  },

  // ==========================================
  // 4. DIVERSE ACTIVE COMMUNITY MEMBERS
  // ==========================================
  {
    id: "usr_chiya",
    name: "Pooja Mishra (ChiyaLover)",
    username: "chiya_lover",
    email: "chiya@gmail.com",
    role: "USER",
    password: "Password@123",
    token: "mock-jwt-chiya-token",
    managedCommunities: [
      {
        id: "comm-3",
        name: "Midnight Thoughts & Overthinking",
        slug: "midnight-thoughts",
        role: "member",
      },
      {
        id: "comm-4",
        name: "Heartbreak & Silent Tears",
        slug: "heartbreak-hotel",
        role: "member",
      },
    ],
    profile: {
      bio: "Overthinking life choices with 4 cups of local milk tea every midnight.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=chiya-lover",
      location: { city: "Bhaktapur" },
      work: { occupation: "Freelance Copywriter" },
      relationshipStatus: "Complicated",
      joinedDate: "October 2026",
    },
  },
  {
    id: "usr_kiran",
    name: "Kiran Dahal",
    username: "kiran_d",
    email: "kiran@gmail.com",
    role: "USER",
    password: "Password@123",
    token: "mock-jwt-kiran-token",
    managedCommunities: [
      {
        id: "comm-5",
        name: "Academic Chaos & Exams",
        slug: "academic-chaos",
        role: "member",
      },
      {
        id: "comm-1",
        name: "Tech Life & Code Burnout",
        slug: "tech-life",
        role: "member",
      },
    ],
    profile: {
      bio: "CSIT final year student overwhelmed by IELTS scores and thesis deadlines.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=kiran-d",
      location: { city: "Pokhara" },
      education: {
        degree: "BSc CSIT",
        schoolOrCollege: "Prithvi Narayan Campus",
      },
      joinedDate: "October 2026",
    },
  },
  {
    id: "usr_momo",
    name: "Bibek Manandhar (MoMoMaster)",
    username: "momo_master",
    email: "momo@gmail.com",
    role: "USER",
    password: "Password@123",
    token: "mock-jwt-momo-token",
    managedCommunities: [
      {
        id: "comm-2",
        name: "Corporate Cage",
        slug: "corporate-cage",
        role: "member",
      },
    ],
    profile: {
      bio: "Curing existential dread with spicy buff momo and graphic design.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=momo-master",
      location: { city: "Kathmandu" },
      work: { occupation: "UI/UX Designer" },
      joinedDate: "October 2026",
    },
  },
  {
    id: "usr_nisha",
    name: "Nisha Rayamajhi",
    username: "nisha_r",
    email: "nisha@gmail.com",
    role: "USER",
    password: "Password@123",
    token: "mock-jwt-nisha-token",
    managedCommunities: [
      {
        id: "comm-2",
        name: "Corporate Cage",
        slug: "corporate-cage",
        role: "member",
      },
    ],
    profile: {
      bio: "Advertising agency creative lead fighting client feedback round #14.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=nisha-r",
      location: { city: "Lalitpur" },
      work: { occupation: "Creative Art Director", company: "Verve Media" },
      joinedDate: "August 2026",
    },
  },
  {
    id: "usr_samira",
    name: "Samira Lama",
    username: "samira_l",
    email: "samira@gmail.com",
    role: "USER",
    password: "Password@123",
    token: "mock-jwt-samira-token",
    managedCommunities: [
      {
        id: "comm-3",
        name: "Midnight Thoughts & Overthinking",
        slug: "midnight-thoughts",
        role: "member",
      },
      {
        id: "comm-4",
        name: "Heartbreak & Silent Tears",
        slug: "heartbreak-hotel",
        role: "member",
      },
    ],
    profile: {
      bio: "Homesick expat in Sydney balancing 2 part-time jobs and master's degree.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=samira-l",
      location: { city: "Sydney", hometown: "Kathmandu" },
      education: { degree: "Master of IT", schoolOrCollege: "UTS" },
      joinedDate: "September 2026",
    },
  },
  {
    id: "usr_rohan",
    name: "Rohan Basnet",
    username: "rohan_b",
    email: "rohan@gmail.com",
    role: "USER",
    password: "Password@123",
    token: "mock-jwt-rohan-token",
    managedCommunities: [
      {
        id: "comm-5",
        name: "Academic Chaos & Exams",
        slug: "academic-chaos",
        role: "member",
      },
    ],
    profile: {
      bio: "Unemployed civil engineer tired of applying for jobs demanding 5 yrs experience.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=rohan-b",
      location: { city: "Dharan" },
      education: { degree: "BE Civil" },
      joinedDate: "October 2026",
    },
  },
  {
    id: "usr_sneha",
    name: "Sneha Pandey",
    username: "sneha_p",
    email: "sneha@gmail.com",
    role: "USER",
    password: "Password@123",
    token: "mock-jwt-sneha-token",
    managedCommunities: [
      {
        id: "comm-1",
        name: "Tech Life & Code Burnout",
        slug: "tech-life",
        role: "member",
      },
    ],
    profile: {
      bio: "Junior QA tester breaking prod features developers claimed were tested.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=sneha-p",
      location: { city: "Kathmandu" },
      work: { occupation: "QA Engineer" },
      joinedDate: "October 2026",
    },
  },
  {
    id: "usr_asha",
    name: "Asha Nemwang",
    username: "asha_n",
    email: "asha@gmail.com",
    role: "USER",
    password: "Password@123",
    token: "mock-jwt-asha-token",
    managedCommunities: [
      {
        id: "comm-6",
        name: "Happy Mask Falloff",
        slug: "happy-mask",
        role: "member",
      },
    ],
    profile: {
      bio: "Night-shift emergency ward nurse running on sheer willpower.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=asha-n",
      location: { city: "Biratnagar" },
      work: { occupation: "Staff Nurse" },
      joinedDate: "August 2026",
    },
  },
  {
    id: "usr_sameer",
    name: "Sameer Karki",
    username: "sameer_k",
    email: "sameer@gmail.com",
    role: "USER",
    password: "Password@123",
    token: "mock-jwt-sameer-token",
    managedCommunities: [
      {
        id: "comm-2",
        name: "Corporate Cage",
        slug: "corporate-cage",
        role: "member",
      },
    ],
    profile: {
      bio: "Commercial bank teller dealing with angry customers and counter rush.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=sameer-k",
      location: { city: "Lalitpur" },
      work: { occupation: "Bank Officer" },
      joinedDate: "September 2026",
    },
  },
  {
    id: "usr_dipen",
    name: "Dipen KC",
    username: "dipen_kc",
    email: "dipen@gmail.com",
    role: "USER",
    password: "Password@123",
    token: "mock-jwt-dipen-token",
    managedCommunities: [
      {
        id: "comm-2",
        name: "Corporate Cage",
        slug: "corporate-cage",
        role: "member",
      },
    ],
    profile: {
      bio: "Rideshare driver witnessing Kathmandu's road chaos and daily traffic jams.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=dipen-kc",
      location: { city: "Kathmandu" },
      joinedDate: "October 2026",
    },
  },
  {
    id: "usr_shraddha",
    name: "Shraddha Verma",
    username: "shraddha_v",
    email: "shraddha@gmail.com",
    role: "USER",
    password: "Password@123",
    token: "mock-jwt-shraddha-token",
    managedCommunities: [
      {
        id: "comm-5",
        name: "Academic Chaos & Exams",
        slug: "academic-chaos",
        role: "member",
      },
    ],
    profile: {
      bio: "High school teacher managing 45 hyperactive kids and unsupportive parents.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=shraddha-v",
      location: { city: "Butwal" },
      work: { occupation: "Secondary Teacher" },
      joinedDate: "September 2026",
    },
  },
  {
    id: "usr_sujan",
    name: "Sujan Baral",
    username: "sujan_b",
    email: "sujan@gmail.com",
    role: "USER",
    password: "Password@123",
    token: "mock-jwt-sujan-token",
    managedCommunities: [
      {
        id: "comm-1",
        name: "Tech Life & Code Burnout",
        slug: "tech-life",
        role: "member",
      },
    ],
    profile: {
      bio: "Indie game developer spending 8 months on an asset flip that got 3 downloads.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=sujan-b",
      location: { city: "Pokhara" },
      work: { occupation: "Indie Game Developer" },
      joinedDate: "October 2026",
    },
  },
  {
    id: "usr_rojina",
    name: "Rojina Chaudhary",
    username: "rojina_c",
    email: "rojina@gmail.com",
    role: "USER",
    password: "Password@123",
    token: "mock-jwt-rojina-token",
    managedCommunities: [
      {
        id: "comm-2",
        name: "Corporate Cage",
        slug: "corporate-cage",
        role: "member",
      },
      {
        id: "comm-4",
        name: "Heartbreak & Silent Tears",
        slug: "heartbreak-hotel",
        role: "member",
      },
    ],
    profile: {
      bio: "Marketing intern surviving unpaid extra hours while healing from a 3-year breakup.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=rojina-c",
      location: { city: "Kathmandu" },
      work: { occupation: "Marketing Intern" },
      joinedDate: "October 2026",
    },
  },
];
