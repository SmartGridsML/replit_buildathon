import { LearnTopic } from '../types';

export const LEARN_TOPICS: LearnTopic[] = [
  {
    id: 'chest',
    title: 'Chest Muscles',
    category: 'muscles',
    icon: '💪',
    summary: 'Pectoralis major & minor - pushing movements',
    content: `The chest is made up of two main muscles:

**Pectoralis Major** - The large, fan-shaped muscle that makes up most of your chest. It has two heads:
• Clavicular head (upper chest) - activated with incline movements
• Sternal head (lower chest) - activated with flat and decline movements

**Pectoralis Minor** - A smaller muscle underneath that helps stabilize your shoulder blade.

**Best Exercises:**
• Bench Press (flat, incline, decline)
• Push-Ups
• Dumbbell Flyes
• Cable Crossovers

**Training Tips:**
• Vary angles to hit both heads
• Focus on full range of motion
• Don't flare elbows too wide to protect shoulders`,
  },
  {
    id: 'back',
    title: 'Back Muscles',
    category: 'muscles',
    icon: '🦴',
    summary: 'Lats, traps, rhomboids - pulling movements',
    content: `The back contains several major muscle groups:

**Latissimus Dorsi (Lats)** - The large V-shaped muscles that give width to your back. They pull your arms down and back.

**Trapezius (Traps)** - Diamond-shaped muscle from neck to mid-back. Upper traps shrug shoulders, middle/lower traps squeeze shoulder blades.

**Rhomboids** - Between shoulder blades, help with posture and pulling movements.

**Erector Spinae** - Muscles along your spine that keep you upright.

**Best Exercises:**
• Pull-Ups and Lat Pulldowns
• Rows (barbell, dumbbell, cable)
• Deadlifts
• Face Pulls

**Training Tips:**
• Think "pull with elbows" not hands
• Squeeze shoulder blades together
• Balance vertical and horizontal pulls`,
  },
  {
    id: 'shoulders',
    title: 'Shoulder Muscles',
    category: 'muscles',
    icon: '🎯',
    summary: 'Deltoids & rotator cuff - overhead movements',
    content: `The shoulder is a ball-and-socket joint with several muscles:

**Deltoids** - The rounded shoulder muscles with three heads:
• Anterior (front) - raises arm forward
• Lateral (side) - raises arm sideways  
• Posterior (rear) - pulls arm back

**Rotator Cuff** - Four small muscles that stabilize the shoulder:
• Supraspinatus, Infraspinatus, Teres Minor, Subscapularis
• Crucial for injury prevention!

**Best Exercises:**
• Overhead Press
• Lateral Raises
• Front Raises
• Face Pulls (for rear delts)
• External Rotations (for rotator cuff)

**Training Tips:**
• Warm up rotator cuff before heavy pressing
• Don't go too heavy on lateral raises
• Balance front and rear delt work`,
  },
  {
    id: 'legs',
    title: 'Leg Muscles',
    category: 'muscles',
    icon: '🦵',
    summary: 'Quads, hamstrings, glutes, calves',
    content: `The legs contain the body's largest muscles:

**Quadriceps** - Four muscles on front of thigh that extend the knee:
• Rectus Femoris, Vastus Lateralis, Medialis, Intermedius

**Hamstrings** - Three muscles on back of thigh that bend the knee and extend the hip.

**Glutes** - The gluteus maximus is the largest muscle in your body. Powers hip extension.

**Calves** - Gastrocnemius and Soleus help you push off when walking/running.

**Best Exercises:**
• Squats (back, front, goblet)
• Deadlifts (conventional, Romanian)
• Lunges and Split Squats
• Leg Press and Leg Curls
• Calf Raises

**Training Tips:**
• Go deep on squats for full development
• Don't skip hamstring work
• Train glutes from multiple angles`,
  },
  {
    id: 'core',
    title: 'Core Muscles',
    category: 'muscles',
    icon: '🔥',
    summary: 'Abs, obliques, and deep stabilizers',
    content: `The core is more than just "abs":

**Rectus Abdominis** - The "six-pack" muscle that flexes your spine.

**Obliques** - Side muscles for rotation and lateral bending:
• External obliques (outer layer)
• Internal obliques (deeper layer)

**Transverse Abdominis** - Deep muscle that wraps around your midsection like a corset. Key for stability.

**Erector Spinae** - Lower back muscles that oppose the abs.

**Best Exercises:**
• Planks (front and side)
• Dead Bugs
• Pallof Press
• Cable Crunches
• Bird Dogs

**Training Tips:**
• Brace your core, don't just flex
• Balance flexion with extension work
• Quality over quantity`,
  },
  {
    id: 'knee-injury',
    title: 'Knee Injury Prevention',
    category: 'injuries',
    icon: '🦿',
    summary: 'Protect your knees during training',
    content: `Common knee issues and how to prevent them:

**Common Injuries:**
• Patellofemoral syndrome (runner's knee)
• IT band syndrome
• MCL/ACL strains
• Meniscus tears

**Prevention Strategies:**

**Strengthen Supporting Muscles:**
• Strong quads and hamstrings protect the knee
• Don't neglect hip strength - weak hips cause knee problems
• Balance quad and hamstring strength

**Proper Form:**
• Track knees over toes, don't let them cave in
• Control the descent - don't drop fast
• Avoid excessive forward lean

**Mobility Work:**
• Stretch hip flexors and quads
• Foam roll IT band and quads
• Work on ankle mobility

**If You Have Knee Pain:**
• Reduce range of motion temporarily
• Choose low-impact exercises (swimming, cycling)
• Strengthen muscles around the knee
• See a professional if pain persists`,
  },
  {
    id: 'shoulder-injury',
    title: 'Shoulder Injury Prevention',
    category: 'injuries',
    icon: '🤕',
    summary: 'Keep your shoulders healthy',
    content: `The shoulder is the most mobile (and vulnerable) joint:

**Common Issues:**
• Rotator cuff strains/tears
• Shoulder impingement
• Labrum tears
• Biceps tendinitis

**Prevention Strategies:**

**Warm Up Properly:**
• Always warm up rotator cuff before pressing
• Band pull-aparts and external rotations
• Arm circles and shoulder dislocates

**Balance Your Training:**
• For every push, do a pull
• Don't neglect rear delts and upper back
• Avoid excessive overhead work

**Proper Form:**
• Don't flare elbows to 90° on bench press
• Keep shoulders packed and down
• Avoid going too deep on dips

**Mobility & Recovery:**
• Stretch chest and lats regularly
• Foam roll upper back
• Sleep on your back, not on your shoulder

**Warning Signs:**
• Sharp pain during pressing
• Clicking or popping with pain
• Weakness when lifting arm`,
  },
  {
    id: 'back-injury',
    title: 'Back Injury Prevention',
    category: 'injuries',
    icon: '🔙',
    summary: 'Protect your spine during lifting',
    content: `Back injuries can sideline you for weeks. Here's how to stay safe:

**Common Issues:**
• Muscle strains
• Disc herniation
• Sciatica
• Facet joint pain

**Prevention Strategies:**

**Master Bracing:**
• Take a deep breath into your belly
• Brace like you're about to get punched
• Maintain neutral spine throughout lifts

**Build a Strong Core:**
• Planks, dead bugs, bird dogs
• Anti-rotation exercises
• Don't just do crunches

**Proper Deadlift Form:**
• Keep bar close to body
• Push the floor away, don't pull the bar up
• Never round your lower back under load

**Hip Hinge Practice:**
• Romanian deadlifts with light weight
• Hip hinges with PVC pipe on back
• Master the pattern before adding weight

**When to Reduce Load:**
• Any sharp pain - stop immediately
• Chronic tightness - address with mobility
• After long periods of sitting`,
  },
  {
    id: 'warmup',
    title: 'Warming Up Properly',
    category: 'recovery',
    icon: '🔥',
    summary: 'Prepare your body for training',
    content: `A proper warm-up prevents injuries and improves performance:

**Why Warm Up?**
• Increases blood flow to muscles
• Raises body temperature
• Prepares nervous system for work
• Lubricates joints

**General Warm-Up (5-10 min):**
• Light cardio (walking, cycling, rowing)
• Get heart rate up slightly
• Break a light sweat

**Dynamic Stretching:**
• Leg swings (front/back, side to side)
• Arm circles
• Hip circles
• Walking lunges with twist
• Inchworms

**Movement-Specific Prep:**
Before squats: bodyweight squats, goblet squats
Before bench: push-ups, band pull-aparts
Before deadlifts: hip hinges, good mornings

**Activation Work:**
• Glute bridges before leg day
• Band pull-aparts before upper body
• Dead bugs before any training

**What NOT to Do:**
• Skip warm-up when rushed
• Static stretch cold muscles
• Go straight to heavy weights`,
  },
  {
    id: 'recovery',
    title: 'Recovery Basics',
    category: 'recovery',
    icon: '😴',
    summary: 'Rest and grow stronger',
    content: `You don't get stronger during training - you get stronger recovering from it:

**Sleep (Most Important):**
• Aim for 7-9 hours per night
• Keep consistent sleep schedule
• Sleep is when growth hormone peaks
• Poor sleep = poor recovery

**Nutrition:**
• Eat enough protein (0.7-1g per lb bodyweight)
• Don't skip carbs - they fuel training
• Stay hydrated (half your bodyweight in oz)
• Eat within 2 hours post-workout

**Active Recovery:**
• Light movement on rest days
• Walking, swimming, easy cycling
• Helps blood flow without added stress

**Mobility & Stretching:**
• Foam roll tight areas
• Static stretch after training
• Address problem areas daily

**Managing Stress:**
• High stress = poor recovery
• Meditation, deep breathing
• Don't overtrain when life is stressful

**Signs You Need More Recovery:**
• Persistent fatigue
• Decreased performance
• Mood changes
• Frequent illness
• Trouble sleeping`,
  },
  {
    id: 'protein',
    title: 'Protein for Muscle',
    category: 'nutrition',
    icon: '🥩',
    summary: 'How much protein do you really need?',
    content: `Protein is essential for building and repairing muscle:

**How Much?**
• 0.7-1g per pound of bodyweight
• Example: 150lb person = 105-150g daily
• Spread across 3-5 meals

**Best Sources:**
• Chicken, turkey, lean beef
• Fish and seafood
• Eggs and egg whites
• Greek yogurt, cottage cheese
• Legumes, tofu (plant-based)

**Timing:**
• 20-40g per meal is optimal
• Post-workout protein helps recovery
• Before bed: casein or cottage cheese

**Protein Supplements:**
• Whey protein: fast-absorbing, post-workout
• Casein: slow-release, before bed
• Plant proteins: pea, rice, hemp blends

**Common Mistakes:**
• Eating all protein in one meal
• Relying only on supplements
• Not tracking intake accurately

**Quick Math:**
Your weight: _____ lbs
Minimum protein: _____ x 0.7 = _____ g
Maximum protein: _____ x 1.0 = _____ g`,
  },
];

export const LEARN_CATEGORIES = [
  { id: 'all', label: 'All', icon: '📖' },
  { id: 'muscles', label: 'Muscles', icon: '💪' },
  { id: 'injuries', label: 'Injuries', icon: '🩹' },
  { id: 'recovery', label: 'Recovery', icon: '😴' },
  { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
];
