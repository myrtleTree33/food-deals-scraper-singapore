# Singapore Food Promotions Scraper

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## Introduction

This code exposes a working NodeJS server, that scrapes and matches food and dining deals in Singapore.

Multiple deals for a given restaurant are matched automatically by the algorithm in O(n^2) time.

At current, the following sources are supported.

Help would be appreciated to integrate more providers below:

| Source             | Extract & Transform | Load | Matched |
| ------------------ | ------------------- | ---- | ------- |
| Burpple            | Done                | Done | Done    |
| Chope Deals        | Done                | Done | Done    |
| Chope Outlets      |                     |      |         |
| Amex               | Done                | Done |         |
| Citi               | Done                | Done |         |
| DBS                | Doing               |      |         |
| OCBC               | Doing               |      |         |
| Maybank            |                     |      |         |
| Standard Chartered |                     |      |         |
| HSBC               |                     |      |         |
| HungryGoWhere      |                     |      |         |

## Help needed for

- [ ] Scraping promos
- [ ] Refactoring code
- [ ] Improving matching algorithm time / space efficiency and accuracy (O(n^2) time, O(n) space at current)

## Install

Code runs in NodeJS, and stores data on Mongo DB.

Packages are installed as a multirepo, and managed with `yarn`, `yarn-workspaces` and `lerna`.

Install all packages. In the main folder, run:

```
$ lerna bootstrap
```

## Running

Entry code is located in `./packages/node-promo-scraper`.

Populate the Mongo URI in `./packages/node-promo-scraper/.env`.

**`./packages/node-promo-scraper/.env`**

```
PORT=<PORT NUMBER>
MONGO_URI=<SOME MONGO URI>
```

Then, run the development server:

```
$ yarn run dev
```

## Issues / Help

Raise on GitHub issues.
