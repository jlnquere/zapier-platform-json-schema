import { JSONSchema } from "./types/JSONSchema";
import { FieldSchema } from "./types/FieldSchema";
import Registry from "./Registry";
export declare type filterFn = (field: FieldSchema) => boolean;
interface ZapierSchemaGeneratorOptions {
    excludeAll: boolean;
    excludes: Array<string | filterFn>;
    includes: Array<string | filterFn>;
    overrides: Map<string, any>;
    registry?: Registry;
}
export default class ZapierSchemaGenerator {
    getZapierSchema(def: JSONSchema, options?: Partial<ZapierSchemaGeneratorOptions>): FieldSchema[];
    getFieldSchema(prop: any, key: string, parentKey?: string): Partial<FieldSchema> | null;
    dehydrateRefs(registry: Registry, current: JSONSchema): void;
    private getFieldSchemaArray;
    private filterByOptions;
    private injectOverrides;
}
export {};
