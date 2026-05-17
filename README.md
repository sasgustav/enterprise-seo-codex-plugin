# Enterprise Frontend SEO Codex Plugin

Plugin/skill para auditoria e implementação técnica de SEO e analytics em aplicações JavaScript de alto tráfego, empacotado para uso no Codex como bundle instalável de skill.

## Desenvolvedor

Desenvolvido por [Gustavo Vasconcelos](https://www.linkedin.com/in/gustavo-vasconcelos-software-engineer/).

## Visão rápida

Use este pacote quando quiser que o Codex atue como especialista em SEO técnico enterprise para frontends JavaScript. A skill ajuda a auditar, priorizar e implementar melhorias em:

- **Next.js**: Metadata API, `generateMetadata`, `app/sitemap.ts`, `app/robots.ts`, JSON-LD server-rendered, canonical, OG/Twitter, SSR/SSG/ISR.
- **GatsbyJS**: Gatsby Head API, `siteMetadata.siteUrl`, componentes SEO reutilizáveis, JSON-LD e metadata estática.
- **React SPA/custom**: riscos de CSR, hidratação, anchors rastreáveis, pageviews SPA e metadata fallback.
- **Angular**: SSR/prerender/hybrid rendering, serviços `Title`/`Meta`, status/headers de rota e proteção de browser globals em SSR.
- **SEO técnico enterprise**: crawlability, indexability, robots, sitemap particionado, canonical, hreflang, structured data, soft 404 e internacionalização.
- **Performance SEO**: Core Web Vitals com LCP, INP e CLS; bons thresholds atuais: LCP até 2,5s, INP até 200ms e CLS até 0,1 no percentil 75.
- **Analytics e medição**: GA4, GTM, dataLayer, pageviews SPA, eventos recomendados, ecommerce, DebugView, Tag Assistant, consent mode e prevenção contra PII.

## Quando instalar como plugin ou skill standalone

- Use **plugin** quando quiser distribuir para time, repositório, marketplace interno ou pacote versionado. Esse é o caminho recomendado para uso compartilhado, porque o Codex trata plugins como bundles instaláveis de skills, integrações, MCPs e metadados públicos.
- Use **skill standalone** quando quiser testar localmente ou usar apenas a pasta da skill em um único ambiente. Nesse modo, copie `skills/enterprise-frontend-seo/` para uma pasta `.agents/skills` ou `~/.agents/skills`.

## Pré-requisitos

- Codex com suporte a skills/plugins.
- Node.js disponível caso você queira executar o scanner heurístico `seo-audit.mjs`.
- Um repositório frontend JavaScript/TypeScript para auditar ou implementar.
- IDs reais de produção, tokens de Search Console, Measurement IDs, containers GTM e contratos de analytics **não** devem ficar neste pacote. Configure-os no projeto consumidor por ambiente.

## Conteúdo

- `.codex-plugin/plugin.json`: manifesto do plugin.
- `skills/enterprise-frontend-seo/SKILL.md`: instruções principais da skill.
- `skills/enterprise-frontend-seo/references/`: playbooks, gates de qualidade, analytics, relatório e mapa de fontes.
- `skills/enterprise-frontend-seo/scripts/seo-audit.mjs`: scanner heurístico local sem dependências externas.
- `skills/enterprise-frontend-seo/assets/templates/`: templates de implementação para Next.js, Gatsby, React, Angular e analytics.
- `install/repo-marketplace.example.json` e `install/personal-marketplace.example.json`: exemplos de marketplace local para distribuição por repositório ou uso pessoal.

Estrutura principal:

```text
enterprise-seo-codex-plugin/
	.codex-plugin/plugin.json
	README.md
	install/
		repo-marketplace.example.json
		personal-marketplace.example.json
	skills/
		enterprise-frontend-seo/
			SKILL.md
			scripts/seo-audit.mjs
			references/
			assets/templates/
```

## Instalação no Codex por repositório

Use este modo quando o plugin deve ficar disponível para todas as pessoas que trabalham em um repositório.

Estrutura recomendada dentro do repositório consumidor:

```bash
mkdir -p ./plugins
cp -R /absolute/path/to/enterprise-seo-codex-plugin ./plugins/enterprise-frontend-seo
mkdir -p ./.agents/plugins
cp ./plugins/enterprise-frontend-seo/install/repo-marketplace.example.json ./.agents/plugins/marketplace.json
```

Depois:

1. Reinicie o Codex.
2. Abra `/plugins`.
3. Selecione o marketplace **Enterprise SEO Plugins by Gustavo Vasconcelos**.
4. Instale ou habilite **Enterprise Frontend SEO**.
5. Abra `/skills` ou mencione a skill no prompt para confirmar que ela está disponível.

> Observação: o Codex instala plugins em cache. Se você alterar o plugin local depois da instalação, atualize a pasta apontada pelo marketplace e reinicie o Codex para recarregar a versão local.

## Instalação pessoal

Use este modo quando o plugin deve ficar disponível apenas para o seu usuário.

```bash
mkdir -p ~/.codex/plugins
cp -R /absolute/path/to/enterprise-seo-codex-plugin ~/.codex/plugins/enterprise-frontend-seo
mkdir -p ~/.agents/plugins
cp ~/.codex/plugins/enterprise-frontend-seo/install/personal-marketplace.example.json ~/.agents/plugins/marketplace.json
```

Se você já possui um marketplace pessoal, mescle a entrada `enterprise-frontend-seo` em vez de substituir o arquivo inteiro. O exemplo usa `source.path` relativo ao diretório home: `./.codex/plugins/enterprise-frontend-seo`.

Depois reinicie o Codex, abra `/plugins`, selecione **Gustavo Vasconcelos Enterprise Plugins** e habilite **Enterprise Frontend SEO**.

## Uso como skill standalone

Para teste local sem wrapper de plugin, copie somente a pasta da skill:

```bash
mkdir -p ./.agents/skills
cp -R /absolute/path/to/enterprise-seo-codex-plugin/skills/enterprise-frontend-seo ./.agents/skills/enterprise-frontend-seo
```

Ou, para uso pessoal em qualquer repositório:

```bash
mkdir -p ~/.agents/skills
cp -R /absolute/path/to/enterprise-seo-codex-plugin/skills/enterprise-frontend-seo ~/.agents/skills/enterprise-frontend-seo
```

Depois reinicie o Codex se a skill não aparecer automaticamente.

## Como usar no Codex

Você pode acionar a skill de três formas:

1. Abrindo `/skills` e escolhendo **enterprise-frontend-seo**.
2. Mencionando `$enterprise-frontend-seo` no prompt, quando a interface suportar menção por `$`.
3. Usando o nome visível **Enterprise Frontend SEO** no prompt.

### Prompt padrão de auditoria

```text
Use Enterprise Frontend SEO para auditar este repositório.
Identifique framework, modelo de renderização, rotas públicas, metadata, canonical, robots, sitemap, hreflang, structured data, Core Web Vitals, GA4/GTM/Search Console e riscos de PII.
Priorize P0/P1, implemente correções seguras, rode lint/typecheck/test/build quando possível e gere relatório executivo com evidências, arquivos alterados, validação executada e validação pendente.
```

### Prompt para analytics

```text
Use Enterprise Frontend SEO para implementar GA4 + GTM + dataLayer neste projeto.
Não duplique pageviews.
Respeite consentimento.
Não envie PII.
Documente taxonomia de eventos.
Inclua QA com GTM Preview, Tag Assistant, GA4 DebugView, browser network calls e Realtime.
```

### Prompt para preparação enterprise antes de lançamento

```text
Use Enterprise Frontend SEO para preparar este portal para escala de milhões de visitas orgânicas mensais.
Revise rendering, sitemaps particionados, hreflang, canonical, schema, Core Web Vitals, logs, Search Console, GA4/GTM e riscos de indexação.
Implemente somente correções seguras e reversíveis; para validações externas, liste o checklist manual com evidências esperadas.
```

## Fluxo operacional recomendado

1. Instale o plugin ou a skill standalone.
2. Abra o repositório frontend que será analisado.
3. Execute um prompt de auditoria ou implementação.
4. Deixe o Codex identificar o stack, rotas públicas, modelo de renderização e superfícies de SEO/analytics.
5. Priorize P0/P1 antes de P2/P3.
6. Para mudanças de código, revise diffs pequenos e reversíveis.
7. Rode lint, typecheck, testes e build quando o projeto oferecer esses comandos.
8. Valide manualmente o que depende de contas, produção ou ferramentas externas: Search Console, Rich Results Test, Schema Markup Validator, PageSpeed/CrUX, GA4 DebugView, Tag Assistant e crawler/renderização real.

## Scanner heurístico

O pacote inclui um scanner local sem dependências externas. Ele faz uma primeira leitura de riscos óbvios no repositório, como ausência de robots/sitemap/canonical, sinais de CSR, JSON-LD, GA4/GTM, pageviews SPA, placeholders e possíveis PII em analytics.

Execute a partir da raiz do projeto analisado:

```bash
node /path/to/enterprise-seo-codex-plugin/skills/enterprise-frontend-seo/scripts/seo-audit.mjs --markdown --out seo-audit.md
node /path/to/enterprise-seo-codex-plugin/skills/enterprise-frontend-seo/scripts/seo-audit.mjs --json --out seo-audit.json
```

Ou informe a raiz explicitamente:

```bash
node /path/to/enterprise-seo-codex-plugin/skills/enterprise-frontend-seo/scripts/seo-audit.mjs --root /path/to/projeto --markdown --out seo-audit.md
node /path/to/enterprise-seo-codex-plugin/skills/enterprise-frontend-seo/scripts/seo-audit.mjs --root /path/to/projeto --json --out seo-audit.json
```

Opções úteis:

- `--markdown`: gera relatório em Markdown.
- `--json`: gera relatório JSON.
- `--out <arquivo>`: grava a saída em arquivo.
- `--root <caminho>`: analisa uma raiz específica.
- `--allow-any-root`: permite rodar mesmo quando o diretório não parece ser um frontend.

O scanner é heurístico. Ele **não substitui** crawler real, renderização em produção, Search Console, GA4 DebugView, Tag Assistant, logs de CDN, dados de campo ou validação de rich results.

## Base técnica codificada

A skill parte de um princípio conservador: páginas públicas e indexáveis devem expor conteúdo crítico, links, metadata, canonical e dados estruturados no HTML renderizado de forma confiável, preferencialmente via SSR, SSG, prerender ou hidratação segura. Dynamic rendering deve ser tratado como workaround, não como arquitetura padrão.

Gates importantes aplicados pela skill:

- Canonical deve ser absoluto, consistente, preferir HTTPS e apontar para a URL canônica do mesmo idioma/localidade quando aplicável.
- Sitemaps devem listar URLs canônicas e indexáveis; cada sitemap deve respeitar os limites de protocolo de 50 MB não compactado ou 50.000 URLs.
- `hreflang` deve ser completo, recíproco, self-referential e usar URLs totalmente qualificadas.
- JSON-LD deve refletir conteúdo visível e ser sanitizado quando incluir dados dinâmicos.
- SPAs devem usar URLs rastreáveis, History API e pageviews virtuais sem duplicidade.
- Analytics não deve enviar PII, segredos, tokens ou identificadores sensíveis em `gtag`, `dataLayer`, URLs ou parâmetros de eventos.

## Padrão de entrega esperado

A skill força o Codex a entregar:

1. Inventário do stack e do modelo de renderização.
2. Achados priorizados por P0/P1/P2/P3.
3. Diffs pequenos e reversíveis quando houver implementação.
4. Comandos executados e resultado de lint/typecheck/test/build.
5. Checklist manual para validações que exigem contas, produção, GSC, GA4, crawler externo ou dados de campo.

Formato recomendado de resposta final:

- **Resumo executivo:** o que foi alterado ou encontrado.
- **Risco orgânico:** contagem P0/P1/P2/P3 e principais riscos.
- **Arquivos alterados:** agrupados por SEO, analytics, framework e testes.
- **Validação executada:** comandos e resultados.
- **Validação pendente:** checks externos ou dependentes de conta.
- **Próximos passos:** uma a três ações de maior impacto.

## Nota de governança

Nunca coloque IDs reais de produção, tokens de verificação, containers GTM, measurement IDs, credenciais, domínios internos ou contratos de dados neste pacote. Configure esses valores por ambiente e valide com o time de privacidade/compliance quando houver coleta analítica.

## Referências oficiais úteis

- Codex Skills: https://developers.openai.com/codex/skills
- Codex Plugins: https://developers.openai.com/codex/plugins/build
- JavaScript SEO: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Canonical: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Hreflang/localização: https://developers.google.com/search/docs/specialty/international/localized-versions
- Core Web Vitals: https://web.dev/articles/vitals
- Next.js Metadata API: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- Next.js robots/sitemap/JSON-LD: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots, https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap, https://nextjs.org/docs/app/guides/json-ld
- GA4 tag options, SPA, events e ecommerce: https://developers.google.com/analytics/devguides/collection/ga4/tag-options, https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications, https://developers.google.com/analytics/devguides/collection/ga4/events, https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
