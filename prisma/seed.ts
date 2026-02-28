import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

interface SectionConfig {
  key: string;
  type: 'text' | 'list' | 'items';
}

interface PostConfig {
  slug: string;
  category: string;
  readTime: number;
  image: string;
  date: string;
  author: string;
  sections: SectionConfig[];
}

// Hardcoded post metadata (from content/blog/posts.ts)
const posts: PostConfig[] = [
  {
    slug: 'sozdanie-lendinga-Moldova-polnoe-rukovodstvo',
    category: 'development',
    readTime: 12,
    image: '/blog/landingmoldova.jpeg',
    date: '2026-02-27',
    author: 'GoQode',
    sections: [
      { key: 'why', type: 'text' },
      { key: 'structure', type: 'list' },
      { key: 'mistakes', type: 'items' },
      { key: 'cost', type: 'text' },
      { key: 'seo', type: 'text' },
      { key: 'tech', type: 'text' },
      { key: 'checklist', type: 'list' },
      { key: 'conclusion', type: 'text' },
    ],
  },
  {
    slug: '5-priznakov-chto-sajtu-nuzhen-redizajn',
    category: 'design',
    readTime: 4,
    image: '/blog/rebranding.jpg',
    date: '2026-02-27',
    author: 'GoQode',
    sections: [
      { key: 'signs', type: 'items' },
      { key: 'action', type: 'text' },
      { key: 'conclusion', type: 'text' },
    ],
  },
  {
    slug: 'skolko-stoit-sait-v-Moldova-2026',
    category: 'development',
    readTime: 15,
    image: '/blog/money.jpg',
    date: '2026-02-27',
    author: 'GoQode',
    sections: [
      { key: 'types', type: 'items' },
      { key: 'factors', type: 'list' },
      { key: 'comparison', type: 'items' },
      { key: 'hidden', type: 'list' },
      { key: 'timeline', type: 'text' },
      { key: 'save', type: 'list' },
      { key: 'checklist', type: 'list' },
      { key: 'conclusion', type: 'text' },
    ],
  },
];

const LOCALES = ['ro', 'en', 'ru'] as const;

function loadMessages(locale: string): Record<string, unknown> {
  const filePath = join(__dirname, '..', '..', 'messages', `${locale}.json`);
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function getNestedValue(obj: unknown, path: string): unknown {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

async function main() {
  console.log('Loading translation files...');
  const messages: Record<string, Record<string, unknown>> = {};
  for (const locale of LOCALES) {
    messages[locale] = loadMessages(locale);
  }

  console.log('Clearing existing blog data...');
  await prisma.blogPost.deleteMany();

  for (const postConfig of posts) {
    const namespace = `BlogPost_${postConfig.slug}`;
    console.log(`\nSeeding post: ${postConfig.slug}`);

    // Create the post
    const post = await prisma.blogPost.create({
      data: {
        slug: postConfig.slug,
        category: postConfig.category,
        readTime: postConfig.readTime,
        image: postConfig.image,
        publishedAt: new Date(postConfig.date),
        author: postConfig.author,
        isPublished: true,
      },
    });

    // Create translations for each locale
    for (const locale of LOCALES) {
      const ns = messages[locale][namespace] as Record<string, unknown> | undefined;
      if (!ns) {
        console.warn(`  Warning: No translations found for ${namespace} in ${locale}`);
        continue;
      }

      const meta = ns.meta as Record<string, string> | undefined;

      await prisma.blogPostTranslation.create({
        data: {
          postId: post.id,
          locale,
          metaTitle: meta?.title ?? '',
          metaDescription: meta?.description ?? '',
          title: (ns.title as string) ?? '',
          intro: (ns.intro as string) ?? '',
        },
      });
      console.log(`  Created ${locale} translation`);
    }

    // Create sections
    for (let i = 0; i < postConfig.sections.length; i++) {
      const sectionConfig = postConfig.sections[i];

      const section = await prisma.blogSection.create({
        data: {
          postId: post.id,
          key: sectionConfig.key,
          type: sectionConfig.type,
          sortOrder: i,
        },
      });

      for (const locale of LOCALES) {
        const ns = messages[locale][namespace] as Record<string, unknown> | undefined;
        if (!ns) continue;

        const sections = ns.sections as Record<string, unknown> | undefined;
        if (!sections) continue;

        const sectionData = sections[sectionConfig.key] as Record<string, unknown> | undefined;
        if (!sectionData) {
          console.warn(`  Warning: No section data for ${sectionConfig.key} in ${locale}`);
          continue;
        }

        // Create section translation
        await prisma.blogSectionTranslation.create({
          data: {
            sectionId: section.id,
            locale,
            title: (sectionData.title as string) ?? '',
            content: (sectionData.content as string) ?? '',
          },
        });

        // Create list items (can be array or object with numeric keys)
        if (sectionConfig.type === 'list' && sectionData.list) {
          const rawList = sectionData.list;
          const list: string[] = Array.isArray(rawList)
            ? rawList
            : Object.keys(rawList as Record<string, string>)
                .sort((a, b) => Number(a) - Number(b))
                .map((k) => (rawList as Record<string, string>)[k]);

          for (let j = 0; j < list.length; j++) {
            await prisma.blogSectionListItem.create({
              data: {
                sectionId: section.id,
                locale,
                sortOrder: j,
                text: list[j],
              },
            });
          }
          console.log(`  Created ${list.length} list items for ${sectionConfig.key} (${locale})`);
        }

        // Create detail items (can be array or object with numeric keys)
        if (sectionConfig.type === 'items' && sectionData.items) {
          const rawItems = sectionData.items;
          const items: { subtitle: string; text: string }[] = Array.isArray(rawItems)
            ? rawItems
            : Object.keys(rawItems as Record<string, { subtitle: string; text: string }>)
                .sort((a, b) => Number(a) - Number(b))
                .map((k) => (rawItems as Record<string, { subtitle: string; text: string }>)[k]);

          for (let j = 0; j < items.length; j++) {
            await prisma.blogSectionDetailItem.create({
              data: {
                sectionId: section.id,
                locale,
                sortOrder: j,
                subtitle: items[j].subtitle,
                text: items[j].text,
              },
            });
          }
          console.log(`  Created ${items.length} detail items for ${sectionConfig.key} (${locale})`);
        }
      }
    }

    console.log(`  Post created with ID: ${post.id}`);
  }

  console.log('\nBlog seed completed!');

  // ═══════════════════════════════════════════════════════
  // CALCULATOR SEED
  // ═══════════════════════════════════════════════════════

  console.log('\nSeeding calculator data...');

  // Check if calculator data already exists
  const existingPT = await prisma.projectType.count();
  if (existingPT > 0) {
    console.log('  Calculator data already exists, skipping...');
  } else {
    // Project Types
    const PROJECT_TYPES = [
      { key: '0', basePriceMin: 300, basePriceMax: 600, isMonthly: false, skipDesign: false },
      { key: '1', basePriceMin: 1500, basePriceMax: 3000, isMonthly: false, skipDesign: false },
      { key: '2', basePriceMin: 500, basePriceMax: 1200, isMonthly: false, skipDesign: false },
      { key: '3', basePriceMin: 2000, basePriceMax: 5000, isMonthly: false, skipDesign: false },
      { key: '4', basePriceMin: 3000, basePriceMax: 7000, isMonthly: false, skipDesign: false },
      { key: '5', basePriceMin: 400, basePriceMax: 1000, isMonthly: false, skipDesign: true },
      { key: '6', basePriceMin: 300, basePriceMax: 800, isMonthly: true, skipDesign: true },
    ];

    for (let i = 0; i < PROJECT_TYPES.length; i++) {
      await prisma.projectType.create({ data: { ...PROJECT_TYPES[i], sortOrder: i } });
    }
    console.log(`  ${PROJECT_TYPES.length} project types`);

    // Design Levels
    const DESIGN_LEVELS = [
      { key: '0', multiplier: 1.0 },
      { key: '1', multiplier: 1.4 },
      { key: '2', multiplier: 1.8 },
    ];

    for (let i = 0; i < DESIGN_LEVELS.length; i++) {
      await prisma.designLevel.create({ data: { ...DESIGN_LEVELS[i], sortOrder: i } });
    }
    console.log(`  ${DESIGN_LEVELS.length} design levels`);

    // Categorized Features
    type F = { key: string; price: [number, number]; recommended?: boolean };
    type Cat = { categoryKey: string; features: F[] };

    const CATEGORIZED_FEATURES: Record<string, Cat[]> = {
      '0': [
        { categoryKey: 'designUx', features: [
          { key: 'animations', price: [40, 140] }, { key: 'parallaxScrolling', price: [25, 80] },
          { key: 'videoBackground', price: [40, 120] }, { key: 'darkLightTheme', price: [25, 80] },
        ]},
        { categoryKey: 'leadCapture', features: [
          { key: 'contactForm', price: [20, 60], recommended: true }, { key: 'emailCapture', price: [25, 80] },
          { key: 'chatWidget', price: [15, 50] }, { key: 'phoneCallback', price: [15, 50] },
          { key: 'quizFunnel', price: [50, 180] },
        ]},
        { categoryKey: 'conversionTrust', features: [
          { key: 'socialProof', price: [20, 60], recommended: true }, { key: 'faqSection', price: [10, 40] },
          { key: 'pricingTable', price: [25, 80] }, { key: 'countdown', price: [15, 50] },
          { key: 'abTesting', price: [50, 180] },
        ]},
        { categoryKey: 'technical', features: [
          { key: 'analytics', price: [30, 110], recommended: true }, { key: 'seo', price: [30, 110], recommended: true },
          { key: 'speedOptimization', price: [25, 80] }, { key: 'cookieConsent', price: [15, 50] },
        ]},
      ],
      '1': [
        { categoryKey: 'storefront', features: [
          { key: 'productCatalog', price: [200, 600], recommended: true }, { key: 'filtersSearch', price: [150, 450], recommended: true },
          { key: 'productVariants', price: [150, 350] }, { key: 'productComparison', price: [100, 250] },
          { key: 'quickView', price: [80, 180] }, { key: 'wishlist', price: [100, 300] },
        ]},
        { categoryKey: 'paymentsOrders', features: [
          { key: 'cartCheckout', price: [300, 900], recommended: true }, { key: 'paymentGateway', price: [350, 1100], recommended: true },
          { key: 'localPayments', price: [200, 600] }, { key: 'orderTracking', price: [150, 350] },
          { key: 'invoiceGeneration', price: [150, 300] },
        ]},
        { categoryKey: 'management', features: [
          { key: 'inventory', price: [200, 650] }, { key: 'shipping', price: [180, 500] },
          { key: 'promoSystem', price: [150, 450] }, { key: 'reviews', price: [100, 250] },
          { key: 'multiCurrency', price: [150, 320] },
        ]},
        { categoryKey: 'growth', features: [
          { key: 'emailIntegration', price: [150, 350] }, { key: 'abandonedCart', price: [180, 400] },
          { key: 'seo', price: [150, 350], recommended: true }, { key: 'analytics', price: [150, 350], recommended: true },
        ]},
      ],
      '2': [
        { categoryKey: 'contentManagement', features: [
          { key: 'cms', price: [200, 600], recommended: true }, { key: 'blog', price: [150, 400] },
          { key: 'mediaGallery', price: [150, 400] }, { key: 'documentLibrary', price: [150, 350] },
        ]},
        { categoryKey: 'companyPages', features: [
          { key: 'teamDirectory', price: [150, 400] }, { key: 'portfolio', price: [200, 600] },
          { key: 'companyTimeline', price: [100, 250] }, { key: 'careers', price: [200, 500] },
          { key: 'clientLogos', price: [80, 200] },
        ]},
        { categoryKey: 'communication', features: [
          { key: 'contactForms', price: [100, 300], recommended: true }, { key: 'mapIntegration', price: [80, 200] },
          { key: 'chatWidget', price: [100, 250] }, { key: 'newsletter', price: [100, 250] },
        ]},
        { categoryKey: 'technical', features: [
          { key: 'multilingual', price: [300, 800] }, { key: 'seo', price: [200, 500], recommended: true },
          { key: 'accessibility', price: [200, 500] }, { key: 'cookieConsent', price: [100, 250] },
        ]},
      ],
      '3': [
        { categoryKey: 'authUsers', features: [
          { key: 'auth', price: [300, 800], recommended: true }, { key: 'socialAuth', price: [200, 500] },
          { key: 'twoFactorAuth', price: [200, 500] }, { key: 'rbac', price: [300, 800] },
          { key: 'userProfiles', price: [200, 500] },
        ]},
        { categoryKey: 'coreFeatures', features: [
          { key: 'adminDashboard', price: [500, 1500], recommended: true }, { key: 'dataVisualization', price: [300, 800] },
          { key: 'searchAndFilters', price: [200, 600] }, { key: 'notifications', price: [300, 900] },
          { key: 'realTimeUpdates', price: [400, 1000] },
        ]},
        { categoryKey: 'dataIntegration', features: [
          { key: 'apiIntegration', price: [400, 1200], recommended: true }, { key: 'dataExport', price: [200, 600] },
          { key: 'fileStorage', price: [200, 600] }, { key: 'crmIntegration', price: [300, 800] },
          { key: 'paymentIntegration', price: [400, 1200] },
        ]},
        { categoryKey: 'infrastructure', features: [
          { key: 'emailSystem', price: [200, 500] }, { key: 'auditLog', price: [200, 500] },
          { key: 'backupRecovery', price: [200, 500] }, { key: 'cicdPipeline', price: [300, 800] },
        ]},
      ],
      '4': [
        { categoryKey: 'platformBase', features: [
          { key: 'tablet', price: [200, 600] }, { key: 'appStoreAssets', price: [150, 400] },
        ]},
        { categoryKey: 'coreFeatures', features: [
          { key: 'pushNotifications', price: [200, 600], recommended: true }, { key: 'socialAuth', price: [200, 600] },
          { key: 'userProfiles', price: [200, 500] }, { key: 'onboarding', price: [150, 400] },
          { key: 'deepLinking', price: [150, 400] },
        ]},
        { categoryKey: 'advanced', features: [
          { key: 'geolocation', price: [200, 600] }, { key: 'camera', price: [200, 600] },
          { key: 'offlineMode', price: [300, 800] }, { key: 'inAppPayments', price: [400, 1200] },
          { key: 'biometricAuth', price: [150, 400] }, { key: 'qrBarcode', price: [150, 400] },
        ]},
        { categoryKey: 'backendAnalytics', features: [
          { key: 'adminPanel', price: [400, 1000] }, { key: 'analytics', price: [200, 500], recommended: true },
          { key: 'chatMessaging', price: [400, 1000] }, { key: 'contentFeed', price: [300, 800] },
          { key: 'videoStreaming', price: [300, 800] },
        ]},
      ],
      '5': [
        { categoryKey: 'coreIdentity', features: [
          { key: 'logoSystem', price: [300, 800], recommended: true }, { key: 'colorPalette', price: [100, 300], recommended: true },
          { key: 'typography', price: [150, 400] }, { key: 'iconography', price: [200, 500] },
          { key: 'illustrations', price: [300, 800] },
        ]},
        { categoryKey: 'documentation', features: [
          { key: 'brandbook', price: [400, 1200], recommended: true }, { key: 'brandGuidelines', price: [150, 400] },
          { key: 'brandStrategy', price: [400, 1000] }, { key: 'namingTagline', price: [300, 800] },
        ]},
        { categoryKey: 'digitalAssets', features: [
          { key: 'socialKit', price: [150, 400] }, { key: 'emailSignature', price: [80, 200] },
          { key: 'presentations', price: [200, 600] }, { key: 'websiteMockups', price: [300, 800] },
        ]},
        { categoryKey: 'print', features: [
          { key: 'stationery', price: [150, 400] }, { key: 'packaging', price: [300, 800] },
          { key: 'signage', price: [200, 600] },
        ]},
      ],
      '6': [
        { categoryKey: 'socialMedia', features: [
          { key: 'smm', price: [300, 800], recommended: true }, { key: 'contentCreation', price: [200, 500] },
          { key: 'communityManagement', price: [200, 500] }, { key: 'influencerOutreach', price: [300, 800] },
        ]},
        { categoryKey: 'paidAds', features: [
          { key: 'targetedAds', price: [400, 1000], recommended: true }, { key: 'googleAds', price: [400, 1200] },
          { key: 'youtubeAds', price: [300, 800] }, { key: 'tiktokAds', price: [300, 800] },
          { key: 'retargeting', price: [200, 500] },
        ]},
        { categoryKey: 'organicGrowth', features: [
          { key: 'seoPromotion', price: [300, 800], recommended: true }, { key: 'contentMarketing', price: [200, 600] },
          { key: 'emailMarketing', price: [200, 600] }, { key: 'localSeo', price: [150, 400] },
        ]},
        { categoryKey: 'strategyAnalytics', features: [
          { key: 'brandStrategy', price: [300, 800] }, { key: 'analyticsReporting', price: [200, 500] },
          { key: 'competitorMonitoring', price: [200, 500] }, { key: 'conversionOptimization', price: [300, 700] },
          { key: 'marketResearch', price: [300, 700] },
        ]},
      ],
    };

    let totalCategories = 0;
    let totalFeatures = 0;
    for (const [ptKey, categories] of Object.entries(CATEGORIZED_FEATURES)) {
      for (let ci = 0; ci < categories.length; ci++) {
        const cat = categories[ci];
        const inserted = await prisma.featureCategory.create({
          data: { projectTypeKey: ptKey, categoryKey: cat.categoryKey, sortOrder: ci },
        });
        totalCategories++;

        for (let fi = 0; fi < cat.features.length; fi++) {
          const f = cat.features[fi];
          await prisma.feature.create({
            data: {
              categoryId: inserted.id,
              key: f.key,
              priceMin: f.price[0],
              priceMax: f.price[1],
              recommended: f.recommended || false,
              sortOrder: fi,
            },
          });
          totalFeatures++;
        }
      }
    }
    console.log(`  ${totalCategories} categories, ${totalFeatures} features`);

    // Scope Modifiers
    type ScopeOpt = { value: string; multiplier: number };
    type ScopeMod = { key: string; options: ScopeOpt[] };

    const SCOPE_MODIFIERS: Record<string, ScopeMod[]> = {
      '0': [
        { key: 'sections', options: [{ value: 'standard', multiplier: 1.0 }, { value: 'extended', multiplier: 1.2 }, { value: 'complex', multiplier: 1.4 }] },
        { key: 'timeline', options: [{ value: 'standard', multiplier: 1.0 }, { value: 'rush', multiplier: 1.3 }] },
      ],
      '1': [
        { key: 'products', options: [{ value: 'small', multiplier: 1.0 }, { value: 'medium', multiplier: 1.2 }, { value: 'large', multiplier: 1.4 }, { value: 'enterprise', multiplier: 1.6 }] },
        { key: 'timeline', options: [{ value: 'standard', multiplier: 1.0 }, { value: 'rush', multiplier: 1.3 }] },
      ],
      '2': [
        { key: 'pages', options: [{ value: 'small', multiplier: 1.0 }, { value: 'medium', multiplier: 1.2 }, { value: 'large', multiplier: 1.4 }, { value: 'enterprise', multiplier: 1.6 }] },
        { key: 'timeline', options: [{ value: 'standard', multiplier: 1.0 }, { value: 'rush', multiplier: 1.3 }] },
      ],
      '3': [
        { key: 'users', options: [{ value: 'startup', multiplier: 1.0 }, { value: 'growing', multiplier: 1.2 }, { value: 'scale', multiplier: 1.5 }, { value: 'enterprise', multiplier: 1.8 }] },
        { key: 'timeline', options: [{ value: 'standard', multiplier: 1.0 }, { value: 'rush', multiplier: 1.3 }] },
      ],
      '4': [
        { key: 'screens', options: [{ value: 'simple', multiplier: 1.0 }, { value: 'moderate', multiplier: 1.2 }, { value: 'complex', multiplier: 1.4 }, { value: 'enterprise', multiplier: 1.7 }] },
      ],
      '5': [
        { key: 'scope', options: [{ value: 'startup', multiplier: 1.0 }, { value: 'rebrand', multiplier: 1.2 }, { value: 'multibrand', multiplier: 1.5 }] },
        { key: 'timeline', options: [{ value: 'standard', multiplier: 1.0 }, { value: 'rush', multiplier: 1.3 }] },
      ],
      '6': [
        { key: 'contract', options: [{ value: 'short', multiplier: 1.0 }, { value: 'medium', multiplier: 0.9 }, { value: 'long', multiplier: 0.8 }] },
      ],
    };

    let totalModifiers = 0;
    let totalOptions = 0;
    for (const [ptKey, mods] of Object.entries(SCOPE_MODIFIERS)) {
      for (let mi = 0; mi < mods.length; mi++) {
        const mod = mods[mi];
        const inserted = await prisma.scopeModifier.create({
          data: { projectTypeKey: ptKey, key: mod.key, sortOrder: mi },
        });
        totalModifiers++;

        for (let oi = 0; oi < mod.options.length; oi++) {
          const opt = mod.options[oi];
          await prisma.scopeModifierOption.create({
            data: {
              scopeModifierId: inserted.id,
              value: opt.value,
              multiplier: opt.multiplier,
              sortOrder: oi,
            },
          });
          totalOptions++;
        }
      }
    }
    console.log(`  ${totalModifiers} scope modifiers, ${totalOptions} options`);
  }

  console.log('\nFull seed completed!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
