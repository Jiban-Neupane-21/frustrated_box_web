import { Confession } from "./types";

type Author = Confession["author"];
type CommentT = NonNullable<Confession["comments"]>[number];

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
  const total = arr.reduce((sum, item) => sum + item.weight, 0);
  let r = rand() * total;

  for (const item of arr) {
    r -= item.weight;
    if (r <= 0) return item;
  }

  return arr[arr.length - 1];
}

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
  weight: i < 6 ? 8 : i < 15 ? 3 : 1,
}));

const NAMED_RATIO = 0.55;

function pickAuthor(): Author {
  if (chance(NAMED_RATIO)) {
    const u = weightedPick([...NAMED_USERS]);
    return {
      alias: u.alias,
      isAnonymous: false,
      avatarSeed: u.seed,
    };
  }

  const u = weightedPick(ANON_USERS);
  return {
    alias: u.alias,
    isAnonymous: true,
    avatarSeed: u.seed,
  };
}

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
    "career",
    "boundaries",
    "office",
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
    "future",
    "motivation",
    "selfgrowth",
    "expectations",
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
    "healing",
    "memories",
    "relationships",
    "boundaries",
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
    "assignment",
    "study",
    "college",
    "studentlife",
  ],
};

function pickTags(cluster: string): string[] {
  const tags = new Set<string>();

  if (chance(0.7)) tags.add(pick(HOT_TAGS));

  const pool = CLUSTER_TAGS[cluster];
  const count = int(2, 3);

  while (tags.size < count) tags.add(pick(pool));

  return [...tags].slice(0, 4);
}

/* =========================================================
   320 INDEPENDENT MOCK POSTS
   Each entry has its own content. No opener/closer splicing.
   ========================================================= */

const CONTENT: Record<string, readonly string[]> = {
  "workplace-burnout": [
    // Nepglish & Raw venting
    "Office ma jasko kaam fast hunchha, tesailai reward ko roop ma arko 3 wata task thapdinchan. Clown system.",
    "Salary badhauna pare 'budget constraint', kaam thapna pare 'you are capable of handling more'. Wah re hypocrisy!",
    "Emergency leave ma huda pani Slack ma 'pinged you an urgent blocker' bhandai msg aauchha. Bachna deu na yar!",
    "Friday rati 8 baje 'Quick sync?' bhanera call garne manager lai kun ghaam le sekne hola?",
    "Remote job bhanera leko, aile bedroom pani office jasto bhaisakyo. No boundary, pure mental torture.",
    "Production bug aayo re, jasle code chhoi-chhoi bigaryo tyo offline baschha, solve chai maile rati 2 baje samma garnu parne.",
    "Camera on gara na standup ma re. Mero anuhar le ticket resolve garchha ra?",
    "Overtime ko 1 paisa aaudaina, tara time mai log off garda 'low commitment' ko tag lagchha.",
    "Client lai estimate 2 days ko deko chha tara kaam 2 weeks ko ho. Yo gap maile afno nindra bechera pura garnu parne?",
    "Annual appraisal ma 5% hike diyechhan, inflation le testo 10% khanchha. Kaam nagari basnu thik jasto lagna thalyo.",

    // English & Pure frustration
    "I survived another meeting that definitely could have been a 2-line email.",
    "Unlimited PTO is a scam. You take 2 days off and come back to 400 unread emails and pure passive aggression.",
    "My back hurts, my screen time is 14 hours, and my bank account looks like a joke. Why am I doing this?",
    "They laid off half the team and now expect the remaining ones to absorb the workload with 'passion and resilience'.",
    "Pretending to care about corporate goals when I'm running on 4 hours of sleep and cold coffee.",

    // Hinglish & Hindi
    "Kaam karo toh credit lead le jaata hai, issue aaye toh blame junior par daal dete hain. Roz ka tamasha hai.",
    "Sunday shaam hote hi Monday ka darr pet me ajeeb sa anxiety shuru kar deta hai.",
    "Office ko 'family' bol kar bas unpaid overtime karwane ka bahana banate hain.",
    "Manager bolta hai 'take ownership', lekin ek chhota decision lene jao toh 4 approvals mangta hai. Dimaag kharab!",
    "काम इतना है कि सांस लेने का फुर्सत नहीं, और सैलरी ऐसी जैसे अहसान कर रहे हों।",

    // Nepali (Devanagari)
    "बिहान ९ बजेदेखि घोटिएर राति १० बजे ल्यापटप बन्द गर्दा पनि दिमागमा पेन्डिङ टास्क नै घुमिरहन्छ।",
    "मेरो हार्डवर्कले कम्पनीको मालिकले नयाँ गाडी किनेछ, म भने अझै साझा बसको भीडमा झुन्डिरहेको छु।",
    "अफिसको पोलिटिक्स र फेक मान्छेहरूको स्माइल हेर्दा हेर्दै भित्रैदेखि वाक्क लागेर आउँछ।",
    "बिरामी परेर सिक लिभ माग्दा पनि 'ल्यापटप छ भने घरबाटै हेर्देउ न' भन्छन्। अलिकति पनि दया छैन!",
  ],

  "heartbreak-solitude": [
    // --- Cheating & Betrayal (धोका र विश्वासघात) ---
    "Usle 'he is just a good friend, don't be insecure' bhanera sadhai malai gaslight garyo. Aile thaha bhayo 6 mahina dekhi tyo 'friend' sangai date garirako raichha.",
    "Mero call ignore garera 'I am feeling sleepy baby' bhanera suteko manche rati 3 baje arko sanga Instagram ma active thiyo. Pure cheater!",
    "3 barsa dekhi aafno sabai kura diyera biswas gareko manchhe le, arko manchhe bhettina sath 'I fell out of love' bhandai message ma relation end garyo.",
    "Found out they were texting their ex behind my back the whole time they were telling me 'You're the only one for me'. Sick to my stomach.",
    "Mero churot chhutyo, alcohol chhutyo, tara usko jhut bolne baani kahile chhutena. Dhoka diyerai xodhyo.",
    "Usne mujhe tab chhod diya jab mujhe uski sabse zyada zarurat thi, aur aage badh kar uske sath chala gaya jisse milne se mujhe mana karta tha.",
    "तिमी मेरो संसार हौ भन्ने मान्छेले अर्को भेट्नेबित्तिकै मलाई फोहोर जस्तै फ्याँकेर हिँड्यो। विश्वासको त धज्जी नै उडाइदियो!",
    "Caught them red-handed with multiple dating apps. Their excuse? 'I just wanted validation.' Disgusting.",
    "Jaba samma maile gifts, treat ra emotional support diye taba samma 'best boyfriend/girlfriend' thiye, mero garo samaye aaudai naya rich option khojera bhagyo.",
    "Uska 'busy hu' hamesha sirf mere liye hota tha, baaki sabke liye toh 24 ghante time tha. Andhi thi jo bharosa karti rahi.",

    // --- Painful Breakup & Coldness (अचानक छोडिएका र निष्ठुरी ब्रेकअप) ---
    "Aaja samma 'I can't live without you' bhanne manche, bholi palta rati euta paragraph message pathayera sadhai ko lagi block handiyo. Zero closure.",
    "3 years of building a future together wiped out with a single text: 'I need to find myself'. Coward.",
    "Usle move on garna 3 din pani lagayena, ma chai yeha aafno routine bata usko presence hatauna mahinau dekhi roiraaxu.",
    "Breakup pachi usko mutual friends sanga meri burai karte dekh kar samajh aaya ki wo insaan kitna toxic tha.",
    "Kasam haru sabai usle khayeko thiyo, tara aaja uniharuko bojha maile eklaile aafno mutu ma bokera hideko chhu.",
    "People can literally act like they love you for years and then switch up overnight like you were a complete stranger to them.",
    "Breakup ta bhayo, tara usle diyeko trust issues le garda aba kasailai aafno najeek aauna dina pani dar lagchha.",
    "उसको लागि म विकल्प मात्र रहेछु, जसलाई फुर्सद हुँदा सम्झिने र काम सकिएपछि बिर्सिने गरिन्थ्यो।",

    // --- Solitude & Feeling Replaced (एक्लोपना र आफैँमाथि शंका) ---
    "Usko story ma naya manche sanga tehi cafe ma tehi pose ma photo dekhe. I was so easily replaceable.",
    "I literally compromised my self-respect, my friends, and my career just to keep them happy, and in the end, I was the one left with nothing.",
    "Kasaiko reply kurda kurda bihana ko 4 bajchha, tara uslai mero aashu ko ek phota pani matlab chaina.",
    "Room ma light off garera basda ko tyo chiso sunyashilta... aafno mutu th थामिन garo hunchha yaar.",
    "Sabse bura lagta hai jab aapko realize hota hai ki aap unke liye kitna tadpe, aur unhone ek baar bhi aapke baare me nahi socha.",
    "आँसु पुछिदिने कोही छैन, अँध्यारो कोठामा सिरानी च्यापेर रुँदा रुँदै निदाउनु नै मेरो दिनचर्या बनेको छ।",
    "I don't miss the person anymore; I miss the illusion I fell in love with.",
    "Tyo manche le malai yeti dherai change gardiyo ki aile ma aafailai aaina ma herda chindina.",

    // Nepglish & Raw
    "3 barsa ko relation lai ek jhonk ma 'we are not compatible' bhanera end gardiye. Mero effort, time sabai waste.",
    "Usko story ma arko snga smile dekheko din dekhi chhati bhari bhaeko chha. Kasari eto chito move on huna sakchhan manche?",
    "Message pathauna type garera delete garchhu. Self-respect ra feelings ko fight ma sadhai roine ma matra ho.",
    "Room ma aayera light off garda ko tyo silence... tesle chhati chyatla jasto garchha. Kasailai bhanna pani sakidaina.",
    "Sabai sathi haru afno relationship ra circle ma busy chhan. Emergency parda call garne single manche pani chaina aile mero life ma.",
    "Jati deep maya garyo, teti nai ghau thulo banayera chhodera jada raichhan.",
    "Breakup ta bhayo, tara usle diyeko betrayal le aile naya manche lai trust garna sakne xamatai chaina.",

    // English
    "Gave my 100% to someone who treated me like an option whenever they were bored. Hard pill to swallow.",
    "I am surrounded by people all day, yet I feel suffocatingly alone. Nobody really knows how empty I feel.",
    "Deleting the photos doesn't delete the memories that play on loop in my head every single night.",
    "I feel like I'm grieving someone who is still alive, and they couldn't care less that I exist.",

    // Hinglish & Hindi
    "Usko koi farak nahi padta aur yahan meri raatein uske purane messages padhte-padhte beet rahi hain. Bewakoof hu main.",
    "Jab zarurat thi tab koi sath nahi tha. Ab kisi ka aana ya jaana kuch feel hi nahi karwata.",
    "Log bolte hain 'move on kar lo', jaise switch dabate hi dil ki memory erase ho jaati ho.",
    "जिस इंसान को अपनी पूरी दुनिया माना था, उसने एक पल में पराया कर दिया। अब किसी पर भरोसा नहीं होता।",

    // Nepali (Devanagari)
    "जसको लागि संसार छोड्न तयार थिएँ, उसैले मलाई सडकको धुलो जस्तै पन्छाएर हिँड्यो।",
    "मनको पीडा कसैलाई सुनाउन मन लाग्दैन, सुनायो भने नाटक गरेको भन्छन्। एक्लै कोठामा रुनु नै ठीक लाग्छ।",
    "अति माया गर्नु नै मेरो सबैभन्दा ठूलो गल्ती थियो। अहिले त्यसैको सजाय भोग्दै छु।",
  ],

  "future-anxiety": [
    // Nepglish & Raw
    "Bachelor pass garyo, CV pathayo, response '0'. Aile ta mail kholeyra rejection letter herna pani darr lagchha.",
    "Sathi haru sabai Australia ra Canada pugisake, ma chai yehi Kathmandu ko dhulo ma visa documentation ko चक्कर katdai chhu.",
    "Ghar ma aama buba ko expectation dherai thulo chha, tara afulai bholi bihana k garne bhanne tha chaina. Pure lost feel hunchha.",
    "Loksewa ko kitaab herda dimaag blast hunchha, IT ma apply garda 'needs 3 years exp for junior' bhandai reject handincha.",
    "24 barsa pugisake, savings ko naam ma 2000 rupiya chaina account ma. What a failure!",
    "Aru ko LinkedIn update herda afulai lagchha ma matra pachhi pareko hu yo संसार ma.",
    "Abroad loan liyera jaau ki Nepal mai struggle garu? Euta wrong step le pura 10 barsa bigrincha jasto lagchha.",
    "Passion follow garu bhane pet palidaina, 9-to-5 garu bhane aatma marchha. Bich ma fasera roiraaxu.",

    // English
    "I am constantly anxious about a future that I don't even have the energy to build.",
    "Everyone my age is either getting married, buying property, or getting promoted. I'm just struggling to wake up before noon.",
    "What if all this hard work leads to nothing? The fear of being completely mediocre is paralyzing.",
    "Quarter-life crisis is hitting like a truck. I have no idea who I am or what I want anymore.",

    // Hinglish & Hindi
    "Sab log pooch rahe hain aage ka kya plan hai. Bhai mujhe kal ka nahi pata, 5 saal ka roadmap kahan se laau?",
    "Degree ke paper par dust jam raha hai aur skills ki koi value nahi de raha. Total burnout phase.",
    "Ghar walo ke sapne bohot bade hain, aur meri himmat har rejection ke baad kam hoti ja rahi hai.",
    "भविष्य की इतनी चिंता हो रही है कि आज का दिन ठीक से जी ही नहीं पा रहा हूँ। सब कुछ अंधेरे जैसा लग रहा है।",

    // Nepali (Devanagari)
    "उमेर बढ्दै छ, जिम्मेवारी थपिँदै छ, तर हातमा केही गतिलो उपलब्धि छैन। भित्रभित्रै निस्सासिएजस्तो हुन्छ।",
    "आफन्तको अगाडि मुख देखाउन लाज लाग्न थालिसक्यो, हरेक भेटमा 'बाबुको के चल्दैछ?' भन्ने प्रश्नले मुटु चस्स बनाउँछ।",
    "सपना धेरै ठूलो देखेँ, तर यथार्थले भुइँमा पछारिदियो। फेरि उठ्ने तागत नै बाँकी छैन।",
  ],

  "academic-stress": [
    // Nepglish & Raw
    "TU ko exam schedule aayo, 1 week ma pura semester ko syllabus saknu parne re. K hami machine ho?",
    "Project partner le pure chill haniraaxa, pura documentation ra coding maile eklaile rati sutna napaera banairaxu. Score chai barabar!",
    "Teacher le slide bata copy paste padhauchha, exam ma chai high-level analytical logic magchha. Kasko dimag chalchha yesto ma?",
    "Lab viva ma maile pura logic bujhaye, external le 'format mileko chaina' bhanera marks katinchhan. Frustration ko sima chaina.",
    "Backlog ko tension le regular subject padhna sakidaina, regular bigriyera arko back thapincha. Infinite loop ma fasisake.",
    "Hostel ko chiso daal-bhaat khayera ratbhari padhyo, bihana exam hall ma question paper herda blank!",
    "Ghar bata tuition fee ko lagi paisa aauchha, marks naaauda afulai dherai guilty feel hunchha. Suicide thought samma aauchha kahile kahi.",

    // English
    "Studied non-stop for 3 weeks, drank 5 cups of black coffee a day, and still got an average grade. I am completely burnt out.",
    "The academic system cares about memorization, not actual knowledge. I feel like an exhausted robot.",
    "Group projects are just an excuse for one person to do all the work while others put their names on the title page.",
    "I haven't slept properly in a month. My head constantly throbs, and midterms aren't even over yet.",

    // Hinglish & Hindi
    "Syllabus itna bada hai aur exam ke beech me ek din ka bhi gap nahi diya. Seedha mental torture chal raha hai.",
    "Viva lene wala professor bas hume humiliate karne ke liye baitha tha. Zero motivation left.",
    "Assignment submission ka deadline rati 11:59 baje, server down, portal crash. Heart attack aane wala tha.",
    "किताब खोलेर बस्दा आँसु मात्र आउँछ, केही याद हुँदैन। फेल भएँ भने घरमा के जवाफ दिने?",
  ],
};

const COMMENT_TEXTS = [
  // Nepglish
  "Bro, exact same feel bhaeraxa malai pani. You are not alone yaar.",
  "Yo padhda aafnai story jasto lagyo. Stay strong brother!",
  "Aru ko agadi mask lagaunu bhanda yeha vent garera halka bhayo bhane thik chha.",
  "Fuck corporate toxicity! Afno health pahile prioritize gara bro.",
  "Chiya khau, aaja ko din laptop banda gardeu, life baki chha ajhai.",
  "Relate 100%. Yo phase bitchha, give yourself some time.",
  "Timi eklo chainau, hami dherai fasirako xam yehi loop ma.",

  "Cheaters never change bro. Usko karma le uslai nai vetxa, timi aafno peace recover gara.",
  "Move on huna garo hunchha, tara wrong person ko lagi aafno worth destroy nagara please.",
  "Been there, felt that exact same betrayal. Time lagchha tara timi pahila vanda strong banxau.",
  "Gaslighting is real evil. Ramro bhayo tyo jhooto manxe timro life bata gayo.",
  "Trust me, you dodged a bullet. Aile dukha lage pani paxi relief feel hunxa.",
  "ऐसे धोखेबाज़ लोग किसी के सगे नहीं होते, अपना दिल भारी मत करो भाई।",
  "उसले तिमीलाई गुमाएको हो, तिमीले केवल एउटा धोकेबाज गुमाएका हौ। Stay strong!",

  // English
  "Man, this hit right in the chest. Hang in there.",
  "Protect your mental peace at all costs. Nothing is worth your sanity.",
  "I felt every single word of this. Sending you strength.",
  "Take a deep breath. You're surviving things nobody talks about.",
  "Let it out. You don't have to carry it all alone.",

  // Hinglish & Hindi
  "Bhai exact yahi haal mera bhi hai. Rona aa gaya padh ke.",
  "Dimaag shant rakho, ye bura waqt bhi guzar jayega.",
  "Log nahi samjhenge, but keep venting here. Dil halka hota hai.",
  "हिम्मत मत हारना भाई, सब ठीक होगा एक दिन।",

  // Nepali (Devanagari)
  "मुटु चस्स बनायो तिम्रो कुराले। आफूलाई धेरै दोष नदेऊ है।",
  "समयले सबै घाउ निको बनाउँछ भन्छन्, धैर्य राख साथी।",
  "आगो बनेर जले पनि खरानी हुन नदेऊ आफूलाई। Stay strong!",
];

// 🎯 पोस्टको इन्गेजमेन्ट अनुसार कतिवटा कमेन्ट राख्ने निर्णय गर्ने
function pickCommentCount(relateCount: number): number {
  const roll = rand();

  if (relateCount > 150 || roll < 0.18) {
    // 🔥 ट्रेन्डिङ/भाइरल पोस्ट: ८ देखि २० वटा कमेन्ट
    return int(8, 20);
  } else if (relateCount > 50 || roll < 0.6) {
    // 💬 मध्यम इन्गेजमेन्ट: ३ देखि ७ वटा कमेन्ट
    return int(3, 7);
  } else {
    // 🤫 शान्त/नयाँ पोस्ट: ० देखि २ वटा कमेन्ट
    return int(0, 2);
  }
}

function makeComments(
  postId: string,
  postCreatedMs: number,
  postAuthor: Author,
  count: number, // 👈 यहाँ count पास गर्ने
): CommentT[] {
  if (count <= 0) return [];

  const out: CommentT[] = [];

  for (let i = 0; i < count; i++) {
    let author = pickAuthor();
    let guard = 0;

    while (author.alias === postAuthor.alias && guard++ < 10) {
      author = pickAuthor();
    }

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

/* =========================================================
   GENERATOR
   ========================================================= */

export const BULK_COUNT = 300;

function generate(): Confession[] {
  const now = Date.now();
  let minutesAgo = 1700;
  const list: Confession[] = [];

  const allPosts = Object.entries(CONTENT).flatMap(([cluster, contents]) =>
    contents.map((content) => ({ cluster, content })),
  );

  // Deterministically shuffle the independent posts.
  for (let i = allPosts.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [allPosts[i], allPosts[j]] = [allPosts[j], allPosts[i]];
  }

  const uniquePosts = new Map<string, (typeof allPosts)[number]>();

  for (const post of allPosts) {
    const normalized = post.content.trim().toLowerCase();

    if (!uniquePosts.has(normalized)) {
      uniquePosts.set(normalized, post);
    }
  }

  const posts = [...uniquePosts.values()];

  const countToGenerate = Math.min(BULK_COUNT, posts.length);
  for (let i = 0; i < countToGenerate; i++) {
    const post = posts[i];
    const author = pickAuthor();

    minutesAgo += int(15, 90);

    const createdMs = now - minutesAgo * 60 * 1000;
    const id = `confession-${23 + i}`;

    const relateCount = int(5, 320);
    const burnCount = Math.floor(relateCount * (0.2 + rand() * 0.35));

    const commentCount = pickCommentCount(relateCount);
    const comments = makeComments(id, createdMs, author, commentCount);

    list.push({
      id,
      author,
      content: post.content,
      tags: pickTags(post.cluster),
      semanticCluster: post.cluster,
      relateCount,
      burnCount,
      echoCount: comments.length, // 👈 काउन्टर र कमेन्टको संख्या ठ्याक्कै १:१ मिल्नेछ
      isRelatableByMe: chance(0.15),
      isBurnedByMe: chance(0.08),
      createdAt: new Date(createdMs).toISOString(),
      comments, // 👈 तयार भएका कमेन्टहरू
    } as Confession);
  }

  return list;
}

export const BULK_CONFESSIONS: Confession[] = generate();
