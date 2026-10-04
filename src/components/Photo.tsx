import Image from 'next/image'

/**
 * A photo that fills its frame. The frame's size comes from the className (see .frame-* in globals.css),
 * so the same photo can be tall on a desktop and short on a phone.
 */
export function Photo({
  src,
  alt,
  className = '',
  sizes = '100vw',
  position = '50% 50%',
  priority = false,
}: {
  src: string
  alt: string
  className?: string
  sizes?: string
  position?: string
  priority?: boolean
}) {
  return (
    <div className={`frame ${className}`.trim()}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: 'cover', objectPosition: position }} />
    </div>
  )
}
