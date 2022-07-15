"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformItems = void 0;
function transformItems(fieldSchema, prop, generator) {
    const itemsType = prop.items;
    if (!fieldSchema.key) {
        throw new Error(`Key must be set! ${JSON.stringify(fieldSchema)}`);
    }
    const listType = generator.getFieldSchema(itemsType, fieldSchema.key);
    if (listType) {
        return Object.assign(Object.assign({}, listType), { list: true });
    }
    return null;
}
exports.transformItems = transformItems;
//# sourceMappingURL=transformItems.js.map