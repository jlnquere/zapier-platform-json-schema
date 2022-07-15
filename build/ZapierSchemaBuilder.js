"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ZapierSchemaGenerator_1 = require("./ZapierSchemaGenerator");
const Utils_1 = require("./Utils");
class ZapierSchemaBuilder {
    constructor(schema) {
        this.schema = schema;
        this.includes = [];
        this.excludes = [];
        this.excludeAll = false;
        this.overrides = new Map();
    }
    addInclude(key) {
        if (typeof key === "function") {
            this.includes.push(key);
        }
        else {
            this.includes.push(Utils_1.default.getZapierReference(key));
        }
        return this;
    }
    addExclude(key) {
        if (typeof key === "function") {
            this.excludes.push(key);
        }
        else {
            this.excludes.push(Utils_1.default.getZapierReference(key));
        }
        return this;
    }
    setExcludeAll(value) {
        this.excludeAll = value;
        return this;
    }
    setRegistry(value) {
        this.registry = value;
        return this;
    }
    addOverride(key, value) {
        this.overrides.set(key, value);
        return this;
    }
    build() {
        return new ZapierSchemaGenerator_1.default().getZapierSchema(this.schema, {
            excludeAll: this.excludeAll,
            excludes: this.excludes,
            includes: this.includes,
            registry: this.registry,
            overrides: this.overrides
        });
    }
}
exports.default = ZapierSchemaBuilder;
//# sourceMappingURL=ZapierSchemaBuilder.js.map