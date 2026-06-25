// Canonical source records for the Phase 1 corpus. Every remedy must attribute
// to one of these two public-domain texts (verified license + Gutenberg URL).
// Adding a third source requires re-running the same public-domain verification
// and safety-flagging process — do not add one here casually.
export const SOURCES = {
  culpeper: {
    title: 'The Complete Herbal',
    author: 'Nicholas Culpeper',
    year: '1653 (1850 edition)',
    url: 'https://www.gutenberg.org/files/49513/49513-h/49513-h.htm',
    license: 'Public domain',
  },
  lewer: {
    title: 'A Book of Simples',
    author:
      'transcribed by Henry William Lewer (manuscript c.1600s, published 1908)',
    year: '1908',
    url: 'https://www.gutenberg.org/files/53951/53951-h/53951-h.htm',
    license: 'Public domain',
  },
};

export const APPROVED_SOURCE_TITLES = Object.values(SOURCES).map((s) => s.title);
