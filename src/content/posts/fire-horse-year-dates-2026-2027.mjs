// Blog post (code post, see ../blog-posts.mjs). Sources: Hong Kong Observatory
// Gregorian-Lunar conversion tables 2026 and 2027 (Lunar New Year 17 Feb 2026 and
// 6 Feb 2027; Spring Commences 4 Feb in both years); NAOJ (National Astronomical
// Observatory of Japan) Reki-yoko 2026 and 2027 (risshin 4 Feb 05:02 JST in 2026,
// 4 Feb 10:46 JST in 2027, times in Japan Standard Time); Japanese Wikipedia 干支
// (modern Japan applies eto to the solar-calendar year; traditionally and in some
// fortune-telling the risshun-to-risshun solar month; China applies it to the
// lunisolar calendar); National Diet Library "History of the calendar" (Gregorian
// calendar from 1 January Meiji 6 = 1873); Wikipedia Tet (Tet 17 Feb 2026, 6 Feb 2027).
const content = `
<p>The Fire Horse year has no single start date. Which year a baby belongs to depends on which calendar you ask, and for a few weeks around the turn of the year the answers disagree. If your baby is due in January or February 2027, or was born near the edges of 2026, this is the short, checked version.</p>

<h2>The popular rule: Lunar New Year</h2>

<p>Most people who say "Chinese zodiac" mean the year that begins on Lunar New Year. By the Hong Kong Observatory's <a href="https://www.hko.gov.hk/en/gts/time/calendar/text/files/T2026e.txt" target="_blank" rel="noopener">conversion table for 2026</a> (titled Bing-wu, year of the Horse), the first day of the first lunar month is <strong>17 February 2026</strong>. Its <a href="https://www.hko.gov.hk/en/gts/time/calendar/text/files/T2027e.txt" target="_blank" rel="noopener">table for 2027</a> (Ding-wei, year of the Goat) puts Lunar New Year on <strong>6 February 2027</strong>.</p>

<p>So by this rule the Horse year runs from 17 February 2026 to 5 February 2027. Anyone born from 1 January to 16 February 2026 is a Snake. Anyone born from 6 February 2027 onwards is a Goat.</p>

<h2>The solar rule: Lichun</h2>

<p>The Four Pillars (BaZi) system and other fortune-telling traditions do not use Lunar New Year. They change the year at <em>Lichun</em> (立春, <em>risshun</em> in Japanese), the start of spring, when the sun reaches 315 degrees of ecliptic longitude. The Hong Kong Observatory lists "Spring Commences" on 4 February in both <a href="https://www.hko.gov.hk/en/gts/time/calendar/text/files/T2026e.txt" target="_blank" rel="noopener">2026</a> and <a href="https://www.hko.gov.hk/en/gts/time/calendar/text/files/T2027e.txt" target="_blank" rel="noopener">2027</a>.</p>

<p>Because the year turns at a precise moment, the time of day matters on 4 February. Japan's National Astronomical Observatory gives the moment in Japan Standard Time: <a href="https://eco.mtk.nao.ac.jp/koyomi/yoko/2026/rekiyou262.html" target="_blank" rel="noopener">5:02 on 4 February 2026</a>, and <a href="https://eco.mtk.nao.ac.jp/koyomi/yoko/2027/rekiyou272.html" target="_blank" rel="noopener">10:46 on 4 February 2027</a>. China and Hong Kong are one hour behind Japan, so that is around 4:00 and 9:45 local time there. By this rule the Horse year runs from around 4 February 2026 to around 4 February 2027, with a Goat year starting just after.</p>

<h2>Japan: the calendar year</h2>

<p>In modern Japan the answer is simpler. Japanese Wikipedia's article on <a href="https://ja.wikipedia.org/wiki/%E5%B9%B2%E6%94%AF" target="_blank" rel="noopener">干支 (eto)</a> says that in present-day Japan the eto is mostly applied to the year of the solar calendar. Japan adopted the Gregorian calendar in 1873: the National Diet Library <a href="https://www.ndl.go.jp/koyomi/e/history/calendar.html" target="_blank" rel="noopener">notes</a> that 3 December of the fifth year of Meiji became 1 January of the sixth.</p>

<p>So hinoeuma, the Japanese Fire Horse, is <strong>1 January to 31 December 2026</strong>. A baby born on 20 January 2027 in Japan is a Goat-year baby, whatever Chinese calendars say.</p>

<p>The same Wikipedia article adds that traditionally the eto was often applied to the period from one Lichun to the day before the next, and that some fortune-telling still does so. Japan's old Fire Horse fear is a separate matter, and we cover it in <a href="/blog/hinoeuma-2026-japan-births">what Japan's 2026 births show</a>.</p>

<h2>Worked examples</h2>

<p><strong>Born 10 February 2026.</strong> Lunar New Year (17 February) has not happened yet, so the Chinese zodiac by that rule says Snake. Lichun has passed (4 February), so the solar rule says Horse. In Japan it is a hinoeuma year, so Horse.</p>

<p><strong>Born 20 January 2027.</strong> Horse by Lunar New Year, since the new year begins on 6 February. Horse by Lichun, which has not yet arrived. In Japan it is already 2027, so a Goat year, not a hinoeuma.</p>

<p><strong>Born 5 February 2027.</strong> Horse by Lunar New Year, because that year begins the next day. Goat by Lichun, which passed on 4 February. Goat in Japan.</p>

<p><strong>Born 4 February 2027.</strong> The one real edge case. Under the solar rule it depends on the hour: before around 9:45 in China (10:46 in Japan) it is still Horse, after that Goat. If this is your baby, ask whoever will do the reading which time zone and which rule they use.</p>

<p><strong>Born 7 February 2027.</strong> Goat in every system.</p>

<p>For other years, the free calculator on our sister site <a href="https://wuxingzodiac.me/calculator" target="_blank" rel="noopener">Wu Xing Zodiac</a> checks the Lunar New Year date for you. (It uses the Lunar New Year rule, not Lichun.)</p>

<h2>Vietnam</h2>

<p>Vietnam's lunar calendar is computed for its own time zone and can occasionally differ from China's by a day. <a href="https://en.wikipedia.org/wiki/T%E1%BA%BFt" target="_blank" rel="noopener">Wikipedia's article on Tết</a> lists 17 February 2026 and 6 February 2027, the same dates as the Chinese ones above, so for 2026 and 2027 the Vietnamese and Chinese Lunar New Year rules give the same answer.</p>

<h2>Why it matters less than it seems</h2>

<p>The calendars disagree because the zodiac is a convention, not a measurement. Lunar New Year follows the moon, Lichun follows the sun and Japan follows the civil calendar. None of them can tell you anything about a particular baby.</p>

<p>The fear behind all this is a superstition, and an old one. Japan's version is usually traced to <a href="/blog/yaoya-oshichi-fire-horse-curse-origin">the 1683 story of Yaoya Oshichi</a>, and in China, where the zodiac began, <a href="/encyclopedia/fire-horse-chinese-culture">the Fire Horse never carried the same fear about daughters</a>. If you want the wider picture, start with <a href="/blog/2026-year-of-fire-horse">our guide to the 2026 Fire Horse year</a>, or see how the 1966 edges work in <a href="/blog/born-1966-turn-60-fire-horse-year">our post for people born in 1966</a>.</p>

<p>For parents, the practical takeaway is small: pick the rule your family uses, check the date, and then let the label go.</p>
`

/** @type {import('../blog-posts.d.mts').CodeBlogPost} */
export default {
  id: 'code-fire-horse-year-dates-2026-2027',
  slug: 'fire-horse-year-dates-2026-2027',
  title: 'Is Your Baby a Fire Horse? Where the 2026 Year Starts and Ends',
  excerpt:
    'When does the Fire Horse year start and end? Lunar New Year, Lichun and Japan give three answers. Checked dates and worked examples for 2026 and 2027 births.',
  content,
  authorName: 'FireHorse Team',
  tags: ['dates', 'calendar', 'parents', '2027'],
  readTime: 6,
  publishedAt: '2026-11-13T08:00:00.000Z',
}
