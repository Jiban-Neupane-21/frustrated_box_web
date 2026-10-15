import { Confession } from "./types";

type Author = Confession["author"];
type CommentT = NonNullable<Confession["comments"]>[number];
/* ───────────── Seeded RNG (reload garda data change hudaina) ───────────── */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261015);
const int = (min: number, max: number) =>
  Math.floor(rand() * (max - min + 1)) + min;
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
const chance = (p: number) => rand() < p;

function weightedPick<T extends { weight: number }>(arr: readonly T[]): T {
  const total = arr.reduce((s, x) => s + x.weight, 0);
  let r = rand() * total;
  for (const x of arr) {
    r -= x.weight;
    if (r <= 0) return x;
  }
  return arr[arr.length - 1];
}

/* ───────────── Users ─────────────
   weight dherai = tyo user ko post dherai (follow testing ko lagi).
   Top 5 users le 15-25+ post garchhan. */
export const NAMED_USERS = [
  { alias: "Suman K.", seed: "suman-k", weight: 10 },
  { alias: "Kiran D.", seed: "kiran-d", weight: 9 },
  { alias: "Anu G.", seed: "anu-g", weight: 8 },
  { alias: "Pratik S.", seed: "pratik-s", weight: 8 },
  { alias: "Nisha R.", seed: "nisha-r", weight: 7 },
  { alias: "Aarav P.", seed: "aarav-p", weight: 5 },
  { alias: "Maya T.", seed: "maya-t", weight: 5 },
  { alias: "Rohan B.", seed: "rohan-b", weight: 5 },
  { alias: "Bibek M.", seed: "bibek-m", weight: 4 },
  { alias: "Samira L.", seed: "samira-l", weight: 4 },
  { alias: "Asha N.", seed: "asha-n", weight: 4 },
  { alias: "Bikash T.", seed: "bikash-t", weight: 3 },
  { alias: "Kritika S.", seed: "kritika-s", weight: 3 },
  { alias: "Ashish J.", seed: "ashish-j", weight: 3 },
  { alias: "Pooja M.", seed: "pooja-m", weight: 3 },
  { alias: "Sameer K.", seed: "sameer-k", weight: 3 },
  { alias: "Sneha P.", seed: "sneha-p", weight: 3 },
  { alias: "Dipen K.", seed: "dipen-k", weight: 2 },
  { alias: "Prabin D.", seed: "prabin-d", weight: 2 },
  { alias: "Manish R.", seed: "manish-r", weight: 2 },
  { alias: "Shraddha V.", seed: "shraddha-v", weight: 2 },
  { alias: "Sujan B.", seed: "sujan-b", weight: 2 },
  { alias: "Rojina C.", seed: "rojina-c", weight: 2 },
  { alias: "Nabin A.", seed: "nabin-a", weight: 1 },
  { alias: "Sunita G.", seed: "sunita-g", weight: 1 },
  { alias: "Utsav H.", seed: "utsav-h", weight: 1 },
  { alias: "DevBro", seed: "devbro", weight: 4 },
  { alias: "KTM_Coder", seed: "ktm-coder", weight: 3 },
  { alias: "ChiyaLover", seed: "chiya-lover", weight: 3 },
  { alias: "MoMoMaster", seed: "momo-master", weight: 2 },
] as const;

const ANON_USERS = [
  819, 221, 501, 114, 905, 334, 618, 404, 773, 650, 890, 311, 731, 209, 992,
  923, 408, 101, 202, 303, 505, 606, 707, 808, 909, 111, 222, 333, 444, 555,
  666, 777, 888, 999, 123, 456, 789, 246, 135, 579,
].map((n, i) => ({
  alias: `Anonymous #${n}`,
  seed: `anon-${n}`,
  // pahilo 6 anon dherai repeat hunchhan
  weight: i < 6 ? 8 : i < 15 ? 3 : 1,
}));

const NAMED_RATIO = 0.55;

function pickAuthor(): Author {
  if (chance(NAMED_RATIO)) {
    const u = weightedPick(NAMED_USERS);
    return { alias: u.alias, isAnonymous: false, avatarSeed: u.seed };
  }
  const u = weightedPick(ANON_USERS);
  return { alias: u.alias, isAnonymous: true, avatarSeed: u.seed };
}

/* ───────────── Hashtags ─────────────
   HOT_TAGS: sabai cluster ma dherai repeat hunchhan (tag page / filter testing).
   CLUSTER_TAGS: cluster anusar. */
export const HOT_TAGS = [
  "worklife",
  "anxiety",
  "kathmandu",
  "loneliness",
  "comparison",
  "burnout",
] as const;

const CLUSTER_TAGS: Record<string, readonly string[]> = {
  "workplace-burnout": [
    "worklife",
    "overtime",
    "toxicboss",
    "salary",
    "corporate",
    "remotejobs",
    "burnout",
    "micromanagement",
    "ktmlife",
    "traffic",
    "clienthorror",
    "scrumhell",
  ],
  "future-anxiety": [
    "anxiety",
    "comparison",
    "career",
    "bidesh",
    "internship",
    "techjobs",
    "familypressure",
    "bihepressure",
    "unemployed",
    "responsibilities",
    "nepallife",
  ],
  "heartbreak-solitude": [
    "loneliness",
    "breakup",
    "माया",
    "धोका",
    "solitude",
    "friendship",
    "selfrespect",
    "numb",
    "socialmedia",
    "mentalpeace",
    "leftbehind",
  ],
  "academic-stress": [
    "collegelife",
    "exams",
    "backlog",
    "hostellife",
    "examhall",
    "engineering",
    "roommateissues",
    "regret",
    "guilt",
    "foodcrisis",
    "semester",
  ],
};

function pickTags(cluster: string): string[] {
  const set = new Set<string>();
  // 70% post ma ek hot tag huncha
  if (chance(0.7)) set.add(pick(HOT_TAGS));
  const pool = CLUSTER_TAGS[cluster];
  const n = int(2, 3);
  while (set.size < n) {
    set.add(pick(pool));
  }
  return Array.from(set).slice(0, 4);
}

/* ───────────── Content ───────────── */
const CONTENT: Record<string, readonly string[]> = {
  "workplace-burnout": [
    "Deadline ko naam ma Saturday ni office bolayo, comp-off magda 'next month' bhanyo. Aajhai pugena.",
    "Standup ma 'any blockers?' sodhchha, tara blocker bhanyo bhane tero skill issue bhanera hernchha.",
    "Appraisal ko bela 2% increment, tara kaam chai 2 jana ko ek jana le garnu parne.",
    "Manager le mero idea afno bhanera director lai present garyo. Ma chai chup lagera basen.",
    "Slack ma green dot nahuda pani 'quick call?' aauchha. Quick call kahile pani 1 ghanta hunchha.",
    "ऑफिसको चिया पनि पैसा काटेर दिन थालेको छ, तर ओभरटाइमको पैसा चाहिँ कहिल्यै आउँदैन।",
    "दिनको ३ घण्टा माइक्रोमा बित्छ, अनि घर पुगेर फेरि ल्यापटप खोल्नुपर्छ। यो जीवन होइन।",
    "Resign letter draft gareko 2 mahina bhayo, tara EMI ra ghar bhada le send garna dindaina.",
    "Client le 'small change' bhandai pura design pheri banauna lagayo, scope creep ko king.",
    "Probation ma ho bhanera free ma 12 ghanta kaam garaunchhan, permanent bhaepachhi pani same.",
    "Performance review ma 'communication improve garnu' bhanyo, jaba ki 5 ota email ko reply nai pailo dinma gareko.",
    "Office politics bujhdaina, tara kaam garne ko bhanda chatukarita garne ko promotion hunchha.",
  ],
  "future-anxiety": [
    "30 pugna 5 barsa matra baaki, na ghar, na stable job, na kei. Time le chhodera bhagirakochha.",
    "Sabai le 'tapai ko plan k ho?' sodhchhan, ma afai ta confuse chhu ki ma ko ho.",
    "IELTS 3rd time dida pani 6.5 ayo. Paisa, time, confidence sabai gayo.",
    "Nepal ma basera k garne bhanera sochda dar lagchha, tara bidesh janu pani sajilo chaina.",
    "Bachelor sakkiyo, tara kun field ma jane bhanera clue nai chaina. Sabai le 'IT padha' bhanchhan.",
    "आफ्नै उमेरका साथीहरू घर, गाडी, बिहे सबै गरिसके। म अझै भाडाको कोठामा।",
    "बाबाले 'अब तेरो पालो' भन्नुहुन्छ, तर कुन पालो हो मलाई आफैँलाई थाहा छैन।",
    "Freelancing start gare, first 3 mahina ma 1 paisa pani aayena. Parents lai kasari bhanu?",
    "Every night 2 AM ma 'k garirachu ma?' bhanera ceiling herera basinchha.",
    "Skill sikdai sikdai tutorial hell ma phasyo, project ek pani complete bhayena.",
    "Pahilo salary ma ghar ko khanepani, bijuli, wifi bhari sakepachhi bachhyo 800 rupiya.",
    "Sabai le startup khola bhanchhan, ma ta pahila ko loan nai tirdai chhu.",
  ],
  "heartbreak-solitude": [
    "Usko story ma aarko manchhe sanga photo dekhda 'seen' garera block garen. Aja pheri unblock garen.",
    "Birthday ma 47 jana le wish garyo, tara jun ek manchhe ko wish chahiyeko thiyo tyo aayena.",
    "साथीहरूको ग्रुपमा हुँदा पनि एक्लो लाग्छ। हाँसिरहन्छु, तर भित्र खाली छ।",
    "सम्झनाहरू मेटाउन फोटो डिलिट गरें, तर मन भित्रको ग्यालरी कसरी खाली गर्ने?",
    "Late night ma typing... देखिन्छ, tara message kahile pani aaudaina. Ghost banera pani haunt garchha.",
    "Best friend ko wedding ma gayo, sabai nachirahe, ma kone ma basera phone chalaidai thiyen.",
    "Dashain ma ghar jada pani pahilo jasto ramailo lagena. Sabai kura badaliyo ki ma badaliyen?",
    "Usle 'we are just friends' bhanyo, 2 hapta pachhi arko sanga relationship status halyo.",
    "Weekend ma room ma ekai baschhu, Netflix ma 'are you still watching?' ley matra sodhchha.",
    "माया गर्नु नराम्रो होइन रहेछ, गलत मान्छेलाई गर्नु पो नराम्रो रहेछ।",
    "Reply 3 din pachhi 'sorry busy thiyen' aayo. 3 din ma 100 palta Instagram hereko dekhi sakeko chhu.",
    "Friendship ma pani effort chahinchha, tara sadhai ma matra initiate garnu parne bhayo.",
  ],
  "academic-stress": [
    "Pre-board ma fail bhayen, ghar ma bhanna sakdina. Result din samma natak garna parchha.",
    "Assignment submit garna 11:59 ma portal crash bhayo. Professor le 'excuse chaina' bhanyo.",
    "Lab report copy garera pani fail, kina bhane sabai ko same copy thiyo.",
    "Internal marks ma favoritism chha, sir ko chiya lyaune haru le 100%, hami le 60%.",
    "परीक्षाको अघिल्लो रात मात्र किताब खोल्ने बानी कहिले छुट्ला र?",
    "फी तिर्ने बेला कलेज सधैँ 'last date' सम्झाउँछ, तर पढाउने बेला सर नै आउँदैनन्।",
    "Group project ma 5 jana ko naam chha, kaam 1 jana le gareko chha. Guess who?",
    "Hostel ko wifi 1 Mbps, online class ma 'can you hear me?' bhanera nai 30 min gayo.",
    "Backlog 4 ota, juniors ahile senior bhaisake. Embarrassment ko level alag chha.",
    "Final year project ko topic nai final bhayeko chhaina, supervisor le reply pani gardaina.",
    "Study group ma 'aaja 4 ghanta padhne' bhanera 3 ghanta 50 min memes share gariyo.",
    "Scholarship ko form 1 minute le chhutyo, aba aarko 1 barsa tuition ko tension.",
  ],
};

const OPENERS = [
  "",
  "",
  "",
  "Honestly, ",
  "Yaar, ",
  "Vent: ",
  "Kasaile bujhcha? ",
  "Aaja feel bhayo: ",
  "Ek kura bhanchhu, ",
];
const CLOSERS = [
  "",
  "",
  "",
  " Kasaile same feel gareko chha?",
  " Bas, yo kura bhanna man lagyo.",
  " Ahile ta sutne bela bhayo.",
  " Chiya khana janchhu aba.",
  " Thak liyo yaar.",
  " Sabai thik huncha bhanchhan, kahile?",
  " 😮‍💨",
];

const COMMENT_TEXTS = [
  "Same here bro, you are not alone.",
  "Ekdam relate garen yo!",
  "Stay strong, yo pani bitchha.",
  "Hami sabai tyai bata gaeka chhau.",
  "Sunna man lagyo, dhanyabad share garnu bhayeko ma.",
  "Rest lina nabirsa hai, tapai ko health pahila.",
  "Ma pani exact yahi situation ma chhu.",
  "Thik hunchha, ek din ek din garera.",
  "Chiya khauna, dimag fresh huncha 😄",
  "Hajur le gareko ramro nai ho, afulai blame nagara.",
  "समय सबै कुराको औषधि हो, धैर्य गर्नुस्।",
  "तपाईं एक्लो हुनुहुन्न, हामी सबै यहीँ छौं।",
  "यस्तै अवस्थाबाट म पनि गुज्रिसकेको छु, सजिलो हुँदै जान्छ।",
  "Professional help line lina pani hudaina, kehi galat chaina.",
  "Link pathaideu na, malai pani chahiyeko thiyo.",
  "Sahi kura! Boundary banaunu parcha.",
  "Honestly this is why I left my job last year.",
  "Bro Kathmandu ma yo sab common ho, tara normal haina.",
  "Hug 🫂 hope tomorrow is better.",
  "Next time tyo kura sidhai face ma bhanidinu!",
];

function makeComments(
  postId: string,
  postCreatedMs: number,
  postAuthor: Author,
): CommentT[] {
  // 25% ma comment nai nahune
  if (chance(0.25)) return [];
  const count = int(1, 4);
  const out: CommentT[] = [];
  for (let i = 0; i < count; i++) {
    let author = pickAuthor();
    // post garne le aafnai post ma comment nagaros
    let guard = 0;
    while (author.alias === postAuthor.alias && guard++ < 5)
      author = pickAuthor();
    out.push({
      id: `comment-${postId}-${i + 1}`,
      author,
      content: pick(COMMENT_TEXTS),
      createdAt: new Date(
        postCreatedMs + (i + 1) * int(2, 25) * 60 * 1000,
      ).toISOString(),
    });
  }
  return out;
}

/* ───────────── Generator ───────────── */
const CLUSTERS = Object.keys(CONTENT);
export const BULK_COUNT = 320;

function generate(): Confession[] {
  const now = Date.now();
  let minutesAgo = 1700; // existing 22 ko pachhi suru huncha
  const list: Confession[] = [];

  for (let i = 0; i < BULK_COUNT; i++) {
    const cluster = pick(CLUSTERS);
    const author = pickAuthor();
    minutesAgo += int(15, 90);
    const createdMs = now - minutesAgo * 60 * 1000;
    const id = `confession-${23 + i}`;

    const relateCount = int(5, 320);
    const burnCount = Math.floor(relateCount * (0.2 + rand() * 0.35));

    list.push({
      id,
      author,
      content:
        `${pick(OPENERS)}${pick(CONTENT[cluster])}${pick(CLOSERS)}`.trim(),
      tags: pickTags(cluster),
      semanticCluster: cluster,
      relateCount,
      burnCount,
      echoCount: chance(0.6) ? 0 : int(1, 3),
      isRelatableByMe: chance(0.15),
      isBurnedByMe: chance(0.08),
      createdAt: new Date(createdMs).toISOString(),
      comments: makeComments(id, createdMs, author),
    } as Confession);
  }
  return list;
}

export const BULK_CONFESSIONS: Confession[] = generate();
