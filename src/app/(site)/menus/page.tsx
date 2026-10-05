import type { Metadata } from 'next'
import { ButtonLink, Eyebrow, ReserveButton, TextLink } from '@/components/Bits'
import { MenuTabs } from '@/components/MenuTabs'
import { Photo } from '@/components/Photo'
import { bottleCount, drinks, longDate, menu, shortDate, site, tel, type Dish, type PricedItem, type WineGroup } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Menus',
  description: `${menu.intro} Cocktails, wines by the glass and ${bottleCount} bottles.`,
  alternates: { canonical: '/menus' },
}

function CourseHead({ title, sub, id }: { title: string; sub: string; id?: string }) {
  return (
    <div className="course-head" id={id}>
      <h2>{title}</h2>
      <span className="eyebrow eyebrow--muted">{sub}</span>
    </div>
  )
}

function Dishes({ items }: { items: Dish[] }) {
  return (
    <ul className="dishes">
      {items.map((d) => (
        <li key={d.name}>
          <span className="dishes__name">{d.name}</span>
          {d.description ? <span className="dishes__desc">{d.description}</span> : null}
        </li>
      ))}
    </ul>
  )
}

function PriceList({ items }: { items: PricedItem[] }) {
  return (
    <ul className="price-list">
      {items.map((it) => (
        <li key={`${it.name}-${it.price}`}>
          <span>
            {it.name}
            {it.size ? <span className="price-list__size">{it.size}</span> : null}
          </span>
          <span className="price-list__price">{it.price}</span>
        </li>
      ))}
    </ul>
  )
}

function SubList({ title, items, className = '' }: { title: string; items: PricedItem[]; className?: string }) {
  return (
    <div className={`stack ${className}`.trim()} style={{ ['--gap' as string]: '8px' }}>
      <h3 className="eyebrow eyebrow--muted">{title}</h3>
      <PriceList items={items} />
    </div>
  )
}

function WineGroups({ groups }: { groups: WineGroup[] }) {
  return (
    <div className="drinks__grid">
      {groups.map((g) => (
        <div className="wine-group" key={g.type}>
          <h3 className="eyebrow eyebrow--brass">{g.type}</h3>
          <PriceList items={g.wines} />
        </div>
      ))}
    </div>
  )
}

export default function MenusPage() {
  const dinner = (
    <section className="section bg-paper" aria-label="Dinner">
      <div className="wrap dinner">
        <div className="stack" style={{ ['--gap' as string]: '8px' }}>
          <CourseHead title="First course" sub="Choose one" id="first" />
          <Dishes items={menu.first} />
        </div>
        <div className="stack" style={{ ['--gap' as string]: '8px' }}>
          <CourseHead title="Second course" sub="Choose one" id="second" />
          <Dishes items={menu.second} />
        </div>
        <div className="menu-notes">
          {menu.notes.map((n) => (
            <div key={n.title}>
              <h3>{n.title}</h3>
              <p>{n.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  const dessert = (
    <section className="section bg-linen" aria-label="Dessert and after dinner">
      <div className="wrap after">
        <div className="after__dessert stack" style={{ ['--gap' as string]: '8px' }}>
          <CourseHead title="Dessert" sub="Choose one" id="dessert" />
          <Dishes items={menu.dessert} />
          <Photo src={menu.photos.dessert.image} alt={menu.photos.dessert.alt} className="after__photo" sizes="(min-width: 1080px) 40vw, 100vw" />
          {menu.galetteNote ? (
            <p className="caption" style={{ paddingTop: 8 }}>
              {menu.galetteNote}
            </p>
          ) : null}
        </div>
        <div className="after__more stack" style={{ ['--gap' as string]: '28px' }}>
          <CourseHead title="After dinner" sub="By the bottle or the pour" id="after" />
          <div className="after__lists">
            <SubList title="Dessert wines" items={drinks.dessertWines} />
            <SubList title={`Fortified wines · ${drinks.fortifiedNote}`} items={drinks.fortified} />
            <SubList title={`Brandy and grappa · ${drinks.brandiesNote}`} items={drinks.brandies} className="after__wide" />
          </div>
        </div>
      </div>
    </section>
  )

  const drinksPanel = (
    <section className="section bg-esp" aria-label="Drinks">
      <div className="wrap drinks">
        <div className="stack" style={{ ['--gap' as string]: '8px' }}>
          <CourseHead title="Cocktails" sub="House recipes" id="cocktails" />
          <ul className="cocktail-list drinks__cocktails" style={{ borderTop: 0 }}>
            {drinks.cocktails.map((c) => (
              <li key={c.name}>
                <span className="cocktail-list__name">{c.name}</span>
                <span className="cocktail-list__price">{c.price}</span>
                <span className="cocktail-list__desc">{c.description}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="stack" style={{ ['--gap' as string]: '8px' }}>
          <CourseHead title="Wine by the glass" sub={drinks.byTheGlassNote} id="wine" />
          <WineGroups groups={drinks.byTheGlass} />
        </div>
        <div className="stack" style={{ ['--gap' as string]: '8px' }}>
          <CourseHead title="Beer and cider" sub={drinks.beerNote} />
          <ul className="beer-list">
            {drinks.beer.map((b) => (
              <li key={b.name}>{b.name}</li>
            ))}
          </ul>
        </div>
        <div className="stack" style={{ ['--gap' as string]: '8px' }}>
          <CourseHead title="The bottle list" sub={`${bottleCount} bottles`} />
          <p className="body" style={{ paddingTop: 12 }}>
            {drinks.bottleIntro}
          </p>
          <WineGroups groups={drinks.bottles} />
          <div className="drinks__foot">
            <p className="body">{drinks.corkage}</p>
            <TextLink href={drinks.wineListPdf} tone="brass" icon="download" newTab>
              Download the wine list
            </TextLink>
          </div>
        </div>
      </div>
    </section>
  )

  return (
    <>
      <section className="section bg-linen" style={{ paddingBottom: 'clamp(20px, 4vw, 56px)' }}>
        <div className="wrap stack menus-title">
          <div className="menus-title__top">
            <div className="stack" style={{ ['--gap' as string]: '12px' }}>
              <Eyebrow>
                Menus · updated <span className="no-phone">{longDate(menu.updated)}</span>
                <span className="phone-only">{shortDate(menu.updated)}</span>
              </Eyebrow>
              <h1 className="display display--xl">The menu</h1>
              <p className="lede">{menu.intro}</p>
              <p className="italic">{menu.dayOfNote}</p>
            </div>
            <div className="menus-title__actions">
              <ReserveButton />
              <TextLink href={menu.menuPdf} icon="download" newTab>
                Download the PDF
              </TextLink>
            </div>
          </div>
          <nav aria-label="On this page" className="menu-jump">
            {[
              ['First course', '#first'],
              ['Second course', '#second'],
              ['Dessert', '#dessert'],
              ['After dinner', '#after'],
              ['Cocktails', '#cocktails'],
              ['Wine and beer', '#wine'],
            ].map(([label, href]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div id="menu-tabs-top" />
      <MenuTabs dinner={dinner} dessert={dessert} drinks={drinksPanel} />

      <section className="section bg-sand" style={{ paddingBlock: 'clamp(40px, 6vw, 80px)' }}>
        <div className="wrap cta-band">
          <h2 className="h2 h2--sm">See you on Main Street.</h2>
          <div className="actions">
            <ButtonLink href={tel} variant="outline" className="phone-only" block>
              Call {site.phone}
            </ButtonLink>
            <TextLink href={tel} className="no-phone">
              Call {site.phone}
            </TextLink>
            <ReserveButton block className="no-phone" />
          </div>
        </div>
      </section>
    </>
  )
}
