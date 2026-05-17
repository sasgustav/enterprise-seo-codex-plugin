# Enterprise Frontend SEO Codex Plugin

Plugin/skill para auditoria e implementação técnica de SEO e analytics em aplicações JavaScript de alto tráfego.

## Conteúdo

- `.codex-plugin/plugin.json`: manifesto do plugin.
- `skills/enterprise-frontend-seo/SKILL.md`: instruções principais da skill.
- `skills/enterprise-frontend-seo/references/`: playbooks, gates de qualidade, analytics, relatório e mapa de fontes.
- `skills/enterprise-frontend-seo/scripts/seo-audit.mjs`: scanner heurístico local sem dependências externas.
- `skills/enterprise-frontend-seo/assets/templates/`: templates de implementação para Next.js, Gatsby, React, Angular e analytics.
- `install/repo-marketplace.example.json`: exemplo de marketplace local para distribuição por repositório.

## Instalação por repositório

Estrutura recomendada dentro do repositório consumidor:

```bash
mkdir -p ./plugins
cp -R /absolute/path/to/enterprise-seo-codex-plugin ./plugins/enterprise-frontend-seo
mkdir -p ./.agents/plugins
cp ./plugins/enterprise-frontend-seo/install/repo-marketplace.example.json ./.agents/plugins/marketplace.json
```

Depois, reinicie o Codex, abra `/plugins`, selecione o marketplace interno e instale/habilite `Enterprise Frontend SEO`.

## Instalação pessoal

```bash
mkdir -p ~/.codex/plugins
cp -R /absolute/path/to/enterprise-seo-codex-plugin ~/.codex/plugins/enterprise-frontend-seo
mkdir -p ~/.agents/plugins
```

Copie `install/personal-marketplace.example.json` para `~/.agents/plugins/marketplace.json`, ou mescle a entrada `enterprise-frontend-seo` com seu marketplace pessoal existente. O exemplo usa `source.path` relativo ao diretório home: `./.codex/plugins/enterprise-frontend-seo`.

## Uso sugerido no Codex

```text
Use Enterprise Frontend SEO para auditar este repositório Next.js/Gatsby/React/Angular. Priorize P0/P1, implemente correções seguras, rode testes/build quando possível e gere relatório executivo com evidências.
```

```text
Use Enterprise Frontend SEO para implementar GA4 + GTM + dataLayer neste projeto. Não duplique pageviews, respeite consentimento, documente eventos e inclua QA com DebugView/Tag Assistant.
```

```text
Use Enterprise Frontend SEO para preparar este portal para escala de milhões de visitas orgânicas mensais. Revise rendering, sitemaps particionados, hreflang, canonical, schema, Core Web Vitals, logs e Search Console.
```

## Scanner heurístico

Execute na raiz do projeto analisado:

```bash
node /path/to/enterprise-seo-codex-plugin/skills/enterprise-frontend-seo/scripts/seo-audit.mjs --markdown --out seo-audit.md
node /path/to/enterprise-seo-codex-plugin/skills/enterprise-frontend-seo/scripts/seo-audit.mjs --json --out seo-audit.json
```

O scanner não substitui crawler, renderização real, Search Console, GA4 DebugView, logs de CDN ou validação de rich results. Ele é um ponto de partida para levantar riscos óbvios no repositório.

## Padrão de entrega esperado

A skill força o Codex a entregar:

1. Inventário do stack e do modelo de renderização.
2. Achados priorizados por P0/P1/P2/P3.
3. Diffs pequenos e reversíveis quando houver implementação.
4. Comandos executados e resultado de lint/typecheck/test/build.
5. Checklist manual para validações que exigem contas, produção, GSC, GA4, crawler externo ou dados de campo.

## Nota de governança

Nunca coloque IDs reais de produção, tokens de verificação, containers GTM, measurement IDs, credenciais, domínios internos ou contratos de dados neste pacote. Configure esses valores por ambiente e valide com o time de privacidade/compliance quando houver coleta analítica.
