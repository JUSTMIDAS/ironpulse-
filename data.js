/*
  IronPulse shared program data.
  Both programs.html (the catalog/"Vault" grid + filter bar) and
  program-detail.html (the day-by-day tracker) read from PROGRAMS_DATA
  so there is only one place to add or edit a program.

  Structure:
  PROGRAMS_DATA = {
    "<slug>": {
      title:       string   -> big heading on the card + detail page
      category:    string   -> small pill label on the card / "Type" filter facet
      description: string   -> one-line blurb on the card
      subtitle:    string   -> small subtitle on the detail page
      bodyFocus:   string[] -> muscle groups / body areas this trains, e.g. ["Core", "Full Body"]
      equipment:   string[] -> gear needed, e.g. ["None"] or ["Dumbbells", "Bench"]
      difficulty:  string   -> "Beginner" | "Intermediate" | "Advanced"
      days: {
        <dayNumber>: {
          focus: string,
          ex: [ { name, reps, img }, ... ]   // ex: [] renders as a rest day
        },
        ...
      }
    },
    ...
  }

  program-detail.html reads the "program" query param (?program=<slug>)
  to know which entry to load. programs.html builds its filter pills
  (Type / Body Focus / Equipment / Difficulty) by scanning every program
  for these fields, so adding a new value here (e.g. a program with
  equipment: ["Resistance Band"]) automatically adds a new filter pill
  — no changes needed to programs.html itself.

  --- How the 30-day schedules below are built ---
  Rather than hand-typing 30 days per program, each program pulls two
  exercises per day from an EXERCISE pool and a focus label from a
  FOCUS_ROTATION list, cycling through both with buildDays(). Every 7th
  day in the rotation lands on "Active Recovery" and renders as a rest
  day automatically. Some programs pin days 1-2 to fixed exercises via
  the `overrides` argument so first impressions are hand-picked; the
  rest is auto-generated. Edit the pools, rotations, or a specific
  day's override below to customize further.
*/

const CARDIO_EXERCISES = [
    { name: "High Knees", reps: "10", img: "/IMAGES/High_Knees.gif" },
    { name: "Squat Jumps", reps: "3", img: "/IMAGES/Squat_Jumps.gif" },
    { name: "Jumping Jacks", reps: "20", img: "/IMAGES/Jumping_Jacks.gif" },
    { name: "Mountain Climbers", reps: "20", img: "/IMAGES/Mountain_Climbers.gif" },
    { name: "Burpees", reps: "8", img: "/IMAGES/Burpees.gif" },
    { name: "Butt Kicks", reps: "20", img: "/IMAGES/Butt_Kicks.gif" },
    { name: "Skater Jumps", reps: "12", img: "/IMAGES/Skater_Jumps.gif" },
    { name: "Lateral Shuffles", reps: "30s", img: "/IMAGES/Lateral_Shuffles.gif" }
];

const CARDIO_FOCUS_ROTATION = [
    "Aerobic Capacity", "Core Foundation", "Speed & Agility", "Endurance Build",
    "Explosive Power", "Interval Push", "Active Recovery"
];

const STRENGTH_EXERCISES = [
    { name: "Plank Hold", reps: "30s", img: "/IMAGES/Plank.gif" },
    { name: "Shoulder Taps", reps: "10", img: "/IMAGES/Shoulder_Taps.gif" },
    { name: "Dead Bug", reps: "10", img: "/IMAGES/Dead_Bug.gif" },
    { name: "Russian Twists", reps: "20", img: "/IMAGES/Russian_Twists.gif" },
    { name: "Push-Ups", reps: "12", img: "/IMAGES/Push_Ups.gif" },
    { name: "Glute Bridges", reps: "15", img: "/IMAGES/Glute_Bridges.gif" },
    { name: "Lunges", reps: "10", img: "/IMAGES/Lunges.gif" },
    { name: "Superman Hold", reps: "20s", img: "/IMAGES/Superman_Hold.gif" }
];

const STRENGTH_FOCUS_ROTATION = [
    "Core Activation", "Rotational Power", "Upper Body Strength", "Lower Body Strength",
    "Stability & Balance", "Full Body Integration", "Active Recovery"
];

const MOBILITY_EXERCISES = [
    { name: "Cat-Cow Stretch", reps: "10", img: "/IMAGES/Cat_Cow.gif" },
    { name: "Downward Dog Hold", reps: "30s", img: "/IMAGES/Downward_Dog.gif" },
    { name: "Hip Flexor Lunge", reps: "20s", img: "/IMAGES/Hip_Flexor_Lunge.gif" },
    { name: "World's Greatest Stretch", reps: "8", img: "/IMAGES/Worlds_Greatest_Stretch.gif" },
    { name: "Thoracic Rotation", reps: "10", img: "/IMAGES/Thoracic_Rotation.gif" },
    { name: "Seated Forward Fold", reps: "30s", img: "/IMAGES/Seated_Forward_Fold.gif" },
    { name: "Ankle Circles", reps: "10", img: "/IMAGES/Ankle_Circles.gif" },
    { name: "Child's Pose", reps: "30s", img: "/IMAGES/Childs_Pose.gif" }
];

const MOBILITY_FOCUS_ROTATION = [
    "Spinal Mobility", "Hip Opening", "Shoulder Mobility", "Full Body Flow",
    "Balance & Control", "Deep Stretch", "Active Recovery"
];

const HYPERTROPHY_EXERCISES = [
    { name: "Goblet Squats", reps: "12", img: "/IMAGES/Goblet_Squats.gif" },
    { name: "Bulgarian Split Squat", reps: "10", img: "/IMAGES/Bulgarian_Split_Squat.gif" },
    { name: "Push-Ups", reps: "15", img: "/IMAGES/Push_Ups.gif" },
    { name: "Bent-Over Row", reps: "12", img: "/IMAGES/Bent_Over_Row.gif" },
    { name: "Romanian Deadlift", reps: "10", img: "/IMAGES/Romanian_Deadlift.gif" },
    { name: "Overhead Press", reps: "10", img: "/IMAGES/Overhead_Press.gif" },
    { name: "Weighted Step-Ups", reps: "12", img: "/IMAGES/Weighted_Step_Ups.gif" },
    { name: "Farmer's Carry", reps: "30s", img: "/IMAGES/Farmers_Carry.gif" }
];

const HYPERTROPHY_FOCUS_ROTATION = [
    "Lower Body Push", "Upper Body Pull", "Posterior Chain", "Overhead Strength",
    "Unilateral Stability", "Loaded Carries", "Active Recovery"
];

const HYBRID_EXERCISES = [
    { name: "Kettlebell Swings", reps: "15", img: "/IMAGES/Kettlebell_Swings.gif" },
    { name: "Box Jumps", reps: "8", img: "/IMAGES/Box_Jumps.gif" },
    { name: "Rowing Sprints", reps: "30s", img: "/IMAGES/Rowing_Sprints.gif" },
    { name: "Wall Balls", reps: "12", img: "/IMAGES/Wall_Balls.gif" },
    { name: "Battle Ropes", reps: "20s", img: "/IMAGES/Battle_Ropes.gif" },
    { name: "Sled Push", reps: "20s", img: "/IMAGES/Sled_Push.gif" },
    { name: "Thrusters", reps: "10", img: "/IMAGES/Thrusters.gif" },
    { name: "Jump Rope Doubles", reps: "20", img: "/IMAGES/Jump_Rope_Doubles.gif" }
];

const HYBRID_FOCUS_ROTATION = [
    "Metabolic Conditioning", "Power Output", "Grip & Grind", "Anaerobic Threshold",
    "Full Body Engine", "Work Capacity", "Active Recovery"
];

// Builds a 30-day schedule from an exercise pool + a repeating focus list.
// `overrides` lets specific day numbers be pinned to exact content instead
// of the generated pick.
function buildDays(exercisePool, focusRotation, overrides = {}) {
    const days = {};
    for (let day = 1; day <= 30; day++) {
        if (overrides[day]) {
            days[day] = overrides[day];
            continue;
        }
        const focus = focusRotation[(day - 1) % focusRotation.length];
        if (focus === "Active Recovery") {
            days[day] = { focus, ex: [] };
            continue;
        }
        const first = exercisePool[(day * 2) % exercisePool.length];
        const second = exercisePool[(day * 2 + 1) % exercisePool.length];
        days[day] = { focus, ex: [first, second] };
    }
    return days;
}

const PROGRAMS_DATA = {
    "pulse-circuit": {
        title: "Pulse Circuit",
        category: "Cardio Aerobic",
        description: "High-intensity routine for oxygen intake.",
        subtitle: "30-Day Master Transformation",
        bodyFocus: ["Full Body"],
        equipment: ["None"],
        difficulty: "Intermediate",
        days: buildDays(CARDIO_EXERCISES, CARDIO_FOCUS_ROTATION, {
            1: {
                focus: "Aerobic Capacity", ex: [
                    { name: "High Knees", reps: "10", img: "/IMAGES/High_Knees.gif" },
                    { name: "Squat Jumps", reps: "3", img: "/IMAGES/Squat_Jumps.gif" }
                ]
            },
            2: {
                focus: "Core Foundation", ex: [
                    { name: "Plank Hold", reps: "30s", img: "/IMAGES/Plank.gif" },
                    { name: "Shoulder Taps", reps: "10", img: "/IMAGES/Shoulder_Taps.gif" }
                ]
            }
        })
    },

    "strength-core": {
        title: "Strength Core",
        category: "Strength",
        description: "Focus on abdominal stability and power.",
        subtitle: "30-Day Master Transformation",
        bodyFocus: ["Core"],
        equipment: ["None"],
        difficulty: "Beginner",
        days: buildDays(STRENGTH_EXERCISES, STRENGTH_FOCUS_ROTATION, {
            1: {
                focus: "Core Activation", ex: [
                    { name: "Plank Hold", reps: "30s", img: "/IMAGES/Plank.gif" },
                    { name: "Dead Bug", reps: "10", img: "/IMAGES/Dead_Bug.gif" }
                ]
            },
            2: {
                focus: "Rotational Power", ex: [
                    { name: "Russian Twists", reps: "20", img: "/IMAGES/Russian_Twists.gif" },
                    { name: "Mountain Climbers", reps: "20", img: "/IMAGES/Mountain_Climbers.gif" }
                ]
            }
        })
    },

    "flex-flow": {
        title: "Flex Flow",
        category: "Mobility",
        description: "Loosen up stiff joints and build a real range of motion.",
        subtitle: "30-Day Master Transformation",
        bodyFocus: ["Full Body", "Hips", "Shoulders"],
        equipment: ["None"],
        difficulty: "Beginner",
        days: buildDays(MOBILITY_EXERCISES, MOBILITY_FOCUS_ROTATION)
    },

    "powerhouse": {
        title: "Powerhouse",
        category: "Hypertrophy",
        description: "Heavier loads, lower reps — built for size and raw strength.",
        subtitle: "30-Day Master Transformation",
        bodyFocus: ["Full Body", "Legs", "Upper Body"],
        equipment: ["Dumbbells"],
        difficulty: "Advanced",
        days: buildDays(HYPERTROPHY_EXERCISES, HYPERTROPHY_FOCUS_ROTATION)
    },

    "iron-endurance": {
        title: "Iron Endurance",
        category: "Hybrid Conditioning",
        description: "Strength and cardio in the same session — built to grind.",
        subtitle: "30-Day Master Transformation",
        bodyFocus: ["Full Body"],
        equipment: ["Kettlebell", "Dumbbells"],
        difficulty: "Advanced",
        days: buildDays(HYBRID_EXERCISES, HYBRID_FOCUS_ROTATION)
    }
};