// Blog post (code post, see ../blog-posts.mjs). Sources: Japanese Wikipedia 丙午
// (1906 births -4%, 1906 newspaper worries, 1924 Asahi headline, suicide reports
// 1924-26, Soseki's 虞美人草 line), nippon.com article by Kikkawa Toru (Nov 2025),
// English Wikipedia Hinoe uma and Japan's vital statistics.
const content = `
<p>Everyone who writes about the Fire Horse superstition starts with 1966, the year Japan had a quarter fewer babies. But 1966 makes more sense once you know what happened to the girls born in the Fire Horse year before it. The girls of 1906 grew up to carry the curse in full, and their story helps explain why a whole country took a zodiac sign so seriously sixty years later.</p>

<h2>A small dip in births</h2>

<p>In 1906 Japan's families did not avoid the year in large numbers. Births were about 4% lower than in 1905, according to both <a href="https://ja.wikipedia.org/wiki/%E4%B8%99%E5%8D%88" target="_blank" rel="noopener">Japanese Wikipedia's article on 丙午</a> and the vital statistics (1,452,770 births in 1905, 1,394,295 in 1906). The sociologist Kikkawa Tōru goes further on <a href="https://www.nippon.com/en/japan-topics/g02550/" target="_blank" rel="noopener">nippon.com</a>: "the demographic statistics do not show any noticeable dip in births" in 1846 or 1906. <a href="https://en.wikipedia.org/wiki/Hinoe_uma" target="_blank" rel="noopener">English Wikipedia</a> adds a detail that may explain part of the small gap: some boys' births were reportedly recorded in the year before or after.</p>

<p>The worry was there from the first day, though. Japanese Wikipedia notes that newspapers of the time ran articles fretting about the future of girls born on New Year's Day 1906. In Japan the zodiac year starts on 1 January, so those girls were Fire Horses from their first hour.</p>

<h2>A novel names the type</h2>

<p>A year later the idea turned up in literature. In Natsume Sōseki's <em>Gubijinsō</em> (<em>The Poppy</em>, 1907), the proud, beautiful Fujio, who throws the men around her into confusion, is summed up in one line: 「藤尾は丙午である」, "Fujio is a Fire Horse." Japanese Wikipedia points out that Fujio cannot literally have been born in 1906; Sōseki used the word as shorthand for a dangerous woman, which suggests how familiar the stereotype already was.</p>

<h2>The curse comes due</h2>

<p>The real damage came about two decades later, when the girls of 1906 reached marrying age. Kikkawa writes that "as they approached the age of 20 around 1925, they found it difficult to get married, and a number of unmarried women committed suicide." Japanese Wikipedia describes reports of suicides of women, one after another, over broken engagements, despair at marrying late and cruel remarks from family, between 1924 and 1926. One 1924 Asahi Shimbun headline it cites reads, roughly: "This year's 19-year-old girls, troubled by superstition: when marriage seems far off, the Fire Horse gets the blame." (Nineteen was their age in the traditional count, in which a baby is one at birth.)</p>

<blockquote>The 1906 women did nothing but be born in a particular year. A generation later, a matchmaker's question about that year could end an engagement.</blockquote>

<p>According to English Wikipedia, newspapers around 1924 also ran stories denying the superstition. They did not undo it. Forty years later the belief was still strong enough to shape family planning, and Japan recorded <strong>1,360,974 births</strong> that year against 1,823,697 the year before.</p>

<h2>Why it matters in 2026</h2>

<p>The 1906 story is the link between an Edo-period legend and the 1966 statistics. It began with the tale of <a href="/blog/yaoya-oshichi-fire-horse-curse-origin">Yaoya Oshichi</a>, became a real penalty for real women in the 1920s, and turned into family planning in 1966. Sixty years on, the chain looks broken: in the first half of 2026, Japan's births <a href="/blog/hinoeuma-2026-japan-births">went up slightly instead of down</a>. The girls born in this Fire Horse year should never have to hear the question the girls of 1906 heard.</p>
`

/** @type {import('../blog-posts.d.mts').CodeBlogPost} */
export default {
  id: 'code-fire-horse-women-of-1906',
  slug: 'fire-horse-women-of-1906',
  title: 'The Fire Horse Women of 1906: When the Curse Came Due',
  excerpt:
    "Japan's 1906 Fire Horse year barely dented births. Twenty years later its girls struggled to marry. How the 1906 women set the stage for 1966.",
  content,
  authorName: 'FireHorse Team',
  tags: ['japan', 'history', 'hinoeuma'],
  readTime: 5,
  publishedAt: '2026-11-13T03:00:00.000Z',
}
