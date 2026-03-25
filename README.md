# AU Backend App

Backend dashboard API built with Node.js, Express, and TypeScript using a JSON file as the data source.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
cp .env.example .env
```

3. Run in development:

```bash
npm run dev
```

4. Build and run production:

```bash
npm run build
npm start
```

## API Endpoints

- `GET /api/states`
- `GET /api/states/:state/dates`
- `GET /api/dashboard?customerId=CG-12520&state=Kentucky&startDate=2016-01-01&endDate=2016-12-31`

## Notes

- `customerId` filters the source field `Customer ID`.
- `totalOrders` is calculated from unique `Order ID` values.
- `totalRevenue` is based on the sum of `Profit`.
