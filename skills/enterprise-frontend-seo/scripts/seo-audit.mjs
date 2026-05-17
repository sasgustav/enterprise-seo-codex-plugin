#!/usr/bin/env node
/*
 Enterprise Frontend SEO heuristic scanner.

 Purpose:
 - Give Codex a fast first-pass view of a JavaScript frontend repository.
 - This is not a replacement for crawling, rendering, Search Console, GA4, or manual review.

 Usage:
   node scripts/seo-audit.mjs
   node scripts/seo-audit.mjs --json
   node scripts/seo-audit.mjs --markdown
   node scripts/seo-audit.mjs --out seo-audit.md
*/

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);

function getArgValue(name) {
  const eq = rawArgs.find(arg => arg.startsWith(`${name}=`));
  if (eq) return eq.slice(name.length + 1);
  const index = rawArgs.findIndex(arg => arg === name);
  return index >= 0 ? rawArgs[index + 1] : null;
}

const rootArg = getArgValue('--root');
const cwd = path.resolve(rootArg || process.cwd());
const outFile = getArgValue('--out');

const MAX_FILE_BYTES = 350_000;
const MAX_SCAN_FILES = Number(process.env.SEO_AUDIT_MAX_FILES || 20_000);
const SOURCE_EXTENSIONS = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.html', '.mdx', '.vue', '.svelte'
]);
const SKIP_DIRS = new Set([
  'node_modules', '.git', '.next', 'out', 'dist', 'build', '.cache', 'coverage', '.turbo', '.vercel', 'vendor', 'tmp', 'temp', '.angular', '.gradle', '.idea', '.vscode'
]);

function fileExists(relativePath) {
  return fs.existsSync(path.join(cwd, relativePath));
}


function looksLikeFrontendProject() {
  return [
    'package.json',
    'next.config.js',
    'next.config.ts',
    'gatsby-config.js',
    'gatsby-config.ts',
    'angular.json',
    'vite.config.js',
    'vite.config.ts',
    'app',
    'src',
    'pages',
    'public',
  ].some(fileExists);
}

function isFilesystemRoot(dir) {
  return path.resolve(dir) === path.parse(path.resolve(dir)).root;
}

function readJson(relativePath) {
  const fullPath = path.join(cwd, relativePath);
  if (!fs.existsSync(fullPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch (error) {
    return { __parseError: String(error) };
  }
}

function safeRead(fullPath) {
  try {
    const stat = fs.statSync(fullPath);
    if (stat.size > MAX_FILE_BYTES) return '';
    return fs.readFileSync(fullPath, 'utf8');
  } catch {
    return '';
  }
}

function walk(dir, acc = []) {
  if (acc.length >= MAX_SCAN_FILES) return acc;
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.') && !['.env.example'].includes(entry.name)) {
      if (entry.name !== '.well-known') continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(fullPath, acc);
      if (acc.length >= MAX_SCAN_FILES) return acc;
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (SOURCE_EXTENSIONS.has(ext) || ['robots.txt', 'sitemap.xml', 'package.json'].includes(entry.name)) {
        acc.push(fullPath);
      }
    }
  }
  return acc;
}

function rel(fullPath) {
  return path.relative(cwd, fullPath).replaceAll(path.sep, '/');
}

function hasAny(content, patterns) {
  return patterns.some(pattern => pattern.test(content));
}

function countMatches(files, regex) {
  let count = 0;
  for (const file of files) {
    const content = safeRead(file);
    const matches = content.match(regex);
    if (matches) count += matches.length;
  }
  return count;
}

function findFiles(files, regex) {
  const matches = [];
  for (const file of files) {
    const content = safeRead(file);
    if (regex.test(content)) matches.push(rel(file));
  }
  return matches;
}

function addFinding(findings, severity, area, finding, evidence, recommendation) {
  findings.push({ severity, area, finding, evidence, recommendation });
}

if ((isFilesystemRoot(cwd) || !looksLikeFrontendProject()) && !args.has('--allow-any-root')) {
  const result = {
    generatedAt: new Date().toISOString(),
    root: cwd,
    framework: ['unknown'],
    rendering: ['unknown'],
    packageManager: 'unknown',
    scripts: {},
    summary: { P0: 0, P1: 0, P2: 1, P3: 0 },
    findings: [{
      severity: 'P2',
      area: 'repo',
      finding: 'Diretório não parece ser raiz de projeto frontend',
      evidence: 'Nenhum package.json/config conhecido foi encontrado ou o scanner foi executado na raiz do filesystem.',
      recommendation: 'Execute novamente a partir da raiz do projeto ou use --root /caminho/do/projeto. Use --allow-any-root apenas intencionalmente.',
    }],
  };

  const output = args.has('--json') && !args.has('--markdown')
    ? JSON.stringify(result, null, 2)
    : toMarkdown(result);

  if (outFile) {
    fs.writeFileSync(path.resolve(cwd, outFile), output, 'utf8');
    console.log(`Wrote ${outFile}`);
  } else {
    console.log(output);
  }
  process.exit(0);
}

const pkg = readJson('package.json');
const deps = {
  ...(pkg?.dependencies || {}),
  ...(pkg?.devDependencies || {}),
};
const depNames = new Set(Object.keys(deps));

const files = walk(cwd);
const sourceFiles = files.filter(file => !rel(file).startsWith('node_modules/'));

const framework = detectFramework();
const rendering = detectRendering();
const findings = [];

function detectFramework() {
  const signals = [];
  if (depNames.has('next') || fileExists('next.config.js') || fileExists('next.config.ts') || fileExists('app')) signals.push('nextjs');
  if (depNames.has('gatsby') || fileExists('gatsby-config.js') || fileExists('gatsby-config.ts')) signals.push('gatsby');
  if (depNames.has('@angular/core') || fileExists('angular.json')) signals.push('angular');
  if (depNames.has('react') || depNames.has('react-dom')) signals.push('react');
  if (depNames.has('vue')) signals.push('vue');
  if (depNames.has('svelte') || depNames.has('@sveltejs/kit')) signals.push('svelte');
  return signals.length ? [...new Set(signals)] : ['unknown'];
}

function detectRendering() {
  const signals = [];
  const all = sourceFiles.map(file => safeRead(file)).join('\n');
  if (/getStaticProps|getStaticPaths|generateStaticParams|revalidate\s*=|output:\s*['"]export['"]/.test(all)) signals.push('SSG/ISR/static-generation');
  if (/getServerSideProps|RenderMode\.Server|renderToPipeableStream|renderToString|renderToReadableStream/.test(all)) signals.push('SSR');
  if (/RenderMode\.Prerender|prerender|getPrerenderParams/.test(all)) signals.push('prerender');
  if (/createRoot\s*\(/.test(all)) signals.push('CSR/createRoot');
  if (/hydrateRoot\s*\(/.test(all)) signals.push('hydration');
  return signals.length ? [...new Set(signals)] : ['unknown'];
}

function runGenericChecks() {
  if (!pkg) {
    addFinding(findings, 'P2', 'repo', 'package.json não encontrado', 'Não foi possível detectar dependências/scripts.', 'Confirmar se o scanner foi executado na raiz do projeto.');
  }

  const robotsPresent = fileExists('public/robots.txt') || fileExists('app/robots.ts') || fileExists('app/robots.js') || fileExists('src/app/robots.ts') || fileExists('src/app/robots.js') || fileExists('robots.txt');
  if (!robotsPresent) {
    addFinding(findings, 'P1', 'robots', 'robots.txt não detectado', 'Não foi encontrado robots.txt estático nem geração framework-native.', 'Adicionar robots.txt ou rota/framework-native equivalente com sitemap de produção.');
  }

  const sitemapPresent = fileExists('public/sitemap.xml') || fileExists('app/sitemap.ts') || fileExists('app/sitemap.js') || fileExists('src/app/sitemap.ts') || fileExists('src/app/sitemap.js') || fileExists('sitemap.xml');
  if (!sitemapPresent) {
    addFinding(findings, 'P1', 'sitemap', 'sitemap não detectado', 'Não foi encontrado sitemap.xml estático nem geração framework-native.', 'Implementar sitemap com URLs canônicas e indexáveis, particionado quando houver escala.');
  }

  const noindexFiles = findFiles(sourceFiles, /noindex|X-Robots-Tag/i);
  if (noindexFiles.length) {
    addFinding(findings, 'P1', 'indexability', 'Diretivas noindex/X-Robots encontradas', noindexFiles.slice(0, 12).join(', '), 'Revisar se as diretivas são intencionais em produção; tratar como P0 se bloquearem páginas públicas.');
  }

  const disallowAllFiles = findFiles(sourceFiles, /Disallow:\s*\/\s*(?:\r?\n|$)/i);
  if (disallowAllFiles.length) {
    addFinding(findings, 'P0', 'robots', 'Possível bloqueio global em robots.txt', disallowAllFiles.join(', '), 'Garantir que `Disallow: /` não vá para produção em propriedades públicas.');
  }

  const canonicalCount = countMatches(sourceFiles, /rel=["']canonical["']/gi);
  if (canonicalCount === 0) {
    addFinding(findings, 'P1', 'canonical', 'Nenhuma canonical detectada', 'Busca por rel="canonical" retornou zero ocorrências.', 'Implementar canonical absoluta por template/rota pública.');
  }

  const jsonLdCount = countMatches(sourceFiles, /application\/ld\+json/gi);
  if (jsonLdCount === 0) {
    addFinding(findings, 'P2', 'structured-data', 'JSON-LD não detectado', 'Nenhum script application/ld+json encontrado.', 'Adicionar structured data para templates elegíveis e validar em Rich Results Test.');
  }

  const hrefLangCount = countMatches(sourceFiles, /hreflang|hrefLang/gi);
  if (hrefLangCount === 0) {
    addFinding(findings, 'P3', 'international', 'hreflang não detectado', 'Não há sinal de implementação hreflang.', 'Se houver múltiplos idiomas/países, implementar alternates recíprocos e self-referential.');
  }

  const badLinks = findFiles(sourceFiles, /onClick=.*(?:navigate|router\.push|history\.pushState)|href=["']#\//is);
  if (badLinks.length) {
    addFinding(findings, 'P1', 'crawlability', 'Possíveis links não ideais para crawling', badLinks.slice(0, 12).join(', '), 'Para rotas públicas, usar âncoras com href real e History API sem depender de fragmentos.');
  }

  const placeholderFiles = findFiles(sourceFiles, /G-XXXXXXXX|GTM-XXXX|UA-XXXX|TODO SEO|CHANGE_ME|example\.com|localhost:3000/i);
  if (placeholderFiles.length) {
    addFinding(findings, 'P2', 'configuration', 'Placeholders detectados', placeholderFiles.slice(0, 12).join(', '), 'Substituir placeholders por configuração via ambiente validada para produção.');
  }

  const piiAnalyticsFiles = findFiles(sourceFiles, /gtag\([^\n]*(email|phone|cpf|cnpj|password|token)|dataLayer\.push\([^\n]*(email|phone|cpf|cnpj|password|token)/i);
  if (piiAnalyticsFiles.length) {
    addFinding(findings, 'P0', 'analytics-privacy', 'Possível PII/segredo em payload analítico', piiAnalyticsFiles.slice(0, 12).join(', '), 'Remover PII/secrets de URLs e eventos; usar contrato de dados aprovado.');
  }
}

function runNextChecks() {
  if (!framework.includes('nextjs')) return;
  const appRouter = fileExists('app') || fileExists('src/app');
  const pagesRouter = fileExists('pages') || fileExists('src/pages');

  if (appRouter) {
    const metadataFiles = findFiles(sourceFiles, /export\s+(?:async\s+)?function\s+generateMetadata|export\s+const\s+metadata/i);
    if (metadataFiles.length === 0) {
      addFinding(findings, 'P1', 'nextjs-metadata', 'App Router sem Metadata API detectada', 'Nenhum `metadata` ou `generateMetadata` encontrado.', 'Usar Metadata API por layout/page para metadata determinística.');
    }
    const nextHeadInApp = findFiles(sourceFiles.filter(file => rel(file).startsWith('app/') || rel(file).startsWith('src/app/')), /from\s+['"]next\/head['"]/);
    if (nextHeadInApp.length) {
      addFinding(findings, 'P2', 'nextjs-metadata', '`next/head` usado no App Router', nextHeadInApp.join(', '), 'Preferir Metadata API no App Router; revisar exceções.');
    }
  }

  if (pagesRouter) {
    const nextHeadFiles = findFiles(sourceFiles, /from\s+['"]next\/head['"]|<Head[\s>]/);
    if (nextHeadFiles.length === 0) {
      addFinding(findings, 'P2', 'nextjs-pages', 'Pages Router sem `next/head`/SEO helper detectado', 'Nenhum uso de Head encontrado.', 'Criar componente SEO centralizado ou revisar se metadata vem de outro mecanismo.');
    }
  }

  const jsonLdFiles = findFiles(sourceFiles, /application\/ld\+json/gi);
  const unsafeJsonLd = jsonLdFiles.filter(file => {
    const content = safeRead(path.join(cwd, file));
    return /dangerouslySetInnerHTML/.test(content) && !/replace\(\/</.test(content) && !/serialize-javascript/.test(content);
  });
  if (unsafeJsonLd.length) {
    addFinding(findings, 'P1', 'structured-data', 'JSON-LD possivelmente sem sanitização', unsafeJsonLd.join(', '), 'Sanitizar payload JSON-LD, por exemplo substituindo `<` por `\\u003c` ou usando serializador aprovado.');
  }
}

function runGatsbyChecks() {
  if (!framework.includes('gatsby')) return;
  const gatsbyConfigFiles = ['gatsby-config.js', 'gatsby-config.ts', 'gatsby-config.mjs'].filter(fileExists);
  if (!gatsbyConfigFiles.length) {
    addFinding(findings, 'P1', 'gatsby', 'gatsby-config não encontrado', 'Dependência Gatsby detectada, mas sem arquivo de configuração na raiz.', 'Confirmar raiz ou adicionar gatsby-config com siteMetadata.');
  } else {
    const hasSiteUrl = gatsbyConfigFiles.some(file => /siteUrl/.test(safeRead(path.join(cwd, file))));
    if (!hasSiteUrl) {
      addFinding(findings, 'P1', 'gatsby', '`siteMetadata.siteUrl` não detectado', gatsbyConfigFiles.join(', '), 'Adicionar siteUrl de produção para canonicals, OG URLs e sitemap.');
    }
  }
  const headExports = findFiles(sourceFiles, /export\s+(?:const|function)\s+Head\b/);
  if (!headExports.length) {
    addFinding(findings, 'P1', 'gatsby-head', 'Gatsby Head API não detectada', 'Nenhum `export Head` encontrado.', 'Usar Gatsby Head API para metadata em páginas/templates.');
  }
}

function runAngularChecks() {
  if (!framework.includes('angular')) return;
  const angularJson = readJson('angular.json');
  if (!angularJson) {
    addFinding(findings, 'P2', 'angular', 'angular.json não encontrado', 'Dependência Angular detectada, mas sem angular.json.', 'Confirmar raiz do workspace.');
  }

  const ssrFiles = findFiles(sourceFiles, /@angular\/ssr|provideServerRendering|RenderMode\.|app\.routes\.server/);
  if (!ssrFiles.length) {
    addFinding(findings, 'P1', 'angular-ssr', 'SSR/prerender Angular não detectado', 'Nenhuma configuração @angular/ssr ou RenderMode encontrada.', 'Para páginas públicas, configurar SSR/prerender/hybrid rendering.');
  }

  const metaTitleFiles = findFiles(sourceFiles, /from\s+['"]@angular\/platform-browser['"].*(Meta|Title)|\bMeta\b|\bTitle\b/s);
  if (!metaTitleFiles.length) {
    addFinding(findings, 'P1', 'angular-metadata', 'Uso de Title/Meta não detectado', 'Nenhum serviço Title/Meta encontrado.', 'Implementar serviço de metadata por rota/template.');
  }

  const browserGlobals = findFiles(sourceFiles, /\b(window|document|navigator|location)\./);
  if (browserGlobals.length && ssrFiles.length) {
    addFinding(findings, 'P2', 'angular-ssr', 'Browser globals em projeto com SSR', browserGlobals.slice(0, 12).join(', '), 'Proteger browser-only APIs com abstrações Angular, DI, platform checks ou execução client-only.');
  }
}

function runReactChecks() {
  if (!framework.includes('react') || framework.includes('nextjs') || framework.includes('gatsby')) return;
  const createRootFiles = findFiles(sourceFiles, /createRoot\s*\(/);
  const hydrateRootFiles = findFiles(sourceFiles, /hydrateRoot\s*\(/);
  if (createRootFiles.length && !hydrateRootFiles.length) {
    addFinding(findings, 'P1', 'react-rendering', 'React CSR detectado sem hidratação', createRootFiles.slice(0, 12).join(', '), 'Se houver páginas públicas estratégicas, implementar SSR/SSG/prerender ou confirmar que app é não-indexável.');
  }
  const indexHtmlFiles = sourceFiles.filter(file => rel(file).endsWith('index.html'));
  if (indexHtmlFiles.length) {
    const hasDescription = indexHtmlFiles.some(file => /<meta\s+name=["']description["']/i.test(safeRead(file)));
    if (!hasDescription) {
      addFinding(findings, 'P2', 'react-metadata', 'index.html sem meta description detectada', indexHtmlFiles.map(rel).join(', '), 'Adicionar metadata fallback e avaliar SSR/SSG para páginas públicas.');
    }
  }
}

function runAnalyticsChecks() {
  const gtmFiles = findFiles(sourceFiles, /GTM-[A-Z0-9]+|googletagmanager\.com\/gtm\.js|dataLayer\.push/i);
  const ga4Files = findFiles(sourceFiles, /G-[A-Z0-9]{4,}|gtag\(|googletagmanager\.com\/gtag\/js/i);
  const pageViewManual = findFiles(sourceFiles, /page_view|send_page_view|virtual_pageview|routeChangeComplete|NavigationEnd|useLocation\(/i);

  if (!gtmFiles.length && !ga4Files.length) {
    addFinding(findings, 'P2', 'analytics', 'GA4/GTM não detectado', 'Nenhum sinal de GTM, gtag, dataLayer ou GA4 encontrado.', 'Implementar medição conforme governança: GTM/dataLayer para enterprise ou gtag para stack simples.');
  }

  if ((framework.includes('react') || framework.includes('angular') || rendering.includes('CSR/createRoot')) && !pageViewManual.length) {
    addFinding(findings, 'P1', 'analytics-spa', 'Medição de SPA pageviews não detectada', 'Projeto SPA/híbrido sem sinais de page_view em navegação.', 'Verificar enhanced measurement por history events ou adicionar listener de rota com prevenção de duplicidade.');
  }

  const ecommerceFiles = findFiles(sourceFiles, /purchase|add_to_cart|begin_checkout|view_item|items\s*:/i);
  if (ecommerceFiles.length) {
    const hasCurrency = ecommerceFiles.some(file => /currency/.test(safeRead(path.join(cwd, file))));
    if (!hasCurrency) {
      addFinding(findings, 'P1', 'analytics-ecommerce', 'Eventos ecommerce sem currency detectado', ecommerceFiles.slice(0, 12).join(', '), 'Em GA4 ecommerce, enviar currency quando value/revenue for enviado.');
    }
  }
}

runGenericChecks();
runNextChecks();
runGatsbyChecks();
runAngularChecks();
runReactChecks();
runAnalyticsChecks();

const severityOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
findings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity] || a.area.localeCompare(b.area));

const result = {
  generatedAt: new Date().toISOString(),
  root: cwd,
  framework,
  rendering,
  packageManager: detectPackageManager(),
  scripts: pkg?.scripts || {},
  summary: summarize(findings),
  findings,
};

function detectPackageManager() {
  if (fileExists('pnpm-lock.yaml')) return 'pnpm';
  if (fileExists('yarn.lock')) return 'yarn';
  if (fileExists('package-lock.json')) return 'npm';
  if (fileExists('bun.lockb') || fileExists('bun.lock')) return 'bun';
  return 'unknown';
}

function summarize(items) {
  return items.reduce((acc, item) => {
    acc[item.severity] = (acc[item.severity] || 0) + 1;
    return acc;
  }, { P0: 0, P1: 0, P2: 0, P3: 0 });
}

function toMarkdown(data) {
  const lines = [];
  lines.push('# Enterprise Frontend SEO Heuristic Audit');
  lines.push('');
  lines.push(`- Generated: ${data.generatedAt}`);
  lines.push(`- Root: ${data.root}`);
  lines.push(`- Framework signals: ${data.framework.join(', ')}`);
  lines.push(`- Rendering signals: ${data.rendering.join(', ')}`);
  lines.push(`- Package manager: ${data.packageManager}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('| Severity | Count |');
  lines.push('|---|---:|');
  for (const sev of ['P0', 'P1', 'P2', 'P3']) lines.push(`| ${sev} | ${data.summary[sev] || 0} |`);
  lines.push('');
  lines.push('## Findings');
  lines.push('');
  lines.push('| Severity | Area | Finding | Evidence | Recommendation |');
  lines.push('|---|---|---|---|---|');
  for (const finding of data.findings) {
    lines.push(`| ${escapeMd(finding.severity)} | ${escapeMd(finding.area)} | ${escapeMd(finding.finding)} | ${escapeMd(finding.evidence)} | ${escapeMd(finding.recommendation)} |`);
  }
  if (!data.findings.length) lines.push('| - | - | Nenhum achado heurístico | - | Executar validação externa/crawler/rendering. |');
  lines.push('');
  lines.push('## Notes');
  lines.push('');
  lines.push('- This scanner is heuristic. Validate with rendered HTML, crawler, Search Console, GA4 DebugView, Tag Assistant, and field Core Web Vitals data.');
  return lines.join('\n');
}

function escapeMd(value) {
  return String(value || '')
    .replaceAll('|', '\\|')
    .replaceAll('\n', ' ')
    .slice(0, 600);
}

const output = args.has('--json') && !args.has('--markdown')
  ? JSON.stringify(result, null, 2)
  : toMarkdown(result);

if (outFile) {
  fs.writeFileSync(path.resolve(cwd, outFile), output, 'utf8');
  console.log(`Wrote ${outFile}`);
} else {
  console.log(output);
}
