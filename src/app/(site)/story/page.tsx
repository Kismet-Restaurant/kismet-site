import type { Metadata } from 'next'
import { ButtonLink, Eyebrow, Mirror, Placeholder, PortraitPlaceholder, ReserveButton, TextLink } from '@/components/Bits'
import { Icon } from '@/components/Icons'
import { Photo } from '@/components/Photo'
import { mailto, site } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Our story',
  description:
    'Kismet is Chef Eric Gallanter and Kim Sinclair’s restaurant on historic Main Street in Vancouver, Washington: one room, a small team and a menu that follows the Northwest harvest.',
  alternates: { canonical: '/story' },
}

type Person = {
  name: string
  /** Empty until Kim confirms it; shown as a highlighted placeholder. */
  role: string
  bio: string
  photo?: { src: string; alt: string; position?: string }
}

const TEAM: Person[] = [
  {
    name: 'Kim Sinclair',
    role: 'Co-owner',
    bio: 'Kim co-owns Kismet with Eric. She’s the restaurant’s sounding board, and some evenings she’s the one who greets you at the door.',
    photo: { src: '/photos/kim.jpg', alt: 'Kim Sinclair in the front doorway of Kismet', position: '50% 30%' },
  },
  {
    name: 'Chris Townsend',
    role: 'Sous chef',
    bio: 'Chris brings twenty years of regional American and French cooking to the kitchen. In August 2026 he won the Hooked on Nature cook-off at Columbia Springs with braised rabbit vol-au-vents.',
    photo: { src: '/photos/chris-sm.jpg', alt: 'Chris Townsend, sous chef, in the Kismet kitchen', position: '50% 20%' },
  },
  {
    name: 'Dillon',
    role: '',
    bio: '',
    photo: { src: '/photos/dillon-sm.jpg', alt: 'Dillon shaking a cocktail behind the Kismet bar', position: '50% 30%' },
  },
  {
    name: 'Lacey',
    role: '',
    bio: '',
    photo: { src: '/photos/lacey-sm.jpg', alt: 'Lacey holding oysters on ice and a Dungeness crab cake', position: '50% 25%' },
  },
]

export default function StoryPage() {
  return (
    <>
      <section className="story-hero bg-linen" aria-labelledby="story-title">
        <div className="story-hero__text stack">
          <Eyebrow>Our story</Eyebrow>
          <p className="story-hero__define">
            kis·met<span>noun</span> fate; what is meant to be
          </p>
          <h1 id="story-title" className="display display--xl">
            Meant to be, and made to happen.
          </h1>
          <blockquote className="story-hero__quote">
            <p>“Something that is meant to be, yet we also have to make it happen.”</p>
            <p className="small">Kim Sinclair and Eric Gallanter, co-owners, in Clark County Compass</p>
          </blockquote>
        </div>
        <Photo
          src="/photos/dining-room.jpg"
          alt="The Kismet dining room with its leather banquette and round walnut mirrors"
          className="story-hero__photo"
          sizes="(min-width: 1080px) 45vw, 100vw"
          position="30% 50%"
          priority
        />
      </section>

      <section className="section bg-paper" aria-labelledby="chef-title">
        <div className="wrap split">
          <div className="split__a chef__mirror">
            <Mirror>
              <Photo src="/photos/eric-portrait.jpg" alt="Chef Eric Gallanter in the front doorway of Kismet" sizes="440px" />
            </Mirror>
          </div>
          <div className="split__b stack">
            <Eyebrow>The chef</Eyebrow>
            <h2 id="chef-title" className="h2">
              Eric Gallanter
            </h2>
            <p className="body">
              Eric has cooked professionally since 1981. He trained under Master Chef Alfred Mayer, graduated with honors from the
              Culinary Institute of America in New York and went on to run the kitchen at Meadowood in Napa Valley as executive chef
              and culinary director.
            </p>
            <p className="body">
              He taught as a senior instructor at the California Culinary Academy, consulted for the Oriental Hotel in Bangkok and in
              1999 founded Eric Gallanter Private Dining in San Francisco. In December 2025 he and Kim opened Kismet on Main Street,
              where he runs the kitchen and takes pride in finding the best of each season from a variety of growers, ranchers and
              purveyors.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-linen" aria-labelledby="team-title">
        <div className="wrap stack" style={{ ['--gap' as string]: 'clamp(32px, 4vw, 56px)' }}>
          <div className="stack" style={{ ['--gap' as string]: '16px' }}>
            <Eyebrow>The people</Eyebrow>
            <h2 id="team-title" className="h2">
              Behind the pass and at the door.
            </h2>
          </div>
          <div className="team">
            {TEAM.map((p) => (
              <div className="person" key={p.name}>
                {p.photo ? (
                  <Photo
                    src={p.photo.src}
                    alt={p.photo.alt}
                    className="person__photo"
                    sizes="(min-width: 1080px) 300px, (min-width: 720px) 45vw, 100vw"
                    position={p.photo.position}
                  />
                ) : (
                  <PortraitPlaceholder label={`Portrait of ${p.name.split(' ')[0]}`} />
                )}
                <Eyebrow>{p.role || <Placeholder>Role</Placeholder>}</Eyebrow>
                <h3 className="person__name">{p.name}</h3>
                <p className="body">{p.bio || <Placeholder>{`A line about ${p.name} from Kim`}</Placeholder>}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-sand" aria-labelledby="room-title">
        <div className="wrap split">
          <div className="split__a stack">
            <Eyebrow>The room</Eyebrow>
            <h2 id="room-title" className="h2">
              One room on Main Street.
            </h2>
            <p className="body">
              It took just over two years to turn a Main Street storefront, most recently a beauty salon, into one warm dining room:
              walnut mirrors, a leather banquette, brass lamps, linen and chambray. The blue bench on the patio is original seating from
              the Portland airport.
            </p>
          </div>
          <div className="split__b room-grid">
            <Photo src="/photos/bar.jpg" alt="Sunlight across the Kismet bar" sizes="(min-width: 1080px) 25vw, 50vw" />
            <Photo src="/photos/place-setting-sm.jpg" alt="A chambray napkin in a brass ring" sizes="(min-width: 1080px) 25vw, 50vw" />
            <Photo
              src="/photos/patio-sm.jpg"
              alt="The covered patio out front, with the blue airport bench"
              sizes="(min-width: 1080px) 25vw, 50vw"
              position="40% 80%"
            />
          </div>
        </div>
      </section>

      <section id="press" className="section bg-paper" aria-labelledby="press-title">
        <div className="wrap stack" style={{ ['--gap' as string]: 'clamp(32px, 4vw, 48px)' }}>
          <div className="stack" style={{ ['--gap' as string]: '16px' }}>
            <Eyebrow>Press</Eyebrow>
            <h2 id="press-title" className="h2">
              What they’re writing.
            </h2>
          </div>
          <div className="press-list">
            {site.press.map((p) => (
              <a key={p.url} href={p.url} target="_blank" rel="noopener noreferrer">
                <span className="press-list__meta">
                  <span className="eyebrow eyebrow--ember">{p.outlet}</span>
                  <span className="press-list__date">{p.date}</span>
                </span>
                <span className="press-list__headline">{p.headline}</span>
                <span className="press-list__arrow">
                  <Icon name="arrow" size={18} />
                </span>
              </a>
            ))}
          </div>
          <div className="press-box">
            <div className="stack" style={{ ['--gap' as string]: '10px' }}>
              <h3>For press and creators</h3>
              <p className="body">
                Covering food in Portland, Vancouver or Camas? We’re happy to share photographs, a fact sheet and logos. For interviews
                or a visit, write to {site.email}.
              </p>
            </div>
            <div className="actions">
              <ButtonLink href={`${mailto}?subject=Press%20kit%20request`} variant="outline">
                Ask for the press kit
              </ButtonLink>
              <ButtonLink href={mailto}>Email us</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-sand" style={{ paddingBlock: 'clamp(40px, 6vw, 80px)' }}>
        <div className="wrap cta-band">
          <h2 className="h2 h2--sm">Come see for yourself.</h2>
          <div className="actions">
            <TextLink href="/menus">See the menu</TextLink>
            <ReserveButton block />
          </div>
        </div>
      </section>
    </>
  )
}
