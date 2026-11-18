// The people on the Our story page. The page, the structured data for search engines and /llms.txt all read
// from here, so a change to a name, role or bio shows up everywhere at once.

export type Person = {
  name: string
  /** Empty until Kim confirms it; shown as a highlighted placeholder. */
  role: string
  bio: string
  photo?: { src: string; alt: string; position?: string }
  /** Only for search engines: a recognition the person is happy to have named. */
  award?: string
}

export const CHEF = {
  name: 'Eric Gallanter',
  role: 'Chef and co-owner',
  photo: { src: '/photos/eric-portrait.jpg', alt: 'Chef Eric Gallanter in the front doorway of Kismet' },
  bio: [
    'Eric has cooked professionally since 1981. He trained under Master Chef Alfred Mayer, graduated with honors from the Culinary Institute of America in New York and went on to run the kitchen at Meadowood in Napa Valley as executive chef and culinary director.',
    'He taught as a senior instructor at the California Culinary Academy and founded his company, Eric Gallanter Private Dining & Consulting, in San Francisco. In December 2025 he and Kim opened Kismet on Main Street, where he and his team work together to make Kismet better each day.',
  ],
}

export const TEAM: Person[] = [
  {
    name: 'Kim Sinclair',
    role: 'Co-owner',
    bio: 'Kim co-owns Kismet with Eric. She’s the restaurant’s sounding board, and some evenings she’s the one who greets you at the door.',
    photo: { src: '/photos/kim.jpg', alt: 'Kim Sinclair smiling beside the blue host stand at Kismet', position: '50% 25%' },
  },
  {
    name: 'Chris Townsend',
    role: 'Sous chef',
    bio: 'Chris brings twenty years of regional American and French cooking to the kitchen. In August 2026 he won the Hooked on Nature cook-off at Columbia Springs with braised rabbit vol-au-vents.',
    photo: { src: '/photos/chris.jpg', alt: 'Chris Townsend, sous chef, in the Kismet kitchen', position: '50% 20%' },
    award: 'Hooked on Nature cook-off at Columbia Springs, August 2026',
  },
  {
    name: 'Dillon',
    role: 'Bar manager',
    bio: 'Dillon leads the bar, continually refining our spirits selection and creating thoughtful, distinctive cocktails. He loves the energy of service and is happiest when he’s on the move, keeping things flowing behind the bar and throughout the room.',
    photo: { src: '/photos/dillon.jpg', alt: 'Dillon, bar manager, smiling in front of the wine shelves at the bar', position: '50% 30%' },
  },
  {
    name: 'Lacey',
    role: 'Floor manager',
    bio: 'Lacey brings a great deal of heart to the day-to-day rhythm of Kismet, with a genuine care for our guests and the team. Born and raised in Vancouver, Washington, she carries her love of the Pacific Northwest into her time off, often found fishing, clamming, or kayaking.',
    photo: { src: '/photos/lacey.jpg', alt: 'Lacey, floor manager, in a green apron in the Kismet dining room', position: '50% 25%' },
  },
]
