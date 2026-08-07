module.exports = [
"[project]/.next-internal/server/app/api/ai/image/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:fs/promises [external] (node:fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs/promises", () => require("node:fs/promises"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[project]/lib/ai/schemas.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "comfortPreferencesSchema",
    ()=>comfortPreferencesSchema,
    "complementaryRecommendationSchema",
    ()=>complementaryRecommendationSchema,
    "configurationRequirementsSchema",
    ()=>configurationRequirementsSchema,
    "imageUploadSchema",
    ()=>imageUploadSchema,
    "matchExplanationSchema",
    ()=>matchExplanationSchema,
    "retailerProjectDataSchema",
    ()=>retailerProjectDataSchema,
    "retailerSummarySchema",
    ()=>retailerSummarySchema,
    "roomAnalysisSchema",
    ()=>roomAnalysisSchema,
    "searchIntentSchema",
    ()=>searchIntentSchema,
    "visualTagsSchema",
    ()=>visualTagsSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
;
const nullableString = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().nullable();
const nullableNumber = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().nonnegative().nullable();
const nullableBoolean = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().nullable();
const nullableStrings = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).nullable();
const searchIntentSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    queryText: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1).max(1000),
    category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "sofa",
        "armchair",
        "sectional",
        "storage",
        "coffee-table",
        "bedroom-series",
        "bed",
        "wardrobe",
        "dining-chair",
        "dining-table",
        "bathroom",
        "kitchen",
        "outdoor",
        "small-furniture",
        "carpet",
        "lamp",
        "home-textile"
    ]).nullable(),
    colorFamilies: nullableStrings,
    materials: nullableStrings,
    maxWidthMm: nullableNumber,
    minSeatHeightMm: nullableNumber,
    maxSeatDepthMm: nullableNumber,
    numberOfSeats: nullableNumber,
    modular: nullableBoolean,
    functions: nullableStrings,
    styles: nullableStrings,
    roomType: nullableString,
    smallSpaceSuitable: nullableBoolean
});
const visualTagsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "sofa",
        "armchair",
        "sectional",
        "storage"
    ]).nullable(),
    colorFamilies: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    likelyMaterial: nullableString,
    style: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    silhouette: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    notableVisualFeatures: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string())
});
const roomAnalysisSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    roomType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    visibleFloorRegion: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    approximateWallAreas: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    windows: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    doors: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    existingMajorFurniture: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    dominantColors: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    styleTags: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    lightingDescription: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const configurationRequirementsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    customerRequest: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "sofa",
        "armchair",
        "sectional"
    ]).nullable(),
    colorFamily: nullableString,
    materialType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "fabric",
        "leather"
    ]).nullable(),
    easyCare: nullableBoolean,
    maxWidthMm: nullableNumber,
    numberOfSeats: nullableNumber,
    modular: nullableBoolean,
    relaxFunction: nullableBoolean,
    electricFunction: nullableBoolean,
    comfort: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "soft",
        "balanced",
        "firm"
    ]).nullable(),
    posture: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "upright",
        "relaxed"
    ]).nullable()
});
const comfortPreferencesSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    sourceText: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    tallUser: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    comfort: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "soft",
        "balanced",
        "firm"
    ]),
    posture: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "upright",
        "relaxed"
    ]),
    pets: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    children: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    easyCare: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    electric: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    maxWidthMm: nullableNumber,
    numberOfSeats: nullableNumber
});
const matchExplanationSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    explanation: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(600)
});
const complementaryRecommendationSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    categories: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "sofa",
        "armchair",
        "sectional",
        "storage"
    ])),
    colorFamilies: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    styles: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    rationale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const retailerProjectDataSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    customerIntent: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(2000),
    productIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(50),
    configurationIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(50),
    materialIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(50),
    roomPlan: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown()).nullable(),
    fitWarnings: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(50),
    requestedRetailerAction: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500)
});
const retailerSummarySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    summary: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(3000)
});
const imageUploadSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "image/jpeg",
        "image/png",
        "image/webp"
    ]),
    size: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().positive().max(10 * 1024 * 1024),
    consent: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(true)
});
}),
"[project]/lib/generated/musterring-catalog.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("{\"importedAt\":\"2026-08-03T08:03:05.835Z\",\"authorizedForProduction\":true,\"permissionBasis\":\"Client-confirmed Musterring rebranding authorization\",\"products\":[{\"appProductId\":\"musterring-justb-pm100\",\"slug\":\"justb-pm100\",\"modelCode\":\"JUSTB! PM100\",\"name\":\"JUSTB! PM100\",\"tagline\":\"The sofa as the centre of life\",\"description\":\"As a flexible modular sofa, the JustB! PM100 adapts to your needs. Discover and configure it now.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/justb-pm100\",\"images\":[\"/musterring-catalog/justb-pm100/image-01.jpg\",\"/musterring-catalog/justb-pm100/image-02.jpg\",\"/musterring-catalog/justb-pm100/image-03.jpg\",\"/musterring-catalog/justb-pm100/image-04.jpg\",\"/musterring-catalog/justb-pm100/image-05.jpg\",\"/musterring-catalog/justb-pm100/image-06.jpg\",\"/musterring-catalog/justb-pm100/image-07.jpg\",\"/musterring-catalog/justb-pm100/image-08.jpg\"]},{\"appProductId\":\"musterring-justb-pm200\",\"slug\":\"justb-pm200\",\"modelCode\":\"JUSTB! PM200\",\"name\":\"JUSTB! PM200\",\"tagline\":\"In perfect shape!\",\"description\":\"More space is not possible. Our JustB! PM200 sofa is the ideal model for anyone who doesn\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/justb-pm200\",\"images\":[\"/musterring-catalog/justb-pm200/image-01.jpg\",\"/musterring-catalog/justb-pm200/image-02.jpg\",\"/musterring-catalog/justb-pm200/image-03.jpg\",\"/musterring-catalog/justb-pm200/image-04.jpg\",\"/musterring-catalog/justb-pm200/image-05.jpg\",\"/musterring-catalog/justb-pm200/image-06.jpg\",\"/musterring-catalog/justb-pm200/image-07.jpg\",\"/musterring-catalog/justb-pm200/image-08.jpg\"]},{\"appProductId\":\"musterring-mr-kleo\",\"slug\":\"mr-kleo\",\"modelCode\":\"MR KLEO\",\"name\":\"MR KLEO\",\"tagline\":\"Royal seating pleasure\",\"description\":\"Musterring: Do you like it extravagant? Then take a seat on the MR KLEO designer armchair from the Gallery M collection.\",\"category\":\"armchair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-kleo\",\"images\":[\"/musterring-catalog/mr-kleo/image-01.jpg\",\"/musterring-catalog/mr-kleo/image-02.png\"]},{\"appProductId\":\"musterring-mr-alena\",\"slug\":\"mr-alena\",\"modelCode\":\"MR ALENA\",\"name\":\"MR ALENA\",\"tagline\":\"Relaxation at the touch of a button\",\"description\":\"The MR ALENA sofa range from Musterring is available in fabric or leather, can be fitted with metal legs or runners, and can be complemented with a longchair, footstool and cushions.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-alena\",\"images\":[\"/musterring-catalog/mr-alena/image-01.png\"]},{\"appProductId\":\"musterring-mr-lia\",\"slug\":\"mr-lia\",\"modelCode\":\"MR LIA\",\"name\":\"MR LIA\",\"tagline\":\"Open to life\",\"description\":\"With its open seating areas, the minimalist MR LIA sofa range offers plenty of space to relax, whilst comfortable rolled back cushions provide the necessary support.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-lia\",\"images\":[\"/musterring-catalog/mr-lia/image-01.png\"]},{\"appProductId\":\"musterring-mr-lucia\",\"slug\":\"mr-lucia\",\"modelCode\":\"MR LUCIA\",\"name\":\"MR LUCIA\",\"tagline\":\"Sofas as unique as you are!\",\"description\":\"Casual, elegant or minimalist? The MR LUCIA sofa programme by Gallery M adapts to your preferences. Discover it now.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-lucia\",\"images\":[\"/musterring-catalog/mr-lucia/image-01.jpg\",\"/musterring-catalog/mr-lucia/image-02.jpg\",\"/musterring-catalog/mr-lucia/image-03.jpg\",\"/musterring-catalog/mr-lucia/image-04.jpg\",\"/musterring-catalog/mr-lucia/image-05.jpg\",\"/musterring-catalog/mr-lucia/image-06.jpg\",\"/musterring-catalog/mr-lucia/image-07.jpg\",\"/musterring-catalog/mr-lucia/image-08.jpg\"]},{\"appProductId\":\"musterring-mr-nils\",\"slug\":\"mr-nils\",\"modelCode\":\"MR NILS\",\"name\":\"MR NILS\",\"tagline\":\"Relax weightlessly\",\"description\":\"The MR NILS recliner can be equipped with manual and motorised functions and offers a choice of 5 sizes, 6 leg shapes, 5 armrest variants and 3 seat qualities.\",\"category\":\"armchair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-nils\",\"images\":[\"/musterring-catalog/mr-nils/image-01.jpg\"]},{\"appProductId\":\"musterring-mr-pamela\",\"slug\":\"mr-pamela\",\"modelCode\":\"MR PAMELA\",\"name\":\"MR PAMELA\",\"tagline\":\"Relaxed design for cosy hours\",\"description\":\"Musterring: Time to relax! Our MR PAMELA beanbag is both comfortable and stylish. Find out more.\",\"category\":\"armchair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-pamela\",\"images\":[\"/musterring-catalog/mr-pamela/image-01.jpg\",\"/musterring-catalog/mr-pamela/image-02.jpg\",\"/musterring-catalog/mr-pamela/image-03.jpg\",\"/musterring-catalog/mr-pamela/image-04.jpg\",\"/musterring-catalog/mr-pamela/image-05.jpg\"]},{\"appProductId\":\"musterring-translate-to-en-match-it\",\"slug\":\"translate-to-en-match-it\",\"modelCode\":\"MATCH IT!\",\"name\":\"MATCH IT!\",\"tagline\":\"Retro charm for your home\",\"description\":\"Fancy a real lounge feeling? Then our MATCH IT! armchair is the right choice. Discover more.\",\"category\":\"armchair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/translate-to-en-match-it\",\"images\":[\"/musterring-catalog/translate-to-en-match-it/image-01.jpg\",\"/musterring-catalog/translate-to-en-match-it/image-02.jpg\",\"/musterring-catalog/translate-to-en-match-it/image-03.jpg\",\"/musterring-catalog/translate-to-en-match-it/image-04.jpg\",\"/musterring-catalog/translate-to-en-match-it/image-05.jpg\",\"/musterring-catalog/translate-to-en-match-it/image-06.jpg\",\"/musterring-catalog/translate-to-en-match-it/image-07.jpg\",\"/musterring-catalog/translate-to-en-match-it/image-08.jpg\"]},{\"appProductId\":\"musterring-mr-230\",\"slug\":\"mr-230\",\"modelCode\":\"MR 230\",\"name\":\"MR 230\",\"tagline\":\"The most beautiful spot in the living room\",\"description\":\"Musterring: The models in this series adapt to your body contours and offer unparalleled seating comfort.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-230\",\"images\":[\"/musterring-catalog/mr-230/image-01.jpg\",\"/musterring-catalog/mr-230/image-02.jpg\",\"/musterring-catalog/mr-230/image-03.jpg\",\"/musterring-catalog/mr-230/image-04.jpg\",\"/musterring-catalog/mr-230/image-05.jpg\"]},{\"appProductId\":\"musterring-mr-231\",\"slug\":\"mr-231\",\"modelCode\":\"MR 231\",\"name\":\"MR 231\",\"tagline\":\"Comfort in its most relaxed form\",\"description\":\"Musterring: Time to relax – our MR 231 recliner armchair lets you unwind and recharge your batteries for everyday life.\",\"category\":\"armchair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-231\",\"images\":[\"/musterring-catalog/mr-231/image-01.jpg\",\"/musterring-catalog/mr-231/image-02.jpg\",\"/musterring-catalog/mr-231/image-03.jpg\",\"/musterring-catalog/mr-231/image-04.jpg\",\"/musterring-catalog/mr-231/image-05.jpg\",\"/musterring-catalog/mr-231/image-06.jpg\"]},{\"appProductId\":\"musterring-mr-260\",\"slug\":\"mr-260\",\"modelCode\":\"MR 260\",\"name\":\"MR 260\",\"tagline\":\"Relaxation in style and comfort\",\"description\":\"Cosy upholstered furniture for your home: with MR 260, Musterring combines the utmost comfort and elegant design in one product range. Discover more.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-260\",\"images\":[\"/musterring-catalog/mr-260/image-01.jpg\",\"/musterring-catalog/mr-260/image-02.jpg\",\"/musterring-catalog/mr-260/image-03.jpg\",\"/musterring-catalog/mr-260/image-04.jpg\",\"/musterring-catalog/mr-260/image-05.jpg\",\"/musterring-catalog/mr-260/image-06.jpg\",\"/musterring-catalog/mr-260/image-07.jpg\",\"/musterring-catalog/mr-260/image-08-hq.jpg\"]},{\"appProductId\":\"musterring-mr-261\",\"slug\":\"mr-261\",\"modelCode\":\"MR 261\",\"name\":\"MR 261\",\"tagline\":\"Enjoy real high-backed comfort\",\"description\":\"The MR 261 reclining armchair offers many clever functions, including a fold-out back cushion for even more seating depth and incredible reclining comfort. Discover more.\",\"category\":\"armchair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-261\",\"images\":[\"/musterring-catalog/mr-261/image-01.jpg\",\"/musterring-catalog/mr-261/image-02.jpg\",\"/musterring-catalog/mr-261/image-03.jpg\",\"/musterring-catalog/mr-261/image-04.jpg\",\"/musterring-catalog/mr-261/image-05.jpg\",\"/musterring-catalog/mr-261/image-06.jpg\",\"/musterring-catalog/mr-261/image-07.jpg\",\"/musterring-catalog/mr-261/image-08.jpg\"]},{\"appProductId\":\"p6\",\"slug\":\"mr-270\",\"modelCode\":\"MR 270\",\"name\":\"MR 270\",\"tagline\":\"Comfort oasis in a trendy look\",\"description\":\"The MR 270 sofa range features an on-trend design and a variety of comfort functions. Discover more.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-270\",\"images\":[\"/musterring-catalog/mr-270/image-01.jpg\",\"/musterring-catalog/mr-270/image-02.jpg\",\"/musterring-catalog/mr-270/image-03.jpg\",\"/musterring-catalog/mr-270/image-04.jpg\",\"/musterring-catalog/mr-270/image-05.jpg\",\"/musterring-catalog/mr-270/image-06.jpg\",\"/musterring-catalog/mr-270/image-07.jpg\",\"/musterring-catalog/mr-270/image-08.jpg\"]},{\"appProductId\":\"musterring-mr-276\",\"slug\":\"mr-276\",\"modelCode\":\"MR 276\",\"name\":\"MR 276\",\"tagline\":\"As beautiful as any design classic!\",\"description\":\"The comfortable MR 276 reclining armchair has a distinctive appearance, thanks to its elegant, rounded wooden shell. Discover more.\",\"category\":\"armchair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-276\",\"images\":[\"/musterring-catalog/mr-276/image-01.jpg\",\"/musterring-catalog/mr-276/image-02.jpg\",\"/musterring-catalog/mr-276/image-03.jpg\",\"/musterring-catalog/mr-276/image-04.jpg\",\"/musterring-catalog/mr-276/image-05.jpg\",\"/musterring-catalog/mr-276/image-06.jpg\",\"/musterring-catalog/mr-276/image-07.jpg\",\"/musterring-catalog/mr-276/image-08.jpg\"]},{\"appProductId\":\"musterring-mr-280\",\"slug\":\"mr-280\",\"modelCode\":\"MR 280\",\"name\":\"MR 280\",\"tagline\":\"Intelligent sofa\",\"description\":\"Height-adjustable headrests and a flexible pull-out seat are just two highlights of this clever sofa from Musterring. Discover more.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-280\",\"images\":[\"/musterring-catalog/mr-280/image-01.jpg\",\"/musterring-catalog/mr-280/image-02.jpg\",\"/musterring-catalog/mr-280/image-03.jpg\",\"/musterring-catalog/mr-280/image-04.jpg\",\"/musterring-catalog/mr-280/image-05.jpg\",\"/musterring-catalog/mr-280/image-06.jpg\",\"/musterring-catalog/mr-280/image-07.jpg\",\"/musterring-catalog/mr-280/image-08.jpg\"]},{\"appProductId\":\"musterring-mr-281\",\"slug\":\"mr-281\",\"modelCode\":\"MR 281\",\"name\":\"MR 281\",\"tagline\":\"Relaxation at the touch of a button\",\"description\":\"The MR 281 reclining armchair from Musterring has an adjustable backrest, legrest and head cushion. Discover more.\",\"category\":\"armchair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-281\",\"images\":[\"/musterring-catalog/mr-281/image-01.png\"]},{\"appProductId\":\"musterring-mr-285\",\"slug\":\"mr-285\",\"modelCode\":\"MR 285\",\"name\":\"MR 285\",\"tagline\":\"The king of comfort\",\"description\":\"The MR 285 sofa series from Musterring offers a wealth of building blocks and comfort functions for putting together individual sets. Discover more.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-285\",\"images\":[\"/musterring-catalog/mr-285/image-01.jpg\",\"/musterring-catalog/mr-285/image-02.jpg\",\"/musterring-catalog/mr-285/image-03.jpg\",\"/musterring-catalog/mr-285/image-04.jpg\",\"/musterring-catalog/mr-285/image-05.jpg\"]},{\"appProductId\":\"musterring-mr-290\",\"slug\":\"mr-290\",\"modelCode\":\"MR 290\",\"name\":\"MR 290\",\"tagline\":\"For a wonderfully soft end-of-day feeling\",\"description\":\"The MR 290 upholstery series from Musterring features practical seat depth and headrest adjustment, along with an especially soft and relaxed seating experience. Discover it now.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-290\",\"images\":[\"/musterring-catalog/mr-290/image-01.jpg\",\"/musterring-catalog/mr-290/image-02.jpg\",\"/musterring-catalog/mr-290/image-03.jpg\",\"/musterring-catalog/mr-290/image-04.jpg\",\"/musterring-catalog/mr-290/image-05.jpg\"]},{\"appProductId\":\"musterring-translate-to-en-mr-300\",\"slug\":\"translate-to-en-mr-300\",\"modelCode\":\"MR 300\",\"name\":\"MR 300\",\"tagline\":\"High backrest, maximum comfort\",\"description\":\"With an extra high backrest and sophisticated comfort functions, the MR 300 sofa ensures a particularly pleasant sitting experience. Discover more.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/translate-to-en-mr-300\",\"images\":[\"/musterring-catalog/translate-to-en-mr-300/image-01.jpg\",\"/musterring-catalog/translate-to-en-mr-300/image-02.jpg\",\"/musterring-catalog/translate-to-en-mr-300/image-03.jpg\",\"/musterring-catalog/translate-to-en-mr-300/image-04.jpg\",\"/musterring-catalog/translate-to-en-mr-300/image-05.jpg\"]},{\"appProductId\":\"musterring-translate-to-en-mr-310\",\"slug\":\"translate-to-en-mr-310\",\"modelCode\":\"MR 310\",\"name\":\"MR 310\",\"tagline\":\"Haven of peace for the most beautiful hours\",\"description\":\"The couch series MR 310 by Musterring offers clever comfort features and can be flexibly configured. Learn more.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/translate-to-en-mr-310\",\"images\":[\"/musterring-catalog/translate-to-en-mr-310/image-01.jpg\",\"/musterring-catalog/translate-to-en-mr-310/image-02.jpg\",\"/musterring-catalog/translate-to-en-mr-310/image-03.jpg\",\"/musterring-catalog/translate-to-en-mr-310/image-04.jpg\",\"/musterring-catalog/translate-to-en-mr-310/image-05.jpg\"]},{\"appProductId\":\"musterring-mr-315\",\"slug\":\"mr-315\",\"modelCode\":\"MR 315\",\"name\":\"MR 315\",\"tagline\":\"Minimalist design for maximum comfort\",\"description\":\"Are you looking for a sofa that is both comfortable and elegant? Our MR 315 offers you a wide range of variants, add-on elements, footstools and cushions.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-315\",\"images\":[\"/musterring-catalog/mr-315/image-01.jpg\",\"/musterring-catalog/mr-315/image-02.jpg\",\"/musterring-catalog/mr-315/image-03.jpg\",\"/musterring-catalog/mr-315/image-04.jpg\",\"/musterring-catalog/mr-315/image-05.jpg\",\"/musterring-catalog/mr-315/image-06.jpg\",\"/musterring-catalog/mr-315/image-07.jpg\",\"/musterring-catalog/mr-315/image-08.jpg\"]},{\"appProductId\":\"musterring-mr-365\",\"slug\":\"mr-365\",\"modelCode\":\"MR 365\",\"name\":\"MR 365\",\"tagline\":\"The clever sofa trend from Musterring\",\"description\":\"Musterring: Our MR 365 series combines modern design with intelligent functions for optimal seating and reclining comfort. Discover more.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-365\",\"images\":[\"/musterring-catalog/mr-365/image-01.jpg\",\"/musterring-catalog/mr-365/image-02.jpg\",\"/musterring-catalog/mr-365/image-03.jpg\",\"/musterring-catalog/mr-365/image-04.jpg\",\"/musterring-catalog/mr-365/image-05.jpg\",\"/musterring-catalog/mr-365/image-06.jpg\",\"/musterring-catalog/mr-365/image-07.jpg\",\"/musterring-catalog/mr-365/image-08.jpg\"]},{\"appProductId\":\"musterring-mr-370\",\"slug\":\"mr-370\",\"modelCode\":\"MR 370\",\"name\":\"MR 370\",\"tagline\":\"Welcome to the comfort zone\",\"description\":\"Comfort has a name: MR 370 is our sofa range for anyone looking for rest and relaxation. Discover more.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-370\",\"images\":[\"/musterring-catalog/mr-370/image-01.jpg\",\"/musterring-catalog/mr-370/image-02.jpg\",\"/musterring-catalog/mr-370/image-03.jpg\",\"/musterring-catalog/mr-370/image-04.jpg\",\"/musterring-catalog/mr-370/image-05.jpg\",\"/musterring-catalog/mr-370/image-06.jpg\",\"/musterring-catalog/mr-370/image-07.jpg\",\"/musterring-catalog/mr-370/image-08.jpg\"]},{\"appProductId\":\"musterring-mr-376\",\"slug\":\"mr-376\",\"modelCode\":\"MR 376\",\"name\":\"MR 376\",\"tagline\":\"Sitting becomes lying\",\"description\":\"The seat, leg rest and back of the MR 376 functional armchair from Musterring can be moved into the reclining position. Discover more.\",\"category\":\"armchair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-376\",\"images\":[\"/musterring-catalog/mr-376/image-01.jpg\",\"/musterring-catalog/mr-376/image-02.jpg\",\"/musterring-catalog/mr-376/image-03.jpg\",\"/musterring-catalog/mr-376/image-04.jpg\"]},{\"appProductId\":\"musterring-mr-385\",\"slug\":\"mr-385\",\"modelCode\":\"MR 385\",\"name\":\"MR 385\",\"tagline\":\"Seating comfort without compromise\",\"description\":\"From couch to armchair to footstool, our MR 385 series offers everything you need for a cosy night in. Discover more.\",\"category\":\"armchair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-385\",\"images\":[\"/musterring-catalog/mr-385/image-01.jpg\",\"/musterring-catalog/mr-385/image-02.jpg\",\"/musterring-catalog/mr-385/image-03.jpg\",\"/musterring-catalog/mr-385/image-04.jpg\",\"/musterring-catalog/mr-385/image-05.jpg\",\"/musterring-catalog/mr-385/image-06.jpg\",\"/musterring-catalog/mr-385/image-07.jpg\",\"/musterring-catalog/mr-385/image-08.jpg\"]},{\"appProductId\":\"musterring-mr-1320\",\"slug\":\"mr-1320\",\"modelCode\":\"MR 1320\",\"name\":\"MR 1320\",\"tagline\":\"A completely new seating experience\",\"description\":\"The MR 1320 sofa series offers headrest adjustment as standard, additional comfort functions and two seat qualities, including an innovative soft seat. Learn more.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-1320\",\"images\":[\"/musterring-catalog/mr-1320/image-01.jpg\",\"/musterring-catalog/mr-1320/image-02.jpg\",\"/musterring-catalog/mr-1320/image-03.jpg\",\"/musterring-catalog/mr-1320/image-04.jpg\",\"/musterring-catalog/mr-1320/image-05.jpg\"]},{\"appProductId\":\"p2\",\"slug\":\"mr-1370\",\"modelCode\":\"MR 1370\",\"name\":\"MR 1370\",\"tagline\":\"A compact sofa for wonderful moments\",\"description\":\"Musterring: MR 1370 offers enough space for cosy evenings and still fits into any living room. Learn more.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-1370\",\"images\":[\"/musterring-catalog/mr-1370/image-01.jpg\",\"/musterring-catalog/mr-1370/image-02.jpg\",\"/musterring-catalog/mr-1370/image-03.jpg\",\"/musterring-catalog/mr-1370/image-04.jpg\"]},{\"appProductId\":\"musterring-mr-1390\",\"slug\":\"mr-1390\",\"modelCode\":\"MR 1390\",\"name\":\"MR 1390\",\"tagline\":\"Comfort sofa with high quality fabric cover\",\"description\":\"The comprehensive MR 1380 upholstery series from Musterring offers high-quality fabric upholstery and sophisticated comfort functions. Discover more.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-1390\",\"images\":[\"/musterring-catalog/mr-1390/image-01.jpg\",\"/musterring-catalog/mr-1390/image-02.jpg\",\"/musterring-catalog/mr-1390/image-03.jpg\",\"/musterring-catalog/mr-1390/image-04.jpg\",\"/musterring-catalog/mr-1390/image-05.jpg\",\"/musterring-catalog/mr-1390/image-06.jpg\",\"/musterring-catalog/mr-1390/image-07.jpg\",\"/musterring-catalog/mr-1390/image-08.jpg\"]},{\"appProductId\":\"musterring-mr-1391\",\"slug\":\"mr-1391\",\"modelCode\":\"MR 1391\",\"name\":\"MR 1391\",\"tagline\":\"MR 1391 – has the knack\",\"description\":\"Our MR 1391 is the comfortable swivel armchair for maximum seating comfort in the living room at home. Discover more.\",\"category\":\"armchair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-1391\",\"images\":[\"/musterring-catalog/mr-1391/image-01.jpg\",\"/musterring-catalog/mr-1391/image-02.jpg\",\"/musterring-catalog/mr-1391/image-03.jpg\",\"/musterring-catalog/mr-1391/image-04.jpg\"]},{\"appProductId\":\"musterring-mr-2342\",\"slug\":\"mr-2342\",\"modelCode\":\"MR 2342\",\"name\":\"MR 2342\",\"tagline\":\"Comfort has a name\",\"description\":\"The MR 2342 feel-good armchair from Musterring is flexible, stylish and cozy at the same time. Discover more.\",\"category\":\"armchair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-2342\",\"images\":[\"/musterring-catalog/mr-2342/image-01.jpg\",\"/musterring-catalog/mr-2342/image-02.jpg\",\"/musterring-catalog/mr-2342/image-03.jpg\",\"/musterring-catalog/mr-2342/image-04.jpg\"]},{\"appProductId\":\"p4\",\"slug\":\"mr-2490\",\"modelCode\":\"MR 2490\",\"name\":\"MR 2490\",\"tagline\":\"Seating comfort is a top priority here\",\"description\":\"Plenty of space and comfort: our sofa series for everyone who wants maximum freedom to relax. Discover more.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-2490\",\"images\":[\"/musterring-catalog/mr-2490/image-01.jpg\",\"/musterring-catalog/mr-2490/image-02.jpg\",\"/musterring-catalog/mr-2490/image-03.jpg\",\"/musterring-catalog/mr-2490/image-04.jpg\",\"/musterring-catalog/mr-2490/image-05.jpg\",\"/musterring-catalog/mr-2490/image-06.jpg\",\"/musterring-catalog/mr-2490/image-07.jpg\",\"/musterring-catalog/mr-2490/image-08.jpg\"]},{\"appProductId\":\"musterring-mr-2665\",\"slug\":\"mr-2665\",\"modelCode\":\"MR 2665\",\"name\":\"MR 2665\",\"tagline\":\"Sitting as if floating\",\"description\":\"Musterring: Treat yourself to a break from the daily grind and make yourself comfortable in the MR2665 recliner. Find out more.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-2665\",\"images\":[\"/musterring-catalog/mr-2665/image-01.png\"]},{\"appProductId\":\"musterring-mr-2795\",\"slug\":\"mr-2795\",\"modelCode\":\"MR 2795\",\"name\":\"MR 2795\",\"tagline\":\"A cuddle couch at its best\",\"description\":\"The MR 2795 sofa series impresses with its weightless design, adjustable seat depth, and optional headrest and side section adjustment. Learn more now.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-2795\",\"images\":[\"/musterring-catalog/mr-2795/image-01.jpg\",\"/musterring-catalog/mr-2795/image-02.jpg\",\"/musterring-catalog/mr-2795/image-03.jpg\",\"/musterring-catalog/mr-2795/image-04.jpg\",\"/musterring-catalog/mr-2795/image-05.jpg\"]},{\"appProductId\":\"p1\",\"slug\":\"mr-2875\",\"modelCode\":\"MR 2875\",\"name\":\"MR 2875\",\"tagline\":\"Configure your dream sofa yourself\",\"description\":\"Discover the versatility of the MR 2875 series and be your own furniture designer with our sofa configurator. Discover more.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-2875\",\"images\":[\"/musterring-catalog/mr-2875/image-01.jpg\",\"/musterring-catalog/mr-2875/image-02.jpg\",\"/musterring-catalog/mr-2875/image-03.jpg\",\"/musterring-catalog/mr-2875/image-04.jpg\",\"/musterring-catalog/mr-2875/image-05.jpg\",\"/musterring-catalog/mr-2875/image-06.jpg\",\"/musterring-catalog/mr-2875/image-07.jpg\",\"/musterring-catalog/mr-2875/image-08.jpg\"]},{\"appProductId\":\"musterring-mr-2985\",\"slug\":\"mr-2985\",\"modelCode\":\"MR 2985\",\"name\":\"MR 2985\",\"tagline\":\"plenty of room to feel good\",\"description\":\"The design-orientated MR 2985 upholstered range scores points with its wide side sections, practical seat depth adjustment and attractive piping on the outer edges of the upholstery.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-2985\",\"images\":[\"/musterring-catalog/mr-2985/image-01.jpg\"]},{\"appProductId\":\"musterring-mr-2986\",\"slug\":\"mr-2986\",\"modelCode\":\"MR 2986\",\"name\":\"MR 2986\",\"tagline\":\"An armchair with style and class\",\"description\":\"The chic MR 2986 armchair is the perfect complement to the MR 2985 sofa and impresses with its delicate metal frame and attractive piping.\",\"category\":\"armchair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-2986\",\"images\":[\"/musterring-catalog/mr-2986/image-01.jpg\",\"/musterring-catalog/mr-2986/image-02.jpg\",\"/musterring-catalog/mr-2986/image-03.jpg\"]},{\"appProductId\":\"musterring-mr-2995\",\"slug\":\"mr-2995\",\"modelCode\":\"MR 2995\",\"name\":\"MR 2995\",\"tagline\":\"Go to MR 2995!\",\"description\":\"\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-2995\",\"images\":[\"/musterring-catalog/mr-2995/image-01.jpg\",\"/musterring-catalog/mr-2995/image-02.jpg\",\"/musterring-catalog/mr-2995/image-03.jpg\",\"/musterring-catalog/mr-2995/image-04.jpg\",\"/musterring-catalog/mr-2995/image-05.jpg\",\"/musterring-catalog/mr-2995/image-06.jpg\"]},{\"appProductId\":\"musterring-mr-4100\",\"slug\":\"mr-4100\",\"modelCode\":\"MR 4100\",\"name\":\"MR 4100\",\"tagline\":\"Recliner\",\"description\":\"Musterring: Sit back, take a deep breath and close your eyes – in the MR 4100 recliner, everyday life takes a break.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-4100\",\"images\":[\"/musterring-catalog/mr-4100/image-01.png\"]},{\"appProductId\":\"musterring-mr-4585\",\"slug\":\"mr-4585\",\"modelCode\":\"MR 4585\",\"name\":\"MR 4585\",\"tagline\":\"Time for a change\",\"description\":\"Do you like to see things from different perspectives? The MR 4585 swivelling armchairs and footstools provide a whole new level of flexibility. Discover more.\",\"category\":\"armchair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-4585\",\"images\":[\"/musterring-catalog/mr-4585/image-01.jpg\",\"/musterring-catalog/mr-4585/image-02.jpg\",\"/musterring-catalog/mr-4585/image-03.jpg\",\"/musterring-catalog/mr-4585/image-04.jpg\",\"/musterring-catalog/mr-4585/image-05.jpg\",\"/musterring-catalog/mr-4585/image-06.jpg\",\"/musterring-catalog/mr-4585/image-07.jpg\",\"/musterring-catalog/mr-4585/image-08.jpg\"]},{\"appProductId\":\"musterring-mr-4615\",\"slug\":\"mr-4615\",\"modelCode\":\"MR 4615\",\"name\":\"MR 4615\",\"tagline\":\"A sofa for life\",\"description\":\"Whether it\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-4615\",\"images\":[\"/musterring-catalog/mr-4615/image-01.jpg\",\"/musterring-catalog/mr-4615/image-02.jpg\",\"/musterring-catalog/mr-4615/image-03.jpg\",\"/musterring-catalog/mr-4615/image-04.jpg\",\"/musterring-catalog/mr-4615/image-05.jpg\"]},{\"appProductId\":\"musterring-mr-4820\",\"slug\":\"mr-4820\",\"modelCode\":\"MR 4820\",\"name\":\"MR 4820\",\"tagline\":\"Loose, casual and incredibly cosy\",\"description\":\"The MR 4820 upholstery range scores with a loose upholstery structure and offers, in addition to sofas, ottomans, footstools and a large selection of cushions. Discover more now.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-4820\",\"images\":[\"/musterring-catalog/mr-4820/image-01.jpg\",\"/musterring-catalog/mr-4820/image-02.jpg\",\"/musterring-catalog/mr-4820/image-03.jpg\",\"/musterring-catalog/mr-4820/image-04.jpg\",\"/musterring-catalog/mr-4820/image-05.jpg\"]},{\"appProductId\":\"musterring-mr-5100\",\"slug\":\"mr-5100\",\"modelCode\":\"MR 5100\",\"name\":\"MR 5100\",\"tagline\":\"Because true elegance does not follow trends\",\"description\":\"Musterring: Classic. Timeless. Elegant. Our MR 5100 sofa range redefines style while offering maximum seating comfort.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-5100\",\"images\":[\"/musterring-catalog/mr-5100/image-01.jpg\",\"/musterring-catalog/mr-5100/image-02.png\"]},{\"appProductId\":\"musterring-mr-5111\",\"slug\":\"mr-5111\",\"modelCode\":\"MR 5111\",\"name\":\"MR 5111\",\"tagline\":\"This swivel armchair is addictive\",\"description\":\"Musterring: It doesn\",\"category\":\"armchair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-5111\",\"images\":[\"/musterring-catalog/mr-5111/image-01.png\",\"/musterring-catalog/mr-5111/image-02.jpg\"]},{\"appProductId\":\"musterring-mr-700\",\"slug\":\"mr-700\",\"modelCode\":\"MR 700\",\"name\":\"MR 700\",\"tagline\":\"Sofa or bed? Both in one!\",\"description\":\"The comfortable MR 700 sofa bed easily transforms into a bed. You can choose from 10 armrest styles, 6 leg designs, and an optional longchair.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-700\",\"images\":[\"/musterring-catalog/mr-700/image-01.jpg\",\"/musterring-catalog/mr-700/image-02.jpg\",\"/musterring-catalog/mr-700/image-03.jpg\",\"/musterring-catalog/mr-700/image-04.jpg\",\"/musterring-catalog/mr-700/image-05.jpg\",\"/musterring-catalog/mr-700/image-06.jpg\",\"/musterring-catalog/mr-700/image-07.jpg\",\"/musterring-catalog/mr-700/image-08.jpg\"]},{\"appProductId\":\"musterring-mr-710\",\"slug\":\"mr-710\",\"modelCode\":\"MR 710\",\"name\":\"MR 710\",\"tagline\":\"With a single motion from sofa to bed!\",\"description\":\"The MR 700 sofa bed with integrated mattress offers excellent seating and sleeping comfort thanks to high-quality cold foam and Nosag suspension. Learn more now.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-710\",\"images\":[\"/musterring-catalog/mr-710/image-01.jpg\",\"/musterring-catalog/mr-710/image-02.jpg\",\"/musterring-catalog/mr-710/image-03.jpg\",\"/musterring-catalog/mr-710/image-04.jpg\",\"/musterring-catalog/mr-710/image-05.jpg\"]},{\"appProductId\":\"musterring-mr-720\",\"slug\":\"mr-720\",\"modelCode\":\"MR 720\",\"name\":\"MR 720\",\"tagline\":\"From sofa to bed with ease\",\"description\":\"The elegant MR 720 sofa scores points with its high ground clearance, three foot options and a fold-down armrest, allowing it to be used as a bed.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-720\",\"images\":[\"/musterring-catalog/mr-720/image-01.jpg\",\"/musterring-catalog/mr-720/image-02.png\"]},{\"appProductId\":\"musterring-mr-6500\",\"slug\":\"mr-6500\",\"modelCode\":\"MR 6500\",\"name\":\"MR 6500\",\"tagline\":\"Where elegance and comfort meet\",\"description\":\"The MR 6500 sofa programme from Musterring impresses with its classic design language and a wide range of armrest and foot variants. Discover more.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-6500\",\"images\":[\"/musterring-catalog/mr-6500/image-01.jpg\",\"/musterring-catalog/mr-6500/image-02.jpg\",\"/musterring-catalog/mr-6500/image-03.jpg\",\"/musterring-catalog/mr-6500/image-04.jpg\",\"/musterring-catalog/mr-6500/image-05.jpg\"]},{\"appProductId\":\"musterring-mr-6510\",\"slug\":\"mr-6510\",\"modelCode\":\"MR 6510\",\"name\":\"MR 6510\",\"tagline\":\"Timeless beauty with the highest standards of comfort\",\"description\":\"The extensive MR 6510 sofa programme combines modern elegance with a distinctive seating design and can be flexibly adapted to individual requirements.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-6510\",\"images\":[\"/musterring-catalog/mr-6510/image-01.jpg\",\"/musterring-catalog/mr-6510/image-02.jpg\",\"/musterring-catalog/mr-6510/image-03.jpg\",\"/musterring-catalog/mr-6510/image-04.jpg\",\"/musterring-catalog/mr-6510/image-05.jpg\"]},{\"appProductId\":\"musterring-mr-6540\",\"slug\":\"mr-6540\",\"modelCode\":\"MR 6540\",\"name\":\"MR 6540\",\"tagline\":\"An armchair as a statement\",\"description\":\"Whether as a fully upholstered chair or with leather covers: This seating sets accents and offers unique comfort. Discover more.\",\"category\":\"armchair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-6540\",\"images\":[\"/musterring-catalog/mr-6540/image-01.jpg\",\"/musterring-catalog/mr-6540/image-02.jpg\",\"/musterring-catalog/mr-6540/image-03.jpg\",\"/musterring-catalog/mr-6540/image-04.jpg\",\"/musterring-catalog/mr-6540/image-05.jpg\"]},{\"appProductId\":\"musterring-mr-6550\",\"slug\":\"mr-6550\",\"modelCode\":\"MR 6550\",\"name\":\"MR 6550\",\"tagline\":\"For real seat comfort\",\"description\":\"At Musterring you will find comfortable chairs and armchairs with a wide variety of covers for your home. Discover more.\",\"category\":\"armchair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-6550\",\"images\":[\"/musterring-catalog/mr-6550/image-01.jpg\",\"/musterring-catalog/mr-6550/image-02.jpg\",\"/musterring-catalog/mr-6550/image-03.jpg\",\"/musterring-catalog/mr-6550/image-04.jpg\",\"/musterring-catalog/mr-6550/image-05.jpg\"]},{\"appProductId\":\"musterring-mr-9120\",\"slug\":\"mr-9120\",\"modelCode\":\"MR 9120\",\"name\":\"MR 9120\",\"tagline\":\"Your personal comfort zone\",\"description\":\"With this upholstered furniture series, we have taken seating and reclining comfort to the next level. See for yourself. Discover more.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-9120\",\"images\":[\"/musterring-catalog/mr-9120/image-01.jpg\",\"/musterring-catalog/mr-9120/image-02.jpg\",\"/musterring-catalog/mr-9120/image-03.jpg\",\"/musterring-catalog/mr-9120/image-04.jpg\",\"/musterring-catalog/mr-9120/image-05.jpg\",\"/musterring-catalog/mr-9120/image-06.jpg\",\"/musterring-catalog/mr-9120/image-07.jpg\",\"/musterring-catalog/mr-9120/image-08.jpg\"]},{\"appProductId\":\"p3\",\"slug\":\"mr-9420\",\"modelCode\":\"MR 9420\",\"name\":\"MR 9420\",\"tagline\":\"The modular world of furniture for your home\",\"description\":\"Musterring MR 9420: The modular upholstered seating for anyone who wants maximum flexibility in the selection of their furniture. Discover more.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-9420\",\"images\":[\"/musterring-catalog/mr-9420/image-01.jpg\",\"/musterring-catalog/mr-9420/image-02.jpg\",\"/musterring-catalog/mr-9420/image-03.jpg\",\"/musterring-catalog/mr-9420/image-04.jpg\",\"/musterring-catalog/mr-9420/image-05.jpg\",\"/musterring-catalog/mr-9420/image-06.jpg\",\"/musterring-catalog/mr-9420/image-07.jpg\",\"/musterring-catalog/mr-9420/image-08.jpg\"]},{\"appProductId\":\"musterring-mr-9425\",\"slug\":\"mr-9425\",\"modelCode\":\"MR 9425\",\"name\":\"MR 9425\",\"tagline\":\"Design that fits\",\"description\":\"With its retro design, this comfortable armchair is a real eye-catcher in your living room. Discover more.\",\"category\":\"armchair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-9425\",\"images\":[\"/musterring-catalog/mr-9425/image-01.jpg\",\"/musterring-catalog/mr-9425/image-02.jpg\",\"/musterring-catalog/mr-9425/image-03.jpg\",\"/musterring-catalog/mr-9425/image-04.jpg\",\"/musterring-catalog/mr-9425/image-05.jpg\",\"/musterring-catalog/mr-9425/image-06.jpg\",\"/musterring-catalog/mr-9425/image-07.jpg\",\"/musterring-catalog/mr-9425/image-08.jpg\"]},{\"appProductId\":\"musterring-mr-9440\",\"slug\":\"mr-9440\",\"modelCode\":\"MR 9440\",\"name\":\"MR 9440\",\"tagline\":\"The island of cosiness\",\"description\":\"The versatile MR 9440 sofa series can be planned in 10 cm increments up to a width of four metres and can be equipped with various functions.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-9440\",\"images\":[\"/musterring-catalog/mr-9440/image-01.jpg\",\"/musterring-catalog/mr-9440/image-02.jpg\",\"/musterring-catalog/mr-9440/image-03.jpg\",\"/musterring-catalog/mr-9440/image-04.jpg\",\"/musterring-catalog/mr-9440/image-05.jpg\"]},{\"appProductId\":\"musterring-mr-9445\",\"slug\":\"mr-9445\",\"modelCode\":\"MR 9445\",\"name\":\"MR 9445\",\"tagline\":\"The casual way of sitting\",\"description\":\"The MR 9445 single armchair from Musterring can be rotated 360 degrees and is the perfect match for the MR 9440 sofa series. It is available with fabric or leather upholstery.\",\"category\":\"armchair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-9445\",\"images\":[\"/musterring-catalog/mr-9445/image-01.jpg\",\"/musterring-catalog/mr-9445/image-02.png\"]},{\"appProductId\":\"musterring-mr-9450\",\"slug\":\"mr-9450\",\"modelCode\":\"MR 9450\",\"name\":\"MR 9450\",\"tagline\":\"Your customised comfort sofa is already waiting\",\"description\":\"The extensive MR 9450 sofa range from Musterring scores highly with its wide variety of models, planning flexibility and manual and motorised comfort functions. Find out more.\",\"category\":\"sofa\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-9450\",\"images\":[\"/musterring-catalog/mr-9450/image-01.jpg\",\"/musterring-catalog/mr-9450/image-02.jpg\",\"/musterring-catalog/mr-9450/image-03.jpg\",\"/musterring-catalog/mr-9450/image-04.jpg\",\"/musterring-catalog/mr-9450/image-05.jpg\"]},{\"appProductId\":\"musterring-mr-9455\",\"slug\":\"mr-9455\",\"modelCode\":\"MR 9455\",\"name\":\"MR 9455\",\"tagline\":\"An armchair that turns and twists\",\"description\":\"The organically shaped MR 9455 armchair from Musterring can be swivelled through 360 degrees and is an excellent addition to the MR 9450 sofa series. Find out more now.\",\"category\":\"armchair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-9455\",\"images\":[\"/musterring-catalog/mr-9455/image-01.jpg\"]},{\"appProductId\":\"musterring-jana\",\"slug\":\"jana\",\"modelCode\":\"JANA\",\"name\":\"JANA\",\"tagline\":\"Welcome to a wonderful living ambience\",\"description\":\"The first-class JANA living series from Musterring combines modern lacquered fronts in the colour graphite with striking split wood trim in reclaimed oak. Find out more.\",\"category\":\"storage\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/living-walls-sideboards-co/jana\",\"images\":[\"/musterring-catalog/jana/image-01.jpg\"]},{\"appProductId\":\"musterring-kanto\",\"slug\":\"kanto\",\"modelCode\":\"KANTO\",\"name\":\"KANTO\",\"tagline\":\"for creative living ideas\",\"description\":\"From the dining room to the living room to the home office: you will find just the right furniture in the KANTO series. Discover more.\",\"category\":\"storage\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/living-walls-sideboards-co/kanto\",\"images\":[\"/musterring-catalog/kanto/image-01.jpg\",\"/musterring-catalog/kanto/image-02.jpg\",\"/musterring-catalog/kanto/image-03.jpg\",\"/musterring-catalog/kanto/image-04.jpg\",\"/musterring-catalog/kanto/image-05.jpg\",\"/musterring-catalog/kanto/image-06.jpg\",\"/musterring-catalog/kanto/image-07.jpg\",\"/musterring-catalog/kanto/image-08.jpg\"]},{\"appProductId\":\"musterring-kara-frame\",\"slug\":\"kara-frame\",\"modelCode\":\"Kara Frame\",\"name\":\"Kara Frame\",\"tagline\":\"KARA-FRAME Made by you\",\"description\":\"Play with shapes, colours and functions and be your very own furniture designer with KARA-FRAME. Discover more.\",\"category\":\"storage\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/living-walls-sideboards-co/kara-frame\",\"images\":[\"/musterring-catalog/kara-frame/image-01.jpg\",\"/musterring-catalog/kara-frame/image-02.jpg\",\"/musterring-catalog/kara-frame/image-03.jpg\",\"/musterring-catalog/kara-frame/image-04.jpg\",\"/musterring-catalog/kara-frame/image-05.jpg\",\"/musterring-catalog/kara-frame/image-06.jpg\",\"/musterring-catalog/kara-frame/image-07.jpg\",\"/musterring-catalog/kara-frame/image-08.jpg\"]},{\"appProductId\":\"musterring-kara-system\",\"slug\":\"kara-system\",\"modelCode\":\"Kara System\",\"name\":\"Kara System\",\"tagline\":\"KARA-SYSTEM Make the system change\",\"description\":\"At home or at the office: bring order to chaos with KARA-SYSTEM and create new freedom for a comfortable home and work life. Discover more.\",\"category\":\"storage\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/living-walls-sideboards-co/kara-system\",\"images\":[\"/musterring-catalog/kara-system/image-01.jpg\",\"/musterring-catalog/kara-system/image-02.jpg\",\"/musterring-catalog/kara-system/image-03.jpg\",\"/musterring-catalog/kara-system/image-04.jpg\",\"/musterring-catalog/kara-system/image-05.jpg\",\"/musterring-catalog/kara-system/image-06.jpg\",\"/musterring-catalog/kara-system/image-07.jpg\",\"/musterring-catalog/kara-system/image-08.jpg\"]},{\"appProductId\":\"musterring-kira-system\",\"slug\":\"kira-system\",\"modelCode\":\"Kira System\",\"name\":\"Kira System\",\"tagline\":\"KIRA-SYSTEM Welcome home!\",\"description\":\"Creativity knows no bounds. That’s why we have created KIRA-SYSTEM, a furniture series that offers maximum flexibility. Discover more.\",\"category\":\"storage\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/living-walls-sideboards-co/kira-system\",\"images\":[\"/musterring-catalog/kira-system/image-01.jpg\",\"/musterring-catalog/kira-system/image-02.jpg\",\"/musterring-catalog/kira-system/image-03.jpg\",\"/musterring-catalog/kira-system/image-04.jpg\",\"/musterring-catalog/kira-system/image-05.jpg\",\"/musterring-catalog/kira-system/image-06.jpg\",\"/musterring-catalog/kira-system/image-07.jpg\",\"/musterring-catalog/kira-system/image-08.jpg\"]},{\"appProductId\":\"musterring-kiana\",\"slug\":\"kiana\",\"modelCode\":\"KIANA\",\"name\":\"KIANA\",\"tagline\":\"All-rounder in a solid wood look\",\"description\":\"The adaptable living and dining furniture in the KIANA series from Musterring creates a cosy interior with its softly rounded solid-wood fronts. Discover more.\",\"category\":\"storage\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/living-walls-sideboards-co/kiana\",\"images\":[\"/musterring-catalog/kiana/image-01.jpg\",\"/musterring-catalog/kiana/image-02.jpg\",\"/musterring-catalog/kiana/image-03.jpg\",\"/musterring-catalog/kiana/image-04.jpg\",\"/musterring-catalog/kiana/image-05.jpg\",\"/musterring-catalog/kiana/image-06.jpg\",\"/musterring-catalog/kiana/image-07.jpg\",\"/musterring-catalog/kiana/image-08.jpg\"]},{\"appProductId\":\"musterring-korsika\",\"slug\":\"korsika\",\"modelCode\":\"KORSIKA\",\"name\":\"KORSIKA\",\"tagline\":\"WOHNEN Mediterranean-style living\",\"description\":\"The KORSIKA living and dining room furniture series brings home that holiday feeling with its Mediterranean-inspired design. Discover more.\",\"category\":\"storage\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/living-walls-sideboards-co/korsika\",\"images\":[\"/musterring-catalog/korsika/image-01.jpg\",\"/musterring-catalog/korsika/image-02.jpg\",\"/musterring-catalog/korsika/image-03.jpg\",\"/musterring-catalog/korsika/image-04.jpg\",\"/musterring-catalog/korsika/image-05.jpg\",\"/musterring-catalog/korsika/image-06.jpg\",\"/musterring-catalog/korsika/image-07.jpg\",\"/musterring-catalog/korsika/image-08.jpg\"]},{\"appProductId\":\"musterring-maestra\",\"slug\":\"maestra\",\"modelCode\":\"MAESTRA\",\"name\":\"MAESTRA\",\"tagline\":\"A new approach to living and television\",\"description\":\"The sophisticated MAESTRA living room series impresses with a sliding panel for flat screens and an exclusive light design front with depth offset.\",\"category\":\"storage\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/living-walls-sideboards-co/maestra\",\"images\":[\"/musterring-catalog/maestra/image-01.jpg\",\"/musterring-catalog/maestra/image-02.jpg\",\"/musterring-catalog/maestra/image-03.jpg\",\"/musterring-catalog/maestra/image-04.jpg\",\"/musterring-catalog/maestra/image-05.jpg\",\"/musterring-catalog/maestra/image-06.jpg\",\"/musterring-catalog/maestra/image-07.jpg\",\"/musterring-catalog/maestra/image-08.jpg\"]},{\"appProductId\":\"musterring-simea\",\"slug\":\"simea\",\"modelCode\":\"SIMEA\",\"name\":\"SIMEA\",\"tagline\":\"Style is systematic with us\",\"description\":\"Musterring: SIMEA offers plenty of space for your home cinema, decorations or books. Discover design that thinks for itself.\",\"category\":\"storage\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/living-walls-sideboards-co/simea\",\"images\":[\"/musterring-catalog/simea/image-01.jpg\",\"/musterring-catalog/simea/image-02.jpg\",\"/musterring-catalog/simea/image-03.jpg\",\"/musterring-catalog/simea/image-04.jpg\",\"/musterring-catalog/simea/image-05.jpg\"]},{\"appProductId\":\"musterring-media-smart\",\"slug\":\"media-smart\",\"modelCode\":\"Media Smart\",\"name\":\"Media Smart\",\"tagline\":\"MEDIA-SMART Cinema fun even in small spaces\",\"description\":\"Find out how MEDIA-SMART can help you set up a home cinema in just a few square metres that leaves nothing to be desired. Discover more.\",\"category\":\"storage\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/living-walls-sideboards-co/media-smart\",\"images\":[\"/musterring-catalog/media-smart/image-01.jpg\"]},{\"appProductId\":\"musterring-portland\",\"slug\":\"portland\",\"modelCode\":\"PORTLAND\",\"name\":\"PORTLAND\",\"tagline\":\"Perfectly crafted natural beauties\",\"description\":\"Enjoy the many benefits of high-quality solid-wood furniture with our PORTLAND furniture series. Discover more.\",\"category\":\"storage\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/living-walls-sideboards-co/portland\",\"images\":[\"/musterring-catalog/portland/image-01.jpg\",\"/musterring-catalog/portland/image-02.jpg\",\"/musterring-catalog/portland/image-03.jpg\",\"/musterring-catalog/portland/image-04.jpg\",\"/musterring-catalog/portland/image-05.jpg\",\"/musterring-catalog/portland/image-06.jpg\",\"/musterring-catalog/portland/image-07.jpg\",\"/musterring-catalog/portland/image-08.jpg\"]},{\"appProductId\":\"musterring-q-media-20\",\"slug\":\"q-media-20\",\"modelCode\":\"Q Media 20\",\"name\":\"Q Media 20\",\"tagline\":\"Q-MEDIA 2.0 Entertainment for your home\",\"description\":\"The new version of our bestseller: experience the next generation in media consoles from Musterring with the Q-MEDIA 2.0. Discover more.\",\"category\":\"storage\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/living-walls-sideboards-co/q-media-20\",\"images\":[\"/musterring-catalog/q-media-20/image-01.jpg\",\"/musterring-catalog/q-media-20/image-02.jpg\",\"/musterring-catalog/q-media-20/image-03.jpg\",\"/musterring-catalog/q-media-20/image-04.jpg\",\"/musterring-catalog/q-media-20/image-05.jpg\",\"/musterring-catalog/q-media-20/image-06.jpg\",\"/musterring-catalog/q-media-20/image-07.jpg\",\"/musterring-catalog/q-media-20/image-08.jpg\"]},{\"appProductId\":\"musterring-trevio\",\"slug\":\"trevio\",\"modelCode\":\"TREVIO\",\"name\":\"TREVIO\",\"tagline\":\"Ideas are the best raw material\",\"description\":\"Solid oak core, wood grain and lacquer are just a few of the components that make our TREVIO furniture series so special. Discover more.\",\"category\":\"storage\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/living-walls-sideboards-co/trevio\",\"images\":[\"/musterring-catalog/trevio/image-01.jpg\",\"/musterring-catalog/trevio/image-02.jpg\",\"/musterring-catalog/trevio/image-03.jpg\",\"/musterring-catalog/trevio/image-04.jpg\",\"/musterring-catalog/trevio/image-05.jpg\",\"/musterring-catalog/trevio/image-06.jpg\",\"/musterring-catalog/trevio/image-07.jpg\",\"/musterring-catalog/trevio/image-08.jpg\"]},{\"appProductId\":\"musterring-justb-ct100\",\"slug\":\"justb-ct100\",\"modelCode\":\"JUSTB! CT100\",\"name\":\"JUSTB! CT100\",\"tagline\":\"Versatile couch companions\",\"description\":\"Discover the couch and side table from the current collection of Bettina Zimmermann.\",\"category\":\"coffee-table\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/coffee-tables-side-tables/justb-ct100\",\"images\":[\"/musterring-catalog/justb-ct100/image-01.jpg\",\"/musterring-catalog/justb-ct100/image-02.jpg\",\"/musterring-catalog/justb-ct100/image-03.jpg\",\"/musterring-catalog/justb-ct100/image-04.jpg\",\"/musterring-catalog/justb-ct100/image-05.jpg\",\"/musterring-catalog/justb-ct100/image-06.jpg\",\"/musterring-catalog/justb-ct100/image-07.jpg\",\"/musterring-catalog/justb-ct100/image-08.jpg\"]},{\"appProductId\":\"musterring-nara\",\"slug\":\"nara\",\"modelCode\":\"NARA\",\"name\":\"NARA\",\"tagline\":\"When the coffee table becomes a piece of jewellery\",\"description\":\"The modern NARA coffee and side table series from Musterring offers tables in two heights and table tops in two shapes and different sizes.\",\"category\":\"coffee-table\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/coffee-tables-side-tables/nara\",\"images\":[\"/musterring-catalog/nara/image-01.jpg\"]},{\"appProductId\":\"musterring-nara-new-kopie-1\",\"slug\":\"nara-new-kopie-1\",\"modelCode\":\"MR TOSCANA\",\"name\":\"MR TOSCANA\",\"tagline\":\"Italian flair for your living room\",\"description\":\"Musterring: Simple elegance meets first-class materials - coffee tables from MR TOSCANA will inspire you too.\",\"category\":\"coffee-table\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/coffee-tables-side-tables/nara-new-kopie-1\",\"images\":[\"/musterring-catalog/nara-new-kopie-1/image-01.jpg\",\"/musterring-catalog/nara-new-kopie-1/image-02.jpg\",\"/musterring-catalog/nara-new-kopie-1/image-03.jpg\",\"/musterring-catalog/nara-new-kopie-1/image-04.jpg\",\"/musterring-catalog/nara-new-kopie-1/image-05.jpg\",\"/musterring-catalog/nara-new-kopie-1/image-06.jpg\",\"/musterring-catalog/nara-new-kopie-1/image-07.jpg\",\"/musterring-catalog/nara-new-kopie-1/image-08.jpg\"]},{\"appProductId\":\"musterring-nela\",\"slug\":\"nela\",\"modelCode\":\"NELA\",\"name\":\"NELA\",\"tagline\":\"Modern coffee tables in Bauhaus chic\",\"description\":\"The minimalistic design of our NELA coffee tables features straight lines and right angles throughout. Discover more.\",\"category\":\"coffee-table\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/living-room/coffee-tables-side-tables/nela\",\"images\":[\"/musterring-catalog/nela/image-01.jpg\",\"/musterring-catalog/nela/image-02.jpg\",\"/musterring-catalog/nela/image-03.jpg\",\"/musterring-catalog/nela/image-04.jpg\",\"/musterring-catalog/nela/image-05.jpg\",\"/musterring-catalog/nela/image-06.jpg\",\"/musterring-catalog/nela/image-07.jpg\",\"/musterring-catalog/nela/image-08.jpg\"]},{\"appProductId\":\"musterring-joline\",\"slug\":\"joline\",\"modelCode\":\"JOLINE\",\"name\":\"JOLINE\",\"tagline\":\"Carved from a very special wood\",\"description\":\"Solid oak wood gives this bedroom series from Musterring an extra cosy feel. Discover more.\",\"category\":\"bedroom-series\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bedroom/bedroom-series/joline\",\"images\":[\"/musterring-catalog/joline/image-01.jpg\",\"/musterring-catalog/joline/image-02.jpg\",\"/musterring-catalog/joline/image-03.jpg\",\"/musterring-catalog/joline/image-04.jpg\",\"/musterring-catalog/joline/image-05.jpg\",\"/musterring-catalog/joline/image-06.jpg\",\"/musterring-catalog/joline/image-07.jpg\",\"/musterring-catalog/joline/image-08.jpg\"]},{\"appProductId\":\"musterring-san-antonio\",\"slug\":\"san-antonio\",\"modelCode\":\"SAN ANTONIO\",\"name\":\"SAN ANTONIO\",\"tagline\":\"Where glamour and cosiness meet\",\"description\":\"The SAN ANTONIO series from Musterring brings a fresh look to the bedroom with a sporty, modern futon bed and glossy glass fronts.\",\"category\":\"bedroom-series\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bedroom/bedroom-series/san-antonio\",\"images\":[\"/musterring-catalog/san-antonio/image-01.jpg\",\"/musterring-catalog/san-antonio/image-02.jpg\",\"/musterring-catalog/san-antonio/image-03.jpg\",\"/musterring-catalog/san-antonio/image-04.jpg\",\"/musterring-catalog/san-antonio/image-05.jpg\"]},{\"appProductId\":\"musterring-malin\",\"slug\":\"malin\",\"modelCode\":\"MALIN\",\"name\":\"MALIN\",\"tagline\":\"Your retreat for pure relaxation\",\"description\":\"The extensive MALIN wardrobe system combines real wood veneers made of beamed oak with modern lacquer finishes; beds and occasional furniture round off the range.\",\"category\":\"bedroom-series\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bedroom/bedroom-series/malin\",\"images\":[\"/musterring-catalog/malin/image-01.jpg\",\"/musterring-catalog/malin/image-02.jpg\",\"/musterring-catalog/malin/image-03.jpg\",\"/musterring-catalog/malin/image-04.jpg\",\"/musterring-catalog/malin/image-05.jpg\",\"/musterring-catalog/malin/image-06.jpg\",\"/musterring-catalog/malin/image-07.jpg\",\"/musterring-catalog/malin/image-08.jpg\"]},{\"appProductId\":\"musterring-jovanna\",\"slug\":\"jovanna\",\"modelCode\":\"JOVANNA\",\"name\":\"JOVANNA\",\"tagline\":\"When furniture dreams come true\",\"description\":\"Transform your bedroom into a cosy sanctuary with the beds, chests of drawers and wardrobes in our JOVANNA series. Discover more.\",\"category\":\"bedroom-series\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bedroom/bedroom-series/jovanna\",\"images\":[\"/musterring-catalog/jovanna/image-01.jpg\",\"/musterring-catalog/jovanna/image-02.jpg\",\"/musterring-catalog/jovanna/image-03.jpg\",\"/musterring-catalog/jovanna/image-04.jpg\",\"/musterring-catalog/jovanna/image-05.jpg\",\"/musterring-catalog/jovanna/image-06.jpg\",\"/musterring-catalog/jovanna/image-07.jpg\",\"/musterring-catalog/jovanna/image-08.jpg\"]},{\"appProductId\":\"musterring-joern\",\"slug\":\"joern\",\"modelCode\":\"Joern\",\"name\":\"Joern\",\"tagline\":\"JÖRN Order starts with the design\",\"description\":\"Musterring: The JÖRN bedroom range from Musterring impresses with its clean design, high-quality finishes in lacquer or solid wood, and accents in natural split wood.\",\"category\":\"bedroom-series\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bedroom/bedroom-series/joern\",\"images\":[\"/musterring-catalog/joern/image-01.jpg\",\"/musterring-catalog/joern/image-02.jpg\",\"/musterring-catalog/joern/image-03.jpg\",\"/musterring-catalog/joern/image-04.jpg\",\"/musterring-catalog/joern/image-05.jpg\",\"/musterring-catalog/joern/image-06.jpg\",\"/musterring-catalog/joern/image-07.jpg\",\"/musterring-catalog/joern/image-08.jpg\"]},{\"appProductId\":\"musterring-kara-frame-schlafen\",\"slug\":\"kara-frame-schlafen\",\"modelCode\":\"Kara Frame Schlafen\",\"name\":\"Kara Frame Schlafen\",\"tagline\":\"KARA-FRAME-SCHLAFEN turns design dreams into reality\",\"description\":\"Musterring: With this furniture programme, you can bring real variety into your bedroom and enjoy beautiful design. Find out more.\",\"category\":\"bedroom-series\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bedroom/bedroom-series/kara-frame-schlafen\",\"images\":[\"/musterring-catalog/kara-frame-schlafen/image-01.jpg\",\"/musterring-catalog/kara-frame-schlafen/image-02.jpg\",\"/musterring-catalog/kara-frame-schlafen/image-03.jpg\",\"/musterring-catalog/kara-frame-schlafen/image-04.jpg\",\"/musterring-catalog/kara-frame-schlafen/image-05.jpg\",\"/musterring-catalog/kara-frame-schlafen/image-06.jpg\",\"/musterring-catalog/kara-frame-schlafen/image-07.jpg\",\"/musterring-catalog/kara-frame-schlafen/image-08.jpg\"]},{\"appProductId\":\"musterring-madiva\",\"slug\":\"madiva\",\"modelCode\":\"MADIVA\",\"name\":\"MADIVA\",\"tagline\":\"Makes dreams come true\",\"description\":\"From the bed to the wardrobe to the bedside table: the MADIVA bedroom series Musterring stands out for its wide range of products.\",\"category\":\"bedroom-series\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bedroom/bedroom-series/madiva\",\"images\":[\"/musterring-catalog/madiva/image-01.jpg\",\"/musterring-catalog/madiva/image-02.jpg\",\"/musterring-catalog/madiva/image-03.jpg\",\"/musterring-catalog/madiva/image-04.jpg\",\"/musterring-catalog/madiva/image-05.jpg\",\"/musterring-catalog/madiva/image-06.jpg\",\"/musterring-catalog/madiva/image-07.jpg\",\"/musterring-catalog/madiva/image-08.jpg\"]},{\"appProductId\":\"musterring-san-francisco\",\"slug\":\"san-francisco\",\"modelCode\":\"SAN FRANCISCO\",\"name\":\"SAN FRANCISCO\",\"tagline\":\"Glamorous and cosy\",\"description\":\"The SAN FRANCISCO bedroom combines Bianco oak with modern glass fronts and an expressive crossbar in different textures.\",\"category\":\"bedroom-series\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bedroom/bedroom-series/san-francisco\",\"images\":[\"/musterring-catalog/san-francisco/image-01.jpg\",\"/musterring-catalog/san-francisco/image-02.jpg\",\"/musterring-catalog/san-francisco/image-03.jpg\",\"/musterring-catalog/san-francisco/image-04.jpg\",\"/musterring-catalog/san-francisco/image-05.jpg\"]},{\"appProductId\":\"musterring-san-diego\",\"slug\":\"san-diego\",\"modelCode\":\"SAN DIEGO\",\"name\":\"SAN DIEGO\",\"tagline\":\"Glamorous appearance\",\"description\":\"The SAN DIEGO series from Musterring injects fresh style into your bedroom with shiny glass fronts and delicate chrome handles.\",\"category\":\"bedroom-series\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bedroom/bedroom-series/san-diego\",\"images\":[\"/musterring-catalog/san-diego/image-01.jpg\",\"/musterring-catalog/san-diego/image-02.jpg\",\"/musterring-catalog/san-diego/image-03.jpg\",\"/musterring-catalog/san-diego/image-04.jpg\",\"/musterring-catalog/san-diego/image-05.jpg\",\"/musterring-catalog/san-diego/image-06.jpg\",\"/musterring-catalog/san-diego/image-07.jpg\",\"/musterring-catalog/san-diego/image-08.jpg\"]},{\"appProductId\":\"musterring-savona-20\",\"slug\":\"savona-20\",\"modelCode\":\"Savona 20\",\"name\":\"Savona 20\",\"tagline\":\"SAVONA 2.0 Dream bedroom with a feel-good guarantee\",\"description\":\"The SAVONA 2.0 bedroom series combines solid-wood fronts in bianco oak with glass surfaces in the colour shade champagne.\",\"category\":\"bedroom-series\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bedroom/bedroom-series/savona-20\",\"images\":[\"/musterring-catalog/savona-20/image-01.jpg\",\"/musterring-catalog/savona-20/image-02.jpg\",\"/musterring-catalog/savona-20/image-03.jpg\",\"/musterring-catalog/savona-20/image-04.jpg\",\"/musterring-catalog/savona-20/image-05.jpg\",\"/musterring-catalog/savona-20/image-06.jpg\",\"/musterring-catalog/savona-20/image-07.jpg\",\"/musterring-catalog/savona-20/image-08.jpg\"]},{\"appProductId\":\"musterring-sorrent\",\"slug\":\"sorrent\",\"modelCode\":\"SORRENT\",\"name\":\"SORRENT\",\"tagline\":\"An oasis of comfort\",\"description\":\"The SORRENT bedroom series combines solid oak fronts with details in a slate look.\",\"category\":\"bedroom-series\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bedroom/bedroom-series/sorrent\",\"images\":[\"/musterring-catalog/sorrent/image-01.jpg\",\"/musterring-catalog/sorrent/image-02.jpg\",\"/musterring-catalog/sorrent/image-03.jpg\",\"/musterring-catalog/sorrent/image-04.jpg\",\"/musterring-catalog/sorrent/image-05.jpg\",\"/musterring-catalog/sorrent/image-06.jpg\",\"/musterring-catalog/sorrent/image-07.jpg\",\"/musterring-catalog/sorrent/image-08.jpg\"]},{\"appProductId\":\"musterring-justb-sc100\",\"slug\":\"justb-sc100\",\"modelCode\":\"JUSTB! SC100\",\"name\":\"JUSTB! SC100\",\"tagline\":\"the stuff dreams are made of\",\"description\":\"[Translate to en:] Die gemütlichen Polster- und Boxspringbetten aus unserer JustB!-Kollektion stehen für echten Liege- und Schlafkomfort. Mehr erfahren.\",\"category\":\"bed\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bedroom/beds/justb-sc100\",\"images\":[\"/musterring-catalog/justb-sc100/image-01.jpg\",\"/musterring-catalog/justb-sc100/image-02.jpg\",\"/musterring-catalog/justb-sc100/image-03.jpg\",\"/musterring-catalog/justb-sc100/image-04.jpg\",\"/musterring-catalog/justb-sc100/image-05.jpg\",\"/musterring-catalog/justb-sc100/image-06.jpg\",\"/musterring-catalog/justb-sc100/image-07.jpg\",\"/musterring-catalog/justb-sc100/image-08.jpg\"]},{\"appProductId\":\"musterring-justb-sc200\",\"slug\":\"justb-sc200\",\"modelCode\":\"JUSTB! SC200\",\"name\":\"JUSTB! SC200\",\"tagline\":\"Das Bett deiner Träume\",\"description\":\"Musterring: Discover the JustB! SC200 upholstered bed from our collection, designed by Bettina Zimmermann. Explore it now!\",\"category\":\"bed\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bedroom/beds/justb-sc200\",\"images\":[\"/musterring-catalog/justb-sc200/image-01.jpg\",\"/musterring-catalog/justb-sc200/image-02.jpg\",\"/musterring-catalog/justb-sc200/image-03.jpg\",\"/musterring-catalog/justb-sc200/image-04.jpg\",\"/musterring-catalog/justb-sc200/image-05.jpg\"]},{\"appProductId\":\"musterring-delphi\",\"slug\":\"delphi\",\"modelCode\":\"DELPHI\",\"name\":\"DELPHI\",\"tagline\":\"The perfect symbiosis of aesthetics and comfort\",\"description\":\"Simply sleep well: the comfortable DELPHI upholstered bed is available in many different colours and with three different headboards. Discover more.\",\"category\":\"bed\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bedroom/beds/delphi\",\"images\":[\"/musterring-catalog/delphi/image-01.jpg\",\"/musterring-catalog/delphi/image-02.jpg\",\"/musterring-catalog/delphi/image-03.jpg\",\"/musterring-catalog/delphi/image-04.jpg\",\"/musterring-catalog/delphi/image-05.jpg\",\"/musterring-catalog/delphi/image-06.jpg\",\"/musterring-catalog/delphi/image-07.jpg\",\"/musterring-catalog/delphi/image-08.jpg\"]},{\"appProductId\":\"musterring-mr-dubai\",\"slug\":\"mr-dubai\",\"modelCode\":\"MR DUBAI\",\"name\":\"MR DUBAI\",\"tagline\":\"Sleep like in paradise\",\"description\":\"The MR DUBAI bed range stands for maximum box-spring comfort, offers a choice of five system structures and includes toppers, plaids and cushions as accessories\",\"category\":\"bed\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bedroom/beds/mr-dubai\",\"images\":[\"/musterring-catalog/mr-dubai/image-01.jpg\",\"/musterring-catalog/mr-dubai/image-02.jpg\",\"/musterring-catalog/mr-dubai/image-03.jpg\",\"/musterring-catalog/mr-dubai/image-04.jpg\",\"/musterring-catalog/mr-dubai/image-05.jpg\",\"/musterring-catalog/mr-dubai/image-06.jpg\",\"/musterring-catalog/mr-dubai/image-07.jpg\",\"/musterring-catalog/mr-dubai/image-08.jpg\"]},{\"appProductId\":\"musterring-translate-to-en-eforma\",\"slug\":\"translate-to-en-eforma\",\"modelCode\":\"Translate To En Eforma\",\"name\":\"Translate To En Eforma\",\"tagline\":\"EFORMA So that a good night's sleep is not just a dream\",\"description\":\"Good design for good sleep: our EFORMA box-spring bed combines comfort and aesthetics in one model. Discover more.\",\"category\":\"bed\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bedroom/beds/translate-to-en-eforma\",\"images\":[\"/musterring-catalog/translate-to-en-eforma/image-01.jpg\",\"/musterring-catalog/translate-to-en-eforma/image-02.jpg\",\"/musterring-catalog/translate-to-en-eforma/image-03.jpg\",\"/musterring-catalog/translate-to-en-eforma/image-04.jpg\",\"/musterring-catalog/translate-to-en-eforma/image-05.jpg\",\"/musterring-catalog/translate-to-en-eforma/image-06.jpg\",\"/musterring-catalog/translate-to-en-eforma/image-07.jpg\",\"/musterring-catalog/translate-to-en-eforma/image-08.jpg\"]},{\"appProductId\":\"musterring-elias\",\"slug\":\"elias\",\"modelCode\":\"ELIAS\",\"name\":\"ELIAS\",\"tagline\":\"For uniquely restorative sleep\",\"description\":\"Restful sleep and real lying comfort: the ELIAS box-spring bed from Musterring offers you this and much more.\",\"category\":\"bed\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bedroom/beds/elias\",\"images\":[\"/musterring-catalog/elias/image-01.jpg\",\"/musterring-catalog/elias/image-02.jpg\",\"/musterring-catalog/elias/image-03.jpg\",\"/musterring-catalog/elias/image-04.jpg\",\"/musterring-catalog/elias/image-05.jpg\",\"/musterring-catalog/elias/image-06.jpg\",\"/musterring-catalog/elias/image-07.jpg\",\"/musterring-catalog/elias/image-08.jpg\"]},{\"appProductId\":\"musterring-elos\",\"slug\":\"elos\",\"modelCode\":\"ELOS\",\"name\":\"ELOS\",\"tagline\":\"More variety in the bedroom\",\"description\":\"With the ELOS upholstered bed, Musterring offers you a huge selection of fabrics from the renowned brand JAB ANSTOETZ. Discover it now.\",\"category\":\"bed\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bedroom/beds/elos\",\"images\":[\"/musterring-catalog/elos/image-01.jpg\",\"/musterring-catalog/elos/image-02.jpg\",\"/musterring-catalog/elos/image-03.jpg\",\"/musterring-catalog/elos/image-04.jpg\",\"/musterring-catalog/elos/image-05.jpg\",\"/musterring-catalog/elos/image-06.jpg\",\"/musterring-catalog/elos/image-07.jpg\",\"/musterring-catalog/elos/image-08.jpg\"]},{\"appProductId\":\"musterring-bari\",\"slug\":\"bari\",\"modelCode\":\"BARI\",\"name\":\"BARI\",\"tagline\":\"Fully customisable from top to bottom\",\"description\":\"The fabric-covered BARI upholstered bed combines the finest cosy comfort with practical accessories – from a spacious bed base to a clever tuck-away table.\",\"category\":\"bed\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bedroom/beds/bari\",\"images\":[\"/musterring-catalog/bari/image-01.jpg\",\"/musterring-catalog/bari/image-02.jpg\",\"/musterring-catalog/bari/image-03.jpg\",\"/musterring-catalog/bari/image-04.jpg\",\"/musterring-catalog/bari/image-05.jpg\",\"/musterring-catalog/bari/image-06.jpg\",\"/musterring-catalog/bari/image-07.jpg\",\"/musterring-catalog/bari/image-08.jpg\"]},{\"appProductId\":\"musterring-mr-imola\",\"slug\":\"mr-imola\",\"modelCode\":\"MR IMOLA\",\"name\":\"MR IMOLA\",\"tagline\":\"The radiant storage space miracle\",\"description\":\"The MR IMOLA wardrobe range brings a breath of fresh air into the bedroom with its radiant glass fronts, crystal mirrors, decorative mirrors and decorative chrome elements.\",\"category\":\"wardrobe\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bedroom/wardrobes/mr-imola\",\"images\":[\"/musterring-catalog/mr-imola/image-01.jpg\",\"/musterring-catalog/mr-imola/image-02.jpg\"]},{\"appProductId\":\"musterring-mr-isabelle\",\"slug\":\"mr-isabelle\",\"modelCode\":\"MR ISABELLE\",\"name\":\"MR ISABELLE\",\"tagline\":\"A wardrobe for life\",\"description\":\"The modern MR ISABELLE wardrobe range scores with high-quality decors, functional accessories and a large selection of chests of drawers and bedside cabinets.\",\"category\":\"wardrobe\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bedroom/wardrobes/mr-isabelle\",\"images\":[\"/musterring-catalog/mr-isabelle/image-01.jpg\",\"/musterring-catalog/mr-isabelle/image-02.jpg\",\"/musterring-catalog/mr-isabelle/image-03.jpg\",\"/musterring-catalog/mr-isabelle/image-04.jpg\",\"/musterring-catalog/mr-isabelle/image-05.jpg\",\"/musterring-catalog/mr-isabelle/image-06.jpg\",\"/musterring-catalog/mr-isabelle/image-07.jpg\",\"/musterring-catalog/mr-isabelle/image-08.jpg\"]},{\"appProductId\":\"musterring-justb-sp100\",\"slug\":\"justb-sp100\",\"modelCode\":\"JUSTB! SP100\",\"name\":\"JUSTB! SP100\",\"tagline\":\"the dining table for sociable get-togethers\",\"description\":\"With the dining table variants from our JustB! collection, we have developed a design that is sure to suit your taste. Discover more.\",\"category\":\"dining-table\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/dining-room/chairs-tables/justb-sp100\",\"images\":[\"/musterring-catalog/justb-sp100/image-01.jpg\",\"/musterring-catalog/justb-sp100/image-02.jpg\",\"/musterring-catalog/justb-sp100/image-03.jpg\",\"/musterring-catalog/justb-sp100/image-04.jpg\",\"/musterring-catalog/justb-sp100/image-05.jpg\",\"/musterring-catalog/justb-sp100/image-06.jpg\",\"/musterring-catalog/justb-sp100/image-07.jpg\",\"/musterring-catalog/justb-sp100/image-08.jpg\"]},{\"appProductId\":\"musterring-justb-sp150\",\"slug\":\"justb-sp150\",\"modelCode\":\"JUSTB! SP150\",\"name\":\"JUSTB! SP150\",\"tagline\":\"the best of the simple\",\"description\":\"Musterring: Stil und Komfort sind die Zutaten, aus denen wir dieses Möbelprogramm für Ihr Esszimmer entwickelt haben. Erfahren Sie mehr.\",\"category\":\"dining-table\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/dining-room/chairs-tables/justb-sp150\",\"images\":[\"/musterring-catalog/justb-sp150/image-01.jpg\",\"/musterring-catalog/justb-sp150/image-02.jpg\",\"/musterring-catalog/justb-sp150/image-03.jpg\",\"/musterring-catalog/justb-sp150/image-04.jpg\",\"/musterring-catalog/justb-sp150/image-05.jpg\",\"/musterring-catalog/justb-sp150/image-06.jpg\"]},{\"appProductId\":\"musterring-helana\",\"slug\":\"helana\",\"modelCode\":\"HELANA\",\"name\":\"HELANA\",\"tagline\":\"Comfortable seating at counter height\",\"description\":\"The HELANA dining room range offers perfectly coordinated barstools, benches and standing tables. Discover more.\",\"category\":\"dining-chair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/dining-room/chairs-tables/helana\",\"images\":[\"/musterring-catalog/helana/image-01.jpg\",\"/musterring-catalog/helana/image-02.jpg\",\"/musterring-catalog/helana/image-03.jpg\",\"/musterring-catalog/helana/image-04.jpg\",\"/musterring-catalog/helana/image-05.jpg\",\"/musterring-catalog/helana/image-06.jpg\",\"/musterring-catalog/helana/image-07.jpg\",\"/musterring-catalog/helana/image-08.jpg\"]},{\"appProductId\":\"musterring-helmond\",\"slug\":\"helmond\",\"modelCode\":\"HELMOND\",\"name\":\"HELMOND\",\"tagline\":\"Sophisticated ideas for your dining room\",\"description\":\"Whet your appetite for stylish design: the dining tables and chairs in this series show what modern furniture design can do. Discover more.\",\"category\":\"dining-chair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/dining-room/chairs-tables/helmond\",\"images\":[\"/musterring-catalog/helmond/image-01.jpg\",\"/musterring-catalog/helmond/image-02.jpg\",\"/musterring-catalog/helmond/image-03.jpg\",\"/musterring-catalog/helmond/image-04.jpg\",\"/musterring-catalog/helmond/image-05.jpg\",\"/musterring-catalog/helmond/image-06.jpg\",\"/musterring-catalog/helmond/image-07.jpg\",\"/musterring-catalog/helmond/image-08.jpg\"]},{\"appProductId\":\"musterring-helvin\",\"slug\":\"helvin\",\"modelCode\":\"HELVIN\",\"name\":\"HELVIN\",\"tagline\":\"Makes you hungry for more\",\"description\":\"Comfortable dining chairs and tasteful table options are part of this dining room range from Musterring. Find out more about the HELVIN range.\",\"category\":\"dining-chair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/dining-room/chairs-tables/helvin\",\"images\":[\"/musterring-catalog/helvin/image-01.jpg\",\"/musterring-catalog/helvin/image-02.jpg\",\"/musterring-catalog/helvin/image-03.jpg\",\"/musterring-catalog/helvin/image-04.jpg\",\"/musterring-catalog/helvin/image-05.jpg\"]},{\"appProductId\":\"musterring-navarra\",\"slug\":\"navarra\",\"modelCode\":\"NAVARRA\",\"name\":\"NAVARRA\",\"tagline\":\"Just sitting really well\",\"description\":\"Are you looking for modern tables and chairs for your dining room? Then NAVARRA is the perfect furniture series for you. Discover more.\",\"category\":\"dining-chair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/dining-room/chairs-tables/navarra\",\"images\":[\"/musterring-catalog/navarra/image-01.jpg\",\"/musterring-catalog/navarra/image-02.jpg\",\"/musterring-catalog/navarra/image-03.jpg\",\"/musterring-catalog/navarra/image-04.jpg\",\"/musterring-catalog/navarra/image-05.jpg\",\"/musterring-catalog/navarra/image-06.jpg\",\"/musterring-catalog/navarra/image-07.jpg\",\"/musterring-catalog/navarra/image-08.jpg\"]},{\"appProductId\":\"musterring-nerina\",\"slug\":\"nerina\",\"modelCode\":\"NERINA\",\"name\":\"NERINA\",\"tagline\":\"Everything revolves around cosiness here\",\"description\":\"The comfortable NERINA dining chairs from Musterring have an attractive tripod frame with swivel function and can be upholstered in two colours. Find out more.\",\"category\":\"dining-chair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/dining-room/chairs-tables/nerina\",\"images\":[\"/musterring-catalog/nerina/image-01.jpg\",\"/musterring-catalog/nerina/image-02.jpg\",\"/musterring-catalog/nerina/image-03.jpg\",\"/musterring-catalog/nerina/image-04.jpg\",\"/musterring-catalog/nerina/image-05.jpg\",\"/musterring-catalog/nerina/image-06.jpg\"]},{\"appProductId\":\"musterring-nevio\",\"slug\":\"nevio\",\"modelCode\":\"NEVIO\",\"name\":\"NEVIO\",\"tagline\":\"For more variety in the dining room\",\"description\":\"With its light, yet distinctive look, NEVIO is the modern dining room series from Musterring. Discover more.\",\"category\":\"dining-table\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/dining-room/chairs-tables/nevio\",\"images\":[\"/musterring-catalog/nevio/image-01.jpg\",\"/musterring-catalog/nevio/image-02.jpg\",\"/musterring-catalog/nevio/image-03.jpg\",\"/musterring-catalog/nevio/image-04.jpg\",\"/musterring-catalog/nevio/image-05.jpg\",\"/musterring-catalog/nevio/image-06.jpg\",\"/musterring-catalog/nevio/image-07.jpg\",\"/musterring-catalog/nevio/image-08.jpg\"]},{\"appProductId\":\"musterring-nica\",\"slug\":\"nica\",\"modelCode\":\"NICA\",\"name\":\"NICA\",\"tagline\":\"enjoy good design together\",\"description\":\"The eye eats with you. That is why with NICA we offer you a particularly shapely dining room table for a tasteful interior.\",\"category\":\"dining-table\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/dining-room/chairs-tables/nica\",\"images\":[\"/musterring-catalog/nica/image-01.jpg\",\"/musterring-catalog/nica/image-02.png\"]},{\"appProductId\":\"musterring-nilan\",\"slug\":\"nilan\",\"modelCode\":\"NILAN\",\"name\":\"NILAN\",\"tagline\":\"The perfect choice for gourmets and aesthetes\",\"description\":\"The modern NILAN dining room range includes comfortable chairs with a four-legged or tripod base and dining tables with a solid wood top and decorative resin panelling. Find out more now.\",\"category\":\"dining-chair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/dining-room/chairs-tables/nilan\",\"images\":[\"/musterring-catalog/nilan/image-01.jpg\",\"/musterring-catalog/nilan/image-02.jpg\",\"/musterring-catalog/nilan/image-03.jpg\",\"/musterring-catalog/nilan/image-04.jpg\",\"/musterring-catalog/nilan/image-05.jpg\"]},{\"appProductId\":\"musterring-nova\",\"slug\":\"nova\",\"modelCode\":\"NOVA\",\"name\":\"NOVA\",\"tagline\":\"A feast for the eyes\",\"description\":\"Modern dining room furniture from Musterring: discover our NOVA range now and experience authentic high quality. Discover more.\",\"category\":\"dining-table\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/dining-room/chairs-tables/nova\",\"images\":[\"/musterring-catalog/nova/image-01.jpg\",\"/musterring-catalog/nova/image-02.jpg\",\"/musterring-catalog/nova/image-03.jpg\",\"/musterring-catalog/nova/image-04.jpg\",\"/musterring-catalog/nova/image-05.jpg\",\"/musterring-catalog/nova/image-06.jpg\",\"/musterring-catalog/nova/image-07.jpg\",\"/musterring-catalog/nova/image-08.jpg\"]},{\"appProductId\":\"musterring-picara\",\"slug\":\"picara\",\"modelCode\":\"PICARA\",\"name\":\"PICARA\",\"tagline\":\"Set the table\",\"description\":\"PICARA is the modular furniture series for your dining or living room from Musterring. Discover more.\",\"category\":\"dining-table\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/dining-room/chairs-tables/picara\",\"images\":[\"/musterring-catalog/picara/image-01.jpg\",\"/musterring-catalog/picara/image-02.jpg\",\"/musterring-catalog/picara/image-03.jpg\",\"/musterring-catalog/picara/image-04.jpg\",\"/musterring-catalog/picara/image-05.jpg\",\"/musterring-catalog/picara/image-06.jpg\",\"/musterring-catalog/picara/image-07.jpg\",\"/musterring-catalog/picara/image-08.jpg\"]},{\"appProductId\":\"musterring-pinero\",\"slug\":\"pinero\",\"modelCode\":\"PINERO\",\"name\":\"PINERO\",\"tagline\":\"Slim furniture for your dining room\",\"description\":\"Do you want to redesign your dining room? PINERO from Musterring is the perfect choice for anyone who prefers a light, modern look. Discover more.\",\"category\":\"dining-table\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/dining-room/chairs-tables/pinero\",\"images\":[\"/musterring-catalog/pinero/image-01.jpg\",\"/musterring-catalog/pinero/image-02.jpg\",\"/musterring-catalog/pinero/image-03.jpg\",\"/musterring-catalog/pinero/image-04.jpg\",\"/musterring-catalog/pinero/image-05.jpg\",\"/musterring-catalog/pinero/image-06.jpg\",\"/musterring-catalog/pinero/image-07.jpg\",\"/musterring-catalog/pinero/image-08.jpg\"]},{\"appProductId\":\"musterring-tamina\",\"slug\":\"tamina\",\"modelCode\":\"TAMINA\",\"name\":\"TAMINA\",\"tagline\":\"Dining room furniture with a clear edge\",\"description\":\"The stylish dining tables and chairs in our TAMINA range are rustic yet modern. Discover more.\",\"category\":\"dining-chair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/dining-room/chairs-tables/tamina\",\"images\":[\"/musterring-catalog/tamina/image-01.jpg\",\"/musterring-catalog/tamina/image-02.jpg\",\"/musterring-catalog/tamina/image-03.jpg\",\"/musterring-catalog/tamina/image-04.jpg\",\"/musterring-catalog/tamina/image-05.jpg\",\"/musterring-catalog/tamina/image-06.jpg\",\"/musterring-catalog/tamina/image-07.jpg\",\"/musterring-catalog/tamina/image-08.jpg\"]},{\"appProductId\":\"musterring-tario\",\"slug\":\"tario\",\"modelCode\":\"TARIO\",\"name\":\"TARIO\",\"tagline\":\"Take a seat and enjoy\",\"description\":\"The stylish TARIO dining room series offers comfortable shell chairs upholstered in bouclé or microfibre, as well as modern tables with solid oak tops.\",\"category\":\"dining-chair\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/dining-room/chairs-tables/tario\",\"images\":[\"/musterring-catalog/tario/image-01.jpg\",\"/musterring-catalog/tario/image-02.jpg\",\"/musterring-catalog/tario/image-03.jpg\",\"/musterring-catalog/tario/image-04.jpg\",\"/musterring-catalog/tario/image-05.jpg\",\"/musterring-catalog/tario/image-06.jpg\",\"/musterring-catalog/tario/image-07.jpg\",\"/musterring-catalog/tario/image-08.jpg\"]},{\"appProductId\":\"musterring-tavia\",\"slug\":\"tavia\",\"modelCode\":\"TAVIA\",\"name\":\"TAVIA\",\"tagline\":\"Diversity wins\",\"description\":\"Are you looking for new dining room furniture? End your search and enjoy the utmost comfort with TAVIA from Musterring. Discover more.\",\"category\":\"dining-table\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/dining-room/chairs-tables/tavia\",\"images\":[\"/musterring-catalog/tavia/image-01.jpg\",\"/musterring-catalog/tavia/image-02.jpg\",\"/musterring-catalog/tavia/image-03.jpg\",\"/musterring-catalog/tavia/image-04.jpg\",\"/musterring-catalog/tavia/image-05.jpg\",\"/musterring-catalog/tavia/image-06.jpg\",\"/musterring-catalog/tavia/image-07.jpg\",\"/musterring-catalog/tavia/image-08.jpg\"]},{\"appProductId\":\"musterring-tiama\",\"slug\":\"tiama\",\"modelCode\":\"TIAMA\",\"name\":\"TIAMA\",\"tagline\":\"Our dining room furniture proves taste\",\"description\":\"At Musterring you will find stylish furniture for your dining room. Because good taste can be furnished.\",\"category\":\"dining-table\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/dining-room/chairs-tables/tiama\",\"images\":[\"/musterring-catalog/tiama/image-01.jpg\",\"/musterring-catalog/tiama/image-02.jpg\",\"/musterring-catalog/tiama/image-03.jpg\",\"/musterring-catalog/tiama/image-04.jpg\",\"/musterring-catalog/tiama/image-05.jpg\",\"/musterring-catalog/tiama/image-06.jpg\",\"/musterring-catalog/tiama/image-07.jpg\",\"/musterring-catalog/tiama/image-08.jpg\"]},{\"appProductId\":\"musterring-tjark\",\"slug\":\"tjark\",\"modelCode\":\"TJARK\",\"name\":\"TJARK\",\"tagline\":\"Scandinavian simplicity for your dining room\",\"description\":\"Musterring: With TJARK, you can bring a touch of Nordic style into your home and enjoy the natural beauty of delicate dining room furniture.\",\"category\":\"dining-table\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/dining-room/chairs-tables/tjark\",\"images\":[\"/musterring-catalog/tjark/image-01.jpg\",\"/musterring-catalog/tjark/image-02.jpg\",\"/musterring-catalog/tjark/image-03.jpg\",\"/musterring-catalog/tjark/image-04.jpg\",\"/musterring-catalog/tjark/image-05.jpg\",\"/musterring-catalog/tjark/image-06.jpg\",\"/musterring-catalog/tjark/image-07.jpg\",\"/musterring-catalog/tjark/image-08.jpg\"]},{\"appProductId\":\"musterring-revento-line\",\"slug\":\"revento-line\",\"modelCode\":\"REVENTO LINE\",\"name\":\"REVENTO LINE\",\"tagline\":\"Bathroom furniture rethought\",\"description\":\"Stylish design and well thought-out storage solutions characterise this popular furniture series for your bathroom. Discover it now.\",\"category\":\"bathroom\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bathroom/bathroom-series/revento-line\",\"images\":[\"/musterring-catalog/revento-line/image-01.jpg\",\"/musterring-catalog/revento-line/image-02.jpg\",\"/musterring-catalog/revento-line/image-03.jpg\",\"/musterring-catalog/revento-line/image-04.jpg\",\"/musterring-catalog/revento-line/image-05.jpg\",\"/musterring-catalog/revento-line/image-06.jpg\",\"/musterring-catalog/revento-line/image-07.jpg\",\"/musterring-catalog/revento-line/image-08.jpg\"]},{\"appProductId\":\"musterring-riana\",\"slug\":\"riana\",\"modelCode\":\"RIANA\",\"name\":\"RIANA\",\"tagline\":\"A new world of bathroom design\",\"description\":\"The modern RIANA bathroom furniture series impresses with its clear design, eight different versions and washbasins made of easy-care Duratek granite. Find out more now.\",\"category\":\"bathroom\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/bathroom/bathroom-series/riana\",\"images\":[\"/musterring-catalog/riana/image-01.jpg\",\"/musterring-catalog/riana/image-02.jpg\",\"/musterring-catalog/riana/image-03.jpg\",\"/musterring-catalog/riana/image-04.jpg\",\"/musterring-catalog/riana/image-05.jpg\",\"/musterring-catalog/riana/image-06.jpg\",\"/musterring-catalog/riana/image-07.jpg\",\"/musterring-catalog/riana/image-08.jpg\"]},{\"appProductId\":\"musterring-freilicht\",\"slug\":\"freilicht\",\"modelCode\":\"FREILICHT\",\"name\":\"FREILICHT\",\"tagline\":\"A place under the stars\",\"description\":\"\",\"category\":\"outdoor\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/outdoor/outdoor-furniture/freilicht\",\"images\":[\"/musterring-catalog/freilicht/image-01.jpg\",\"/musterring-catalog/freilicht/image-02.jpg\",\"/musterring-catalog/freilicht/image-03.jpg\",\"/musterring-catalog/freilicht/image-04.jpg\",\"/musterring-catalog/freilicht/image-05.jpg\",\"/musterring-catalog/freilicht/image-06.jpg\",\"/musterring-catalog/freilicht/image-07.jpg\",\"/musterring-catalog/freilicht/image-08.jpg\"]},{\"appProductId\":\"musterring-summertime\",\"slug\":\"summertime\",\"modelCode\":\"SUMMERTIME\",\"name\":\"SUMMERTIME\",\"tagline\":\"Bring the summer home\",\"description\":\"Musterring: SUMMERTIME takes you into the beautiful season with a charming retro design. Find out more.\",\"category\":\"outdoor\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/outdoor/outdoor-furniture/summertime\",\"images\":[\"/musterring-catalog/summertime/image-01.jpg\",\"/musterring-catalog/summertime/image-02.jpg\",\"/musterring-catalog/summertime/image-03.jpg\",\"/musterring-catalog/summertime/image-04.jpg\",\"/musterring-catalog/summertime/image-05.jpg\",\"/musterring-catalog/summertime/image-06.jpg\",\"/musterring-catalog/summertime/image-07.jpg\",\"/musterring-catalog/summertime/image-08.jpg\"]},{\"appProductId\":\"musterring-helmond-outdoor\",\"slug\":\"helmond-outdoor\",\"modelCode\":\"HELMOND OUTDOOR\",\"name\":\"HELMOND OUTDOOR\",\"tagline\":\"The weatherproof chair with a clever function\",\"description\":\"\",\"category\":\"outdoor\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/outdoor/outdoor-furniture/helmond-outdoor\",\"images\":[\"/musterring-catalog/helmond-outdoor/image-01.jpg\",\"/musterring-catalog/helmond-outdoor/image-02.jpg\",\"/musterring-catalog/helmond-outdoor/image-03.jpg\",\"/musterring-catalog/helmond-outdoor/image-04.jpg\"]},{\"appProductId\":\"musterring-justb-od100\",\"slug\":\"justb-od100\",\"modelCode\":\"JUSTB! OD100\",\"name\":\"JUSTB! OD100\",\"tagline\":\"Outdoor furniture in an airy design\",\"description\":\"Musterring: Robust. Durable. Aesthetic. Enjoy the beautiful season with outdoor furniture from JustB! OD100.\",\"category\":\"outdoor\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/outdoor/outdoor-furniture/justb-od100\",\"images\":[\"/musterring-catalog/justb-od100/image-01.jpg\",\"/musterring-catalog/justb-od100/image-02.jpg\",\"/musterring-catalog/justb-od100/image-03.jpg\",\"/musterring-catalog/justb-od100/image-04.jpg\",\"/musterring-catalog/justb-od100/image-05.jpg\",\"/musterring-catalog/justb-od100/image-06.jpg\"]},{\"appProductId\":\"musterring-justb-km100\",\"slug\":\"justb-km100\",\"modelCode\":\"JUSTB! KM100\",\"name\":\"JUSTB! KM100\",\"tagline\":\"Setting strong accents\",\"description\":\"The small furniture series JustB! KM100 small furniture range includes desks, coffee tables, side tables, seat cushions, chests of drawers, plant stands, mirrors, wall coat racks and wall shelves.\",\"category\":\"small-furniture\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/home-accessories/small-furniture/justb-km100\",\"images\":[\"/musterring-catalog/justb-km100/image-01.jpg\",\"/musterring-catalog/justb-km100/image-02.jpg\",\"/musterring-catalog/justb-km100/image-03.jpg\",\"/musterring-catalog/justb-km100/image-04.jpg\",\"/musterring-catalog/justb-km100/image-05.jpg\",\"/musterring-catalog/justb-km100/image-06.jpg\",\"/musterring-catalog/justb-km100/image-07.jpg\",\"/musterring-catalog/justb-km100/image-08.jpg\"]},{\"appProductId\":\"musterring-deluxe-collection\",\"slug\":\"deluxe-collection\",\"modelCode\":\"DELUXE COLLECTION\",\"name\":\"DELUXE COLLECTION\",\"tagline\":\"Carpets from the Arabian Nights\",\"description\":\"The DELUXE COLLECTION by Musterring puts a modern twist on oriental carpets. Choose from a wide range of patterns, colours, shapes and sizes. Discover more.\",\"category\":\"carpet\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/home-accessories/carpets/deluxe-collection\",\"images\":[\"/musterring-catalog/deluxe-collection/image-01.jpg\",\"/musterring-catalog/deluxe-collection/image-02.jpg\",\"/musterring-catalog/deluxe-collection/image-03.jpg\",\"/musterring-catalog/deluxe-collection/image-04.jpg\",\"/musterring-catalog/deluxe-collection/image-05.jpg\",\"/musterring-catalog/deluxe-collection/image-06.jpg\",\"/musterring-catalog/deluxe-collection/image-07.jpg\",\"/musterring-catalog/deluxe-collection/image-08.jpg\"]},{\"appProductId\":\"musterring-mr-bergen\",\"slug\":\"mr-bergen\",\"modelCode\":\"MR BERGEN\",\"name\":\"MR BERGEN\",\"tagline\":\"The stuff dreams are made of.\",\"description\":\"Musterring: Find stylish rugs in various colours, shapes and sizes. Find out more.\",\"category\":\"carpet\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/home-accessories/carpets/mr-bergen\",\"images\":[\"/musterring-catalog/mr-bergen/image-01.jpg\",\"/musterring-catalog/mr-bergen/image-02.jpg\",\"/musterring-catalog/mr-bergen/image-03.jpg\",\"/musterring-catalog/mr-bergen/image-04.jpg\",\"/musterring-catalog/mr-bergen/image-05.jpg\",\"/musterring-catalog/mr-bergen/image-06.jpg\",\"/musterring-catalog/mr-bergen/image-07.jpg\",\"/musterring-catalog/mr-bergen/image-08.jpg\"]},{\"appProductId\":\"musterring-justb-carpets\",\"slug\":\"justb-carpets\",\"modelCode\":\"JUSTB! CARPETS\",\"name\":\"JUSTB! CARPETS\",\"tagline\":\"distinctive corduroy look\",\"description\":\"With her carpet collection, actress Bettina Zimmermann combines modern design with high-quality materials.\",\"category\":\"carpet\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/home-accessories/carpets/justb-carpets\",\"images\":[\"/musterring-catalog/justb-carpets/image-01.jpg\",\"/musterring-catalog/justb-carpets/image-02.jpg\",\"/musterring-catalog/justb-carpets/image-03.jpg\",\"/musterring-catalog/justb-carpets/image-04.jpg\",\"/musterring-catalog/justb-carpets/image-05.jpg\",\"/musterring-catalog/justb-carpets/image-06.jpg\",\"/musterring-catalog/justb-carpets/image-07.jpg\",\"/musterring-catalog/justb-carpets/image-08.jpg\"]},{\"appProductId\":\"musterring-lamps-20\",\"slug\":\"lamps-20\",\"modelCode\":\"Lamps 20\",\"name\":\"Lamps 20\",\"tagline\":\"LEUCHTEN 2.0 Top-class lighting design\",\"description\":\"The LEUCHTEN 2.0 collection from Musterring comprises three high-quality product families that impress with both their atmospheric light and their design. Find out more.\",\"category\":\"lamp\",\"sourceUrl\":\"https://www.musterring.com/en/furniture/home-accessories/lamp-collection/lamps-20\",\"images\":[\"/musterring-catalog/lamps-20/image-01.jpg\",\"/musterring-catalog/lamps-20/image-02.jpg\",\"/musterring-catalog/lamps-20/image-03.jpg\",\"/musterring-catalog/lamps-20/image-04.jpg\",\"/musterring-catalog/lamps-20/image-05.jpg\",\"/musterring-catalog/lamps-20/image-06.jpg\",\"/musterring-catalog/lamps-20/image-07.jpg\",\"/musterring-catalog/lamps-20/image-08.jpg\"]}]}"));}),
"[project]/lib/musterring-assets.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "productImages",
    ()=>productImages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generated$2f$musterring$2d$catalog$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/lib/generated/musterring-catalog.json (json)");
;
const authorizedProductImages = Object.fromEntries(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generated$2f$musterring$2d$catalog$2e$json__$28$json$29$__["default"].products.map((product)=>[
        product.appProductId,
        product.images
    ]));
const legacyProductImages = {
    p1: [
        "/test-assets/musterring/mr-2875/image-03.jpg",
        "/test-assets/musterring/mr-2875/image-04.jpg",
        "/test-assets/musterring/mr-2875/image-05.jpg",
        "/test-assets/musterring/mr-2875/image-07.jpg"
    ],
    p2: [
        "/test-assets/musterring/mr-1370/image-03.jpg",
        "/test-assets/musterring/mr-1370/image-05.jpg",
        "/test-assets/musterring/mr-1370/image-07.jpg"
    ],
    p3: [
        "/test-assets/musterring/mr-9420/image-03.jpg",
        "/test-assets/musterring/mr-9420/image-05.jpg",
        "/test-assets/musterring/mr-9420/image-08.jpg"
    ],
    p4: [
        "/test-assets/musterring/mr-2490/image-04.jpg",
        "/test-assets/musterring/mr-2490/image-07.jpg"
    ],
    p5: [
        "/test-assets/musterring/sofas-armchairs/image-04.jpg",
        "/test-assets/musterring/sofas-armchairs/image-05.jpg"
    ],
    p6: [
        "/test-assets/musterring/mr-270/image-03.jpg",
        "/test-assets/musterring/mr-270/image-05.jpg",
        "/test-assets/musterring/mr-270/image-08.jpg"
    ],
    p7: [
        "/test-assets/musterring/mr-2490/image-07.jpg",
        "/test-assets/musterring/mr-2490/image-08.jpg"
    ],
    p8: [
        "/test-assets/musterring/sofas-armchairs/image-05.jpg",
        "/test-assets/musterring/sofas-armchairs/image-03.jpg"
    ],
    p9: [
        "/test-assets/musterring/mr-1370/image-05.jpg",
        "/test-assets/musterring/mr-1370/image-08.jpg"
    ],
    p10: [
        "/test-assets/musterring/furniture/image-03.jpg",
        "/test-assets/musterring/sofas-armchairs/image-04.jpg"
    ],
    p11: [
        "/test-assets/musterring/mr-9420/image-05.jpg",
        "/test-assets/musterring/mr-9420/image-07.jpg"
    ],
    p12: [
        "/test-assets/musterring/furniture/image-05.jpg",
        "/test-assets/musterring/furniture/image-07.jpg"
    ]
};
function productImages(productId) {
    return authorizedProductImages[productId] ?? legacyProductImages[productId] ?? authorizedProductImages.p1;
}
}),
"[project]/lib/catalog-taxonomy.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categoryDetails",
    ()=>categoryDetails,
    "categoryGroups",
    ()=>categoryGroups
]);
const categoryDetails = {
    sofa: {
        label: "Sofas",
        room: "Living Room",
        headline: "The heart of the room.",
        description: "Modular and classic sofa collections designed around individual comfort."
    },
    armchair: {
        label: "Armchairs",
        room: "Living Room",
        headline: "A place of your own.",
        description: "Relaxing, swivel and accent armchairs with configurable comfort."
    },
    sectional: {
        label: "Sectional Sofas",
        room: "Living Room",
        headline: "Comfort without limits.",
        description: "Generous corner and modular arrangements for open living spaces."
    },
    storage: {
        label: "Living Walls & Sideboards",
        room: "Living Room",
        headline: "Storage, composed beautifully.",
        description: "Media furniture, living walls and sideboards with architectural clarity."
    },
    "coffee-table": {
        label: "Coffee & Side Tables",
        room: "Living Room",
        headline: "The finishing point.",
        description: "Coffee and side tables that complete the living room."
    },
    "bedroom-series": {
        label: "Bedroom Series",
        room: "Bedroom",
        headline: "A calmer private world.",
        description: "Coordinated bedroom collections for a harmonious retreat."
    },
    bed: {
        label: "Beds",
        room: "Bedroom",
        headline: "Rest, beautifully engineered.",
        description: "Upholstered and box-spring beds designed for restorative comfort."
    },
    wardrobe: {
        label: "Wardrobes",
        room: "Bedroom & Hallway",
        headline: "Order with character.",
        description: "Wardrobe systems with considered storage and refined finishes."
    },
    "dining-chair": {
        label: "Dining Chairs",
        room: "Dining Room",
        headline: "Take a comfortable seat.",
        description: "Dining chairs and swivel chairs made for long conversations."
    },
    "dining-table": {
        label: "Dining Tables",
        room: "Dining Room",
        headline: "Made for gathering.",
        description: "Dining tables with adaptable formats and enduring materials."
    },
    bathroom: {
        label: "Bathroom Series",
        room: "Bathroom",
        headline: "Quiet rituals, considered.",
        description: "Coordinated bathroom furniture with practical storage."
    },
    kitchen: {
        label: "Kitchens",
        room: "Kitchen",
        headline: "The working heart of home.",
        description: "Kitchen collections combining function, craft and clean lines."
    },
    outdoor: {
        label: "Outdoor Furniture",
        room: "Outdoor",
        headline: "Living beyond four walls.",
        description: "Outdoor seating and tables for considered open-air rooms."
    },
    "small-furniture": {
        label: "Small Furniture",
        room: "Home Accessories",
        headline: "Small pieces, strong accents.",
        description: "Flexible occasional furniture for every living world."
    },
    carpet: {
        label: "Carpets",
        room: "Home Accessories",
        headline: "A softer foundation.",
        description: "Carpets that bring texture, warmth and balance to a room."
    },
    lamp: {
        label: "Lamp Collection",
        room: "Home Accessories",
        headline: "Atmosphere, illuminated.",
        description: "Lighting that shapes mood and highlights materials."
    },
    "home-textile": {
        label: "Home Textiles",
        room: "Home Accessories",
        headline: "Layers of comfort.",
        description: "Textiles that add softness, colour and a finished touch."
    }
};
const categoryGroups = [
    {
        name: "Living Room",
        categories: [
            "sofa",
            "armchair",
            "sectional",
            "storage",
            "coffee-table"
        ]
    },
    {
        name: "Bedroom",
        categories: [
            "bedroom-series",
            "bed",
            "wardrobe"
        ]
    },
    {
        name: "Dining Room",
        categories: [
            "dining-chair",
            "dining-table"
        ]
    },
    {
        name: "Bathroom",
        categories: [
            "bathroom"
        ]
    },
    {
        name: "Kitchen",
        categories: [
            "kitchen"
        ]
    },
    {
        name: "Outdoor",
        categories: [
            "outdoor"
        ]
    },
    {
        name: "Home Accessories",
        categories: [
            "small-furniture",
            "carpet",
            "lamp",
            "home-textile"
        ]
    }
];
}),
"[project]/lib/data.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dealers",
    ()=>dealers,
    "disclaimer",
    ()=>disclaimer,
    "materials",
    ()=>materials,
    "products",
    ()=>products,
    "projects",
    ()=>projects,
    "roomScenes",
    ()=>roomScenes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$musterring$2d$assets$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/musterring-assets.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generated$2f$musterring$2d$catalog$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/lib/generated/musterring-catalog.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$catalog$2d$taxonomy$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/catalog-taxonomy.ts [app-route] (ecmascript)");
;
;
;
const image = (name)=>`/stitch-assets/${name}.png`;
const materials = [
    [
        "mat-ivory-boucle",
        "Ivory Boucle",
        "fabric",
        "ivory",
        "soft loop",
        "polyester blend",
        4,
        true,
        true,
        true,
        "medium",
        "Vacuum weekly, dab spills immediately."
    ],
    [
        "mat-sand-weave",
        "Sand Structured Weave",
        "fabric",
        "beige",
        "woven",
        "recycled polyester blend",
        5,
        true,
        true,
        true,
        "low",
        "Use a soft brush and pH-neutral cleaner."
    ],
    [
        "mat-taupe-chenille",
        "Taupe Chenille",
        "fabric",
        "taupe",
        "velvet touch",
        "chenille blend",
        4,
        true,
        false,
        true,
        "medium",
        "Brush with pile direction after cleaning."
    ],
    [
        "mat-walnut-leather",
        "Walnut Leather",
        "leather",
        "brown",
        "natural grain",
        "leather",
        5,
        false,
        false,
        true,
        "high",
        "Condition with leather care twice a year."
    ],
    [
        "mat-charcoal-wool",
        "Charcoal Wool Blend",
        "fabric",
        "charcoal",
        "dry wool",
        "wool blend",
        5,
        false,
        true,
        false,
        "low",
        "Professional cleaning recommended."
    ],
    [
        "mat-stone-micro",
        "Stone Microfiber",
        "fabric",
        "stone",
        "fine matte",
        "microfiber",
        5,
        true,
        true,
        true,
        "low",
        "Wipe with damp cloth."
    ],
    [
        "mat-moss-weave",
        "Moss Performance Weave",
        "fabric",
        "green",
        "structured",
        "polyester",
        4,
        true,
        true,
        true,
        "medium",
        "Spot clean with water-based cleaner."
    ],
    [
        "mat-clay-linen",
        "Clay Linen Look",
        "fabric",
        "terracotta",
        "linen look",
        "linen-viscose blend",
        3,
        false,
        false,
        false,
        "high",
        "Avoid direct sunlight."
    ],
    [
        "mat-cream-leather",
        "Cream Smooth Leather",
        "leather",
        "cream",
        "smooth",
        "leather",
        4,
        false,
        false,
        true,
        "high",
        "Clean with approved leather milk."
    ],
    [
        "mat-smoke-velvet",
        "Smoke Velvet",
        "fabric",
        "grey",
        "velvet",
        "polyester velvet",
        3,
        false,
        false,
        false,
        "medium",
        "Brush gently and avoid soaking."
    ],
    [
        "mat-graphite-easy",
        "Graphite Easy-Care",
        "fabric",
        "graphite",
        "flat weave",
        "polyester",
        5,
        true,
        true,
        true,
        "low",
        "Machine-clean removable covers when applicable."
    ],
    [
        "mat-oat-performance",
        "Oat Performance Cloth",
        "fabric",
        "beige",
        "fine weave",
        "polyester blend",
        5,
        true,
        true,
        true,
        "low",
        "Blot, do not rub."
    ]
].map(([id, name, type, colorFamily, texture, composition, durability, easyCare, petFriendly, familyFriendly, lightSensitivity, care])=>({
        id,
        name,
        type,
        colorFamily,
        texture,
        composition,
        durability,
        easyCare,
        petFriendly,
        familyFriendly,
        lightSensitivity,
        care,
        demoData: true
    }));
const base = {
    description: "Illustrative Musterring concept product for digital experience validation.",
    collection: "Modern Heritage",
    heightMm: 840,
    seatHeightMm: 460,
    seatDepthMm: 560,
    modular: true,
    styles: [
        "modern heritage",
        "editorial",
        "minimal"
    ],
    colors: [
        "beige",
        "taupe",
        "stone",
        "charcoal"
    ],
    materials: [
        "mat-sand-weave",
        "mat-taupe-chenille",
        "mat-stone-micro",
        "mat-graphite-easy"
    ],
    functions: [
        "relax",
        "storage",
        "modular"
    ],
    electricFunctions: [
        "electric relax"
    ],
    armrestOptions: [
        "Slim",
        "Soft pillow",
        "Wide lounge"
    ],
    feetOptions: [
        "Black metal",
        "Oak runner",
        "Hidden glide"
    ],
    comfortOptions: [
        "soft",
        "balanced",
        "firm"
    ],
    active: true,
    demoData: true,
    showroomEligible: true,
    smallSpaceSuitable: false,
    packageDimensions: {
        widthMm: 1100,
        depthMm: 900,
        heightMm: 760,
        minOpeningMm: 820
    }
};
const conceptProducts = [
    [
        "p1",
        "mr-2875-modular-comfort",
        "MR 2875",
        "MR 2875 Modular Comfort System",
        "A quiet modular sofa with generous comfort and refined proportions.",
        "sofa",
        2380,
        980,
        3,
        image("musterring_product_detail"),
        428000,
        true
    ],
    [
        "p2",
        "mr-2710-compact-sofa",
        "MR 2710",
        "MR 2710 Compact Sofa",
        "Compact seating for apartments without sacrificing upright comfort.",
        "sofa",
        2180,
        920,
        3,
        image("musterring_sofas_seating"),
        318000,
        true
    ],
    [
        "p3",
        "mr-4810-lounge-corner",
        "MR 4810",
        "MR 4810 Lounge Corner",
        "A sectional arrangement for open living spaces.",
        "sectional",
        3020,
        1860,
        4,
        image("musterring_3d_configurator"),
        574000,
        false
    ],
    [
        "p4",
        "mr-6060-reading-chair",
        "MR 6060",
        "MR 6060 Reading Chair",
        "An armchair with high back support and tailored fabric options.",
        "armchair",
        920,
        940,
        1,
        image("musterring_room_visualization"),
        189000,
        true
    ],
    [
        "p5",
        "mr-3200-soft-island",
        "MR 3200",
        "MR 3200 Soft Island",
        "Deep relaxed seating with configurable lounge modules.",
        "sectional",
        2860,
        1680,
        4,
        image("musterring_homepage"),
        512000,
        false
    ],
    [
        "p6",
        "mr-2205-city-loveseat",
        "MR 2205",
        "MR 2205 City Loveseat",
        "A two-seat compact sofa for studies and smaller rooms.",
        "sofa",
        1760,
        880,
        2,
        image("musterring_intelligent_search"),
        249000,
        true
    ],
    [
        "p7",
        "mr-7300-relax-armchair",
        "MR 7300",
        "MR 7300 Relax Armchair",
        "Electric relax comfort in a calm architectural silhouette.",
        "armchair",
        980,
        990,
        1,
        image("musterring_will_it_fit"),
        264000,
        false
    ],
    [
        "p8",
        "mr-4110-family-sofa",
        "MR 4110",
        "MR 4110 Family Sofa",
        "Easy-care family sofa with broad material compatibility.",
        "sofa",
        2620,
        1020,
        4,
        image("musterring_product_comparison"),
        386000,
        false
    ],
    [
        "p9",
        "mr-1980-atelier-sofa",
        "MR 1980",
        "MR 1980 Atelier Sofa",
        "Low-profile editorial sofa for curated rooms.",
        "sofa",
        2420,
        960,
        3,
        image("musterring_visual_search_results"),
        337000,
        true
    ],
    [
        "p10",
        "mr-5150-high-seat-sofa",
        "MR 5150",
        "MR 5150 High Seat Sofa",
        "Higher seat geometry for easier standing and balanced support.",
        "sofa",
        2320,
        930,
        3,
        image("musterring_my_project_hub"),
        359000,
        true
    ],
    [
        "p11",
        "mr-6600-chaise-module",
        "MR 6600",
        "MR 6600 Chaise Module",
        "Flexible chaise-led modular system for room planning.",
        "sectional",
        2740,
        1620,
        3,
        image("musterring_room_visualization"),
        472000,
        false
    ],
    [
        "p12",
        "mr-2440-tailored-chair",
        "MR 2440",
        "MR 2440 Tailored Chair",
        "A compact accent chair for complete-the-room planning.",
        "armchair",
        820,
        860,
        1,
        image("musterring_dealer_finder_handover"),
        142000,
        true
    ]
].map(([id, slug, modelCode, name, subtitle, category, widthMm, depthMm, numberOfSeats, img, indicativePriceCents, small])=>({
        ...base,
        id,
        slug,
        modelCode,
        name,
        subtitle,
        category,
        widthMm,
        depthMm,
        numberOfSeats,
        imageAssets: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$musterring$2d$assets$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["productImages"])(id) ?? [
            img
        ],
        indicativePriceCents,
        smallSpaceSuitable: Boolean(small),
        modular: category !== "armchair"
    }));
const conceptProductsById = new Map(conceptProducts.map((product)=>[
        product.id,
        product
    ]));
const sofaTemplates = conceptProducts.filter((product)=>product.category !== "armchair");
const armchairTemplates = conceptProducts.filter((product)=>product.category === "armchair");
// Only MR 260 currently has a locally available, authorized catalogue image
// that verifies the red presentation. Other programmes may support additional
// covers in production, but they must not be claimed here until PIM/DAM data
// provides a validated colour variant.
const verifiedRedUpholstery = new Set([
    "mr-260"
]);
const catalogueDimensionOverrides = {
    // Dimensions correspond to the specific catalogue variants used by the Room Composer cutouts.
    // MR 260 three-seat sofa, fixed standard version with adjustable head cushions.
    "mr-260": {
        widthMm: 2320,
        depthMm: 960,
        heightMm: 1070
    },
    // MR 270 three-seat sofa shown as the straight reference configuration.
    "mr-270": {
        widthMm: 2500,
        depthMm: 1070,
        heightMm: 870
    },
    // PM100 corner configuration: approx. 232 x 268 cm, maximum back height 88 cm.
    "justb-pm100": {
        widthMm: 2680,
        depthMm: 2320,
        heightMm: 880
    },
    // Armchair dimensions match the specific catalogue cutouts used in the composer.
    "mr-kleo": {
        widthMm: 970,
        depthMm: 880,
        heightMm: 950
    },
    "mr-nils": {
        widthMm: 700,
        depthMm: 870,
        heightMm: 1120
    },
    "mr-pamela": {
        widthMm: 930,
        depthMm: 1190,
        heightMm: 610
    },
    "mr-281": {
        widthMm: 780,
        depthMm: 880,
        heightMm: 1100
    },
    "mr-9445": {
        widthMm: 670,
        depthMm: 870,
        heightMm: 800
    },
    // Storage dimensions match the pictured JANA and KANTO sideboard variants.
    "jana": {
        widthMm: 2560,
        depthMm: 530,
        heightMm: 770
    },
    "kanto": {
        widthMm: 2100,
        depthMm: 490,
        heightMm: 940
    },
    "justb-ct100": {
        widthMm: 600,
        depthMm: 600,
        heightMm: 360
    },
    "nara": {
        widthMm: 890,
        depthMm: 780,
        heightMm: 440
    }
};
const catalogueSearchOverrides = {
    "justb-pm100": {
        colors: [
            "beige",
            "cream",
            "ivory"
        ],
        styles: [
            "modern",
            "minimal",
            "modular"
        ],
        functions: [
            "modular"
        ],
        modular: true
    },
    "justb-pm200": {
        colors: [
            "beige",
            "cream",
            "sand"
        ],
        styles: [
            "modern",
            "soft modern",
            "modular"
        ],
        functions: [
            "modular",
            "relax"
        ],
        modular: true
    },
    "mr-lucia": {
        colors: [
            "light grey",
            "grey",
            "cream"
        ],
        styles: [
            "soft modern",
            "casual",
            "minimal"
        ],
        functions: [
            "modular"
        ],
        modular: true
    },
    "mr-230": {
        colors: [
            "light grey",
            "grey",
            "beige"
        ],
        styles: [
            "modern",
            "comfort"
        ],
        functions: [
            "relax"
        ],
        modular: false
    },
    "mr-260": {
        colors: [
            "light grey",
            "grey",
            "beige",
            "red",
            "burgundy"
        ],
        styles: [
            "modern",
            "family"
        ],
        functions: [
            "modular",
            "relax"
        ],
        modular: true
    },
    "mr-270": {
        colors: [
            "yellow",
            "mustard",
            "cognac"
        ],
        styles: [
            "modern",
            "contemporary"
        ],
        functions: [
            "relax"
        ],
        modular: false
    },
    "mr-280": {
        colors: [
            "beige",
            "taupe",
            "cream"
        ],
        styles: [
            "classic modern",
            "comfort"
        ],
        functions: [
            "relax"
        ],
        modular: false
    },
    "mr-285": {
        colors: [
            "black",
            "charcoal"
        ],
        styles: [
            "modern",
            "minimal"
        ],
        functions: [
            "relax"
        ],
        modular: false
    },
    "mr-nils": {
        colors: [
            "taupe",
            "beige"
        ],
        styles: [
            "modern",
            "ergonomic"
        ],
        functions: [
            "relax",
            "swivel"
        ],
        modular: false
    },
    "mr-pamela": {
        colors: [
            "cream",
            "ivory",
            "beige"
        ],
        styles: [
            "soft modern",
            "lounge"
        ],
        functions: [
            "relax"
        ],
        modular: false
    },
    "mr-231": {
        colors: [
            "light grey",
            "grey"
        ],
        styles: [
            "modern",
            "ergonomic"
        ],
        functions: [
            "relax",
            "swivel"
        ],
        modular: false
    },
    "jana": {
        colors: [
            "charcoal",
            "brown",
            "oak"
        ],
        styles: [
            "modern",
            "industrial",
            "wood"
        ],
        functions: [
            "storage"
        ],
        modular: false
    },
    "kanto": {
        colors: [
            "brown",
            "oak",
            "natural"
        ],
        styles: [
            "natural",
            "modern",
            "wood"
        ],
        functions: [
            "storage"
        ],
        modular: false
    },
    "justb-ct100": {
        colors: [
            "natural oak",
            "black oak"
        ],
        styles: [
            "modern",
            "minimal",
            "wood"
        ],
        functions: [],
        modular: false
    },
    "nara": {
        colors: [
            "dark stone",
            "natural oak",
            "knotty oak"
        ],
        styles: [
            "modern",
            "minimal",
            "metal",
            "wood"
        ],
        functions: [],
        modular: false
    }
};
const products = [
    ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generated$2f$musterring$2d$catalog$2e$json__$28$json$29$__["default"].products.map((official, index)=>{
        const category = official.category;
        const chairLike = category === "armchair" || category === "dining-chair";
        const templates = chairLike ? armchairTemplates : sofaTemplates;
        const template = conceptProductsById.get(official.appProductId) ?? templates[index % templates.length];
        const searchableCopy = `${official.tagline} ${official.description}`.toLowerCase();
        const isSeating = [
            "sofa",
            "armchair",
            "sectional"
        ].includes(category);
        const isStorage = [
            "storage",
            "wardrobe",
            "bedroom-series",
            "bathroom",
            "kitchen"
        ].includes(category);
        const searchOverride = catalogueSearchOverrides[official.slug] ?? {};
        const dimensionOverride = catalogueDimensionOverrides[official.slug];
        return {
            ...template,
            id: official.appProductId,
            slug: official.slug,
            modelCode: official.modelCode,
            name: official.name,
            subtitle: official.tagline,
            description: official.description,
            category,
            imageAssets: official.images,
            sourceUrl: official.sourceUrl,
            authorizedContent: true,
            specificationNote: "Dimensions, configuration options, availability and prices are confirmed by an authorized Musterring retailer.",
            active: true,
            demoData: false,
            widthMm: dimensionOverride?.widthMm ?? (isStorage ? 3000 : template.widthMm),
            depthMm: dimensionOverride?.depthMm ?? (isStorage ? 450 : template.depthMm),
            heightMm: dimensionOverride?.heightMm ?? (isStorage ? 2050 : template.heightMm),
            seatHeightMm: isSeating ? template.seatHeightMm : 0,
            seatDepthMm: isSeating ? template.seatDepthMm : 0,
            numberOfSeats: isSeating ? template.numberOfSeats : 0,
            materials: isSeating ? template.materials : [],
            colors: !isSeating ? template.colors : isStorage ? template.colors : [
                ...new Set([
                    ...template.colors,
                    ...verifiedRedUpholstery.has(official.slug) ? [
                        "red",
                        "burgundy"
                    ] : []
                ])
            ],
            functions: isStorage ? [
                "storage",
                "modular"
            ] : isSeating ? template.functions : [],
            electricFunctions: isSeating ? template.electricFunctions : [],
            armrestOptions: isSeating ? template.armrestOptions : [],
            feetOptions: isSeating ? template.feetOptions : [],
            comfortOptions: isSeating ? template.comfortOptions : [],
            collection: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$catalog$2d$taxonomy$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["categoryDetails"][category]?.room ?? "Musterring",
            modular: isStorage || isSeating && /modular|module|configur|system|programme|flexib/.test(searchableCopy),
            smallSpaceSuitable: /compact|small|little floor space|any living room/.test(searchableCopy),
            ...searchOverride
        };
    }),
    ...conceptProducts.filter((product)=>!__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generated$2f$musterring$2d$catalog$2e$json__$28$json$29$__["default"].products.some((official)=>official.appProductId === product.id)).map((product)=>({
            ...product,
            active: false
        }))
];
const dealers = [
    [
        "d1",
        "Musterring Partner Hannover",
        "Hannover",
        "30159",
        "Georgstrasse 12",
        4.2
    ],
    [
        "d2",
        "Musterring Studio Berlin",
        "Berlin",
        "10115",
        "Invalidenstrasse 48",
        7.8
    ],
    [
        "d3",
        "Wohnforum Hamburg",
        "Hamburg",
        "20095",
        "Ballindamm 5",
        12.1
    ],
    [
        "d4",
        "Musterring Partner Koeln",
        "Koeln",
        "50667",
        "Breite Strasse 21",
        18.4
    ],
    [
        "d5",
        "Einrichtungshaus Stuttgart",
        "Stuttgart",
        "70173",
        "Koenigstrasse 33",
        21.7
    ],
    [
        "d6",
        "Musterring Partner Muenchen",
        "Muenchen",
        "80331",
        "Sendlinger Strasse 8",
        26.5
    ],
    [
        "d7",
        "Designhaus Bremen",
        "Bremen",
        "28195",
        "Obernstrasse 40",
        31.2
    ],
    [
        "d8",
        "Musterring Partner Leipzig",
        "Leipzig",
        "04109",
        "Grimmaische Strasse 17",
        36.9
    ]
].map(([id, name, city, postcode, address, distanceKm])=>({
        id,
        name,
        city,
        postcode,
        address,
        distanceKm,
        openingHours: "Mo-Sa 10:00-18:00",
        languages: [
            "Deutsch",
            "English"
        ],
        services: [
            "Request a Quote",
            "Book a Consultation",
            "Check Showroom Availability",
            "Request a Technical Fit Check"
        ],
        categories: [
            "sofa",
            "armchair",
            "sectional",
            "storage"
        ],
        displayProductIds: [
            "p1",
            "p2",
            "p4",
            "p10"
        ],
        demoData: true
    }));
const roomScenes = [
    {
        id: "scene-1",
        name: "Natural Living Room",
        image: "/stitch-assets/original/room-living-clean.jpg",
        productIds: [
            "p2",
            "p4",
            "p12"
        ],
        demoData: true
    },
    {
        id: "scene-2",
        name: "City Contrast Lounge",
        image: "/musterring-catalog/mr-2875/image-01.jpg",
        productIds: [
            "p8",
            "p11"
        ],
        demoData: true
    },
    {
        id: "scene-3",
        name: "Soft Modular Retreat",
        image: "/musterring-catalog/mr-1370/image-01.jpg",
        productIds: [
            "p1",
            "p7"
        ],
        demoData: true
    }
];
const projects = [
    {
        id: "project-living",
        name: "Living Room Project",
        status: "Configuration in Progress",
        coverImage: image("musterring_my_project_hub"),
        savedProductIds: [
            "p1",
            "p4"
        ],
        savedConfigurationIds: [],
        savedComparisonIds: [],
        notes: "Prefers beige easy-care fabrics.",
        updatedAt: new Date().toISOString(),
        demoData: true
    },
    {
        id: "project-apartment",
        name: "Small Apartment",
        status: "Ideas Saved",
        coverImage: image("musterring_intelligent_search"),
        savedProductIds: [
            "p2",
            "p6"
        ],
        savedConfigurationIds: [],
        savedComparisonIds: [],
        notes: "Maximum width 240 cm.",
        updatedAt: new Date().toISOString(),
        demoData: true
    },
    {
        id: "project-family",
        name: "Family Lounge",
        status: "Ready for Consultation",
        coverImage: image("musterring_product_comparison"),
        savedProductIds: [
            "p8",
            "p11"
        ],
        savedConfigurationIds: [],
        savedComparisonIds: [],
        notes: "Pet-friendly material required.",
        updatedAt: new Date().toISOString(),
        demoData: true
    }
];
const disclaimer = "Official Musterring product names, editorial descriptions and imagery are imported from the authorized source pages. Planning dimensions, configurations, prices and retailer availability remain illustrative until connected to validated Musterring PIM and retailer data.";
}),
"[project]/lib/search.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-route] (ecmascript)");
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].filter((product)=>product.active && productMatches(product, filters));
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].filter((product)=>product.active).filter((product)=>productMatches(product, {
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
"[project]/lib/ai/assistant-schemas.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
;
const alternativeRequestSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    sourceProductId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    requestText: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().max(1000).optional(),
    maxWidthMm: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().positive().optional(),
    minSeatHeightMm: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().nonnegative().optional(),
    maxIndicativePrice: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().nonnegative().optional(),
    requiredFunctions: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(20).optional(),
    excludedFunctions: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(20).optional(),
    materialTags: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(20).optional(),
    preserveStyle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    preserveComfort: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    strict: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional()
});
const alternativeMatchSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    productId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    exact: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    differences: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    benefits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    tradeOffs: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    unmetRequirements: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    explanation: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const alternativeResponseSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    sourceProductId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    exactMatches: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(alternativeMatchSchema),
    closestAlternatives: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(alternativeMatchSchema),
    message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const materialNeedsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    children: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    pets: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    highUse: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    strongSunlight: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    easyCareRequired: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    preferredColors: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    preferredMaterialGroups: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    avoidMaterialGroups: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional()
});
const materialAdviceSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    needs: materialNeedsSchema,
    recommendedMaterialIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    materialsToAvoid: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    explanationKeys: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string())
});
const voiceIntentSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
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
const voiceCommandSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    intent: voiceIntentSchema,
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown()),
    requiresConfirmation: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean()
});
const advisorActionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
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
    label: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown()),
    requiresConfirmation: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean()
});
const advisorAnswerSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    answer: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(3000),
    answerType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
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
    productIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(12),
    materialIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(12),
    sources: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(12),
    proposedAction: advisorActionSchema.nullable(),
    suggestedQuestions: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(4)
});
const conversationContextSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    route: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500),
    currentProductId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().nullable().optional(),
    referencedProductIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(20).default([]),
    selectedProjectId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().nullable().optional(),
    selectedConfigurationId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().nullable().optional(),
    selectedMaterialIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(20).default([]),
    currentFilters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown()).default({}),
    approvedPreferences: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown()).default({})
});
const conversationRecommendationSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    productIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(12),
    rationale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(1200)
});
const conversationSummarySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    summary: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(3000)
});
}),
"[project]/lib/configurator.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createConfiguration",
    ()=>createConfiguration,
    "priceConfiguration",
    ()=>priceConfiguration,
    "validateConfiguration",
    ()=>validateConfiguration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-route] (ecmascript)");
;
function createConfiguration(product) {
    return {
        id: `CFG-${product.modelCode.replace(/\W/g, "")}-2027`,
        productId: product.id,
        modules: product.category === "armchair" ? [
            "chair"
        ] : [
            "left seat",
            "right seat"
        ],
        armrest: product.armrestOptions[0],
        feet: product.feetOptions[0],
        seatHeightMm: product.seatHeightMm,
        materialId: product.materials[0],
        color: product.colors[0],
        relax: false,
        electric: false,
        dimensions: {
            widthMm: product.widthMm,
            depthMm: product.depthMm,
            heightMm: product.heightMm
        },
        indicativePriceCents: product.indicativePriceCents,
        updatedAt: new Date().toISOString()
    };
}
function validateConfiguration(configuration) {
    const product = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].find((item)=>item.id === configuration.productId);
    const issues = [];
    if (!product) return {
        valid: false,
        issues: [
            "Unknown product."
        ],
        alternatives: []
    };
    if (configuration.modules.length > 5) issues.push("Maximum module count is five in demo mode.");
    if (configuration.electric && !configuration.modules.some((module)=>/power/.test(module))) issues.push("Electric function requires a power module.");
    if (configuration.modules.includes("corner") && (!configuration.modules.includes("left seat") || !configuration.modules.includes("right seat"))) issues.push("Corner layouts require both left and right seat modules.");
    if (configuration.armrest === "Wide lounge" && product.category === "armchair") issues.push("Wide lounge armrests are unavailable for armchairs.");
    if (configuration.seatHeightMm > 480 && configuration.feet === "Hidden glide") issues.push("Hidden glide feet are restricted to standard seat heights.");
    return {
        valid: issues.length === 0,
        issues,
        alternatives: [
            "Choose the Chaise layout for electric power",
            "Use Slim armrests",
            "Use Black metal feet at raised seat height"
        ]
    };
}
function priceConfiguration(configuration) {
    const product = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].find((item)=>item.id === configuration.productId);
    if (!product) return configuration.indicativePriceCents;
    return product.indicativePriceCents + configuration.modules.length * 18000 + (configuration.relax ? 42000 : 0) + (configuration.electric ? 76000 : 0);
}
}),
"[project]/lib/assistant.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$configurator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/configurator.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$search$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/search.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai/assistant-schemas.ts [app-route] (ecmascript)");
;
;
;
;
const colors = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$search$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["searchColorTerms"];
function requestedAlternative(input, source) {
    const text = input.requestText?.toLowerCase() ?? "";
    const narrower = text.match(/(\d{1,3})\s*cm\s*narrower/);
    const under = text.match(/(?:under|below|maximum|max)\s*(\d{2,3})\s*cm/);
    const price = text.match(/(?:under|below|maximum|max)\s*[€]?\s*(\d{3,5})/);
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["alternativeRequestSchema"].parse({
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
    const compatible = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["materials"].filter((material)=>product.materials.includes(material.id));
    if (tag === "easy-care") return compatible.some((material)=>material.easyCare);
    if (tag === "family") return compatible.some((material)=>material.familyFriendly);
    if (tag === "pet") return compatible.some((material)=>material.petFriendly);
    return compatible.some((material)=>material.type === tag || material.name.toLowerCase().includes(tag.toLowerCase()));
}
function findGroundedAlternatives(raw) {
    const source = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].find((product)=>product.id === raw.sourceProductId && product.active);
    if (!source) throw new Error("Unknown source Product ID.");
    const request = requestedAlternative(raw, source);
    const candidates = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].filter((product)=>product.active && product.id !== source.id && product.category === source.category);
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["alternativeResponseSchema"].parse({
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
    const scored = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["materials"].map((material)=>{
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["materialAdviceSchema"].parse({
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
    const searchFilters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$search$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseSearchQuery"])(transcript);
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["voiceCommandSchema"].parse({
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
    const active = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].filter((product)=>product.active).map((product)=>product.id));
    return [
        ...new Set(ids)
    ].filter((id)=>active.has(id));
}
const productDiscoveryPattern = /\b(sofa|couch|armchair|chair|recliner|sectional|table|storage|cabinet|sideboard|wardrobe|bed|bathroom|outdoor|garden|carpet|rug|lamp|furniture)\b/;
function supportsMaterialType(product, type) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["materials"].some((material)=>product.materials.includes(material.id) && material.type === type);
}
function productDiscoveryAnswer(question) {
    const text = question.toLowerCase();
    const filters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$search$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseSearchQuery"])(question);
    const discoveryLanguage = /\b(i want|i need|show me|find|search|looking for|recommend|suggest|do you have|available)\b/.test(text);
    const namedProduct = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].find((product)=>product.active && (text.includes(product.modelCode.toLowerCase()) || text.includes(product.name.toLowerCase())));
    if (!filters.category && !filters.modelCode && !namedProduct && !(discoveryLanguage && productDiscoveryPattern.test(text))) return null;
    const requestedMaterial = /\bleather\b/.test(text) ? "leather" : /\b(fabric|textile|boucle|chenille|velvet)\b/.test(text) ? "fabric" : null;
    const wantsEasyCare = /easy[- ]care|easy to clean|pflegeleicht|family|familie|children|kinder|kids?|pets?|dog|hund|cat|katze/.test(text);
    const hardFilters = {
        ...filters,
        q: undefined
    };
    const exactCandidates = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].filter((product)=>product.active && (!namedProduct || product.id === namedProduct.id) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$search$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["productMatches"])(product, hardFilters) && (!requestedMaterial || supportsMaterialType(product, requestedMaterial)) && (!wantsEasyCare || product.materials.some((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["materials"].find((material)=>material.id === id)?.easyCare)));
    const rankOrder = new Map((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$search$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["searchProductsRanked"])(question, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].length).map((match, index)=>[
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
        const comparisonAlternatives = wantsComparison && exactIds.length < 2 ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].filter((product)=>product.active && product.category === exact[0].category && !exactIds.includes(product.id)).sort((left, right)=>(rankOrder.get(left.id) ?? 9999) - (rankOrder.get(right.id) ?? 9999)).slice(0, 2) : [];
        const ids = [
            ...exactIds,
            ...comparisonAlternatives.map((product)=>product.id)
        ];
        const comparisonNote = comparisonAlternatives.length ? ` ${exactIds.length === 1 ? "One product is an exact match" : `${exactIds.length} products are exact matches`}; the additional products are clearly labelled comparison alternatives and may not satisfy every filter.` : "";
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
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
    const sameCategory = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].filter((product)=>product.active && (!filters.category || product.category === filters.category));
    const alternatives = sameCategory.map((product)=>{
        let score = rankOrder.has(product.id) ? Math.max(0, 30 - (rankOrder.get(product.id) ?? 30)) : 0;
        if (filters.colors?.length && filters.colors.some((color)=>product.colors.includes(color))) score += 20;
        if (filters.maxWidthMm && product.widthMm <= filters.maxWidthMm) score += 15;
        if (filters.modular && product.modular) score += 12;
        if (filters.smallSpaceSuitable && product.smallSpaceSuitable) score += 12;
        if (filters.relaxFunction && product.functions.includes("relax")) score += 12;
        if (filters.electricFunctions && product.electricFunctions.length) score += 12;
        if (requestedMaterial && supportsMaterialType(product, requestedMaterial)) score += 10;
        if (wantsEasyCare && product.materials.some((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["materials"].find((material)=>material.id === id)?.easyCare)) score += 10;
        return {
            product,
            score
        };
    }).sort((left, right)=>right.score - left.score || left.product.modelCode.localeCompare(right.product.modelCode)).slice(0, 4).map(({ product })=>product);
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
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
    const current = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].find((product)=>product.modelCode === code) ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].find((product)=>product.id === context.currentProductId);
    const ordinal = /\b(first|1st)\b/.test(text) ? 0 : /\b(second|2nd)\b/.test(text) ? 1 : /\b(third|3rd)\b/.test(text) ? 2 : null;
    if (ordinal !== null && referenced[ordinal]) {
        const product = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].find((item)=>item.id === referenced[ordinal]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
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
        const product = current ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].find((item)=>item.id === referenced[0]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
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
        const selected = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].filter((product)=>referenced.includes(product.id));
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
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
        const recordedMaterials = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["materials"].filter((material)=>current.materials.includes(material.id));
        const facts = /price|cost/.test(text) ? `No confirmed price for ${current.modelCode} is available in the connected catalogue data.` : /colou?r/.test(text) ? `${current.modelCode} has these recorded colour families: ${current.colors.join(", ") || "none recorded"}.` : /material/.test(text) ? `${current.modelCode} has these validated material options: ${recordedMaterials.map((material)=>material.name).join(", ") || "none recorded"}.` : /electric|relax|function/.test(text) ? `${current.modelCode} has these recorded functions: ${[
            ...current.functions,
            ...current.electricFunctions
        ].join(", ") || "none recorded"}.` : `${current.modelCode} is recorded at ${current.widthMm / 10} cm wide, ${current.depthMm / 10} cm deep and ${current.heightMm / 10} cm high, with a ${current.seatHeightMm / 10} cm seat height. ${current.modular ? "It is marked modular." : "It is not marked modular."}`;
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$configurator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateConfiguration"])(configuration);
}
}),
"[project]/lib/ai/providers.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LocalDemoAIProvider",
    ()=>LocalDemoAIProvider,
    "OpenAIProvider",
    ()=>OpenAIProvider,
    "configuredProvider",
    ()=>configuredProvider,
    "withDemoFallback",
    ()=>withDemoFallback
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/client.mjs [app-route] (ecmascript) <export OpenAI as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$helpers$2f$zod$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/openai/helpers/zod.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai/schemas.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$search$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/search.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai/assistant-schemas.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$assistant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/assistant.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
function emptyIntent(queryText) {
    return {
        queryText,
        category: null,
        colorFamilies: null,
        materials: null,
        maxWidthMm: null,
        minSeatHeightMm: null,
        maxSeatDepthMm: null,
        numberOfSeats: null,
        modular: null,
        functions: null,
        styles: null,
        roomType: null,
        smallSpaceSuitable: null
    };
}
class LocalDemoAIProvider {
    name = "demo";
    async parseSearchIntent(query) {
        const filters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$search$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseSearchQuery"])(query);
        const text = query.toLowerCase();
        const extraColor = text.match(/\b(purple|blue|yellow|orange|pink|black|white)\b/)?.[1];
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["searchIntentSchema"].parse({
            ...emptyIntent(query.trim()),
            category: filters.category ?? null,
            colorFamilies: filters.colors ?? (extraColor ? [
                extraColor
            ] : null),
            materials: filters.materials ?? (/leather/.test(text) ? [
                "leather"
            ] : /fabric|easy-care/.test(text) ? [
                "fabric"
            ] : null),
            maxWidthMm: filters.maxWidthMm ?? null,
            minSeatHeightMm: /high[- ]seat|tall person|gro(?:ÃŸ|ß|ss)e person|easy.{0,8}(stand|rise)/.test(text) ? 470 : null,
            maxSeatDepthMm: /upright/.test(text) ? 560 : null,
            numberOfSeats: filters.seatCount ?? (text.match(/\bfour[- ]seat/) ? 4 : null),
            modular: filters.modular ?? null,
            functions: [
                ...filters.relaxFunction ? [
                    "relax"
                ] : [],
                ...filters.electricFunctions ? [
                    "electric"
                ] : [],
                .../easy[- ]care|pflegeleicht|family|familie|kinder/.test(text) ? [
                    "easy-care"
                ] : []
            ].filter(Boolean).length ? [
                ...filters.relaxFunction ? [
                    "relax"
                ] : [],
                ...filters.electricFunctions ? [
                    "electric"
                ] : [],
                .../easy[- ]care|pflegeleicht|family|familie|kinder/.test(text) ? [
                    "easy-care"
                ] : []
            ] : null,
            styles: /modern heritage/.test(text) ? [
                "modern heritage"
            ] : /modern|minimal|contemporary/.test(text) ? [
                "modern"
            ] : null,
            roomType: /apartment|wohnung/.test(text) ? "small apartment" : /family|familie/.test(text) ? "family living room" : null,
            smallSpaceSuitable: filters.smallSpaceSuitable ?? null
        });
    }
    async analyzeProductImage(imageDataUrl) {
        const fingerprint = imageFingerprint(imageDataUrl);
        const palettes = [
            [
                "beige",
                "sand"
            ],
            [
                "charcoal",
                "grey"
            ],
            [
                "brown",
                "cognac"
            ],
            [
                "cream",
                "ivory"
            ],
            [
                "green",
                "natural"
            ]
        ];
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["visualTagsSchema"].parse({
            category: fingerprint % 5 === 0 ? "armchair" : "sofa",
            colorFamilies: palettes[fingerprint % palettes.length],
            likelyMaterial: fingerprint % 3 === 0 ? "leather" : "fabric",
            style: fingerprint % 2 ? [
                "modern heritage",
                "minimal"
            ] : [
                "contemporary",
                "soft modern"
            ],
            silhouette: fingerprint % 5 === 0 ? "compact upright silhouette" : "wide low horizontal silhouette",
            notableVisualFeatures: [
                "defined arm profile",
                fingerprint % 2 ? "soft tailored upholstery" : "clean geometric seams"
            ]
        });
    }
    async analyzeRoomImage(imageDataUrl) {
        const fingerprint = imageFingerprint(imageDataUrl);
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["roomAnalysisSchema"].parse({
            roomType: fingerprint % 4 === 0 ? "open-plan living and dining room" : "living room",
            visibleFloorRegion: "central floor area visible; boundaries are approximate",
            approximateWallAreas: [
                "main wall behind seating",
                "partial side wall"
            ],
            windows: fingerprint % 3 ? [
                "one likely window on the brighter side"
            ] : [],
            doors: [
                "one possible doorway; please confirm"
            ],
            existingMajorFurniture: [
                "sofa or large seating",
                "low table"
            ],
            dominantColors: fingerprint % 2 ? [
                "warm neutral",
                "beige",
                "wood"
            ] : [
                "cool neutral",
                "grey",
                "white"
            ],
            styleTags: [
                "modern",
                "calm",
                "residential"
            ],
            lightingDescription: fingerprint % 2 ? "soft natural side light" : "balanced ambient light"
        });
    }
    async suggestConfigurationRequirements(request) {
        const intent = await this.parseSearchIntent(request);
        const text = request.toLowerCase();
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["configurationRequirementsSchema"].parse({
            customerRequest: request,
            category: intent.category && [
                "sofa",
                "armchair",
                "sectional"
            ].includes(intent.category) ? intent.category : null,
            colorFamily: intent.colorFamilies?.[0] ?? null,
            materialType: /leather/.test(text) ? "leather" : /fabric|easy[- ]care/.test(text) ? "fabric" : null,
            easyCare: /easy[- ]care|pflegeleicht|dog|pet|family|familie|children|kinder/.test(text),
            maxWidthMm: intent.maxWidthMm,
            numberOfSeats: intent.numberOfSeats,
            modular: intent.modular,
            relaxFunction: /relax|reclin/.test(text),
            electricFunction: /electric|motor|power/.test(text),
            comfort: /firm/.test(text) ? "firm" : /soft/.test(text) ? "soft" : null,
            posture: /upright/.test(text) ? "upright" : /relaxed|lounge/.test(text) ? "relaxed" : null
        });
    }
    async explainProductMatch(input) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["matchExplanationSchema"].parse({
            explanation: `Grounded match for “${input.request.slice(0, 100)}”: ${input.productFacts}`
        }).explanation;
    }
    async summarizeRetailerProject(project, groundedFacts) {
        const warnings = project.fitWarnings.length ? ` Fit warnings: ${project.fitWarnings.join("; ")}.` : " No fit validation has been claimed.";
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["retailerSummarySchema"].parse({
            summary: `Customer intent: ${project.customerIntent || "Consultation requested"}. ${groundedFacts}.${warnings} Requested retailer action: ${project.requestedRetailerAction}.`
        }).summary;
    }
    async recommendComplementaryProducts(input) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["complementaryRecommendationSchema"].parse({
            categories: [
                "armchair",
                "storage"
            ],
            colorFamilies: /charcoal|grey/.test(input.selectedFacts) ? [
                "grey",
                "charcoal"
            ] : [
                "beige",
                "taupe",
                "stone"
            ],
            styles: [
                "modern heritage"
            ],
            rationale: "Complements the selected catalogue pieces by category, palette and shared style."
        });
    }
    async findProductAlternatives(input) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$assistant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["findGroundedAlternatives"])(input);
    }
    async adviseMaterials(input) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$assistant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseMaterialNeeds"])(input.requestText);
    }
    async parseVoiceCommand(transcript) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$assistant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseVoiceCommandDeterministic"])(transcript);
    }
    async answerProductQuestion(input) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$assistant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["answerGroundedQuestion"])(input.question, input.context);
    }
    async recommendProductsFromConversation(input) {
        const groundedIds = input.candidateProductIds.filter((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].some((product)=>product.active && product.id === id)).slice(0, 6);
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["conversationRecommendationSchema"].parse({
            productIds: groundedIds,
            rationale: "Recommendations are limited to the supplied active catalogue candidates."
        });
    }
    async suggestNextQuestion(input) {
        return input.route.includes("configurator") ? [
            "Explain why an option is unavailable",
            "Suggest a compatible material",
            "Reduce the total width"
        ] : [
            "Find a smaller alternative",
            "Which material is easier to care for?",
            "Prepare my project for a retailer"
        ];
    }
    async summarizeConversationForProject(input) {
        const groundedIds = input.referencedProductIds.filter((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].some((product)=>product.id === id));
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["conversationSummarySchema"].parse({
            summary: `Referenced Product IDs: ${groundedIds.join(", ") || "none"}. Approved preferences: ${JSON.stringify(input.preferences)}.`
        }).summary;
    }
    async summarizeConversationForRetailer(input) {
        const groundedIds = input.referencedProductIds.filter((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].some((product)=>product.id === id));
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["conversationSummarySchema"].parse({
            summary: `Retailer preparation references Product IDs ${groundedIds.join(", ") || "none"}. Approved preferences: ${JSON.stringify(input.preferences)}. Unresolved questions: ${input.unresolvedQuestions.join("; ") || "none recorded"}.`
        }).summary;
    }
}
function imageFingerprint(dataUrl) {
    let value = 17;
    const sample = dataUrl.slice(-4096);
    for(let index = 0; index < sample.length; index += 17)value = value * 31 + sample.charCodeAt(index) >>> 0;
    return value;
}
class OpenAIProvider {
    name = "openai";
    client;
    model;
    imageModel;
    constructor(apiKey){
        this.client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
            apiKey
        });
        this.model = process.env.AI_MODEL || "gpt-5.6";
        this.imageModel = process.env.AI_IMAGE_MODEL || this.model;
    }
    async parse(schema, name, system, input, image = false) {
        const response = await this.client.responses.parse({
            model: image ? this.imageModel : this.model,
            input,
            text: {
                format: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$helpers$2f$zod$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["zodTextFormat"])(schema, name)
            }
        });
        return schema.parse(response.output_parsed);
    }
    parseSearchIntent(query) {
        return this.parse(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["searchIntentSchema"], "search_intent", "Extract furniture search requirements. Do not add facts not present. Use null for unknown fields.", [
            {
                role: "system",
                content: "Extract furniture search requirements. Do not add facts not present. Use null for unknown fields."
            },
            {
                role: "user",
                content: query
            }
        ]);
    }
    analyzeProductImage(imageDataUrl) {
        return this.parse(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["visualTagsSchema"], "product_visual_tags", "Analyze only the target furniture object. Describe visible traits; do not name products.", [
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: "Analyze the furniture object into visual search tags. Do not identify or invent a product."
                    },
                    {
                        type: "input_image",
                        image_url: imageDataUrl,
                        detail: "low"
                    }
                ]
            }
        ], true);
    }
    analyzeRoomImage(imageDataUrl) {
        return this.parse(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["roomAnalysisSchema"], "room_analysis", "Describe visible room features. Dimensions and boundaries are approximate and must not be presented as measurements.", [
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: "Analyze visible room features. Treat geometry as approximate."
                    },
                    {
                        type: "input_image",
                        image_url: imageDataUrl,
                        detail: "low"
                    }
                ]
            }
        ], true);
    }
    suggestConfigurationRequirements(request) {
        return this.parse(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["configurationRequirementsSchema"], "configuration_requirements", "Extract requirements only. Never select modules, validate compatibility, calculate dimensions or prices.", [
            {
                role: "user",
                content: request
            }
        ]);
    }
    async explainProductMatch(input) {
        const result = await this.parse(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["matchExplanationSchema"], "match_explanation", "Explain the match using only the provided catalogue facts. Never add dimensions, prices, availability or IDs.", [
            {
                role: "user",
                content: `Request: ${input.request}\nValidated catalogue facts: ${input.productFacts}`
            }
        ]);
        return result.explanation;
    }
    async summarizeRetailerProject(project, groundedFacts) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["retailerProjectDataSchema"].parse(project);
        const result = await this.parse(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["retailerSummarySchema"], "retailer_project_summary", "Write a concise consultation summary using only supplied structured data and grounded facts. Do not infer fit, price, availability or delivery feasibility.", [
            {
                role: "user",
                content: `Structured project: ${JSON.stringify(project)}\nGrounded catalogue facts: ${groundedFacts}`
            }
        ]);
        return result.summary;
    }
    recommendComplementaryProducts(input) {
        return this.parse(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["complementaryRecommendationSchema"], "complementary_requirements", "Suggest complementary search criteria only. Never create product names or IDs.", [
            {
                role: "user",
                content: input.selectedFacts
            }
        ]);
    }
    async findProductAlternatives(input) {
        const parsed = await this.parse(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["alternativeRequestSchema"], "alternative_requirements", "Extract only alternative-product constraints from the supplied request. Preserve the supplied sourceProductId. Do not invent product facts or IDs.", [
            {
                role: "user",
                content: JSON.stringify(input)
            }
        ]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["alternativeResponseSchema"].parse((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$assistant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["findGroundedAlternatives"])(parsed));
    }
    async adviseMaterials(input) {
        const facts = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["materials"].map((material)=>({
                id: material.id,
                type: material.type,
                color: material.colorFamily,
                durability: material.durability,
                easyCare: material.easyCare,
                petFriendly: material.petFriendly,
                familyFriendly: material.familyFriendly,
                lightSensitivity: material.lightSensitivity
            }));
        const result = await this.parse(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["materialAdviceSchema"], "material_advice", "Recommend only supplied material IDs. Use only supplied metadata. Never claim stain-proof, scratch-proof, allergy-safe or indestructible.", [
            {
                role: "user",
                content: `Household request: ${input.requestText}\nMaterial metadata: ${JSON.stringify(facts)}`
            }
        ]);
        const validIds = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["materials"].map((material)=>material.id));
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["materialAdviceSchema"].parse({
            ...result,
            recommendedMaterialIds: result.recommendedMaterialIds.filter((id)=>validIds.has(id)),
            materialsToAvoid: result.materialsToAvoid.filter((id)=>validIds.has(id))
        });
    }
    parseVoiceCommand(transcript) {
        return this.parse(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["voiceCommandSchema"], "voice_command", "Map the transcript to one allowed website intent. State-changing or booking actions require confirmation. Never execute an action.", [
            {
                role: "user",
                content: transcript
            }
        ]);
    }
    async answerProductQuestion(input) {
        const grounded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$assistant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["answerGroundedQuestion"])(input.question, input.context);
        if (grounded.answerType !== "missing-data" || grounded.productIds.length || grounded.sources.length) return grounded;
        const candidateIds = [
            ...new Set([
                ...input.context.referencedProductIds ?? [],
                ...input.context.currentProductId ? [
                    input.context.currentProductId
                ] : []
            ])
        ];
        const facts = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].filter((product)=>candidateIds.includes(product.id)).map((product)=>({
                id: product.id,
                modelCode: product.modelCode,
                name: product.name,
                category: product.category,
                widthMm: product.widthMm,
                depthMm: product.depthMm,
                heightMm: product.heightMm,
                seatHeightMm: product.seatHeightMm,
                seatDepthMm: product.seatDepthMm,
                numberOfSeats: product.numberOfSeats,
                colors: product.colors,
                materials: product.materials,
                styles: product.styles,
                functions: product.functions,
                electricFunctions: product.electricFunctions,
                modular: product.modular,
                demoData: product.demoData
            }));
        const result = await this.parse(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["advisorAnswerSchema"], "product_advisor_answer", "Answer only from supplied Musterring facts and context. Unknown information must be stated as unavailable. Propose but never execute actions.", [
            {
                role: "user",
                content: `Question: ${input.question}\nContext: ${JSON.stringify(input.context)}\nFacts: ${JSON.stringify(facts)}`
            }
        ]);
        const validProducts = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].map((product)=>product.id));
        const validMaterials = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["materials"].map((material)=>material.id));
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["advisorAnswerSchema"].parse({
            ...result,
            productIds: result.productIds.filter((id)=>validProducts.has(id)),
            materialIds: result.materialIds.filter((id)=>validMaterials.has(id))
        });
    }
    async recommendProductsFromConversation(input) {
        const candidates = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].filter((product)=>input.candidateProductIds.includes(product.id)).map((product)=>({
                id: product.id,
                name: product.name,
                widthMm: product.widthMm,
                seatHeightMm: product.seatHeightMm
            }));
        const result = await this.parse(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["conversationRecommendationSchema"], "conversation_product_recommendations", "Choose only IDs from the supplied candidates. Do not add product facts.", [
            {
                role: "user",
                content: `Summary: ${input.conversationSummary}\nCandidates: ${JSON.stringify(candidates)}`
            }
        ]);
        const valid = new Set(candidates.map((candidate)=>candidate.id));
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["conversationRecommendationSchema"].parse({
            ...result,
            productIds: result.productIds.filter((id)=>valid.has(id))
        });
    }
    async suggestNextQuestion(input) {
        const schema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            questions: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(4)
        });
        const result = await this.parse(schema, "next_questions", "Suggest concise Musterring product-journey follow-up questions only.", [
            {
                role: "user",
                content: `Route: ${input.route}\nAnswer: ${input.answer}`
            }
        ]);
        return result.questions;
    }
    async summarizeConversationForProject(input) {
        const validIds = input.referencedProductIds.filter((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].some((product)=>product.id === id));
        const result = await this.parse(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["conversationSummarySchema"], "project_conversation_summary", "Summarize only supplied Product IDs and approved preferences. Do not infer facts.", [
            {
                role: "user",
                content: JSON.stringify({
                    ...input,
                    referencedProductIds: validIds
                })
            }
        ]);
        return result.summary;
    }
    async summarizeConversationForRetailer(input) {
        const validIds = input.referencedProductIds.filter((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].some((product)=>product.id === id));
        const result = await this.parse(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["conversationSummarySchema"], "retailer_conversation_summary", "Prepare but do not submit a retailer summary using only supplied IDs, preferences and unresolved questions.", [
            {
                role: "user",
                content: JSON.stringify({
                    ...input,
                    referencedProductIds: validIds
                })
            }
        ]);
        return result.summary;
    }
}
function configuredProvider() {
    const enabled = process.env.AI_ENABLED !== "false";
    const wantsOpenAI = (process.env.AI_PROVIDER || "demo").toLowerCase() === "openai";
    return enabled && wantsOpenAI && process.env.OPENAI_API_KEY ? new OpenAIProvider(process.env.OPENAI_API_KEY) : new LocalDemoAIProvider();
}
async function withDemoFallback(operation) {
    const provider = configuredProvider();
    try {
        return {
            data: await operation(provider),
            provider: provider.name,
            fallback: false
        };
    } catch  {
        const demo = new LocalDemoAIProvider();
        return {
            data: await operation(demo),
            provider: "demo",
            fallback: true
        };
    }
}
}),
"[project]/lib/ai/retrieval.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LocalSemanticRetrievalProvider",
    ()=>LocalSemanticRetrievalProvider,
    "hybridCatalogueSearch",
    ()=>hybridCatalogueSearch,
    "searchCatalogueByVisualTags",
    ()=>searchCatalogueByVisualTags
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-route] (ecmascript)");
;
class LocalSemanticRetrievalProvider {
    async rank(query, candidates) {
        const terms = [
            ...new Set(query.toLowerCase().split(/[^a-z0-9]+/).filter((term)=>term.length > 2))
        ];
        return candidates.map((product)=>{
            const text = [
                product.modelCode,
                product.name,
                product.subtitle,
                product.description,
                product.category,
                ...product.colors,
                ...product.styles,
                ...product.functions
            ].join(" ").toLowerCase();
            const overlap = terms.filter((term)=>text.includes(term)).length;
            const trigrams = new Set(Array.from({
                length: Math.max(0, query.length - 2)
            }, (_, index)=>query.toLowerCase().slice(index, index + 3)));
            const candidateTrigrams = new Set(Array.from({
                length: Math.max(0, text.length - 2)
            }, (_, index)=>text.slice(index, index + 3)));
            const semantic = [
                ...trigrams
            ].filter((gram)=>candidateTrigrams.has(gram)).length / Math.max(1, trigrams.size);
            return {
                id: product.id,
                score: overlap * 8 + semantic * 25
            };
        }).sort((left, right)=>right.score - left.score);
    }
}
function productFacts(product) {
    const materialFacts = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["materials"].filter((material)=>product.materials.includes(material.id));
    return {
        product,
        materialFacts
    };
}
function structuredScore(product, intent) {
    let score = 0;
    const reasons = [];
    if (intent.category) {
        if (product.category !== intent.category) return {
            score: -1000,
            reasons
        };
        score += 25;
        reasons.push(`requested ${intent.category}`);
    }
    if (intent.colorFamilies?.length) {
        if (intent.colorFamilies.some((color)=>product.colors.includes(color.toLowerCase()))) {
            score += 25;
            reasons.push(`requested colour family: ${intent.colorFamilies.join(", ")}`);
        } else score -= 35;
    }
    if (intent.maxWidthMm) {
        if (product.widthMm <= intent.maxWidthMm) {
            score += 18;
            reasons.push(`width ${product.widthMm} mm is within the limit`);
        } else score -= 60;
    }
    if (intent.minSeatHeightMm) {
        if (product.seatHeightMm >= intent.minSeatHeightMm) {
            score += 15;
            reasons.push(`seat height ${product.seatHeightMm} mm meets the preference`);
        } else score -= 25;
    }
    if (intent.maxSeatDepthMm) {
        if (product.seatDepthMm <= intent.maxSeatDepthMm) score += 10;
        else score -= 15;
    }
    if (intent.numberOfSeats) {
        if (product.numberOfSeats === intent.numberOfSeats) {
            score += 12;
            reasons.push(`${product.numberOfSeats} seats`);
        } else score -= 8;
    }
    if (intent.modular) {
        if (product.modular) {
            score += 15;
            reasons.push("modular catalogue flag");
        } else score -= 25;
    }
    if (intent.smallSpaceSuitable) {
        if (product.smallSpaceSuitable) {
            score += 15;
            reasons.push("small-space suitable catalogue flag");
        } else score -= 20;
    }
    if (intent.functions?.includes("relax")) {
        if (product.functions.includes("relax")) {
            score += 15;
            reasons.push("relax function");
        } else score -= 20;
    }
    if (intent.functions?.includes("electric")) {
        if (product.electricFunctions.length) {
            score += 15;
            reasons.push("electric function option");
        } else score -= 20;
    }
    if (intent.functions?.includes("easy-care")) {
        const easy = productFacts(product).materialFacts.some((material)=>material.easyCare);
        if (easy) {
            score += 12;
            reasons.push("easy-care material option");
        }
    }
    if (intent.materials?.length) {
        const facts = productFacts(product).materialFacts;
        const materialMatch = intent.materials.some((requested)=>facts.some((material)=>material.id === requested || material.type === requested.toLowerCase() || material.name.toLowerCase().includes(requested.toLowerCase())));
        if (materialMatch) {
            score += 12;
            reasons.push(`requested ${intent.materials.join(", ")} material`);
        } else score -= 20;
    }
    if (intent.styles?.length) {
        const styleMatch = intent.styles.some((requested)=>product.styles.some((style)=>style.includes(requested.toLowerCase()) || requested.toLowerCase().includes(style)));
        if (styleMatch) {
            score += 10;
            reasons.push("requested style");
        } else score -= 8;
    }
    return {
        score,
        reasons
    };
}
async function hybridCatalogueSearch(intent, semantic = new LocalSemanticRetrievalProvider()) {
    const active = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].filter((product)=>product.active);
    const code = intent.queryText.match(/\bMR\s*-?\s*\d{3,4}\b/i)?.[0].replace(/[\s-]+/g, " ").toUpperCase();
    const semanticScores = new Map((await semantic.rank(intent.queryText, active)).map((item)=>[
            item.id,
            item.score
        ]));
    const ranked = active.map((product)=>{
        const structured = structuredScore(product, intent);
        const exactCode = code === product.modelCode;
        return {
            product,
            score: structured.score + (semanticScores.get(product.id) ?? 0) + (exactCode ? 200 : 0),
            reasons: exactCode ? [
                `exact product code ${product.modelCode}`,
                ...structured.reasons
            ] : structured.reasons
        };
    }).sort((left, right)=>right.score - left.score || left.product.modelCode.localeCompare(right.product.modelCode));
    const requestedColors = intent.colorFamilies?.map((color)=>color.toLowerCase()) ?? [];
    const exactColorAvailable = !requestedColors.length || active.some((product)=>(!intent.category || product.category === intent.category) && requestedColors.some((color)=>product.colors.includes(color)));
    const exactMatches = ranked.filter(({ product, score })=>score > -100 && (!intent.category || product.category === intent.category) && (!requestedColors.length || requestedColors.some((color)=>product.colors.includes(color))) && (!intent.maxWidthMm || product.widthMm <= intent.maxWidthMm) && (!intent.minSeatHeightMm || product.seatHeightMm >= intent.minSeatHeightMm) && (!intent.modular || product.modular) && (!intent.smallSpaceSuitable || product.smallSpaceSuitable) && (!intent.functions?.includes("relax") || product.functions.includes("relax")) && (!intent.functions?.includes("electric") || product.electricFunctions.length > 0) && (!intent.functions?.includes("easy-care") || productFacts(product).materialFacts.some((material)=>material.easyCare)) && (!intent.numberOfSeats || product.numberOfSeats === intent.numberOfSeats) && (!intent.materials?.length || intent.materials.some((requested)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["materials"].some((material)=>product.materials.includes(material.id) && (material.id === requested || material.type === requested.toLowerCase() || material.name.toLowerCase().includes(requested.toLowerCase())))))).slice(0, 12);
    const exactIds = new Set(exactMatches.map(({ product })=>product.id));
    const isRelevantAlternative = (product)=>{
        const checks = [];
        if (requestedColors.length) checks.push(requestedColors.some((color)=>product.colors.includes(color)));
        if (intent.maxWidthMm) checks.push(product.widthMm <= intent.maxWidthMm);
        if (intent.minSeatHeightMm) checks.push(product.seatHeightMm >= intent.minSeatHeightMm);
        if (intent.maxSeatDepthMm) checks.push(product.seatDepthMm <= intent.maxSeatDepthMm);
        if (intent.numberOfSeats) checks.push(product.numberOfSeats === intent.numberOfSeats);
        if (intent.modular) checks.push(product.modular);
        if (intent.smallSpaceSuitable) checks.push(product.smallSpaceSuitable);
        if (intent.functions?.includes("relax")) checks.push(product.functions.includes("relax"));
        if (intent.functions?.includes("electric")) checks.push(product.electricFunctions.length > 0);
        if (intent.functions?.includes("easy-care")) checks.push(productFacts(product).materialFacts.some((material)=>material.easyCare));
        if (intent.materials?.length) {
            checks.push(intent.materials.some((requested)=>productFacts(product).materialFacts.some((material)=>material.id === requested || material.type === requested.toLowerCase() || material.name.toLowerCase().includes(requested.toLowerCase()))));
        }
        if (!checks.length) return true;
        const requiredMatches = Math.max(0, checks.length - 1);
        return checks.filter(Boolean).length >= requiredMatches;
    };
    const closeAlternatives = ranked.filter(({ product })=>!exactIds.has(product.id) && (!intent.category || product.category === intent.category) && // Preserve an explicitly requested colour whenever the catalogue has that
        // colour in the requested category. A request such as "red sofa" must not
        // be followed by a wall of beige and grey sofas. Wrong-colour alternatives
        // are useful only when the requested colour is unavailable altogether.
        (!requestedColors.length || !exactColorAvailable || requestedColors.some((color)=>product.colors.includes(color))) && isRelevantAlternative(product)).slice(0, 6).map((match)=>({
            ...match,
            reasons: requestedColors.length && !requestedColors.some((color)=>match.product.colors.includes(color)) ? [
                `not available in requested ${requestedColors.join(", ")}`,
                ...match.reasons
            ] : match.reasons
        }));
    return {
        exactMatches,
        closeAlternatives,
        exactColorAvailable
    };
}
function searchCatalogueByVisualTags(tags) {
    const active = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].filter((product)=>product.active);
    return active.map((product)=>{
        let score = 0;
        const reasons = [];
        if (tags.category && product.category === tags.category) {
            score += 35;
            reasons.push("same furniture category");
        }
        const colors = tags.colorFamilies.filter((color)=>product.colors.includes(color.toLowerCase()));
        if (colors.length) {
            score += 30;
            reasons.push(`similar ${colors.join(", ")} colour family`);
        }
        const styles = tags.style.filter((style)=>product.styles.some((candidate)=>candidate.includes(style) || style.includes(candidate)));
        if (styles.length) {
            score += 20;
            reasons.push("related style");
        }
        if (tags.likelyMaterial) {
            const hasMaterial = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["materials"].some((material)=>product.materials.includes(material.id) && material.type === tags.likelyMaterial);
            if (hasMaterial) {
                score += 15;
                reasons.push(`offers ${tags.likelyMaterial}`);
            }
        }
        return {
            product,
            score,
            reasons
        };
    }).filter((match)=>!tags.category || match.product.category === tags.category).sort((left, right)=>right.score - left.score).slice(0, 12);
}
}),
"[project]/app/api/ai/image/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai/schemas.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$providers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai/providers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$retrieval$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai/retrieval.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$musterring$2d$assets$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/musterring-assets.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
const visualCategories = new Set([
    "sofa",
    "armchair",
    "storage"
]);
let catalogueHashes = null;
function sha256(buffer) {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])("sha256").update(buffer).digest("hex");
}
function loadCatalogueHashes() {
    if (catalogueHashes) return catalogueHashes;
    catalogueHashes = (async ()=>{
        const hashes = new Map();
        await Promise.all(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].filter((product)=>product.active).flatMap((product)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$musterring$2d$assets$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["productImages"])(product.id).map(async (imagePath)=>{
                if (!imagePath.startsWith("/")) return;
                try {
                    const bytes = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readFile"])(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), "public", imagePath.slice(1)));
                    hashes.set(sha256(bytes), product);
                } catch  {}
            })));
        return hashes;
    })();
    return catalogueHashes;
}
async function exactCatalogueProduct(buffer) {
    return (await loadCatalogueHashes()).get(sha256(buffer)) ?? null;
}
function toDataUrl(file, buffer) {
    return `data:${file.type};base64,${Buffer.from(buffer).toString("base64")}`;
}
function withTimeout(promise, timeoutMs) {
    return new Promise((resolve, reject)=>{
        const timer = setTimeout(()=>reject(new Error("Visual provider timed out.")), timeoutMs);
        promise.then((value)=>{
            clearTimeout(timer);
            resolve(value);
        }, (error)=>{
            clearTimeout(timer);
            reject(error);
        });
    });
}
async function POST(request) {
    const form = await request.formData().catch(()=>null);
    const file = form?.get("image");
    const consent = form?.get("consent") === "true";
    const preferredCategory = String(form?.get("preferredCategory") ?? "");
    if (!(file instanceof File)) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Image is required."
    }, {
        status: 400
    });
    const validated = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["imageUploadSchema"].safeParse({
        type: file.type,
        size: file.size,
        consent
    });
    if (!validated.success) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Consent and a JPG, PNG or WebP image up to 10 MB are required."
    }, {
        status: 400
    });
    const buffer = Buffer.from(await file.arrayBuffer());
    const exactProduct = await exactCatalogueProduct(buffer);
    const dataUrl = toDataUrl(file, buffer);
    const analysis = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$providers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withDemoFallback"])((provider)=>withTimeout(provider.analyzeProductImage(dataUrl), 8000));
    const exactMaterial = exactProduct ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["materials"].find((material)=>exactProduct.materials.includes(material.id)) : null;
    const tags = exactProduct ? {
        category: visualCategories.has(exactProduct.category) ? exactProduct.category : null,
        colorFamilies: exactProduct.colors.slice(0, 3),
        likelyMaterial: exactMaterial?.type ?? null,
        style: exactProduct.styles.slice(0, 3),
        silhouette: exactProduct.category === "armchair" ? "compact upright silhouette" : "wide horizontal silhouette",
        notableVisualFeatures: [
            "exact catalogue image fingerprint"
        ]
    } : {
        ...analysis.data,
        category: analysis.provider === "demo" && visualCategories.has(preferredCategory) ? preferredCategory : analysis.data.category
    };
    const visualMatches = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$retrieval$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["searchCatalogueByVisualTags"])(tags).filter(({ product })=>product.id !== exactProduct?.id);
    const matches = exactProduct ? [
        {
            product: exactProduct,
            score: 100,
            reasons: [
                "identical catalogue image"
            ]
        },
        ...visualMatches
    ] : visualMatches;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        tags,
        matches: matches.map(({ product, score, reasons })=>({
                product,
                reasons,
                label: score >= 100 ? "Exact Catalogue Image" : score >= 80 ? "Excellent Visual Match" : score >= 65 ? "Strong Match" : score >= 50 ? "Similar Shape" : score >= 30 ? "Similar Material" : "Related Style"
            })),
        ai: {
            provider: analysis.provider,
            fallback: analysis.fallback,
            mode: exactProduct ? "Exact catalogue image match" : analysis.provider === "openai" ? "Provider-backed AI" : "Deterministic demo AI"
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__49fdd243._.js.map