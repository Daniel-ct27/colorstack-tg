export const messageWords = ['Happy', 'Thanksgiving', 'and', 'good', 'luck', 'on', 'your', 'finals,', 'Fisk', 'Bulldogs!'] as const

const photos = [
  { file: 'colorstack-group.png', alt: 'Students holding green cards after a ColorStack recruiting workshop', caption: 'Recruiting Mythbusters' },
  { file: 'colorstack-workshop.png', alt: 'Students listening to a speaker during a ColorStack workshop', caption: 'Learning from each other' },
  { file: 'colorstack-builders.png', alt: 'Students gathered around a table with colorful brick builds', caption: 'Building together' },
  { file: 'colorstack-team.png', alt: 'Five students showing their colorful brick build', caption: 'One more team win' },
]

export function Epilogue({ cleared, mapUrl, artUrl }: { cleared: number; mapUrl: string; artUrl: (name: string) => string }) {
  const unlocked = cleared === messageWords.length

  return (
    <section className="epilogue" aria-labelledby="sendoff-title">
      <a className="hud-back" href={mapUrl}>← Course map</a>
      {unlocked ? (
        <>
          <div className="epilogue-letter">
            <p className="eyebrow">A note from the ColorStack E-Board</p>
            <h1 id="sendoff-title">Happy Thanksgiving, Fisk Bulldogs!</h1>
            <p>You followed every clue and brought the showcase back online. We hope you get some good food, real rest, and time with the people who make you feel at home.</p>
            <p><strong>Good luck on your finals.</strong> Take them one problem at a time, and remember you’ve got a community cheering for you.</p>
            <p className="epilogue-signature">With love,<br />The ColorStack E-Board at Fisk University</p>
          </div>
          <div className="epilogue-photos" aria-label="ColorStack at Fisk memories">
            {photos.map(({ file, alt, caption }) => <figure key={file}>
              <img src={artUrl(file)} alt={alt} loading="lazy" />
              <figcaption>{caption}</figcaption>
            </figure>)}
          </div>
        </>
      ) : (
        <div className="stage-lock">
          <h1 id="sendoff-title">E-Board message sealed</h1>
          <p className="mt-2 text-muted">You’ve found {cleared} of {messageWords.length} message pieces. Clear all ten campaign stages to open the final note.</p>
        </div>
      )}
    </section>
  )
}
