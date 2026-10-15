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
    "Office ma sabai bhanda chito kaam sakne manche lai nai arko task dinchhan.",
    "Salary increment ko kura garda company ko budget yaad aauchha, workload ko kura garda mero capacity.",
    "Leave approve bhayo, tara team ko guilt trip le ghumna jane mood nai bigaryo.",
    "Meeting ma idea share gareko thiye, next week arko colleague le tehi bhanda credit payo.",
    "Remote job bhanera join gareko, aile ta rati samma online basnu parne raichha.",
    "Office pugna traffic le ek ghanta khanchha, ghar farkida arko ek ghanta.",
    "Probation extend bhayo, reason sodhda vague feedback matra paye.",
    "Manager ko mood anusar team ko din ramro ki naramro hunchha.",
    "Overtime ko paisa chaina, tara overtime nagarda commitment chaina re.",
    "Team ko sabai problem solve gardai afno assigned work nai pending bhayo.",
    "Promotion ko lagi experience chahinchha, experience ko lagi promotion chahinchha jasto lagchha.",
    "Lunch break ma pani laptop kholera kaam garnu normal banaidiye.",
    "Company ko culture family jasto bhaninchha, tara emergency leave magda problem hunchha.",
    "Office ma mistake accept garda accountability, arule garda misunderstanding re.",
    "Job description ma lekheko bhanda dherai responsibility handle gardai chhu.",
    "Performance review ma measurable result bhanda manager sanga ko relation important raichha.",
    "Client ko last-minute change le pura week ko planning bigaryo.",
    "Kaam ramro gareko feedback bhanda aru improve garnu parne kura matra suninchha.",
    "Naya employee lai train garna paryo, tara afno workload ghataune kura bhayena.",
    "Meeting ko meeting hunchha, actual kaam garna uninterrupted time nai paudina.",
    "Office ko group chat mute garda pani important update miss hunchha ki bhanne dar.",
    "Resignation letter ready chha, tara savings le confidence diyeko chaina.",
    "Ekai choti developer, designer ra support agent ko role garirako chhu.",
    "Sick leave liyera pani ghar bata kaam gareko din dherai bhaisakyo.",
    "Kaam ko lagi available hunu ra sadhai available hunu farak kura ho.",
    "Senior ko harsh feedback le dinbhari afno ability mathi doubt garaye.",
    "Team ko deadline unrealistic thiyo, tara delay ko blame individual lai aayo.",
    "Company le wellness session rakhyo, tara workload chai same nai chha.",
    "Office ko politics bata tada basna khojda pani tesko effect kaam ma parchha.",
    "Mero idea implement bhayo, tara final presentation ma mero naam nai aayena.",
    "Client le urgent bhaneko task pachi dui hapta samma review nai garena.",
    "Ek din leave lida backlog double hunchha bhane tyo system ma problem chha.",
    "Kaam ko lagi naya skill sikna parne, tara sikne time office le didaina.",
    "Team ma sabai busy chhan, help magda afulai incompetent feel hunchha.",
    "Salary aayeko din khusi, rent ra bills tirepachi feri same tension.",
    "Office ko appreciation post ma sabai ko naam chha, kaam gareko mero naam chaina.",
    "Manager le autonomy dinchhu bhanchha, tara harek sano decision approve garnu parchha.",
    "Break lina khojda productive chaina jasto lagchha, kaam garda exhausted hunchhu.",
    "Project ko scope badhyo, budget ra deadline chai change bhayena.",
    "Colleague le kaam chhodyo, usko responsibility pani quietly mero ma aayo.",
    "Office ko feedback session ma honest huna bhanchhan, tara honest answer risky lagchha.",
    "Kaam sakera laptop banda garda pani pending task dimag ma ghumiranchha.",
    "Team ko morale low chha, tara leadership le sabai thik chha bhanirachha.",
    "Intern lai sikaune bhanera rakheko, aile unpaid full-time worker jasto feel hunchha.",
    "Client ko message rati aayo, reply nagarda bholi ko meeting ma question aauchha.",
    "Career ma agadi badhna khojda current job le energy nai baki rakhdaina.",
    "Office ma sabai sanga friendly chhu, tara actual support chahida koi available hudaina.",
    "Project deadline ko lagi weekend sacrifice gare, release date feri sarayo.",
    "Kaam ko quality bhanda online status green chha ki chaina badi herinchha.",
    "Naya responsibility pauda khusi bhaye, tara salary review chai bhayena.",
    "Office ko canteen ma basera pani kaam ko kura matra hunchha.",
    "Resign garepachi regret hola ki basirakhe regret hola bhanera confuse chhu.",
    "Mero productivity measure garna screenshot tracker use garna thaleko chha.",
    "Ek jana employee le kati role cover garna sakchha bhanne limit pani hunuparchha.",
    "Team lead sanga disagreement bhayo bhane performance rating affect hunchha ki dar lagchha.",
    "Kaam ko message ko reply chhito nagarda irresponsible bhanne impression baschha.",
    "Office ma naya process aayo, purano process hatauna chai kasaile socheko chaina.",
    "Deadline meet gareko celebrate hunna, next deadline turuntai assign hunchha.",
    "Company ko event ma jana mandatory, tara extra work ko time count hudaina.",
    "Kaam ko lagi Kathmandu baseko, tara rent ra commute le salary ko thulo part khanchha.",
    "Afno career ko direction ko barema sochna weekend matra baki chha.",
    "Team ko conflict resolve garna khojda mediator ko unpaid role paiyo.",
    "Manager le ownership magchha, tara decision lina khojda permission chahinchha.",
    "Remote work ma flexibility chha, tara ghar ra office ko boundary harayo.",
    "Naya project ma interest thiyo, tara repetitive maintenance task ma assign bhaye.",
    "Office ko feedback le improve huna help garnu parne, tara personal attack jasto lagyo.",
    "Salary negotiation ko meeting book garna pani confidence collect garnu parchha.",
    "Company ko layoff news sunepachi normal kaam ma focus garna garo bhayo.",
    "Kaam ko success team ko naam ma, failure chai individual ko naam ma.",
    "Training attend gare, tara skill use garna project ma chance nai paiena.",
    "Client ko expectation clear thiyena, final result ko blame chai team lai aayo.",
    "Office ma sick bhayera basnu bhanda rest liyera recover hunu ramro hola.",
    "Product launch ko lagi months kaam gare, feedback ma bug ko list matra aayo.",
    "Career change garna man chha, tara current income chhodne risk lina sakirako chaina.",
    "Company ko policy sabailai same bhaninchha, implementation chai farak chha.",
    "Aaja kaam sakera time mai ghar gaye, ani afailai guilty feel bhayo.",
    "Team ko sabai urgent kaam mero urgent kaam bhayera basyo.",
    "Work-life balance presentation ma ramro chha, daily reality ma chaina.",
    "Office ma promotion ko announcement bhayo, ma chai afno growth ko barema sochdai chhu.",
    "Kaam ko lagi boundaries set garna thaleko, suruma manche haru surprise bhaye.",
    "Ek hapta uninterrupted kaam garna paye project kati chhito sakinthyo hola.",
  ],

  "future-anxiety": [
    "Bachelor sakiyo, aba next step ke ho bhanera ghar ma sodhna thalisake.",
    "Sathi ko abroad visa aayo, ma chai application ko documents milaudaichhu.",
    "Afno age ko manche haru settled dekhinchhan, mero journey chai unclear chha.",
    "Career choose garda interest follow garne ki stable income herne bhanera aljheko chhu.",
    "Parents ko expectation pura garna khojda afno dream sano banaudai chhu.",
    "Loksewa prepare garne ki private job khojne bhanne decision lina sakirako chaina.",
    "Interview ko call aayena, CV ma ke change garne bhanera sochdai chhu.",
    "Friends le startup launch gare, ma chai idea validate garna darairako chhu.",
    "Bidesh jane plan chha, tara family chhodne thought le man bhari hunchha.",
    "Paisa save garna khojchhu, tara unexpected expenses le plan bigarchha.",
    "Sabai le five-year plan sodhchhan, mero next month ko plan pani uncertain chha.",
    "Naya skill sikna thale, market ma already dherai agadi pugisake jasto lagchha.",
    "Social media ma success stories herda afno normal day failure jasto lagchha.",
    "Family ko financial situation le passion bhanda earning priority banauna paryo.",
    "Internship ko lagi apply gareko, experience chaina bhanera reject bhaye.",
    "Maile choose gareko degree le future ma kasto opportunity dinchha bhanne tension chha.",
    "Sano mistake garepachi pura career bigrinchha jasto soch aauchha.",
    "Sathi haru ko salary sunepachi afno progress compare garna thalechhu.",
    "Parents lai mero struggle bhanna garo chha, kina bhane uniharu le dherai sacrifice garnubhayo.",
    "Aile ko job chhodera naya field ma jana late bhayo ki jasto lagchha.",
    "Savings ko target rakheko thiye, emergency le feri zero bata start garayo.",
    "Career ko barema decision lina khojda sabai ko advice opposite hunchha.",
    "Afno potential chha jasto lagchha, tara consistency maintain garna sakdina.",
    "Dherai course kinisake, tara euta pani complete project baneko chaina.",
    "Aru le settle bhayepachi matra khusi hunchhan jasto dekhinchha, ma chai confused chhu.",
    "Bihe ko pressure badhdai chha, tara afno life ko direction nai clear chaina.",
    "Family gathering ma career ko question avoid garna phone chalaunchhu.",
    "Pahilo salary ko paisa ghar pathauda khusi lagyo, tara afno expenses manage garna garo bhayo.",
    "Freelancing ko first client khojdai chhu, rejection le confidence test gardai chha.",
    "Mero success ko definition family ko definition bhanda farak huna sakchha.",
    "Future ko dar le opportunity accept garnu bhanda safe option choose garchhu.",
    "Degree ra skills dubai chhan, tara confidence ko kami le apply gardina.",
    "Aru ko timeline follow garda afno priorities birsina thaleko chhu.",
    "Financial independence chahinchha, tara start kasari garne bhanne confusion chha.",
    "Interview ma nervous hunchhu, pachi answer yaad aauchha.",
    "Ghar ko responsibility badhdai chha, afno goals ko time ghataudai chhu.",
    "Aaja ko failure lai permanent identity banauna hudaina bhanera sikdai chhu.",
    "Mero friends group ma sabai ko career direction chha, mero chai exploration phase ma chha.",
    "Bidesh ko loan line ki Nepal mai opportunity khojne bhanera family discussion chalirachha.",
    "Afno passion bata income kamauna sakincha ki hobby nai rakhnu parcha bhanne doubt chha.",
    "Kati dherai option chhan ki kunai euta choose garna nai garo bhayo.",
    "Aafno parents lai rest dina sakne din kahile aauchha bhanera sochchhu.",
    "Portfolio banauchu bhanera mahina bitayo, aile samma publish garna sakina.",
    "Naya city ma basna gaye, tara familiar manche nabhaye sabai kura challenging raichha.",
    "Salary ramro chha, tara growth chaina; growth chha, tara salary kam chha.",
    "Aile ko struggle future ko experience banla ki time waste hola bhanera dar lagchha.",
    "Afno goals ko barema bolna sajilo chha, daily discipline maintain garna garo.",
    "Family le compare gareko bela afno achievement explain garna man lagdaina.",
    "Maile socheko success ko age cross bhayo jasto lagchha, tara journey ajhai baki chha.",
    "Career break lida gap ko question aauchha bhanera rest lina pani dar lagchha.",
    "Aru ko advice sundasundai afno intuition sunna birsina thalechhu.",
    "Small town bata aayera Kathmandu ma opportunity khojda confidence ra budget dubai test bhayo.",
    "Future ko uncertainty le relationship ra career dubai ma decision delay garirachha.",
    "Afno skill ko value negotiate garna siknu pani career ko part raichha.",
    "Job search ma daily apply garda pani response naaauda motivation ghatchha.",
    "Parents lai financial help garna man chha, tara afai stable bhayeko chaina.",
    "Aru le ghar kineko sunera rent ma basnu failure ho jasto feel bhayo.",
    "Maile choose gareko path slow chha, tara slow bhayeko karan wrong nai hoina hola.",
    "Sano savings bata start gareko chhu, amount bhanda habit important raichha.",
    "Career ko uncertainty ko barema openly kura garne space chahinchha.",
    "Afno first attempt successful hunai parcha bhanne pressure chhodna khojdai chhu.",
    "Dherai opportunity miss bhayo jasto lagchha, tara sabai opportunity mero lagi thiyena hola.",
    "Naya skill sikda beginner hunu normal ho bhanne kura accept garna garo bhayo.",
    "Life ko important decision lina agadi sabai lai khusi banauna sakidaina raichha.",
    "Aaja ma aru bhanda agadi pugna bhanda hijo bhanda improve huna focus gardai chhu.",
    "Savings, career ra family ko tension ekai choti manage garnu parchha.",
    "Aafno city ma opportunity khojna thale, pahila abroad matra solution jasto lagthyo.",
    "Interview reject bhayepachi feedback magne courage develop gardai chhu.",
    "Mero plan change bhayo bhanera maile failure accept gareko hudaina.",
    "Career ma late start gare pani learning stop nagare samma chance hunchha.",
    "Sathi ko achievement celebrate garna ra afno insecurity handle garna dubai sikdai chhu.",
    "Aaja euta application submit gare, overthinking bhanda action ramro lagyo.",
    "Mero family ko sacrifice ko value salary le matra measure garna mildaina.",
    "Afno future ko sabai answer aaja nai khojnu pardaina bhanera samjhaudai chhu.",
    "Life ma stable huna khojda change bata dar lagna thaleko chha.",
    "Mero progress visible chaina bhanera progress nai bhayena bhanne hudaina.",
  ],

  "heartbreak-solitude": [
    "Usko number delete gare, tara yaad chai delete garna sakina.",
    "Sathi haru ko bich ma basda pani afno kura share garna sakdina.",
    "Ek jana manche ko reply le mood decide garna chhodeko ramro hola.",
    "Relationship sakiyo, tara daily routine bata usko presence hatauna garo chha.",
    "Kasaile mero silence notice garos bhanne expectation rakhna chhodechhu.",
    "Purano chat padhna chhodepachi healing ali sajilo bhayo.",
    "Friendship ma effort one-sided bhayepachi distance rakhna sikdai chhu.",
    "Usle move on garisakyo, ma chai closure khojirako chhu.",
    "Birthday ma sabai ko message aayo, tara ek jana ko absence feel bhayo.",
    "Trust break bhayepachi naya manche lai chance dina time lagchha.",
    "Group photo ma sabai sanga haseko chhu, tara tyo din ekdam lonely thiyo.",
    "Maile maaf gare, tara pahila jasto close huna sakina.",
    "Kura garna man chha, tara feri misunderstood hunchhu ki bhanne dar chha.",
    "Old memories ramra chhan, tara tyo relationship ma farkina chahanna.",
    "Eklo basnu ra unwanted feel garnu farak kura raichha.",
    "Sadhai strong dekhine manche lai pani support chahinchha.",
    "Usko naya relationship dekhera afno worth question garnu thik hoina hola.",
    "Friendship break bhayeko grief pani real hunchha bhanera bujhechhu.",
    "Sabai kura share garne manche sanga aile formal conversation matra hunchha.",
    "Kahile kahi reply nadinu pani afno peace protect garnu ho.",
    "Mero effort notice garne manche khojda maile afailai neglect garechhu.",
    "Relationship ma boundaries rakhda selfish bhanne label paye.",
    "Kasaile sodheko simple question le pani purano memory trigger garchha.",
    "Move on ko timeline aru le decide garna mildaina raichha.",
    "Sathi ko circle change bhayo, aba afno place khojdai chhu.",
    "Usko lagi wait gardagarda afno life ko dherai moment miss garechhu.",
    "Sabai relationship permanent hudainan bhanne kura accept garna garo chha.",
    "Mero feelings explain garda overreact gareko bhanera dismiss gariyo.",
    "Maile text nagarda relation nai stop hunchha bhane effort kasko thiyo?",
    "Social media ma happy dekhinु ra actually happy hunu eutai kura hoina.",
    "Ek jana sanga distance badhda arko manche ko value bujhna thalechhu.",
    "Kura milena bhane respectful goodbye pani option ho raichha.",
    "Kasaiko attention pauna afno personality change garna chhodechhu.",
    "Rati purano kura yaad aauchha, bihana afno routine ma farkinchhu.",
    "Closure usko answer bata bhanda afno decision bata aayo.",
    "Maile friendship save garna matra effort gare, afno feelings explain garina.",
    "Kasaile promise gareko kura birsida pani maile dherai samaya wait garechhu.",
    "Ek jana manche le chhodeko karan sabai manche same hudainan.",
    "Aafno company enjoy garna siknu loneliness ko opposite huna sakchha.",
    "Group chat active chha, tara personal conversation haru kam hudai gaye.",
    "Maile uslai miss gare pani tyo relationship ma farkinu jaruri chaina.",
    "Friendship ma jealousy ra insecurity openly discuss garna garo raichha.",
    "Kasaile mero boundary respect nagarda distance rakhna sikdai chhu.",
    "Breakup pachi favorite place ma jana pani naya experience jasto lagchha.",
    "Sabai kura thik chha bhanera reply dinu sajilo, actual answer dina garo.",
    "Maile aruko feelings protect garda afno feelings lukaye.",
    "Aba relationship ma words bhanda consistent actions herna man chha.",
    "Kasaile sorry bhanyo, tara change dekhincha ki bhanera time dinchhu.",
    "Purano friend lai message garna man chha, tara kina distance bhayo yaad chha.",
    "Afno needs express garnu needy hunu hoina bhanera bujhdai chhu.",
    "Sathi haru busy bhaye, tara maile naya connection banauna pani try garnu parchha.",
    "Kasaile reject garda dukha lagchha, tara tyo mero worth ko final verdict hoina.",
    "Mero attachment le malai thakayo, aba pace slow garna khojchhu.",
    "Maile manche haru bata expectation kam gare, communication chai clear rakhchhu.",
    "Usko social media herna banda garepachi dimag ali halka bhayo.",
    "Sambandha bachaauna dui jana ko effort chahinchha bhanne kura late bujhechhu.",
    "Sathi ko success ma khusi hunchhu, tara afno loneliness pani feel garchhu.",
    "Eklo dinner khana sikdai chhu, aru ko wait garnu pardaina.",
    "Kasaile mero kura bichmai cut garda share garne interest ghatchha.",
    "Relationship ko barema family lai bhanna nasakda tension bhairachha.",
    "Maile forgive gareko manche lai feri access dinai parchha bhanne chaina.",
    "Aaja usko yaad aayo, tara message pathauna parcha bhanne chaina.",
    "Friendship ma misunderstanding clear garna ego side ma rakhnu parchha.",
    "Kasaiko priority huna khojda afno priority birsina hudaina.",
    "Mero life ma manche haru aauchhan ra janchhan, ma chai afusanga baschhu.",
    "Ek jana ko absence le pura world empty bhayeko jasto lagna sakchha.",
    "Kasaile time nikalna sakena bhane maile afno schedule sadhai adjust garnu pardaina.",
    "Old photos delete gare, memories lai force garera hate garnu pardaina.",
    "Maile relation end gareko thiye, tara decision lina pani grief hunchha.",
    "Aaja ek jana sanga honestly kura gare, expected bhanda ramro response paye.",
    "Mero feelings valid huna aruko permission chahindaina.",
    "Sabai manche sanga deep connection hunuparchha bhanne chaina.",
    "Lonely feel bhayeko din ma afulai busy banaunu bhanda rest dinchhu.",
    "Friendship ko end ma villain khojnu bhanda lesson bujhna man chha.",
    "Mero peace protect garna maile kehi invitations decline gare.",
  ],

  "academic-stress": [
    "Exam ko syllabus herda padhna bhanda planning mai dherai time jancha.",
    "Class ma bujheko topic ghar gayera solve garda feri confusing lagchha.",
    "Assignment ko deadline same week ma tin ota paryo.",
    "Group project ma meeting dherai bhayo, output chai ajhai ready chaina.",
    "Lab ma code chalena, viva ma chai tehi code explain garnu parchha.",
    "Attendance ko tension le class janu parchha, lecture chai record matra hunchha.",
    "Backlog clear garne plan banaye, regular subject ko preparation bigriyo.",
    "Exam ko result aayepachi matra kati stressed thiye bhanne feel bhayo.",
    "Roommate rati samma bolchha, mero exam preparation disturb hunchha.",
    "College ko fee tirna family le loan linu paryo bhanera guilt lagchha.",
    "Teacher ko explanation bujhina, class agadi sodhna confidence aayena.",
    "Presentation ko content ready chha, audience agadi bolne dar baki chha.",
    "Padhai ko schedule realistic banauna khojda aru ko routine copy garirako hunchhu.",
    "Semester break ma rest garne socheko, backlog ko list le relax garna diyena.",
    "Notes collect gare, tara afai concept bujhne time nikalina.",
    "Project ko idea ramro chha, implementation ko scope dherai thulo bhayo.",
    "Library ma basda focus ramro hunchha, hostel farkepachi distract hunchhu.",
    "Class test ko marks kam aayo, tara kun topic weak chha bujhna paye.",
    "Assignment ko format bujhina bhanera classmates ko copy herna paryo.",
    "Final year project ko team le meeting schedule garna nai sakena.",
    "Exam agadi nindra aaudaina, exam hall ma chai energy hudaina.",
    "Teacher le feedback dinubhayo, tara improve garne exact step clear bhayena.",
    "Practical file complete chha, tara experiment ko concept ajhai clear chaina.",
    "Sathi ko notes ramro chha, afno notes organize garna time lagchha.",
    "Online lecture pause gardai herda pani concentration maintain garna garo chha.",
    "College ko bus miss bhayo, first period ko attendance gayo.",
    "Group assignment ma contribution track garna nasakda conflict bhayo.",
    "Padhai ra part-time job balance garda weekend pani busy hunchha.",
    "Exam ko question paper expected bhanda different aayo, time manage garna garo bhayo.",
    "Semester ko suruma motivated thiye, midterm pachi energy ghatchha.",
    "Viva ma answer thaha thiyo, nervous bhayera explain garna sakina.",
    "Project report ko formatting milauda content revise garne time ghatchha.",
    "Classmates le internship paye, ma chai portfolio update gardai chhu.",
    "Scholarship ko criteria meet garna grades maintain garne pressure chha.",
    "Hostel ko khana man pardaina, tara bahira khada budget bigrinchha.",
    "Professor lai extension magnu parne thiyo, tara last moment samma wait gare.",
    "Exam ko preparation ma social life completely stop garda mood low bhayo.",
    "Code copy garera submit garnu bhanda bujhera banauna time lagchha.",
    "Research paper padhna thale, academic English le speed slow banayo.",
    "Class ma sabai le answer dinchhan jasto lagchha, tara dherai jana confused hunchhan.",
    "Padhai ko lagi phone side ma rakhe, laptop ma arko distraction khole.",
    "Final semester ma subjects bhanda job application ko tension badi chha.",
    "Project ko bug solve bhayena, tara presentation ko date najik aaisakyo.",
    "Lab partner absent bhayo, practical ko pura work eklaile garna paryo.",
    "Exam ko marks expected aayena, mistake review garna chai ajhai time chha.",
    "Teacher ko strictness le discipline sikayo, tara question sodhna dar pani badhyo.",
    "Class ko group chat ma notes bhanda exam rumors dherai aauchhan.",
    "Ek subject ma ramro marks aayo, arko subject ko failure le khusi ghataidiyo.",
    "Daily padhne habit banauna khojda first week pachi consistency harauchha.",
    "Assignment deadline extend bhayo, tara procrastination le feri last day samma purayo.",
    "Final year ma aayera school ko simple days miss hunchha.",
    "Exam hall ma aru chhito finish garda afno answer wrong hola jasto lagchha.",
    "Study partner sanga compare garna chhodepachi afno pace bujhna sajilo bhayo.",
    "College ko notice last moment ma aayo, travel plan cancel garnu paryo.",
    "Teacher le practical marks ko rubric clear gareko bhaye confusion kam hunthyo.",
    "Padhai ko stress ghar ma share garda aru tension dinchhu jasto lagchha.",
    "Assignment ma plagiarism check ko dar le citation sikna thalechhu.",
    "Project ko demo ko din internet slow bhayo, backup plan chahinchha bhanera sikhe.",
    "Ek raat ma pura syllabus sakne plan aba realistic lagdaina.",
    "Notes memorize gareko thiye, conceptual question aayepachi answer garna garo bhayo.",
    "Class ma absent bhayeko din ko material collect garna sabai busy thiyen.",
    "Exam ko bela health ra sleep ignore garda revision pani effective hudaina.",
    "Bachelor sakina lagyo, tara practical industry skill ajhai develop garnu chha.",
    "Padhai ko goal marks matra nabhai real skill pani hunu parchha.",
    "Group presentation ma mero part last minute change bhayo.",
    "College ko project ko lagi budget estimate nagarda personal paisa kharcha bhayo.",
    "Backlog ko result wait garda arko semester ko planning garna garo chha.",
    "Teacher le question sodhda answer thaha nabhaye pani class ma basiranchhu.",
    "Exam pachi answer compare garda unnecessary stress badhchha bhanera avoid garchhu.",
    "Padhai ko lagi peaceful room khojna hostel ma garo bhayo.",
    "Online resources dherai chhan, reliable source choose garna nai time lagchha.",
    "Practical skill sikna man chha, syllabus chai mostly theory focused chha.",
    "Class ko assignment ma group leader banna paryo, coordination nai main task bhayo.",
    "College ma attendance maintain gare, tara lecture bata maximum benefit lina sakina.",
    "Exam ko result mero expectation jasto aayena, aba study method change garchhu.",
    "Padhai ma help magna laj lagthyo, study group join garepachi confidence badhyo.",
  ],
};

const COMMENT_TEXTS = [
  "Same here, you are not alone.",
  "Ekdam relate gareँ yo kura.",
  "Stay strong, yo phase pani bitchha.",
  "Hami dherai jana yestai situation bata janchhau.",
  "Share garnubhayo, thank you.",
  "Rest lina nabirsa hai.",
  "Ma pani similar situation ma chhu.",
  "Ek din ek step garera agadi badha.",
  "Chiya khayera ali break liga 😄",
  "Afulai blame nagara hai.",
  "समयसँगै धेरै कुरा सहज हुँदै जान्छन्।",
  "तपाईं एक्लो हुनुहुन्न।",
  "Yesto experience le dherai kura sikauchha.",
  "Help magnu weakness hoina.",
  "Sahi kura, boundaries important chhan.",
  "Honestly, yo situation bujhna garo chha.",
  "Kathmandu ma yo common hola, tara sajilo chaina.",
  "Sending support 🫂",
  "Next time afno kura clear bhana hai.",
  "Aaja afulai ali time deu.",
];

function makeComments(
  postId: string,
  postCreatedMs: number,
  postAuthor: Author,
): CommentT[] {
  if (chance(0.25)) return [];

  const count = int(1, 4);
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

    list.push({
      id,
      author,
      content: post.content,
      tags: pickTags(post.cluster),
      semanticCluster: post.cluster,
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
