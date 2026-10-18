// app/features/feed/mockData.ts
import { Confession } from "./types";
import { BULK_CONFESSIONS } from "./mockConfessionsBulk";

/**
 * =====================================================================
 * RELATIONAL BASE CONFESSIONS WITH THREADED ECHOES (COMMENTS & REPLIES)
 * - 20 interconnected users interacting with each other
 * =====================================================================
 */
export const BASE_CONFESSIONS: Confession[] = [
  // -------------------------------------------------------------------
  // 1. DevBro - Friday Prod Crash (With Tech Life Discussions)
  // -------------------------------------------------------------------
  {
    id: "conf-devbro-1",
    author: {
      id: "usr_devbro",
      alias: "DevBro",
      isAnonymous: false,
      avatarSeed: "devbro",
    },
    content:
      "Client asked for a 'tiny 5-minute UI fix' on Friday at 4:58 PM. It is now Sunday 3:15 AM and the entire Kubernetes cluster is crash-looping. I haven't slept, my eyes are burning, and I want to throw this laptop out the window. Never touching prod on a Friday again. Fuck this job.",
    tags: ["techlife", "prodcrash", "burnout", "freelance"],
    semanticCluster: "workplace-burnout",
    relateCount: 420,
    burnCount: 235,
    echoCount: 3,
    isRelatableByMe: false,
    isBurnedByMe: true,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    comments: [
      {
        id: "comm-dev-1",
        author: {
          id: "usr_ktm_coder",
          alias: "KTM_Coder",
          isAnonymous: false,
          avatarSeed: "ktm-coder",
        },
        content:
          "Golden rule #1: Never touch prod after Thursday 2 PM. Hope you have automated snapshots bro!",
        createdAt: new Date(Date.now() - 1.8 * 3600 * 1000).toISOString(),
        replies: [
          {
            id: "comm-dev-1-rep-1",
            author: {
              id: "usr_devbro",
              alias: "DevBro",
              isAnonymous: false,
              avatarSeed: "devbro",
            },
            content:
              "Snapshots were corrupted during migration. Rolling back manually line by line 😭",
            createdAt: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString(),
            replyToAlias: "KTM_Coder",
          },
        ],
      },
      {
        id: "comm-dev-2",
        author: {
          id: "usr_sneha",
          alias: "Sneha Pandey",
          isAnonymous: false,
          avatarSeed: "sneha-p",
        },
        content:
          "And who approved the QA signoff ticket at 4:52 PM? Because it definitely wasn't me! 👀",
        createdAt: new Date(Date.now() - 1.2 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "conf-devbro-2",
    author: {
      id: "usr_devbro",
      alias: "DevBro",
      isAnonymous: false,
      avatarSeed: "devbro",
    },
    content:
      "Why write 10 lines of clean code when you can write 120 lines of unreadable spaghetti that only you understand, ensuring total job security? Because clean code gets you replaced. Spaghetti keeps you employed. This industry is a fucking joke. 💀",
    tags: ["techlife", "programming", "humor"],
    semanticCluster: "workplace-burnout",
    relateCount: 680,
    burnCount: 95,
    echoCount: 1,
    isRelatableByMe: true,
    isBurnedByMe: false,
    createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    comments: [
      {
        id: "comm-devbro-2-c1",
        author: {
          id: "usr_sujan",
          alias: "Sujan Baral",
          isAnonymous: false,
          avatarSeed: "sujan-b",
        },
        content:
          "My entire Unity game codebase feels attacked by this confession lmao.",
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      },
    ],
  },

  // -------------------------------------------------------------------
  // 2. Sarah Jenkins - Corporate Meetings (Corporate Cage Discussions)
  // -------------------------------------------------------------------
  {
    id: "conf-sarah-1",
    author: {
      id: "usr_mod_sarah",
      alias: "Sarah Jenkins",
      isAnonymous: false,
      avatarSeed: "sarah-j",
    },
    content:
      "Just finished a 1-hour alignment meeting where the only outcome was scheduling a 2-hour pre-alignment sync for next Tuesday. I can literally feel my brain cells dying one by one. These people love hearing themselves talk more than they love actual work. I want to scream.",
    tags: ["corporate", "meetings", "management"],
    semanticCluster: "workplace-burnout",
    relateCount: 560,
    burnCount: 310,
    echoCount: 3,
    isRelatableByMe: false,
    isBurnedByMe: false,
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    comments: [
      {
        id: "comm-sarah-c1",
        author: {
          id: "usr_suman",
          alias: "Suman Karki",
          isAnonymous: false,
          avatarSeed: "suman-k",
        },
        content:
          "My manager has a weekly 30-minute sync just to discuss what we will discuss in the monthly sync. Meeting-ception.",
        createdAt: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(),
        replies: [
          {
            id: "comm-sarah-c1-rep",
            author: {
              id: "usr_mod_sarah",
              alias: "Sarah Jenkins",
              isAnonymous: false,
              avatarSeed: "sarah-j",
            },
            content:
              "We need an anonymous intervention button for managers who love the sound of their own voice.",
            createdAt: new Date(Date.now() - 3.2 * 3600 * 1000).toISOString(),
            replyToAlias: "Suman Karki",
          },
        ],
      },
      {
        id: "comm-sarah-c2",
        author: {
          id: "usr_nisha",
          alias: "Nisha Rayamajhi",
          isAnonymous: false,
          avatarSeed: "nisha-r",
        },
        content:
          "Our agency scheduled a mandatory 3-hour 'Time Management Workshop' during peak client pitch week. Irony died a painful death.",
        createdAt: new Date(Date.now() - 2.8 * 3600 * 1000).toISOString(),
      },
    ],
  },

  // -------------------------------------------------------------------
  // 3. Kiran Dahal - Academic Stress (With Teacher-Student Support)
  // -------------------------------------------------------------------
  {
    id: "conf-kiran-1",
    author: {
      id: "usr_kiran",
      alias: "Kiran Dahal",
      isAnonymous: false,
      avatarSeed: "kiran-d",
    },
    content:
      "Everyone on my Instagram is either boarding a flight to Sydney, getting engaged, or landing a $60k remote job. Meanwhile I’m sitting in my room in Pokhara staring at a CSIT project that crashes on localhost:3000 while my parents ask for the hundredth time when my IELTS date is. I feel like a complete failure. Every single day.",
    tags: ["bidesh", "academics", "comparison", "csit"],
    semanticCluster: "future-anxiety",
    relateCount: 1350,
    burnCount: 510,
    echoCount: 3,
    isRelatableByMe: true,
    isBurnedByMe: false,
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    comments: [
      {
        id: "comm-kiran-c1",
        author: {
          id: "usr_mod_bikash",
          alias: "Bikash Thapa",
          isAnonymous: false,
          avatarSeed: "bikash-t",
        },
        content:
          "As a lecturer, please remember: people only post their highlight reels on Instagram, never their sleepless breakdown nights. Focus on your thesis step by step. You have potential, don't rush.",
        createdAt: new Date(Date.now() - 7.5 * 3600 * 1000).toISOString(),
        replies: [
          {
            id: "comm-kiran-c1-rep",
            author: {
              id: "usr_kiran",
              alias: "Kiran Dahal",
              isAnonymous: false,
              avatarSeed: "kiran-d",
            },
            content:
              "Thank you so much Bikash sir. Really needed to hear this today 🙏",
            createdAt: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
            replyToAlias: "Bikash Thapa",
          },
        ],
      },
      {
        id: "comm-kiran-c2",
        author: {
          id: "usr_rohan",
          alias: "Rohan Basnet",
          isAnonymous: false,
          avatarSeed: "rohan-b",
        },
        content:
          "Bro wait till you graduate, the job market for freshers is an even wilder horror movie. Enjoy your college days while they last!",
        createdAt: new Date(Date.now() - 6.5 * 3600 * 1000).toISOString(),
      },
    ],
  },

  // -------------------------------------------------------------------
  // 4. Dr. Anu Gurung - Medical Exhaustion (With Nurse Empathy)
  // -------------------------------------------------------------------
  {
    id: "conf-anu-1",
    author: {
      id: "usr_anu",
      alias: "Dr. Anu Gurung",
      isAnonymous: false,
      avatarSeed: "anu-g",
    },
    content:
      "Hour 31 of hospital duty. I stood in the locker room and cried silently for exactly three minutes, wiped my face, fixed my mask, and walked back into the ward like nothing happened. People keep saying doctors are brave. We’re not brave. We’re just not allowed to collapse. I’m so fucking tired of pretending I’m okay.",
    tags: ["happymask", "healthcare", "burnout", "exhaustion"],
    semanticCluster: "workplace-burnout",
    relateCount: 1620,
    burnCount: 680,
    echoCount: 2,
    isRelatableByMe: false,
    isBurnedByMe: false,
    createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    comments: [
      {
        id: "comm-anu-c1",
        author: {
          id: "usr_asha",
          alias: "Asha Nemwang",
          isAnonymous: false,
          avatarSeed: "asha-n",
        },
        content:
          "Doctor saab, we see how hard you work every night. Please take 10 minutes to drink warm water and eat something. We nurses will hold the emergency station.",
        createdAt: new Date(Date.now() - 9.5 * 3600 * 1000).toISOString(),
        replies: [
          {
            id: "comm-anu-c1-rep",
            author: {
              id: "usr_anu",
              alias: "Dr. Anu Gurung",
              isAnonymous: false,
              avatarSeed: "anu-g",
            },
            content:
              "Thank you Asha didi. You nurses are the real heart and backbone of this hospital ❤️",
            createdAt: new Date(Date.now() - 9 * 3600 * 1000).toISOString(),
            replyToAlias: "Asha Nemwang",
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------
  // 5. ChiyaLover - Midnight Heartbreak (With Expat Empathy)
  // -------------------------------------------------------------------
  {
    id: "conf-chiya-1",
    author: {
      id: "usr_chiya",
      alias: "ChiyaLover",
      isAnonymous: false,
      avatarSeed: "chiya-lover",
    },
    content:
      "It’s 2:40 AM. The person who used to text me good morning and good night every single day is now just a name on WhatsApp that I can’t even say hi to without looking pathetic. I keep opening the chat, staring at the last message, and closing it. This shit hurts more than I want to admit.",
    tags: ["heartbreak", "midnight", "loneliness", "unspoken"],
    semanticCluster: "heartbreak-solitude",
    relateCount: 1140,
    burnCount: 220,
    echoCount: 2,
    isRelatableByMe: true,
    isBurnedByMe: false,
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    comments: [
      {
        id: "comm-chiya-c1",
        author: {
          id: "usr_samira",
          alias: "Samira Lama",
          isAnonymous: false,
          avatarSeed: "samira-l",
        },
        content:
          "Reading this from a cold studio apartment in Sydney at 3 AM. The grief of losing someone who is still physically alive in this world is a different kind of heartbreak.",
        createdAt: new Date(Date.now() - 4.5 * 3600 * 1000).toISOString(),
      },
      {
        id: "comm-chiya-c2",
        author: {
          id: "usr_rojina",
          alias: "Rojina Chaudhary",
          isAnonymous: false,
          avatarSeed: "rojina-c",
        },
        content:
          "They move on in 3 business days while we spend 2 years analyzing where everything went wrong. Take care of yourself sister.",
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      },
    ],
  },
];

export const MOCK_CONFESSIONS: Confession[] = [
  ...BASE_CONFESSIONS,
  ...BULK_CONFESSIONS,
];
