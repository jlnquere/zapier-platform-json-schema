"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Registry {
    constructor() {
        this.map = new Map();
    }
    static fromDefinition(def, prefix) {
        const reg = new Registry();
        reg.setDefinition(Registry.getName("root", prefix), def);
        if (def.definitions) {
            Object.entries(def.definitions).forEach(([key, value]) => {
                reg.setDefinition(Registry.getName(key, prefix), value);
            });
        }
        return reg;
    }
    static getName(key, prefix) {
        if (!prefix) {
            return key;
        }
        return [prefix, key].join("/");
    }
    setDefinition(name, def) {
        this.map.set(name, def);
    }
    getDefinition(name) {
        const def = this.map.get(name);
        if (!def) {
            throw new Error("Unknown schema name: " + name);
        }
        return def;
    }
}
exports.default = Registry;
//# sourceMappingURL=Registry.js.map