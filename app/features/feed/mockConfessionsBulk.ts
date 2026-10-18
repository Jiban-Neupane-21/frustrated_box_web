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

// Map author seeds directly to our 20 relational user IDs
const SEED_TO_USER_ID: Record<string, string> = {
  devbro: "usr_devbro",
  "sarah-j": "usr_mod_sarah",
  "bikash-t": "usr_mod_bikash",
  "anu-g": "usr_anu",
  "ktm-coder": "usr_ktm_coder",
  "suman-k": "usr_suman",
  "chiya-lover": "usr_chiya",
  "kiran-d": "usr_kiran",
  "momo-master": "usr_momo",
  "nisha-r": "usr_nisha",
  "samira-l": "usr_samira",
  "rohan-b": "usr_rohan",
  "sneha-p": "usr_sneha",
  "asha-n": "usr_asha",
  "sameer-k": "usr_sameer",
  "dipen-kc": "usr_dipen",
  "shraddha-v": "usr_shraddha",
  "sujan-b": "usr_sujan",
  "rojina-c": "usr_rojina",
};

const NAMED_RATIO = 0.55;

function pickAuthor(): Author {
  if (chance(NAMED_RATIO)) {
    const u = weightedPick([...NAMED_USERS]);
    return {
      id: SEED_TO_USER_ID[u.seed] || `usr_${u.seed.replace(/-/g, "_")}`, // 👈 अब User.id सँग १००% जोडियो!
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
  // Fallback to HOT_TAGS if cluster key is missing
  const pool = CLUSTER_TAGS[cluster] || HOT_TAGS;
  const count = int(2, 3);
  while (tags.size < count) tags.add(pick(pool));
  return [...tags].slice(0, 4);
}

const CONTENT: Record<string, readonly string[]> = {
  // ===================================================================
  // 1. WORKPLACE BURNOUT & CORPORATE RAGE
  // ===================================================================
  "workplace-burnout": [
    // --- ⚡ RAW ONE-LINERS ---
    "Overtime गर्यो भने 'enthusiastic', समयमै गयो भने 'attitude problem'। यो काम गर्ने ठाउँ हो कि कुकुर पाल्ने गोठ?",
    "Mental breakdown को verge मा बसेर client लाई 'Hope this email finds you well' लेख्दा आफैलाई घाँटीमा चक्कु घोप्न मन लाग्छ।",
    "बिहान ९ देखि राति ९ सम्म कुकुर जस्तो घोटिएर महिनामा २५ हजार पाउनेले mental health को कुरा गरेको सुहाउँदैन रे। मूर्खहरू।",
    "HR: 'We care about your work-life balance!' अनि त्यही HR शुक्रबार राति ९:३० मा 'Can we connect for 5 mins?' भन्दै Meet लिंक पठाउँछ। तेरो बाउको ब्यालेन्स।",
    "टेंशनले चुरोट र चियाको भरमा आन्द्रा जलाइसक्यो, management लाई slide को background color को चिन्ता छ। यी कुकुरहरू।",

    // --- 📜 LONG STORY VENTS ---
    `मलाई यो corporate drama बाट साँच्चिकै वाकवाक लाग्न थालिसक्यो।

राति ११:३० भइसकेको थियो। आँखा पोलेर आँसु आइरहेको थियो। Prod deploy गर्दा issue आयो, junior लाई सम्झायो, lead लाई loop मा राख्यो, issue resolve भयो।
भोलि बिहान १० बजेको standup मा manager ले full screen share गरेर सबैको अगाडि मेरो code review खोल्छ। गल्ती team lead को architecture design मा थियो, तर blame सिधै ममाथि आयो: "Why didn't you foresee this edge case?"

त्यही मान्छेले अस्ति client बाट appreciation mail आउँदा मेरो नाम delete गरेर आफ्नो credit हालेको थियो।
महिनाको अन्त्यमा आउने त्यही ३०-३५ हजारले न मेरो rent पुग्छ, न मेरो treatment को बिल। 
शरीर दुखेर paracetamol को पट्टा सिद्धिसक्यो। 
आफ्नो जवानी एउटा चोर कम्पनीको client satisfy गर्न सकियो। किन गरिरहेको छु म यो सब? कसको लागि? मेरो अस्तित्व खाली Jira tickets close गर्न मात्र बनेको हो?

म थकित छु। म रिसले पागल भइसकेको छु। यो जागिर होइन, कानूनी दासत्व हो।`,

    `Resignation drop गर्न खोज्दा "You are letting the team down" भन्दै gaslight गर्न आउँछन्।

कामको बेला १४ घण्टा घोटाउने, public holiday मा पनि "quick urgent task" भन्दै कल गरेर घाँटी बजारिरहने।
तर appraisal को बेला? "Company is going through a tough phase, we need your full dedication right now."
तेरो dedicated बाउको टाउको! CEO ले अस्ति नयाँ Scorpio किनेको फोटो LinkedIn मा हालेको होइन?
अफिसमा चिया खाने break मा ५ मिनेट ढिला भयो भने क्यामेराबाट हेरेर warning mail आउँछ।
बिहान उठ्दा पनि छाती भारी हुन्छ, office को Slack ringtone सुन्दै मुटु धड्किन्छ। 

यो जागिर होइन। यो कानूनी दासत्व हो। मलाई बस यो सब छोडेर जंगलतिर गएर बस्न मन छ। वा मर्नु।`,
  ],

  // ===================================================================
  // 2. LOVE LIFE TRAUMA & EMOTIONAL BETRAYAL
  // ===================================================================
  "heartbreak-frustration": [
    // --- ⚡ RAW ONE-LINERS ---
    "आफ्नै आँखा अगाडि उसको priorities change भएको देख्नुभन्दा ठूलो slow poison संसारमा केही छैन।",
    "'You deserve better' भनेर छोड्नेहरूले किन आफै better बनेर सँगै बस्न सक्दैनथे? Pure hypocrite clown हरू।",
    "३ वर्षसम्म मुटु सुकाएर care गरेको मान्छेले एउटा message मा 'I don't feel the spark anymore' भन्दै सिध्यायो। कुतिया।",
    "मायामा पर्नु नै मेरो सबैभन्दा ठूलो गल्ती थियो। आफू emotionally bankrupt भएर अर्कोलाई राजा बनाएँ।",
    "राति आँसुले सिरानी भिजाउँदै उसको seen status हेर्दै बस्ने मेरो आफ्नै औकात देखेर आफैसँग घिन लागेर आउँछ।",

    // --- 📜 LONG STORY VENTS ---
    `तेरो "I need space" को real meaning "I found someone richer" थियो भनेर सिधै भनेको भए हुन्थ्यो।

म पागल जस्तो bike मा पेट्रोल हाल्ने पैसा नभएर हिँड्दै-हिँड्दै तेरो college अगाडि कुरेर आउँथे।
आफ्नो खाजा खाने पैसा बचाएर तेरो birthday मा gift किनेर दिएँ।
तेरो एउटा mood swing solve गर्न आधी रातमा घण्टौं फोनमा रोएँ, तेरो trauma सुनिदिएँ।
अनि त्यही मान्छेले एकैचोटि बोल्न छोडेर "Family pressure छ, caste मिल्दैन" को पुरानो सस्तो script सुनाइदिइस्?

Last week तेरो close friend को story मा त्यो नयाँ IT company को manager सँग क्याफेमा हाँसिरहेको देख्दा मेरो मुटुमा छुरी रोपेको जस्तो भयो।
कसैले कसैलाई यति deeply use गरेर कचरा जस्तो फाल्न कसरी सक्छ यार?
अब न कसैलाई trust गर्न सकिन्छ, न आफ्नो मन खोल्न सकिन्छ। Pure empty। Completely numb बनाएर गयो। मलाई घिन लाग्छ आफैंसँग।`,

    `मेरो सबैभन्दा ठूलो गल्ती भनेको तिमीलाई आफ्नो संसार बनाउनु थियो, जबकि म तिम्रो timepass option मात्र थिएँ।

जब तिमीलाई जरुरत पथ्र्यो, २४/७ available भएँ। आफ्नो career, पढाइ, आमा-बुवाको चिन्ता सब पछाडि राखेर तिम्रो validation खोजेँ।
तिम्रीले मेरो self-respect लाई लिएर toilet paper जस्तो use गर्यौ।
हरेक झगडामा गल्ती तिम्रो हुँदा पनि हात जोडे मैले, किनकि मलाई तिमीलाई गुमाउन मन थिएन।
तर तिमीले त्यो मेरो weakness सम्झ्यौ।
आज एक्लै कोठामा बसेर हेर्दा बुझ्दैछु—म प्रेममा थिइनँ। म एउटा narcissist को victim बनिरहेको थिएँ।
मेरो आँसुको एउटा-एउटा थोपाको हिसाब तिमीले कसरी चुक्ता गर्छौ, हेर्न मन छ मलाई।`,
  ],

  // ===================================================================
  // 3. FUTURE PARALYSIS, DEGREE SCAM & FAMILY PRESSURE
  // ===================================================================
  "future-anxiety": [
    // --- ⚡ RAW ONE-LINERS ---
    "Certificate को frame किन्न जति खर्च लाग्यो, त्यति त त्यो degree ले महिनामा कमाएर दिँदैन।",
    "परदेश गएका साथीहरूको AUD/USD flex, यता आफ्नो चाहिँ Pathao rider लाई २० रुपैयाँ tip दिन १० चोटि सोच्नुपर्ने औकात।",
    "छिमेकीको छोरा US पुग्यो भनेर सुनाउँदै बुवाले मेरो मुखमा हेर्दा आफैलाई ज्यान मार्न जस्तो हुन्छ।",
    "२६ वर्षको भएँ, हातमा skills छ, तर job market मा reference बिना चुरोटको ठुटो बराबर value छैन।",

    // --- 📜 LONG STORY VENTS ---
    `आज फेरि भात खाँदा-खाँदै बुवाले "विदेशको के हुँदैछ?" भनेर सोध्नुभयो। घुस्नै नसकेर भातको सिता गालामा अड्कियो।

के भनुँ मैले? ३ चोटि IELTS दिँदा १.५ लाख सकियो, consultancy ले २ लाख खाएर file hold गरिदियो भनेर?
यता नेपालमा जागिर पाइँदैन। भएको जागिरमा १५ हजार दिँदा १२ हजारको पेट्रोल सकिन्छ।
Master's degree गर्यो, लोकसेवा २ वर्ष तयारी गर्यो, नाम निस्किँदैन।
साथीहरू सबै Australia, Canada, Dubai पुगिसके। Instagram खोल्यो कि airport को caption र trolley को फोटो देखिन्छ।

यता आफू कोटेश्वरको धुलो र माइक्रोबसको भीडमा पसिनाले लथालिंग भएर आफ्नो अस्तित्व खोजिरहेको छु।
आफू failure भएको त accept गर्थें होला म, तर आमा-बुवाको आशा भरिएको आँखा देख्दा सास नै रोकिन्छ।
Every single night २ बजे छाती पोलेर निद्रा खुल्छ। म आफैँ मरेर आमा-बुवाको insurance claim गरिदिऊँ जस्तो thought आउँछ कहिलेकाहीं। यति धेरै suffocating छ यो life।`,
  ],

  // ===================================================================
  // 4. TU SCAM & ACADEMIC TORTURE
  // ===================================================================
  "academic-stress": [
    // --- ⚡ RAW ONE-LINERS ---
    "Exam सकिएको १४ महिनापछि result आउँछ, त्यो पनि आधा batch लाई बिना कारण absent बनाएर। देशको भविष्य रे!",
    "Teacher लाई आफ्नो subject को नयाँ updates थाहा छैन, तर practical मा marks काट्न ५० वटा ego देखाउनुपर्छ।",
    "Assignment को नाममा ५०० पेजको रद्दी कापी भर्न लगाएर आफ्नो tension student माथि थोपर्ने traditional professors।",

    // --- 📜 LONG STORY VENTS ---
    `Tribhuvan University मा पढ्नु भनेको आफ्नो चार वर्षको जवानी खोरमा थुन्नु बराबर हो।

Punctuality को 'P' थाहा छैन faculty लाई। ७ बजेको class मा sir ७:४५ मा पैन्टको गोजीमा हात हालेर पान चबाउँदै चिरिन्छ।
Syllabus २००५ सालको Windows XP जमानाको पढाउँछ, अनि बाहिर job market मा आएर AI र Cloud architecture माग्छ।
Exam center मा फोहोर bench, बत्ती छैन, फ्यान चल्दैन, ४० डिग्रीको गर्मीमा पसिना पुछ्दै पेपर लेख्यो।

अनि marks कसरी आउँछ थाहा छ? जाँच्ने बुढोको घरमा बुढीसँग झगडा भएको छ भने सबैलाई ३२ दिन्छ।
Retotaling form भर्यो, १ वर्षसम्म त्यो formको डुलो भेटिँदैन।
हामी student हौं कि system को guinea pig? हाम्रो mental health, हाम्रो future, हाम्रो सपना सबलाई एउटा red pen ले काटेर मुखमा हाँसिदिने यो system लाई के गरेर सहने?`,
  ],
};

export const COMMENT_TEXTS = [
  // ===================================================================
  // 1. NEPALESE / NEPGLISH (RAW, RAGE & REAL TALK)
  // ===================================================================
  // Corporate & Job Rage
  "Bro tyo manager ko mukh mai resign thokera gala chirauna man lageko malai ni daily hunchha. You are not alone, hami sabai euta nai narka ma pilsieka chhau.",
  "Company le aafno baau ko private property jasto use garchha hami lai. Tyo chor haru ko lagi aafno health bigarne haina, uniharu ko company jalaune sochna thalo.",
  "Churot ko thuto jasto nichorera faalchhan employee lai. Aaja ko din laptop banda gara, tel lagos tyo office lai, ra manager ko ghar lai pani.",
  "Salary 20 hazar dida 2 lakh ko kaam khojne haru ko aakha ma khursani chhaidim jasto lagchha. Fuck corporate toxicity, fuck yo poisa ko narka.",
  "Kaam garne kalu, makai khane bhalu system ho bro Nepal ko IT ra corporate. Tyo parasites haru bata tadha bhaga, na bhane timro aatma nai bechera sakincha.",

  // Love Life, Betrayal & Heartbreak
  "Chhodi gayo ta gayo, tesko astitwa nai tetti thiyo. Tyo randi rona banda gara aba, aafno aukaat banau ra uslai nai bhulna seekha.",
  "Duskari thiyo tyo manchhe, ramro bhayo aile nai chitta bujhayo. Timle bullet dodge gareko ho, aashu khasalauna pardaina, usko photo delete gara ra burn gara.",
  "Mero ni same katha thiyo bro—3 barsa loyalty dekhaye, aakhiri ma arko rich keta sanga gaidi. Manxe haru pure selfish chhan, trust nagarne banau aafailai.",
  "Tyo manxe le timro self-respect kukur jasto ghitari sakeko thiyo, ahele single bhayera chhati tanera bacha, ra uslai nai sochda rish le aago jalauna seekha.",
  "Kasailai aafno sabai thok nabanau yar, kachra jasto side lagaidinchha time aayesi. Fuck fake promises, fuck tyo emotional vampire haru.",
  "Rati 2 baje tyo snake ko profile stalk garna banda gara. Usko karma le uslai ghati ma aayera samatchha, ani timi hasera hera.",

  // Career, Degree & TU Trauma
  "TU ko vice chancellor dekhi check garne budho samma lai jhyal bata faalna man lagchha. Zindagi barbad garidiye hami sab ko, yo system lai nai jalauna parne thiyo.",
  "Degree liyera bechna gayeni 50 rupiya aaudaina yaha. System nai fohor chha, timro galti chaina bro, yo desh nai fail chha.",
  "Ghar ma aama buwa ko pressure le saas ferna garo hunchha yar, I can literally feel the knot in my chest reading this. Yo pressure le nai manxe marne garchha.",
  "Bidesh bhagne line ma lagum bhane paisa chaina, yaha basum bhane aafno astitwa dekhidaina. Kasto pasina aune trap ho yo zindagi, narka nai ho.",

  // Deep Empathy & Bro-Code (but raw)
  "Padhda padhdai chhati bhari bhayera aashu aayo yar. Kasari sahiraxau timi yo sab? Maile ta aafno aatma nai bechisake.",
  "Chhati fussa banayera ya vent gara bro, baira ta kasaile sundaina hami jasto ko kura. Yo sansaar nai deaf chha.",
  "Aaja runu chha bhane dhukka roideu. Tara bholi uthda tyo tori haru ko agadi jhukne haina, uniharu lai nai thukna seekha.",

  // ===================================================================
  // 2. NEPALI (DEVANAGARI - RAW & UNCENSORED EMOTIONS)
  // ===================================================================
  "तिमीले भोगेको पीडा शब्दमा भन्नै सकिन्न यार, त्यो पाखण्डी मान्छेले तिम्रो आँसुको मोल कहिल्यै चुकाउन सक्दैन। उसलाई जिन्दगीभरि नर्क चाहियो।",
  "यो देशको सिस्टम र अफिसको शोषण देख्दा रगत उम्लेर आउँछ। आफ्नो ज्यान बचाऊ पहिले, काम भाडमा जाओस्, ती कुकुरहरू मरोस्।",
  "तिमी एक्लो छैनौ भाई, हामी सबै एउटै नर्कमा पिल्सिएर बाँच्ने नाटक गरिरहेका छौँ। यो जिन्दगी नै घिनलाग्दो छ।",
  "आफ्नो आत्मसम्मान बेचेर कसैको अगाडि नझुक। जसले लात हान्यो, उसलाई जिन्दगीबाटै मेटाइदेऊ, नाम निशान नराख।",
  "टि.यु. र यो खत्तम शिक्षा प्रणालीले कति युवाको सपना मारिसक्यो, तिमी आफूलाई दोष दिन बन्द गर। यो सिस्टम नै मर्नुपर्ने हो।",

  // ===================================================================
  // 3. ENGLISH & HINGLISH (BRUTAL HONESTY)
  // ===================================================================
  "Bro, that whole company is a blood-sucking leech. Close the damn laptop and tell them to fuck off forever, not just for the weekend.",
  "They didn't break your heart; they freed you from an emotionally manipulative sociopath. Wipe those tears and level up, or stay broken, your choice.",
  "Bhai padh ke khoon khaul gaya mera. In jaise narcissist logo ko zindagi se kachre ki tarah nikal feko, naam-o-nishaan mat chhodo.",
  "Corporate will replace you in 48 hours if you drop dead. Prioritize yourself, stop being a martyr for pennies, these fuckers don't deserve your blood.",
  "Degree is a scam, these low-paying companies are a scam. You survived the worst of it, don't let them break your spirit—burn the system instead.",
  "Bhai rona aa raha hai ye padhke. Exactly yahi ghutan mujhe bhi har roz hoti hai. Stay alive out of pure spite, nothing else.",
] as const;

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

// ==========================================
// MOCK COMMUNITIES FOR EXPLORE & SEARCH
// ==========================================
export const MOCK_COMMUNITIES = [
  {
    id: "comm-1",
    name: "Tech Life & Code Burnout",
    slug: "tech-life",
    description:
      "Developers screaming about prod bugs, legacy codebases, and sprint deadlines.",
    membersCount: 14200,
    initials: "TL",
    isJoined: false,
  },
  {
    id: "comm-2",
    name: "Corporate Cage",
    slug: "corporate-cage",
    description:
      "9-to-5 survivors venting about micromanagers, corporate politics, and long meetings.",
    membersCount: 28400,
    initials: "CC",
    isJoined: true,
  },
  {
    id: "comm-3",
    name: "Midnight Thoughts & Overthinking",
    slug: "midnight-thoughts",
    description:
      "Late night existential rants, insomnia thoughts, and unspoken confessions.",
    membersCount: 19800,
    initials: "MT",
    isJoined: false,
  },
  {
    id: "comm-4",
    name: "Heartbreak & Silent Tears",
    slug: "heartbreak-hotel",
    description:
      "Moving on from past memories, unsaid feelings, and broken trust.",
    membersCount: 9300,
    initials: "HH",
    isJoined: false,
  },
  {
    id: "comm-5",
    name: "Academic Chaos & Exams",
    slug: "academic-chaos",
    description:
      "Students struggling with semester exams, thesis papers, and CGPA stress.",
    membersCount: 16500,
    initials: "AC",
    isJoined: false,
  },
  {
    id: "comm-6",
    name: "Happy Mask Falloff",
    slug: "happy-mask",
    description:
      "Faking a happy smile for everyone outside while struggling silently inside.",
    membersCount: 7800,
    initials: "HM",
    isJoined: false,
  },
] as const;

export const BULK_CONFESSIONS: Confession[] = generate();
