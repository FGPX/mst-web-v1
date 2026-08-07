(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/ConfirmationClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConfirmationClient",
    ()=>ConfirmationClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/persistence.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function ConfirmationClient() {
    var _project_productIds, _project_configurationIds, _project_roomScenes_at, _project_roomScenes;
    _s();
    const [lead, setLead] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConfirmationClient.useEffect": ()=>setLead(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storage"].lastLead())
    }["ConfirmationClient.useEffect"], []);
    var _dealers_find;
    const dealer = (_dealers_find = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dealers"].find((item)=>item.id === (lead === null || lead === void 0 ? void 0 : lead.dealerId))) !== null && _dealers_find !== void 0 ? _dealers_find : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dealers"][0];
    const project = lead === null || lead === void 0 ? void 0 : lead.project;
    var _lead_reference, _lead_requestType, _project_roomScenes_at_name, _lead_appointment;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "section",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "eyebrow",
                    children: "Demo-mode confirmation"
                }, void 0, false, {
                    fileName: "[project]/components/ConfirmationClient.tsx",
                    lineNumber: 13,
                    columnNumber: 66
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "h2",
                    children: [
                        "Your project request is ready for ",
                        dealer.name,
                        "."
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ConfirmationClient.tsx",
                    lineNumber: 13,
                    columnNumber: 115
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "card card-body",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Reference number:"
                                }, void 0, false, {
                                    fileName: "[project]/components/ConfirmationClient.tsx",
                                    lineNumber: 13,
                                    columnNumber: 222
                                }, this),
                                " ",
                                String((_lead_reference = lead === null || lead === void 0 ? void 0 : lead.reference) !== null && _lead_reference !== void 0 ? _lead_reference : "MR-DEMO-PENDING")
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ConfirmationClient.tsx",
                            lineNumber: 13,
                            columnNumber: 219
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Retailer:"
                                }, void 0, false, {
                                    fileName: "[project]/components/ConfirmationClient.tsx",
                                    lineNumber: 13,
                                    columnNumber: 310
                                }, this),
                                " ",
                                dealer.name,
                                ", ",
                                dealer.city
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ConfirmationClient.tsx",
                            lineNumber: 13,
                            columnNumber: 307
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Request type:"
                                }, void 0, false, {
                                    fileName: "[project]/components/ConfirmationClient.tsx",
                                    lineNumber: 13,
                                    columnNumber: 372
                                }, this),
                                " ",
                                String((_lead_requestType = lead === null || lead === void 0 ? void 0 : lead.requestType) !== null && _lead_requestType !== void 0 ? _lead_requestType : "Demo request")
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ConfirmationClient.tsx",
                            lineNumber: 13,
                            columnNumber: 369
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Products:"
                                }, void 0, false, {
                                    fileName: "[project]/components/ConfirmationClient.tsx",
                                    lineNumber: 13,
                                    columnNumber: 455
                                }, this),
                                " ",
                                (project === null || project === void 0 ? void 0 : (_project_productIds = project.productIds) === null || _project_productIds === void 0 ? void 0 : _project_productIds.join(", ")) || "No saved Product IDs"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ConfirmationClient.tsx",
                            lineNumber: 13,
                            columnNumber: 452
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Configuration ID:"
                                }, void 0, false, {
                                    fileName: "[project]/components/ConfirmationClient.tsx",
                                    lineNumber: 13,
                                    columnNumber: 548
                                }, this),
                                " ",
                                (project === null || project === void 0 ? void 0 : (_project_configurationIds = project.configurationIds) === null || _project_configurationIds === void 0 ? void 0 : _project_configurationIds.join(", ")) || "No saved configuration"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ConfirmationClient.tsx",
                            lineNumber: 13,
                            columnNumber: 545
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Room scene:"
                                }, void 0, false, {
                                    fileName: "[project]/components/ConfirmationClient.tsx",
                                    lineNumber: 13,
                                    columnNumber: 657
                                }, this),
                                " ",
                                (_project_roomScenes_at_name = project === null || project === void 0 ? void 0 : (_project_roomScenes = project.roomScenes) === null || _project_roomScenes === void 0 ? void 0 : (_project_roomScenes_at = _project_roomScenes.at(-1)) === null || _project_roomScenes_at === void 0 ? void 0 : _project_roomScenes_at.name) !== null && _project_roomScenes_at_name !== void 0 ? _project_roomScenes_at_name : "No saved room scene"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ConfirmationClient.tsx",
                            lineNumber: 13,
                            columnNumber: 654
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Appointment preference:"
                                }, void 0, false, {
                                    fileName: "[project]/components/ConfirmationClient.tsx",
                                    lineNumber: 13,
                                    columnNumber: 753
                                }, this),
                                " ",
                                String((_lead_appointment = lead === null || lead === void 0 ? void 0 : lead.appointment) !== null && _lead_appointment !== void 0 ? _lead_appointment : "To be confirmed")
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ConfirmationClient.tsx",
                            lineNumber: 13,
                            columnNumber: 750
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Expected next step:"
                                }, void 0, false, {
                                    fileName: "[project]/components/ConfirmationClient.tsx",
                                    lineNumber: 13,
                                    columnNumber: 849
                                }, this),
                                " This concept stores the request locally. Production delivery and appointment confirmation require Musterring CRM, email and booking integration."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ConfirmationClient.tsx",
                            lineNumber: 13,
                            columnNumber: 846
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ConfirmationClient.tsx",
                    lineNumber: 13,
                    columnNumber: 187
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "chips",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            className: "button primary",
                            href: "/my-musterring",
                            children: "View in My Musterring"
                        }, void 0, false, {
                            fileName: "[project]/components/ConfirmationClient.tsx",
                            lineNumber: 13,
                            columnNumber: 1063
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "button ghost",
                            onClick: ()=>window.print(),
                            children: "Download Project Summary"
                        }, void 0, false, {
                            fileName: "[project]/components/ConfirmationClient.tsx",
                            lineNumber: 13,
                            columnNumber: 1146
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            className: "button ghost",
                            href: "/dealers",
                            children: "Select Alternative Retailer"
                        }, void 0, false, {
                            fileName: "[project]/components/ConfirmationClient.tsx",
                            lineNumber: 13,
                            columnNumber: 1243
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ConfirmationClient.tsx",
                    lineNumber: 13,
                    columnNumber: 1040
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ConfirmationClient.tsx",
            lineNumber: 13,
            columnNumber: 39
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ConfirmationClient.tsx",
        lineNumber: 13,
        columnNumber: 10
    }, this);
}
_s(ConfirmationClient, "dqS61bgw3Shgak72I7wtF45Bayk=");
_c = ConfirmationClient;
var _c;
__turbopack_context__.k.register(_c, "ConfirmationClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_ConfirmationClient_tsx_00337ba8._.js.map