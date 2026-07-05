// Fake surrounding videos. Plain gray thumbnails only — no real YouTube data.
export const PLACEHOLDER_VIDEOS = [
  {
    title: 'I Built a Tiny House in 30 Days (Full Timelapse)',
    channel: 'Off-Grid Living',
    meta: '2.1M views • 3 weeks ago',
    duration: '18:42',
    desc: 'From an empty field to a fully working tiny house. Every step, every mistake, and the final cost breakdown at the end.',
  },
  {
    title: 'The Real Reason Nobody Watches Your Videos',
    channel: 'Creator Lab',
    meta: '847K views • 5 days ago',
    duration: '11:08',
    desc: 'It has nothing to do with the algorithm. In this video we look at the three things top creators do differently.',
  },
  {
    title: 'We Tested 100-Year-Old Recipes for a Week',
    channel: 'Kitchen History',
    meta: '1.4M views • 2 months ago',
    duration: '22:15',
    desc: 'Seven days, twenty-one meals, all cooked from a cookbook printed in 1924. Some of these should make a comeback.',
  },
  {
    title: 'How Airports Actually Work',
    channel: 'Systems Explained',
    meta: '3.8M views • 1 year ago',
    duration: '16:33',
    desc: 'Behind every takeoff is an invisible machine of logistics, radar, and thousands of people. Here is how it all fits together.',
  },
  {
    title: '$10 vs $1,000 Camping Gear',
    channel: 'Trail Duo',
    meta: '5.2M views • 8 months ago',
    duration: '24:01',
    desc: 'One of us camps with budget gear, the other with the most expensive kit we could find. The results surprised us both.',
  },
  {
    title: 'Why This Chess Move Broke the Internet',
    channel: 'Checkmate Daily',
    meta: '692K views • 1 day ago',
    duration: '9:47',
    desc: 'A single rook move in round six had grandmasters arguing for hours. Let me show you why it works.',
  },
  {
    title: 'A Day in the Life of a Deep Sea Engineer',
    channel: 'Blue Depth',
    meta: '1.9M views • 4 months ago',
    duration: '13:26',
    desc: 'Follow along on a 12-hour shift 300 meters below the surface, keeping the turbines running.',
  },
  {
    title: 'Turning a Rusty Knife Into a Masterpiece',
    channel: 'Forge & Polish',
    meta: '7.3M views • 2 years ago',
    duration: '15:54',
    desc: 'Found at a flea market for two dollars. Restored over three weeks. Full process, no shortcuts.',
  },
  {
    title: 'The Hidden Math Inside Your Playlist',
    channel: 'Number Field',
    meta: '426K views • 2 weeks ago',
    duration: '12:12',
    desc: 'Shuffle is not random, and your recommendations are stranger than you think. A tour of the math behind the music.',
  },
  {
    title: 'I Lived on $1 a Day in Tokyo',
    channel: 'Budget Nomad',
    meta: '2.7M views • 6 months ago',
    duration: '19:38',
    desc: 'Seven days in one of the most expensive cities on earth with almost no money. Here is exactly how I did it.',
  },
  {
    title: 'Every Guitar Effect Explained in 20 Minutes',
    channel: 'Pedal Notes',
    meta: '958K views • 3 months ago',
    duration: '20:04',
    desc: 'Distortion, delay, reverb, and the weird stuff. Every major effect, what it does, and when to use it.',
  },
  {
    title: "What's Inside a Formula 1 Steering Wheel?",
    channel: 'Grid Tech',
    meta: '4.5M views • 1 year ago',
    duration: '10:51',
    desc: 'Twenty-five buttons, six paddles, and a small screen. We take one apart to see what every control actually does.',
  },
  {
    title: 'The Last Blockbuster on Earth',
    channel: 'Retro Atlas',
    meta: '6.1M views • 3 years ago',
    duration: '17:29',
    desc: 'There is exactly one left. We drove 900 miles to spend a weekend there before it is gone.',
  },
  {
    title: 'Baking Bread With 4,000-Year-Old Yeast',
    channel: 'Ancient Table',
    meta: '1.1M views • 7 months ago',
    duration: '14:45',
    desc: 'A sample of yeast cultured from an ancient Egyptian baking vessel. We made a loaf with it.',
  },
]

// Identical fake stats for every uploaded version, so an A/B comparison is
// only about the thumbnail itself.
export const USER_META = {
  meta: '12K views • 4 hours ago',
  duration: '11:27',
  desc: 'This is where the first lines of your video description will appear in search results, so make them count.',
}

export const DEFAULT_TITLE = 'Your video title appears here'
export const DEFAULT_CHANNEL = 'Your Channel'

const VERSION_LETTERS = ['A', 'B', 'C']
const AVATAR_COLORS = ['bg-red-600', 'bg-blue-600', 'bg-emerald-600']

export function versionLetter(index) {
  return VERSION_LETTERS[index] ?? '?'
}

export function userItem(thumb, index, showBadge) {
  return {
    kind: 'user',
    key: thumb.id,
    url: thumb.url,
    title: thumb.title.trim() || DEFAULT_TITLE,
    channel: thumb.channel.trim() || DEFAULT_CHANNEL,
    badge: showBadge ? versionLetter(index) : null,
    avatarClass: AVATAR_COLORS[index % AVATAR_COLORS.length],
    ...USER_META,
  }
}

function emptyItem() {
  return {
    kind: 'empty',
    key: 'empty-slot',
    title: DEFAULT_TITLE,
    channel: DEFAULT_CHANNEL,
    ...USER_META,
  }
}

// A feed of `count` items: gray placeholders with the user's uploads slotted
// in at spread-out positions (or one dashed empty slot before any upload).
export function buildFeed(thumbs, { count, start = 1, gap = 3 }) {
  const items = []
  for (let i = 0; i < count; i++) {
    const v = PLACEHOLDER_VIDEOS[i % PLACEHOLDER_VIDEOS.length]
    items.push({ kind: 'ph', key: `ph-${i}`, ...v })
  }
  if (thumbs.length === 0) {
    items[Math.min(start, count - 1)] = emptyItem()
  } else {
    thumbs.forEach((t, i) => {
      const idx = Math.min(start + i * gap, count - 1)
      items[idx] = userItem(t, i, thumbs.length > 1)
    })
  }
  return items
}
