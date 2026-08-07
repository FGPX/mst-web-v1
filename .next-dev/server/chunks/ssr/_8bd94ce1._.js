module.exports = [
"[project]/lib/search.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-ssr] (ecmascript)");
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
    return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(/\s+/).filter(Boolean).map((token)=>corrections[token] ?? token);
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
    const code = text.match(/\bmr\s*-?\s*\d{3,4}\b/i)?.[0]?.replace(/[\s-]+/g, " ").toUpperCase();
    if (code) filters.modelCode = code;
    const width = text.match(/(?:max(?:imum)?|under|below|unter|bis|maximale breite|maximum width)?\s*(\d{2,3})\s*(?:cm|centimeter)/);
    if (width) filters.maxWidthMm = Number(width[1]) * 10;
    const seats = text.match(/(\d)\s*(?:seat|seater|sitzer)/);
    const seatWord = text.match(/\b(two|three|four)[- ](?:seat|seater)\b/)?.[1];
    if (seats) filters.seatCount = Number(seats[1]);
    else if (seatWord) filters.seatCount = ({
        two: 2,
        three: 3,
        four: 4
    })[seatWord];
    const colors = searchColorTerms.filter((color)=>new RegExp(`\\b${color.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(text));
    if (colors.length) filters.colors = colors;
    const styles = searchStyleTerms.filter((style)=>new RegExp(`\\b${style}\\b`).test(text));
    if (styles.length) filters.styles = styles;
    if (/modular|module|flexible/.test(text)) filters.modular = true;
    if (/small|compact|apartment|wohnung|klein/.test(text)) filters.smallSpaceSuitable = true;
    if (/high[- ]seat|tall person|hohe sitzhÃ¶he|hohe sitzhöhe|gro(?:ÃŸ|ß|ss)e person/.test(text)) filters.minSeatHeightMm = 470;
    if (/relax|recline|lounge|entspannungsfunktion/.test(text)) filters.relaxFunction = true;
    if (/electric|elektrisch|motor|power/.test(text)) filters.electricFunctions = true;
    return filters;
}
function productMatches(product, filters) {
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
    if (filters.colors?.length && !filters.colors.some((color)=>product.colors.includes(color))) return false;
    if (filters.materials?.length && !filters.materials.some((id)=>product.materials.includes(id))) return false;
    if (filters.styles?.length && !filters.styles.some((style)=>product.styles.includes(style))) return false;
    if (filters.collections?.length && !filters.collections.includes(product.collection)) return false;
    if (filters.q && !filters.modelCode) {
        const haystack = `${product.name} ${product.subtitle} ${product.description} ${product.modelCode} ${product.category} ${product.colors.join(" ")} ${product.styles.join(" ")} ${product.functions.join(" ")} ${Math.round(product.widthMm / 10)} cm`.toLowerCase();
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["products"].filter((product)=>product.active && productMatches(product, filters));
}
function matchExplanation(product, filters) {
    const reasons = [];
    if (filters.modular && product.modular) reasons.push("modular");
    if (filters.maxWidthMm && product.widthMm <= filters.maxWidthMm) reasons.push(`available below ${Math.round(filters.maxWidthMm / 10)} cm`);
    if (filters.colors?.some((color)=>product.colors.includes(color))) reasons.push(`offered in ${filters.colors.join(", ")} tones`);
    if (product.smallSpaceSuitable) reasons.push("suited to smaller rooms");
    return reasons.length ? `Strong match because this model is ${reasons.join(", ")}.` : "Recommended from validated product data.";
}
function searchProductsRanked(query, limit = 12) {
    const normalized = query.trim().toLowerCase();
    const parsed = parseSearchQuery(query);
    const queryTokens = tokens(query).filter((token)=>token.length > 2 && !stopWords.has(token));
    const requestedCategory = parsed.category;
    const wantsLeather = /\bleather\b/.test(normalized);
    const wantsFabric = /\bfabric|textile|boucle|chenille|velvet\b/.test(normalized);
    const wantsComfort = /\bcomfort|comfortable|cosy|cozy|soft|relax|recline|lounge\b/.test(normalized);
    const wantsModern = /\bmodern|minimal|clean|contemporary|design\b/.test(normalized);
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["products"].filter((product)=>product.active).filter((product)=>productMatches(product, {
            ...parsed,
            q: undefined
        })).map((product)=>{
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
                reasons.push(`matches the requested ${requestedCategory}`);
            }
        }
        const modelDigits = normalized.match(/\b\d{3,4}\b/)?.[0];
        if (modelDigits && product.modelCode.includes(modelDigits)) {
            score += 80;
            reasons.push(`exact model ${product.modelCode}`);
        }
        let lexicalMatches = 0;
        for (const token of queryTokens){
            if (productTokens.some((candidate)=>tokenMatches(token, candidate))) {
                lexicalMatches += 1;
                score += 5;
            }
        }
        if (lexicalMatches) reasons.push(`${lexicalMatches} description keyword${lexicalMatches === 1 ? "" : "s"} matched`);
        if (parsed.colors?.some((color)=>product.colors.includes(color))) {
            score += 14;
            reasons.push(`available in the requested colour family`);
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
}),
"[project]/lib/ai/assistant-schemas.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "advisorActionSchema",
    ()=>advisorActionSchema,
    "advisorAnswerSchema",
    ()=>advisorAnswerSchema,
    "alternativeMatchSchema",
    ()=>alternativeMatchSchema,
    "alternativeRequestSchema",
    ()=>alternativeRequestSchema,
    "alternativeResponseSchema",
    ()=>alternativeResponseSchema,
    "conversationContextSchema",
    ()=>conversationContextSchema,
    "conversationRecommendationSchema",
    ()=>conversationRecommendationSchema,
    "conversationSummarySchema",
    ()=>conversationSummarySchema,
    "materialAdviceSchema",
    ()=>materialAdviceSchema,
    "materialNeedsSchema",
    ()=>materialNeedsSchema,
    "voiceCommandSchema",
    ()=>voiceCommandSchema,
    "voiceIntentSchema",
    ()=>voiceIntentSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-ssr] (ecmascript) <export * as z>");
;
const alternativeRequestSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    sourceProductId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    requestText: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().max(1000).optional(),
    maxWidthMm: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().positive().optional(),
    minSeatHeightMm: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().nonnegative().optional(),
    maxIndicativePrice: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().nonnegative().optional(),
    requiredFunctions: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(20).optional(),
    excludedFunctions: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(20).optional(),
    materialTags: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(20).optional(),
    preserveStyle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    preserveComfort: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    strict: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional()
});
const alternativeMatchSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    productId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    exact: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    differences: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    benefits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    tradeOffs: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    unmetRequirements: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    explanation: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const alternativeResponseSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    sourceProductId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    exactMatches: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(alternativeMatchSchema),
    closestAlternatives: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(alternativeMatchSchema),
    message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const materialNeedsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    children: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    pets: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    highUse: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    strongSunlight: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    easyCareRequired: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    preferredColors: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    preferredMaterialGroups: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    avoidMaterialGroups: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional()
});
const materialAdviceSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    needs: materialNeedsSchema,
    recommendedMaterialIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    materialsToAvoid: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    explanationKeys: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string())
});
const voiceIntentSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    "SEARCH_PRODUCTS",
    "FILTER_PRODUCTS",
    "OPEN_PRODUCT",
    "COMPARE_PRODUCTS",
    "CONFIGURE_PRODUCT",
    "CHANGE_MATERIAL",
    "SAVE_TO_PROJECT",
    "ADD_COMPLEMENTARY_PRODUCT",
    "OPEN_ROOM_COMPOSER",
    "OPEN_FIT_CHECK",
    "FIND_RETAILER",
    "BOOK_CONSULTATION",
    "ASK_PRODUCT_QUESTION"
]);
const voiceCommandSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    intent: voiceIntentSchema,
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown()),
    requiresConfirmation: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean()
});
const advisorActionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "SEARCH_PRODUCTS",
        "COMPARE_PRODUCTS",
        "OPEN_PRODUCT",
        "CONFIGURE_PRODUCT",
        "SAVE_PRODUCT",
        "SAVE_CONFIGURATION",
        "OPEN_ROOM_COMPOSER",
        "OPEN_FIT_CHECK",
        "FIND_RETAILER",
        "PREPARE_HANDOVER",
        "BOOK_CONSULTATION",
        "SHOW_ALTERNATIVES",
        "SHOW_MATERIALS"
    ]),
    label: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown()),
    requiresConfirmation: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean()
});
const advisorAnswerSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    answer: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(3000),
    answerType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "fact",
        "products",
        "comparison",
        "materials",
        "configuration",
        "project",
        "room",
        "fit",
        "dealer",
        "missing-data"
    ]),
    productIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(12),
    materialIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(12),
    sources: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(12),
    proposedAction: advisorActionSchema.nullable(),
    suggestedQuestions: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(4)
});
const conversationContextSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    route: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500),
    currentProductId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().nullable().optional(),
    referencedProductIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(20).default([]),
    selectedProjectId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().nullable().optional(),
    selectedConfigurationId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().nullable().optional(),
    selectedMaterialIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(20).default([]),
    currentFilters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown()).default({}),
    approvedPreferences: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown()).default({})
});
const conversationRecommendationSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    productIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(12),
    rationale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(1200)
});
const conversationSummarySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    summary: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(3000)
});
}),
"[project]/lib/assistant.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "answerGroundedQuestion",
    ()=>answerGroundedQuestion,
    "findGroundedAlternatives",
    ()=>findGroundedAlternatives,
    "materialReasons",
    ()=>materialReasons,
    "parseMaterialNeeds",
    ()=>parseMaterialNeeds,
    "parseVoiceCommandDeterministic",
    ()=>parseVoiceCommandDeterministic,
    "validateProposedConfiguration",
    ()=>validateProposedConfiguration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$configurator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/configurator.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$search$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/search.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai/assistant-schemas.ts [app-ssr] (ecmascript)");
;
;
;
;
const colors = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$search$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["searchColorTerms"];
function requestedAlternative(input, source) {
    const text = input.requestText?.toLowerCase() ?? "";
    const narrower = text.match(/(\d{1,3})\s*cm\s*narrower/);
    const under = text.match(/(?:under|below|maximum|max)\s*(\d{2,3})\s*cm/);
    const price = text.match(/(?:under|below|maximum|max)\s*[€]?\s*(\d{3,5})/);
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["alternativeRequestSchema"].parse({
        ...input,
        maxWidthMm: input.maxWidthMm ?? (narrower ? source.widthMm - Number(narrower[1]) * 10 : under ? Number(under[1]) * 10 : undefined),
        minSeatHeightMm: input.minSeatHeightMm ?? (/higher seat|high[- ]seat|tall/.test(text) ? source.seatHeightMm + 10 : undefined),
        maxIndicativePrice: input.maxIndicativePrice ?? (/lower (?:indicative )?price|cheaper/.test(text) ? source.indicativePriceCents - 1 : price ? Number(price[1]) * 100 : undefined),
        requiredFunctions: [
            ...new Set([
                ...input.requiredFunctions ?? [],
                .../relax/.test(text) ? [
                    "relax"
                ] : [],
                .../modular/.test(text) ? [
                    "modular"
                ] : []
            ])
        ],
        excludedFunctions: [
            ...new Set([
                ...input.excludedFunctions ?? [],
                .../without electric|non-electric|no electric/.test(text) ? [
                    "electric"
                ] : []
            ])
        ],
        materialTags: [
            ...new Set([
                ...input.materialTags ?? [],
                .../easy[- ]care|children|family|pets?|dog/.test(text) ? [
                    "easy-care"
                ] : []
            ])
        ],
        preserveStyle: input.preserveStyle ?? /same style|similar style/.test(text),
        preserveComfort: input.preserveComfort ?? /same comfort/.test(text)
    });
}
function hasFunction(product, value) {
    if (value === "electric") return product.electricFunctions.length > 0;
    if (value === "modular") return product.modular;
    return product.functions.some((item)=>item.toLowerCase().includes(value.toLowerCase()));
}
function hasMaterialTag(product, tag) {
    const compatible = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["materials"].filter((material)=>product.materials.includes(material.id));
    if (tag === "easy-care") return compatible.some((material)=>material.easyCare);
    if (tag === "family") return compatible.some((material)=>material.familyFriendly);
    if (tag === "pet") return compatible.some((material)=>material.petFriendly);
    return compatible.some((material)=>material.type === tag || material.name.toLowerCase().includes(tag.toLowerCase()));
}
function findGroundedAlternatives(raw) {
    const source = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["products"].find((product)=>product.id === raw.sourceProductId && product.active);
    if (!source) throw new Error("Unknown source Product ID.");
    const request = requestedAlternative(raw, source);
    const candidates = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["products"].filter((product)=>product.active && product.id !== source.id && product.category === source.category);
    const ranked = candidates.map((product)=>{
        const checks = [];
        if (request.maxWidthMm) checks.push({
            ok: product.widthMm <= request.maxWidthMm,
            label: `width must be at most ${request.maxWidthMm} mm`
        });
        if (request.minSeatHeightMm) checks.push({
            ok: product.seatHeightMm >= request.minSeatHeightMm,
            label: `seat height must be at least ${request.minSeatHeightMm} mm`
        });
        if (request.maxIndicativePrice) checks.push({
            ok: product.indicativePriceCents <= request.maxIndicativePrice,
            label: "indicative price must be below the requested limit"
        });
        for (const value of request.requiredFunctions ?? [])checks.push({
            ok: hasFunction(product, value),
            label: `requires ${value}`
        });
        for (const value of request.excludedFunctions ?? [])checks.push({
            ok: !hasFunction(product, value),
            label: `must not include ${value}`
        });
        for (const value of request.materialTags ?? [])checks.push({
            ok: hasMaterialTag(product, value),
            label: `requires ${value} material metadata`
        });
        if (request.preserveStyle) checks.push({
            ok: source.styles.some((style)=>product.styles.includes(style)),
            label: "preserve style"
        });
        if (request.preserveComfort) checks.push({
            ok: source.comfortOptions.some((option)=>product.comfortOptions.includes(option)),
            label: "preserve comfort options"
        });
        const unmet = checks.filter((check)=>!check.ok).map((check)=>check.label);
        const benefits = [
            ...product.widthMm < source.widthMm ? [
                `${Math.round((source.widthMm - product.widthMm) / 10)} cm narrower`
            ] : [],
            ...product.seatHeightMm > source.seatHeightMm ? [
                `${Math.round((product.seatHeightMm - source.seatHeightMm) / 10)} cm higher seat`
            ] : [],
            ...product.indicativePriceCents < source.indicativePriceCents ? [
                "lower indicative concept price"
            ] : []
        ];
        const tradeOffs = [
            ...product.numberOfSeats < source.numberOfSeats ? [
                `one fewer seat than ${source.modelCode}`
            ] : [],
            ...product.widthMm > source.widthMm ? [
                "requires more floor width"
            ] : [],
            ...!product.modular && source.modular ? [
                "less modular flexibility"
            ] : []
        ];
        const differences = [
            `${product.widthMm} mm wide versus ${source.widthMm} mm`,
            `${product.seatHeightMm} mm seat height versus ${source.seatHeightMm} mm`
        ];
        return {
            product,
            exact: unmet.length === 0,
            unmet,
            score: checks.filter((check)=>check.ok).length * 20 - unmet.length * 25 - Math.abs(product.widthMm - source.widthMm) / 100,
            differences,
            benefits,
            tradeOffs
        };
    }).sort((left, right)=>right.score - left.score);
    const toMatch = (item)=>({
            productId: item.product.id,
            exact: item.exact,
            differences: item.differences,
            benefits: item.benefits.length ? item.benefits : [
                "similar catalogue category and product character"
            ],
            tradeOffs: item.tradeOffs.length ? item.tradeOffs : [
                "No additional trade-off is established in the connected data."
            ],
            unmetRequirements: item.unmet,
            explanation: item.exact ? `${item.product.modelCode} satisfies all selected requirements using available catalogue and material data.` : `${item.product.modelCode} is a close alternative, but ${item.unmet.join("; ")}.`
        });
    const exactMatches = ranked.filter((item)=>item.exact).slice(0, 6).map(toMatch);
    const closestAlternatives = request.strict ? [] : ranked.filter((item)=>!item.exact).slice(0, 6).map(toMatch);
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["alternativeResponseSchema"].parse({
        sourceProductId: source.id,
        exactMatches,
        closestAlternatives,
        message: exactMatches.length ? `${exactMatches.length} catalogue alternative${exactMatches.length === 1 ? "" : "s"} satisfy all requirements.` : "No exact alternative was found. The closest catalogue alternatives are labelled with every unmet condition."
    });
}
function parseMaterialNeeds(textValue) {
    const text = textValue.toLowerCase();
    const preferredColors = colors.filter((color)=>text.includes(color));
    const preferredMaterialGroups = [
        "leather",
        "fabric"
    ].filter((group)=>text.includes(group));
    const avoidMaterialGroups = text.match(/(?:avoid|without|no)\s+(leather|fabric)/)?.[1] ? [
        text.match(/(?:avoid|without|no)\s+(leather|fabric)/)[1]
    ] : [];
    const needs = {
        children: /children|child|kids?|kinder|family/.test(text),
        pets: /pets?|dog|cat|hund|katze/.test(text),
        highUse: /high use|everyday|daily|busy|frequent/.test(text),
        strongSunlight: /strong (?:afternoon )?sunlight|direct sun|sunny/.test(text),
        easyCareRequired: /easy[- ]care|easy clean|cleaning|children|pets?|dog|stain/.test(text),
        preferredColors: preferredColors.length ? preferredColors : undefined,
        preferredMaterialGroups: preferredMaterialGroups.length ? preferredMaterialGroups : undefined,
        avoidMaterialGroups: avoidMaterialGroups.length ? avoidMaterialGroups : undefined
    };
    const scored = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["materials"].map((material)=>{
        let score = 0;
        if (needs.children) score += material.familyFriendly ? 4 : -4;
        if (needs.pets) score += material.petFriendly ? 4 : -4;
        if (needs.highUse) score += material.durability;
        if (needs.easyCareRequired) score += material.easyCare ? 4 : -3;
        if (needs.strongSunlight) score += material.lightSensitivity === "low" ? 4 : material.lightSensitivity === "medium" ? 0 : -5;
        if (preferredColors.includes(material.colorFamily)) score += 3;
        if (preferredMaterialGroups.includes(material.type)) score += 3;
        if (avoidMaterialGroups.includes(material.type)) score -= 20;
        return {
            material,
            score
        };
    }).sort((left, right)=>right.score - left.score);
    const recommendedMaterialIds = scored.filter(({ score })=>score >= 3).slice(0, 5).map(({ material })=>material.id);
    const materialsToAvoid = scored.filter(({ score })=>score < 0).slice(-4).map(({ material })=>material.id);
    const explanationKeys = [
        ...needs.children ? [
            "family-suitability"
        ] : [],
        ...needs.pets ? [
            "pet-suitability"
        ] : [],
        ...needs.easyCareRequired ? [
            "easy-care"
        ] : [],
        ...needs.strongSunlight ? [
            "light-sensitivity"
        ] : [],
        "validated-care-instructions"
    ];
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["materialAdviceSchema"].parse({
        needs,
        recommendedMaterialIds,
        materialsToAvoid,
        explanationKeys
    });
}
function materialReasons(material, advice) {
    const suitable = [
        ...advice.needs.children && material.familyFriendly ? [
            "family-suitable metadata"
        ] : [],
        ...advice.needs.pets && material.petFriendly ? [
            "pet-suitable metadata"
        ] : [],
        ...advice.needs.easyCareRequired && material.easyCare ? [
            "easy-care metadata"
        ] : [],
        ...advice.needs.strongSunlight && material.lightSensitivity === "low" ? [
            "low light sensitivity"
        ] : [],
        `durability ${material.durability}/5`
    ];
    const cautions = [
        ...advice.needs.strongSunlight && material.lightSensitivity !== "low" ? [
            `${material.lightSensitivity} light sensitivity`
        ] : [],
        ...advice.needs.pets && !material.petFriendly ? [
            "not marked pet-suitable"
        ] : [],
        ...advice.needs.children && !material.familyFriendly ? [
            "not marked family-suitable"
        ] : [],
        ...!material.easyCare ? [
            "more involved care"
        ] : []
    ];
    return {
        suitable,
        cautions
    };
}
function parseVoiceCommandDeterministic(transcript) {
    const text = transcript.toLowerCase();
    const searchFilters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$search$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseSearchQuery"])(transcript);
    let intent = "ASK_PRODUCT_QUESTION";
    if (/book|consultation/.test(text)) intent = "BOOK_CONSULTATION";
    else if (/retailer|dealer|near me/.test(text)) intent = "FIND_RETAILER";
    else if (/fit|door|through/.test(text)) intent = "OPEN_FIT_CHECK";
    else if (/show .* in .*room|room composer|my room/.test(text)) intent = "OPEN_ROOM_COMPOSER";
    else if (/add .*table|matching table|complementary/.test(text)) intent = "ADD_COMPLEMENTARY_PRODUCT";
    else if (/save .*configuration/.test(text)) intent = "SAVE_TO_PROJECT";
    else if (/save|add .*project/.test(text)) intent = "SAVE_TO_PROJECT";
    else if (/change .*material|fabric|leather/.test(text) && /change|easy-care|grey|beige/.test(text)) intent = "CHANGE_MATERIAL";
    else if (/compare/.test(text)) intent = "COMPARE_PRODUCTS";
    else if (/configur/.test(text)) intent = "CONFIGURE_PRODUCT";
    else if (searchFilters.category || searchFilters.modelCode || /show me|find|search|looking for|recommend/.test(text)) intent = "SEARCH_PRODUCTS";
    const modelCodes = [
        ...transcript.matchAll(/\bMR\s*-?\s*\d{3,4}\b/gi)
    ].map((match)=>match[0].replace(/[\s-]+/g, " ").toUpperCase());
    const width = text.match(/(?:under|below|max(?:imum)?)\s*(\d{2,3})\s*(?:cm|centimet)/);
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["voiceCommandSchema"].parse({
        intent,
        parameters: {
            query: transcript,
            modelCodes,
            maxWidthMm: width ? Number(width[1]) * 10 : undefined
        },
        requiresConfirmation: [
            "SAVE_TO_PROJECT",
            "ADD_COMPLEMENTARY_PRODUCT",
            "CHANGE_MATERIAL",
            "BOOK_CONSULTATION"
        ].includes(intent)
    });
}
function groundedProductIds(ids) {
    const active = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["products"].filter((product)=>product.active).map((product)=>product.id));
    return [
        ...new Set(ids)
    ].filter((id)=>active.has(id));
}
const productDiscoveryPattern = /\b(sofa|couch|armchair|chair|recliner|sectional|table|storage|cabinet|sideboard|wardrobe|bed|bathroom|outdoor|garden|carpet|rug|lamp|furniture)\b/;
function supportsMaterialType(product, type) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["materials"].some((material)=>product.materials.includes(material.id) && material.type === type);
}
function productDiscoveryAnswer(question) {
    const text = question.toLowerCase();
    const filters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$search$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseSearchQuery"])(question);
    const discoveryLanguage = /\b(i want|i need|show me|find|search|looking for|recommend|suggest|do you have|available)\b/.test(text);
    const namedProduct = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["products"].find((product)=>product.active && (text.includes(product.modelCode.toLowerCase()) || text.includes(product.name.toLowerCase())));
    if (!filters.category && !filters.modelCode && !namedProduct && !(discoveryLanguage && productDiscoveryPattern.test(text))) return null;
    const requestedMaterial = /\bleather\b/.test(text) ? "leather" : /\b(fabric|textile|boucle|chenille|velvet)\b/.test(text) ? "fabric" : null;
    const wantsEasyCare = /easy[- ]care|easy to clean|pflegeleicht|family|familie|children|kinder|kids?|pets?|dog|hund|cat|katze/.test(text);
    const hardFilters = {
        ...filters,
        q: undefined
    };
    const exactCandidates = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["products"].filter((product)=>product.active && (!namedProduct || product.id === namedProduct.id) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$search$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["productMatches"])(product, hardFilters) && (!requestedMaterial || supportsMaterialType(product, requestedMaterial)) && (!wantsEasyCare || product.materials.some((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["materials"].find((material)=>material.id === id)?.easyCare)));
    const rankOrder = new Map((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$search$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["searchProductsRanked"])(question, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["products"].length).map((match, index)=>[
            match.product.id,
            index
        ]));
    const exact = exactCandidates.sort((left, right)=>(rankOrder.get(left.id) ?? 9999) - (rankOrder.get(right.id) ?? 9999) || left.modelCode.localeCompare(right.modelCode)).slice(0, 4);
    const requested = [];
    if (filters.category) requested.push(filters.category.replaceAll("-", " "));
    if (filters.colors?.length) requested.push(`${filters.colors.join(" or ")} colour`);
    if (requestedMaterial) requested.push(requestedMaterial);
    if (filters.maxWidthMm) requested.push(`maximum ${filters.maxWidthMm / 10} cm width`);
    if (filters.modular) requested.push("modular");
    if (filters.smallSpaceSuitable) requested.push("small-space suitable");
    if (filters.relaxFunction) requested.push("relax function");
    if (filters.electricFunctions) requested.push("electric function");
    if (wantsEasyCare) requested.push("easy-care material metadata");
    if (exact.length) {
        const exactIds = exact.map((product)=>product.id);
        const wantsComparison = /compare/.test(text);
        const comparisonAlternatives = wantsComparison && exactIds.length < 2 ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["products"].filter((product)=>product.active && product.category === exact[0].category && !exactIds.includes(product.id)).sort((left, right)=>(rankOrder.get(left.id) ?? 9999) - (rankOrder.get(right.id) ?? 9999)).slice(0, 2) : [];
        const ids = [
            ...exactIds,
            ...comparisonAlternatives.map((product)=>product.id)
        ];
        const comparisonNote = comparisonAlternatives.length ? ` ${exactIds.length === 1 ? "One product is an exact match" : `${exactIds.length} products are exact matches`}; the additional products are clearly labelled comparison alternatives and may not satisfy every filter.` : "";
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
            answer: `I found ${exact.length} exact catalogue match${exact.length === 1 ? "" : "es"}${requested.length ? ` for ${requested.join(", ")}` : ""}.${comparisonNote || " Every shown product satisfies the interpreted hard filters in the connected data."}`,
            answerType: "products",
            productIds: ids,
            materialIds: [],
            sources: [
                "Musterring product catalogue",
                ...requestedMaterial || wantsEasyCare ? [
                    "Musterring concept material metadata"
                ] : []
            ],
            proposedAction: wantsComparison && ids.length > 1 ? {
                type: "COMPARE_PRODUCTS",
                label: comparisonAlternatives.length ? "Compare match with alternatives" : "Compare the exact matches",
                parameters: {
                    productIds: ids.slice(0, 3)
                },
                requiresConfirmation: false
            } : null,
            suggestedQuestions: ids.length > 1 ? [
                "Which one is most compact?",
                "Compare the first three",
                "Save the first one"
            ] : [
                "Open the first product",
                "Find a similar alternative",
                "Save this product"
            ]
        });
    }
    const sameCategory = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["products"].filter((product)=>product.active && (!filters.category || product.category === filters.category));
    const alternatives = sameCategory.map((product)=>{
        let score = rankOrder.has(product.id) ? Math.max(0, 30 - (rankOrder.get(product.id) ?? 30)) : 0;
        if (filters.colors?.length && filters.colors.some((color)=>product.colors.includes(color))) score += 20;
        if (filters.maxWidthMm && product.widthMm <= filters.maxWidthMm) score += 15;
        if (filters.modular && product.modular) score += 12;
        if (filters.smallSpaceSuitable && product.smallSpaceSuitable) score += 12;
        if (filters.relaxFunction && product.functions.includes("relax")) score += 12;
        if (filters.electricFunctions && product.electricFunctions.length) score += 12;
        if (requestedMaterial && supportsMaterialType(product, requestedMaterial)) score += 10;
        if (wantsEasyCare && product.materials.some((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["materials"].find((material)=>material.id === id)?.easyCare)) score += 10;
        return {
            product,
            score
        };
    }).sort((left, right)=>right.score - left.score || left.product.modelCode.localeCompare(right.product.modelCode)).slice(0, 4).map(({ product })=>product);
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
        answer: `No catalogue product satisfies every requested condition${requested.length ? ` (${requested.join(", ")})` : ""}. The products below are closest recommendations and must not be treated as exact matches.`,
        answerType: "missing-data",
        productIds: alternatives.map((product)=>product.id),
        materialIds: [],
        sources: [
            "Musterring product catalogue"
        ],
        proposedAction: /compare/.test(text) && alternatives.length > 1 ? {
            type: "COMPARE_PRODUCTS",
            label: "Compare the closest recommendations",
            parameters: {
                productIds: alternatives.slice(0, 3).map((product)=>product.id)
            },
            requiresConfirmation: false
        } : null,
        suggestedQuestions: [
            "Remove one filter",
            "Show another colour",
            "Find a retailer"
        ]
    });
}
function answerGroundedQuestion(question, context) {
    const text = question.toLowerCase();
    const referenced = groundedProductIds(context.referencedProductIds);
    const code = question.match(/\bMR\s*-?\s*\d{3,4}\b/i)?.[0].replace(/[\s-]+/g, " ").toUpperCase();
    const current = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["products"].find((product)=>product.modelCode === code) ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["products"].find((product)=>product.id === context.currentProductId);
    const ordinal = /\b(first|1st)\b/.test(text) ? 0 : /\b(second|2nd)\b/.test(text) ? 1 : /\b(third|3rd)\b/.test(text) ? 2 : null;
    if (ordinal !== null && referenced[ordinal]) {
        const product = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["products"].find((item)=>item.id === referenced[ordinal]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
            answer: `The referenced product is ${product.modelCode}, ${product.name}.`,
            answerType: "fact",
            productIds: [
                product.id
            ],
            materialIds: [],
            sources: [
                "Musterring product catalogue"
            ],
            proposedAction: /save/.test(text) ? {
                type: "SAVE_PRODUCT",
                label: `Save ${product.modelCode} to My Musterring`,
                parameters: {
                    productId: product.id
                },
                requiresConfirmation: true
            } : /open|details?/.test(text) ? {
                type: "OPEN_PRODUCT",
                label: `Open ${product.modelCode}`,
                parameters: {
                    slug: product.slug
                },
                requiresConfirmation: false
            } : null,
            suggestedQuestions: [
                "Compare it with the first product",
                "Show its materials"
            ]
        });
    }
    if (/\bsave (this|it|the product)\b/.test(text) && (current || referenced[0])) {
        const product = current ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["products"].find((item)=>item.id === referenced[0]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
            answer: `I can save ${product.modelCode}, ${product.name}, to My Musterring after confirmation.`,
            answerType: "project",
            productIds: [
                product.id
            ],
            materialIds: [],
            sources: [
                "Musterring product catalogue"
            ],
            proposedAction: {
                type: "SAVE_PRODUCT",
                label: `Save ${product.modelCode} to My Musterring`,
                parameters: {
                    productId: product.id
                },
                requiresConfirmation: true
            },
            suggestedQuestions: [
                "Open the product",
                "Prepare my project for a retailer"
            ]
        });
    }
    if (/missing|prepare .*retailer|contact a retailer/.test(text)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
            answer: "Before retailer handover, review the selected retailer, requested action, contact details, room measurements, material choice, configuration validity and unresolved fit warnings. I can prepare this context, but I will not submit it.",
            answerType: "dealer",
            productIds: referenced,
            materialIds: context.selectedMaterialIds,
            sources: [
                "My Musterring project data",
                "Saved fit reports"
            ],
            proposedAction: {
                type: "PREPARE_HANDOVER",
                label: "Review retailer handover checklist",
                parameters: {},
                requiresConfirmation: true
            },
            suggestedQuestions: [
                "Summarize my decisions",
                "Which room measurements are missing?"
            ]
        });
    }
    if (/material|dog|pet|children|care/.test(text) && !/sofa|couch|armchair|chair|sectional|table|bed|wardrobe|outdoor|carpet|rug|lamp|compare|find|show me|i need|i want/.test(text)) {
        const advice = parseMaterialNeeds(question);
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
            answer: "These recommendations use only recorded material durability, easy-care, family, pet and light-sensitivity attributes. No material is described as stain-proof, scratch-proof or allergy-safe.",
            answerType: "materials",
            productIds: current ? [
                current.id
            ] : [],
            materialIds: advice.recommendedMaterialIds,
            sources: [
                "Musterring concept material metadata"
            ],
            proposedAction: {
                type: "SHOW_MATERIALS",
                label: "Open Material & Care Advisor",
                parameters: {
                    query: question
                },
                requiresConfirmation: false
            },
            suggestedQuestions: [
                "Why should I avoid another material?",
                "Show the care plan"
            ]
        });
    }
    if (/\b(fit|door|doorway|delivery route|through)\b/.test(text)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
            answer: current ? `Available product data lists ${current.modelCode} package guidance, but physical fit cannot be confirmed here. Use Will It Fit? with your measured route and retailer verification.` : "Select a product and use Will It Fit? with measured room and delivery-route data.",
            answerType: "fit",
            productIds: current ? [
                current.id
            ] : referenced,
            materialIds: [],
            sources: [
                "Product package data",
                "Will It Fit? deterministic service"
            ],
            proposedAction: current ? {
                type: "OPEN_FIT_CHECK",
                label: `Check ${current.modelCode}`,
                parameters: {
                    slug: current.slug
                },
                requiresConfirmation: false
            } : null,
            suggestedQuestions: [
                "Which measurements do I need?",
                "Prepare a technical fit request"
            ]
        });
    }
    if (/smaller|alternative|same style|better match/.test(text) && current) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
            answer: `I can compare ${current.modelCode} with catalogue alternatives and show every unmet requirement rather than silently ignoring it.`,
            answerType: "products",
            productIds: [
                current.id
            ],
            materialIds: [],
            sources: [
                "Musterring product catalogue"
            ],
            proposedAction: {
                type: "SHOW_ALTERNATIVES",
                label: `Find alternatives to ${current.modelCode}`,
                parameters: {
                    productId: current.id,
                    requestText: question
                },
                requiresConfirmation: false
            },
            suggestedQuestions: [
                "Make it 30 cm narrower",
                "Require a higher seat"
            ]
        });
    }
    if (/highest seat|lowest seat|smallest|most compact|narrowest|widest|difference|compare/.test(text) && referenced.length >= 2) {
        const selected = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["products"].filter((product)=>referenced.includes(product.id));
        const highlighted = /lowest seat/.test(text) ? [
            ...selected
        ].sort((a, b)=>a.seatHeightMm - b.seatHeightMm)[0] : /smallest|most compact|narrowest/.test(text) ? [
            ...selected
        ].sort((a, b)=>a.widthMm - b.widthMm)[0] : /widest/.test(text) ? [
            ...selected
        ].sort((a, b)=>b.widthMm - a.widthMm)[0] : [
            ...selected
        ].sort((a, b)=>b.seatHeightMm - a.seatHeightMm)[0];
        const comparisonText = /smallest|most compact|narrowest/.test(text) ? `${highlighted.modelCode} is the narrowest referenced product at ${highlighted.widthMm / 10} cm.` : /widest/.test(text) ? `${highlighted.modelCode} is the widest referenced product at ${highlighted.widthMm / 10} cm.` : /lowest seat/.test(text) ? `${highlighted.modelCode} has the lowest recorded seat height among these products at ${highlighted.seatHeightMm / 10} cm.` : `${highlighted.modelCode} has the highest recorded seat height among these products at ${highlighted.seatHeightMm / 10} cm.`;
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
            answer: `${comparisonText} Final options must be confirmed against validated product data.`,
            answerType: "comparison",
            productIds: selected.map((product)=>product.id),
            materialIds: [],
            sources: [
                "Musterring product catalogue"
            ],
            proposedAction: {
                type: "COMPARE_PRODUCTS",
                label: "Open comparison",
                parameters: {
                    productIds: selected.map((product)=>product.id)
                },
                requiresConfirmation: false
            },
            suggestedQuestions: [
                "Which is most compact?",
                "Find a higher-seat alternative"
            ]
        });
    }
    if (current && /seat|dimension|width|depth|height|price|cost|colou?r|material|electric|relax|modular|function/.test(text) && !/\b(i want|i need|show me|find|search|looking for|recommend)\b/.test(text)) {
        const recordedMaterials = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["materials"].filter((material)=>current.materials.includes(material.id));
        const facts = /price|cost/.test(text) ? `No confirmed price for ${current.modelCode} is available in the connected catalogue data.` : /colou?r/.test(text) ? `${current.modelCode} has these recorded colour families: ${current.colors.join(", ") || "none recorded"}.` : /material/.test(text) ? `${current.modelCode} has these validated material options: ${recordedMaterials.map((material)=>material.name).join(", ") || "none recorded"}.` : /electric|relax|function/.test(text) ? `${current.modelCode} has these recorded functions: ${[
            ...current.functions,
            ...current.electricFunctions
        ].join(", ") || "none recorded"}.` : `${current.modelCode} is recorded at ${current.widthMm / 10} cm wide, ${current.depthMm / 10} cm deep and ${current.heightMm / 10} cm high, with a ${current.seatHeightMm / 10} cm seat height. ${current.modular ? "It is marked modular." : "It is not marked modular."}`;
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
            answer: `${facts} Final pricing, availability and technical confirmation are provided by the selected Musterring retailer.`,
            answerType: "fact",
            productIds: [
                current.id
            ],
            materialIds: [],
            sources: [
                "Musterring product catalogue"
            ],
            proposedAction: /electric|relax|configur/.test(text) ? {
                type: "CONFIGURE_PRODUCT",
                label: `Validate options for ${current.modelCode}`,
                parameters: {
                    slug: current.slug
                },
                requiresConfirmation: false
            } : null,
            suggestedQuestions: [
                "Find a better match",
                "Explain compatible materials"
            ]
        });
    }
    const discovery = productDiscoveryAnswer(question);
    if (discovery) return discovery;
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
        answer: "Information is not currently available in the connected product data. Ask about Musterring products, materials, configuration, room planning, fit guidance, saved projects or retailer preparation.",
        answerType: "missing-data",
        productIds: [],
        materialIds: [],
        sources: [],
        proposedAction: null,
        suggestedQuestions: [
            "Help me find the right sofa",
            "Choose a material",
            "Prepare my project for a retailer"
        ]
    });
}
function validateProposedConfiguration(configuration) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$configurator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateConfiguration"])(configuration);
}
}),
"[project]/components/MaterialAdvisor.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MaterialAdvisor",
    ()=>MaterialAdvisor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-ssr] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$assistant$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/assistant.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/persistence.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
const demoRequest = "I have two children, a dog and strong afternoon sunlight.";
function MaterialAdvisor() {
    const [requestText, setRequestText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(demoRequest);
    const [advice, setAdvice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("idle");
    const [saved, setSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [notice, setNotice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setSaved(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].savedMaterials());
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].track({
            name: "material_advisor_opened",
            route: "/materials"
        });
        const query = new URLSearchParams(window.location.search).get("advisor");
        if (query) setRequestText(query);
    }, []);
    const submit = async ()=>{
        setStatus("loading");
        setNotice("");
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].track({
            name: "material_advisor_submitted"
        });
        const response = await fetch("/api/ai/material-advice", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                requestText
            })
        }).catch(()=>null);
        const payload = response ? await response.json().catch(()=>null) : null;
        if (!response?.ok || !payload?.recommendedMaterialIds) {
            setStatus("error");
            return;
        }
        setAdvice(payload);
        setStatus("idle");
    };
    const apply = (materialId)=>{
        const configurations = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].configurations();
        const latest = configurations.at(-1);
        if (!latest) {
            setNotice("Save a compatible product configuration first.");
            return;
        }
        const product = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["products"].find((item)=>item.id === latest.productId);
        if (!product?.materials.includes(materialId)) {
            setNotice("This material is not recorded as compatible with the current configuration.");
            return;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].saveConfiguration({
            ...latest,
            materialId,
            updatedAt: new Date().toISOString()
        });
        setNotice(`Applied to configuration ${latest.id}. Product compatibility was retained.`);
    };
    const recommended = advice ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["materials"].filter((material)=>advice.recommendedMaterialIds.includes(material.id)) : [];
    const avoided = advice ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["materials"].filter((material)=>advice.materialsToAvoid.includes(material.id)) : [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "material-advisor",
        "aria-labelledby": "material-advisor-title",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "stitch-eyebrow",
                        children: "AI Material & Care Advisor"
                    }, void 0, false, {
                        fileName: "[project]/components/MaterialAdvisor.tsx",
                        lineNumber: 45,
                        columnNumber: 10
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        id: "material-advisor-title",
                        children: "Material & Care Advisor"
                    }, void 0, false, {
                        fileName: "[project]/components/MaterialAdvisor.tsx",
                        lineNumber: 45,
                        columnNumber: 70
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Recommendations use recorded composition, durability, care, family, pet and light-sensitivity metadata. Unsupported protection or allergy claims are never added."
                    }, void 0, false, {
                        fileName: "[project]/components/MaterialAdvisor.tsx",
                        lineNumber: 45,
                        columnNumber: 130
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/MaterialAdvisor.tsx",
                lineNumber: 45,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "material-advisor-input",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "material-advisor-request",
                        children: "Describe your home and everyday needs"
                    }, void 0, false, {
                        fileName: "[project]/components/MaterialAdvisor.tsx",
                        lineNumber: 46,
                        columnNumber: 45
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        id: "material-advisor-request",
                        value: requestText,
                        onChange: (event)=>setRequestText(event.target.value)
                    }, void 0, false, {
                        fileName: "[project]/components/MaterialAdvisor.tsx",
                        lineNumber: 46,
                        columnNumber: 132
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>void submit(),
                        disabled: status === "loading",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {}, void 0, false, {
                                fileName: "[project]/components/MaterialAdvisor.tsx",
                                lineNumber: 46,
                                columnNumber: 321
                            }, this),
                            status === "loading" ? "Checking material metadata…" : "Advise me"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MaterialAdvisor.tsx",
                        lineNumber: 46,
                        columnNumber: 251
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/MaterialAdvisor.tsx",
                lineNumber: 46,
                columnNumber: 5
            }, this),
            status === "error" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                role: "alert",
                children: "Material advice is temporarily unavailable. Browse the validated attributes below."
            }, void 0, false, {
                fileName: "[project]/components/MaterialAdvisor.tsx",
                lineNumber: 47,
                columnNumber: 27
            }, this) : null,
            notice ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                role: "status",
                children: notice
            }, void 0, false, {
                fileName: "[project]/components/MaterialAdvisor.tsx",
                lineNumber: 48,
                columnNumber: 15
            }, this) : null,
            advice ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "material-advice-results",
                "aria-live": "polite",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Recommended from available material data"
                            }, void 0, false, {
                                fileName: "[project]/components/MaterialAdvisor.tsx",
                                lineNumber: 50,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: Object.entries(advice.needs).filter(([, value])=>value === true).map(([key])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: key.replace(/([A-Z])/g, " $1")
                                    }, key, false, {
                                        fileName: "[project]/components/MaterialAdvisor.tsx",
                                        lineNumber: 50,
                                        columnNumber: 152
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/MaterialAdvisor.tsx",
                                lineNumber: 50,
                                columnNumber: 64
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MaterialAdvisor.tsx",
                        lineNumber: 50,
                        columnNumber: 7
                    }, this),
                    recommended.map((material)=>{
                        const reasons = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$assistant$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["materialReasons"])(material, advice);
                        const compatible = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["products"].filter((product)=>product.active && product.materials.includes(material.id)).slice(0, 5);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "material-swatch",
                                    style: {
                                        background: material.colorFamily
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/MaterialAdvisor.tsx",
                                    lineNumber: 55,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "stitch-eyebrow",
                                            children: [
                                                "Material ID ",
                                                material.id
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/MaterialAdvisor.tsx",
                                            lineNumber: 56,
                                            columnNumber: 16
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: material.name
                                        }, void 0, false, {
                                            fileName: "[project]/components/MaterialAdvisor.tsx",
                                            lineNumber: 56,
                                            columnNumber: 75
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                "Suitable because: ",
                                                reasons.suitable.join("; "),
                                                "."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/MaterialAdvisor.tsx",
                                            lineNumber: 56,
                                            columnNumber: 99
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Care effort:"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/MaterialAdvisor.tsx",
                                                    lineNumber: 56,
                                                    columnNumber: 157
                                                }, this),
                                                " ",
                                                material.easyCare ? "Lower based on easy-care metadata" : "Follow the recorded care instructions carefully",
                                                " · ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Durability:"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/MaterialAdvisor.tsx",
                                                    lineNumber: 56,
                                                    columnNumber: 299
                                                }, this),
                                                " ",
                                                material.durability,
                                                "/5 · ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Light sensitivity:"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/MaterialAdvisor.tsx",
                                                    lineNumber: 56,
                                                    columnNumber: 354
                                                }, this),
                                                " ",
                                                material.lightSensitivity
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/MaterialAdvisor.tsx",
                                            lineNumber: 56,
                                            columnNumber: 154
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "material-care-plan",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    children: "Material care plan"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/MaterialAdvisor.tsx",
                                                    lineNumber: 57,
                                                    columnNumber: 53
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {}, void 0, false, {
                                                            fileName: "[project]/components/MaterialAdvisor.tsx",
                                                            lineNumber: 57,
                                                            columnNumber: 83
                                                        }, this),
                                                        " Regular maintenance: ",
                                                        material.care
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/MaterialAdvisor.tsx",
                                                    lineNumber: 57,
                                                    columnNumber: 80
                                                }, this),
                                                advice.needs.strongSunlight ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {}, void 0, false, {
                                                            fileName: "[project]/components/MaterialAdvisor.tsx",
                                                            lineNumber: 57,
                                                            columnNumber: 167
                                                        }, this),
                                                        " Sunlight: reduce prolonged direct exposure, especially when sensitivity is medium or high."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/MaterialAdvisor.tsx",
                                                    lineNumber: 57,
                                                    columnNumber: 164
                                                }, this) : null,
                                                advice.needs.pets ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {}, void 0, false, {
                                                            fileName: "[project]/components/MaterialAdvisor.tsx",
                                                            lineNumber: 57,
                                                            columnNumber: 303
                                                        }, this),
                                                        " Pet care: vacuum loose hair regularly; pet suitability is shown only when recorded."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/MaterialAdvisor.tsx",
                                                    lineNumber: 57,
                                                    columnNumber: 300
                                                }, this) : null,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                    children: "Official care-document links are not currently available in the connected data."
                                                }, void 0, false, {
                                                    fileName: "[project]/components/MaterialAdvisor.tsx",
                                                    lineNumber: 57,
                                                    columnNumber: 408
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/MaterialAdvisor.tsx",
                                            lineNumber: 57,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                "Compatible products: ",
                                                compatible.map((product)=>product.modelCode).join(", ") || "Information is not currently available in the connected product data."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/MaterialAdvisor.tsx",
                                            lineNumber: 58,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "assistant-card-actions",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        setSaved(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].toggleMaterial(material.id));
                                                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].track({
                                                            name: "material_recommendation_selected",
                                                            materialId: material.id
                                                        });
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {}, void 0, false, {
                                                            fileName: "[project]/components/MaterialAdvisor.tsx",
                                                            lineNumber: 59,
                                                            columnNumber: 214
                                                        }, this),
                                                        saved.includes(material.id) ? "Saved Material" : "Save Material to Project"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/MaterialAdvisor.tsx",
                                                    lineNumber: 59,
                                                    columnNumber: 53
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>apply(material.id),
                                                    children: "Apply to Current Configuration"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/MaterialAdvisor.tsx",
                                                    lineNumber: 59,
                                                    columnNumber: 308
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/handover?request=material&material=${material.id}`,
                                                    children: "Request Physical Sample"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/MaterialAdvisor.tsx",
                                                    lineNumber: 59,
                                                    columnNumber: 390
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/MaterialAdvisor.tsx",
                                            lineNumber: 59,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/MaterialAdvisor.tsx",
                                    lineNumber: 56,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, material.id, true, {
                            fileName: "[project]/components/MaterialAdvisor.tsx",
                            lineNumber: 54,
                            columnNumber: 16
                        }, this);
                    }),
                    avoided.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Why another material may not be suitable"
                            }, void 0, false, {
                                fileName: "[project]/components/MaterialAdvisor.tsx",
                                lineNumber: 63,
                                columnNumber: 32
                            }, this),
                            avoided.map((material)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: [
                                                material.name,
                                                ":"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/MaterialAdvisor.tsx",
                                            lineNumber: 63,
                                            columnNumber: 129
                                        }, this),
                                        " ",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$assistant$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["materialReasons"])(material, advice).cautions.join("; ") || "it does not rank as strongly against the stated needs",
                                        "."
                                    ]
                                }, material.id, true, {
                                    fileName: "[project]/components/MaterialAdvisor.tsx",
                                    lineNumber: 63,
                                    columnNumber: 108
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MaterialAdvisor.tsx",
                        lineNumber: 63,
                        columnNumber: 25
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/MaterialAdvisor.tsx",
                lineNumber: 49,
                columnNumber: 15
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/MaterialAdvisor.tsx",
        lineNumber: 44,
        columnNumber: 10
    }, this);
}
}),
"[project]/components/MaterialsClient.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MaterialsClient",
    ()=>MaterialsClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$compare$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GitCompare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/git-compare.js [app-ssr] (ecmascript) <export default as GitCompare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-ssr] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/persistence.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MaterialAdvisor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/MaterialAdvisor.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
function MaterialsClient() {
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [saved, setSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [notice, setNotice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>setSaved(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].savedMaterials()), []);
    const toggleCompare = (id)=>{
        setNotice("");
        setSelected((current)=>{
            if (current.includes(id)) return current.filter((item)=>item !== id);
            if (current.length >= 3) {
                setNotice("Compare up to three materials.");
                return current;
            }
            return [
                ...current,
                id
            ];
        });
    };
    const compared = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["materials"].filter((material)=>selected.includes(material.id));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "section",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "eyebrow",
                    children: "Material Explorer"
                }, void 0, false, {
                    fileName: "[project]/components/MaterialsClient.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "h2",
                    children: "Compare textures, care and compatibility."
                }, void 0, false, {
                    fileName: "[project]/components/MaterialsClient.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "lead",
                    children: "Select up to three planning materials, save favorites locally, or request a physical sample from a Musterring retailer."
                }, void 0, false, {
                    fileName: "[project]/components/MaterialsClient.tsx",
                    lineNumber: 32,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MaterialAdvisor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MaterialAdvisor"], {}, void 0, false, {
                    fileName: "[project]/components/MaterialsClient.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, this),
                notice ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    role: "alert",
                    className: "card card-body",
                    children: notice
                }, void 0, false, {
                    fileName: "[project]/components/MaterialsClient.tsx",
                    lineNumber: 34,
                    columnNumber: 19
                }, this) : null,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-3",
                    children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["materials"].map((material)=>{
                        const isSaved = saved.includes(material.id);
                        const isSelected = selected.includes(material.id);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            className: "card card-body",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "eyebrow",
                                    children: [
                                        material.type,
                                        " · ",
                                        material.colorFamily
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/MaterialsClient.tsx",
                                    lineNumber: 40,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: material.name
                                }, void 0, false, {
                                    fileName: "[project]/components/MaterialsClient.tsx",
                                    lineNumber: 41,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        material.texture,
                                        " · ",
                                        material.composition
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/MaterialsClient.tsx",
                                    lineNumber: 42,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        "Durability ",
                                        material.durability,
                                        "/5 · Light sensitivity ",
                                        material.lightSensitivity
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/MaterialsClient.tsx",
                                    lineNumber: 43,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "chips",
                                    children: [
                                        material.easyCare ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "chip",
                                            children: "Easy care"
                                        }, void 0, false, {
                                            fileName: "[project]/components/MaterialsClient.tsx",
                                            lineNumber: 44,
                                            columnNumber: 59
                                        }, this) : null,
                                        material.familyFriendly ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "chip",
                                            children: "Family friendly"
                                        }, void 0, false, {
                                            fileName: "[project]/components/MaterialsClient.tsx",
                                            lineNumber: 44,
                                            columnNumber: 133
                                        }, this) : null,
                                        material.petFriendly ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "chip",
                                            children: "Pet friendly"
                                        }, void 0, false, {
                                            fileName: "[project]/components/MaterialsClient.tsx",
                                            lineNumber: 44,
                                            columnNumber: 210
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/MaterialsClient.tsx",
                                    lineNumber: 44,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "muted",
                                    children: material.care
                                }, void 0, false, {
                                    fileName: "[project]/components/MaterialsClient.tsx",
                                    lineNumber: 45,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        "Compatible products: ",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["products"].filter((product)=>product.materials.includes(material.id)).length
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/MaterialsClient.tsx",
                                    lineNumber: 46,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "chips",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "button ghost",
                                            onClick: ()=>toggleCompare(material.id),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$compare$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GitCompare$3e$__["GitCompare"], {
                                                    size: 15
                                                }, void 0, false, {
                                                    fileName: "[project]/components/MaterialsClient.tsx",
                                                    lineNumber: 48,
                                                    columnNumber: 93
                                                }, this),
                                                " ",
                                                isSelected ? "Remove from compare" : "Compare"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/MaterialsClient.tsx",
                                            lineNumber: 48,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "button ghost",
                                            onClick: ()=>setSaved(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].toggleMaterial(material.id)),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                    size: 15
                                                }, void 0, false, {
                                                    fileName: "[project]/components/MaterialsClient.tsx",
                                                    lineNumber: 49,
                                                    columnNumber: 112
                                                }, this),
                                                " ",
                                                isSaved ? "Saved" : "Save Material"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/MaterialsClient.tsx",
                                            lineNumber: 49,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            className: "button consult",
                                            href: `/handover?request=material&material=${encodeURIComponent(material.id)}`,
                                            children: "Request Physical Sample"
                                        }, void 0, false, {
                                            fileName: "[project]/components/MaterialsClient.tsx",
                                            lineNumber: 50,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/MaterialsClient.tsx",
                                    lineNumber: 47,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, material.id, true, {
                            fileName: "[project]/components/MaterialsClient.tsx",
                            lineNumber: 39,
                            columnNumber: 20
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/components/MaterialsClient.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this),
                compared.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "section",
                    "aria-label": "Material comparison",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "eyebrow",
                            children: "Selected comparison"
                        }, void 0, false, {
                            fileName: "[project]/components/MaterialsClient.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "h2",
                            children: "Material characteristics"
                        }, void 0, false, {
                            fileName: "[project]/components/MaterialsClient.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "stitch-compare-rows",
                            children: [
                                "type",
                                "colorFamily",
                                "texture",
                                "composition",
                                "durability",
                                "lightSensitivity",
                                "care"
                            ].map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                            children: field
                                        }, void 0, false, {
                                            fileName: "[project]/components/MaterialsClient.tsx",
                                            lineNumber: 59,
                                            columnNumber: 138
                                        }, this),
                                        compared.map((material)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: String(material[field])
                                            }, material.id, false, {
                                                fileName: "[project]/components/MaterialsClient.tsx",
                                                lineNumber: 59,
                                                columnNumber: 180
                                            }, this))
                                    ]
                                }, field, true, {
                                    fileName: "[project]/components/MaterialsClient.tsx",
                                    lineNumber: 59,
                                    columnNumber: 121
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/MaterialsClient.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            role: "status",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/components/MaterialsClient.tsx",
                                    lineNumber: 61,
                                    columnNumber: 28
                                }, this),
                                " ",
                                compared.length,
                                " material",
                                compared.length === 1 ? "" : "s",
                                " selected."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/MaterialsClient.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/MaterialsClient.tsx",
                    lineNumber: 55,
                    columnNumber: 28
                }, this) : null
            ]
        }, void 0, true, {
            fileName: "[project]/components/MaterialsClient.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/MaterialsClient.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_8bd94ce1._.js.map