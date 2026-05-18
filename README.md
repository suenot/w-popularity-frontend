# w-popularity-frontend

Next.js 15 frontend for the **w_popularity** project — tracks audience growth across
the user's social channels (YouTube, X, Telegram, Facebook, Instagram, LinkedIn,
Habr, Stack Overflow, T-Bank Pulse, Smart-Lab).

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Recharts (charts)
- SWR (data fetching)
- `lucide-react` (icons)
- Auth via [`auth.marketmaker.cc`](https://auth.marketmaker.cc) — service name: `popularity`

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Redirects to `/dashboard` if authed, `/login` otherwise |
| `/login` | Email + password sign-in |
| `/register` | Create account |
| `/dashboard` | Cross-channel overview (total reach, platform mix, top growers) |
| `/channels` | List of user's channels with KPI sparklines |
| `/channels/new` | Add a channel by URL (platform auto-detected) |
| `/channels/[id]` | Channel detail: growth chart, KPIs, posts |
| `/compare` | Multi-select channels → overlay chart |
| `/settings` | Log out |

## Env vars

```
NEXT_PUBLIC_API_URL=http://localhost:8050
NEXT_PUBLIC_AUTH_URL=https://auth.marketmaker.cc/api/v1
```

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Docker

```bash
docker build -t w-popularity-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://popularity.example.com/api \
  w-popularity-frontend
```

## License

MIT — see [LICENSE](./LICENSE).
