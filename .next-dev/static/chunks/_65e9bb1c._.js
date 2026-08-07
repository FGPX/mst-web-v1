(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/search.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "matchExplanation",
    ()=>matchExplanation,
    "parseSearchQuery",
    ()=>parseSearchQuery,
    "productMatches",
    ()=>productMatches,
    "searchColorTerms",
    ()=>searchColorTerms,
    "searchProducts",
    ()=>searchProducts,
    "searchProductsRanked",
    ()=>searchProductsRanked,
    "searchStyleTerms",
    ()=>searchStyleTerms
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-client] (ecmascript)");
;
const searchColorTerms = [
    "beige",
    "ivory",
    "taupe",
    "stone",
    "charcoal",
    "black",
    "white",
    "brown",
    "oak",
    "natural",
    "cream",
    "green",
    "grey",
    "graphite",
    "red",
    "burgundy",
    "barolo",
    "purple",
    "blue",
    "orange",
    "pink",
    "yellow",
    "mustard",
    "cognac",
    "sand"
];
const searchStyleTerms = [
    "modern",
    "minimal",
    "contemporary",
    "classic",
    "industrial",
    "natural",
    "elegant"
];
const stopWords = new Set([
    "want",
    "something",
    "like",
    "this",
    "that",
    "with",
    "from",
    "have",
    "need",
    "looking",
    "product",
    "piece",
    "please",
    "show",
    "find",
    "furniture",
    "maximum",
    "about"
]);
const corrections = {
    wnat: "want",
    prodcut: "product",
    couchs: "couch",
    confortable: "comfortable",
    grey: "gray",
    modularer: "modular"
};
function tokens(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(/\s+/).filter(Boolean).map((token)=>{
        var _corrections_token;
        return (_corrections_token = corrections[token]) !== null && _corrections_token !== void 0 ? _corrections_token : token;
    });
}
function editDistanceAtMostOne(left, right) {
    if (Math.abs(left.length - right.length) > 1) return false;
    if (left === right) return true;
    let edits = 0;
    for(let i = 0, j = 0; i < left.length && j < right.length;){
        if (left[i] === right[j]) {
            i += 1;
            j += 1;
            continue;
        }
        edits += 1;
        if (edits > 1) return false;
        if (left.length > right.length) i += 1;
        else if (right.length > left.length) j += 1;
        else {
            i += 1;
            j += 1;
        }
    }
    return true;
}
function tokenMatches(queryToken, candidate) {
    return candidate === queryToken || queryToken.length >= 4 && candidate.startsWith(queryToken) || queryToken.length >= 5 && editDistanceAtMostOne(queryToken, candidate);
}
function parseSearchQuery(query) {
    var _text_match_, _text_match, _text_match1;
    const q = query.trim();
    const text = q.toLowerCase().replace(/\bbeig(?:e|es|er|en|em)?\b/g, "beige").replace(/\brot(?:es|er|e)?\b/g, "red").replace(/\bgrau(?:es|er|e)?\b/g, "grey").replace(/\bbraun(?:es|er|e)?\b/g, "brown").replace(/\bgrÃ¼n(?:es|er|e)?\b|\bgrün(?:es|er|e)?\b/g, "green").replace(/\bweiÃŸ(?:es|er|e)?\b|\bweiß(?:es|er|e)?\b/g, "white");
    const filters = {
        q
    };
    if (/dining chair|dining seat|esszimmerstuhl|stuhl/.test(text)) filters.category = "dining-chair";
    else if (/armchair|accent chair|recliner|\bchair\b|sessel/.test(text)) filters.category = "armchair";
    else if (/sectional|corner sofa|corner couch|chaise|ecksofa|wohnlandschaft/.test(text)) filters.category = "sectional";
    else if (/sofa|couch/.test(text)) filters.category = "sofa";
    else if (/coffee table|side table|couchtisch|beistelltisch/.test(text)) filters.category = "coffee-table";
    else if (/dining table|esstisch/.test(text)) filters.category = "dining-table";
    else if (/wardrobe|closet|kleiderschrank/.test(text)) filters.category = "wardrobe";
    else if (/bedroom series|bedroom furniture|schlafzimmerprogramm/.test(text)) filters.category = "bedroom-series";
    else if (/\bbed\b|upholstered bed|boxspring|bett/.test(text)) filters.category = "bed";
    else if (/bathroom|bath furniture|badmoebel|badmöbel/.test(text)) filters.category = "bathroom";
    else if (/outdoor|garden furniture|patio|gartenmoebel|gartenmöbel/.test(text)) filters.category = "outdoor";
    else if (/carpet|\brug\b|teppich/.test(text)) filters.category = "carpet";
    else if (/\blamp\b|lighting|leuchte/.test(text)) filters.category = "lamp";
    else if (/small furniture|occasional furniture/.test(text)) filters.category = "small-furniture";
    else if (/living wall|wall unit|media unit|tv unit|sideboard|cabinet|storage/.test(text)) filters.category = "storage";
    const code = (_text_match = text.match(/\bmr\s*-?\s*\d{3,4}\b/i)) === null || _text_match === void 0 ? void 0 : (_text_match_ = _text_match[0]) === null || _text_match_ === void 0 ? void 0 : _text_match_.replace(/[\s-]+/g, " ").toUpperCase();
    if (code) filters.modelCode = code;
    const width = text.match(/(?:max(?:imum)?|under|below|unter|bis|maximale breite|maximum width)?\s*(\d{2,3})\s*(?:cm|centimeter)/);
    if (width) filters.maxWidthMm = Number(width[1]) * 10;
    const seats = text.match(/(\d)\s*(?:seat|seater|sitzer)/);
    const seatWord = (_text_match1 = text.match(/\b(two|three|four)[- ](?:seat|seater)\b/)) === null || _text_match1 === void 0 ? void 0 : _text_match1[1];
    if (seats) filters.seatCount = Number(seats[1]);
    else if (seatWord) filters.seatCount = ({
        two: 2,
        three: 3,
        four: 4
    })[seatWord];
    const colors = searchColorTerms.filter((color)=>new RegExp("\\b".concat(color.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "\\b")).test(text));
    if (colors.length) filters.colors = colors;
    const styles = searchStyleTerms.filter((style)=>new RegExp("\\b".concat(style, "\\b")).test(text));
    if (styles.length) filters.styles = styles;
    if (/modular|module|flexible/.test(text)) filters.modular = true;
    if (/small|compact|apartment|wohnung|klein/.test(text)) filters.smallSpaceSuitable = true;
    if (/high[- ]seat|tall person|hohe sitzhÃ¶he|hohe sitzhöhe|gro(?:ÃŸ|ß|ss)e person/.test(text)) filters.minSeatHeightMm = 470;
    if (/relax|recline|lounge|entspannungsfunktion/.test(text)) filters.relaxFunction = true;
    if (/electric|elektrisch|motor|power/.test(text)) filters.electricFunctions = true;
    return filters;
}
function productMatches(product, filters) {
    var _filters_colors, _filters_materials, _filters_styles, _filters_collections;
    if (filters.modelCode && product.modelCode !== filters.modelCode) return false;
    if (filters.category && product.category !== filters.category) return false;
    if (filters.maxWidthMm && product.widthMm > filters.maxWidthMm) return false;
    if (filters.maxDepthMm && product.depthMm > filters.maxDepthMm) return false;
    if (filters.minSeatHeightMm && product.seatHeightMm < filters.minSeatHeightMm) return false;
    if (filters.maxSeatDepthMm && product.seatDepthMm > filters.maxSeatDepthMm) return false;
    if (filters.seatCount && product.numberOfSeats !== filters.seatCount) return false;
    if (filters.modular && !product.modular) return false;
    if (filters.smallSpaceSuitable && !product.smallSpaceSuitable) return false;
    if (filters.relaxFunction && !product.functions.includes("relax")) return false;
    if (filters.electricFunctions && product.electricFunctions.length === 0) return false;
    if (((_filters_colors = filters.colors) === null || _filters_colors === void 0 ? void 0 : _filters_colors.length) && !filters.colors.some((color)=>product.colors.includes(color))) return false;
    if (((_filters_materials = filters.materials) === null || _filters_materials === void 0 ? void 0 : _filters_materials.length) && !filters.materials.some((id)=>product.materials.includes(id))) return false;
    if (((_filters_styles = filters.styles) === null || _filters_styles === void 0 ? void 0 : _filters_styles.length) && !filters.styles.some((style)=>product.styles.includes(style))) return false;
    if (((_filters_collections = filters.collections) === null || _filters_collections === void 0 ? void 0 : _filters_collections.length) && !filters.collections.includes(product.collection)) return false;
    if (filters.q && !filters.modelCode) {
        const haystack = "".concat(product.name, " ").concat(product.subtitle, " ").concat(product.description, " ").concat(product.modelCode, " ").concat(product.category, " ").concat(product.colors.join(" "), " ").concat(product.styles.join(" "), " ").concat(product.functions.join(" "), " ").concat(Math.round(product.widthMm / 10), " cm").toLowerCase();
        const usefulTerms = filters.q.toLowerCase().split(/\W+/).filter((term)=>term.length > 2 && ![
                "need",
                "with",
                "for",
                "the",
                "and",
                "maximum"
            ].includes(term));
        return usefulTerms.length === 0 || usefulTerms.some((term)=>haystack.includes(term));
    }
    return true;
}
function searchProducts(filters) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["products"].filter((product)=>product.active && productMatches(product, filters));
}
function matchExplanation(product, filters) {
    var _filters_colors;
    const reasons = [];
    if (filters.modular && product.modular) reasons.push("modular");
    if (filters.maxWidthMm && product.widthMm <= filters.maxWidthMm) reasons.push("available below ".concat(Math.round(filters.maxWidthMm / 10), " cm"));
    if ((_filters_colors = filters.colors) === null || _filters_colors === void 0 ? void 0 : _filters_colors.some((color)=>product.colors.includes(color))) reasons.push("offered in ".concat(filters.colors.join(", "), " tones"));
    if (product.smallSpaceSuitable) reasons.push("suited to smaller rooms");
    return reasons.length ? "Strong match because this model is ".concat(reasons.join(", "), ".") : "Recommended from validated product data.";
}
function searchProductsRanked(query) {
    let limit = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 12;
    const normalized = query.trim().toLowerCase();
    const parsed = parseSearchQuery(query);
    const queryTokens = tokens(query).filter((token)=>token.length > 2 && !stopWords.has(token));
    const requestedCategory = parsed.category;
    const wantsLeather = /\bleather\b/.test(normalized);
    const wantsFabric = /\bfabric|textile|boucle|chenille|velvet\b/.test(normalized);
    const wantsComfort = /\bcomfort|comfortable|cosy|cozy|soft|relax|recline|lounge\b/.test(normalized);
    const wantsModern = /\bmodern|minimal|clean|contemporary|design\b/.test(normalized);
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["products"].filter((product)=>product.active).filter((product)=>productMatches(product, {
            ...parsed,
            q: undefined
        })).map((product)=>{
        var _normalized_match, _parsed_colors;
        const copy = [
            product.modelCode,
            product.name,
            product.subtitle,
            product.description,
            product.category,
            ...product.colors,
            ...product.styles,
            ...product.functions
        ].join(" ").toLowerCase();
        const productTokens = tokens(copy);
        const reasons = [];
        let score = 1;
        if (requestedCategory) {
            if (product.category !== requestedCategory) score -= 30;
            else {
                score += 25;
                reasons.push("matches the requested ".concat(requestedCategory));
            }
        }
        const modelDigits = (_normalized_match = normalized.match(/\b\d{3,4}\b/)) === null || _normalized_match === void 0 ? void 0 : _normalized_match[0];
        if (modelDigits && product.modelCode.includes(modelDigits)) {
            score += 80;
            reasons.push("exact model ".concat(product.modelCode));
        }
        let lexicalMatches = 0;
        for (const token of queryTokens){
            if (productTokens.some((candidate)=>tokenMatches(token, candidate))) {
                lexicalMatches += 1;
                score += 5;
            }
        }
        if (lexicalMatches) reasons.push("".concat(lexicalMatches, " description keyword").concat(lexicalMatches === 1 ? "" : "s", " matched"));
        if ((_parsed_colors = parsed.colors) === null || _parsed_colors === void 0 ? void 0 : _parsed_colors.some((color)=>product.colors.includes(color))) {
            score += 14;
            reasons.push("available in the requested colour family");
        }
        if (parsed.modular && /modular|module|configur|flexib|system|programme/.test(copy)) {
            score += 18;
            reasons.push("flexible or modular configuration");
        }
        if (parsed.smallSpaceSuitable && /compact|small|apartment|space-saving|little floor/.test(copy)) {
            score += 18;
            reasons.push("described for compact spaces");
        }
        if (parsed.relaxFunction && /relax|reclin|comfort|lounge/.test(copy)) {
            score += 16;
            reasons.push("relaxation-focused comfort");
        }
        if (parsed.electricFunctions && /electric|motor|power/.test(copy)) {
            score += 18;
            reasons.push("motorised or electric functions");
        }
        if (wantsLeather && /leather/.test(copy)) {
            score += 10;
            reasons.push("leather options");
        }
        if (wantsFabric && /fabric|textile|cover|boucle|chenille|velvet/.test(copy)) {
            score += 10;
            reasons.push("fabric-led upholstery");
        }
        if (wantsComfort && /comfort|cosy|cozy|soft|relax|lounge/.test(copy)) score += 8;
        if (wantsModern && /modern|design|clean|contemporary|elegant/.test(copy)) score += 7;
        return {
            product,
            score,
            reasons: [
                ...new Set(reasons)
            ].slice(0, 3)
        };
    }).filter((result)=>result.score > -10).sort((left, right)=>right.score - left.score || left.product.modelCode.localeCompare(right.product.modelCode)).slice(0, limit);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/FilterableListing.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FilterableListing",
    ()=>FilterableListing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HighQualityImage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/HighQualityImage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up-down.js [app-client] (ecmascript) <export default as ArrowUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/award.js [app-client] (ecmascript) <export default as Award>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-client] (ecmascript) <export default as CalendarDays>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$drafting$2d$compass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DraftingCompass$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/drafting-compass.js [app-client] (ecmascript) <export default as DraftingCompass>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grid$2d$2x2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid2X2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/grid-2x2.js [app-client] (ecmascript) <export default as Grid2X2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list.js [app-client] (ecmascript) <export default as List>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$musterring$2d$assets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/musterring-assets.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$search$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/search.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/persistence.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$catalog$2d$taxonomy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/catalog-taxonomy.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
const initialVisibleProducts = 4;
function FilterableListing() {
    var _filters_materials, _filters_colors, _filters_styles, _filters_collections;
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const initialFilters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FilterableListing.useMemo[initialFilters]": ()=>filtersFromParams(searchParams)
    }["FilterableListing.useMemo[initialFilters]"], [
        searchParams
    ]);
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialFilters);
    const [visibleCount, setVisibleCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialVisibleProducts);
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("grid");
    const [sort, setSort] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("recommended");
    const [compareIds, setCompareIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filterOpen, setFilterOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const selectedCategory = filters.category ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$catalog$2d$taxonomy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categoryDetails"][filters.category] : null;
    const results = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FilterableListing.useMemo[results]": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["products"].filter({
                "FilterableListing.useMemo[results]": (product)=>product.active && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$search$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productMatches"])(product, filters)
            }["FilterableListing.useMemo[results]"]).sort({
                "FilterableListing.useMemo[results]": (left, right)=>sort === "width" ? left.widthMm - right.widthMm : sort === "name" ? left.modelCode.localeCompare(right.modelCode) : 0
            }["FilterableListing.useMemo[results]"])
    }["FilterableListing.useMemo[results]"], [
        filters,
        sort
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FilterableListing.useEffect": ()=>setFilters(initialFilters)
    }["FilterableListing.useEffect"], [
        initialFilters
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FilterableListing.useEffect": ()=>setVisibleCount(initialVisibleProducts)
    }["FilterableListing.useEffect"], [
        filters
    ]);
    const syncUrl = (nextFilters)=>{
        var _nextFilters_materials, _nextFilters_colors, _nextFilters_styles, _nextFilters_collections;
        const params = new URLSearchParams();
        if (nextFilters.category) params.set("category", nextFilters.category);
        if (nextFilters.maxWidthMm) params.set("maxWidthCm", String(Math.round(nextFilters.maxWidthMm / 10)));
        if (nextFilters.maxDepthMm) params.set("maxDepthCm", String(Math.round(nextFilters.maxDepthMm / 10)));
        if (nextFilters.minSeatHeightMm) params.set("minSeatHeightCm", String(Math.round(nextFilters.minSeatHeightMm / 10)));
        if (nextFilters.maxSeatDepthMm) params.set("maxSeatDepthCm", String(Math.round(nextFilters.maxSeatDepthMm / 10)));
        if (nextFilters.seatCount) params.set("seats", String(nextFilters.seatCount));
        if (nextFilters.modular) params.set("modular", "true");
        if (nextFilters.smallSpaceSuitable) params.set("smallSpaceSuitable", "true");
        if (nextFilters.relaxFunction) params.set("relax", "true");
        if (nextFilters.electricFunctions) params.set("electric", "true");
        if ((_nextFilters_materials = nextFilters.materials) === null || _nextFilters_materials === void 0 ? void 0 : _nextFilters_materials.length) params.set("materials", nextFilters.materials.join(","));
        if ((_nextFilters_colors = nextFilters.colors) === null || _nextFilters_colors === void 0 ? void 0 : _nextFilters_colors.length) params.set("colors", nextFilters.colors.join(","));
        if ((_nextFilters_styles = nextFilters.styles) === null || _nextFilters_styles === void 0 ? void 0 : _nextFilters_styles.length) params.set("styles", nextFilters.styles.join(","));
        if ((_nextFilters_collections = nextFilters.collections) === null || _nextFilters_collections === void 0 ? void 0 : _nextFilters_collections.length) params.set("collections", nextFilters.collections.join(","));
        router.replace(params.size ? "".concat(pathname, "?").concat(params.toString()) : pathname, {
            scroll: false
        });
    };
    const set = (patch)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storage"].track({
            name: "filter_applied"
        });
        setFilters((current)=>{
            const next = {
                ...current,
                ...patch
            };
            syncUrl(next);
            return next;
        });
    };
    const clear = ()=>{
        const next = filters.category ? {
            category: filters.category
        } : {};
        setFilters(next);
        syncUrl(next);
    };
    const toggleMaterial = (materialId, checked)=>{
        var _filters_materials;
        const current = (_filters_materials = filters.materials) !== null && _filters_materials !== void 0 ? _filters_materials : [];
        const materials = checked ? Array.from(new Set([
            ...current,
            materialId
        ])) : current.filter((id)=>id !== materialId);
        set({
            materials: materials.length ? materials : undefined
        });
    };
    var _selectedCategory_label, _selectedCategory_label1, _selectedCategory_headline, _selectedCategory_description, _filters_category, _filters_seatCount, _filters_colors_, _filters_styles_, _filters_collections_, _selectedCategory_label_toLowerCase;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "stitch-catalog",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "stitch-catalog-hero",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stitch-catalog-hero-copy",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                className: "stitch-breadcrumbs",
                                "aria-label": "Breadcrumb",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/",
                                        children: "Home"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 97,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "/"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 97,
                                        columnNumber: 39
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/furniture",
                                        children: "Furniture"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 98,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "/"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 98,
                                        columnNumber: 53
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: (_selectedCategory_label = selectedCategory === null || selectedCategory === void 0 ? void 0 : selectedCategory.label) !== null && _selectedCategory_label !== void 0 ? _selectedCategory_label : "All Furniture"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 99,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FilterableListing.tsx",
                                lineNumber: 96,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                children: [
                                    (_selectedCategory_label1 = selectedCategory === null || selectedCategory === void 0 ? void 0 : selectedCategory.label) !== null && _selectedCategory_label1 !== void 0 ? _selectedCategory_label1 : "Furniture Collections",
                                    " -",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: (_selectedCategory_headline = selectedCategory === null || selectedCategory === void 0 ? void 0 : selectedCategory.headline) !== null && _selectedCategory_headline !== void 0 ? _selectedCategory_headline : "Designed for every room."
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 103,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FilterableListing.tsx",
                                lineNumber: 101,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: (_selectedCategory_description = selectedCategory === null || selectedCategory === void 0 ? void 0 : selectedCategory.description) !== null && _selectedCategory_description !== void 0 ? _selectedCategory_description : "Choose a room and product category to explore the connected Musterring catalogue."
                            }, void 0, false, {
                                fileName: "[project]/components/FilterableListing.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FilterableListing.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stitch-view-toggle",
                        "aria-label": "Product view",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: view === "grid" ? "is-active" : "",
                                "aria-label": "Grid view",
                                "aria-pressed": view === "grid",
                                onClick: ()=>setView("grid"),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grid$2d$2x2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid2X2$3e$__["Grid2X2"], {
                                    size: 21
                                }, void 0, false, {
                                    fileName: "[project]/components/FilterableListing.tsx",
                                    lineNumber: 116,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/FilterableListing.tsx",
                                lineNumber: 110,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: view === "list" ? "is-active" : "",
                                "aria-label": "List view",
                                "aria-pressed": view === "list",
                                onClick: ()=>setView("list"),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"], {
                                    size: 22
                                }, void 0, false, {
                                    fileName: "[project]/components/FilterableListing.tsx",
                                    lineNumber: 124,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/FilterableListing.tsx",
                                lineNumber: 118,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FilterableListing.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/FilterableListing.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "stitch-filter-bar",
                "aria-label": "Product filters",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "stitch-mobile-filter-trigger",
                        "aria-expanded": filterOpen,
                        "aria-controls": "catalog-filter-controls",
                        onClick: ()=>setFilterOpen(true),
                        children: "Open filters"
                    }, void 0, false, {
                        fileName: "[project]/components/FilterableListing.tsx",
                        lineNumber: 130,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stitch-filter-inner",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "stitch-filter-controls ".concat(filterOpen ? "is-open" : ""),
                                id: "catalog-filter-controls",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "stitch-mobile-filter-close",
                                        onClick: ()=>setFilterOpen(false),
                                        children: "Close filters"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 133,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "stitch-filter-label",
                                        children: "Filter by"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 134,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                        className: "stitch-filter-menu",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                                children: [
                                                    "Width",
                                                    filters.maxWidthMm ? " · ≤ ".concat(Math.round(filters.maxWidthMm / 10), " cm") : "",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                        size: 15
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                        lineNumber: 138,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FilterableListing.tsx",
                                                lineNumber: 136,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "stitch-filter-popover",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        htmlFor: "catalog-width",
                                                        children: "Maximum width in cm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                        lineNumber: 141,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        id: "catalog-width",
                                                        min: "80",
                                                        max: "400",
                                                        placeholder: "e.g. 240",
                                                        type: "number",
                                                        value: filters.maxWidthMm ? filters.maxWidthMm / 10 : "",
                                                        onChange: (event)=>set({
                                                                maxWidthMm: event.target.value ? Number(event.target.value) * 10 : undefined
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                        lineNumber: 142,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FilterableListing.tsx",
                                                lineNumber: 140,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 135,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                        className: "stitch-filter-menu",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                                children: [
                                                    "Material",
                                                    ((_filters_materials = filters.materials) === null || _filters_materials === void 0 ? void 0 : _filters_materials.length) ? " · ".concat(filters.materials.length) : "",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                        size: 15
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                        lineNumber: 158,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FilterableListing.tsx",
                                                lineNumber: 156,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "stitch-filter-popover stitch-filter-options",
                                                children: [
                                                    [
                                                        "mat-sand-weave",
                                                        "Sand weave"
                                                    ],
                                                    [
                                                        "mat-taupe-chenille",
                                                        "Taupe chenille"
                                                    ],
                                                    [
                                                        "mat-stone-micro",
                                                        "Stone microfiber"
                                                    ],
                                                    [
                                                        "mat-graphite-easy",
                                                        "Graphite easy-care"
                                                    ]
                                                ].map((param)=>{
                                                    let [id, label] = param;
                                                    var _filters_materials;
                                                    var _filters_materials_includes;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                checked: (_filters_materials_includes = (_filters_materials = filters.materials) === null || _filters_materials === void 0 ? void 0 : _filters_materials.includes(id)) !== null && _filters_materials_includes !== void 0 ? _filters_materials_includes : false,
                                                                type: "checkbox",
                                                                onChange: (event)=>toggleMaterial(id, event.target.checked)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/FilterableListing.tsx",
                                                                lineNumber: 168,
                                                                columnNumber: 21
                                                            }, this),
                                                            label
                                                        ]
                                                    }, id, true, {
                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                        lineNumber: 167,
                                                        columnNumber: 19
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/components/FilterableListing.tsx",
                                                lineNumber: 160,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 155,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "stitch-filter-pill ".concat(filters.relaxFunction ? "is-active" : ""),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                checked: Boolean(filters.relaxFunction),
                                                type: "checkbox",
                                                onChange: (event)=>set({
                                                        relaxFunction: event.target.checked || undefined
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/components/FilterableListing.tsx",
                                                lineNumber: 179,
                                                columnNumber: 15
                                            }, this),
                                            "Relax function"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 178,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "stitch-filter-pill ".concat(filters.modular ? "is-active" : ""),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                checked: Boolean(filters.modular),
                                                type: "checkbox",
                                                onChange: (event)=>set({
                                                        modular: event.target.checked || undefined
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/components/FilterableListing.tsx",
                                                lineNumber: 187,
                                                columnNumber: 15
                                            }, this),
                                            "Modular"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 186,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                        className: "stitch-filter-menu",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                                children: [
                                                    "More filters ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                        size: 15
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                        lineNumber: 195,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FilterableListing.tsx",
                                                lineNumber: 195,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "stitch-filter-popover stitch-filter-options stitch-advanced-filters",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: [
                                                            "Category",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                value: (_filters_category = filters.category) !== null && _filters_category !== void 0 ? _filters_category : "",
                                                                onChange: (event)=>set({
                                                                        category: event.target.value ? event.target.value : undefined
                                                                    }),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        children: "All furniture"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                                        lineNumber: 197,
                                                                        columnNumber: 176
                                                                    }, this),
                                                                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$catalog$2d$taxonomy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categoryGroups"].flatMap((group)=>group.categories).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: item,
                                                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$catalog$2d$taxonomy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categoryDetails"][item].label
                                                                        }, item, false, {
                                                                            fileName: "[project]/components/FilterableListing.tsx",
                                                                            lineNumber: 197,
                                                                            columnNumber: 282
                                                                        }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/FilterableListing.tsx",
                                                                lineNumber: 197,
                                                                columnNumber: 32
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                        lineNumber: 197,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: [
                                                            "Maximum depth cm",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                value: filters.maxDepthMm ? filters.maxDepthMm / 10 : "",
                                                                onChange: (event)=>set({
                                                                        maxDepthMm: event.target.value ? Number(event.target.value) * 10 : undefined
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/FilterableListing.tsx",
                                                                lineNumber: 198,
                                                                columnNumber: 40
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                        lineNumber: 198,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: [
                                                            "Minimum seat height cm",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                value: filters.minSeatHeightMm ? filters.minSeatHeightMm / 10 : "",
                                                                onChange: (event)=>set({
                                                                        minSeatHeightMm: event.target.value ? Number(event.target.value) * 10 : undefined
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/FilterableListing.tsx",
                                                                lineNumber: 199,
                                                                columnNumber: 46
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                        lineNumber: 199,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: [
                                                            "Maximum seat depth cm",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                value: filters.maxSeatDepthMm ? filters.maxSeatDepthMm / 10 : "",
                                                                onChange: (event)=>set({
                                                                        maxSeatDepthMm: event.target.value ? Number(event.target.value) * 10 : undefined
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/FilterableListing.tsx",
                                                                lineNumber: 200,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                        lineNumber: 200,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: [
                                                            "Seats",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                value: (_filters_seatCount = filters.seatCount) !== null && _filters_seatCount !== void 0 ? _filters_seatCount : "",
                                                                onChange: (event)=>set({
                                                                        seatCount: event.target.value ? Number(event.target.value) : undefined
                                                                    }),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        children: "Any"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                                        lineNumber: 201,
                                                                        columnNumber: 171
                                                                    }, this),
                                                                    [
                                                                        1,
                                                                        2,
                                                                        3,
                                                                        4
                                                                    ].map((count)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            children: count
                                                                        }, count, false, {
                                                                            fileName: "[project]/components/FilterableListing.tsx",
                                                                            lineNumber: 201,
                                                                            columnNumber: 229
                                                                        }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/FilterableListing.tsx",
                                                                lineNumber: 201,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                        lineNumber: 201,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: [
                                                            "Color",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                value: (_filters_colors_ = (_filters_colors = filters.colors) === null || _filters_colors === void 0 ? void 0 : _filters_colors[0]) !== null && _filters_colors_ !== void 0 ? _filters_colors_ : "",
                                                                onChange: (event)=>set({
                                                                        colors: event.target.value ? [
                                                                            event.target.value
                                                                        ] : undefined
                                                                    }),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        children: "Any"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                                        lineNumber: 202,
                                                                        columnNumber: 164
                                                                    }, this),
                                                                    [
                                                                        ...new Set(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["products"].flatMap((product)=>product.colors))
                                                                    ].map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            children: color
                                                                        }, color, false, {
                                                                            fileName: "[project]/components/FilterableListing.tsx",
                                                                            lineNumber: 202,
                                                                            columnNumber: 269
                                                                        }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/FilterableListing.tsx",
                                                                lineNumber: 202,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                        lineNumber: 202,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: [
                                                            "Style",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                value: (_filters_styles_ = (_filters_styles = filters.styles) === null || _filters_styles === void 0 ? void 0 : _filters_styles[0]) !== null && _filters_styles_ !== void 0 ? _filters_styles_ : "",
                                                                onChange: (event)=>set({
                                                                        styles: event.target.value ? [
                                                                            event.target.value
                                                                        ] : undefined
                                                                    }),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        children: "Any"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                                        lineNumber: 203,
                                                                        columnNumber: 164
                                                                    }, this),
                                                                    [
                                                                        ...new Set(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["products"].flatMap((product)=>product.styles))
                                                                    ].map((style)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            children: style
                                                                        }, style, false, {
                                                                            fileName: "[project]/components/FilterableListing.tsx",
                                                                            lineNumber: 203,
                                                                            columnNumber: 269
                                                                        }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/FilterableListing.tsx",
                                                                lineNumber: 203,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                        lineNumber: 203,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: [
                                                            "Collection",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                value: (_filters_collections_ = (_filters_collections = filters.collections) === null || _filters_collections === void 0 ? void 0 : _filters_collections[0]) !== null && _filters_collections_ !== void 0 ? _filters_collections_ : "",
                                                                onChange: (event)=>set({
                                                                        collections: event.target.value ? [
                                                                            event.target.value
                                                                        ] : undefined
                                                                    }),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        children: "Any"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                                        lineNumber: 204,
                                                                        columnNumber: 179
                                                                    }, this),
                                                                    [
                                                                        ...new Set(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["products"].map((product)=>product.collection))
                                                                    ].map((collection)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            children: collection
                                                                        }, collection, false, {
                                                                            fileName: "[project]/components/FilterableListing.tsx",
                                                                            lineNumber: 204,
                                                                            columnNumber: 289
                                                                        }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/FilterableListing.tsx",
                                                                lineNumber: 204,
                                                                columnNumber: 34
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                        lineNumber: 204,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: Boolean(filters.electricFunctions),
                                                                onChange: (event)=>set({
                                                                        electricFunctions: event.target.checked || undefined
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/FilterableListing.tsx",
                                                                lineNumber: 205,
                                                                columnNumber: 24
                                                            }, this),
                                                            " Electric function"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                        lineNumber: 205,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: Boolean(filters.smallSpaceSuitable),
                                                                onChange: (event)=>set({
                                                                        smallSpaceSuitable: event.target.checked || undefined
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/FilterableListing.tsx",
                                                                lineNumber: 206,
                                                                columnNumber: 24
                                                            }, this),
                                                            " Small-space suitable"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                        lineNumber: 206,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FilterableListing.tsx",
                                                lineNumber: 196,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 194,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FilterableListing.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "stitch-filter-status",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "stitch-results-count",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: results.length
                                            }, void 0, false, {
                                                fileName: "[project]/components/FilterableListing.tsx",
                                                lineNumber: 211,
                                                columnNumber: 52
                                            }, this),
                                            " collections"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 211,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "stitch-sort-control",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"], {
                                                size: 15,
                                                "aria-hidden": "true"
                                            }, void 0, false, {
                                                fileName: "[project]/components/FilterableListing.tsx",
                                                lineNumber: 213,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Sort by"
                                            }, void 0, false, {
                                                fileName: "[project]/components/FilterableListing.tsx",
                                                lineNumber: 214,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                "aria-label": "Sort products",
                                                value: sort,
                                                onChange: (event)=>setSort(event.target.value),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "recommended",
                                                        children: "Recommended"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                        lineNumber: 216,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "width",
                                                        children: "Narrowest first"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                        lineNumber: 217,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "name",
                                                        children: "Model name"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FilterableListing.tsx",
                                                        lineNumber: 218,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FilterableListing.tsx",
                                                lineNumber: 215,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 212,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "stitch-clear-filters",
                                        onClick: clear,
                                        children: "Clear all"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 221,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FilterableListing.tsx",
                                lineNumber: 210,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FilterableListing.tsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/FilterableListing.tsx",
                lineNumber: 129,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "stitch-catalog-products",
                children: results.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "stitch-catalog-grid ".concat(view === "list" ? "is-list" : ""),
                            children: results.slice(0, visibleCount).map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CatalogProductCard, {
                                    product: product,
                                    compareSelected: compareIds.includes(product.id),
                                    onCompare: ()=>setCompareIds((current)=>current.includes(product.id) ? current.filter((id)=>id !== product.id) : current.length < 3 ? [
                                                ...current,
                                                product.id
                                            ] : current)
                                }, product.id, false, {
                                    fileName: "[project]/components/FilterableListing.tsx",
                                    lineNumber: 231,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/FilterableListing.tsx",
                            lineNumber: 229,
                            columnNumber: 13
                        }, this),
                        visibleCount < results.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "stitch-load-more",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setVisibleCount((count)=>count + 4),
                                children: "Load More Collections"
                            }, void 0, false, {
                                fileName: "[project]/components/FilterableListing.tsx",
                                lineNumber: 236,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/FilterableListing.tsx",
                            lineNumber: 235,
                            columnNumber: 15
                        }, this) : null
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "stitch-catalog-empty",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: [
                                "No ",
                                (_selectedCategory_label_toLowerCase = selectedCategory === null || selectedCategory === void 0 ? void 0 : selectedCategory.label.toLowerCase()) !== null && _selectedCategory_label_toLowerCase !== void 0 ? _selectedCategory_label_toLowerCase : "furniture",
                                " are connected yet."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/FilterableListing.tsx",
                            lineNumber: 242,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: filters.category ? "Import this Musterring category to add its official products." : "Clear the filters to return to the complete collection."
                        }, void 0, false, {
                            fileName: "[project]/components/FilterableListing.tsx",
                            lineNumber: 243,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: clear,
                            children: "Clear all filters"
                        }, void 0, false, {
                            fileName: "[project]/components/FilterableListing.tsx",
                            lineNumber: 244,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/FilterableListing.tsx",
                    lineNumber: 241,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/FilterableListing.tsx",
                lineNumber: 226,
                columnNumber: 7
            }, this),
            compareIds.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sticky-actions",
                role: "status",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container chips",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                compareIds.length,
                                "/3 selected for comparison"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/FilterableListing.tsx",
                            lineNumber: 248,
                            columnNumber: 107
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            className: "button primary",
                            href: "/compare?ids=".concat(compareIds.join(",")),
                            children: "Compare selected"
                        }, void 0, false, {
                            fileName: "[project]/components/FilterableListing.tsx",
                            lineNumber: 248,
                            columnNumber: 165
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "button ghost",
                            onClick: ()=>setCompareIds([]),
                            children: "Clear"
                        }, void 0, false, {
                            fileName: "[project]/components/FilterableListing.tsx",
                            lineNumber: 248,
                            columnNumber: 267
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/FilterableListing.tsx",
                    lineNumber: 248,
                    columnNumber: 74
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/FilterableListing.tsx",
                lineNumber: 248,
                columnNumber: 28
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "stitch-consultation",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "stitch-consultation-inner",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "stitch-consultation-copy",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Expert planning for your interior."
                                }, void 0, false, {
                                    fileName: "[project]/components/FilterableListing.tsx",
                                    lineNumber: 253,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Our furniture is as unique as your home. Let our interior design experts help you configure the perfect sofa system for your space."
                                }, void 0, false, {
                                    fileName: "[project]/components/FilterableListing.tsx",
                                    lineNumber: 254,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            className: "stitch-consultation-primary",
                                            href: "/dealers",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"], {
                                                    size: 20
                                                }, void 0, false, {
                                                    fileName: "[project]/components/FilterableListing.tsx",
                                                    lineNumber: 260,
                                                    columnNumber: 17
                                                }, this),
                                                " Book a Consultation"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/FilterableListing.tsx",
                                            lineNumber: 259,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            className: "stitch-consultation-secondary",
                                            href: "/room-composer",
                                            children: "Virtual Showroom"
                                        }, void 0, false, {
                                            fileName: "[project]/components/FilterableListing.tsx",
                                            lineNumber: 262,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/FilterableListing.tsx",
                                    lineNumber: 258,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/FilterableListing.tsx",
                            lineNumber: 252,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "stitch-service-cards",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"], {
                                            size: 42
                                        }, void 0, false, {
                                            fileName: "[project]/components/FilterableListing.tsx",
                                            lineNumber: 269,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: "5-Year Guarantee"
                                        }, void 0, false, {
                                            fileName: "[project]/components/FilterableListing.tsx",
                                            lineNumber: 270,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Quality Assurance"
                                        }, void 0, false, {
                                            fileName: "[project]/components/FilterableListing.tsx",
                                            lineNumber: 271,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/FilterableListing.tsx",
                                    lineNumber: 268,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$drafting$2d$compass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DraftingCompass$3e$__["DraftingCompass"], {
                                            size: 42
                                        }, void 0, false, {
                                            fileName: "[project]/components/FilterableListing.tsx",
                                            lineNumber: 274,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: "3D Planning"
                                        }, void 0, false, {
                                            fileName: "[project]/components/FilterableListing.tsx",
                                            lineNumber: 275,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Millimeter Precise"
                                        }, void 0, false, {
                                            fileName: "[project]/components/FilterableListing.tsx",
                                            lineNumber: 276,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/FilterableListing.tsx",
                                    lineNumber: 273,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/FilterableListing.tsx",
                            lineNumber: 267,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/FilterableListing.tsx",
                    lineNumber: 251,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/FilterableListing.tsx",
                lineNumber: 250,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/FilterableListing.tsx",
        lineNumber: 93,
        columnNumber: 5
    }, this);
}
_s(FilterableListing, "f7APMv0zQToe4CQSLU6fTSu3D1E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = FilterableListing;
function CatalogProductCard(param) {
    let { product, compareSelected, onCompare } = param;
    _s1();
    const image = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$musterring$2d$assets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productImages"])(product.id)[0];
    const configurable = [
        "sofa",
        "armchair",
        "sectional"
    ].includes(product.category);
    const availableColors = product.colors.length ? product.colors : [
        "Product options"
    ];
    const [selectedColor, setSelectedColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(availableColors[0]);
    const [showAllColors, setShowAllColors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const colorStyle = (color)=>{
        const value = color.toLowerCase();
        if (value.includes("beige") || value.includes("sand")) return "#dfceb7";
        if (value.includes("grey") || value.includes("gray") || value.includes("graphite")) return "#55575b";
        if (value.includes("cognac") || value.includes("brown")) return "#8b553b";
        if (value.includes("green") || value.includes("olive")) return "#74745a";
        if (value.includes("blue")) return "#667784";
        if (value.includes("black")) return "#252525";
        if (value.includes("white") || value.includes("cream")) return "#eee9df";
        return "#b9afa2";
    };
    var _product_functions_;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "stitch-catalog-card",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "stitch-catalog-image",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/furniture/".concat(product.slug),
                        "aria-label": "View ".concat(product.name),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HighQualityImage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: image,
                            alt: "".concat(product.name, " ").concat(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$catalog$2d$taxonomy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categoryDetails"][product.category].label.toLowerCase()),
                            fill: true,
                            sizes: "(max-width: 760px) 100vw, 50vw"
                        }, void 0, false, {
                            fileName: "[project]/components/FilterableListing.tsx",
                            lineNumber: 306,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/FilterableListing.tsx",
                        lineNumber: 305,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stitch-config-preview stitch-config-preview-compact",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Quick Configuration"
                                }, void 0, false, {
                                    fileName: "[project]/components/FilterableListing.tsx",
                                    lineNumber: 315,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "stitch-config-swatches",
                                    "aria-label": "Available material colours",
                                    children: [
                                        availableColors.slice(0, 3).map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: selectedColor === color ? "is-selected" : "",
                                                style: {
                                                    background: colorStyle(color)
                                                },
                                                title: color,
                                                "aria-label": "Select ".concat(color),
                                                onClick: ()=>setSelectedColor(color)
                                            }, color, false, {
                                                fileName: "[project]/components/FilterableListing.tsx",
                                                lineNumber: 317,
                                                columnNumber: 59
                                            }, this)),
                                        availableColors.length > 3 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "is-more",
                                            "aria-expanded": showAllColors,
                                            onClick: ()=>setShowAllColors((value)=>!value),
                                            children: [
                                                "+",
                                                availableColors.length - 3
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/FilterableListing.tsx",
                                            lineNumber: 318,
                                            columnNumber: 45
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/FilterableListing.tsx",
                                    lineNumber: 316,
                                    columnNumber: 13
                                }, this),
                                showAllColors ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "stitch-config-color-menu",
                                    children: availableColors.map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>{
                                                setSelectedColor(color);
                                                setShowAllColors(false);
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    style: {
                                                        background: colorStyle(color)
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/components/FilterableListing.tsx",
                                                    lineNumber: 320,
                                                    columnNumber: 208
                                                }, this),
                                                color
                                            ]
                                        }, color, true, {
                                            fileName: "[project]/components/FilterableListing.tsx",
                                            lineNumber: 320,
                                            columnNumber: 104
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/FilterableListing.tsx",
                                    lineNumber: 320,
                                    columnNumber: 30
                                }, this) : null,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                    className: "stitch-selected-color",
                                    children: [
                                        "Selected: ",
                                        selectedColor
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/FilterableListing.tsx",
                                    lineNumber: 321,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "stitch-config-action",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: product.authorizedContent ? "Price available from retailer" : "Planning estimate available"
                                        }, void 0, false, {
                                            fileName: "[project]/components/FilterableListing.tsx",
                                            lineNumber: 323,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    className: "stitch-view-product-action",
                                                    href: "/furniture/".concat(product.slug),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                            size: 16
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/FilterableListing.tsx",
                                                            lineNumber: 326,
                                                            columnNumber: 19
                                                        }, this),
                                                        " View Product"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/FilterableListing.tsx",
                                                    lineNumber: 325,
                                                    columnNumber: 17
                                                }, this),
                                                configurable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    className: "stitch-configure-action",
                                                    href: "/configurator/".concat(product.slug),
                                                    children: "Configure"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/FilterableListing.tsx",
                                                    lineNumber: 328,
                                                    columnNumber: 33
                                                }, this) : null
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/FilterableListing.tsx",
                                            lineNumber: 324,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/FilterableListing.tsx",
                                    lineNumber: 322,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/FilterableListing.tsx",
                            lineNumber: 314,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/FilterableListing.tsx",
                        lineNumber: 313,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/FilterableListing.tsx",
                lineNumber: 304,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "stitch-catalog-card-copy",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                className: "stitch-catalog-title",
                                href: "/furniture/".concat(product.slug),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: product.modelCode
                                }, void 0, false, {
                                    fileName: "[project]/components/FilterableListing.tsx",
                                    lineNumber: 337,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/FilterableListing.tsx",
                                lineNumber: 336,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: product.subtitle
                            }, void 0, false, {
                                fileName: "[project]/components/FilterableListing.tsx",
                                lineNumber: 339,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FilterableListing.tsx",
                        lineNumber: 335,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stitch-catalog-card-links",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "chip",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: compareSelected,
                                        onChange: onCompare
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 342,
                                        columnNumber: 35
                                    }, this),
                                    " Compare"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FilterableListing.tsx",
                                lineNumber: 342,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                className: "stitch-card-view-link",
                                href: "/furniture/".concat(product.slug),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                        size: 17
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 344,
                                        columnNumber: 13
                                    }, this),
                                    " View product"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FilterableListing.tsx",
                                lineNumber: 343,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/dealers",
                                children: [
                                    "Find near you ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 346,
                                        columnNumber: 47
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FilterableListing.tsx",
                                lineNumber: 346,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FilterableListing.tsx",
                        lineNumber: 341,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/FilterableListing.tsx",
                lineNumber: 334,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                className: "stitch-catalog-more",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                        children: [
                            "More details ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/components/FilterableListing.tsx",
                                lineNumber: 350,
                                columnNumber: 31
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FilterableListing.tsx",
                        lineNumber: 350,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        children: "Collection"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 352,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        children: product.collection
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 352,
                                        columnNumber: 35
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FilterableListing.tsx",
                                lineNumber: 352,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        children: "Dimensions"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 353,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        children: product.widthMm && product.depthMm && product.heightMm ? "".concat(Math.round(product.widthMm / 10), " × ").concat(Math.round(product.depthMm / 10), " × ").concat(Math.round(product.heightMm / 10), " cm") : "Available from retailer"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 353,
                                        columnNumber: 35
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FilterableListing.tsx",
                                lineNumber: 353,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        children: "Seats"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 354,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        children: product.numberOfSeats || "Model dependent"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 354,
                                        columnNumber: 30
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FilterableListing.tsx",
                                lineNumber: 354,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        children: "Materials"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 355,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        children: product.materials.length ? "".concat(product.materials.length, " available") : "See product details"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 355,
                                        columnNumber: 34
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FilterableListing.tsx",
                                lineNumber: 355,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        children: "Configuration"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 356,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        children: product.modular ? "Modular" : (_product_functions_ = product.functions[0]) !== null && _product_functions_ !== void 0 ? _product_functions_ : "Standard"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FilterableListing.tsx",
                                        lineNumber: 356,
                                        columnNumber: 38
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FilterableListing.tsx",
                                lineNumber: 356,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FilterableListing.tsx",
                        lineNumber: 351,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/FilterableListing.tsx",
                lineNumber: 349,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/FilterableListing.tsx",
        lineNumber: 303,
        columnNumber: 5
    }, this);
}
_s1(CatalogProductCard, "KxHRRZ6iRh6pAVGgyaJ/zvuhEVc=");
_c1 = CatalogProductCard;
function filtersFromParams(params) {
    var _params_get, _params_get1, _params_get2, _params_get3;
    return {
        category: params.get("category") || undefined,
        maxWidthMm: params.get("maxWidthCm") ? Number(params.get("maxWidthCm")) * 10 : undefined,
        maxDepthMm: params.get("maxDepthCm") ? Number(params.get("maxDepthCm")) * 10 : undefined,
        minSeatHeightMm: params.get("minSeatHeightCm") ? Number(params.get("minSeatHeightCm")) * 10 : undefined,
        maxSeatDepthMm: params.get("maxSeatDepthCm") ? Number(params.get("maxSeatDepthCm")) * 10 : undefined,
        seatCount: params.get("seats") ? Number(params.get("seats")) : undefined,
        modular: params.get("modular") === "true" ? true : undefined,
        smallSpaceSuitable: params.get("smallSpaceSuitable") === "true" ? true : undefined,
        relaxFunction: params.get("relax") === "true" ? true : undefined,
        electricFunctions: params.get("electric") === "true" ? true : undefined,
        materials: (_params_get = params.get("materials")) === null || _params_get === void 0 ? void 0 : _params_get.split(",").filter(Boolean),
        colors: (_params_get1 = params.get("colors")) === null || _params_get1 === void 0 ? void 0 : _params_get1.split(",").filter(Boolean),
        styles: (_params_get2 = params.get("styles")) === null || _params_get2 === void 0 ? void 0 : _params_get2.split(",").filter(Boolean),
        collections: (_params_get3 = params.get("collections")) === null || _params_get3 === void 0 ? void 0 : _params_get3.split(",").filter(Boolean)
    };
}
var _c, _c1;
__turbopack_context__.k.register(_c, "FilterableListing");
__turbopack_context__.k.register(_c1, "CatalogProductCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_65e9bb1c._.js.map