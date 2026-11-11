// Blog post (code post, see ../blog-posts.mjs). Sources: nippon.com article by the
// sociologist Kikkawa Toru (Nov 2025), Wikipedia "Yaoya Oshichi" and "Hinoe uma"
// (both flagged on Wikipedia for weak sourcing, so uncertain points are said to be
// uncertain), Wikipedia vital statistics for Japan's 1965-67 births.
const content = `
<p>Every explanation of Japan's Fire Horse superstition sooner or later reaches the same name: Yaoya Oshichi, a teenage greengrocer's daughter who was burned at the stake in Edo, today's Tokyo, in 1683. Her story is the most common explanation for why, in Japan, the Fire Horse came to mean a woman who brings ruin. Here is what is known about her, what is legend, and how a 17th-century love story reached the birth statistics of 1966.</p>

<h2>A fire, a temple and a crush</h2>

<p>According to <a href="https://en.wikipedia.org/wiki/Yaoya_Oshichi" target="_blank" rel="noopener">Wikipedia's account</a>, Oshichi was the daughter of a greengrocer (<em>yaoya</em>) in the Hongō district of Edo. During a great fire in Edo in December 1682 she met a young temple page at her family's temple, and fell in love with him.</p>

<p>The next year she tried to set a fire herself, hoping that another disaster would bring her back to him. She was caught. The magistrate, the story goes, asked whether she was fifteen, because anyone younger than sixteen could not be put to death; she answered that she was sixteen. She was burned at the stake at the Suzugamori execution ground, and Wikipedia gives the date as 29 March 1683.</p>

<h2>How a love story became a curse</h2>

<p>The key detail is her birth year. Later accounts placed it in 1666, a Fire Horse year (丙午, <em>hinoeuma</em>). The sociologist Kikkawa Tōru, who wrote a book on the subject, sums up the folk version on <a href="https://www.nippon.com/en/japan-topics/g02550/" target="_blank" rel="noopener">nippon.com</a>: Oshichi "was born in the Year of the Fire Horse (1666)", and her arson story "was a favorite theme of ningyō jōruri puppet theater."</p>

<p>The fire part of the belief is older than her. <a href="https://en.wikipedia.org/wiki/Hinoe_uma" target="_blank" rel="noopener">Wikipedia's hinoeuma article</a> says the earliest form, in the early Edo period, was simply that "there are many fires in the year of the fire horse." Oshichi's story moved it onto women. Kikkawa describes what spread in the Edo period as a "malicious story" that Fire Horse women were hot-tempered and "would eat their husbands alive", carried by puppet theater and popular books "with no rational evidence to back it up."</p>

<p>Literature did the rest. The writer Ihara Saikaku put her in <em>Five Women Who Loved Love</em> (<em>Kōshoku Gonin Onna</em>) three years after her death, and the puppet and kabuki stages kept retelling her for centuries, in some versions softening the arson into a girl ringing the fire bell to reach her lover.</p>

<h2>What is actually known about her birth</h2>

<p>Very little. Wikipedia's infobox gives her birth as "c. 1667" while its text says she was born in 1666. The hinoeuma article explains where 1666 comes from: the Edo writer Baba Bunkō worked it out from her age when she hung a votive plaque at Tennō-ji temple in 1676, and his account "has long been considered a true story, although it has been denied in modern times." It also points out a clash: born in 1666 and counting ages the Edo way, she would have been 18 in 1683, while Saikaku has her at 16.</p>

<p>So the woman at the root of the Fire Horse curse may not have been a Fire Horse at all. The story never needed her to be. It needed a dramatic girl, a fire and a year that repeats every 60 years.</p>

<h2>From the stage to the census</h2>

<p>The belief outlived the Edo period. Kikkawa writes that the women born in the 1906 Fire Horse year "found it difficult to get married" when they reached marriageable age around 1925, and that a number of unmarried women died by suicide. Births in 1906 were only about 4% lower than in 1905, but by 1966 the fear had a mass audience. Japan recorded 1,360,974 births that year, against 1,823,697 in 1965 and 1,935,647 in 1967 (<a href="https://en.wikipedia.org/wiki/Demographics_of_Japan" target="_blank" rel="noopener">ministry counts</a>). Kikkawa estimates that 1966 had about 414,000 fewer births than expected, while 1965 had 87,000 and 1967 had 123,000 more: many families simply moved a child out of the Fire Horse year.</p>

<blockquote>A crime of passion from 1683, retold for almost three centuries, became the best-known root of a superstition that still cut Japan's births by a quarter in 1966.</blockquote>

<p>Sixty years later, the story seems to have run out of power. In the first half of 2026, Japan's births went up slightly instead of down; we go through the numbers in <a href="/blog/hinoeuma-2026-japan-births">Hinoeuma 2026: Japan's births rose, not fell</a>. For the 1966 story in full, see <a href="/blog/japan-fire-horse-superstition-birth-rate">Japan's Fire Horse superstition and the birth rate</a> and our encyclopedia entry on <a href="/encyclopedia/fire-horse-myths-superstitions">Fire Horse myths and superstitions</a>.</p>
`

/** @type {import('../blog-posts.d.mts').CodeBlogPost} */
export default {
  id: 'code-yaoya-oshichi-fire-horse-curse-origin',
  slug: 'yaoya-oshichi-fire-horse-curse-origin',
  title: 'Yaoya Oshichi: The 1683 Story Behind the Fire Horse Curse',
  excerpt:
    "A greengrocer's daughter burned at the stake in Edo in 1683 is why Japan feared Fire Horse girls. What is known, what is legend, and how it reached 1966.",
  content,
  authorName: 'FireHorse Team',
  tags: ['japan', 'history', 'hinoeuma'],
  readTime: 5,
  publishedAt: '2026-11-11T07:00:00.000Z',
}
