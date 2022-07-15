import { JSONSchema } from "./types/JSONSchema";
export default class Registry {
    static fromDefinition(def: JSONSchema, prefix?: string): Registry;
    private static getName;
    private readonly map;
    setDefinition(name: string, def: JSONSchema): void;
    getDefinition(name: string): JSONSchema;
}
