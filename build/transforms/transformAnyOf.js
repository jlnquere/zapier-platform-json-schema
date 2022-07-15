"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformAnyOf = void 0;
function transformAnyOf(fieldSchema, prop, generator) {
    const key = prop.key ? prop.key : fieldSchema.key;
    if (!key) {
        throw new Error(`Invalid state needs key ${JSON.stringify(prop)}`);
    }
    let typeToParse = prop.anyOf.filter((item) => item.type !== null && item.type !== "null");
    if (typeToParse.length > 1) {
        typeToParse = typeToParse.filter((item) => item.type !== "string" || item.format);
    }
    if (typeToParse.length === 0) {
        return null;
    }
    if (typeToParse.length > 1) {
        console.warn(`Skipped prop because of multiple complex types: ${JSON.stringify(prop)}`);
        return null;
    }
    return generator.getFieldSchema(typeToParse.pop(), fieldSchema.key || "unknown");
}
exports.transformAnyOf = transformAnyOf;
//# sourceMappingURL=transformAnyOf.js.map