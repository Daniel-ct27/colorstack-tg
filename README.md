# ColorStack Code Hunt

React dashboard for the fictional Operation Lost Access competition proposed by ColorStack at Fisk University.

## Run locally

Use Node.js 22.12+ or a newer supported LTS release.

```sh
npm install
npm run dev
```

## Verify

Run `npm test` to check the proposed stage order and chapter filters. Run `npm run build` for the TypeScript check and production build. In the browser, check the dashboard at desktop and phone widths. Select each chapter and verify the expected count (3, 4, 3). Open a briefing with the keyboard, close it with Escape, and confirm focus returns to its mission.

The dashboard is a preview of the ten proposed stages. Registration, playable tasks, and server-side progress are future milestones.
