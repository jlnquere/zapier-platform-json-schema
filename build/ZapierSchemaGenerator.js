"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Registry_1 = require("./Registry");
const Utils_1 = require("./Utils");
const transformDate_1 = require("./transforms/transformDate");
const transformItems_1 = require("./transforms/transformItems");
const transformAnyOf_1 = require("./transforms/transformAnyOf");
const transformDefault_1 = require("./transforms/transformDefault");
const transformObject_1 = require("./transforms/transformObject");
const transformAllOf_1 = require("./transforms/transformAllOf");
class ZapierSchemaGenerator {
    getZapierSchema(def, options) {
        const safeOptions = Object.assign({ includes: [], excludes: [], excludeAll: false, overrides: new Map() }, options);
        if (!safeOptions.registry) {
            safeOptions.registry = Registry_1.default.fromDefinition(def);
        }
        this.dehydrateRefs(safeOptions.registry, def);
        const schema = this.getFieldSchema(def, "");
        if (!schema) {
            throw new Error(`Unabled to get field schema ${def}`);
        }
        const flatten = Utils_1.default.flatten(this.getFieldSchemaArray(schema)).filter(value => value !== null);
        const filtered = this.filterByOptions(flatten, safeOptions);
        const overrides = this.injectOverrides(filtered, safeOptions);
        return overrides.map(value => {
            return Object.assign(Object.assign({}, value), { key: Utils_1.default.getZapierReference(value.key) });
        });
    }
    getFieldSchema(prop, key, parentKey) {
        if (!prop) {
            return null;
        }
        const fieldSchema = {};
        if (prop.enum) {
            fieldSchema.choices = prop.enum;
        }
        if (prop.type && prop.type instanceof Array) {
            const types = prop.type;
            prop.type = types.filter((entry) => entry !== "string").pop();
            if (prop.type === "null") {
                prop.type = types.filter((entry) => entry !== "null").pop();
            }
        }
        fieldSchema.key = (parentKey ? parentKey + "." : "") + key;
        if (prop.description) {
            fieldSchema.helpText = prop.description;
        }
        if (prop.title) {
            fieldSchema.label = prop.title;
        }
        if (prop.format === "date-time") {
            transformDate_1.transformDate(fieldSchema, prop, this);
        }
        else if (prop.allOf) {
            return transformAllOf_1.transformAllOf(fieldSchema, prop, this);
        }
        else if (prop.type === "array") {
            return transformItems_1.transformItems(fieldSchema, prop, this);
        }
        else if (prop.type === "object") {
            return transformObject_1.transformObject(fieldSchema, prop, this);
        }
        else if (prop.anyOf) {
            return transformAnyOf_1.transformAnyOf(fieldSchema, prop, this);
        }
        else if (!prop.type) {
            return null;
        }
        else {
            transformDefault_1.transformDefault(fieldSchema, prop, this);
        }
        return fieldSchema;
    }
    dehydrateRefs(registry, current) {
        if (current.properties) {
            Object.values(current.properties).forEach((prop) => this.dehydrateRefs(registry, prop));
        }
        if (current.anyOf) {
            current.anyOf.forEach((entry) => this.dehydrateRefs(registry, entry));
        }
        if (current.allOf) {
            current.allOf.forEach((entry) => this.dehydrateRefs(registry, entry));
        }
        if (current.oneOf) {
            current.oneOf.forEach((entry) => this.dehydrateRefs(registry, entry));
        }
        if (current.items) {
            const items = Array.isArray(current.items) ? current.items : [current.items];
            items.forEach((entry) => this.dehydrateRefs(registry, entry));
        }
        if (!current.$ref) {
            return;
        }
        const name = current.$ref.split("/").pop();
        if (!name) {
            throw new Error(`Unabled to parse ref: ${current.$ref}`);
        }
        const def = registry.getDefinition(name);
        this.dehydrateRefs(registry, def);
        Object.assign(current, def);
    }
    getFieldSchemaArray(fieldSchema) {
        if (!fieldSchema) {
            return null;
        }
        if (fieldSchema.children) {
            return fieldSchema.children.map(schema => this.getFieldSchemaArray(schema));
        }
        return fieldSchema;
    }
    filterByOptions(props, options) {
        return props.filter(prop => {
            if (options.includes.find(include => {
                if (typeof include === "function") {
                    return include(prop);
                }
                return prop.key.indexOf(include) > -1;
            })) {
                return true;
            }
            if (options.excludeAll) {
                return false;
            }
            else if (options.excludes.find(exclude => {
                if (typeof exclude === "function") {
                    return exclude(prop);
                }
                return prop.key.indexOf(exclude) > -1;
            })) {
                return false;
            }
            return true;
        });
    }
    injectOverrides(props, options) {
        const dict = props.reduce((acc, current) => {
            acc[current.key] = current;
            return acc;
        }, {});
        Array.from(options.overrides.entries()).map(([key, value]) => {
            const found = dict[key];
            if (!found) {
                return;
            }
            dict[key] = Object.assign(Object.assign({}, found), value);
        });
        return Object.values(dict);
    }
}
exports.default = ZapierSchemaGenerator;
//# sourceMappingURL=ZapierSchemaGenerator.js.map