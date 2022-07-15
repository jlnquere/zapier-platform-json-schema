import { filterFn } from "./ZapierSchemaGenerator";
import { JSONSchema } from "./types/JSONSchema";
import { FieldSchema, FieldSchemaKey } from "./types/FieldSchema";
import Registry from "./Registry";
export default class ZapierSchemaBuilder {
    private schema;
    private includes;
    private excludes;
    private excludeAll;
    private registry;
    private overrides;
    constructor(schema: JSONSchema);
    addInclude(key: string | filterFn): this;
    addExclude(key: string | filterFn): this;
    setExcludeAll(value: boolean): this;
    setRegistry(value: Registry): this;
    addOverride(key: string, value: Partial<{
        [x in FieldSchemaKey]: any;
    }>): this;
    build(): FieldSchema[];
}
