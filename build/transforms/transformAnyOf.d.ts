import { FieldSchema } from "../types/FieldSchema";
import ZapierSchemaGenerator from "../ZapierSchemaGenerator";
export declare function transformAnyOf(fieldSchema: Partial<FieldSchema>, prop: any, generator: ZapierSchemaGenerator): Partial<FieldSchema> | null;
