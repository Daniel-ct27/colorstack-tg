# ColorStack Code Hunt

**Operation Lost Access** is a ten-stage Thanksgiving mystery from ColorStack at Fisk University. The night before break, a student showcase goes offline. Follow the evidence, repair the systems, and rehearse the release before the doors open.

You’ll browse a fictional workstation, investigate a Git regression, trace messages across services, and make the final call on whether a repaired report is safe to publish. Each case has its own interactive workspace. The evidence board keeps track of the clues you uncover.

## Play locally

Install Node.js 22.12 or newer, then run:

```bash
git clone https://github.com/Daniel-ct27/colorstack-tg.git
cd colorstack-tg
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173/). Use the URL Vite prints if it starts on a different port.

- **Play the campaign.** In the local dev build, turn off **Playtest mode** and start at Stage 01. Each clear opens the next checkpoint and pins a clue.
- **Try a specific stage.** Leave **Playtest mode** on to open any checkpoint from the course map. Out-of-order clears stay in the current playtest and leave campaign progress alone.
- **Get unstuck.** Open **Mission briefing** to revisit the assignment, **Field notes** to look up a term, or tap Giblet or Jub for optional hints.

Campaign progress is saved in the current browser. All challenges run in the browser with fictional data and simulated tools. Processing a command in the game has no effect on your machine or real repositories.

## The ten cases

### I. Discovery

1. **The Hidden System** — Explore a file tree and trace the overnight export.
2. **The Missing Commit** — Inspect Git history, reverse a regression, and verify the report.
3. **The Silent Failure** — Compare run logs and repair an export configuration.

### II. Investigation

4. **The Undocumented Gateway** — Reconcile conflicting API captures and build a working adapter.
5. **Signals in the Noise** — Pin the failure window and trace the right delivery across services.
6. **A Conversation Interrupted** — Replay a message exchange and tune retries without duplicating work.
7. **The Layered Cipher** — Decode two archive copies and verify which note belongs to the incident.

### III. Recovery

8. **Deadlock in the Pipeline** — Dispatch two workers and finish six dependent jobs in three rounds.
9. **Services Out of Sync** — Route conflicting records and respond when newer revisions arrive.
10. **The Final Recovery** — Rehearse one release plan twice and make the publish-or-restore call.

## Development

The game is built with React, TypeScript, Vite, and Tailwind CSS. Challenge logic and fixtures live in [`src/`](src/), with automated checks in [`test/`](test/) and local artwork in [`public/art/`](public/art/).

```bash
npm test       # Run the challenge and progression tests
npm run build  # Type-check and produce the site in dist/
```

To smoke-test a change, clear a stage in Campaign mode, follow the next checkpoint, and reload to confirm progress is retained. Check both a correct attempt and a plausible wrong one in any challenge you change.

## Deploy to GitHub Pages

In the GitHub repository, open **Settings → Pages** and choose **GitHub Actions** as the build and deployment source. Then open **Actions → Deploy to GitHub Pages → Run workflow** and select **main**.

The workflow tests and builds the game, publishes the result, and runs again on future pushes to `main`. The published site uses [daniel-ct27.github.io/colorstack-tg](https://daniel-ct27.github.io/colorstack-tg/).

To make the same static build locally, run `npm run build:pages`. It writes the home page and all ten mission entry pages under `dist/`.

## Credits

Built for ColorStack at Fisk University. The [Jubilee Hall photograph](https://commons.wikimedia.org/wiki/File:JubileeHallFiskU.jpg) is by Fhaywood25 under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), with cropping and tinting in the interface. The game’s footer links to the chapter photography.
