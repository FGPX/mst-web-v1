# Unifikimi i proceseve në chatbot — analizë arkitekturore

**Projekti:** mst-web-v1 (Musterring "Online Product World 2027")
**Data:** 21 Gusht 2026
**Pyetja:** a mund t'i vendosim të gjitha proceset e faqes brenda chatbot-it?

---

## Përgjigja e shkurtër

Po, por jo në formën "gjithçka brenda panelit". Forma e duhur është **"chat-i mund të nisë dhe drejtojë çdo proces"** — tre nivele, jo një.

Pengesa nuk është UI. Pengesa është që sot chatbot-i **nuk është agjent** — është një router me lëkurë chat-i. Nga 13 veprimet e deklaruara, vetëm **një** ekzekutohet vërtet brenda bisedës.

---

## 1. Inventari i proceseve

24 procese, prej të cilave ~19 janë customer-facing.

### Ekzistuese në faqe

| # | Procesi | Route | Komponent | API |
|---|---|---|---|---|
| 1 | Search inteligjent | `/search` | SearchExperience (27 KB) | `/api/ai/search` |
| 2 | Listim + filtra | `/furniture` | FilterableListing (23 KB) | — |
| 3 | Detaj produkti | `/furniture/[slug]` | ProductDetailClient (13 KB) | — |
| 4 | Krahasim | `/compare` | CompareClient (**44 KB**) | `/api/ai/comparison-summary` |
| 5 | Konfigurator | `/configurator/[slug]` | ConfiguratorClient (16 KB) | `/api/ai/configuration` |
| 6 | Alternative finder | panel | AlternativeFinderPanel (11 KB) | `/api/ai/alternatives` |
| 7 | Materiale + këshillë | `/materials` | MaterialAdvisor (8 KB) | `/api/ai/material-advice` |
| 8 | Comfort Match | `/comfort-match` | ComfortMatchClient (6 KB) | `/api/ai/comfort` |
| 9 | Will It Fit | `/will-it-fit/[slug]` | FitCheckerClient (**31 KB**) | `fit-simulator.ts` |
| 10 | Room Composer | `/room-composer` | RoomComposerClient (**90 KB**) | `/api/ai/room-visualization`, `/api/ai/room-size` |
| 11 | Room Planner 3D | `/room-planner` | RoomPlanner3DClient (26 KB) | — |
| 12 | AI Stylist | `/ai-stylist` | InteriorStylistClient (28 KB) + stylist-quiz (31 KB) | `/api/ai/stylist` |
| 13 | Visual search | `/visual-search` | VisualSearchClient (19 KB) | `/api/ai/image` |
| 14 | Shoppable rooms | `/inspiration/rooms` | ShoppableRoomsClient (6 KB) | — |
| 15 | Chair 360 | — | Chair360Experience (8 KB) | — |
| 16 | Assembly story | — | ProductAssemblyStory (11 KB) | — |
| 17 | My Musterring | `/my-musterring` | ProjectsClient (13 KB) | — |
| 18 | Dealer locator | `/dealers` | DealersClient (5 KB) | — |
| 19 | Handover + booking | `/handover` | HandoverClient (17 KB, **21 useState**) | `/api/ai/retailer-summary`, `/api/demo/handover` |
| 20 | Dealer AI assistant | `/dealer-ai-assistant` | DealerAiAssistantClient (16 KB) | `/api/dealer-assistant/send-email` |
| 21 | Partner workspace | `/partner/*` | 7 faqe | `/api/partner/*` |
| 22 | Analytics | `/analytics` | AnalyticsDashboard (14 KB) | — |
| 23 | Presentation | `/presentation` | PresentationClient (10 KB) | — |
| 24 | About / contact / privacy | — | statike | — |

### Sa mbulon chatbot-i sot

13 `AdvisorAction` types. Por çfarë bëjnë realisht:

| Sjellja | Sa | Cilat |
|---|---|---|
| **Ekzekutohet brenda bisedës** | 1 | `SAVE_PRODUCT` |
| **Bën `router.push()` — del nga biseda** | 8 | `SEARCH_PRODUCTS`, `COMPARE_PRODUCTS`, `OPEN_PRODUCT`, `OPEN_ROOM_COMPOSER`, `FIND_RETAILER`, `PREPARE_HANDOVER`, `BOOK_CONSULTATION`, `SHOW_MATERIALS` |
| **Mbyll panelin** | 1 | `SHOW_ALTERNATIVES` (dispatch event + `setOpen(false)`) |
| **I vdekur** | 3 | shih më poshtë |

**Tre veprimet e vdekura** (`MusterringAdvisor.tsx:372–384`):

- `CONFIGURE_PRODUCT` → kthen `/handover`. Rrugë e gabuar; duhet `/configurator/[slug]`.
- `OPEN_FIT_CHECK` → kthen `""`. Nuk shkon askund. Edhe butoni i propozimit e filtron shprehimisht jashtë UI-t, pra përdoruesi nuk e sheh kurrë.
- `SAVE_CONFIGURATION` → nuk ka fare degë në `actionRoute`. Karta e konfirmimit shfaqet, përdoruesi klikon "Confirm", **nuk ndodh asgjë**.

**Pesë procese pa asnjë hyrje nga chat-i:** Comfort Match, AI Stylist, Room Planner 3D, Shoppable rooms, Visual search.

---

## 2. Pengesat e vërteta

### P1 — Paneli mbyll veten sa herë vepron

```ts
useEffect(() => {
  setOpen(false);        // ← këtu
  setPendingAction(null);
  ...
}, [pathname]);
```

8 nga 13 veprimet bëjnë `router.push()`. `pathname` ndryshon. Efekti aktivizohet. **Asistenti mbyllet.**

Pra sekuenca e sotme është: përdoruesi pyet → asistenti propozon → përdoruesi konfirmon → asistenti zhduket dhe përdoruesi mbetet vetëm në një faqe. Konteksti i bisedës mbijeton në `sessionStorage`, por vazhdimësia e perceptuar jo.

Kjo është pengesa **strukturore** që e bën "agjentin" të pamundur — dhe rregullimi më i lirë në gjithë listën.

### P2 — Zero tool-calling

`/api/ai/advisor` bën **një** thirrje structured-output dhe kthen **maksimum një** `proposedAction`. Nuk mund të zinxhirojë: *kërko → filtro → krahaso → ruaj* është e pamundur në një turn.

Më keq: lista e tools-ave i jepet modelit si **tekst i thjeshtë** brenda prompt-it —

```
AVAILABLE TOOLS: product search, comparison, product pages, validated
configurator, My Musterring saves, room planner, Will It Fit, ...
```

— jo si tool definitions. Modeli nuk mund t'i thërrasë; mund vetëm të përshkruajë njërin.

Ndërkohë `docs/AI_ASSISTANT_TOOL_CONTRACTS.md` dokumenton **15 tools** me input/execution boundaries të përcaktuara qartë. Arkitektura është shkruar. Nuk u ndërtua kurrë.

### P3 — I gjithë katalogu shkon në çdo prompt

`lib/ai/providers.ts:630`:

```ts
const completeCatalogueFacts = products
  .filter((product) => product.active)
  .map((product) => ({ /* 15 fusha */ }));
```

…dhe pastaj `JSON.stringify(completeCatalogueFacts)` futet në mesazhin e përdoruesit. Për **çdo pyetje**. Bashkë me `completeMaterialFacts`.

Me 71 produkte demo kjo është ~30–50 KB JSON për kërkesë. Me katalogun real të Musterring-ut (mijëra SKU × variante ngjyrash × materiale) kjo **nuk funksionon** — as si kosto, as si context window, as si saktësi e rikthimit.

**Kjo është pengesa që e bllokon "gjithçka në chatbot".** Sa më shumë procese të fusësh, aq më shumë kontekst duhet; me këtë model konteksti është tashmë i ngopur me katalogun.

### P4 — Motori i retrieval-it ekziston dhe është kod i vdekur

`lib/ai/retrieval.ts` — 20 KB, përmban:

- `hybridCatalogueSearch()`
- `interface SemanticRetrievalProvider`
- `interface ExternalSemanticSearchAdapter` (pikë zgjerimi për vector DB)
- `LocalSemanticRetrievalProvider`

**Asnjë skedar në repo nuk e importon.** Zgjidhja për P3 është shkruar dhe nuk është lidhur kurrë.

### P5 — Nuk ka state bus të përbashkët

RoomComposer (90 KB), FitChecker (31 KB), Compare (44 KB), Handover (21 `useState`) e mbajnë gjendjen brenda vetes. Që asistenti të lexojë ç'po bën përdoruesi — ose të veprojë mbi të — duhet një store i përbashkët.

Ironia: `ConversationContext` tashmë i ka fushat:

```ts
currentFilters: z.record(z.unknown()).default({}),
selectedConfigurationId: z.string().nullable().optional(),
selectedProjectId: z.string().nullable().optional(),
```

Të deklaruara. Gjithmonë bosh.

### P6 — Katër parsera intenti paralelë

`lib/ai/search-intent.ts`, `lib/ai/alternative-intent.ts`, `/api/ai/voice-command`, dhe prompt-i i advisor-it. Katër vende ku "çfarë do përdoruesi" interpretohet me logjikë të ndryshme — dhe ku sjellja divergjon.

---

## 3. Modeli i propozuar — tre nivele

Jo "gjithçka brenda panelit". Tre nivele sipas natyrës së ndërveprimit.

### Tier A — Widget inline në bisedë

Procese ku e gjithë ndërveprimi është *disa input → një rezultat*. Renderohen si rezultate tool-i brenda rrjedhës së mesazheve.

| Procesi | Pse funksionon | Statusi |
|---|---|---|
| Search | rezultatet janë tashmë karta | navigon → bëje inline |
| Alternative finder | API kthen JSON të strukturuar | mbyll panelin → bëje inline |
| Material advisor | pyetje/përgjigje e pastër | navigon → bëje inline |
| Comfort Match | pyetësor = bisedë | mungon fare |
| **AI Stylist** | pyetësor = bisedë, natyrshëm chat | mungon fare |
| Compare (lite) | 2–3 produkte, vetëm diferencat | navigon → bëje inline |
| Dealer locator | tashmë pjesërisht inline | pjesërisht |
| Appointment | tashmë inline | ✓ |
| Handover | tashmë inline | ✓ |

**Fakti që e bën këtë të lirë:** çdo njëri prej tyre tashmë ka një **API route që kthen JSON të validuar me Zod**. Logjika është e ndarë nga UI. "Chatbot-ifikimi" = thirr të njëjtin endpoint nga advisor-i dhe rendero një widget kompakt. Nuk rishkruhet logjika.

### Tier B — Kanavacë anësore, chat-i qëndron

Procese që kërkojnë hapësirë dhe manipulim të drejtpërdrejtë. Paneli bëhet shirit i ankoruar, mjeti hapet në zonën kryesore, **biseda vazhdon përkrah**.

Konfigurator · Will It Fit · Room Composer · Room Planner 3D · Visual search · Shoppable rooms · Chair 360

Këtu asistenti duhet ta *shohë* kanavacën (P5) dhe të veprojë mbi të: *"bëje divanin 20 cm më të ngushtë"*, *"provo lëkurë të errët"*, *"a kalon nga dera?"*.

> `is-wide` që u shtua sot (paneli 880px) është pikërisht themeli i këtij niveli.

### Tier C — Mbeten faqe

My Musterring (chat-i lexon, faqja menaxhon) · Partner workspace · Dealer AI assistant (asistent i dytë, i ndarë) · Analytics · Presentation · About/contact/privacy

---

## 4. Ku chat-i është zgjidhja e gabuar

Tri kufij që ia vlen t'i thuash edhe klientit, sepse e forcojnë propozimin:

1. **Manipulimi hapësinor.** Zvarritja e një divani në një plan dhome është më e keqe me zë ose tekst sesa me mouse. Chat-i duhet ta *nisë* dhe *rregullojë*, jo ta zëvendësojë kanavacën.

2. **Krahasimi i gjerë.** 4 produkte × 20 atribute në 446px humbet ndaj një tabele. Compare-lite (2–3 produkte, vetëm diferencat) hyn në chat; matrica e plotë jo.

3. **Dukshmëria ndaj makinave.** Nëse gjithçka kalon në një panel client-side, faqja bëhet e padukshme si për search engines ashtu edhe për agjentët AI. Kjo lidhet direkt me defektin e verifikuar #3 (zero structured data: pa `sitemap.ts`, `robots.ts`, JSON-LD, `llms.txt`).

   Për "trendet nga 2027 e tutje" që kërkoi Christoph, kjo është pikërisht poenta: **agentic commerce kërkon faqe të lexueshme nga makinat.** Chat-i është rruga e shpejtë për njeriun; faqet e server-renderuara janë rruga e vetme për agjentin. Të dyja duhen.

---

## 5. Sekuenca e propozuar deri 31 Gusht

10 ditë. Objektivi nuk është rindërtim — është një **narrativë e demonstrueshme** që tregon modelin.

| Ditë | Punë | Përse |
|---|---|---|
| 1 | Rregullo P1 (paneli mbyll veten) + 3 veprimet e vdekura | ~2 orë, ndikimi më i madh për orë pune |
| 2–4 | Lidh `retrieval.ts` + kalo në tool-calling të vërtetë me 6 tools bërthamë: `searchProducts`, `getProduct`, `compareProducts`, `findAlternatives`, `adviseMaterials`, `saveProductToProject` | zgjidh P2+P3+P4 njëherësh; heq dump-in e katalogut |
| 5–7 | 3 widget-e Tier A si provë: materiale, alternativa, compare-lite | tregon që procesi hyn brenda bisedës |
| 8–9 | 1 kanavacë Tier B: konfiguratori me chat-in përkrah | tregon modelin për proceset e rënda |
| 10 | Skript demo + fallback | prezantimi te project team |

**Mos e bëj:** mos i migro të 19 proceset. Katër shembuj që tregojnë modelin janë më bindës se nëntëmbëdhjetë gjysmake.

---

## 6. Përmbledhje e gjetjeve

| # | Gjetja | Rëndësia |
|---|---|---|
| 1 | Paneli mbyll veten pas çdo veprimi navigues (8 nga 13) | Bllokuese, rregullim ~2 orë |
| 2 | 3 nga 13 veprime janë të vdekura (rrugë e gabuar / bosh) | Bug real, i dukshëm në demo |
| 3 | I gjithë katalogu në çdo prompt (`providers.ts:630`) | Bllokuese për shkallëzim |
| 4 | `retrieval.ts` (20 KB) nuk importohet nga askush | Zgjidhja ekziston, s'është lidhur |
| 5 | Zero tool-calling; tools i jepen modelit si tekst | Bllokuese për zinxhirim veprimesh |
| 6 | `AI_ASSISTANT_TOOL_CONTRACTS.md` dokumenton 15 tools që s'u ndërtuan | Hendek dokumentim/implementim |
| 7 | `ConversationContext` ka fusha state që mbeten gjithmonë bosh | Themeli i Tier B mungon |
| 8 | 4 parsera intenti paralelë | Divergjencë sjelljeje |
| 9 | 5 procese pa asnjë hyrje nga chat-i | Mbulim i paplotë |
| 10 | Kod i vdekur pas `return` në `providers.ts:677` | Higjienë; kontribuon në 56 KB |
