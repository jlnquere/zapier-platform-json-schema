"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformAllOf = void 0;
function transformAllOf(fieldSchema, prop, generator) {
    const key = prop.key ? prop.key : fieldSchema.key;
    const schemas = prop.allOf
        .map((allOfElement) => generator.getFieldSchema(allOfElement, key))
        .filter((schema) => schema != null);
    if (schemas.length === 0) {
        return null;
    }
    return schemas.reduce((acc, current) => {
        acc.children.push(...current.children);
        return acc;
    }, schemas.pop());
}
exports.transformAllOf = transformAllOf;
//# sourceMappingURL=transformAllOf.js.map