module.exports = [
"[project]/lib/fit-simulator.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analyzePlacement",
    ()=>analyzePlacement,
    "buildComponents",
    ()=>buildComponents,
    "calculateScale",
    ()=>calculateScale,
    "collidesWithDoorSwing",
    ()=>collidesWithDoorSwing,
    "collidesWithItem",
    ()=>collidesWithItem,
    "collidesWithWall",
    ()=>collidesWithWall,
    "doorHingePoint",
    ()=>doorHingePoint,
    "evaluateDelivery",
    ()=>evaluateDelivery,
    "largestComponent",
    ()=>largestComponent,
    "normalizeRotation",
    ()=>normalizeRotation,
    "polygonsOverlap",
    ()=>polygonsOverlap,
    "rotatedCorners",
    ()=>rotatedCorners,
    "suggestPlacements",
    ()=>suggestPlacements,
    "wallDistances",
    ()=>wallDistances
]);
const EPSILON = 0.001;
function calculateScale(roomWidth, roomLength, viewportWidth, viewportHeight, padding = 64) {
    const drawableWidth = Math.max(1, viewportWidth - padding * 2);
    const drawableHeight = Math.max(1, viewportHeight - padding * 2);
    return Math.min(drawableWidth / roomWidth, drawableHeight / roomLength);
}
function normalizeRotation(rotation) {
    return (rotation % 360 + 360) % 360;
}
function rotatedCorners(placement, width, depth) {
    const radians = normalizeRotation(placement.rotation) * Math.PI / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const halfWidth = width / 2;
    const halfDepth = depth / 2;
    return [
        {
            x: -halfWidth,
            y: -halfDepth
        },
        {
            x: halfWidth,
            y: -halfDepth
        },
        {
            x: halfWidth,
            y: halfDepth
        },
        {
            x: -halfWidth,
            y: halfDepth
        }
    ].map((point)=>({
            x: placement.x + point.x * cos - point.y * sin,
            y: placement.y + point.x * sin + point.y * cos
        }));
}
function project(points, axis) {
    const values = points.map((point)=>point.x * axis.x + point.y * axis.y);
    return {
        min: Math.min(...values),
        max: Math.max(...values)
    };
}
function polygonsOverlap(a, b) {
    const polygons = [
        a,
        b
    ];
    for (const polygon of polygons){
        for(let index = 0; index < polygon.length; index += 1){
            const next = polygon[(index + 1) % polygon.length];
            const edge = {
                x: next.x - polygon[index].x,
                y: next.y - polygon[index].y
            };
            const axis = {
                x: -edge.y,
                y: edge.x
            };
            const pa = project(a, axis);
            const pb = project(b, axis);
            if (pa.max <= pb.min + EPSILON || pb.max <= pa.min + EPSILON) return false;
        }
    }
    return true;
}
function wallDistances(roomWidth, roomLength, placement, width, depth) {
    const corners = rotatedCorners(placement, width, depth);
    const xs = corners.map((point)=>point.x);
    const ys = corners.map((point)=>point.y);
    return {
        left: Math.min(...xs),
        right: roomWidth - Math.max(...xs),
        top: Math.min(...ys),
        bottom: roomLength - Math.max(...ys)
    };
}
function collidesWithWall(roomWidth, roomLength, placement, width, depth) {
    return Object.values(wallDistances(roomWidth, roomLength, placement, width, depth)).some((distance)=>distance < -EPSILON);
}
function collidesWithItem(placement, width, depth, item) {
    const product = rotatedCorners(placement, width, depth);
    const obstacle = [
        {
            x: item.x,
            y: item.y
        },
        {
            x: item.x + item.width,
            y: item.y
        },
        {
            x: item.x + item.width,
            y: item.y + item.depth
        },
        {
            x: item.x,
            y: item.y + item.depth
        }
    ];
    return polygonsOverlap(product, obstacle);
}
function distanceToSegment(point, a, b) {
    const lengthSquared = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
    if (!lengthSquared) return Math.hypot(point.x - a.x, point.y - a.y);
    const t = Math.max(0, Math.min(1, ((point.x - a.x) * (b.x - a.x) + (point.y - a.y) * (b.y - a.y)) / lengthSquared));
    return Math.hypot(point.x - (a.x + t * (b.x - a.x)), point.y - (a.y + t * (b.y - a.y)));
}
function doorHingePoint(door, roomWidth, roomLength) {
    const along = door.hinge === "left" ? door.position : door.position + door.width;
    if (door.wall === "north") return {
        x: along,
        y: 0
    };
    if (door.wall === "south") return {
        x: along,
        y: roomLength
    };
    if (door.wall === "west") return {
        x: 0,
        y: along
    };
    return {
        x: roomWidth,
        y: along
    };
}
function collidesWithDoorSwing(roomWidth, roomLength, placement, width, depth, door) {
    if (door.opens === "outward") return false;
    const hinge = doorHingePoint(door, roomWidth, roomLength);
    const corners = rotatedCorners(placement, width, depth);
    const edges = corners.map((point, index)=>[
            point,
            corners[(index + 1) % corners.length]
        ]);
    return corners.some((point)=>Math.hypot(point.x - hinge.x, point.y - hinge.y) <= door.width) || edges.some(([a, b])=>distanceToSegment(hinge, a, b) <= door.width);
}
function buildComponents(product, removedParts = []) {
    const moduleCount = product.modular ? Math.max(2, Math.min(4, product.numberOfSeats || 3)) : 1;
    const components = Array.from({
        length: moduleCount
    }, (_, index)=>({
            id: `${product.id}-module-${index + 1}`,
            name: moduleCount === 1 ? "Assembled product" : `Module ${index + 1}`,
            width: Math.ceil(product.widthMm / moduleCount),
            depth: product.packageDimensions.depthMm,
            height: product.packageDimensions.heightMm,
            removable: moduleCount > 1
        }));
    if (!removedParts.includes("legs")) components.push({
        id: "legs",
        name: "Attached legs",
        width: 180,
        depth: 180,
        height: 120,
        removable: true
    });
    if (!removedParts.includes("armrests")) components[0] = {
        ...components[0],
        width: components[0].width + 160,
        name: `${components[0].name} + armrest`
    };
    if (!removedParts.includes("backrests")) components[0] = {
        ...components[0],
        height: components[0].height + 140,
        name: `${components[0].name} + backrest`
    };
    return components;
}
function largestComponent(components) {
    return [
        ...components
    ].sort((a, b)=>b.width * b.depth * b.height - a.width * a.depth * a.height)[0];
}
function evaluateDelivery(components, input) {
    const component = largestComponent(components);
    const minOpening = Math.min(component.width, component.depth);
    const passages = [
        {
            id: "entrance",
            name: "Entrance door",
            available: input.entranceWidth,
            required: minOpening,
            height: input.entranceHeight
        },
        {
            id: "hallway",
            name: "Hallway",
            available: input.hallwayWidth,
            required: minOpening
        },
        {
            id: "turn",
            name: "Tightest turn",
            available: input.turnWidth,
            required: Math.min(component.width, Math.hypot(component.depth, component.height))
        },
        {
            id: "stairs",
            name: "Staircase",
            available: input.staircaseWidth,
            required: minOpening
        },
        {
            id: "room-door",
            name: "Room door",
            available: input.roomDoorWidth,
            required: minOpening,
            height: input.roomDoorHeight
        }
    ].map((passage)=>{
        const heightConflict = passage.height !== undefined && passage.height > 0 && passage.height < Math.min(component.height, component.width);
        const delta = passage.available - passage.required;
        return {
            ...passage,
            status: passage.available <= 0 || delta < 0 || heightConflict ? "conflict" : delta < 50 ? "tight" : "safe",
            message: passage.available <= 0 ? "Measurement missing" : heightConflict ? "Height may be insufficient" : delta < 0 ? `${Math.ceil(Math.abs(delta) / 10)} cm more width may be needed` : `${Math.floor(delta / 10)} cm spare width`
        };
    });
    if (input.elevatorWidth || input.elevatorDepth || input.elevatorHeight) {
        const orientations = [
            [
                component.width,
                component.depth,
                component.height
            ],
            [
                component.depth,
                component.height,
                component.width
            ],
            [
                component.height,
                component.width,
                component.depth
            ]
        ];
        const fits = orientations.some(([width, depth, height])=>width <= input.elevatorWidth && depth <= input.elevatorDepth && height <= input.elevatorHeight);
        passages.push({
            id: "elevator",
            name: "Elevator",
            available: Math.min(input.elevatorWidth, input.elevatorDepth),
            required: minOpening,
            height: input.elevatorHeight,
            status: fits ? "safe" : "conflict",
            message: fits ? "Largest component fits in a tested orientation" : "No tested orientation clears all elevator dimensions"
        });
    }
    return {
        component,
        passages,
        narrowest: passages.filter((item)=>item.available > 0).sort((a, b)=>a.available - b.available)[0],
        status: passages.some((item)=>item.status === "conflict") ? "conflict" : passages.some((item)=>item.status === "tight") ? "tight" : "safe"
    };
}
function analyzePlacement(roomWidth, roomLength, product, placement, items, doors) {
    const issues = [];
    const distances = wallDistances(roomWidth, roomLength, placement, product.widthMm, product.depthMm);
    if (collidesWithWall(roomWidth, roomLength, placement, product.widthMm, product.depthMm)) {
        issues.push({
            id: "wall",
            severity: "conflict",
            message: "The product crosses a room boundary."
        });
    } else if (Math.min(...Object.values(distances)) < 50) {
        issues.push({
            id: "wall-clearance",
            severity: "tight",
            message: "Less than 5 cm remains between the product and a wall."
        });
    }
    for (const item of items){
        if (collidesWithItem(placement, product.widthMm, product.depthMm, item)) {
            issues.push({
                id: `item-${item.id}`,
                severity: "conflict",
                message: `${item.name} overlaps the product footprint.`
            });
        }
    }
    for (const door of doors){
        if (collidesWithDoorSwing(roomWidth, roomLength, placement, product.widthMm, product.depthMm, door)) {
            issues.push({
                id: `door-${door.id}`,
                severity: "conflict",
                message: "The product obstructs a door swing."
            });
        }
    }
    const frontClearance = distances.bottom;
    if (frontClearance < 600) issues.push({
        id: "walking",
        severity: frontClearance < 300 ? "conflict" : "tight",
        message: `${Math.max(0, Math.round(frontClearance / 10))} cm walking clearance remains in front.`
    });
    if (product.functions.some((value)=>/relax|reclin/i.test(value)) && distances.top < 250) {
        issues.push({
            id: "recline",
            severity: "tight",
            message: "The backrest may need 25 cm clearance to recline."
        });
    }
    return {
        status: issues.some((item)=>item.severity === "conflict") ? "conflict" : issues.length ? "tight" : "safe",
        issues,
        distances
    };
}
function suggestPlacements(roomWidth, roomLength, product, items, doors) {
    const margin = 100;
    const candidates = [
        {
            x: roomWidth / 2,
            y: product.depthMm / 2 + margin,
            rotation: 0
        },
        {
            x: roomWidth / 2,
            y: roomLength - product.depthMm / 2 - 700,
            rotation: 0
        },
        {
            x: product.depthMm / 2 + margin,
            y: roomLength / 2,
            rotation: 90
        },
        {
            x: roomWidth - product.depthMm / 2 - margin,
            y: roomLength / 2,
            rotation: 90
        },
        {
            x: roomWidth / 2,
            y: roomLength / 2,
            rotation: 0
        }
    ];
    return candidates.map((placement)=>({
            placement,
            analysis: analyzePlacement(roomWidth, roomLength, product, placement, items, doors)
        })).sort((a, b)=>{
        const score = (value)=>value.analysis.issues.reduce((total, issue)=>total + (issue.severity === "conflict" ? 10 : 1), 0);
        return score(a) - score(b);
    }).slice(0, 3);
}
}),
"[project]/components/FitCheckerClient.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FitCheckerClient",
    ()=>FitCheckerClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HighQualityImage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/HighQualityImage.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-ssr] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/box.js [app-ssr] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-help.js [app-ssr] (ecmascript) <export default as HelpCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-ssr] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$move$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Move$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/move.js [app-ssr] (ecmascript) <export default as Move>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$redo$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Redo2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/redo-2.js [app-ssr] (ecmascript) <export default as Redo2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-ssr] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-ssr] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-ssr] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/undo-2.js [app-ssr] (ecmascript) <export default as Undo2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock-open.js [app-ssr] (ecmascript) <export default as Unlock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-in.js [app-ssr] (ecmascript) <export default as ZoomIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-out.js [app-ssr] (ecmascript) <export default as ZoomOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$musterring$2d$assets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/musterring-assets.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/persistence.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fit$2d$simulator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/fit-simulator.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
const STEPS = [
    {
        id: "product",
        label: "Product"
    },
    {
        id: "room",
        label: "Room"
    },
    {
        id: "placement",
        label: "Placement"
    },
    {
        id: "delivery",
        label: "Delivery path"
    },
    {
        id: "result",
        label: "Result"
    }
];
function initialState(product) {
    return {
        room: {
            width: 4000,
            length: 5500,
            height: 2450
        },
        placement: {
            x: 2000,
            y: 2750,
            rotation: 0
        },
        items: [
            {
                id: "radiator-1",
                kind: "radiator",
                name: "Radiator",
                x: 1500,
                y: 0,
                width: 1000,
                depth: 140,
                locked: false
            }
        ],
        doors: [
            {
                id: "door-1",
                wall: "south",
                position: 900,
                width: 850,
                height: 2000,
                hinge: "left",
                opens: "inward"
            }
        ],
        delivery: {
            entranceWidth: 850,
            entranceHeight: 2000,
            hallwayWidth: 1100,
            turnWidth: 1200,
            staircaseWidth: 900,
            elevatorWidth: 0,
            elevatorDepth: 0,
            elevatorHeight: 0,
            roomDoorWidth: 850,
            roomDoorHeight: 2000
        },
        removedParts: product.modular ? [
            "legs"
        ] : []
    };
}
const cm = (value)=>Math.round(value / 10);
const clamp = (value, min, max)=>Math.max(min, Math.min(max, value));
const clone = (state)=>JSON.parse(JSON.stringify(state));
function DimensionInput({ label, value, onChange, min = 0, help }) {
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(String(cm(value)));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>setDraft(String(cm(value))), [
        value
    ]);
    const commitValue = ()=>{
        const parsed = Number(draft);
        if (Number.isFinite(parsed)) onChange(Math.max(min, parsed * 10));
        else setDraft(String(cm(value)));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "fit-field",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: [
                    label,
                    help && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                        title: help,
                        children: "?"
                    }, void 0, false, {
                        fileName: "[project]/components/FitCheckerClient.tsx",
                        lineNumber: 60,
                        columnNumber: 61
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/FitCheckerClient.tsx",
                lineNumber: 60,
                columnNumber: 39
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "fit-unit-input",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        "aria-label": `${label} in centimetres`,
                        type: "number",
                        min: min / 10,
                        value: draft,
                        onChange: (event)=>{
                            setDraft(event.target.value);
                            const parsed = Number(event.target.value);
                            if (event.target.value !== "" && Number.isFinite(parsed)) onChange(Math.max(min, parsed * 10));
                        },
                        onBlur: commitValue,
                        onKeyDown: (event)=>{
                            if (event.key === "Enter") {
                                commitValue();
                                event.currentTarget.blur();
                            }
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/FitCheckerClient.tsx",
                        lineNumber: 60,
                        columnNumber: 131
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                        children: "cm"
                    }, void 0, false, {
                        fileName: "[project]/components/FitCheckerClient.tsx",
                        lineNumber: 64,
                        columnNumber: 130
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/FitCheckerClient.tsx",
                lineNumber: 60,
                columnNumber: 98
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/FitCheckerClient.tsx",
        lineNumber: 60,
        columnNumber: 10
    }, this);
}
function StatusMark({ status }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `fit-status fit-status-${status}`,
        children: [
            status === "safe" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                size: 14
            }, void 0, false, {
                fileName: "[project]/components/FitCheckerClient.tsx",
                lineNumber: 68,
                columnNumber: 83
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                size: 14
            }, void 0, false, {
                fileName: "[project]/components/FitCheckerClient.tsx",
                lineNumber: 68,
                columnNumber: 105
            }, this),
            status
        ]
    }, void 0, true, {
        fileName: "[project]/components/FitCheckerClient.tsx",
        lineNumber: 68,
        columnNumber: 10
    }, this);
}
function FitCheckerClient({ product }) {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>initialState(product));
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("room");
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("room");
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [future, setFuture] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [zoom, setZoom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [pan, setPan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const [dragging, setDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedItem, setSelectedItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [saved, setSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [deliveryProgress, setDeliveryProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(18);
    const svgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const hydrated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const pinchDistance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const components = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fit$2d$simulator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildComponents"])(product, state.removedParts), [
        product,
        state.removedParts
    ]);
    const roomAnalysis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fit$2d$simulator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analyzePlacement"])(state.room.width, state.room.length, product, state.placement, state.items, state.doors), [
        state,
        product
    ]);
    const deliveryAnalysis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fit$2d$simulator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["evaluateDelivery"])(components, state.delivery), [
        components,
        state.delivery
    ]);
    const suggestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fit$2d$simulator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["suggestPlacements"])(state.room.width, state.room.length, product, state.items, state.doors), [
        state.room,
        state.items,
        state.doors,
        product
    ]);
    const selected = state.items.find((item)=>item.id === selectedItem);
    const overall = roomAnalysis.status === "conflict" || deliveryAnalysis.status === "conflict" ? "conflict" : roomAnalysis.status === "tight" || deliveryAnalysis.status === "tight" ? "tight" : "safe";
    const measurementMissing = Object.entries(state.delivery).filter(([, value])=>value <= 0).map(([name])=>name);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const draft = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].fitDraft(product.id);
        if (draft?.state) setState(draft.state);
        hydrated.current = true;
    }, [
        product.id
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!hydrated.current) return;
        const timeout = window.setTimeout(()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].saveFitDraft(product.id, {
                state,
                step,
                updatedAt: new Date().toISOString()
            }), 350);
        return ()=>window.clearTimeout(timeout);
    }, [
        product.id,
        state,
        step
    ]);
    const commit = (updater)=>{
        setHistory((items)=>[
                ...items.slice(-29),
                clone(state)
            ]);
        setFuture([]);
        setState((current)=>updater(current));
        setSaved(false);
    };
    const replace = (updater)=>setState(updater);
    const undo = ()=>{
        const previous = history.at(-1);
        if (!previous) return;
        setFuture((items)=>[
                clone(state),
                ...items
            ]);
        setState(previous);
        setHistory((items)=>items.slice(0, -1));
    };
    const redo = ()=>{
        const next = future[0];
        if (!next) return;
        setHistory((items)=>[
                ...items,
                clone(state)
            ]);
        setState(next);
        setFuture((items)=>items.slice(1));
    };
    const svgPoint = (event)=>{
        const svg = svgRef.current;
        if (!svg) return {
            x: 0,
            y: 0
        };
        const rect = svg.getBoundingClientRect();
        const viewWidth = state.room.width / zoom;
        const viewHeight = state.room.length / zoom;
        return {
            x: pan.x + (event.clientX - rect.left) / rect.width * viewWidth,
            y: pan.y + (event.clientY - rect.top) / rect.height * viewHeight
        };
    };
    const pointerMove = (event)=>{
        if (!dragging) return;
        const point = svgPoint(event);
        if (dragging === "product") {
            replace((current)=>({
                    ...current,
                    placement: {
                        ...current.placement,
                        x: point.x,
                        y: point.y
                    }
                }));
        } else {
            replace((current)=>({
                    ...current,
                    items: current.items.map((item)=>item.id === dragging && !item.locked ? {
                            ...item,
                            x: point.x - item.width / 2,
                            y: point.y - item.depth / 2
                        } : item)
                }));
        }
    };
    const endDrag = ()=>{
        if (!dragging) return;
        setHistory((items)=>[
                ...items.slice(-29),
                clone(state)
            ]);
        setDragging(null);
    };
    const pinchZoom = (event)=>{
        if (event.touches.length !== 2) {
            pinchDistance.current = null;
            return;
        }
        const distance = Math.hypot(event.touches[0].clientX - event.touches[1].clientX, event.touches[0].clientY - event.touches[1].clientY);
        if (pinchDistance.current) setZoom((value)=>clamp(value * (distance / pinchDistance.current), .6, 2.5));
        pinchDistance.current = distance;
    };
    const keyboardPlacement = (event)=>{
        const stepSize = event.shiftKey ? 100 : 10;
        const movement = {
            ArrowLeft: [
                -stepSize,
                0
            ],
            ArrowRight: [
                stepSize,
                0
            ],
            ArrowUp: [
                0,
                -stepSize
            ],
            ArrowDown: [
                0,
                stepSize
            ]
        };
        if (movement[event.key]) {
            event.preventDefault();
            const [x, y] = movement[event.key];
            commit((current)=>({
                    ...current,
                    placement: {
                        ...current.placement,
                        x: current.placement.x + x,
                        y: current.placement.y + y
                    }
                }));
        }
        if (event.key === "[" || event.key === "]") {
            event.preventDefault();
            rotate(event.key === "[" ? -15 : 15);
        }
    };
    const rotate = (amount)=>commit((current)=>({
                ...current,
                placement: {
                    ...current.placement,
                    rotation: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fit$2d$simulator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeRotation"])(current.placement.rotation + amount)
                }
            }));
    const setRoom = (key, value)=>commit((current)=>({
                ...current,
                room: {
                    ...current.room,
                    [key]: value
                }
            }));
    const setDelivery = (key, value)=>commit((current)=>({
                ...current,
                delivery: {
                    ...current.delivery,
                    [key]: value
                }
            }));
    const addItem = (kind)=>{
        const id = `${kind}-${Date.now()}`;
        commit((current)=>({
                ...current,
                items: [
                    ...current.items,
                    {
                        id,
                        kind,
                        name: kind[0].toUpperCase() + kind.slice(1),
                        x: 350,
                        y: 500,
                        width: kind === "column" ? 350 : 900,
                        depth: kind === "radiator" ? 140 : 400
                    }
                ]
            }));
        setSelectedItem(id);
    };
    const updateSelected = (patch)=>commit((current)=>({
                ...current,
                items: current.items.map((item)=>item.id === selectedItem ? {
                        ...item,
                        ...patch
                    } : item)
            }));
    const updateDoor = (patch)=>commit((current)=>({
                ...current,
                doors: current.doors.map((door, index)=>index === 0 ? {
                        ...door,
                        ...patch
                    } : door)
            }));
    const applySuggestion = (placement)=>commit((current)=>({
                ...current,
                placement
            }));
    const centerProduct = ()=>commit((current)=>({
                ...current,
                placement: {
                    ...current.placement,
                    x: current.room.width / 2,
                    y: current.room.length / 2
                }
            }));
    const snapToWall = ()=>commit((current)=>({
                ...current,
                placement: {
                    ...current.placement,
                    y: product.depthMm / 2 + 50,
                    rotation: 0
                }
            }));
    const resetView = ()=>{
        setZoom(1);
        setPan({
            x: 0,
            y: 0
        });
    };
    const saveReport = ()=>{
        const id = `fit-${product.id}-${Date.now()}`;
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].saveFitReport({
            id,
            productId: product.id,
            productSlug: product.slug,
            state,
            roomAnalysis,
            deliveryAnalysis,
            overall,
            measurementQuality: measurementMissing.length ? "Some optional measurements are missing" : "All requested measurements supplied",
            createdAt: new Date().toISOString()
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].track({
            name: "fit_check_completed",
            productId: product.id
        });
        setSaved(true);
    };
    const downloadReport = ()=>{
        const report = {
            product: product.modelCode,
            state,
            roomAnalysis,
            deliveryAnalysis,
            overall,
            generatedAt: new Date().toISOString(),
            disclaimer: "Planning guidance based on supplied measurements; not an installation guarantee."
        };
        const url = URL.createObjectURL(new Blob([
            JSON.stringify(report, null, 2)
        ], {
            type: "application/json"
        }));
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${product.modelCode.replace(/\s/g, "-")}-fit-report.json`;
        anchor.click();
        URL.revokeObjectURL(url);
    };
    const roomViewWidth = state.room.width / zoom;
    const roomViewHeight = state.room.length / zoom;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "stitch-fit",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "container stitch-fit-head",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "eyebrow",
                        children: "Planning tools"
                    }, void 0, false, {
                        fileName: "[project]/components/FitCheckerClient.tsx",
                        lineNumber: 206,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: [
                            "Will It Fit?",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/components/FitCheckerClient.tsx",
                                lineNumber: 207,
                                columnNumber: 25
                            }, this),
                            "Engineering Accuracy."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FitCheckerClient.tsx",
                        lineNumber: 207,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Plan room placement and the delivery journey for your Musterring ",
                            product.modelCode,
                            ". Results are guidance based on the measurements you provide."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FitCheckerClient.tsx",
                        lineNumber: 208,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/FitCheckerClient.tsx",
                lineNumber: 205,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "container fit-progress",
                "aria-label": "Fit planning steps",
                children: STEPS.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: step === item.id ? "is-active" : "",
                        onClick: ()=>{
                            setStep(item.id);
                            if (item.id === "delivery") setActiveTab("delivery");
                            if (item.id === "room" || item.id === "placement") setActiveTab("room");
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: index + 1
                            }, void 0, false, {
                                fileName: "[project]/components/FitCheckerClient.tsx",
                                lineNumber: 212,
                                columnNumber: 272
                            }, this),
                            item.label
                        ]
                    }, item.id, true, {
                        fileName: "[project]/components/FitCheckerClient.tsx",
                        lineNumber: 212,
                        columnNumber: 37
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/FitCheckerClient.tsx",
                lineNumber: 211,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "container fit-simulator",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "fit-panel fit-input-panel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fit-panel-title",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "eyebrow",
                                                children: step === "delivery" ? "Access route" : "Plan details"
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 217,
                                                columnNumber: 49
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: step === "delivery" ? "Delivery measurements" : "Room editor"
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 217,
                                                columnNumber: 131
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 217,
                                        columnNumber: 44
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "icon-button",
                                        title: "Measurement help",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"], {}, void 0, false, {
                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                            lineNumber: 217,
                                            columnNumber: 266
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 217,
                                        columnNumber: 209
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FitCheckerClient.tsx",
                                lineNumber: 217,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "stitch-fit-product",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HighQualityImage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$musterring$2d$assets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["productImages"])(product.id)[0],
                                        alt: product.name,
                                        width: 110,
                                        height: 86
                                    }, void 0, false, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 218,
                                        columnNumber: 47
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: product.modelCode
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 218,
                                                columnNumber: 140
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                children: [
                                                    product.numberOfSeats || 3,
                                                    "-seater · ",
                                                    product.modular ? "Modular" : "Fixed",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 218,
                                                        columnNumber: 260
                                                    }, this),
                                                    cm(product.widthMm),
                                                    " × ",
                                                    cm(product.depthMm),
                                                    " × ",
                                                    cm(product.heightMm),
                                                    " cm"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 218,
                                                columnNumber: 176
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 218,
                                        columnNumber: 134
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FitCheckerClient.tsx",
                                lineNumber: 218,
                                columnNumber: 11
                            }, this),
                            activeTab === "room" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                        open: true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                                children: [
                                                    "Room dimensions ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                        size: 15
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 221,
                                                        columnNumber: 52
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 221,
                                                columnNumber: 27
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "fit-field-grid",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DimensionInput, {
                                                        label: "Width",
                                                        value: state.room.width,
                                                        min: 1000,
                                                        onChange: (value)=>setRoom("width", value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 222,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DimensionInput, {
                                                        label: "Length",
                                                        value: state.room.length,
                                                        min: 1000,
                                                        onChange: (value)=>setRoom("length", value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 223,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DimensionInput, {
                                                        label: "Height",
                                                        value: state.room.height,
                                                        min: 1000,
                                                        onChange: (value)=>setRoom("height", value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 224,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 221,
                                                columnNumber: 87
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 221,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                        open: true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                                children: [
                                                    "Door ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                        size: 15
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 226,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 226,
                                                columnNumber: 27
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "fit-field-grid",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "fit-field",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Wall"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                                lineNumber: 227,
                                                                columnNumber: 44
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                "aria-label": "Door wall",
                                                                value: state.doors[0].wall,
                                                                onChange: (event)=>updateDoor({
                                                                        wall: event.target.value
                                                                    }),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "north",
                                                                        children: "North"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                                        lineNumber: 227,
                                                                        columnNumber: 199
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "east",
                                                                        children: "East"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                                        lineNumber: 227,
                                                                        columnNumber: 235
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "south",
                                                                        children: "South"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                                        lineNumber: 227,
                                                                        columnNumber: 269
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "west",
                                                                        children: "West"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                                        lineNumber: 227,
                                                                        columnNumber: 305
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                                lineNumber: 227,
                                                                columnNumber: 61
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 227,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DimensionInput, {
                                                        label: "Position",
                                                        value: state.doors[0].position,
                                                        onChange: (value)=>updateDoor({
                                                                position: value
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 228,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DimensionInput, {
                                                        label: "Width",
                                                        value: state.doors[0].width,
                                                        min: 500,
                                                        onChange: (value)=>updateDoor({
                                                                width: value
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 229,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DimensionInput, {
                                                        label: "Height",
                                                        value: state.doors[0].height,
                                                        min: 1000,
                                                        onChange: (value)=>updateDoor({
                                                                height: value
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 230,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "fit-field",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Hinge"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                                lineNumber: 231,
                                                                columnNumber: 44
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                "aria-label": "Door hinge",
                                                                value: state.doors[0].hinge,
                                                                onChange: (event)=>updateDoor({
                                                                        hinge: event.target.value
                                                                    }),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "left",
                                                                        children: "Left"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                                        lineNumber: 231,
                                                                        columnNumber: 204
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "right",
                                                                        children: "Right"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                                        lineNumber: 231,
                                                                        columnNumber: 238
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                                lineNumber: 231,
                                                                columnNumber: 62
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 231,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "fit-field",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Opens"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                                lineNumber: 232,
                                                                columnNumber: 44
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                "aria-label": "Door opening direction",
                                                                value: state.doors[0].opens,
                                                                onChange: (event)=>updateDoor({
                                                                        opens: event.target.value
                                                                    }),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "inward",
                                                                        children: "Inward"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                                        lineNumber: 232,
                                                                        columnNumber: 216
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "outward",
                                                                        children: "Outward"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                                        lineNumber: 232,
                                                                        columnNumber: 254
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                                lineNumber: 232,
                                                                columnNumber: 62
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 232,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 226,
                                                columnNumber: 76
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 226,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                                children: [
                                                    "Objects & restrictions ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                        size: 15
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 234,
                                                        columnNumber: 54
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 234,
                                                columnNumber: 22
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "fit-object-buttons",
                                                children: [
                                                    "radiator",
                                                    "column",
                                                    "obstacle",
                                                    "furniture",
                                                    "restricted"
                                                ].map((kind)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>addItem(kind),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                size: 13
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                                lineNumber: 235,
                                                                columnNumber: 201
                                                            }, this),
                                                            kind
                                                        ]
                                                    }, kind, true, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 235,
                                                        columnNumber: 152
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 235,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "fit-object-list",
                                                children: state.items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: selectedItem === item.id ? "is-active" : "",
                                                        onClick: ()=>setSelectedItem(item.id),
                                                        children: [
                                                            item.locked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                                size: 13
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                                lineNumber: 236,
                                                                columnNumber: 209
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$move$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Move$3e$__["Move"], {
                                                                size: 13
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                                lineNumber: 236,
                                                                columnNumber: 230
                                                            }, this),
                                                            item.name
                                                        ]
                                                    }, item.id, true, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 236,
                                                        columnNumber: 75
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 236,
                                                columnNumber: 15
                                            }, this),
                                            selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "fit-selected-editor",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        "aria-label": "Selected object name",
                                                        value: selected.name,
                                                        onChange: (event)=>updateSelected({
                                                                name: event.target.value
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 238,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "fit-field-grid",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DimensionInput, {
                                                                label: "X",
                                                                value: selected.x,
                                                                onChange: (x)=>updateSelected({
                                                                        x
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                                lineNumber: 239,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DimensionInput, {
                                                                label: "Y",
                                                                value: selected.y,
                                                                onChange: (y)=>updateSelected({
                                                                        y
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                                lineNumber: 239,
                                                                columnNumber: 136
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DimensionInput, {
                                                                label: "Width",
                                                                value: selected.width,
                                                                min: 50,
                                                                onChange: (width)=>updateSelected({
                                                                        width
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                                lineNumber: 239,
                                                                columnNumber: 223
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DimensionInput, {
                                                                label: "Depth",
                                                                value: selected.depth,
                                                                min: 50,
                                                                onChange: (depth)=>updateSelected({
                                                                        depth
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                                lineNumber: 239,
                                                                columnNumber: 335
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 239,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "fit-inline-actions",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>updateSelected({
                                                                        locked: !selected.locked
                                                                    }),
                                                                children: [
                                                                    selected.locked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlock$3e$__["Unlock"], {
                                                                        size: 14
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                                        lineNumber: 240,
                                                                        columnNumber: 141
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                                        size: 14
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                                        lineNumber: 240,
                                                                        columnNumber: 164
                                                                    }, this),
                                                                    selected.locked ? "Unlock" : "Lock"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                                lineNumber: 240,
                                                                columnNumber: 53
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>commit((current)=>({
                                                                            ...current,
                                                                            items: current.items.filter((item)=>item.id !== selected.id)
                                                                        })),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                        size: 14
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                                        lineNumber: 240,
                                                                        columnNumber: 355
                                                                    }, this),
                                                                    "Delete"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                                lineNumber: 240,
                                                                columnNumber: 229
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 240,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 237,
                                                columnNumber: 28
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 234,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "fit-field-grid",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DimensionInput, {
                                                label: "Entrance width",
                                                value: state.delivery.entranceWidth,
                                                onChange: (value)=>setDelivery("entranceWidth", value)
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 245,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DimensionInput, {
                                                label: "Entrance height",
                                                value: state.delivery.entranceHeight,
                                                onChange: (value)=>setDelivery("entranceHeight", value)
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 246,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DimensionInput, {
                                                label: "Hallway width",
                                                value: state.delivery.hallwayWidth,
                                                onChange: (value)=>setDelivery("hallwayWidth", value)
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 247,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DimensionInput, {
                                                label: "Tightest turn",
                                                value: state.delivery.turnWidth,
                                                onChange: (value)=>setDelivery("turnWidth", value)
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 248,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DimensionInput, {
                                                label: "Stair width",
                                                value: state.delivery.staircaseWidth,
                                                onChange: (value)=>setDelivery("staircaseWidth", value)
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 249,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DimensionInput, {
                                                label: "Room door width",
                                                value: state.delivery.roomDoorWidth,
                                                onChange: (value)=>setDelivery("roomDoorWidth", value)
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 250,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 244,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                                children: [
                                                    "Elevator (optional) ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                        size: 15
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 252,
                                                        columnNumber: 51
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 252,
                                                columnNumber: 22
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "fit-field-grid",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DimensionInput, {
                                                        label: "Width",
                                                        value: state.delivery.elevatorWidth,
                                                        onChange: (value)=>setDelivery("elevatorWidth", value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 252,
                                                        columnNumber: 118
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DimensionInput, {
                                                        label: "Depth",
                                                        value: state.delivery.elevatorDepth,
                                                        onChange: (value)=>setDelivery("elevatorDepth", value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 252,
                                                        columnNumber: 245
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DimensionInput, {
                                                        label: "Height",
                                                        value: state.delivery.elevatorHeight,
                                                        onChange: (value)=>setDelivery("elevatorHeight", value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 252,
                                                        columnNumber: 372
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 252,
                                                columnNumber: 86
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 252,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                        open: true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                                children: [
                                                    "Delivery configuration ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                        size: 15
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 253,
                                                        columnNumber: 59
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 253,
                                                columnNumber: 27
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "fit-note",
                                                children: [
                                                    "The check uses the largest delivery component: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                        children: deliveryAnalysis.component.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 254,
                                                        columnNumber: 86
                                                    }, this),
                                                    ", ",
                                                    cm(deliveryAnalysis.component.width),
                                                    " × ",
                                                    cm(deliveryAnalysis.component.depth),
                                                    " × ",
                                                    cm(deliveryAnalysis.component.height),
                                                    " cm."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 254,
                                                columnNumber: 15
                                            }, this),
                                            [
                                                "legs",
                                                "armrests",
                                                "backrests"
                                            ].map((part)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "fit-check",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            checked: state.removedParts.includes(part),
                                                            onChange: ()=>commit((current)=>({
                                                                        ...current,
                                                                        removedParts: current.removedParts.includes(part) ? current.removedParts.filter((value)=>value !== part) : [
                                                                            ...current.removedParts,
                                                                            part
                                                                        ]
                                                                    }))
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                                            lineNumber: 255,
                                                            columnNumber: 104
                                                        }, this),
                                                        "Remove ",
                                                        part,
                                                        " for delivery"
                                                    ]
                                                }, part, true, {
                                                    fileName: "[project]/components/FitCheckerClient.tsx",
                                                    lineNumber: 255,
                                                    columnNumber: 64
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 253,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FitCheckerClient.tsx",
                        lineNumber: 216,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "fit-canvas-column",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fit-tabs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: activeTab === "room" ? "is-active" : "",
                                        onClick: ()=>{
                                            setActiveTab("room");
                                            setStep("placement");
                                        },
                                        children: "Room placement"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 261,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: activeTab === "delivery" ? "is-active" : "",
                                        onClick: ()=>{
                                            setActiveTab("delivery");
                                            setStep("delivery");
                                        },
                                        children: "Delivery path"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 261,
                                        columnNumber: 184
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FitCheckerClient.tsx",
                                lineNumber: 261,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fit-toolbar",
                                "aria-label": "Canvas tools",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        title: "Undo",
                                        disabled: !history.length,
                                        onClick: undo,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo2$3e$__["Undo2"], {}, void 0, false, {
                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                            lineNumber: 263,
                                            columnNumber: 76
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 263,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        title: "Redo",
                                        disabled: !future.length,
                                        onClick: redo,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$redo$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Redo2$3e$__["Redo2"], {}, void 0, false, {
                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                            lineNumber: 263,
                                            columnNumber: 156
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 263,
                                        columnNumber: 94
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 264,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        title: "Pan left",
                                        onClick: ()=>setPan((value)=>({
                                                    ...value,
                                                    x: Math.max(0, value.x - roomViewWidth * .1)
                                                })),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {}, void 0, false, {
                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                            lineNumber: 265,
                                            columnNumber: 134
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 265,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        title: "Pan right",
                                        onClick: ()=>setPan((value)=>({
                                                    ...value,
                                                    x: Math.min(Math.max(0, state.room.width - roomViewWidth), value.x + roomViewWidth * .1)
                                                })),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {}, void 0, false, {
                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                            lineNumber: 265,
                                            columnNumber: 322
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 265,
                                        columnNumber: 156
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        title: "Zoom out",
                                        onClick: ()=>setZoom((value)=>clamp(value - .2, .6, 2.5)),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__["ZoomOut"], {}, void 0, false, {
                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                            lineNumber: 266,
                                            columnNumber: 101
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 266,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: [
                                            Math.round(zoom * 100),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 266,
                                        columnNumber: 121
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        title: "Zoom in",
                                        onClick: ()=>setZoom((value)=>clamp(value + .2, .6, 2.5)),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__["ZoomIn"], {}, void 0, false, {
                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                            lineNumber: 266,
                                            columnNumber: 240
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 266,
                                        columnNumber: 153
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        title: "Reset view",
                                        onClick: resetView,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {}, void 0, false, {
                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                            lineNumber: 266,
                                            columnNumber: 306
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 266,
                                        columnNumber: 259
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FitCheckerClient.tsx",
                                lineNumber: 262,
                                columnNumber: 11
                            }, this),
                            activeTab === "room" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fit-plan-wrap",
                                onKeyDown: keyboardPlacement,
                                tabIndex: 0,
                                "aria-label": "Interactive room plan. Use arrow keys to move the product, shift plus arrows for larger moves, and square brackets to rotate.",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        ref: svgRef,
                                        className: "fit-room-svg",
                                        role: "img",
                                        "aria-labelledby": "fit-room-title fit-room-desc",
                                        viewBox: `${pan.x} ${pan.y} ${roomViewWidth} ${roomViewHeight}`,
                                        onPointerMove: pointerMove,
                                        onPointerUp: endDrag,
                                        onPointerLeave: endDrag,
                                        onTouchMove: pinchZoom,
                                        onTouchEnd: ()=>{
                                            pinchDistance.current = null;
                                        },
                                        onWheel: (event)=>{
                                            event.preventDefault();
                                            setZoom((value)=>clamp(value + (event.deltaY < 0 ? .1 : -.1), .6, 2.5));
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                                                id: "fit-room-title",
                                                children: `Top-down room placement for ${product.modelCode}`
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 271,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("desc", {
                                                id: "fit-room-desc",
                                                children: `${state.room.width / 1000} by ${state.room.length / 1000} metre room. Placement status is ${roomAnalysis.status}.`
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 272,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pattern", {
                                                        id: "fit-grid-small",
                                                        width: "100",
                                                        height: "100",
                                                        patternUnits: "userSpaceOnUse",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M 100 0 L 0 0 0 100",
                                                            fill: "none",
                                                            stroke: "#dedbd5",
                                                            strokeWidth: "5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                                            lineNumber: 273,
                                                            columnNumber: 105
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 273,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pattern", {
                                                        id: "fit-grid",
                                                        width: "500",
                                                        height: "500",
                                                        patternUnits: "userSpaceOnUse",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                                width: "500",
                                                                height: "500",
                                                                fill: "url(#fit-grid-small)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                                lineNumber: 273,
                                                                columnNumber: 270
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M 500 0 L 0 0 0 500",
                                                                fill: "none",
                                                                stroke: "#c8c3bb",
                                                                strokeWidth: "8"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                                lineNumber: 273,
                                                                columnNumber: 331
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 273,
                                                        columnNumber: 192
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 273,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                width: state.room.width,
                                                height: state.room.length,
                                                fill: "#fbf9f4"
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 274,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                width: state.room.width,
                                                height: state.room.length,
                                                fill: "url(#fit-grid)",
                                                stroke: "#171815",
                                                strokeWidth: "28"
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 275,
                                                columnNumber: 15
                                            }, this),
                                            state.items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                    className: `fit-svg-item is-${item.kind} ${selectedItem === item.id ? "is-selected" : ""}`,
                                                    onPointerDown: (event)=>{
                                                        event.currentTarget.setPointerCapture(event.pointerId);
                                                        setSelectedItem(item.id);
                                                        if (!item.locked) setDragging(item.id);
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                            x: item.x,
                                                            y: item.y,
                                                            width: item.width,
                                                            height: item.depth,
                                                            rx: "18"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                                            lineNumber: 277,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                            x: item.x + item.width / 2,
                                                            y: item.y + item.depth / 2,
                                                            dominantBaseline: "middle",
                                                            textAnchor: "middle",
                                                            children: item.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                                            lineNumber: 277,
                                                            columnNumber: 94
                                                        }, this)
                                                    ]
                                                }, item.id, true, {
                                                    fileName: "[project]/components/FitCheckerClient.tsx",
                                                    lineNumber: 276,
                                                    columnNumber: 42
                                                }, this)),
                                            state.doors.map((door)=>{
                                                const hinge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fit$2d$simulator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doorHingePoint"])(door, state.room.width, state.room.length);
                                                const vertical = door.wall === "east" || door.wall === "west";
                                                const lineStart = door.position;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                    className: "fit-door",
                                                    children: [
                                                        vertical ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                            x1: door.wall === "west" ? 0 : state.room.width,
                                                            y1: lineStart,
                                                            x2: door.wall === "west" ? 0 : state.room.width,
                                                            y2: lineStart + door.width
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                                            lineNumber: 284,
                                                            columnNumber: 31
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                            x1: lineStart,
                                                            y1: door.wall === "north" ? 0 : state.room.length,
                                                            x2: lineStart + door.width,
                                                            y2: door.wall === "north" ? 0 : state.room.length
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                                            lineNumber: 284,
                                                            columnNumber: 183
                                                        }, this),
                                                        door.opens === "inward" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                            cx: hinge.x,
                                                            cy: hinge.y,
                                                            r: door.width
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                                            lineNumber: 285,
                                                            columnNumber: 47
                                                        }, this)
                                                    ]
                                                }, door.id, true, {
                                                    fileName: "[project]/components/FitCheckerClient.tsx",
                                                    lineNumber: 283,
                                                    columnNumber: 24
                                                }, this);
                                            }),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                className: `fit-product-shape fit-status-${roomAnalysis.status}`,
                                                transform: `translate(${state.placement.x} ${state.placement.y}) rotate(${state.placement.rotation})`,
                                                onPointerDown: (event)=>{
                                                    event.currentTarget.setPointerCapture(event.pointerId);
                                                    setDragging("product");
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                        x: -product.widthMm / 2,
                                                        y: -product.depthMm / 2,
                                                        width: product.widthMm,
                                                        height: product.depthMm,
                                                        rx: "90"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 289,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                        className: "fit-product-back",
                                                        x: -product.widthMm / 2 + 55,
                                                        y: -product.depthMm / 2 + 45,
                                                        width: product.widthMm - 110,
                                                        height: Math.max(130, product.depthMm * .22),
                                                        rx: "50"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 290,
                                                        columnNumber: 17
                                                    }, this),
                                                    Array.from({
                                                        length: Math.max(1, product.numberOfSeats)
                                                    }, (_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                            className: "fit-product-seat",
                                                            x: -product.widthMm / 2 + 90 + index * ((product.widthMm - 180) / Math.max(1, product.numberOfSeats)),
                                                            y: -product.depthMm * .13,
                                                            width: (product.widthMm - 180) / Math.max(1, product.numberOfSeats) - 15,
                                                            height: product.depthMm * .47,
                                                            rx: "35"
                                                        }, index, false, {
                                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                                            lineNumber: 291,
                                                            columnNumber: 91
                                                        }, this)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                        y: "20",
                                                        textAnchor: "middle",
                                                        children: product.modelCode
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 292,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                        className: "fit-product-dims",
                                                        y: product.depthMm / 2 + 130,
                                                        textAnchor: "middle",
                                                        children: [
                                                            cm(product.widthMm),
                                                            " × ",
                                                            cm(product.depthMm),
                                                            " cm · ",
                                                            state.placement.rotation,
                                                            "°"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 293,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 288,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                className: "fit-dimension fit-dimension-top",
                                                x: state.room.width / 2,
                                                y: 95,
                                                textAnchor: "middle",
                                                children: [
                                                    cm(state.room.width),
                                                    " cm"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 295,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                className: "fit-dimension",
                                                x: state.room.width - 80,
                                                y: state.room.length / 2,
                                                transform: `rotate(90 ${state.room.width - 80} ${state.room.length / 2})`,
                                                textAnchor: "middle",
                                                children: [
                                                    cm(state.room.length),
                                                    " cm"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 296,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 270,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "fit-live-status",
                                        role: "status",
                                        "aria-live": "polite",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusMark, {
                                                status: roomAnalysis.status
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 298,
                                                columnNumber: 79
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "Wall distances: left ",
                                                    cm(roomAnalysis.distances.left),
                                                    " · right ",
                                                    cm(roomAnalysis.distances.right),
                                                    " · front ",
                                                    cm(roomAnalysis.distances.bottom),
                                                    " cm"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 298,
                                                columnNumber: 122
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 298,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FitCheckerClient.tsx",
                                lineNumber: 269,
                                columnNumber: 35
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fit-delivery-canvas",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "fit-route",
                                        children: [
                                            deliveryAnalysis.passages.map((passage, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `fit-route-segment fit-status-${passage.status}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: index + 1
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                                            lineNumber: 301,
                                                            columnNumber: 149
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: passage.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                                            lineNumber: 301,
                                                            columnNumber: 173
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                            children: passage.available ? `${cm(passage.available)} cm` : "Not measured"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                                            lineNumber: 301,
                                                            columnNumber: 194
                                                        }, this)
                                                    ]
                                                }, passage.id, true, {
                                                    fileName: "[project]/components/FitCheckerClient.tsx",
                                                    lineNumber: 301,
                                                    columnNumber: 66
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "fit-delivery-piece",
                                                style: {
                                                    left: `${deliveryProgress}%`
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {}, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 302,
                                                        columnNumber: 92
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: deliveryAnalysis.component.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 302,
                                                        columnNumber: 99
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 302,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 300,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "fit-route-slider",
                                        children: [
                                            "Move largest component along route",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                "aria-label": "Delivery route position",
                                                type: "range",
                                                min: "2",
                                                max: "94",
                                                value: deliveryProgress,
                                                onChange: (event)=>setDeliveryProgress(Number(event.target.value))
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 304,
                                                columnNumber: 83
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 304,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "fit-module-strip",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "eyebrow",
                                                children: "Delivery components"
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 305,
                                                columnNumber: 47
                                            }, this),
                                            components.map((component)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {}, void 0, false, {
                                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                                            lineNumber: 305,
                                                            columnNumber: 152
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: component.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                                            lineNumber: 305,
                                                            columnNumber: 159
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                            children: [
                                                                cm(component.width),
                                                                " × ",
                                                                cm(component.depth),
                                                                " × ",
                                                                cm(component.height),
                                                                " cm"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/FitCheckerClient.tsx",
                                                            lineNumber: 305,
                                                            columnNumber: 182
                                                        }, this)
                                                    ]
                                                }, component.id, true, {
                                                    fileName: "[project]/components/FitCheckerClient.tsx",
                                                    lineNumber: 305,
                                                    columnNumber: 124
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 305,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FitCheckerClient.tsx",
                                lineNumber: 299,
                                columnNumber: 20
                            }, this),
                            activeTab === "room" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fit-placement-tools",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "eyebrow",
                                                children: "Position & orientation"
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 309,
                                                columnNumber: 18
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "fit-inline-actions",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>rotate(-15),
                                                        children: "Rotate −15°"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 309,
                                                        columnNumber: 103
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>rotate(15),
                                                        children: "Rotate +15°"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 309,
                                                        columnNumber: 159
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>rotate(90),
                                                        children: "90°"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 309,
                                                        columnNumber: 214
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: snapToWall,
                                                        children: "Align to wall"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 309,
                                                        columnNumber: 261
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: centerProduct,
                                                        children: "Centre"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 309,
                                                        columnNumber: 312
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 309,
                                                columnNumber: 67
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 309,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "fit-field-grid fit-coordinate-fields",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DimensionInput, {
                                                label: "X position",
                                                value: state.placement.x,
                                                onChange: (x)=>commit((current)=>({
                                                            ...current,
                                                            placement: {
                                                                ...current.placement,
                                                                x
                                                            }
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 310,
                                                columnNumber: 67
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DimensionInput, {
                                                label: "Y position",
                                                value: state.placement.y,
                                                onChange: (y)=>commit((current)=>({
                                                            ...current,
                                                            placement: {
                                                                ...current.placement,
                                                                y
                                                            }
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 310,
                                                columnNumber: 226
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 310,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FitCheckerClient.tsx",
                                lineNumber: 308,
                                columnNumber: 36
                            }, this),
                            activeTab === "room" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fit-suggestions",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "eyebrow",
                                        children: "Automatic placement suggestions"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 313,
                                        columnNumber: 69
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: suggestions.map((suggestion, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>applySuggestion(suggestion.placement),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: index + 1
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 313,
                                                        columnNumber: 294
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                        children: index === 0 ? "Recommended" : index === 1 ? "Alternative" : "Space-first"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 313,
                                                        columnNumber: 318
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusMark, {
                                                        status: suggestion.analysis.status
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 313,
                                                        columnNumber: 400
                                                    }, this)
                                                ]
                                            }, `${suggestion.placement.x}-${suggestion.placement.y}`, true, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 313,
                                                columnNumber: 172
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 313,
                                        columnNumber: 127
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FitCheckerClient.tsx",
                                lineNumber: 313,
                                columnNumber: 36
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FitCheckerClient.tsx",
                        lineNumber: 260,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "fit-panel fit-results-panel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "eyebrow",
                                children: "Live analysis"
                            }, void 0, false, {
                                fileName: "[project]/components/FitCheckerClient.tsx",
                                lineNumber: 317,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: overall === "safe" ? "Likely to fit" : overall === "tight" ? "Review tight clearances" : "Potential conflict"
                            }, void 0, false, {
                                fileName: "[project]/components/FitCheckerClient.tsx",
                                lineNumber: 318,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "fit-disclaimer",
                                children: "Based on the measurements supplied. This is planning guidance, not an installation guarantee."
                            }, void 0, false, {
                                fileName: "[project]/components/FitCheckerClient.tsx",
                                lineNumber: 319,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: [
                                            "Room fit ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusMark, {
                                                status: roomAnalysis.status
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 320,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 320,
                                        columnNumber: 20
                                    }, this),
                                    roomAnalysis.issues.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        children: roomAnalysis.issues.map((issue)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                        size: 15
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 320,
                                                        columnNumber: 170
                                                    }, this),
                                                    issue.message
                                                ]
                                            }, issue.id, true, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 320,
                                                columnNumber: 151
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 320,
                                        columnNumber: 111
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                size: 15
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 320,
                                                columnNumber: 230
                                            }, this),
                                            " No room conflicts found in this placement."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 320,
                                        columnNumber: 227
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FitCheckerClient.tsx",
                                lineNumber: 320,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: [
                                            "Delivery fit ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusMark, {
                                                status: deliveryAnalysis.status
                                            }, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 321,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 321,
                                        columnNumber: 20
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        children: deliveryAnalysis.passages.map((passage)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusMark, {
                                                        status: passage.status
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 321,
                                                        columnNumber: 158
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                children: passage.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                                lineNumber: 321,
                                                                columnNumber: 202
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                                children: passage.message
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                                lineNumber: 321,
                                                                columnNumber: 223
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                                        lineNumber: 321,
                                                        columnNumber: 196
                                                    }, this)
                                                ]
                                            }, passage.id, true, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 321,
                                                columnNumber: 137
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 321,
                                        columnNumber: 89
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FitCheckerClient.tsx",
                                lineNumber: 321,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Measurement quality"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 322,
                                        columnNumber: 20
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: measurementMissing.length ? `${measurementMissing.length} optional elevator measurement${measurementMissing.length === 1 ? " is" : "s are"} missing. Add them if elevator transport is required.` : "All requested route measurements are available."
                                    }, void 0, false, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 322,
                                        columnNumber: 48
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FitCheckerClient.tsx",
                                lineNumber: 322,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fit-result-actions",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "primary",
                                        onClick: saveReport,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {}, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 323,
                                                columnNumber: 96
                                            }, this),
                                            saved ? "Fit report saved" : "Save fit report"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 323,
                                        columnNumber: 47
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: downloadReport,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {}, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 323,
                                                columnNumber: 194
                                            }, this),
                                            "Download report"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 323,
                                        columnNumber: 161
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>window.print(),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {}, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 323,
                                                columnNumber: 269
                                            }, this),
                                            "Print report"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 323,
                                        columnNumber: 230
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/handover?product=${product.id}&subject=fit-report`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {}, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 323,
                                                columnNumber: 368
                                            }, this),
                                            "Send to retailer"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 323,
                                        columnNumber: 302
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/handover",
                                        children: [
                                            "Book technical check ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {}, void 0, false, {
                                                fileName: "[project]/components/FitCheckerClient.tsx",
                                                lineNumber: 323,
                                                columnNumber: 443
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/FitCheckerClient.tsx",
                                        lineNumber: 323,
                                        columnNumber: 399
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FitCheckerClient.tsx",
                                lineNumber: 323,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FitCheckerClient.tsx",
                        lineNumber: 316,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/FitCheckerClient.tsx",
                lineNumber: 215,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "container fit-mobile-nav",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        disabled: STEPS.findIndex((item)=>item.id === step) === 0,
                        onClick: ()=>setStep(STEPS[Math.max(0, STEPS.findIndex((item)=>item.id === step) - 1)].id),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {}, void 0, false, {
                                fileName: "[project]/components/FitCheckerClient.tsx",
                                lineNumber: 327,
                                columnNumber: 217
                            }, this),
                            "Back"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FitCheckerClient.tsx",
                        lineNumber: 327,
                        columnNumber: 52
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            const next = STEPS[Math.min(STEPS.length - 1, STEPS.findIndex((item)=>item.id === step) + 1)].id;
                            setStep(next);
                            if (next === "delivery") setActiveTab("delivery");
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Continue"
                            }, void 0, false, {
                                fileName: "[project]/components/FitCheckerClient.tsx",
                                lineNumber: 327,
                                columnNumber: 437
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {}, void 0, false, {
                                fileName: "[project]/components/FitCheckerClient.tsx",
                                lineNumber: 327,
                                columnNumber: 458
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FitCheckerClient.tsx",
                        lineNumber: 327,
                        columnNumber: 243
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/FitCheckerClient.tsx",
                lineNumber: 327,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/FitCheckerClient.tsx",
        lineNumber: 204,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_3a032adf._.js.map