import type { Operation } from "../types/operation";
import type { Script } from "../types/script";

// Sample scripts added the first time the database is created, so a new user
// has something to run and edit. Each targets a public page that tolerates
// light scraping, and together they show off the main step types.

const text = (value: string) => ({ type: "text" as const, value });
const select = (value: string) => ({ type: "select" as const, value });

const open = (url: string): Operation => ({
  type: "open",
  inputs: [text(url)]
});

const extract = (
  name: string,
  selector: string,
  attribute: "textContent" | "href" = "textContent"
): Operation => ({
  type: "extract",
  inputs: [text(name), text(selector), select(attribute)]
});

const mostPopularMovies: Script = {
  favorite: false,
  name: "Most Popular Movies",
  description: "Fetches list of popular movies from IMDb",
  operations: [
    open("https://www.imdb.com/chart/moviemeter/"),
    extract("Title", "li .ipc-title__text")
  ]
};

const quotesByTag: Script = {
  favorite: false,
  name: "Quotes by Tag",
  description:
    "Quotes and authors for one tag on quotes.toscrape.com — change the tag variable to scrape another",
  operations: [
    {
      type: "set",
      inputs: [text("tag"), select("string"), text("inspirational")]
    },
    open("https://quotes.toscrape.com/tag/{{tag}}/"),
    { type: "wait", inputs: [text(".quote"), text("10000")] },
    extract("Quote", ".quote .text"),
    extract("Author", ".quote .author")
  ]
};

const githubTrending: Script = {
  favorite: false,
  name: "GitHub Trending",
  description: "Today's trending repositories on GitHub",
  operations: [
    open("https://github.com/trending"),
    { type: "scroll", inputs: [text("")] },
    extract("Repository", "article.Box-row h2 a"),
    extract("URL", "article.Box-row h2 a", "href")
  ]
};

const bookPrices: Script = {
  favorite: true,
  name: "Book Prices",
  description: "Titles and prices from the books.toscrape.com catalogue",
  operations: [
    open("https://books.toscrape.com/"),
    extract("Title", "article.product_pod h3 a"),
    extract("Price", "article.product_pod .price_color")
  ]
};

const hackerNews: Script = {
  favorite: true,
  name: "Hacker News Front Page",
  description: "Top stories and their links from news.ycombinator.com",
  operations: [
    open("https://news.ycombinator.com/"),
    extract("Title", ".titleline > a"),
    extract("Link", ".titleline > a", "href")
  ]
};

// Insertion order: the library lists newest first, so the last is on top.
export const SEED_SCRIPTS: Script[] = [
  mostPopularMovies,
  quotesByTag,
  githubTrending,
  bookPrices,
  hackerNews
];
