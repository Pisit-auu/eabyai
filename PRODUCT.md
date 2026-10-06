# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Mixed audience of Thai retail traders on MetaTrader 5: newcomers who need to trust the system before connecting an account, and experienced traders who judge an EA by its backtest and forward-test statistics. After sign-in, the same people return to manage trade accounts, EA licenses, and bills.

## Product Purpose
EA.AI rents AI-driven Expert Advisors (currently XAUUSD H1 and EURUSD H1 models on MT5). Users sign in by email OTP or Google, link MT5 trade accounts, issue EA licenses per account/symbol/timeframe/model, download the EA, and pay bills. Admins manage users, models, symbols, timeframes, platforms, and bills.

## Positioning
Profit-sharing pricing: the service charges only on realized profit; no profit, no fee. Performance is shown with dated forward-test and one-year backtest figures per model.

## Operating Context
Users run the EA on MT5 themselves. The web app is where they connect accounts (platform account id), view candles and dashboards, manage licenses, and settle bills via Stripe checkout. A step-by-step document page with screenshots (public/doc1–doc11.png) explains setup.

## Capabilities and Constraints
- Next.js App Router, Tailwind v4, Ant Design 6 components, NextAuth (email OTP + Google), Prisma.
- UI copy is mixed Thai and English.
- Pages: landing/sign-in, document, dashboard, user, trade-account, EA, Bill, admin (setup, user, EA, Bill), api-docs.

## Brand Commitments
- Name and wordmark "EA.AI" must stay.

## Evidence on Hand
- Equity curve images: public/XAUUSDcurveback.png, public/EURUSDcurveback.png.
- Model statistics on the landing page (forward test and 1-year backtest win rate, trades, net profit, profit factor, max drawdown, date ranges). These numbers are fixed and must not be edited.
- A YouTube demo video embedded on the landing page.
- No testimonials, customer counts, or press exist; do not invent them.

## Product Principles
- Numbers first: performance claims always appear with their dates and the drawdown beside the win rate.
- Honest risk: never hide losses or drawdown to make a model look better.
- Plain operation: account, license, and billing tasks stay fast and familiar.
