"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformObject = void 0;
function transformObject(fieldSchema, prop, generator) {
    let requiredItems = Array.isArray(prop.required) ? prop.required : [];
    if (fieldSchema.key) {
        requiredItems = requiredItems.map(i => [fieldSchema.key, i].join("."));
    }
    let children = Object.entries(prop.properties || {}).map(([key, value]) => {
        let schema = generator.getFieldSchema(value, key, fieldSchema.key);
        if (schema && requiredItems.indexOf(schema.key) !== -1) {
            schema.required = true;
        }
        return schema;
    });
    return Object.assign(Object.assign({}, fieldSchema), { children });
}
exports.transformObject = transformObject;
//# sourceMappingURL=transformObject.js.map