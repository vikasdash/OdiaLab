import { Course, QuizQuestion, StudentProfile, StudyPlannerItem } from "./types";

export const SAMPLE_COURSES: Course[] = [
  {
    id: "ossc-peer-room",
    title: "OSSC CGL 1-on-1 Peer Match Board",
    category: "OSSC Exams",
    price: "Cooperative / Peer Free",
    rating: 4.8,
    description: "Connect instantly with a study partner preparation peer. Test each other on General Awareness, Odia grammar, and computer files. Best for 1-to-1 peer discussion.",
    lessonsCount: 12,
    studentsCount: 310,
    thumbnail: "👥",
    isLive: true,
    syllabus: [
      "Select an active peer partner matching filter below",
      "Draft mutual study questions with real-time feedback",
      "Peer review each other on quantitative aptitude speed hacks",
      "Practice Odia Grammar and Sandhi shortcuts together",
      "Simulate a 1-to-1 verbal quiz challenge to beat exam stress"
    ]
  },
  {
    id: "opsc-peer-room",
    title: "OPSC OAS GS Paper 1-on-1 Pair Lounge",
    category: "OPSC Civil Services",
    price: "Cooperative / Peer Free",
    rating: 4.9,
    description: "A private 1-on-1 matching study space for civil service aspirants. Share notes, brainstorm mains writing questions, and review state GK landmarks with standard verified peers.",
    lessonsCount: 8,
    studentsCount: 145,
    thumbnail: "🏛️",
    isLive: true,
    syllabus: [
      "Request 1-on-1 companion feedback on history and culture of Odisha",
      "Share and analyze handwritten answer scripts using interactive whiteboards",
      "Schedule private peer mentorship slots on Indian Polity concepts",
      "Identify high-yield Odisha government scheme answers together"
    ]
  },
  {
    id: "teaching-peer-room",
    title: "O-TET & CTET Mock Teaching Workspace",
    category: "Teaching Exams",
    price: "Cooperative / Peer Free",
    rating: 4.7,
    description: "Exchange roles in peer-led teacher feedback sessions. One performs mock teaching on child psychology, while the other reviews 1-to-1 based on standard CTET guidelines.",
    lessonsCount: 6,
    studentsCount: 180,
    thumbnail: "🍎",
    isLive: false,
    syllabus: [
      "Simulate live 1-to-1 teaching presentation rounds",
      "Assess child development and pedagogy definitions",
      "Review native language teaching blueprints together",
      "Examine previous teaching exams paper structures with study buddy"
    ]
  },
  {
    id: "english-peer-room",
    title: "Spoken English Conversation Practice Hub",
    category: "Spoken English",
    price: "Cooperative / Peer Free",
    rating: 4.8,
    description: "Shake off fear of speaking English through supportive peer interaction. Join an active peer for a friendly 1-on-1 conversation on daily social topics. Zero judgment.",
    lessonsCount: 15,
    studentsCount: 520,
    thumbnail: "💬",
    isLive: true,
    syllabus: [
      "Select a conversational dialogue topic of choice",
      "Practice breaking hesitation via alternating talk turns",
      "Highlight common translative mistakes from native Odia dynamically",
      "Complete mock 1-on-1 professional interviews in a friendly sandbox"
    ]
  }
];

export const MOCK_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "Which Dynasty was responsible for the construction of the famous Sun Temple of Konark?",
    options: [
      "Eastern Ganga Dynasty",
      "Suryavamsi Gajapati Dynasty",
      "Somavamshi Dynasty",
      "Bhauma-Kara Dynasty"
    ],
    correctOption: 0,
    explanation: "The Sun Temple of Konark was constructed in the 13th century (around 1250 CE) by the famous King Narasimhadeva I of the Eastern Ganga Dynasty. It is a UNESCO World Heritage Site resembling a massive chariot.",
    category: "Odisha GK & Culture"
  },
  {
    id: "q2",
    question: "ଓଡ଼ିଆ ବ୍ୟାକରଣରେ 'କେତୋଟି' ସ୍ଵରବର୍ଣ୍ଣ ପ୍ରଚଳିତ ଅଛି?",
    options: [
      "୮ (8)",
      "୧୧ (11)",
      "୧୩ (13)",
      "୧୫ (15)"
    ],
    correctOption: 1,
    explanation: "ଓଡ଼ିଆ ବର୍ଣ୍ଣମାଳାରେ ୧୧ ଟି ପ୍ରଚଳିତ ସ୍ୱରବର୍ଣ୍ଣ ରହିଛି (ଅ, ଆ, ଇ, ଈ, ଉ, ଊ, ଋ, ଏ, ଐ, ଓ, ଔ)। consonants କୁ ବ୍ୟଞ୍ଜନ ବର୍ଣ୍ଣ କୁହାଯାଏ (ଶରୀର ଅନ୍ତର୍ଗତ ୩୯ ଟି)।",
    category: "Odia Grammar (ଓଡ଼ିଆ)"
  },
  {
    id: "q3",
    question: "In which year did the famous Na'Anka Durbhiksha (Great Famine) occur in Odisha?",
    options: [
      "1857",
      "1866",
      "1872",
      "1899"
    ],
    correctOption: 1,
    explanation: "The devastating Na'Anka Durbhiksha occurred in 1865-1866 in Odisha, resulting in the loss of about one-third of the population due to drought and gross administration failure by the East India authorities.",
    category: "Odisha GK & Culture"
  },
  {
    id: "q4",
    question: "Which database management security protocol is fully used in HTTPS to protect the transaction records?",
    options: [
      "NTP",
      "TLS/SSL",
      "SMTP",
      "ICMP"
    ],
    correctOption: 1,
    explanation: "TLS (Transport Layer Security) and its predecessor SSL are cryptographic protocols designed to provide private, authenticated communications over HTTPS.",
    category: "Computer Awareness"
  },
  {
    id: "q5",
    question: "A train running at 54 km/hr crosses a telephone pole in 10 seconds. What is the length of the train in meters?",
    options: [
      "120 m",
      "135 m",
      "150 m",
      "180 m"
    ],
    correctOption: 2,
    explanation: "Convert speed: 54 * (5/18) = 15 m/s. Formula of length: Speed * Time = 15 m/s * 10 seconds = 150 meters.",
    category: "Quantitative Aptitude"
  },
  {
    id: "q6",
    question: "ଓଡ଼ିଶାର ସର୍ବବୃହତ ହ୍ରଦ 'ଚିଲିକା' କେଉଁ ପ୍ରକାରର ହ୍ରଦ ଅଟେ?",
    options: [
      "ମଧୁରଜଳ ହ୍ରଦ (Freshwater)",
      "ଲବଣାକ୍ତ ଲୁଣିଜଳ ହ୍ରଦ (Brackish Saltwater Lagoon)",
      "କୃତ୍ରିମ ଜଳାଶୟ (Artificial)",
      "ଗ୍ରାସିୟର ହ୍ରଦ (Glacial)"
    ],
    correctOption: 1,
    explanation: "ଚିଲିକା ହେଉଛି ଭାରତର ସର୍ବବୃହତ ଏବଂ ବିଶ୍ୱର ଦ୍ୱିତୀୟ ବୃହତ୍ତମ ବ୍ରାକିସକୋଲ (ଲୁଣିଆ ପାଣି ହ୍ରଦ) Lagoon, ଯାହା ପ୍ରଦେଶର ଉପକୂଳ ଜିଲ୍ଲା ପୁରୀ, ଖୋର୍ଦ୍ଧା ଏବଂ ଗଞ୍ଜାମରେ ବ୍ୟାପିଛି।",
    category: "Odisha GK & Culture"
  }
];

export const INITIAL_PROFILE: StudentProfile = {
  name: "Guest",
  email: "guest@odialab.com",
  goal: "OPSC Civil Services (OAS) & OSSC Exam Preparation",
  streak: 5,
  studyMinutes: 420,
  joinDate: "May 2026",
  savedNotes: [
    "✅ Odisha has 30 districts divided across 3 Revenue Divisions (North, South, Central).",
    "✅ Swara Varna in Odia Grammar contains 11 vowels.",
    "✅ Gopinath Mohanty won the first Jnanpith Award in Odia, for his legendary novel 'Mati Matal' in 1973."
  ],
  solvedCount: 12
};

export const INITIAL_PLANNER: StudyPlannerItem[] = [
  { id: "p1", title: "Attempt Daily 5-MCQ Quiz", time: "08:30 AM", completed: true },
  { id: "p2", title: "Read swara varna notes in bookmarks", time: "11:00 AM", completed: false },
  { id: "p3", title: "Study OPSC History video lecture", time: "03:00 PM", completed: false },
  { id: "p4", title: "Ask OdiaLab Guru about 'Samas rules'", time: "07:30 PM", completed: false }
];
