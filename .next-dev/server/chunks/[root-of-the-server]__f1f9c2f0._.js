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
"[project]/lib/generated/visual-image-hashes.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("{\"b29999074c29dca65cb039f9cbbadd4c6abe986649321091cbc527a602b58bbd\":\"musterring-justb-pm100\",\"6cdcd4e66e0de395467075a28c5078c895a6f4a0801fc83ae41b4a90df1a2fa7\":\"musterring-justb-pm100\",\"f5e3720904814c11fc6a6845079c5bd795611734b1bbe9fca8ff9804949ff1b8\":\"musterring-justb-pm100\",\"b1c6eed68cc24529b0afffc407b4169311af70f6d925dc3217299a773ca6524b\":\"musterring-justb-pm100\",\"8c1fbbffa51192ecd3c22bac4ed10c32b21c0773ccca07f665a9502eb7cc6208\":\"musterring-justb-pm100\",\"18afebbd9f64bc29a08fbbbb85fbae3754d7d69b024457a9ca167f7f7aaaa7ae\":\"musterring-justb-pm100\",\"f545cdf1c14c9302e735d0cfe831a91ed67eb5802de2355ce4a6598b4e49b845\":\"musterring-justb-pm100\",\"a2f48663723b2a003de77dbb394a5c6557c9977250381ba8dac0f7b158c27288\":\"musterring-justb-pm100\",\"9436835dfee07504e623dea00ef678a116fd5933dd652928c635a43e7821279b\":\"musterring-justb-pm200\",\"b3d5062a665413ba2ddbc42ec53082b277ad6e3d33265f7018594742c8d13963\":\"musterring-justb-pm200\",\"712680dd22df4e3dea3ce0a699c34952e27f5843f7166f9fe4cf049648531a0f\":\"musterring-justb-pm200\",\"a9ef6bc02b12fab276c0419c9ef09be62484bb037f5eb38696a331a2e4f36617\":\"musterring-justb-pm200\",\"3516bfa02d6b04e12122cc0b6ebd417a32c3736915395b218a14ff028cc890e6\":\"musterring-justb-pm200\",\"ab497a6e475934fcd85873aa2085fdd164705fda637ab1b15a87d343e24249e1\":\"musterring-justb-pm200\",\"7a116fd92f49cdc205a34af398c88f37fd0cda99e9258d0cb0aa4281c728de2e\":\"musterring-justb-pm200\",\"f7ac4f34822a8a6f5fc05c4d7c3727ece37e4399b7e15f6811695d3425a1c7c7\":\"musterring-justb-pm200\",\"715029fe0ae3ad07e9858b45523b5e123803e3a40613dcd4310ca2709d4cb6b8\":\"musterring-mr-kleo\",\"a046d59eeb69e5ec23c2bb0985af8767e503c3b080b9be6ef88eb9df4f39e060\":\"musterring-mr-kleo\",\"9bec37e46f6e284c36914634bf39a1d3ce1bed3f98e15302b236b4ac3ed1efc2\":\"musterring-mr-alena\",\"caa3c53562f57a6301338375e47ee79c26489b82934cc26f29ea804a73267119\":\"musterring-mr-lia\",\"30e8867a20ee920fdd191041fd84cae0ac36f7856a8aed4d8ca7b1643babb55b\":\"musterring-mr-lucia\",\"aecc7f805917b1678f7b73ae72132e77f781a0d3054413f9bf61873e5e8b7fc6\":\"musterring-mr-lucia\",\"4a48286fa07e2457fcdcdaa2649f1eb32a6d9cbbeb70a9d4793c3907c8a1e69b\":\"musterring-mr-lucia\",\"cd05a27dd4d25b6ca3ef6ddd57314054273ba1008e0fdf61baee1a890be04fd7\":\"musterring-mr-lucia\",\"9ba891d0d52f9ac713bdc68ead3d85f9a32f5686233d275b8dc9910a9a29523a\":\"musterring-mr-lucia\",\"8365dd32bf0b12bf3a6e1beed141ac32affc5c05d5332080ad419944c2714149\":\"musterring-mr-lucia\",\"3b226b45a05639bd63e926365c909148942b62d69bd60e62e182dc2dea3aa7b1\":\"musterring-mr-lucia\",\"9b29f42258c363022a97cfaa509e8fe909c6de63e8dee6b5db306bf9801ca003\":\"musterring-mr-lucia\",\"2175d74208b43be00976f7fad3b15c732c2e1542796c84574cea1f9022c58da7\":\"musterring-mr-nils\",\"8e31c80ead2e564762f79572f3405cd1b07c59ff969fbd8bc216ffc9b6b92c5a\":\"musterring-mr-pamela\",\"b02ac70865c9ede71e3de0dd605e98ebeb4961c3bdc70989e7ff585fd7eb61bb\":\"musterring-mr-pamela\",\"1c15bfc555f71c9b5f5d63565404ff77fcb4bb697605a1a8dc5bb5c3b1bf8c90\":\"musterring-mr-pamela\",\"28085cf676358217b293a420a77245d143a68aea495216f51f2abe92e619aacc\":\"musterring-mr-pamela\",\"56e613ec1f63296806b97d94c4a44865ffd2e1d9dd5a89c005a06e3dda491924\":\"musterring-mr-pamela\",\"7fac1dd6454aa1c7989cece350744e469067a1dc8f612ffeb9765b4084d65c62\":\"musterring-translate-to-en-match-it\",\"a7152fab775f6448e46f083f595b9994b8b4c826029efe546e8408e3dd8aa5fb\":\"musterring-translate-to-en-match-it\",\"400d015f810c11d21f620485df74fbd0371a4841bde7835c0f73f125640fec22\":\"musterring-translate-to-en-match-it\",\"a9d9a53b670c92ead6a1343f7378f661e3081d90bef9fbd727f312cbcda8d0cf\":\"musterring-translate-to-en-match-it\",\"e54edb69acef3a03bc879cb6f8c142a11ab3a8d14161cd11dcf612d1d82330af\":\"musterring-translate-to-en-match-it\",\"169d58d69ca9df18e74ebd9f87a2789e30da66cf79723eefb2941f43008bfbc9\":\"musterring-translate-to-en-match-it\",\"8bf4c48180f802582c8d263b15bd62ba4d62071ec97c4c3c319e40c31915d155\":\"musterring-translate-to-en-match-it\",\"6ad00f7bb0aadc81133b8f9d137187abf928f9060952ca34af8891ccc5227a44\":\"musterring-translate-to-en-match-it\",\"728d1c60d4edc9a1ef28cd331446ee7e7c0275af9d4eb5778428fa3266433244\":\"musterring-mr-230\",\"25c467488a336aa971eaea4d78a9b50c7418098d7e96ba78b8842dccd8cad65d\":\"musterring-mr-230\",\"fcbef8c0b7674344d2d7fd1446a369a2a163916df6194b43d09ec61ca5ba0dae\":\"musterring-mr-230\",\"34446dbe7ce21214778819e762992db1e08bc0d2a507f20148ea2eead5d84012\":\"musterring-mr-230\",\"cc28259848b9bde368f582f94bd52428b216966871be52cc0a65af08d89545a2\":\"musterring-mr-230\",\"8289112dc60efb1aeb7b581d89feb0f9235239a2a726c014bf3fde5fa5622ac5\":\"musterring-mr-231\",\"4b6a5a52b49438c9c8e95e840fa93a66c71728d6aa4ad405d135383411687185\":\"musterring-mr-231\",\"0ed4f273c16344bda9d5217edc53c4630bee2735a93226ce9eedcea3501ebeb5\":\"musterring-mr-231\",\"5deb1f22d250d359cca06a7ab2c3be7f88abead22dd2c88cd2e9425fab678486\":\"musterring-mr-231\",\"62c7c907ce2767fb7a60c998cd9ae84591b0fd9e9b72ea8d828a340a618359eb\":\"musterring-mr-231\",\"afe1ee5a81ab44faea4ec88945d3ea32002dad418a50963841fef06335748e42\":\"musterring-mr-231\",\"4c869554f7bb200d026daae37cb593b1e0714dcb02cd0399ae64963e47b54e4f\":\"musterring-mr-260\",\"57bd0bcf956ff09b4a8aeba28e8b7ae84a0eb45acf963da1644934757033eeeb\":\"musterring-mr-260\",\"4400def363326735bd460cee9a1da4af810129d87f88288f2329802e6f223235\":\"musterring-mr-260\",\"40590afb140fcab0d2f3665067017a2db04949e3f21e3ffc317e54d369757532\":\"musterring-mr-260\",\"32fe7878d7ab665982b3c6f2ccd8083e7efaa2a3ef13369478003b413cb00857\":\"musterring-mr-260\",\"746fb721ce6aaa8472b22df9f8b94b8e272531756ed0707a538bb50570f3b2c8\":\"musterring-mr-260\",\"501442a83d3ecdb7eff9dfdf4f9f64a36f48a2d2b51a5613f797db29069b2d69\":\"musterring-mr-260\",\"ead009d5285084bc14a4f800a9f34a765d210aa07a2c9f0a7748adce00e2665d\":\"musterring-mr-260\",\"107333525549b3b5589ab86596bd25babb7efed4e8b86400c95ae87cd9a7d642\":\"musterring-mr-261\",\"0577ba3373b19324d5ab7a99c9715d470bc2e4a397d3d088bf6fcf0c13da357e\":\"musterring-mr-261\",\"bbd96c22da5eef18625a1380633048b8eff02403417085d449a174bc07d8ed9e\":\"musterring-mr-261\",\"254309ead2d2b5f08a2b4b0ab7f54544f3536c58afd8b00775bf6bc32d2fc855\":\"musterring-mr-261\",\"9ec2a0874d0f59fa32297c4534e99d648bd69ba2f6329b3a263ea5da5cd72422\":\"musterring-mr-261\",\"0c8baf7fdec1f153943f3f4bb4ca5eee26a270256b2329b0f6ad2a9cba6256d5\":\"musterring-mr-261\",\"75d5362b3beadecf7d37f3036b6e3dfa003f1ebef039c55904fcb04492eb0679\":\"musterring-mr-261\",\"9c542195a96751b47ed2c907de3b5e6e2e08adcd4d168dc45234112e79699d55\":\"musterring-mr-261\",\"2b81cb48d725366f923fe821cfa24bf1a6138956f22667df8585216018be2fcc\":\"p6\",\"12832e19413388572775e676fcd8666fd2aae94df283299d1f6620f8ba34059f\":\"p6\",\"7bcb8d8e70765c546db05fcd78da8d056bfe4c24ccb510496305039a2a1cd879\":\"p6\",\"6f5ac37cd089e87d959391a56f542c8a5bdd92c15180564a2ca8ecdd0e806c72\":\"p6\",\"d28d4ee8ada1d5d8943a77ad354d10deefd305e6189208ba11f627195234d460\":\"p6\",\"44f71e83437299255c6eda6200b09f821ee0a0622bb914c5ba6dce40ce0e8e20\":\"p6\",\"437ba73457ff20f0d910019915e11b1179524453e149e2e06d785bb5946e0517\":\"p6\",\"8f03288ddc976dcdd8fb0c010b986e0da3fcaad9de37fe58b27a25e507383cf6\":\"p6\",\"d7544082c025a12f2f5a3b44ff9e8dffdf7d504c87b9313fafaccdf06b8522af\":\"musterring-mr-276\",\"7b98c172f3f54e4fa6bb1542646545550ff057fab151c01a1e9e2808ecf8b595\":\"musterring-mr-276\",\"0b1f22b61a507f059fd1604ccadcb211fd764dfd7813246141fd328ad50b71fb\":\"musterring-mr-276\",\"4663b97b7bd0e87a5560e87cfa9fc098308609d95121f0088af0a3af72cf99ae\":\"musterring-mr-276\",\"c64b77d28ae07898409eb8eb06d3747b2c06f6d693be9b592cb891416c52a092\":\"musterring-mr-276\",\"8649a4de195dd57bde817506e7b9d290d0508f43c9fcf57c88608f0accebbce9\":\"musterring-mr-276\",\"41aab9013988315da51c9b836b5845b20a4a0de6aa13ef72125a294cb6de22bd\":\"musterring-mr-276\",\"97c91aca2fd03b3775f6423e18b7d09ceeead1c7783bd952b9d282b7800c5838\":\"musterring-mr-276\",\"2db94ffae617d52a1c0557c07c0734fa5c3f94848cdb1fab9d9e6a71e940dcb0\":\"musterring-mr-280\",\"bb50fac2884ca72303fb453788869f095daf1b73639dc9e2680ab0cb68fd3997\":\"musterring-mr-280\",\"46978f4e93c4c60f986b9a15f8509fdc08f2f964f958bb6c129d9ba8c46adf81\":\"musterring-mr-280\",\"6ee266246597e800254668c5ff20b2f664af5768f24b23d7aa62527943629455\":\"musterring-mr-280\",\"55adee1b486c1e007288172cd2441a04bc7d6588ca3f78189a7d1f8ee46e0940\":\"musterring-mr-280\",\"ea84475b7828a7c7be632e255840a00cad69b25d7f3f6fb61dd4eed214b3d204\":\"musterring-mr-280\",\"e1c1974dbf1d2e25514933965904d552656b54c04e245059036c913b99b0c048\":\"musterring-mr-280\",\"d866d44aa01949f78971c79f43101dda922929017316420d751fc0b183596bac\":\"musterring-mr-280\",\"19c5f23909cf314c538d2ac33069a0317e84529bb04f39355a26149fb0281815\":\"musterring-mr-281\",\"8963be7c2f8629e5b3ccee8303d18d19d395210dc4a00ab69ac71e3818dae072\":\"musterring-mr-285\",\"359c23c6b8d17932c2606f366949feb0d0b939af7fba9e09b321206a00160b06\":\"musterring-mr-285\",\"a5cf56468a48a15f5ccc35f0214c53701b3dc2d8cafdd0a4bc8d3c211d133162\":\"musterring-mr-285\",\"57565ed4dd5fe9e1588328107adcd9c0e14b78923eff134323bd2613f583df71\":\"musterring-mr-285\",\"0d28f396238fe5d020a2fa0bdcc44a370ebd08da2a330f2943156f0fa6311c30\":\"musterring-mr-285\",\"fb5776026708d322d2d13b6c10bfcf49dbfbb02f4dd68890c3894d1495a653f4\":\"musterring-mr-290\",\"ab01ecd5ea895e9c51f154457f0cf2ea1aaf76474bbffa7bd271fd492f1360be\":\"musterring-mr-290\",\"507c15e7efbd53a30908dd70a675b4d6e99d2afaaf89323501037377786710e8\":\"musterring-mr-290\",\"31f22630d07cf34cfc3ef5e42ab0513e3b15867e9ff93e08036d6fb55ea33a63\":\"musterring-mr-290\",\"524e80800b0010c0146752ba55523d65fc0ad7ba30b891e4132bf1dae1260d73\":\"musterring-mr-290\",\"354314e62884cd9fe23c58b4467bda0be28570562cbbd38a056d6bdc7c3b1491\":\"musterring-translate-to-en-mr-300\",\"5659ca2839c0eb1d670eba33e3aa462a463b127c002347673cd5edca934d69ab\":\"musterring-translate-to-en-mr-300\",\"96be1302699044454cad3b86fa7d09f94c346335e0c0b136ed2a2c7b4805e9bd\":\"musterring-translate-to-en-mr-300\",\"2d4b35c215d9a7f27212644b27e6f5f7f25dcb78e8ea1b7ae79dcf2fbc9cc2c0\":\"musterring-translate-to-en-mr-300\",\"75c239973ab869e694957e8036c845f6579f91f79e419e47b19813a872fd3469\":\"musterring-translate-to-en-mr-300\",\"aea31401bacc61fb7e931382c813f4f7ec1138ce85adfc2acb4a959405eb9221\":\"musterring-translate-to-en-mr-310\",\"2d88024567e1cff1873bb1c6cad3c04f3415fa139e834b05e00dd35a3141d221\":\"musterring-translate-to-en-mr-310\",\"318eb158f47596bab979694af82d5adcd93f2cddabeebcbcf34de4d59c224f3b\":\"musterring-translate-to-en-mr-310\",\"f20c2323e4842089a2840e188502978a092bde984ee3e354b0afa5c95731f1e9\":\"musterring-translate-to-en-mr-310\",\"0b9ec76c79d9d449eb68aac14c3465a7083db54a671894f0d2f1cdb07c922687\":\"musterring-translate-to-en-mr-310\",\"7b4ac35b75a495a02b50a74cfd80cdf001ca86c6ef9c09ec748ac546d73f45a8\":\"musterring-mr-315\",\"1a17623d051d5071575e7c1169448c5e297f927917b131cb4a5bbeb40d37f230\":\"musterring-mr-315\",\"9c03e9ce9c8b84d05383a03bf22298764b3212e7acf0a1b1ba5b60a9f026d8df\":\"musterring-mr-315\",\"c9ef53be320e307628407fcfdcbfbbe5889d91bf0760525233064002d102aeab\":\"musterring-mr-315\",\"3a5f7b49c42831476ac6dd6eb1bd0b8ced0a6a3b9d0a7b1d41b5e4cfd2341463\":\"musterring-mr-315\",\"1614c978a3dacf58c9cf97e14b9223a88e3d57c7ac2b3dfc257392b09dbc1acf\":\"musterring-mr-315\",\"11bf6bf454021ace22ce98e3c843dc2aea10d4daf1033b5a940e909bdcadc626\":\"musterring-mr-315\",\"4e2d57d216233d9b63e6230217f7fb3815d815b2bd544a426b485eea5043f74d\":\"musterring-mr-315\",\"063068f6cd0ab4a615eff5a3aecd8d5f1b6bc5746614f105c49723c190fa239f\":\"musterring-mr-365\",\"27acd56d18b460785a1d8867457e191594261974809ea253b1dc730cb3df7466\":\"musterring-mr-365\",\"15df538fee7c18bfc95ae87d837a44d106a13e1bdb159a8fd4514284d9444b98\":\"musterring-mr-365\",\"bba73a59c59520d6f067d7aff25c707220995aa09bf046d02d2e3900dddb0342\":\"musterring-mr-365\",\"49f521f533f706f5f8ad04734ef27c76dfefc5e375b131e477f0b170435a461e\":\"musterring-mr-365\",\"1a57553060bd84b9725edf334766c70336af136944b34bca85d37d205b03d78c\":\"musterring-mr-365\",\"be3c4be8d67b3036d07c11d45bfc5def5dd9cb4ef103eb7bf4ce11f39688b380\":\"musterring-mr-365\",\"fd7eb9ee49bf9465efb18702901195a62606d2176350881191aa6d9cbb1b133a\":\"musterring-mr-365\",\"f054ff3b62c1096090d9a5bc26e695ed037c74bae63c44e79bf560eefd9dd47c\":\"musterring-mr-370\",\"b925b925156c05e539c7ec58395e96bdddb5185ebd22799c1303428997ce112b\":\"musterring-mr-370\",\"2a61d0280189750b95a1ae710204f5c4d583de63c86b9d2d2f1ec739389b7fe3\":\"musterring-mr-370\",\"c2572b9d33ab16cf9338336b860e2c6a0d5bb7d8f8f4bcc39bcff6669be99beb\":\"musterring-mr-370\",\"c33b88ddc2d4759e99d2d2e9761c0f6b592fc3a85b13606ba2b4370a3a98e8ac\":\"musterring-mr-370\",\"c36894dc8f74f68f30cdea6d3eb333c975e5f84795944993e234fb37cdc21338\":\"musterring-mr-370\",\"700e5e862f21b27eb1468a07d459f0814d9bf2230b17a9712beded521bdfb476\":\"musterring-mr-370\",\"6fe0f485ac7588adf0a1e442a444b1cf5fd8c6df9ec08796a218018c0dd45d9d\":\"musterring-mr-370\",\"fc34879c17109cb858b5276f767a2d291df61b3e29ec9813798ef682c5641e29\":\"musterring-mr-376\",\"58707f89781483d55680d05409810691b1853dded88b24552438ad0d44d1a6e7\":\"musterring-mr-376\",\"9630bf6351ea366d1ebd5380c5f0c9184e80d1d0f5d725b009900c4426da6897\":\"musterring-mr-376\",\"8adb912dea2707bb901ac9069a262a6e83ddf62df7fe92647679c0cf850cd729\":\"musterring-mr-376\",\"415f238a783440ff2f329917a189ac5b0f177f79287f5e96b51ec66dadc58e05\":\"musterring-mr-385\",\"74a48a0c2b5ce173038d482e8e9d01fbab3114d6f2ab19ec5da3524faf5fdc3b\":\"musterring-mr-385\",\"221b0b8b57bc5af3f5a1c2d8fa4ee26f120f1a275417fbfca9457b9699a5f877\":\"musterring-mr-385\",\"00a8e81f271a35d2a1c3d3f6502ce7c4f3f4c98ea9ede8c7028c648651e43e99\":\"musterring-mr-385\",\"26dacc10e785c5c2dff508514ecb5acd2109d3368be3436491acc9cf7f5f1fac\":\"musterring-mr-385\",\"e14b4c1fbfa053603d483218a874abf4eddbc2d14d5948065377cf48c29efc73\":\"musterring-mr-385\",\"18d238a08b1f09fbb378087d03d6db3bdba9289a78bd324ec575e1fb2af9a236\":\"musterring-mr-385\",\"9998c6bdd281f2cf9adb28dbeefb4bd1c2bfffd4863055739d6ec5673e0a061d\":\"musterring-mr-385\",\"a90dce88ead53421dab5d5cf99dcb99cdeacb7609bd45971b8bbdba78d51fc97\":\"musterring-mr-1320\",\"a21d562202654a059787072c524a273583e29034e3414b48c8dba62c482d9b38\":\"musterring-mr-1320\",\"d27e738f60a8f5ff9142e76fbdf5b26c1297bfcb3f62138f165cf2b8045adb8e\":\"musterring-mr-1320\",\"5fe900b4e6495dc0513fed2168fd82d36b433276d9720fbbf926b09f98ff619a\":\"musterring-mr-1320\",\"7ae8321c5b196b11545a59abbfd1441dbe12a9c1f909ff6eba0e9d30c83e48e3\":\"musterring-mr-1320\",\"4fc14228c24049465db564b858db8170579bdb4626c9e93c62270bf31fddccef\":\"p2\",\"4a7e8b5281593fa0b22fdd6a2f1d845a00126f9ed9fba7025b674b2c649a6daf\":\"p2\",\"3b6953c7adff47ebed1730a8029f6dc13c300880e2c39731d0298d8a3d88c9fe\":\"p2\",\"4ff7f52484e5ca6a0023a15a5efa79e414033ac851ec33bcb53a8f295f7ed942\":\"p2\",\"8ffaf0ef55337d9466742689eefbfc43c128728d7581276f2024a53c78a51c01\":\"musterring-mr-1390\",\"6e93ea2a3465974a1f936a86858454dcfef0b70ce9d217b5aa85953f48e17ea3\":\"musterring-mr-1390\",\"7f76ea98fcef1473ced15695c3f2269b795ca7f6f5a778eb9afbd6e352f0b33c\":\"musterring-mr-1390\",\"41ad525ea288c1e3fdab39e5100767f5c98155c254d4cf765c538bdd7afe997e\":\"musterring-mr-1390\",\"f6faed33c0a24ffca128a3c078b3e7cc056fc7d421efb7a4f80ac516fa99b061\":\"musterring-mr-1390\",\"572b313223370d0bf991310b967f790496ada28718994b10dcc545eaf15bf122\":\"musterring-mr-1390\",\"d8ebf76a894c3991a2c366fabfe4cc6ac1661dc61abb0498748891d14f94592d\":\"musterring-mr-1390\",\"4f3e8ce6b1202bf3dd893f313f7b73734fc1887d8f4f69e6b628043151f0c645\":\"musterring-mr-1390\",\"8932cd2c687ec73d7eb01f9ec3dc01d702ebb610136e839947a2aeba52932cb7\":\"musterring-mr-1391\",\"27a9cebbf156b4358c425756b30f362b5b1ddae685c4ca6e83bdabd8a5603d88\":\"musterring-mr-1391\",\"0f49e51830eca8e105d2e68d70a5bb818625a4e16d3d5ab53f15279da343f32a\":\"musterring-mr-1391\",\"7eb1336b06128d950c68cb3cc1ce1e89a09d750c1fea8a151583eea03a05c4ce\":\"musterring-mr-1391\",\"e469f8dc94df397d0e6e91c111d0b58493dca19e4fd4280f63b968722b535ed1\":\"musterring-mr-2342\",\"254a8e7916b6b54cbef03c24b11a501b85ef2f6c4d04eccd4ad70b286f9265a6\":\"musterring-mr-2342\",\"3eaccb178676fb073f39718b94a9302ca3c88a4e5fd9083c180134a3ba322e9b\":\"musterring-mr-2342\",\"5f3ae5fb2ed24a530a63f9a2ac4d985b7eec25dc69cd252451a221e8c89b2c96\":\"musterring-mr-2342\",\"c3e96aa97e0397ff313573d52515c93bea7b11af968a9a649b2a1ac879d9440b\":\"p4\",\"21672449faa9aeb33c200b8c7dc718a44cbb70a322cd4b44e148da1fdf2c9fce\":\"p4\",\"7ac702705e375b03bf39a2e6d37e9231092e0e0bed5296f326c89be8fa91f9a8\":\"p4\",\"2cd12018f9afe571a318a950741ff6e650258011c661c7d6059448262fc1e4df\":\"p4\",\"b08eea006f3fc0b42697f82eb11a9323180b1f710dec2f42cb04b11409f18a5d\":\"p4\",\"6d8549c26810e5862755a51b4ff588030c4b2672acf962afbe791a398f545eda\":\"p4\",\"912022292dd52d75fb16b94ba5c7bbe1c8074f112f27a80000f4688afacfd63d\":\"p4\",\"af1c16b4e8be82835984b93f2e83af0be9bf361c174e0bd13bd908d190005679\":\"p4\",\"d0b3783fa9de913399361608280994603bd038f5124766f7e818068d448b3bfd\":\"musterring-mr-2665\",\"9760565c0bd6141b9b260447c111b284018258011415084e0f5a0680ed6c5b83\":\"musterring-mr-2795\",\"b4b7c563e33d43b7e9e6e4a385209b1fba1481253121ca1142034fe8f34f233a\":\"musterring-mr-2795\",\"30527a049a006503cd5b56f8c503f8023b4d51803b010382c30f88b1e27d4bbb\":\"musterring-mr-2795\",\"3d035642a1b0fe594ffe28083024379601beb96093aa463021978220581987b4\":\"musterring-mr-2795\",\"66e1d68f308229e9fdc637867f3c6471339663b8df42d02e6046ad181b36df1a\":\"musterring-mr-2795\",\"ef3b5b823e8b9e1c6c848a6f9612b703048a6a06cdd1457087824480be51f6a1\":\"p1\",\"e3c50d387a68433b2e458c926cc7024c7a1bacb5176aa27eaffcd41ef77271a3\":\"p1\",\"c9380e9367a951ec16e991c388bc97ab289d4012367e1393dc4de88b604e48a5\":\"p1\",\"9a05faaf0d692792bac10915f4440ce127c172850a3e6f500f65a1fd71323659\":\"p1\",\"004ef298f7168f486071693d86898bbdd128105857dc56f35b33209d991461c5\":\"p1\",\"c7d919e1b287cdd2b9ca0dc8894ddd4fcd78abfcae30a78fe4ab05a25a35ef08\":\"p1\",\"997d7ff7df3a4541534539571e06a22ddeae276fa753b1e890fd30af467c5eca\":\"p1\",\"b7fd725e8f592fecab9bdf1ee311cc26626d8e65033e096f5f0fbaaaa325c482\":\"p1\",\"b92114ed6d58117ccf425307a169b4c037c31b58165849c7b483b9c6168ae479\":\"musterring-mr-2985\",\"1701544c53c5ad1aeecb4cc04ceb5c428171a23908e52ddb39602d5423a3f46b\":\"musterring-mr-2986\",\"47605ecffd7a61da0db24553d86797f418e467d5837800eae5cd19f5e9e36962\":\"musterring-mr-2995\",\"9f711acfe072b6ba0d938c90a1f54f6a1be3f045e54182d5219c4af090ff3e69\":\"musterring-justb-od100\",\"5309e38ff05cb1e43e7cef0dd152dc6d5f06c78fd200e953f5a535bbd04cb7fa\":\"musterring-mr-2995\",\"a3b458377189aabcdfaf15455671d17d830b22fa6a8f2cf4c1e3600d73eb66c9\":\"musterring-mr-2995\",\"e9c9a4ab4f2c65d6f381f8978f42ee730ed9e40d324604e70828bc2d49ed7ff5\":\"musterring-mr-2995\",\"8652f4f7b3bbedcb3aa22dc4f8494a6574642c2aa6e049b3b63303cad88ec01c\":\"musterring-mr-2995\",\"007490027ffaf09801dc96a6919325017a89f301c13756145c19c81ca285fe5c\":\"musterring-mr-4100\",\"00c4d6554c2daea678fe06e4dafe024b5aefd9cbd71cb4f26a1f3408044f6b59\":\"musterring-mr-4585\",\"e503fafb06c65e5c5deb2bc37d4d70683475650fbe2ab93c1ce963b1add9ee82\":\"musterring-mr-4585\",\"c3a6df5f153df36d20b5e21ec8b50ad079255f04ec9b548192066207e3c3b619\":\"musterring-mr-4585\",\"c28838c569b25ae7b0cc961cdf19b6fd57ce5e3688de8de095cce6ade5825180\":\"musterring-mr-4585\",\"c6b171b9d7f419e93b40a085f5b60df64d6474d06e8af9210cc3ee3eb37a8129\":\"musterring-mr-4585\",\"b9d334418bcc067625856d1a3275478da78cb5fd5d770742746e40f7aba9adae\":\"musterring-mr-4585\",\"0f68a90b051ac1975b2de24e09ca469dc4a4e4f56e82d2dfbd42f9cffa92adc0\":\"musterring-mr-4585\",\"d281d79e652a2c389a2c053bc9825d0e003bbe05bfa0f04724ae77772d343c61\":\"musterring-mr-4585\",\"30b32e92f35a3833d5fec5e1c7d8240ef10425d9f90a2b9887787141e4fd3bf0\":\"musterring-mr-4615\",\"214a1cac336d165556ba24fffac42536251d0118dfd2e5bad77cfa4c8d2a5e56\":\"musterring-mr-4615\",\"18b72bbf3ac2d1adebbeae186c156d3c1f0b6a9b163b9611be5fcb9b872d16f9\":\"musterring-mr-4615\",\"75c95e3bea6627439347108b57923f04f6f497be32df5875cbe2eb065f0fb4b0\":\"musterring-mr-4615\",\"7dfb2b7355cf30e7b09933fd5ea088bc4c7b17150078f597bcb65ae82be3bb32\":\"musterring-mr-4615\",\"28bfe4e91403b0364e9504091bb9775e45526f11cb6c6f1fe4a555c6b2eb5f41\":\"musterring-mr-4820\",\"bc4dc2869b27a54e53801906594fd936d919e6f2b6c68dcc1443d4b6dc2ad5b2\":\"musterring-mr-4820\",\"849fb08aa600c88067059d2e32d9551278293a7d1e8fc553d2e9eda4a0403a2d\":\"musterring-mr-4820\",\"9728644902a3dc92dbdc9a486416c18bfb5104025bbe8fd00f42f28713f63dfc\":\"musterring-mr-4820\",\"fa974a741ae027516d5198af3f670872279752e0c4c0bcffc666c3329d1622a6\":\"musterring-mr-4820\",\"223fb66ad59ed3812703a9ee25b75e940dae830cc75aa55b0c41d47b60c95143\":\"musterring-mr-5100\",\"7fb3a2a5f35f015356b373399a4ab450cf4d3c4b0c8a910c566869f5d6473cc2\":\"musterring-mr-5100\",\"122caf817bd7c43943509b1d3c8a66f22263e9eea06554ba5f25dbc98f97d03d\":\"musterring-mr-5111\",\"ce7a9425154ea95693e7b85779dfc62187aea6fc88e99cc05fb22e83b2587a17\":\"musterring-mr-5111\",\"7034b1b6a269a502b8a2079f534085b85cd6ba3e390ec598f0b7a57b922f70bd\":\"musterring-mr-700\",\"4566f8f6dc683e360736d2360b6fdaa0a2edd0e5023ce17820708c81248d9df4\":\"musterring-mr-700\",\"515ec1cbd4ba9feacf0472ac79bf3d6859f06709b0b2483e0824e98056b75ad3\":\"musterring-mr-700\",\"85b47360a089c1513b3f5321e2ecaa40c1874cf0d162e364bf10361c57542d5b\":\"musterring-mr-700\",\"677a7a71adb41df68e74fac78d6703946b9f0c104445bd6e6f19ea4908309e8e\":\"musterring-mr-700\",\"74f96bdc2595c0e1e47a40070afafe8081bf714b13471c233e9ee605bf836075\":\"musterring-mr-700\",\"efeefb9ad5235b86258e754dc4c0f60a1528ab143342037e4fc8f43b0a256615\":\"musterring-mr-700\",\"e3d21da1605008dc22ee8690f2ff6bf0a21052686a6160a506cbdaa1f078b4bb\":\"musterring-mr-700\",\"44154ebbb183ea6ce83b67162e5e0151a3dde5352153980bccc5eea351d9fb34\":\"musterring-mr-710\",\"40587f99f79a8f8b86c31be567c04269eef499ba6905d6f49582c1a8ef05601c\":\"musterring-mr-710\",\"237febd2171c81bf9acbc66c09dc8000432373214d774869b7da009795a43e6d\":\"musterring-mr-710\",\"d16c8c1561541e372471e6ff23eb747738f5f7615971599114720487cb5ab313\":\"musterring-mr-710\",\"916a097725400fd3af1abcef99e2465ad711266c1558c6d94e33c58c84f1f851\":\"musterring-mr-710\",\"af830112164ac1ca8416f1cda06856c8d7e2ffd4a2bc19bb05f8d8413860643f\":\"musterring-mr-720\",\"024458f22c938b0ea4248eb4c0ea42e4ad4916869f7c440b80c9483b2c194435\":\"musterring-mr-720\",\"b9673f14b4bea6b6d9acd46d84e6b637f03a01d043adb684efc84017d1869475\":\"musterring-mr-6500\",\"c1bb60b9a7987db847067cf64d7655bea4d783594acb5104bcf0a6c35529e2e8\":\"musterring-mr-6500\",\"e1ab08955ee48f16f5f20fbf5a5d066bdca09af4277ba7fc7136d7c66233b1ed\":\"musterring-mr-6500\",\"0c8a015d30561b4daa7519759433642bf0757e59fbcfc6b05e4d1ba7514e46fb\":\"musterring-mr-6500\",\"ee74f5fda28a0addd18e1dae967cf345171c3bcf417298531201505c232f7524\":\"musterring-mr-6500\",\"8c1546edc8969eab51a23b4cef8bcfa204af5639def391bb3d3ba2c424399780\":\"musterring-mr-6510\",\"4958d40f98f4040f5263fd1e5b12796f2b28515140a7db1b0d7702523e375369\":\"musterring-mr-6510\",\"33c03c4293f0768d3aa70c5c2717e50d5de510168bb1565bc3bb895f3fdc9db2\":\"musterring-mr-6510\",\"a24ecfe9c0c2e1215982110adb886953f838774384d438d207bef4cde0bc44e8\":\"musterring-mr-6510\",\"62c43782ed040fa9cb5011a6134ee4a19a1d94414ce41310ab7e047a6059d957\":\"musterring-mr-6510\",\"96ddad58bb539163fb3854b4d2c68e14e9e440b83906798fa126ff3fd1062c91\":\"musterring-mr-6540\",\"1d76caa458a6e6cd142a6335700fd8c5f5203b1aaba764b6923a29ea10f218a1\":\"musterring-mr-6540\",\"9db7651cbfa8bc473a459d2c9ff8d4c7b6103c79e1ae96bd8b2a67b3ec01758b\":\"musterring-mr-6540\",\"1bc648561a64e99d4d6602722174342a0c52eeddb47be5c804fe3606bf7e5746\":\"musterring-mr-6540\",\"16f8cb2622d3b2d5d56f39cfe61040f75318cacd5eebfbceb7931be55b9f4d5c\":\"musterring-mr-6540\",\"5e87f16f45ed9598c62f4ddb2983676f28c8af8fc805934a2457b75524c5b281\":\"musterring-mr-6550\",\"39ce58535c016de5e47f695027647773a938b079eea38f1f0962a3cd6ba11a37\":\"musterring-mr-6550\",\"17f6d2601deabf3719f4359132ed6b8f16174f32f147cd7bd9cf90349e841d5e\":\"musterring-mr-6550\",\"aa3119baa48c945090476df1d138ac9970897c8c40aef1625c17adde286f362f\":\"musterring-mr-6550\",\"e49c214bd7c10bd39425df2098f642c8251e12289f028ca46c8074404312e177\":\"musterring-mr-6550\",\"ec5742d45e1be669bcfa35ed2965c7da61dccd7fb98146303a233bdb959e2584\":\"musterring-mr-9120\",\"81197008ef97aedb516b57aabfbcf956a923d6872b9abd704100a54502fcf585\":\"musterring-mr-9120\",\"6d05aeabd4a3882d640d7a8ffcd1e87688cb8c4f5e8e47b04c19e99d6ee0024b\":\"musterring-mr-9120\",\"4659fdd417ca2bb33c66c422086e2b9279f5021e94e78f407e68448eb84ee9a5\":\"musterring-mr-9120\",\"7f6de3ac1a7e27caf1375cb14d92f68eaca2d30560e813361ef5f47ab9a5c629\":\"musterring-mr-9120\",\"4a963772b870ec161f82b757bb6adc5fa6cf3c8ac9a08496000606217e276824\":\"musterring-mr-9120\",\"03bf777dfa3c88ac106021ed0cbef7838f0ab585a66192964be0a15a5ead4395\":\"musterring-mr-9120\",\"466dc491dfeb6b82b4197fa8c14b08792f91a5f694dceeb0c343632c331c26c4\":\"musterring-mr-9120\",\"ee0a9d04bab34250b3dc35715a474d297b757a9d9ea44a0ceccb943399802d11\":\"musterring-deluxe-collection\",\"914180dbec5cfe2f047946c5f7c6f2c908c5bb476ac2ee76fd7345ada97bc860\":\"p3\",\"9fd204b98b9ba090c649d374f43d6b02accd0904fcb80b75ad9dacff3775eca5\":\"p3\",\"3bb22643611c016cbdaa85414ef1fe7d36aaec0d0bc61d3e43a0850e517a1f8f\":\"p3\",\"36ae388070677673cf57fe4e3f4d136991ddb5ae91e610b16fbff94e4521922e\":\"p3\",\"b8c6fcc9136872efd1289d9839fc7463f1fe28857ec6540f1c06bfe5ed9d5f17\":\"p3\",\"0c18bdc984ff774185960334154f0344d831975f1a2d89af818a3f5d1d885fec\":\"p3\",\"3e6aa3b084fbc9fb2a0877972a7e5e46927b061c2505292235d0e707a40e2fe4\":\"p3\",\"499a916eccb29c0ccfd11f32243c78c7f22b60276b1a71130014fd3a7168c8ee\":\"musterring-mr-9425\",\"53b8758035d790a3461346c969394543c6ea104d424f808412dd1f98ff430147\":\"musterring-mr-9425\",\"4f7446d4efddebd10eb1fc85101a562fabec3c0c0e8d40b702881478abf061bf\":\"musterring-mr-9425\",\"afb78e5dad47976e5fbf7417a505658c67456bbc9a278c536bf62c0d96dfee4c\":\"musterring-mr-9425\",\"e705918f70df27c14a3010c84572bde3a11190192664a517f57789599ee52d3b\":\"musterring-mr-9425\",\"491de02eeda85711493aaa7e7c31c11e688eaac6c24e9c027b5eea81d8c65516\":\"musterring-mr-9425\",\"77306b0f2a75a0d46fe605ed82a91fde879e6d98f5e7ac9560cb06c3f60207ad\":\"musterring-mr-9425\",\"04d5df514a90c4d11f9b9c8acb673287adf7f64d3dd077fbf2670c4e4c170af1\":\"musterring-mr-9425\",\"a1f1066d6c1c2a0ae7fb905fe20a9114d77114a1882b48b97c6195bd9d5907e8\":\"musterring-mr-9440\",\"5d7463a03e3ad84ba6c913fea757ffbad2db68bfc6769ba093ab70447128114b\":\"musterring-mr-9440\",\"e8bceba7bf7f5fb42295fd5747e094f0ce6b82171a798eb7a73de87355059493\":\"musterring-mr-9440\",\"91ca05e1a33da13d20e25aedf54fa0c538643ef10a517786fd351d9ecc836eac\":\"musterring-mr-9440\",\"19bdabf3fe28d23ac4d2bc09cfb739e75054303a5d2acd7de31498e262a0cd01\":\"musterring-mr-9440\",\"610c64b1c795c198adaa08958d067bedbae992c43a3e21c824a9c6ec21f88e44\":\"musterring-mr-9445\",\"07eeb398257398923b606b647b49616c34ef500a4efe837bfa4dde172d12dca6\":\"musterring-mr-9445\",\"ba840fbe138a548f58eb6842c9a0359c356be50959c5ace061b2ee15c02ac2bc\":\"musterring-mr-9450\",\"91e5a78275ac223fee94ea919d4a9495fbc83df04951ec2bd16a3d6b330f22cb\":\"musterring-mr-9450\",\"b9eac173b6b69000ce45cdcba9136c7c96450010bad5c5d6ac3008d120fb95b9\":\"musterring-mr-9450\",\"3c87daadebefbadd5faaba66db56a83d6f06d1e70ba5e894fc8512c878c01a69\":\"musterring-mr-9450\",\"48b5fd62d85025ed73fceffc6596b560b65a90724f869362b1151708e0c2a3d7\":\"musterring-mr-9450\",\"2744d811688e8e60e33b1dda4f1eef82239254c57fc3e04e44a8b067a228bc2e\":\"musterring-mr-9455\",\"38da982ccd8e80d0165653b4d2d2ad723f8133bff495a532cae81286d869a399\":\"musterring-jana\",\"c2c718513f02cb488a1da77ed9353f3b1767c8a2d12ae22db74f3fecbb0daa30\":\"musterring-kanto\",\"d41e3a2820cde9b6346a3aa2a8b1225f04dd30fd26932de7341d14d6cf444838\":\"musterring-kanto\",\"44d62a28ec07d79466e35bca18466368393581486a07b6174c8c5a21c537e47c\":\"musterring-kanto\",\"08b0a2e00a82e6fe01037a2b036f36cdbc693180c9154a94e452da39b39e42f9\":\"musterring-kanto\",\"e9b33669a4dcb95324db920d8fda849a275d9cf6cccef7aeb118d3f402088996\":\"musterring-kanto\",\"d322418b1a1e0a4944485a20cb4060962377789527ed0fc5052ba3c3ef040ac4\":\"musterring-kanto\",\"7e0e64889b431cba55c352fad49cce456969d43a3211de48af0e1e8f85a61d31\":\"musterring-kanto\",\"f8c1304df431491455b4d21c4e72bbbb8f1095dcca797fd63da051629bf55c82\":\"musterring-kanto\",\"10b4083bce1d0f2da856fc5f7c71521d85b932114c416522c6f240a1678e7616\":\"musterring-kara-frame\",\"414636dbe5bdb646e2663cc3b0e291d63a72592cac139a7c04575021983fa584\":\"musterring-kara-frame\",\"2011fb861058cac4fb809cbe0603b38c26ebc9725624e6f79fa1891c0a91c52b\":\"musterring-kara-frame\",\"3275dda061b58b1dd2e9d796fc3abc804c2b0e54c33b8911366985578ea8284d\":\"musterring-kara-frame\",\"5e9ef6f4030ab0121857d827d451c95afd04165336e31d345f7825b0222e7860\":\"musterring-kara-frame\",\"a85d35b419bd9be2fea898c9825327a793339407b4f0189b93767fdb62275416\":\"musterring-kara-frame\",\"4d31e7f81650bd3545b47b051dc07500d9586ba3b6140c9f2b732328f96340d8\":\"musterring-kara-frame\",\"bc8b5fc20e820041d58c6885faff0bfe3925764dd15f1647473ceb165982560d\":\"musterring-kara-frame\",\"9f6bae68964ee9a65dbc8fd8b46a9337181ab88d1e7ce91430862b953d85668a\":\"musterring-kara-system\",\"ffe71faef00eee1a909e6418c7d54e27bd3a6fe758689e2434cca0c4d956899a\":\"musterring-kara-system\",\"be7db03b15c775179fc76e5e1c1878602d12f918a79a159e7c5dcb4e4ac0e038\":\"musterring-kara-system\",\"f8a3f31d3e3e7ca39fb893a7119374b503f8c53c24a0e4331c5b501fa83d4386\":\"musterring-kara-system\",\"f89517fb9c68cb92312896f27db76155fb3775b7c7234548fb87e578ad04d5be\":\"musterring-kara-system\",\"c74b5bc7a4eb00e08621db39db5b09b30a0c853da6bd1006b9ff791a5107a72e\":\"musterring-kara-system\",\"90f1fe3628f4353f644883b99a20d5731639112faa9646f60e3bec0d2227385f\":\"musterring-kara-system\",\"690d5491e1d4f9a85e8e53fb8db78b9db663d306850f215a037bc16cb8be8014\":\"musterring-kara-system\",\"abea9881e18a588287906e50b1c193c4ab308a1d7d501c2b76df50b527da8026\":\"musterring-kira-system\",\"b8c8d49d3f394ab6644bcbfba24fce2b70aebe5728e17c19a6774fdcefa84f45\":\"musterring-kira-system\",\"585466bf598725ca3146d848dfb970aae2bdd4f648e470dbd6520aa7dc803b4f\":\"musterring-kira-system\",\"a37857493f2c0748a6d5075808adf3c9afbda8b6855d07e3a2d919df46b60482\":\"musterring-kira-system\",\"5757c61df2f3f8f1587e22357f4ff6e57ba9c3aff7bd230383aa08bcf202e77a\":\"musterring-kira-system\",\"74a9a798ad04cdef62b1ca5b6b8585e95db92896e282a2b7fc3aaa82dbccbe36\":\"musterring-kira-system\",\"4582c11d5746d75905f5b0659c13bb9fa8e8aa83e476698fb6b7dc279bd42c4b\":\"musterring-kira-system\",\"6ee7f1233ff24daa8b4e066361613d1aa7a65fabbaa851b3ce0d000e317568c6\":\"musterring-kira-system\",\"6e1072e91bffdf60d06c5d380b4aca8ac6845d918e6f6e76b660d119e5fecf95\":\"musterring-kiana\",\"972798b1869f3bdca6bef78d8037215ede01274ff341761a3980f5a672304060\":\"musterring-kiana\",\"b37d8d5a85ef8a63715212d9b6f7b1f6d28839d24678e475c38b4dd3619a75ab\":\"musterring-kiana\",\"0d724e0b4cd8c7fb7f639035bbb7f76e7929306400d476cbab4581a1e9a143ee\":\"musterring-kiana\",\"72f6868bdf5a9c4dc005c17482aec0585999caede36dff90e0dcbfe41d5f48ab\":\"musterring-kiana\",\"4327cc36e9110ce7d8a5904f48aac4847544ce5f5d780d1189065aa45e6ed52e\":\"musterring-kiana\",\"a4e8a7f31ba67a049a0ad8253a35afdee1c7f3508f248075c7810d3002ad8f85\":\"musterring-kiana\",\"489363acd278121b224caf61622fa2ac025e598753a84fc7c1ecc5389f5fca43\":\"musterring-kiana\",\"323a6be5407ed3bfd3ac5337066b86ed05cda9cbc4ea279e9e224bebea01bef8\":\"musterring-korsika\",\"90016c83edf04485d099bf4a128c4a92b3ebe8e040ade3c68f6c273d0f9a8494\":\"musterring-korsika\",\"cf4078b39ff9e89ba9a261e7e5fac4a097f38389306c21e843cb27c84e85a988\":\"musterring-korsika\",\"c5b87a713af9eb16a6a33d42c1d129f898faec55246c7e4becd892840b2dc65e\":\"musterring-korsika\",\"4321369f720bd4bfde310f716c87682d7046b9bba95f5efc887febf3fa1a52c4\":\"musterring-korsika\",\"746afc36fe48e6c2e995b01415a109b13b8335017dc105682aacc28e8d9ac6b7\":\"musterring-korsika\",\"6d3dbcefd6707671ed5b0c3ab112e3960bcc22ca51514b9dbb1d8801a3180b56\":\"musterring-korsika\",\"3741ab1c3550d28d67dc2cf34cb3d964498203493869a169125a662727922696\":\"musterring-korsika\",\"a610a219c61c36314add782e6c246fe07bf089a5fb2ecdf225255bb4cccebe08\":\"musterring-maestra\",\"c8546263c44e79d274df49deae8838aade3a2176253b26b5974af546e3b3fb15\":\"musterring-maestra\",\"143732dffc7104985a834434b781768923b3de54ca9a6c4e635f434345538013\":\"musterring-maestra\",\"84a8a1cb7ee35cf1dba234410bb055b3670d58810ba5c5839aee51798acccdfb\":\"musterring-maestra\",\"c2df15c6c71c361f22e72be6a6c3a83b11db58553b307c85d71786875d065a80\":\"musterring-maestra\",\"8a73b5b83fa37aec1f54130c9c069c1320c3e1e9f5107db38b24bfb8ebf62dd1\":\"musterring-maestra\",\"dd1c4d1be25d59610993ce1890cb08f5d47401483762b0085f3528b61a205382\":\"musterring-maestra\",\"36ce4d044ed1c1ad685eae64c3be0c2056642ad93a9367fafe33bd9dd6417d2a\":\"musterring-maestra\",\"3c012b97a4648347880eec7f36b0bfbccbbdf858da5e56351f0eb04071a68d1f\":\"musterring-simea\",\"db7d11048c55917388aca04f2d5ccfa043442f76fa5f0fd206f0618fa79ffa2a\":\"musterring-simea\",\"7097138f74124a0379ea406e96cfaafc49ecce0d3367af674cd486aed656914c\":\"musterring-simea\",\"73626f1446cf4da7b2eec27cbfe0a8297a583ff66716d45ecd7305865d06feec\":\"musterring-simea\",\"5b1d1b44fd809d33d6c650a71cbe7c50b939945889d0ac90f10a66be4bedc993\":\"musterring-simea\",\"5df2afb26b52317a1e1dcdff83d36e417b6b5e998336975ee5b2cfbfe4ed02a0\":\"musterring-media-smart\",\"f96cd7bd4265b8ebecdfa74e29bb216090f17e4e4b2c3697b9759b3200d0656d\":\"musterring-portland\",\"a8551f5c0bad582f291658b89fc33e2fd24cd7479129f54c72e0477b535ed262\":\"musterring-portland\",\"d991513a49383762d9d0c468b6ba474e739bc2dbb4fd5fb68510e7ed66300652\":\"musterring-portland\",\"2144de0a76e6f3174b2d4b10ce849f5b98343b5ca0871f62eaf3ea0a1a810f2d\":\"musterring-portland\",\"4891f1309c7e1ce1d3d3f650c221db5d1b59c86aa0f04065b79d1314d170b65c\":\"musterring-portland\",\"9a23e9dc06dc9abcb80771333fedcd202e9ef9705762fde3544620994d011247\":\"musterring-portland\",\"2059acfce6ab45563181a115f67ebf97ea516478424154dcfbe94868559bf452\":\"musterring-portland\",\"e79022bb99d0f000d16d32e66a2d91d12e9636e3ece7c61f6ddbfcdbe1b34153\":\"musterring-portland\",\"60bfbdb17c95bc91f0d2e4a96e7867731cacdce738fa2e983b6b14b27c530ad7\":\"musterring-q-media-20\",\"0bfce1aaba5dc0be304a5be0f54672746d302d45712e1edaa8b6931d0421b195\":\"musterring-q-media-20\",\"6745d32844c578bd3283d04ba835b53ffc2da54192c7957142fd687eaec50a12\":\"musterring-q-media-20\",\"9429b9d0a5de58f8958ee37b4c0d1766a74890cb1053f46b43f9d72cb59f52a7\":\"musterring-q-media-20\",\"a27e9c0c3dff5fbd91b19bc221e47d436190661cb3e820fb4503979de5fe6a8f\":\"musterring-q-media-20\",\"aca8be869b2d085f46ef6efc6476531d788cf44ee2e46823db95d19603b89f16\":\"musterring-q-media-20\",\"15ff998ced692827cc2785404de5b8d9da6ccea26bca7a76abab8ad76c79c0f9\":\"musterring-q-media-20\",\"17cce8cd0b32266513f95363ded400c988ef081314cf6fe330e521f763c23a1f\":\"musterring-q-media-20\",\"ba55587a2ed5b9ee24840fdc83faa1122f6712a3bcc3398213edd9f6e6a6562f\":\"musterring-trevio\",\"f308913f647527aa4885e7aaecd575121036d4ed3258bed456a8fb8d89230abe\":\"musterring-trevio\",\"344afd7a17af703e430e8e84efb3570a637fd3e62cf6db74b77fdd8568b5b0c8\":\"musterring-trevio\",\"f53a0772f36e348443a98738fb159c1dc5de74c90ab70cd6d2f6e42bf1ab26c5\":\"musterring-trevio\",\"f43e195635036ca18b574f9406f2329afddfe23cf10a47eaaeb7c8e91216da4c\":\"musterring-trevio\",\"84bc20049a7fb458b895e17ebc7a4d72845fa29265acedf5c52d24b6e4e11a20\":\"musterring-trevio\",\"e8781584646e5a1ff0d91cb8c60ef64bf3f984491e682161ff7645cf4e579047\":\"musterring-trevio\",\"0ee1093ecadb97307dbecdfa95690ae741bf394873061c0872ded72e7d42a06f\":\"musterring-trevio\",\"2047a6ce2542599a1613cfc560a7687766dabb2c026560597d9d7d94a51d4059\":\"musterring-justb-ct100\",\"2f512d885808b462613c37743f2012fd393e07990ddd03a5a4612eb94250903f\":\"musterring-justb-ct100\",\"e98babca53d852ef4ae85bdfd69a6722272213ad78184bfa77b089341a806dad\":\"musterring-justb-ct100\",\"be01ef911807eadcc6ff335bfbb435c1332aaba823b314dbbe64f78ff8260415\":\"musterring-justb-ct100\",\"bbc404ed3f765323865062e7a34ca7d3c7b81f63d3782167eea9733bf2a94eb8\":\"musterring-justb-ct100\",\"d3c93113403bd200bce83295f2363109a1e3c2fa214423fa63c6e966b1ff3c69\":\"musterring-justb-ct100\",\"c41069932d8000d0f7297bedb9792b48cb6445b68a94bf4a982866ec51eba193\":\"musterring-justb-ct100\",\"dcf4d5b13ded65206972da460bc9524903070f83d5945eaf07c5461d9565e329\":\"musterring-justb-ct100\",\"878a1bb818b8c171adc308f7c1486a2f644195d042a1483b6e0fe6f14699c039\":\"musterring-nara\",\"c7bc940517bd47770d68e7c5ce2081b9f339114486ff1c253f673863e69a7cfa\":\"musterring-nara-new-kopie-1\",\"2b32c6d6777cf241fa0faddb4dc1820b909d587c62d640ff43fc9d0e041a2fd0\":\"musterring-nara-new-kopie-1\",\"beeefa87754a21d081d49a50f9a4cbf95bb03d9fc2a20f8ccbe44e5f9307fc59\":\"musterring-nara-new-kopie-1\",\"bb827f9be74a19dd9d0fb3cd2179889da119231a25842c3ff7e254d8d177f815\":\"musterring-nara-new-kopie-1\",\"c4ec1f5bf1fe58934041242f6a9a38ff83ce5e6bb0ce70f5b76d2800b93140d7\":\"musterring-nara-new-kopie-1\",\"0293e5f95e3aa7e90523d39609c061de0439774f55cf5a8bea33892c1abc2f77\":\"musterring-nara-new-kopie-1\",\"e2ec22855a9eecae8da13fab4cbf17b57c916a0431546160778a87ff58d9e143\":\"musterring-nara-new-kopie-1\",\"f669c66b6ade6bbd846b2cdd0652632d7f2490932353f4c322f5bcfa5d556875\":\"musterring-nara-new-kopie-1\",\"84f138c9ac50f74d6844c12d893100b05d3861158af3a8b0d46b6e63322cca36\":\"musterring-nela\",\"c919d2b0160ad3611bb4486c79022aa05c441264ed70884adda1b69cbeedc34e\":\"musterring-nela\",\"804e2304dd0aed3c9ff8f90985b5726c39c7fae015ca7382f534d3be96c6e48f\":\"musterring-nela\",\"e2f10d97ec00c95ba121bd6cda8c5dfb541376139e2f724ce725414f67825273\":\"musterring-nela\",\"7ce0845197e231879f265bb0dca3045d05ca808bf4d633b040ec1fbfc7da05e1\":\"musterring-nela\",\"1017b64087d7ea59e51c1b2546fd4dfd064e2cbe4a7bcef497480f57ec949602\":\"musterring-nela\",\"6554bbb323ef0548a881ca76e18e21a92652419f384b17181e3135f39d339a4e\":\"musterring-nela\",\"39b3b8dcc829a503e730a82a8db08c32cb58e1175d6cb2f1b6b31a09c7277af5\":\"musterring-nela\",\"a3192081049262aa4d7e729db9fec99284a0ca376f98a0aa5f55b03295d7c998\":\"musterring-joline\",\"73a4f6edd7dad24f0b9529769dca99c5617e4831c92d9d6e47e7267bae386217\":\"musterring-joline\",\"5b24b07adf1373995cc561f8c42431a20f7299f2f49ba44ed6523672056deb7c\":\"musterring-joline\",\"6884850d66f9dd13de07bf7aea17f0e797ae108ba9a6594b023133514f18a88b\":\"musterring-joline\",\"00feab15e0c5bd4ff72f1274c8c92181ad1687386bd5595468b7317e1929d174\":\"musterring-joline\",\"ac5ca2f225368c311c2b69a208e8e6034ab4738bd9d645a3a274655376b6f2b6\":\"musterring-joline\",\"a36085b9d948a521eba1ed21cf51b6662c75ea20cbe8a9268d39cb67f7613644\":\"musterring-joline\",\"55e22ac6dfb605ca5a4df32b72b2fe37406f38c3865cc023f26677737400cd2e\":\"musterring-joline\",\"5e0932282711b2bb3a25b51e8f238c94726e81f94306d489177523964aace6a6\":\"musterring-san-antonio\",\"390b4155fe2857376a17f92081fd40de4f418c93c8c08d60d736b795e7b31017\":\"musterring-san-antonio\",\"d2547b43fbcfd9999f80762fcf81b7f6e2946a59191d6f40e035e2c822ea0067\":\"musterring-san-antonio\",\"aa6137c04b29fccf5b817ed6fc3c62b93b151b58c9b8a26aadaa955f121327c3\":\"musterring-san-antonio\",\"c288d670a0f69b2e53c91a5b0962351f0e53fdd73cd9c327309d155782673abc\":\"musterring-san-antonio\",\"821d0b14e91366f93d42b0199da2695bf1534b041a96ae1e3faeafa373bf0dbf\":\"musterring-malin\",\"c0c3ded8906c407c9edbb1775ba38284c6988ad9ec6f5fa0549e3ed8e70d7858\":\"musterring-malin\",\"361f08fc89653baccce2b16c6f143b17502b265740a873d06016cc42591e4e63\":\"musterring-malin\",\"cba4d7f1c5da9acbc17f65654334687c57944a79d85990a66e5a0c03cdca1556\":\"musterring-malin\",\"9f320bb2a4ed432d258dff0ba37758e5c28dd8d81659b0fcd1efc04b77727eba\":\"musterring-malin\",\"1d5022c0c8eb913cc95af2823cbabc2ad23a8cc3c93610bacc3681940b7be76c\":\"musterring-malin\",\"776345a001ba02dd83329131dad13fdd18e81f6f019ac9ddc933cd69e44fb1ea\":\"musterring-malin\",\"8b48f8e3dc48b5d3b3df0e6bc6179f43a4271dbafb4b02038d2614dc676b7e12\":\"musterring-malin\",\"d659803c4e062439cb5a424c4d381553588bf6c1f058a2b648c3002bbd69692a\":\"musterring-jovanna\",\"8c9745eaa111e4c72c0b405d19ccd3311ab297661f2876557ae3ece61221059e\":\"musterring-jovanna\",\"4a8001e734130ed35082b835a428d0e9221e6f1cb44f3488b71ca5712d5670e2\":\"musterring-jovanna\",\"ca80d714801f198e217d32cc007266d2c685e3616df115ec3c2529aa2a5e604a\":\"musterring-jovanna\",\"dc881667b2d9ee8d84d062e320dc04dfd1fdc64b99eb3ccdb929f842ced4d438\":\"musterring-jovanna\",\"1fea01d60e1f886bb4b295fe362c1365a222e0fa70913b2faf96b3a8002909d6\":\"musterring-jovanna\",\"3895b58f23b39296e10d8c74c30ecf31d277e201bea9e048a6b5323be81978f3\":\"musterring-jovanna\",\"c9361ef94e54009353b508767e111af2ced96cd1974562197340d3627594069f\":\"musterring-jovanna\",\"502cc51b957dcf2c0fd5e6fe6d2e2c7d899baddc1aac31e670a34db244044ef4\":\"musterring-joern\",\"03e5c82f56213fd4059550fff5b60a9d3495ea5d92971e3c966450f0ff15de2f\":\"musterring-joern\",\"5c9e92e6c1b084d638101ccaa2913ec6534999dfef40d8be744d4fb2f3405169\":\"musterring-joern\",\"d4264d4bad0e36945ba0214532c5ebac82fa4cc1d43e63cce4e096a22859155a\":\"musterring-joern\",\"c54cbb81c076807f4837f2ebf3d6fd73f5b40b051e24473e9b3d923da2bbe8d6\":\"musterring-joern\",\"45ca25060fc92608d3370e4cab6f7dd95887cdc47fa4345e22401d95eeab3558\":\"musterring-joern\",\"305e79e2a2ce82a2d65e4986581349e6ad21d40ca4259a4ee732da81fb7b48e0\":\"musterring-joern\",\"6f8ce7a272a59fe13eca2f0d7ab1d6df2f5f5a2e4893c883ef76a2a39b4d1161\":\"musterring-joern\",\"115748e5434fd93a62a18c390fd5515adb5e819275414b7b3e0c72cf10df3064\":\"musterring-kara-frame-schlafen\",\"dd2af424d8419306080a79fbbfd00c5602d94e6456ac82b04e4101efe6ecf618\":\"musterring-kara-frame-schlafen\",\"8e72ddf012245717a199e025002882173bc68b5ad0a1d8e89175d7935437eccd\":\"musterring-kara-frame-schlafen\",\"bd7cd12b2a0d27033fefd9ac1595645e7ddf115c4ccc031e816849f3dda97190\":\"musterring-kara-frame-schlafen\",\"a3306973d4361b02bd787c3b3519d6b404f198dd3477f0f373360a7f903b7a96\":\"musterring-kara-frame-schlafen\",\"2198e1399a7fce21f42d28fdb295e65019f5ce0f53d3d295c12a9e513088c24a\":\"musterring-kara-frame-schlafen\",\"00665833bf3980cc144d9c9325886962f11663cfc798070787c25012787ff329\":\"musterring-kara-frame-schlafen\",\"8c31f9ff6c3356803ae73970d45b82d1415cb0ed2287dc196b32e2656a403db4\":\"musterring-kara-frame-schlafen\",\"abaa0462891ddd4c2b00260359c2933c19954020e2f65b67426c654d4b12d73f\":\"musterring-madiva\",\"8a210df31e2cff7a4ea1dca3e8a6b2fa3edbb7d559b6d9979e97db3dcd5e8329\":\"musterring-madiva\",\"1259eec4dd14b10ad417db2c5f9c66f532de86e4ce1b7c38c47cdee87bd7536c\":\"musterring-madiva\",\"b45ad111f3bf3ca4b6cd65d19288e8fa80ca81beab6aa79a34d44e353101fabc\":\"musterring-madiva\",\"c8150c1ef51391736bc67814f230a47bf174ce318825a97fc9cfae757f70be74\":\"musterring-madiva\",\"97975ded7b29fcc00d87682f4271f295dbe58460d43d3f31e51ac25ae0b919bc\":\"musterring-madiva\",\"025314eddb880d8ee404730f38c5c114226856747c6e19aded4d5cb1f4f2a64b\":\"musterring-madiva\",\"3b81bfe0305a1217566d19058be82e8ecf2a3ed18e3429d1dc8043791e16709e\":\"musterring-madiva\",\"632a09b2fccfea7d9b1316e0b113dc88f322b21f97edf60f6e63c408fed67a2d\":\"musterring-san-francisco\",\"751cb80cfb09587f30e93bf35caabe7dde7f9cf1defe953cb9a6addc55e75afb\":\"musterring-san-francisco\",\"4243b074eaf70d9147ff6f00c7d8c610beb2d9056c73f69a413c751598a3c6d3\":\"musterring-san-francisco\",\"98c240e4024f7454c47759018cbfc3bf111b240123ff5c3fab007dd717e302b7\":\"musterring-san-francisco\",\"9872200ba08fdd46c8433e4b0584af2e302f08fd926251befb559f2954b6f60c\":\"musterring-san-francisco\",\"326d6069a1c056bf0b63958d087453c9416eb971f109a5ee9fc9548fc7ed8c81\":\"musterring-san-diego\",\"b740d031e2f4ec20fbbfbc5419c4131c1deaa4a177ce364e1b9be21d84d09f27\":\"musterring-san-diego\",\"a6754ccc4713d961cde5c2e3698f7ff50a0dbaab1651bae4bf3cf9071f9d1ce9\":\"musterring-san-diego\",\"12e2ff0c17a9beeb65eb9af0f938789b99fd982e0b7bc2ec9f582f6bf63c6997\":\"musterring-san-diego\",\"b808e6ecd9daf27f9fabd94e8ebf43471ab1f7241a444a15c28e1bf8926d71a3\":\"musterring-san-diego\",\"9dd21ffc9b6b10855f847356db9a4502d8b415b6b643b2d6144d71de961f01e9\":\"musterring-san-diego\",\"de7af81e4c00381e97aab295dff9e05af3e323dd46e718a995f71b71cca5abd7\":\"musterring-san-diego\",\"8b33aa0cf7669cce02cf6f28be4d4d02b71bd1000af2ca2cbfc832aa8860f118\":\"musterring-san-diego\",\"b1e1033f7c113fdbd993a2bce4e9ec17657a05b3c1864f91f55cd148023d9a7e\":\"musterring-savona-20\",\"94e3b955af37b43271a86974fc52fc3d67b14e2192bfa9703fa80b2368f51947\":\"musterring-savona-20\",\"037ab1b4c8248aa19be6390f06ce160f0d05e23ceb775772b05f102d480ca8e3\":\"musterring-savona-20\",\"e2cc55cab09322c85fb7f50c597f4b0cce7d928655b7fd60b5336aa792a1c533\":\"musterring-savona-20\",\"e056c058940e0890800631bc63c53bc0f666b8bc30bd495bca3bf9b8158c7f8d\":\"musterring-savona-20\",\"b730e2d8d1f754f6ca16e6baee0228dbd7d00c713b02f6d37f2fd735d398848b\":\"musterring-savona-20\",\"8bfe2ade504fe7a146fe32347ff6c389d0a7ce9d26e73f40dcbc3ae4917b9b3e\":\"musterring-savona-20\",\"2403c1e07483911858d616372f31f9b24f020a9f226e893f13264023f34327b9\":\"musterring-savona-20\",\"5719989c4194fa781345ec4cc872fccea632e5a5ce1768636bd96c8cc751ca7b\":\"musterring-sorrent\",\"10576e2c7792bf93b04dc0fe5a046b0af12fc842f5044362d4805a87e4ea046c\":\"musterring-sorrent\",\"b386968900e724cc1d6faff0860deecf40e5b09025f76777024c1ebac949523c\":\"musterring-sorrent\",\"1dc368faaaebaf3499d20a68ce3e2306afc48d737cd78c5f17dd4af199d2a5a9\":\"musterring-sorrent\",\"81c13a1bed49808f3ebaf75e7bd1310bbda53a07fe2f8814e1d102fc1c4b829f\":\"musterring-sorrent\",\"2ad3a3ece614204efe291ef16cb7e227fa2e50137a96206641a576d99de55ea6\":\"musterring-sorrent\",\"9ce45dc51e6e0df0b3b3aa82b52e3220b1ab0a2905b7db0188193830e81fdf57\":\"musterring-sorrent\",\"9691e2eaf47ef71f4efb1be7ca341c549db19a5963c49933e704f8046b97a872\":\"musterring-sorrent\",\"7f718431a145da5322e87ed126bd41f539708bc2149ad52196f5dab4b125c363\":\"musterring-justb-sc100\",\"7336a0fb8fd2b37833dceb34192231acd06524e1400c67d6f5f98ffac26fc66e\":\"musterring-justb-sc100\",\"3f8a3a23c0c3f21da5e52f882ddc3f637d33e68f159fddccf64ad3a96fa7f55f\":\"musterring-justb-sc100\",\"e913cce957c131c2f065c4d14c28ce6ffdfe662cf8d3b876c9bbdcdd789b1cb6\":\"musterring-justb-sc100\",\"c9944b4ad3db19ca6d59d117f3c255a03a330f6c285cfd2461eb5423548038c2\":\"musterring-justb-sc100\",\"498d68d3c556e2448177925fb626173e64e8e8faccb4d03446a4a7f8ff7dedc0\":\"musterring-justb-sc100\",\"97b239eeadb1eb3151df81d257d5fed865b49b604047d5670d1fb7d92f2779e5\":\"musterring-justb-sc100\",\"d163f8ceb8c3b24cd09a5b463ae9a2f98a5dcd5dba7e1eb1705664f1640796ed\":\"musterring-justb-sc100\",\"68ab942b8be7edda5a4931942282f46cd44320aba3e79f8a978ee19890396954\":\"musterring-justb-sc200\",\"a24c650a46474e78d7c3921b97fea7b3f4eaa389d908152fb32e74883ef8db85\":\"musterring-justb-sc200\",\"9dff1f887876435a667b30fcae57f71e753c105a30d47969929530c05d049c97\":\"musterring-justb-sc200\",\"81d0d2d6abb23de4bf882c0b194c730fb479379d23db3d7a34d0ddecb2bb8478\":\"musterring-justb-sc200\",\"ad68b064a54e68bb659185d9614e92b3372d0cbf243ccc19a3e34a8aaaf2732e\":\"musterring-justb-sc200\",\"2c942dac00998a1a8171eb59ade6e6d704ae91a072e709020954f0b14a13fc1d\":\"musterring-delphi\",\"9beb248d80e118a34fa82f95150ff522dc00e9fb5de8ac4b0b56b160e6a93743\":\"musterring-delphi\",\"13a280e9df031503abf1d62105b3d4cfbf24ac20151676147165ddc63b697613\":\"musterring-delphi\",\"ef33b8d448ce6b8389ed87517c4cbb6988eae7451927f27aeeee3ece2e8cd92b\":\"musterring-delphi\",\"bfd1efa8c1a176e7e248b701b66218c26de69504f3da12b9f86100c8c40cfbc2\":\"musterring-delphi\",\"bfefe285381d5762715a42caef6ec6b77527b4d497696b7e9c3c2b872d64eafc\":\"musterring-delphi\",\"af28cfa131d869eb473b9f3268874ff8c59e045cc0b8c7df8de0a08ee571576e\":\"musterring-delphi\",\"c154a742a2f894d21370b4b40056d49974e73e92e01e07bddee494064362b207\":\"musterring-delphi\",\"c98b98f0f6594a6605c75c586681e96262a7a05bf4e173c2729cdec513c79f55\":\"musterring-mr-dubai\",\"f95f2edabe399c4a75ea46fef1270eb86372a5490467db5739da9bd463baa1a0\":\"musterring-mr-dubai\",\"68509c42eea8c18e25d072b5eb43ada6de6bc1e22b26cc36da24fd38043145a6\":\"musterring-mr-dubai\",\"066c38623c382e07e2929809c89d76a0dff70a88ff6e0415f5c30881566b2635\":\"musterring-mr-dubai\",\"7b39f73abb5b15a415ece04375d910a73a051f268bb08dc6780492623e0a5c56\":\"musterring-mr-dubai\",\"b85f5fd370d14826cd62a3363a6030aace6754a12149320a0ce73c846ed333f8\":\"musterring-mr-dubai\",\"108cb6e2d9987ceed66ea0bffe832e2909b47634254fc90ab3c61766d425bbaa\":\"musterring-mr-dubai\",\"e55d0c07fd2122296ae68f08b4ab20fd8dcaea34a72c74c0cd451ce6064d0fae\":\"musterring-mr-dubai\",\"6171ac47128f9e9cf9cfd3f3baaeb78a64ebd2f07fcf28c47e8080126213e0d4\":\"musterring-translate-to-en-eforma\",\"fc7a696cc5600fed5ca281bac1fb6ac9ad9c6dc11ab13c2a772e101075b7db60\":\"musterring-translate-to-en-eforma\",\"0d257f18c604fe93b83535852a9bd32d3eadb0819656825b787fef38b04932ca\":\"musterring-translate-to-en-eforma\",\"7dae7123c13aa09f0297904dc6a7bf3264db62284cc4a641e7750d70622767de\":\"musterring-translate-to-en-eforma\",\"890fbfda8c679ed4900fd7a22625f465fcb82262774286db2da8e168e6e74b8e\":\"musterring-translate-to-en-eforma\",\"abfd0ba42fc945bd88f04676f6e9a345b8a336f3895172a97d2c79f0a9f3c757\":\"musterring-translate-to-en-eforma\",\"d209674c47ceac58955f5578ac2f8459f0ec40997753caef9432dae0b153ade2\":\"musterring-translate-to-en-eforma\",\"55cb16dfb12746efef579e1861bd1a4ea940d6a12370948287f9e5da18de73c1\":\"musterring-translate-to-en-eforma\",\"23e58ec22b4a6d1785cdac0464854336f48fcf549fe3fe82b3bf1c9e1451a964\":\"musterring-elias\",\"60ebd7770ac43544f5dca47f66150f382181b0c362bebea9b519fb07786a0efc\":\"musterring-elias\",\"ea44390d97dc770e5fda971c6e6688dd46d5b56a731b2ac96715eae1ef14cf5a\":\"musterring-elias\",\"7e017f0c8f28362bf26d9eb4f8aa911fedc273964c6d6d46f0ba5dc125ddc08c\":\"musterring-elias\",\"da4ecc64c246a7f37fe7428f4aaa310b0516bc984667af46cc9949196578d9ae\":\"musterring-elias\",\"e5e9189cbd3dfb554b24d38499c194426c1de28b99fd497f7897306438be3bc1\":\"musterring-elias\",\"c6dd6cc04cdaf9b2d5b06e56f855fae3fdd98381434e127629a80345dde1cf73\":\"musterring-elias\",\"aa7a3b4edb6a23d87f114b704a0be63febf5a9b65cf0facc8b6339fa21cc31f4\":\"musterring-elias\",\"dc0ae8f0c367ecd6ecea335bbc3a77f322135426dec497924676a83b5d7e4766\":\"musterring-elos\",\"c0a2afd0dcda8334d831256d36d4db246331b8cf36c450f5a72f782aa3e075c3\":\"musterring-elos\",\"010bdafa6be87d4aaeb238bb64044e38ff768dba7721a4f618f0269ee146679b\":\"musterring-elos\",\"a6ccf87c23ad0529018d7f74701bc398d61aecfdf02cac21721f2ab812717bb2\":\"musterring-elos\",\"cd85bdffb7420f8c69db6b5cb4bac00029f2d1c4805878b76d372888bc1aac96\":\"musterring-elos\",\"430a0c42814a2fccc0466197fe5bfd891d8dbe17b7689d3e3df56d45959e8afe\":\"musterring-elos\",\"d1970e65781454a8131c7630f0ec218ec12cb0911e4ba2cfd9211b98c7b6555c\":\"musterring-elos\",\"a7a6f5dc4898b2e2b9e0eb94cf87db7895388229893c447a3d7f53f220c8e97a\":\"musterring-elos\",\"39774e0ae90eed45d6e7178eb5cf330a1035357e96620b34237d1e1916311d49\":\"musterring-bari\",\"fb43c69135070e52a70ab2d8a0a9c1a04ba12baba7da742bbbabf00fcea9a62f\":\"musterring-bari\",\"243b11700a2d15f581a752349b2f7b4eaa9f41e9ccaa18b1f6caef7f7ba4a82c\":\"musterring-bari\",\"661a186967dfbc48a320cc769de8d905fc1876e9b15d52f2dcc491290eddea9b\":\"musterring-bari\",\"786a364a52c00c71c4391e3b57157a8e50ca4cd0a6daec9bb72f3eb6d15d04d0\":\"musterring-bari\",\"a409a6616b5e7eaa619ea7ce98d6c25ecec1d03642ed8c53db4a62de9bd19e08\":\"musterring-bari\",\"6550d0cd8cdd934f21cc71bf869e0d51f119c420caf1a30a9eb0d7faa5cf011c\":\"musterring-bari\",\"31b9f66935a5830c3b4a957bc52b470e79c42357c9b39a6e079904236d930d32\":\"musterring-bari\",\"3e387fb057b1bfa1f5e2b98b2c25b20a14b2f79116dfd94203afe0b6fe676503\":\"musterring-mr-imola\",\"b3c523639a8bb5528b1c8eaed05e42ca13a4af8fa79a2d94275f15979fe8455e\":\"musterring-mr-imola\",\"aee6310ebf2bc87a14302494aa08cf30e9ebff5a5af8eb37a515b1105095108f\":\"musterring-mr-isabelle\",\"372cf73c2cd960b583abfb41bceaa6d9b5a3a6f3b35d4e19361182f86a6d8161\":\"musterring-mr-isabelle\",\"05c4c4d1c541c18ecb26cea885674cea3551e0cc50c7a06c7fd93e4bd2c34f09\":\"musterring-mr-isabelle\",\"60fef07056ffa2e6986784fe6ccdecf53d8760b29a3c6f283a5b156d58059415\":\"musterring-mr-isabelle\",\"fb5f08cd093e49995c05e19ad092b3a20d4bd8f51a7908268ec9cb275ba4cd84\":\"musterring-mr-isabelle\",\"5e85e7198bcd3f3065499a5a984c5a7255e32461b8920bc98bd2b2fef4a9118e\":\"musterring-mr-isabelle\",\"8f254ae61fa5dc68a2f82b25f6339754bfb12b3ea977e87cc9ac8b7ece59a976\":\"musterring-mr-isabelle\",\"31b6a40b631c0aef06c77dbab652f50c1d6dec622e7854217ce92640703c8351\":\"musterring-mr-isabelle\",\"73e11932e4fb74906b0a4724e7ca8d8163bd120213f8fb5963f6bad4a154dedd\":\"musterring-justb-sp100\",\"31166c21018cdef6709618f6089c6b620cab3976630a09d175847e2e4b42158d\":\"musterring-justb-sp100\",\"f21d1a1d8d18a68d311cd5b998678cba1d00227b2e512a634992a270820a75a9\":\"musterring-justb-sp100\",\"14372b2e0e6d9d485a7b28017eeb2d9d359994ca06be1bc8bbc49429d2be6dc4\":\"musterring-justb-sp100\",\"3941a544fa94a4ba11b7b1e711f33621c064f86c1a39412096574e0bfd447290\":\"musterring-justb-sp100\",\"a868e07145168c0ae6dcefba568965757e48874cde719a05e85d0f27e6bb6213\":\"musterring-justb-sp100\",\"c66dc88e76e5ad7249941cbce578491ebe9aceabf5e6836d6472dfe080b19370\":\"musterring-justb-sp100\",\"b6a8e28e236620922c62f0651776c451f95e7f9dda46aa90d0deb075f29f92fd\":\"musterring-justb-sp100\",\"e181ee0e925adb6e8d451476639d5bcee336ba3427b864a48be3555d254a432f\":\"musterring-justb-sp150\",\"af72066677c08d8f6b5f62f57f2689d961a5ad1d21aa8cf3682fc3ae526c80b0\":\"musterring-justb-sp150\",\"2810aa1a3455fe3ab5aa78d6489043d42006284e3a2fa0ad1393d91c8241f063\":\"musterring-justb-sp150\",\"315842c275084139c70f523e1d37b4ed43b8947ae5ef994ed25948c7764dea9b\":\"musterring-justb-sp150\",\"a8724f81b7534e7580c4a0e7499cc951233bd254846cfebe23b4a81ab307a291\":\"musterring-justb-sp150\",\"b7308aed7323b58fc28f01751f82efe66e0c81c672548c33da4e27cb9e1cac0b\":\"musterring-justb-sp150\",\"74051beae75a5da61b2a02d9bada9c1a0ba51431fdcaae50bb31a3963cd03652\":\"musterring-helana\",\"b4abc1f81961cadfb72eec43de284450355205ed993a35ea84e0b9a9626239d5\":\"musterring-helana\",\"c813f501c820a10961e8b1c974353d582145ba15660657114c03c9fe590addcb\":\"musterring-helana\",\"270861e436f889712a3c40ccc1e27d392da6b56ec9b48408735b949ea1ab2c9b\":\"musterring-helana\",\"29fc28f3bd18168f192ce82aac035146c4ba8d93f90c90a0e8cae86303cf287a\":\"musterring-helana\",\"be80ad8966499b5650b07df32e784f5f7652efb01fefb1043aba2a1f0b130aec\":\"musterring-helana\",\"fe419ca0bbdc5b1b176cd82f5a988d4b342bdc572b4ae81d7ff42028d2970f25\":\"musterring-helana\",\"c666116b74f28161e04e145f3525bf4f355f19be7af83a0bb2b45856caf2e463\":\"musterring-helana\",\"e9747a0df645827f0f72b32b939888c6f6674f485a9a66e490e8a5477be01f3c\":\"musterring-helmond\",\"661708362e233b697e840819f986a0c8d1a11d6a6d3fed8ff61d632e27829638\":\"musterring-helmond\",\"6269bd28da35302332c29ffa9818cf64725bfcc57b3538ada5962cf556c92536\":\"musterring-helmond\",\"4e2290cf230afdbfe3815aa3dd925eb3c39510594aa5f2fec0a4d2d252ddb76d\":\"musterring-helmond\",\"d3f809ebf7ebb76bb76fa7ff2045026addbaa56b7507e481320d4b5c8fa77879\":\"musterring-helmond\",\"a4bd025da7fc8eb2a3bb962d4fd91b7a465c261bf8e8ab7d9c1738a5e333ad11\":\"musterring-helmond\",\"4b33f6be8d8c171c4bef45ebb34049b337ecf4ab05d283aaeb4d645a16caa4c4\":\"musterring-helmond\",\"8329488e0db6eaf491dd4eb3c07c62d64c7f054f717a7d2e1a10f151643b5e4f\":\"musterring-helmond\",\"cad45cd65dcded115a839a85ce8d9a892006fa61d6e1d62c036ed09b06c8d6b2\":\"musterring-helvin\",\"d58fee54ec0ce3078456c261b60ed4862c2aa5d4081e8a95a499ab2d61a050ea\":\"musterring-helvin\",\"fbbec1a41913aa5e32bb397f845343d21234342561942cf342e813f89b5cc5a5\":\"musterring-helvin\",\"c9a9bab8527d39c4740d66e57a740fb5d591a53c03688ed58e4126379891dfdb\":\"musterring-helvin\",\"5432fa89556186b65a33e84e4b276d2aa8359a6a815dcc73e16e0a6fe2c8b850\":\"musterring-helvin\",\"7b317ce11e86a7329f2c447e9265651a26f2a6d55266eaf2b60fc0709c6e0465\":\"musterring-navarra\",\"63899f1b9c49bd02526088008ac6a02fbf09fa59bde9deb59fab5fe28b747e0f\":\"musterring-navarra\",\"4970e60d6ac727e91961bcdaec5fc6225e4cd565f7616cd22032ce114b4a44c2\":\"musterring-navarra\",\"c8e2d0f80bb6ed433a383e1a68d2b0f1ac94efc6c301b7b073b667b3318be08a\":\"musterring-navarra\",\"7c93c3b58930223d9fa168ea5ba5b1eb0d121d0b8ec4698ce8e32017a9e609c3\":\"musterring-navarra\",\"d2093a31a0f319ab836791f3df97b9108cb377720ef010e28e2e487ecb31bce2\":\"musterring-navarra\",\"4c8a998b528064cde444bdcc49a47e92f0bbd40b0c4ba95b165eeac06bfd83ab\":\"musterring-navarra\",\"0d932c3b8b36a865f029785d2de87b09e1f7af93dee27c63813ddf828d7af02a\":\"musterring-navarra\",\"938759c14da2d2da923a12dfb9b2ef926573978aea8c56920c40bdf271b669ce\":\"musterring-nerina\",\"45080520a33964786c322d5fe98d22035671bbb1a9a83ba5ac236fa855dbf4a1\":\"musterring-nerina\",\"64b6725cec0a2327722e5d83e8ae0af4c063bad2dcee7d98ab0d80eef368faeb\":\"musterring-nerina\",\"ec06e1b1b41f5c3061067edcb07b60350a1b676c9301c0d1145efff7c251bfeb\":\"musterring-nerina\",\"cb12bf5ad5da0c1ddc96381643c1045cc99110ee30f0ee3971e38c11a07990b9\":\"musterring-nerina\",\"ec77631f1e9563954b4b15cc1a9a177ef27e251a840940ec6a2d594fd29ecdfc\":\"musterring-nerina\",\"2df440cac9bc1e13b7f6f9a082ebb133a5feb3ebc2f5cd5f2665ec97f72d5453\":\"musterring-nevio\",\"9493c92ba0973a0f19c4a97b8beaad2941b76dc608d7b6671376b1c499daeb48\":\"musterring-nevio\",\"da045472e24dd7d778d7d6b750061b0326b0eee4ac25e57ff45edb4e06aaeb9f\":\"musterring-nevio\",\"4b826e9ac41e01f9395d66aa4810cd7672bacfcaf4d38f7036207a602cd61b92\":\"musterring-nevio\",\"738860235ab7eba9e3dd4051ac3fd0098eb7ed3b8b71def9b164da661e92993f\":\"musterring-nevio\",\"a8b7d3d1ab50ab35a8a2b748c9c6f14e92f5de726e13233325c757b67ff89c3d\":\"musterring-nevio\",\"4fdb520ec18e0a6794af8b0dbc005d8c944d456b9945a99bd0e251aeec5580bc\":\"musterring-nevio\",\"1310c9cdbab83123e776a3fb16cc3b15973e4f6ca54ec5cc6378282544c2cc35\":\"musterring-nevio\",\"9162b40794f26e851affef5158ed5ed719c0dfffb2d886bd9f945a01de7ccd45\":\"musterring-nica\",\"cf0f325c3af006f45696d59dd433a6fbc32c284c994cd9beef32f3c55b66d8f2\":\"musterring-nica\",\"bb21c95058c9eb56bd735b979608dfa8a422ff4df1187266e52e47f3268326d3\":\"musterring-nilan\",\"f8092fbbb74f609e1d239d97846b75618a29e8b4e3df8c22fb018b0ebe8dd27f\":\"musterring-nilan\",\"00f4f5a956f5d30e22663a3f4a962ff1588f96fbd88eafaaaa752a33b74a94de\":\"musterring-nilan\",\"469474b4420b64bcc14d671ad80fe258b6f42beddf82db5b8e11404993dbae7a\":\"musterring-nilan\",\"d42114f7a83c018a9e6798dc447a3589c2cb5c72834717922f0575080a0cdf9e\":\"musterring-nilan\",\"211b00dd1ca3f7bd3baf39d86af9ed8b1d35965bb17b4efa5701424626f7c67a\":\"musterring-nova\",\"5849c74cc73fea29b852e48cf66156582de1a9ad5ec98292ebcc56a4cbf3fb54\":\"musterring-nova\",\"57bad1cbf408160a1c05b338740b448bfabafee7e7309fba66c818779151e057\":\"musterring-nova\",\"c922b3de81dbf87651c7a754a9c11e284d899eb52d6b112705da16c3b08472e0\":\"musterring-nova\",\"9b21b9335c25ec0682e6031cfa9a569175c8928626e268305b0c0021bddd7ee4\":\"musterring-nova\",\"0eae0643c830f31b8929c059b540dea2e9b8dbcfd8bb619fbaaa9cf5359d4bf6\":\"musterring-nova\",\"3fffd40a9c355d956c4aaf56c2167be8a6987ff8f4dc3bcc34f3d1d9054b366c\":\"musterring-nova\",\"48d3b1b99191a507ab71cde39c5b297c2fa605be0eb78e642b98c483e9e2faeb\":\"musterring-nova\",\"169a07b12fed49cdf786497dd87e59705b2449293ac54d0226b6bc63d96ce611\":\"musterring-picara\",\"74d6429c44b7b445d4e9c675c3653d8e5c48c8e441ca2ed820ced1b76f649b56\":\"musterring-picara\",\"2eed691cc63619444f84b220c89cc94e065927d305734904d63431f8475bc0cc\":\"musterring-picara\",\"1325d77e3dc3e15314f0fa88b8da5a2c3f4a68110d28787f190c744fe1b6e146\":\"musterring-picara\",\"c8eb672702abb5c244cc9429198ea5e318b8a6c1a09fc2047892b2db60cae174\":\"musterring-picara\",\"f334f8275de28366f5ea31ce21d82d2944dc158b9dd8c614c9a41fb4a51fa59d\":\"musterring-picara\",\"0d9a1f16046b7aeb60f18bf3da11335e185d6d86f937bbe5a9c8f58e3404a8ea\":\"musterring-picara\",\"e2c5250cfc0fadfca6747d09fe0d14a835cc68a6894accf0f950b106d48f141f\":\"musterring-picara\",\"0218c65de8f638754efcfa4bdf5eab0e725c47aba8a9463b6f526a916257d53a\":\"musterring-pinero\",\"e476499ceab144df7c0794ba614139f37ce231a997377e9c57311a5ed0d8073b\":\"musterring-pinero\",\"b2128ceb5e2a142428274d175a5c90dc46e342c320b15219806ff391ae3f97de\":\"musterring-pinero\",\"f46f37a234048729ae0a88824a7a3fbd116849298f29b6d2935127afdc9f79d0\":\"musterring-pinero\",\"4f8f8fd5deb2b33a52f9512263c294f12e913ce4bb7bf9f469050abee6348c9f\":\"musterring-pinero\",\"e5dcc57426419d85e485cedb730804023f02ee3e9e01aabbf75262673a07780b\":\"musterring-pinero\",\"c699f04de7114885ebbefaa27d82dd9d4c476ae7eed73c009c74e138175309c9\":\"musterring-pinero\",\"3e3e504348e0173936740c91966be67f84eb823166a01031f9d97aca080d9a00\":\"musterring-pinero\",\"5dd9826809e5e9029141d572b8a7ea80d7f2ff2dd42771a46db9f0511c0b00cc\":\"musterring-tamina\",\"e7e975802098ea173caa0e6bbd8fe9114737a07d4a36bad02f09a627b653f3d8\":\"musterring-tamina\",\"f6254e792b3ab4ed2201786197b296f44f5a3162d5df1fe882791faac30f7231\":\"musterring-tamina\",\"722409337456c8d534c13228188e7975db239ae6eb228f18ac893d70a4b342c2\":\"musterring-tamina\",\"d476e982221f40dc7a5dccbb5aedd7aebd3f0a29e59bd4a80549d5a7494e439f\":\"musterring-tamina\",\"e01baafbdfb989313eb395f345955487e3ecd3ace7236d49ce70fbb0347e8485\":\"musterring-tamina\",\"4cee215bfc46c2e380b6b3153a57ddf4aedd4436711d74fd5e273e21a3433890\":\"musterring-tamina\",\"f4b1d00a4800b4a87039e0c974b1aa257981950e6c19ec81468a18baba0050e1\":\"musterring-tamina\",\"66513fb1bc36454005af27d1e2a7beb3365346bfb80bea991f740f5b04acdd14\":\"musterring-tario\",\"d701fd5ca7303c947e325282a38c090fe8e3cfab04a9dc2f9321fde02583c105\":\"musterring-tario\",\"3f6e60c928b9590570fe1324d70b307b987c27a48aab51066641fb878b1de3d2\":\"musterring-tario\",\"852e83e31c36c66eaef203456897fae4510d0078a3364acf2ebc6f3bcf1fa1b4\":\"musterring-tario\",\"ea0fcd636e362f5bebdf4cebab1df8d8042aadd96139a4cb6571d1aa3cc5dc6f\":\"musterring-tario\",\"72199e6fd38b555daa6661efdc12bbaabe9e1ac0ba0019e00d4b82e3fde107d3\":\"musterring-tario\",\"18e7119f5c9ab45c39bdb3bef4a679904b85a6748530cb7302f682f92942d788\":\"musterring-tario\",\"6319bb622fd294217caf0c7ae34a28fe5117db2e76c06c8824cd0cac6d34c096\":\"musterring-tario\",\"deffbc15adc352d032daffda00be7675c574fbfd3ee71fa2fa0dae92e1867d5d\":\"musterring-tavia\",\"94b26ccc633f8cc0db9be9b2f56cd9c8fbc90d66e6c803325113841ea4bfb4ca\":\"musterring-tavia\",\"e24d4b5552ad5e3889cfadcd888cdb1f23126d3099cf022430971c737dc8bd7a\":\"musterring-tavia\",\"bf7d30f5288ebd2e1a308238256e6cffba8a1b9ef366702d0dec0223c1ec217b\":\"musterring-tavia\",\"14dfc77fe8b43b762c34e2ec97bfc397fcd300389e36d8888a27b90287f272fa\":\"musterring-tavia\",\"6e6aa8dc70e6fdac5762b7d5bf35f16498c33545a0cbc88a4256d865ad88f2bd\":\"musterring-tavia\",\"8ede714c6dd60acb8aeee7ef6b0735c2e05fa679935ad087e7d44a3b54ec51e9\":\"musterring-tavia\",\"90edee6331c36e55bc384816b5a24e6f0469f61270d6840d555a9873861d658e\":\"musterring-tavia\",\"00bbf75709e1e049d2dfc89b65e7a4897005f5e4ec0d12cf26b594476507d004\":\"musterring-tiama\",\"775fb1f7dad981a453ef60cfb2ef6455cef8e89da9ceaf715bee2ce674497fb2\":\"musterring-tiama\",\"f118cf4b050f9cc8c46c6b76d2269c4041fe3e915da7eb432cf8df44267d5085\":\"musterring-tiama\",\"75c0b034302d14c4c8095a366fba2df42f118da1742903b60002ffcaeaf3b69e\":\"musterring-tiama\",\"6e382bbeaea9492eda915e56c7caa2af452b62675d251082a617fe55f63bd00b\":\"musterring-tiama\",\"fd5d6ae402ad5cea6526b08b065e78bda65160cb53845721bf4cf0c0df38885a\":\"musterring-tiama\",\"8bc71520764e76472ae7ba598310fc88bcafcaef03568f820e8c799a6b2dc729\":\"musterring-tiama\",\"94aa98de00b367db284031ad7dceb29ba1bc42490688cbb5a38644880ecfe50c\":\"musterring-tiama\",\"0d461dbaa402def8022732ed85cfef8b3a4fe97f14c4924d75339e70279249c6\":\"musterring-tjark\",\"8a23d8e668de97aace988aa98acd988accea10ce31754326fd4c7b65db57d79f\":\"musterring-tjark\",\"982fae8b612aea1957cbf82f772d5b644f51386d607125193ebddda8532051c3\":\"musterring-tjark\",\"d5727db062fc74c90a1d7bb0cc8f4795bbe2feedd43a759b559fd7251565470d\":\"musterring-tjark\",\"cd08f63434ffc1a139a85283e75c921fcf7ea13c02d1a6c547cc513e943d57d4\":\"musterring-tjark\",\"c01f3fba4d61e65925521fc5ea544b4d7fb43a668557def470ac243e1f503054\":\"musterring-tjark\",\"7c1c71921ef46d3df673fb83e40240a60e626bbfda4a729b4c0928059ecaf937\":\"musterring-tjark\",\"85351d234fdd36704e425a2d531550d3745c7248fe228e61dc07090792021a21\":\"musterring-tjark\",\"f6a843acb2dc2e0c121b94a7eeb9c25ae342364ead91498338be4332f2ba8ff9\":\"musterring-revento-line\",\"12eb8814bf981abb06a8453bb4ee25e6e74cfb2a4cacab63790f6d51141d7311\":\"musterring-revento-line\",\"d78c87557ef131cf8668172a02332a2b420fba6dc118122122c6af3b8ba9665a\":\"musterring-revento-line\",\"46a8e03309ad886498a9307516ed3ef8518d8843d31cb643cb0eade27571c2de\":\"musterring-revento-line\",\"24757f314f08add8d8483b620c3dd964cfa851c9e09e52b08cc60d8b597e1e42\":\"musterring-revento-line\",\"34a48b9afe3e9a0bd2e017b43f4a757083fce3c9a9438886bd42f321b61d1efa\":\"musterring-revento-line\",\"57885dcb76cbbab072baf11e3039d339766ed749bda902c01539308b1ff7159b\":\"musterring-revento-line\",\"0e3a9b971f1e6010110f81bcd2e57cfea8ea01a54a9c8f895b1f5c8fcec7e120\":\"musterring-revento-line\",\"5eec627b6d26a69411ec01819e26566cc3d927eda3e39671c38614d040d654c5\":\"musterring-riana\",\"3ca7a9f23b07f2e4dd527fab18f1950ad105366af38ba3fc1fef2cb64a6c8dd6\":\"musterring-riana\",\"608674d9ae7f5e05c8e1671dc1238452f21149f3ae0a9562a8eb6d5f81a6ee98\":\"musterring-riana\",\"e9ede7fc6b1e704c3969d68e4aff2a779e6129f3d17a35d7d24183563077d939\":\"musterring-riana\",\"c537916d70ca3ce566bc3a5d8f44e47433d2c4181605179c10b2232a09cdde9e\":\"musterring-riana\",\"0d06d340da39646d3b0db5821a5ab67955d9a319f86f9a60a2633aaa5ff104fb\":\"musterring-riana\",\"080d22ce7acca52fc46696b2bdee15ea31dc0013deef8a60c4bf5376ccb9b330\":\"musterring-riana\",\"42c59f00e18ac5383d1c0b33aa94c6ecc4a71ca413504535c6e5a809a53f8b7d\":\"musterring-riana\",\"332c36058d9cecba121c114d77e539c8a76e7da1c9caf3a0fadf413061a2c724\":\"musterring-freilicht\",\"3718748133dd1a83831f9d04570b1b6db33e67b31ac335ab8029dacbbafcae75\":\"musterring-freilicht\",\"6fa0338ee3e68f7dd35bc114319cd04c20c320fdcce2d8e44b8acad53043eeed\":\"musterring-freilicht\",\"67b3d800b10b84f2dea25e4c445f93f6ea78b50e5c2e2fc445d3841166fb54a8\":\"musterring-freilicht\",\"793fa27ba64d5970c6c65e1c4983621dcdd5949cbf2c29ebf219dcffd34ac371\":\"musterring-freilicht\",\"6e175721577d2b0b2d1552eda0de362f2220dd6c03825a6e92818d2d698e64dc\":\"musterring-freilicht\",\"fbc24ef377526268d1bc15fa26c8d37514967678a9d4860c8b6ed579367c8a21\":\"musterring-freilicht\",\"e6845c2fd6c6b5b0580b8c79c32d10e040124b372fb59e5537bc777d5b2d26e4\":\"musterring-freilicht\",\"fc9143c8021c1500c893104c9237b6ca93cffc6a7f704a4bde3f0ee491f462fd\":\"musterring-summertime\",\"eb72e41818f428b30eb48045a22e02f00774416b397a980dc6e1b43c34a85815\":\"musterring-summertime\",\"bdc36f3a065afab01ac49f2feabbc52ac358597adc668c23cc66107f9c1e0b7a\":\"musterring-summertime\",\"08e9fefb8deda18884d32d7805049ee38667d86d459d5e50b17bf2a270a73a53\":\"musterring-summertime\",\"b626439913ac5e403f03fb781a660f982d16eea26115978551576d05670151c6\":\"musterring-summertime\",\"0c67df1322f50a65b1b03abf41e823ee14e359e596f96f0b61f8aacd377482ee\":\"musterring-summertime\",\"87c20e81c20e0b400825154e7f1f64eb703e4a4350ef2118fafe74c5f9813d7e\":\"musterring-summertime\",\"85dcbaa070147010abcddd317d728f3356d42195600da66ea631ec89e1be52db\":\"musterring-summertime\",\"bb6052836dbbacf9477157e509e575efa98221cf2d58b5729f6ecc6e7de97c68\":\"musterring-helmond-outdoor\",\"9a980d9c68b0ce2a2415046cfae3420eb6df9b2f53afda09f75beea749f49cab\":\"musterring-helmond-outdoor\",\"77b0383e3ba852fac8fa276c05302a82f1bd7ff055973f630ed6bc3cf4b31a75\":\"musterring-helmond-outdoor\",\"f17179f3109cb579f2872c0777f4cf1ab124c285ed7e881eb3b7e1476d287ea8\":\"musterring-helmond-outdoor\",\"9c47cc66c44935dc3d9b7272d4e2779e5a6f543831b41255e76c0223054effb1\":\"musterring-justb-od100\",\"2cb003aed547edbf8bc62cbc14bbf3a2eeacd5a5c056e706d6c2ca57267bc835\":\"musterring-justb-od100\",\"1b5b3419a623737c6fcd8de21b35ed4be94f2ced5aba5e623e094dbc615894ba\":\"musterring-justb-od100\",\"030a699245f4dd38feb0fcbb5f5be46cbab85ec120663bc4ff2bd610db5d3931\":\"musterring-justb-od100\",\"d4e9f19b5b545f87b1ded8c6b5caa7ee0f807d5a7d82ab8e93441ce80e860ce9\":\"musterring-justb-od100\",\"c1c8624f58feb7e53aa2d98572dac744fc92cb18c5263b53980e38f8536cbdfa\":\"musterring-justb-km100\",\"2cc0ed079d129eb424c6a2df675ea2d97269feb1bfbfc6ffcfa7b8d0c1e5e99b\":\"musterring-justb-km100\",\"ac1dd483ab1fa22f264bed37ac096d186c2145800078875f88d492a8032e9e63\":\"musterring-justb-km100\",\"b3a15751bc083444c4e684d3c7cf2b2363f81339ded93d197579cd92267be8d9\":\"musterring-justb-km100\",\"603a3d12fdf90b2c955cf49ac0947ce65f2949fbfb036d28d68dfe9fd6c24247\":\"musterring-justb-km100\",\"cf337f1d14f2dc6ddc8f917e34f7f8a361914d81cea5a317c616a4a75c348ba9\":\"musterring-justb-km100\",\"5d1c1f3288d1b26e17151db2b23193ecd967e0070b74b2378ff157bb181f45d8\":\"musterring-justb-km100\",\"edd9b40ce6efb09c022ec7dc11154268d86c2fe7a802665dceb27713959f5e99\":\"musterring-justb-km100\",\"a6344cea9f9ffd4f88604937d49d0863cbadd22fe167529fe4fac9258b215051\":\"musterring-deluxe-collection\",\"2ab877aedce48246949a76cb4818369e62a8ad85c604555b1c6ca1a5d7e543b7\":\"musterring-deluxe-collection\",\"9cab79286ea4e7e22e1a871afb7342754b39eb4ac315546fcac86916408eaab6\":\"musterring-deluxe-collection\",\"7dff288866fb9594768d61b36a1c389febada69544386e3eb8773966f0395580\":\"musterring-deluxe-collection\",\"9eaf26602e0e257c14e76e6b35c610a577486f8a7bfcd9a0a4551971485a429e\":\"musterring-deluxe-collection\",\"00dca2668c017fdf108833127e60d459bb5daf9dc872f0f734076654fb1d2b48\":\"musterring-deluxe-collection\",\"1a0fd5440ecfe878a5610b4bb185acf0551a804e8d7f6c5d6f88bf7e30ff71c6\":\"musterring-deluxe-collection\",\"bd8aa19218755c9410e01b984a80f69d07318c395ed7f1db298921fa424b302a\":\"musterring-mr-bergen\",\"36ce82510e47ce397bf7fee21c9b281ebc9124462d30425172bede1c7d59f7ee\":\"musterring-mr-bergen\",\"c0847018ac76708a7a9c3036efbe2f75cd0887a5e506d58f5b1bf574d93b5770\":\"musterring-mr-bergen\",\"44703c7ccb847217e0e1e33b2cc9636bdb1adcfaad18d4b591b17f2d54f81022\":\"musterring-mr-bergen\",\"2f357ca15c336510b6f1301bb44ce06e52cc5302e274d921377778d4ef942333\":\"musterring-mr-bergen\",\"f219926384c51c11d9f8865c1f1a9a02f9591f9c9edb86f0e9dece9e5ec7874d\":\"musterring-mr-bergen\",\"7cc21b3fbc0513437ee6d94e3af6bf83678e438b1c1eed9c8c42fc3c59614149\":\"musterring-mr-bergen\",\"e8aa7d3c7e149b8add727305b6073ea51628db1450176f4645d18dbb8e2f1737\":\"musterring-mr-bergen\",\"2c85ef67fd4fc370846075a06fb5d87da7adb182348d8e77f977e8f2ff000554\":\"musterring-justb-carpets\",\"96e4e7a610bc6985c136b2c0a1f4405bac30bb844b65d2ca78d04a6829d9e0e3\":\"musterring-justb-carpets\",\"5ea7fb87629679a0271597c44b99444cbca40d50131c38cff388e58652fc9ba4\":\"musterring-justb-carpets\",\"5b98a36641232c1a9e850f20aec7d725ae8b8b48326d4e4698478db6686a806d\":\"musterring-justb-carpets\",\"524cc98ecefeeae04fa69e6612d37906c749e0a84b08efa51cfa28a41b761dfa\":\"musterring-justb-carpets\",\"38e7a99e8a0b84610dcb8e8ce6f2b21210ff6acd89635f6408575ccfff7309a5\":\"musterring-justb-carpets\",\"cf78fdc186b8de7214986b033961dd84a581ed0a97ed80df4280780976d39a84\":\"musterring-justb-carpets\",\"e3f421fe843d0c1fc0f437aa4cd3f70fad47d3b978693def1bdaf812f624f695\":\"musterring-justb-carpets\",\"d866b5edbf3874db3831fa613d9a30874976d8d642ac05cd793a27be8f829ec3\":\"musterring-lamps-20\",\"9e5e91667928f9a52e9c99fe8168c643c6c2a95b2531347735edc32ca8af1254\":\"musterring-lamps-20\",\"d0307750a8333ce9957540da39b31076d352ec5f188318689444663fe7d1be6f\":\"musterring-lamps-20\",\"b1d6d511667b284eb01681015ded6331e5dea2b754dbe4a77277742d887b3988\":\"musterring-lamps-20\",\"051dc6b6912f393a1d973b02e01e4c85e2f9dbe854f316b408e3724f0c79ddff\":\"musterring-lamps-20\",\"54b0f9ed646d00e437c990ce5203f5324f9696d3014910d204821c6ce03e1ff2\":\"musterring-lamps-20\",\"26f30ec7ee9bbf143c716e39aba1a985796da8132ba0e348f4d37394752266d6\":\"musterring-lamps-20\",\"c3cc00f50f34e5cb802738bb78b62bef72699fb99e79235a42e99ecad0c397fe\":\"musterring-lamps-20\",\"b21b5e0f20f718c60b68f88ac6d0fd2b43d6b919d642d4d1ddeb03be54fed3ec\":\"p4\",\"0456643cbbf8404d509b162aa4171846c0ea7381aa30a0f280692635ca4e11b7\":\"musterring-tiama\",\"06477e2a66533b2bee6f20f4a20a16a0ce04a8d32f2eac1e1e1ce447aa55b941\":\"musterring-revento-line\",\"a326eb6ffb5dff39029125a26b09c3e3e9c5c118c7e5a2e3c9df7c649ec6974f\":\"musterring-jovanna\",\"899e7635815c7bbd1b8812b4c1bea14581e8019e7a9f9fc2bc792867554f2e04\":\"musterring-justb-pm100\",\"5c95d5907982150daa6469842c4d26fa39132e7bbb5d0716d7b8dcdb4717510c\":\"musterring-justb-pm200\",\"14f3edb66ee6ee903fff2f39cc6f1a3236d0e5c47262f697283ecfc23170e595\":\"musterring-mr-kleo\",\"65117bc23844ee7f3c6586af0bb0d30c48686b308d789c8b61d89d32b4d83155\":\"musterring-mr-alena\",\"e998c4bd14b5e08670e7425a1bb54cbadfe26669e9df2802b5846c9bc430dfb3\":\"musterring-mr-lucia\",\"de44e1b4a77953a2ee557d63133c426ff8b2e6e2ce2fa7a9f7b24c43f6d9c979\":\"p4\",\"3e32f0f395d4c63345345e3912cdabdc508d18806a286da96d2d540a991d1ed1\":\"musterring-justb-km100\",\"eb51c7a28f2ea0bb77ca49186876c5a687f1c7e6602c43a3865d2dbbfe6159cc\":\"musterring-mr-260\"}"));}),
"[project]/app/api/ai/image/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai/schemas.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$providers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai/providers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$retrieval$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai/retrieval.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generated$2f$visual$2d$image$2d$hashes$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/lib/generated/visual-image-hashes.json (json)");
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
function sha256(buffer) {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])("sha256").update(buffer).digest("hex");
}
function exactCatalogueProduct(buffer) {
    const productId = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generated$2f$visual$2d$image$2d$hashes$2e$json__$28$json$29$__["default"][sha256(buffer)];
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"].find((product)=>product.active && product.id === productId) ?? null;
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
    const observedColors = (()=>{
        try {
            const parsed = JSON.parse(String(form?.get("observedColors") ?? "[]"));
            return Array.isArray(parsed) ? parsed.filter((color)=>typeof color === "string").slice(0, 3) : [];
        } catch  {
            return [];
        }
    })();
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
    const exactProduct = exactCatalogueProduct(buffer);
    const analysis = exactProduct ? null : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$providers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withDemoFallback"])((provider)=>withTimeout(provider.analyzeProductImage(toDataUrl(file, buffer)), 8000));
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
        colorFamilies: observedColors.length ? observedColors : analysis.data.colorFamilies,
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
        matches: matches.map(({ product, score, reasons })=>{
            const matchingColors = tags.colorFamilies.filter((color)=>product.colors.includes(color.toLowerCase()));
            const matchingStyles = tags.style.filter((style)=>product.styles.some((candidate)=>candidate.includes(style) || style.includes(candidate)));
            const matchingMaterial = !tags.likelyMaterial || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["materials"].some((material)=>product.materials.includes(material.id) && material.type === tags.likelyMaterial);
            const differences = product.id === exactProduct?.id ? [] : [
                "no identical catalogue image was found",
                "the exact module layout and proportions cannot be confirmed from the uploaded photo",
                "dimensions and upholstery identity require catalogue or retailer confirmation",
                ...!matchingColors.length ? [
                    `recorded colours differ from the detected ${tags.colorFamilies.join(", ")} palette`
                ] : [],
                ...!matchingStyles.length ? [
                    "the recorded style is not an exact metadata match"
                ] : [],
                ...!matchingMaterial ? [
                    `the detected ${tags.likelyMaterial} material is not recorded for this product`
                ] : []
            ];
            return {
                product,
                reasons: reasons.length ? reasons : [
                    "same selected furniture category"
                ],
                differences,
                label: product.id === exactProduct?.id ? "Exact Catalogue Image" : score >= 80 ? "Excellent Visual Match" : score >= 65 ? "Strong Match" : score >= 50 ? "Similar Shape" : score >= 30 ? "Similar Material" : "Related Style"
            };
        }),
        ai: {
            provider: analysis?.provider ?? "catalogue",
            fallback: analysis?.fallback ?? false,
            mode: exactProduct ? "Exact catalogue image match" : analysis?.provider === "openai" ? "Provider-backed AI" : "Deterministic demo AI"
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f1f9c2f0._.js.map