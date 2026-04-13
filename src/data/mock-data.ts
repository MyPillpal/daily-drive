import type { Post, PostSection, PostSelfAssessment, PostScoreBreakdown, PostTask } from "@/hooks/use-posts";
import type { DailyStat } from "@/hooks/use-daily-stats";
import type { Idea } from "@/hooks/use-ideas";

// ─── Posts ────────────────────────────────────────────────────

const makeTasks = (items: [string, string][]): PostTask[] =>
  items.map(([ext, name], i) => ({
    id: `task-${ext}-${i}`,
    externalId: ext,
    name,
    completed: true,
  }));

export const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    dateRaw: "2025-04-07",
    date: "Monday, April 7",
    dayOfWeek: "Monday",
    founderScore: 72,
    hours: 6.5,
    impact: 7,
    tasksCompleted: 5,
    preview: "Finished v2 skeleton model, fixed ESP32 display bug, strategy session on go-to-market",
    tags: ["hardware", "firmware", "business", "CAD"],
    tasks: makeTasks([
      ["PILL-247", "Fix IR sensor alignment"],
      ["PILL-312", "Update conveyor motor driver"],
      ["PILL-289", "ESP32 display bug fix"],
      ["PILL-301", "v2 housing skeleton model"],
      ["PILL-315", "GTM strategy doc draft"],
    ]),
    gistBullets: [
      "Made major progress on the PillPod housing — the v2 skeleton model is done",
      "Tracked down and fixed a display bug that's been bugging me for days",
      "Had a solid strategy session about go-to-market timing",
      "Met up with Jake for coffee — good to catch up",
    ],
    reflection: "Today felt productive. The hardware side is finally clicking into place, and I'm feeling more confident about the timeline.",
    sections: [
      {
        category: "Hardware",
        title: "Housing v2 skeleton model",
        hours: 2.5,
        content: [
          "Spent the morning in Fusion360 finalizing the v2 skeleton model for the PillPod housing. The main challenge was getting the snap-fit tolerances right for the battery compartment door.",
          "Printed a test piece on the Bambu X1C and the fit is much better than v1. Still need to adjust the wall thickness near the USB-C port — it's a bit too thin at 1.2mm.",
        ],
        taskRefs: ["PILL-301", "PILL-247"],
        nextSteps: ["Print full housing test piece tomorrow", "Verify IR sensor window alignment"],
      },
      {
        category: "Software",
        title: "ESP32 display bug fix",
        hours: 1.5,
        content: [
          "Finally tracked down the display rendering bug. Turned out to be a race condition in the SPI initialization — the display controller was receiving commands before the bus was ready.",
          "Added a 50ms delay after SPI init and the flickering is completely gone. Also cleaned up the display buffer management while I was in there.",
        ],
        taskRefs: ["PILL-289"],
        nextSteps: ["Run overnight stability test"],
      },
      {
        category: "Business",
        title: "GTM strategy session",
        hours: 1.5,
        content: [
          "Sat down with the whiteboard and mapped out three potential go-to-market approaches. Direct-to-consumer through our own site seems most viable for the first 1000 units.",
          "Need to figure out the regulatory pathway — FDA Class I vs Class II could change the timeline by 6+ months.",
        ],
        taskRefs: ["PILL-315"],
        nextSteps: ["Research FDA classification for similar devices", "Draft landing page copy"],
      },
      {
        category: "Personal",
        title: "Coffee with Jake",
        hours: 1,
        content: [
          "Caught up with Jake over coffee. He's been through the hardware startup grind before and had some great advice about finding contract manufacturers. Might intro me to his contact in Shenzhen.",
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
    scoreBreakdown: { tasks: 80, hours: 65, notes: 70, variety: 60, photos: 50 },
    status: "published",
  },
  {
    id: "p2",
    dateRaw: "2025-04-06",
    date: "Sunday, April 6",
    dayOfWeek: "Sunday",
    founderScore: 45,
    hours: 3,
    impact: 4,
    tasksCompleted: 2,
    preview: "Light research day — read papers on pill dispensing mechanisms, sketched conveyor ideas",
    tags: ["research", "design"],
    tasks: makeTasks([
      ["PILL-310", "Research dispensing mechanisms"],
      ["PILL-311", "Sketch conveyor concepts"],
    ]),
    gistBullets: [
      "Read two papers on automated pill dispensing mechanisms",
      "Sketched three new conveyor belt concepts",
      "Relaxed afternoon with family",
    ],
    reflection: "Lighter day but the research will pay off. Sometimes you need to step back and think.",
    sections: [
      {
        category: "Hardware",
        title: "Conveyor concept sketches",
        hours: 1.5,
        content: ["Explored three different conveyor belt concepts — a flat belt, a bucket elevator style, and a vibratory feeder. The vibratory approach might work best for varied pill sizes."],
        taskRefs: ["PILL-311"],
      },
      {
        category: "Hardware",
        title: "Dispensing mechanism research",
        hours: 1.5,
        content: ["Read papers from IEEE on automated pharmaceutical dispensing. Found a promising approach using a rotary drum with calibrated pockets."],
        taskRefs: ["PILL-310"],
      },
    ],
    selfAssessment: { difficulty: 3, wentWell: "Good focused reading", improve: "Could have sketched more", tomorrow: "Start CAD on conveyor" },
    scoreBreakdown: { tasks: 40, hours: 30, notes: 50, variety: 30, photos: 20 },
    status: "published",
  },
  {
    id: "p3",
    dateRaw: "2025-04-05",
    date: "Saturday, April 5",
    dayOfWeek: "Saturday",
    founderScore: 88,
    hours: 9.5,
    impact: 9,
    tasksCompleted: 8,
    preview: "Beast mode — conveyor prototype working, sensor calibration done, investor deck v1 complete",
    tags: ["hardware", "firmware", "3d-printing", "business", "CAD", "design"],
    tasks: makeTasks([
      ["PILL-280", "Conveyor prototype assembly"],
      ["PILL-281", "Motor driver firmware"],
      ["PILL-282", "IR sensor calibration"],
      ["PILL-283", "Pill detection algorithm v1"],
      ["PILL-284", "Print conveyor housing parts"],
      ["PILL-285", "Investor deck v1"],
      ["PILL-286", "Financial projections spreadsheet"],
      ["PILL-287", "Demo video recording"],
    ]),
    gistBullets: [
      "Built and tested the first working conveyor prototype — pills are moving!",
      "Calibrated all 4 IR sensors and the detection rate is at 97%",
      "Finished the investor deck v1 and recorded a 2-minute demo video",
      "Cranked out financial projections for the next 18 months",
      "Went for a late-night run to decompress — needed it after a 9.5 hr day",
    ],
    reflection: "This was one of those days where everything clicks. The conveyor working was a huge milestone — first time we've had pills physically moving through the system. The investor deck came together faster than expected too. Feeling exhausted but incredibly motivated.",
    sections: [
      {
        category: "Hardware",
        title: "Conveyor prototype build & test",
        hours: 3.5,
        content: [
          "Today was the day. Assembled the full conveyor prototype from the parts I printed yesterday. The belt tensioning system needed some on-the-fly adjustments — ended up using a spring-loaded idler pulley instead of the fixed one in the CAD model.",
          "First test run was rough — pills were falling off at the transition point. Added 2mm guide rails and that solved it completely. Second test run: 50 pills, 49 made it through. The one failure was a gel cap that was slightly oversized.",
          "The motor runs quieter than expected at 12V. Current draw is about 200mA under load which is well within our power budget. This is a huge milestone — first time we've had pills physically moving through the system.",
        ],
        taskRefs: ["PILL-280", "PILL-284"],
        nextSteps: ["Test with full range of pill sizes (5mm to 22mm)", "Run 500-pill endurance test", "Measure belt wear after extended operation"],
      },
      {
        category: "Software",
        title: "Motor driver firmware & sensor calibration",
        hours: 2.5,
        content: [
          "Wrote the motor driver firmware in C++ for the ESP32. Using PWM at 25kHz to keep the motor whisper-quiet. Implemented acceleration ramping so pills don't get launched off the belt at startup.",
          "Calibrated all 4 IR sensors using the oscilloscope. Had to adjust the threshold values for each sensor individually — the ambient light conditions at each position along the conveyor are different. Final detection rate: 97% across 200 test pills.",
          "The pill detection algorithm uses a simple peak detection with hysteresis. When a pill passes between the IR emitter and detector, the signal drops below the threshold. Added a 10ms debounce to prevent double-counting from pill wobble.",
        ],
        taskRefs: ["PILL-281", "PILL-282", "PILL-283"],
        nextSteps: ["Implement pill size estimation from signal width", "Add error detection for jammed pills"],
      },
      {
        category: "Hardware",
        title: "3D printing marathon",
        hours: 1,
        content: [
          "Ran the Bambu X1C for about 6 hours total today printing conveyor housing parts. Used PETG for the structural pieces and TPU for the belt guide surfaces. The TPU parts give just enough flex to prevent pills from chipping.",
        ],
        taskRefs: ["PILL-284"],
      },
      {
        category: "Business",
        title: "Investor deck & financials",
        hours: 2,
        content: [
          "Pulled together the investor deck v1 — 14 slides covering problem, solution, market size, competitive landscape, team, and ask. Used the demo video from today as the hero content on the product slide.",
          "Built the financial projections spreadsheet. Modeling three scenarios: conservative (500 units Y1), base (2000 units Y1), and aggressive (5000 units Y1). Unit economics look solid at the base case — 62% gross margin after COGS.",
          "The 2-minute demo video came out better than expected. Showed the conveyor running, the sensor detection in real-time on the serial monitor, and the housing assembly. Will use this for the pitch and landing page.",
        ],
        taskRefs: ["PILL-285", "PILL-286", "PILL-287"],
        nextSteps: ["Get feedback on deck from 2 advisors", "Refine financial model with updated BOM costs"],
      },
      {
        category: "Personal",
        title: "Late-night decompression",
        hours: 0.5,
        content: [
          "Went for a 30-minute run around 10pm. After 9.5 hours of building, my brain needed the reset. The cool air felt amazing and I came back with a clear head for tomorrow's planning.",
        ],
        taskRefs: [],
      },
    ],
    selfAssessment: {
      difficulty: 9,
      wentWell: "Conveyor working, deck done, everything clicked",
      improve: "Should have eaten lunch — skipped it and crashed at 3pm",
      tomorrow: "Endurance test conveyor, advisor feedback on deck",
    },
    scoreBreakdown: { tasks: 95, hours: 90, notes: 85, variety: 90, photos: 80 },
    status: "published",
  },
  {
    id: "p4",
    dateRaw: "2025-04-04",
    date: "Friday, April 4",
    dayOfWeek: "Friday",
    founderScore: 65,
    hours: 5,
    impact: 6,
    tasksCompleted: 3,
    preview: "CAD updates for conveyor mounting, reviewed motor specs, call with potential advisor",
    tags: ["CAD", "hardware", "business"],
    tasks: makeTasks([
      ["PILL-275", "Update conveyor mount CAD"],
      ["PILL-276", "Motor spec comparison"],
      ["PILL-277", "Advisor intro call"],
    ]),
    gistBullets: [
      "Updated the conveyor mounting system in CAD — much cleaner attachment to the main housing",
      "Compared three NEMA 17 alternatives for the conveyor drive",
      "Had a great intro call with Sarah — she's interested in advising",
    ],
    reflection: "Solid day of prep work. Tomorrow I'm going to try to get the conveyor assembled and running.",
    sections: [
      {
        category: "Hardware",
        title: "Conveyor mount redesign",
        hours: 2.5,
        content: ["Redesigned the conveyor mounting brackets in Fusion360. Switched to a dovetail slide system that makes assembly much easier."],
        taskRefs: ["PILL-275"],
      },
      {
        category: "Hardware",
        title: "Motor selection",
        hours: 1,
        content: ["Compared three stepper motors. The 28BYJ-48 wins on cost and size but the NEMA 17 has better torque. Going with NEMA 17 for the prototype."],
        taskRefs: ["PILL-276"],
      },
      {
        category: "Business",
        title: "Advisor call",
        hours: 1.5,
        content: ["Sarah has 15 years in medtech. She's excited about PillPod and wants to help with FDA navigation. Setting up a formal advisor agreement."],
        taskRefs: ["PILL-277"],
      },
    ],
    selfAssessment: { difficulty: 5, wentWell: "Good advisor connection", improve: "Spent too long on CAD details", tomorrow: "Assemble conveyor prototype" },
    scoreBreakdown: { tasks: 60, hours: 50, notes: 65, variety: 50, photos: 30 },
    status: "published",
  },
  {
    id: "p5",
    dateRaw: "2025-04-03",
    date: "Thursday, April 3",
    dayOfWeek: "Thursday",
    founderScore: 78,
    hours: 7,
    impact: 8,
    tasksCompleted: 6,
    preview: "PCB v3 routed successfully, new display working, started firmware refactor",
    tags: ["hardware", "firmware", "software"],
    tasks: makeTasks([
      ["PILL-260", "PCB v3 routing"],
      ["PILL-261", "Display module integration"],
      ["PILL-262", "Firmware refactor - module split"],
      ["PILL-263", "I2C bus scanner tool"],
      ["PILL-264", "Power regulator testing"],
      ["PILL-265", "Update BOM spreadsheet"],
    ]),
    gistBullets: [
      "PCB v3 is fully routed — sent to JLCPCB for fabrication",
      "Got the new 1.3\" OLED display working over I2C",
      "Started the firmware refactor to split into proper modules",
      "Tested the new 3.3V regulator — much more stable than the old one",
    ],
    reflection: "Hardware and firmware day. Feeling good about the PCB — third time's the charm. The firmware refactor will pay dividends down the road.",
    sections: [
      {
        category: "Hardware",
        title: "PCB v3 layout & routing",
        hours: 3,
        content: ["Finished routing PCB v3 in KiCad. Key changes: moved the ESP32 module away from the power stage, added ground plane stitching vias."],
        taskRefs: ["PILL-260", "PILL-265"],
        nextSteps: ["Review gerbers before fab", "Order stencil for reflow"],
      },
      {
        category: "Software",
        title: "Firmware refactor",
        hours: 2.5,
        content: ["Split the monolithic main.cpp into separate modules: display, sensors, motor, and comms. Much easier to test individual components now."],
        taskRefs: ["PILL-262", "PILL-263"],
      },
      {
        category: "Hardware",
        title: "Display & power testing",
        hours: 1.5,
        content: ["New OLED display is crisp. I2C communication is solid. Also tested the AP2112K regulator — output ripple is under 10mV."],
        taskRefs: ["PILL-261", "PILL-264"],
      },
    ],
    selfAssessment: { difficulty: 7, wentWell: "PCB routing clean first try", improve: "Document firmware changes better", tomorrow: "Continue firmware, print conveyor parts" },
    scoreBreakdown: { tasks: 85, hours: 70, notes: 75, variety: 65, photos: 45 },
    status: "published",
  },
  {
    id: "p6",
    dateRaw: "2025-04-02",
    date: "Wednesday, April 2",
    dayOfWeek: "Wednesday",
    founderScore: 25,
    hours: 2,
    impact: 3,
    tasksCompleted: 1,
    preview: "Light day — wasn't feeling great, did some reading and email catch-up",
    tags: ["research"],
    tasks: makeTasks([
      ["PILL-255", "Competitor research update"],
    ]),
    gistBullets: [
      "Updated the competitive landscape analysis with two new entrants",
      "Responded to a few investor emails",
      "Took it easy — recovering from a cold",
    ],
    reflection: "Not every day can be a 10. Rest is part of the process.",
    sections: [
      {
        category: "Business",
        title: "Competitor research",
        hours: 2,
        content: ["Found two new competitors in the automated dispensing space. Neither seems to be targeting home use — both are institutional/pharmacy-focused."],
        taskRefs: ["PILL-255"],
      },
    ],
    selfAssessment: { difficulty: 2, wentWell: "Didn't force it", improve: "Get better sleep", tomorrow: "Back to hardware" },
    scoreBreakdown: { tasks: 20, hours: 20, notes: 30, variety: 15, photos: 10 },
    status: "published",
  },
  {
    id: "p7",
    dateRaw: "2025-04-01",
    date: "Tuesday, April 1",
    dayOfWeek: "Tuesday",
    founderScore: 70,
    hours: 6,
    impact: 7,
    tasksCompleted: 4,
    preview: "Nailed the housing snap-fit design, ordered new motors, competitor deep-dive",
    tags: ["CAD", "hardware", "business", "design"],
    tasks: makeTasks([
      ["PILL-240", "Housing snap-fit mechanism"],
      ["PILL-241", "Motor order placement"],
      ["PILL-242", "Competitor deep-dive report"],
      ["PILL-243", "Update project timeline"],
    ]),
    gistBullets: [
      "Designed and tested the snap-fit mechanism for the housing — holds great",
      "Ordered 5 NEMA 17 motors from the supplier",
      "Wrote up a 3-page competitor deep-dive",
      "Updated the project timeline in Notion",
    ],
    reflection: "Good productive Tuesday. The snap-fit design is something I'm really proud of — clean engineering.",
    sections: [
      {
        category: "Hardware",
        title: "Snap-fit design",
        hours: 3,
        content: ["Designed a cantilever snap-fit that holds with 15N of force. Printed 6 test pieces with varying undercut depths. 0.8mm undercut is the sweet spot."],
        taskRefs: ["PILL-240"],
      },
      {
        category: "Business",
        title: "Competitor analysis & planning",
        hours: 2,
        content: ["Deep-dive on three main competitors. Our home-use angle is still unique. Updated the project timeline to account for the PCB v3 lead time."],
        taskRefs: ["PILL-242", "PILL-243"],
      },
      {
        category: "Hardware",
        title: "Supply chain",
        hours: 1,
        content: ["Placed the motor order. Also sourced a better belt material — silicone-coated polyester from McMaster."],
        taskRefs: ["PILL-241"],
      },
    ],
    selfAssessment: { difficulty: 6, wentWell: "Snap-fit mechanism", improve: "Better time boxing", tomorrow: "PCB routing" },
    scoreBreakdown: { tasks: 70, hours: 60, notes: 65, variety: 55, photos: 40 },
    status: "published",
  },
  {
    id: "p8",
    dateRaw: "2025-03-31",
    date: "Monday, March 31",
    dayOfWeek: "Monday",
    founderScore: 58,
    hours: 4.5,
    impact: 5,
    tasksCompleted: 3,
    preview: "Weekly planning, firmware bugfixes, cleaned up the lab",
    tags: ["software", "firmware"],
    tasks: makeTasks([
      ["PILL-230", "Weekly sprint planning"],
      ["PILL-231", "Fix sensor timeout bug"],
      ["PILL-232", "Lab organization"],
    ]),
    gistBullets: [
      "Did weekly planning — prioritized conveyor prototype for this week",
      "Fixed a sensor timeout bug that was causing false negatives",
      "Spent an hour organizing the lab — it was getting chaotic",
    ],
    reflection: "Monday reset. Planning days aren't glamorous but they keep things on track.",
    sections: [
      {
        category: "Business",
        title: "Sprint planning",
        hours: 1.5,
        content: ["Set up the week's priorities. Conveyor prototype is #1. Also need to finalize PCB v3 and start the investor deck."],
        taskRefs: ["PILL-230"],
      },
      {
        category: "Software",
        title: "Firmware bugfix",
        hours: 2,
        content: ["The sensor timeout was set to 50ms which was too aggressive for the slower pills. Bumped to 150ms and the false negative rate dropped to zero."],
        taskRefs: ["PILL-231"],
      },
      {
        category: "Personal",
        title: "Lab cleanup",
        hours: 1,
        content: ["Spent an hour sorting components, labeling bins, and clearing the print queue. A clean workspace is a productive workspace."],
        taskRefs: ["PILL-232"],
      },
    ],
    selfAssessment: { difficulty: 4, wentWell: "Good planning session", improve: "Wasted time on email", tomorrow: "CAD and snap-fit design" },
    scoreBreakdown: { tasks: 50, hours: 45, notes: 55, variety: 40, photos: 25 },
    status: "published",
  },
];

// ─── Daily Stats ─────────────────────────────────────────────

function generateDailyStats(): DailyStat[] {
  const stats: DailyStat[] = [];
  const baseDate = new Date("2025-04-07");
  const areas = ["hardware", "firmware", "software", "business", "CAD", "design", "research", "3d-printing"];

  for (let i = 89; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);

    // Create a pattern: weekends lighter, some days off
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const random = Math.sin(i * 9.1 + 7) * 0.5 + 0.5;
    const skip = random < 0.1;

    const score = skip ? 0 : isWeekend
      ? Math.round(20 + random * 40)
      : Math.round(35 + random * 55);

    const tasksCompleted = skip ? 0 : Math.round(1 + random * 7);
    const hoursLogged = skip ? 0 : +(1 + random * 9).toFixed(1);
    const numAreas = Math.round(1 + random * 3);
    const shuffled = [...areas].sort(() => Math.sin(i + numAreas) > 0 ? 1 : -1);

    stats.push({
      date: dateStr,
      score,
      tasksCompleted,
      hoursLogged,
      areasTouched: skip ? [] : shuffled.slice(0, numAreas),
    });
  }

  // Override with actual post data
  for (const post of MOCK_POSTS) {
    const idx = stats.findIndex(s => s.date === post.dateRaw);
    if (idx !== -1) {
      stats[idx] = {
        date: post.dateRaw,
        score: post.founderScore,
        tasksCompleted: post.tasksCompleted,
        hoursLogged: post.hours,
        areasTouched: post.tags,
      };
    }
  }

  return stats;
}

export const MOCK_DAILY_STATS = generateDailyStats();

// ─── Ideas ───────────────────────────────────────────────────

export const MOCK_IDEAS: Idea[] = [
  { id: "i1", text: "Use computer vision to identify pill types by shape and color — could eliminate manual entry", date: "2025-04-07", isPublic: true, tags: ["software", "research"] },
  { id: "i2", text: "Partner with a pharmacy chain for beta testing — CVS innovation lab?", date: "2025-04-07", isPublic: true, tags: ["business"] },
  { id: "i3", text: "Add a humidity sensor to the pill storage compartment — some meds are moisture-sensitive", date: "2025-04-06", isPublic: false, tags: ["hardware"] },
  { id: "i4", text: "Build a simple companion app that shows dispensing history and sends refill reminders", date: "2025-04-06", isPublic: true, tags: ["software"] },
  { id: "i5", text: "Explore subscription model for replacement pill cartridges", date: "2025-04-05", isPublic: true, tags: ["business"] },
  { id: "i6", text: "What if the device could connect to Apple Health and log medication adherence?", date: "2025-04-05", isPublic: true, tags: ["software", "research"] },
  { id: "i7", text: "Use a stepper motor with microstepping for quieter operation at night", date: "2025-04-04", isPublic: false, tags: ["hardware", "firmware"] },
  { id: "i8", text: "3D print pill cartridges in food-safe PETG — cheaper than injection molding for first 500 units", date: "2025-04-04", isPublic: true, tags: ["hardware", "3d-printing"] },
  { id: "i9", text: "Talk to elderly care facilities — group dispensing could be a bigger market", date: "2025-04-03", isPublic: true, tags: ["business"] },
  { id: "i10", text: "Add NFC tag to each cartridge for automatic medication identification", date: "2025-04-03", isPublic: false, tags: ["hardware"] },
  { id: "i11", text: "Implement OTA firmware updates so we can push fixes remotely", date: "2025-04-02", isPublic: true, tags: ["firmware", "software"] },
  { id: "i12", text: "Design a child-proof lock mechanism for the pill storage area", date: "2025-04-02", isPublic: true, tags: ["hardware", "design"] },
  { id: "i13", text: "Create a web dashboard for caregivers to monitor multiple PillPod devices", date: "2025-04-01", isPublic: true, tags: ["software"] },
  { id: "i14", text: "Battery backup so the device works during power outages — critical for medication timing", date: "2025-04-01", isPublic: false, tags: ["hardware"] },
  { id: "i15", text: "Look into HIPAA compliance requirements early — don't want this to be a surprise later", date: "2025-03-31", isPublic: true, tags: ["business", "research"] },
  { id: "i16", text: "Magnetic pill chute that self-aligns — saw a similar mechanism in a vending machine patent", date: "2025-03-31", isPublic: false, tags: ["hardware", "design"] },
  { id: "i17", text: "Record and playback audio reminders in a family member's voice", date: "2025-03-30", isPublic: true, tags: ["software", "design"] },
  { id: "i18", text: "Kickstarter campaign could validate demand before we go all-in on manufacturing", date: "2025-03-30", isPublic: true, tags: ["business"] },
];
