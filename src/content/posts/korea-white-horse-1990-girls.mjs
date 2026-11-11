// Blog post (code post, see ../blog-posts.mjs). Sources: Cho & Lee, "Punishing
// 'Gender Deviants'?: Women Born in the Year of the White Horse and College
// Selectivity" (Social Science Research 2025; discussion paper at U. Tokyo CSRDA),
// Edlund & Lee, NBER Working Paper 18679 (2013), Korea Times columns (2014, citing
// World Bank Policy Research Paper 4373) and news (28 Oct 2026), Wikipedia.
const content = `
<p>Japan's Fire Horse superstition is the famous one: in 1966, the year of the <em>hinoeuma</em>, Japan had a quarter fewer babies. South Korea had a horse-year stigma of its own, and it struck a different horse in a different way. Its target was the White Horse, and its year was 1990.</p>

<h2>Why 1990 was a "White Horse" year</h2>

<p>Every year in the Chinese calendar pairs an animal with one of five elements, and each element has a traditional color: fire is red, metal is white, and so on (see <a href="https://en.wikipedia.org/wiki/Wuxing_(Chinese_philosophy)" target="_blank" rel="noopener">the five phases</a>). 1990 was a Metal Horse year, 庚午, which in Korea is called the year of the White Horse. 2026, a Fire Horse year, is the Red Horse.</p>

<p>The belief about White Horse women is spelled out by the sociologists Soocheol Cho and Dohoon Lee: because the horse is associated with masculine traits in Korea, <a href="https://csrda.iss.u-tokyo.ac.jp/international/dp/No.61.pdf" target="_blank" rel="noopener">"women born in the White Horse year are presumed to be argumentative, headstrong, and born with 'too much' Yin energy"</a>. In other words, the same fear Japan attached to the Fire Horse: a girl too strong to make a good wife.</p>

<h2>Japan had fewer babies; Korea had fewer girls</h2>

<p>The two superstitions left different marks. In 1966 Japanese families mostly avoided having a child at all that year, so the total number of births fell. Korea's horse-year effect showed up in the balance between boys and girls.</p>

<p>Normally, about 106 boys are born for every 100 girls. The economists Lena Edlund and Chulhee Lee note that Korea's ratio <a href="https://www.nber.org/papers/w18679" target="_blank" rel="noopener">"started to climb in Korea following the introduction of ultra-sound technology in the early 1980s"</a>, and that in 1990, 116.5 boys were born per 100 girls, the peak of the series. A Korea Times column, citing a World Bank study, lists the horse years side by side: <a href="https://www.koreatimes.co.kr/opinion/20140223/what-does-year-of-the-horse-tell-the-unborn" target="_blank" rel="noopener">110 boys per 100 girls in 1978, 116.8 in 1990 and 109.4 in 2002</a> (sources differ slightly on the exact 1990 figure). Each horse year stood out from the years around it.</p>

<p>Prenatal sex screening was the tool. <a href="https://en.wikipedia.org/wiki/Sex-selective_abortion_in_South_Korea" target="_blank" rel="noopener">Wikipedia's summary</a> notes that from 1987 fetal screening was legal only to detect genetic problems, and that in 1990 the government arrested doctors and suspended licenses of those who still told parents the sex. The ratio came down in the following years; Edlund and Lee give a normal 106 by 2007.</p>

<h2>The stigma followed the girls who were born</h2>

<p>The White Horse girls of 1990 did not escape the belief by being born. Cho and Lee studied a nationally representative sample of Korean college graduates and found that <strong>White Horse women, on average, entered less selective colleges than other women, while White Horse men showed no such disadvantage</strong>. Their conclusion: even "a sheer presumption, such as belief about White Horse women", can be enough for women to face social disadvantages. (The paper appeared in <em>Social Science Research</em> in 2025.)</p>

<blockquote>Japan's 1966 Fire Horse thinned out a year. Korea's 1990 White Horse tilted one.</blockquote>

<h2>And in 2026, the Red Horse year?</h2>

<p>So far there is no sign of a horse-year dip in either country. In Korea, births have been rising since mid-2024: <a href="https://www.koreatimes.co.kr/southkorea/20261028/births-up-13-in-august-to-highest-in-7-years" target="_blank" rel="noopener">193,783 babies were born from January to August 2026, up 14.5% on a year earlier</a>, and August was the 26th month in a row with more births than the year before. The Korea Times links the rebound to a growing number of marriages. Japan, the home of the hinoeuma, also counted slightly more births in the first half of 2026; the numbers are in <a href="/blog/hinoeuma-2026-japan-births">Hinoeuma 2026: Japan's births rose, not fell</a>, and the origin of the Japanese belief is in <a href="/blog/yaoya-oshichi-fire-horse-curse-origin">the story of Yaoya Oshichi</a>.</p>

<p>Both superstitions said the same thing about strong women born in a horse year. Both did real harm to a generation. And in the Red Horse year of 2026, parents in both countries seem to have stopped listening.</p>
`

/** @type {import('../blog-posts.d.mts').CodeBlogPost} */
export default {
  id: 'code-korea-white-horse-1990-girls',
  slug: 'korea-white-horse-1990-girls',
  title: "Korea's White Horse Girls: The Other Horse-Year Curse",
  excerpt:
    "Korea's 1990 White Horse year tilted births toward boys: 116.5 per 100 girls. How the belief compares with Japan's Fire Horse, and what 2026 shows.",
  content,
  authorName: 'FireHorse Team',
  tags: ['korea', 'history', 'demographics'],
  readTime: 5,
  publishedAt: '2026-11-12T03:00:00.000Z',
}
