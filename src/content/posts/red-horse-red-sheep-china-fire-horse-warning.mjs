// Blog post (code post, see ../blog-posts.mjs). Sources: United Daily News (UDN,
// Taiwan, 24 Dec 2025) on 赤馬紅羊劫 (Hong Mai, Chai Wang's 丙丁龜鑑, Yu Yue's
// critique, Ko Po-cheng), Chinese Wikipedia 丙午 (symbol of change and calamity;
// 1126 fall of the Northern Song), nippon.com (Kikkawa Toru) on Japan's taboo.
const content = `
<p>In Japan the Fire Horse was a warning about daughters. In China, where the zodiac began, that fear about daughters never took hold. But China has its own, much older warning about these years, and it is aimed at whole countries rather than at brides. It is called the <em>Red Horse, Red Sheep</em> calamity, 赤馬紅羊劫, and with 2026 a Fire Horse year and 2027 a Fire Goat year, it is back in Chinese-language headlines.</p>

<h2>Two fire years in a row</h2>

<p>The sixty-year calendar pairs ten "stems" with twelve animals. 丙午 is the Fire Horse (yang fire) and the year after it, 丁未, is the Fire Goat (yin fire), so every sixty years two fire years arrive back to back. <a href="https://zh.wikipedia.org/wiki/%E4%B8%99%E5%8D%88" target="_blank" rel="noopener">Chinese Wikipedia's article on 丙午</a> notes that in traditional Chinese and Japanese metaphysics some hold the fire of 丙午 to be too strong, making it "a symbol of change and frequent calamity", the red horse of the Red Horse, Red Sheep calamity.</p>

<p>The name explains itself once you know the symbols. Taiwan's United Daily News <a href="https://udn.com/news/story/7268/9222783" target="_blank" rel="noopener">sums them up</a>: red stands for fire, bloodshed and war; the horse for weapons, marching and war horses; and the "red sheep" is the 未 year, whose stem 丁 is yin fire. ("Sheep" and "goat" are the same animal in the Chinese zodiac.)</p>

<h2>Where the idea comes from</h2>

<p>According to UDN, the idea goes back to the Southern Song dynasty. The scholar Hong Mai wrote of "the calamities of the Bingwu and Dingwei years" in his notebook <em>Rongzhai Suibi</em>, and Chai Wang's <em>Bingding Guijian</em> (丙丁龜鑑) listed <strong>21 upheavals or natural disasters in 丙午 and 丁未 years over about 1,260 years</strong>, from King Zhaoxiang of Qin to the Later Han's Tianfu era. Its purpose, UDN writes, was to remind Southern Song society of the lesson of the Jingkang humiliation, but it "also deepened beliefs about calamity."</p>

<p>The Jingkang disaster itself is the classic example. Chinese Wikipedia's list of 丙午 years includes 1126, when Jin armies entered the Northern Song capital Bianjing (Kaifeng) and the dynasty fell. The emperor and the retired emperor were carried off the next year, a 丁未 year.</p>

<h2>The skeptics</h2>

<p>The idea had critics long before modern statistics. UDN reports that the Qing scholar Yu Yue studied where Red Horse, Red Sheep came from and concluded that most of it was later people's forced interpretation, adding that whether such disasters happen "depends on the state of human affairs and the rise and fall of fortune, and cannot be generalized."</p>

<p>The numbers support him. 1,260 years is 21 sixty-year cycles, so 21 disasters is about one for each pair of fire years. In a history as long and eventful as China's, something bad can be found in almost any two-year window; the list says more about how often history is turbulent than about the Fire Horse (our own arithmetic, not a claim from the sources). The same UDN piece also notes that 丙午 and 丁未 years have fallen in calm, prosperous times, such as the Tang dynasty's Zhenguan era.</p>

<blockquote>Japan asked what a Fire Horse year would do to a girl. China asked what it would do to a dynasty. Neither question had an answer in the stars.</blockquote>

<h2>2026 and 2027</h2>

<p>With the Fire Horse year running until 5 February 2027 and the Fire Goat year following it, Chinese-language media have been retelling the Red Horse, Red Sheep idea, mostly to defuse it. The fortune-teller Ko Po-cheng told UDN it "is not a curse of heaven's mandate" but a reminder to watch for pressures piling up, and that if you stay calm and do your part, "every year is an auspicious year."</p>

<p>That is the same arc we have followed on the Japanese side: a story from a turbulent past, retold until it sounded like a law of nature, and slowly losing its grip. See <a href="/blog/yaoya-oshichi-fire-horse-curse-origin">how Japan's version began with Yaoya Oshichi</a>, <a href="/blog/hinoeuma-2026-japan-births">what Japan's 2026 birth figures show</a>, and, for the year ahead, <a href="https://wuxingzodiac.me/blog/2027-year-of-the-fire-goat" target="_blank" rel="noopener">2027, the Year of the Fire Goat</a> on our sister site.</p>
`

/** @type {import('../blog-posts.d.mts').CodeBlogPost} */
export default {
  id: 'code-red-horse-red-sheep-china-fire-horse-warning',
  slug: 'red-horse-red-sheep-china-fire-horse-warning',
  title: "China's Own Fire Horse Warning: Red Horse, Red Sheep",
  excerpt:
    "China never feared Fire Horse girls, but an old belief warns that Fire Horse and Fire Goat years bring upheaval. Where it came from and why skeptics doubt it.",
  content,
  authorName: 'FireHorse Team',
  tags: ['china', 'history', '2027'],
  readTime: 5,
  publishedAt: '2026-11-14T03:00:00.000Z',
}
