export interface DayEntry {
  slug: string;
  date: string;
  dayOfWeek: string;
  founderScore: number;
  hours: number;
  impact: number;
  tasksCompleted: number;
  preview: string;
  tags: string[];
  tasks: { id: string; name: string; completed: boolean }[];
  gistBullets: string[];
  reflection: string;
  sections: {
    category: string;
    title: string;
    hours: number;
    content: string[];
    taskRefs: string[];
    nextSteps?: string[];
  }[];
  selfAssessment: {
    difficulty: number;
    wentWell: string;
    improve: string;
    tomorrow: string;
  };
}

export const entries: DayEntry[] = [
  {
    slug: "april-7",
    date: "Monday, April 7",
    dayOfWeek: "Monday",
    founderScore: 72,
    hours: 6.5,
    impact: 7,
    tasksCompleted: 5,
    preview: "Finished v2 skeleton model, fixed ESP32 display bug, GTM strategy session",
    tags: ["hardware", "firmware", "business", "CAD"],
    tasks: [
      { id: "PILL-247", name: "Fix IR sensor alignment", completed: true },
      { id: "PILL-312", name: "Update conveyor motor driver", completed: true },
      { id: "PILL-298", name: "V2 skeleton housing model", completed: true },
      { id: "PILL-315", name: "ESP32 display rendering fix", completed: true },
      { id: "PILL-320", name: "GTM timeline draft", completed: true },
    ],
    gistBullets: [
      "Made major progress on the PillPod housing — the v2 skeleton model is done",
      "Tracked down and fixed a display bug that's been bugging me for days",
      "Had a solid strategy session about go-to-market timing",
      "Met up with Jake for coffee — good to catch up",
    ],
    reflection: "Today felt productive. The hardware side is finally clicking into place, and I'm feeling more confident about the timeline. The display bug was one of those satisfying fixes where everything just clicks once you find the root cause.",
    sections: [
      {
        category: "Hardware",
        title: "Housing & Assembly",
        hours: 2.5,
        content: [
          "Spent the morning finishing the v2 skeleton model in Fusion 360. The main challenge was getting the snap-fit tolerances right for the pill compartment doors — previous iterations were either too loose or required too much force to open.",
          "Ran two test prints on the Bambu X1C with PLA+ to validate the fit. First print had slight warping on the hinge tabs, so I adjusted the cooling fan speed and got a clean second print. The snap-fit now has a satisfying click.",
          "Also revisited the IR sensor mounting bracket. The alignment was off by about 2mm which was causing intermittent detection failures. Designed a new adjustable mount with a set screw for fine-tuning.",
        ],
        taskRefs: ["PILL-247", "PILL-298"],
        nextSteps: ["Print final v2 housing with ABS for durability testing", "Test snap-fit with 500 open/close cycles"],
      },
      {
        category: "Software",
        title: "Firmware & Display",
        hours: 2.0,
        content: [
          "Finally tracked down the display rendering bug on the ESP32. Turns out the SPI bus was getting overwhelmed when both the display and the SD card were active simultaneously. The fix was implementing a simple mutex for SPI access.",
          "Updated the conveyor motor driver to use acceleration ramps instead of instant speed changes. This should reduce mechanical stress and make the pill dispensing smoother. Still need to tune the acceleration curve parameters.",
        ],
        taskRefs: ["PILL-312", "PILL-315"],
        nextSteps: ["Tune acceleration curves with real pill weights", "Add error recovery for SPI timeout"],
      },
      {
        category: "Business",
        title: "Go-to-Market Strategy",
        hours: 1.5,
        content: [
          "Had a productive call with Sarah about GTM timing. We agreed that launching with a limited beta to 50 users makes more sense than a broad launch. The key insight was that our target demographic (elderly care facilities) requires a much longer sales cycle than D2C.",
          "Started drafting the investor deck for the seed round. Need to nail the TAM/SAM/SOM slides — the elder care market data is surprisingly fragmented.",
        ],
        taskRefs: ["PILL-320"],
      },
      {
        category: "Personal",
        title: "Life",
        hours: 0.5,
        content: [
          "Caught up with Jake over coffee at Ritual. He's been working on some interesting ML stuff at his new gig. Good to step away from the grind for an hour and get some perspective.",
        ],
        taskRefs: [],
      },
    ],
    selfAssessment: {
      difficulty: 7,
      wentWell: "Hardware assembly flow",
      improve: "Start earlier, less context switching",
      tomorrow: "Finish conveyor tests, prep investor deck",
    },
  },
  {
    slug: "april-6",
    date: "Sunday, April 6",
    dayOfWeek: "Sunday",
    founderScore: 45,
    hours: 3.5,
    impact: 5,
    tasksCompleted: 2,
    preview: "Light day — research on battery options, some CAD cleanup",
    tags: ["research", "CAD", "hardware"],
    tasks: [
      { id: "PILL-290", name: "Battery cell comparison research", completed: true },
      { id: "PILL-291", name: "Clean up housing CAD assembly", completed: true },
    ],
    gistBullets: [
      "Spent the morning researching battery options for the portable version",
      "Cleaned up the CAD assembly — organized components into proper sub-assemblies",
    ],
    reflection: "Intentionally lighter day. Needed the rest after a heavy week. The battery research was actually quite useful — found a promising LiFePO4 option.",
    sections: [
      {
        category: "Hardware",
        title: "Battery Research",
        hours: 2.0,
        content: [
          "Deep dive into battery chemistry options for the portable PillPod. Compared LiPo, Li-ion 18650, and LiFePO4 cells across safety, cycle life, and energy density. LiFePO4 is looking like the winner for safety reasons — critical for a medical-adjacent device.",
        ],
        taskRefs: ["PILL-290"],
      },
      {
        category: "Hardware",
        title: "CAD Organization",
        hours: 1.5,
        content: [
          "The Fusion 360 project was getting messy. Spent time organizing components into logical sub-assemblies: dispensing mechanism, electronics bay, housing shell, and user interface panel.",
        ],
        taskRefs: ["PILL-291"],
      },
    ],
    selfAssessment: {
      difficulty: 4,
      wentWell: "Quality research time",
      improve: "Could have done more",
      tomorrow: "Get back to firmware work",
    },
  },
  {
    slug: "april-5",
    date: "Saturday, April 5",
    dayOfWeek: "Saturday",
    founderScore: 88,
    hours: 9.5,
    impact: 9,
    tasksCompleted: 7,
    preview: "Beast mode — conveyor mechanism working, first successful end-to-end dispense",
    tags: ["hardware", "firmware", "3d-printing", "design"],
    tasks: [
      { id: "PILL-280", name: "Conveyor belt tensioning system", completed: true },
      { id: "PILL-281", name: "Pill detection calibration", completed: true },
      { id: "PILL-282", name: "End-to-end dispense test", completed: true },
      { id: "PILL-283", name: "Print replacement gear set", completed: true },
      { id: "PILL-284", name: "Update firmware state machine", completed: true },
      { id: "PILL-285", name: "Add dispense confirmation LED", completed: true },
      { id: "PILL-286", name: "Document test results", completed: true },
    ],
    gistBullets: [
      "FIRST SUCCESSFUL END-TO-END PILL DISPENSE 🎉",
      "Got the conveyor belt tensioning dialed in after three iterations",
      "Pill detection is now 98% accurate across all tested capsule sizes",
      "Printed a replacement gear set with tighter tolerances",
      "Updated the firmware state machine for the full dispense cycle",
      "Went for a sunset run to celebrate — best runner's high in months",
    ],
    reflection: "This is the day I've been working toward for months. Seeing a pill go from hopper to dispense cup through the full automated cycle was incredible. There are still rough edges, but the core mechanism works. I actually teared up a little.",
    sections: [
      {
        category: "Hardware",
        title: "Conveyor & Mechanism",
        hours: 5.0,
        content: [
          "The big breakthrough today. After three iterations on the belt tensioning system, I found the right spring constant that keeps consistent tension without binding. The key was using a pivoting idler pulley instead of a fixed adjustment slot.",
          "Reprinted the main drive gears with 0.1mm tighter tolerances. The previous set had enough backlash to cause position errors after 10+ dispense cycles. New gears are running smooth.",
          "The full conveyor assembly is now reliable enough for demo purposes. Belt tracks straight, tension stays consistent, and the pill cups align perfectly with the dispense chute. I filmed a slow-motion video of a full cycle — it looks genuinely impressive.",
          "One concern: the belt material (TPU) might degrade with repeated sanitization. Need to research medical-grade belt materials or look into a PTFE coating option. Added this to the materials research backlog.",
        ],
        taskRefs: ["PILL-280", "PILL-283"],
        nextSteps: ["Source medical-grade conveyor belt material", "Run 1000-cycle endurance test", "Film demo video for investor deck"],
      },
      {
        category: "Software",
        title: "Firmware State Machine",
        hours: 3.0,
        content: [
          "Rewrote the dispense state machine to handle the full cycle: IDLE → LOADING → SENSING → DISPENSING → CONFIRMING → IDLE. Each state has timeout guards and error recovery paths.",
          "Added a confirmation LED sequence that flashes green on successful dispense and red on any error. Simple but effective user feedback. Also added a buzzer pattern — two short beeps for success, one long for error.",
          "The error recovery is the part I'm most proud of. If a pill gets jammed mid-dispense, the system reverses the belt, retries twice, and if it still fails, alerts the user with a specific error code. No silent failures.",
          "Also implemented a basic logging system that writes dispense events to the SD card with timestamps. This will be invaluable for the beta testing phase — we can analyze dispense patterns and failure modes remotely.",
        ],
        taskRefs: ["PILL-284", "PILL-285"],
        nextSteps: ["Add WiFi-based log upload to cloud dashboard", "Implement low-pill-count warning threshold"],
      },
      {
        category: "Hardware",
        title: "Testing & Calibration",
        hours: 1.5,
        content: [
          "Ran 50 dispense cycles with various pill sizes. Detection accuracy: 98% for standard capsules, 95% for smaller tablets. The IR sensor occasionally has trouble with translucent gel caps — may need to add an additional optical sensor.",
          "Documented every test run in a spreadsheet with photos. Created a test matrix covering 8 different pill form factors (capsule, tablet, gel cap, oval, round, scored, coated, extended-release). The round tablets had the highest success rate at 99.2%.",
          "Identified two edge cases: very small pills (< 4mm diameter) sometimes slip through the detection zone, and oblong capsules occasionally orient sideways in the dispensing cup. Both are solvable with mechanical guides.",
        ],
        taskRefs: ["PILL-281", "PILL-282", "PILL-286"],
        nextSteps: ["Design pill orientation guide for the dispensing cup", "Add secondary detection sensor for small pills"],
      },
      {
        category: "Design",
        title: "Industrial Design Exploration",
        hours: 0.5,
        content: [
          "Spent some time sketching form factor ideas for the consumer version. The current prototype is all function, but the production unit needs to look like it belongs on a kitchen counter, not in a lab.",
          "Inspiration board: Braun appliances, Muji electronics, the Ember mug. Clean lines, neutral colors, a single accent LED. No visible screws. The goal is something your grandma would feel comfortable using but that still impresses a tech-savvy caregiver.",
        ],
        taskRefs: [],
      },
    ],
    selfAssessment: {
      difficulty: 9,
      wentWell: "Persistence on the belt tensioning",
      improve: "Take more breaks during marathon sessions",
      tomorrow: "Rest day, then focus on reliability",
    },
  },
  {
    slug: "april-4",
    date: "Friday, April 4",
    dayOfWeek: "Friday",
    founderScore: 61,
    hours: 5.0,
    impact: 6,
    tasksCompleted: 3,
    preview: "Investor prep, PCB layout revisions, ordered new stepper motors",
    tags: ["business", "hardware", "design"],
    tasks: [
      { id: "PILL-270", name: "Investor deck outline", completed: true },
      { id: "PILL-271", name: "PCB layout rev 3", completed: true },
      { id: "PILL-272", name: "Order NEMA 17 steppers", completed: true },
    ],
    gistBullets: [
      "Outlined the investor deck — 12 slides targeting a $1.5M seed round",
      "Revised the PCB layout to accommodate the new motor drivers",
      "Ordered NEMA 17 stepper motors from DigiKey — should arrive Tuesday",
    ],
    reflection: "Mixed day. The investor stuff always feels like a different mode than building, but it's necessary. PCB layout is getting cleaner with each revision.",
    sections: [
      {
        category: "Business",
        title: "Fundraising Prep",
        hours: 2.5,
        content: [
          "Created the outline for our seed deck. Targeting $1.5M at a $6M post-money. Key slides: problem/solution, market size, product demo, traction (pilot agreements), team, and use of funds.",
        ],
        taskRefs: ["PILL-270"],
      },
      {
        category: "Hardware",
        title: "PCB & Components",
        hours: 2.5,
        content: [
          "Third revision of the main control PCB in KiCad. Moved the motor driver ICs closer to the edge connectors to shorten trace lengths. Also added proper decoupling caps that were missing in rev 2.",
        ],
        taskRefs: ["PILL-271", "PILL-272"],
      },
    ],
    selfAssessment: {
      difficulty: 5,
      wentWell: "PCB layout efficiency",
      improve: "Less procrastinating on the deck",
      tomorrow: "Beast mode on conveyor mechanism",
    },
  },
  {
    slug: "april-3",
    date: "Thursday, April 3",
    dayOfWeek: "Thursday",
    founderScore: 78,
    hours: 7.5,
    impact: 8,
    tasksCompleted: 4,
    preview: "New pill sorting algorithm working, cleaned up API endpoints",
    tags: ["software", "firmware", "research"],
    tasks: [
      { id: "PILL-260", name: "Pill sorting algorithm v2", completed: true },
      { id: "PILL-261", name: "REST API cleanup", completed: true },
      { id: "PILL-262", name: "Add OTA update support", completed: true },
      { id: "PILL-263", name: "Research FDA 510(k) requirements", completed: true },
    ],
    gistBullets: [
      "New sorting algorithm handles mixed pill sizes much better",
      "Cleaned up the REST API — proper error codes and documentation",
      "Added over-the-air firmware update capability",
      "Started researching FDA 510(k) pathway — it's a maze",
    ],
    reflection: "Good software day. The OTA update feature is going to save so much time during beta testing. FDA research is daunting but necessary to understand early.",
    sections: [],
    selfAssessment: {
      difficulty: 7,
      wentWell: "Algorithm design flow state",
      improve: "Document as I go instead of at the end",
      tomorrow: "Hardware focus — investor prep",
    },
  },
  {
    slug: "april-2",
    date: "Wednesday, April 2",
    dayOfWeek: "Wednesday",
    founderScore: 55,
    hours: 4.5,
    impact: 5,
    tasksCompleted: 3,
    preview: "3D printing iterations, mentor call with Dave, BOM cost analysis",
    tags: ["3d-printing", "business", "hardware"],
    tasks: [
      { id: "PILL-250", name: "Print housing test batch", completed: true },
      { id: "PILL-251", name: "Mentor call notes", completed: true },
      { id: "PILL-252", name: "BOM cost spreadsheet", completed: true },
    ],
    gistBullets: [
      "Printed three housing variants to test wall thickness",
      "Great call with Dave — he suggested pivoting to B2B first",
      "Built out the BOM cost spreadsheet — current unit cost is $47",
    ],
    reflection: "Dave's advice about B2B first is making me rethink our strategy. The unit economics work better with bulk orders to care facilities.",
    sections: [],
    selfAssessment: {
      difficulty: 5,
      wentWell: "Mentor relationship",
      improve: "More focused morning block",
      tomorrow: "Deep software day",
    },
  },
  {
    slug: "april-1",
    date: "Tuesday, April 1",
    dayOfWeek: "Tuesday",
    founderScore: 68,
    hours: 6.0,
    impact: 7,
    tasksCompleted: 4,
    preview: "User testing session, firmware refactor, started new PCB design",
    tags: ["software", "hardware", "design", "research"],
    tasks: [
      { id: "PILL-240", name: "User testing session #3", completed: true },
      { id: "PILL-241", name: "Firmware module refactor", completed: true },
      { id: "PILL-242", name: "Start PCB rev 3 design", completed: true },
      { id: "PILL-243", name: "Compile user feedback report", completed: true },
    ],
    gistBullets: [
      "Third user testing session — really valuable feedback on the interface",
      "Refactored firmware into cleaner modules for testability",
      "Started PCB revision 3 with better power regulation",
      "Users consistently confused by the refill indicator — needs redesign",
    ],
    reflection: "User testing always humbles you. Things that feel obvious when you build them are not obvious to users. The refill indicator needs a complete rethink.",
    sections: [],
    selfAssessment: {
      difficulty: 6,
      wentWell: "Listening to user feedback",
      improve: "Record testing sessions next time",
      tomorrow: "3D printing day",
    },
  },
  {
    slug: "march-31",
    date: "Monday, March 31",
    dayOfWeek: "Monday",
    founderScore: 25,
    hours: 2.0,
    impact: 3,
    tasksCompleted: 1,
    preview: "Sick day — only managed some light research reading",
    tags: ["research"],
    tasks: [
      { id: "PILL-235", name: "Read competitor analysis report", completed: true },
    ],
    gistBullets: [
      "Not feeling great — took it easy",
      "Read through the competitor analysis report Sarah put together",
    ],
    reflection: "Sometimes you just need to rest. Body was telling me to slow down after last week's push.",
    sections: [],
    selfAssessment: {
      difficulty: 2,
      wentWell: "Listening to my body",
      improve: "Prevention — better sleep schedule",
      tomorrow: "Back at it if feeling better",
    },
  },
];

export const ideas = [
  { id: 1, text: "Add voice control via Alexa/Google Home for dispensing", date: "April 7", isPublic: true, tags: ["software", "UX"] },
  { id: 2, text: "Explore biodegradable pill cups instead of plastic", date: "April 7", isPublic: true, tags: ["hardware", "sustainability"] },
  { id: 3, text: "Partner with CVS/Walgreens for refill integration", date: "April 6", isPublic: false, tags: ["business"] },
  { id: 4, text: "Use computer vision to identify pill types for verification", date: "April 6", isPublic: true, tags: ["software", "ML"] },
  { id: 5, text: "Monthly subscription model vs one-time purchase", date: "April 5", isPublic: false, tags: ["business"] },
  { id: 6, text: "Add temperature monitoring for heat-sensitive medications", date: "April 5", isPublic: true, tags: ["hardware"] },
  { id: 7, text: "Gamification for medication adherence — streak rewards", date: "April 4", isPublic: true, tags: ["software", "UX"] },
  { id: 8, text: "Emergency contact notification if doses are missed", date: "April 4", isPublic: true, tags: ["software"] },
  { id: 9, text: "Modular design — stackable dispensing units for more meds", date: "April 3", isPublic: true, tags: ["hardware", "design"] },
  { id: 10, text: "Look into Y Combinator W25 batch — deadline coming up", date: "April 3", isPublic: false, tags: ["business"] },
  { id: 11, text: "White-label version for pharmacy chains", date: "April 2", isPublic: false, tags: ["business"] },
  { id: 12, text: "Add NFC tap for quick dispense override", date: "April 2", isPublic: true, tags: ["hardware", "UX"] },
  { id: 13, text: "Solar charging option for the portable version", date: "April 1", isPublic: true, tags: ["hardware"] },
  { id: 14, text: "Integrate with Apple Health / Google Fit for tracking", date: "April 1", isPublic: true, tags: ["software"] },
  { id: 15, text: "Pill splitter attachment for half-dose requirements", date: "March 31", isPublic: true, tags: ["hardware", "design"] },
  { id: 16, text: "Build a Shopify store for D2C pre-orders", date: "March 31", isPublic: false, tags: ["business"] },
  { id: 17, text: "Use magnetometer for metal pill detection as backup sensor", date: "March 31", isPublic: true, tags: ["hardware", "research"] },
];

export function generateHeatmapData(): { date: string; score: number }[] {
  const data: { date: string; score: number }[] = [];
  const today = new Date(2025, 3, 7); // April 7, 2025
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    // More activity in recent months
    const recency = 1 - i / 364;
    const rand = Math.random();
    let score = 0;
    if (rand < 0.15) score = 0; // empty
    else if (rand < 0.35) score = Math.floor(recency * 25 + Math.random() * 20);
    else if (rand < 0.65) score = Math.floor(recency * 40 + Math.random() * 30);
    else if (rand < 0.85) score = Math.floor(recency * 55 + Math.random() * 25);
    else score = Math.floor(recency * 70 + Math.random() * 20);
    data.push({ date: dateStr, score: Math.min(score, 100) });
  }
  return data;
}

export function generateTrendData(): { day: number; score: number }[] {
  const scores = [52, 48, 61, 55, 70, 63, 45, 38, 72, 68, 75, 58, 62, 80, 77, 65, 42, 55, 68, 73, 82, 71, 60, 55, 25, 68, 78, 61, 88, 45, 72];
  return scores.map((score, i) => ({ day: i + 1, score }));
}
