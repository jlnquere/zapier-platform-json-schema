"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformObject = void 0;
function transformObject(fieldSchema, prop, generator) {
    const children = Object.entries(prop.properties || {}).map(([key, value]) => generator.getFieldSchema(value, key, fieldSchema.key));
    return Object.assign(Object.assign({}, fieldSchema), { children });
}
exports.transformObject = transformObject;
//# sourceMappingURL=transformObject.js.map