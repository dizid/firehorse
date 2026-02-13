# Fire Horse UTM Tracking Strategy

## UTM Naming Convention

All campaign URLs follow this structure:
```
?utm_source={platform}&utm_medium={channel}&utm_campaign={campaign_name}&utm_content={variant}
```

### Parameters
- **utm_source**: Traffic source (twitter, linkedin, reddit, newsletter, etc.)
- **utm_medium**: Marketing medium (social, email, organic, referral, etc.)
- **utm_campaign**: Campaign identifier (launch2026, fire_horse_reveal, etc.)
- **utm_content**: Content variant for A/B testing (optional)

---

## Launch 2026 Campaign URLs

### Social Media Channels

#### Twitter/X
| Page | Full URL |
|------|----------|
| Homepage | `https://firehorse.info/?utm_source=twitter&utm_medium=social&utm_campaign=launch2026` |
| Compatibility | `https://firehorse.info/compatibility?utm_source=twitter&utm_medium=social&utm_campaign=launch2026` |
| Encyclopedia | `https://firehorse.info/encyclopedia?utm_source=twitter&utm_medium=social&utm_campaign=launch2026` |
| Blog | `https://firehorse.info/blog?utm_source=twitter&utm_medium=social&utm_campaign=launch2026` |
| Forum | `https://firehorse.info/forum?utm_source=twitter&utm_medium=social&utm_campaign=launch2026` |

#### LinkedIn
| Page | Full URL |
|------|----------|
| Homepage | `https://firehorse.info/?utm_source=linkedin&utm_medium=social&utm_campaign=launch2026` |
| Compatibility | `https://firehorse.info/compatibility?utm_source=linkedin&utm_medium=social&utm_campaign=launch2026` |
| Encyclopedia | `https://firehorse.info/encyclopedia?utm_source=linkedin&utm_medium=social&utm_campaign=launch2026` |
| Blog | `https://firehorse.info/blog?utm_source=linkedin&utm_medium=social&utm_campaign=launch2026` |

#### Reddit
| Page | Full URL |
|------|----------|
| Homepage | `https://firehorse.info/?utm_source=reddit&utm_medium=social&utm_campaign=launch2026` |
| Compatibility | `https://firehorse.info/compatibility?utm_source=reddit&utm_medium=social&utm_campaign=launch2026` |
| Encyclopedia | `https://firehorse.info/encyclopedia?utm_source=reddit&utm_medium=social&utm_campaign=launch2026` |

#### Instagram Bio Link
| Page | Full URL |
|------|----------|
| Homepage | `https://firehorse.info/?utm_source=instagram&utm_medium=social&utm_campaign=launch2026` |
| Compatibility | `https://firehorse.info/compatibility?utm_source=instagram&utm_medium=social&utm_campaign=launch2026` |

### Email Campaigns

#### Welcome Email
| Page | Full URL |
|------|----------|
| Homepage | `https://firehorse.info/?utm_source=newsletter&utm_medium=email&utm_campaign=welcome` |
| Compatibility | `https://firehorse.info/compatibility?utm_source=newsletter&utm_medium=email&utm_campaign=welcome` |
| Forum | `https://firehorse.info/forum?utm_source=newsletter&utm_medium=email&utm_campaign=welcome` |

#### Weekly Newsletter
| Page | Full URL |
|------|----------|
| Blog Article | `https://firehorse.info/blog/{slug}?utm_source=newsletter&utm_medium=email&utm_campaign=weekly` |
| Encyclopedia | `https://firehorse.info/encyclopedia?utm_source=newsletter&utm_medium=email&utm_campaign=weekly` |

---

## Content-Specific Campaigns

### Compatibility Tool Share (User-Generated)
```
https://firehorse.info/compatibility?utm_source=twitter&utm_medium=social&utm_campaign=result_share
```

### Blog Post Promotions
```
https://firehorse.info/blog/{slug}?utm_source={platform}&utm_medium=social&utm_campaign=blog_promo&utm_content={post_title_slug}
```

---

## Short URL Strategy (Future)

For character-limited platforms (Twitter, SMS):
- Use bit.ly or custom domain shortener
- Map short URLs to full UTM-tracked URLs
- Track click-through rates via shortener analytics + GA4

Example:
```
bit.ly/fh2026 → https://firehorse.info/?utm_source=twitter&utm_medium=social&utm_campaign=launch2026
```

---

## GA4 Event Tracking Integration

All UTM parameters are automatically captured by GA4 as traffic source dimensions:
- `First user source` (utm_source)
- `First user medium` (utm_medium)
- `First user campaign` (utm_campaign)
- `First user content` (utm_content)

Cross-reference with custom events:
- `compatibility_check_complete` - Which source drives most completions?
- `newsletter_signup` - Which channel has best conversion rate?
- `blog_read` - Which traffic source engages most with content?
- `encyclopedia_article_view` - Deep dive traffic analysis

---

## Budget Allocation by Channel (If Running Paid Ads)

| Channel | Daily Budget | Expected CPC | Est. Clicks/Day |
|---------|--------------|--------------|-----------------|
| Twitter Ads | $20 | $0.50 | 40 |
| LinkedIn Ads | $15 | $2.00 | 7-8 |
| Reddit Ads | $10 | $0.30 | 33 |
| **Total** | **$45/day** | — | **~80 clicks** |

**Note**: Current implementation is organic-only (no ad spend). Use UTM tracking to measure organic performance first, then scale with paid if ROI is positive.

---

## Next Steps

1. Add UTM parameters to all outbound social posts
2. Configure Newsletter platform to auto-append UTM tags
3. Monitor GA4 Acquisition reports weekly
4. A/B test landing page variants using `utm_content` parameter
5. Create custom GA4 reports for campaign performance comparison
