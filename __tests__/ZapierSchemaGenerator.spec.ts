import ZapierSchemaGenerator from "../src/ZapierSchemaGenerator";
import { JSONSchema } from "../src/types/JSONSchema";
import Registry from "../src/Registry";
import * as _ from "lodash";

// tslint:disable-next-line
let schema: JSONSchema;

describe("ZapierSchemaGenerator", () => {
  beforeEach(()=> {
    schema = _.cloneDeep(require("./Example.schema.json")) as JSONSchema;
  });
  const generator = new ZapierSchemaGenerator();
  describe("empty property inputs", ()=> {
    it("supports undefined property", ()=> {
      const key = "stringProp";
      delete schema.properties;
      const type = generator.getFieldSchema(undefined, key);
      expect(type).toBeNull();
    });
    it("supports json with key null properties", ()=> {
      const key = "stringProp";
      // @ts-ignore
      schema.properties = null ;
      const type = generator.getFieldSchema(null, key);
      expect(type).toBeNull();
    });
  });

  describe("PrimitiveTypes", () => {
    it("supports string type", async () => {
      const key = "stringProp";
      const type = generator.getFieldSchema(schema.properties![key], key);
      expect(type).toEqual(
        expect.objectContaining({
          type: "string"
        })
      );
    });
    it("supports boolean type", async () => {
      const key = "booleanProp";
      const type = generator.getFieldSchema(schema.properties![key], key);
      expect(type).toEqual(
        expect.objectContaining({
          type: "boolean"
        })
      );
    });

    it("supports datetime type", async () => {
      const key = "dateProp";
      const type = generator.getFieldSchema(schema.properties![key], key);
      expect(type).toEqual(
        expect.objectContaining({
          type: "datetime"
        })
      );
    });

    it("supports enum type", async () => {
      const key = "enumProp";
      const type = generator.getFieldSchema(schema.properties![key], key);
      expect(type).toEqual(
        expect.objectContaining({
          type: "string",
          choices: ["option1"]
        })
      );
    });

    it("supports multiple types (prefer non-string)", async () => {
      const key = "multipleTypeProp";
      const type = generator.getFieldSchema(schema.properties![key], key);
      expect(type).toEqual(
        expect.objectContaining({
          type: "boolean"
        })
      );
    });
    it("supports multiple types (prefer non-null)", async () => {
      const key = "multipleTypePropWithNull";
      const type = generator.getFieldSchema(schema.properties![key], key);
      expect(type).toEqual(
        expect.objectContaining({
          type: "string"
        })
      );
    });
    it(" supports array with enum items", async () => {
      const key = "arrayPropEnum";
      expect(
        generator.getFieldSchema(schema.properties![key], key)
      ).toMatchObject({
        type: "string",
        choices: expect.any(Array),
        list: true
      });
    });

    it("supports anyOf with prefer non-string type", async () => {
      const key = "anyOfPropDatetime";
      expect(
        generator.getFieldSchema(schema.properties![key], key)
      ).toMatchObject({
        type: "datetime"
      });
    });

    it(" supports allOf by merge all schemas", async () => {
      const key = "allOfProp";
      expect(
        generator.getFieldSchema(schema.properties![key], key)
      ).toMatchObject({
        children: [
          { key: "allOfProp.secondProp", type: "string" },
          { key: "allOfProp.firstProp", type: "string" }
        ]
      });
    });

    it("supports description to help text mapping", async () => {
      const key = "stringProp";
      const type = generator.getFieldSchema(schema.properties![key], key);
      expect(type).toEqual(
        expect.objectContaining({
          helpText: schema.properties![key].description
        })
      );
    });

    it("supports title to title mapping", async () => {
      const key = "stringProp";
      const type = generator.getFieldSchema(schema.properties![key], key);
      expect(type).toEqual(
        expect.objectContaining({
          label: schema.properties![key].title
        })
      );
    });

    it(" returns empty children for empty array items type", async () => {
      const key = "arrayProp";
      expect(generator.getFieldSchema(schema.properties![key], key)).toEqual(
        expect.objectContaining({
          children: []
        })
      );
    });

    it(" returns null for multiple complex anyOf type", async () => {
      const key = "anyOfProp";
      expect(generator.getFieldSchema(schema.properties![key], key)).toBeNull();
    });
  });

  describe("Required", () => {
    it("supports required on object", async () => {
      const key = "stringProp";
      const type = generator.getZapierSchema(schema)

      const stringProp = type.filter(c => c!== null).filter(c => c.key === key);

      expect(stringProp).not.toBeUndefined;
      expect(stringProp).toHaveLength(1);
      expect(stringProp![0].required).toEqual(true);
    });

    it("supports required on nestedRef", async () => {
      const key = "otherStringProp";
      const type = generator.getZapierSchema(schema)

      const otherStringProp = type.filter(c => c !== null).filter(c => c.key.endsWith(key))

      expect(otherStringProp).not.toBeUndefined;
      expect(otherStringProp).toHaveLength(2);
      expect(otherStringProp![0].required).toEqual(true);
      expect(otherStringProp![1].required).toEqual(true);

    });
  });

  describe("$ref", () => {
    const registry = Registry.fromDefinition(_.cloneDeep(require("./Example.schema.json")) as JSONSchema);
    it("supports $ref enum types", async () => {
      const key = "enumRef";
      const clone = _.cloneDeep(schema);
      generator.dehydrateRefs(registry, clone);

      expect(clone.properties![key]).toEqual(
        expect.objectContaining({
          enum: ["option1", "option2"]
        })
      );
    });

    it("supports $ref object types", async () => {
      const key = "nestedRef";
      const clone = _.cloneDeep(schema);
      generator.dehydrateRefs(registry, clone);

      expect(clone.properties![key]).toEqual(
        expect.objectContaining({
          properties: expect.any(Object)
        })
      );
    });
    it("supports $ref for allOf", async () => {
      const key = "allOfProp";
      const clone = _.cloneDeep(schema);
      generator.dehydrateRefs(registry, clone);
      expect(JSON.stringify(clone.properties![key])).toEqual(
        expect.stringContaining('"enum":[')
      );
    });
  });

  describe("Options", () => {
    it("excludes based on function result", async () => {
      const excludeFn = jest.fn().mockReturnValue(true);
      const types = generator.getZapierSchema(schema, {
        excludes: [excludeFn]
      });
      expect(excludeFn).toBeCalled();
    });
    it("includes based on function result", async () => {
      const includesFn = jest.fn().mockReturnValue(true);
      const types = generator.getZapierSchema(schema, {
        includes: [includesFn]
      });
      expect(includesFn).toBeCalled();
    });
    it("excludes fileds when in options declared", async () => {
      const types = generator.getZapierSchema(schema, {
        excludes: ["nestedRef"]
      });
      expect(types.length).toEqual(13);
    });

    it("prefers nested include over general exclude", async () => {
      const types = generator.getZapierSchema(schema, {
        excludes: ["nestedRef"],
        includes: ["nestedRef.stringProp"]
      });
      expect(types.length).toEqual(14);
    });

    it("exclude all other but respected includes", async () => {
      const types = generator.getZapierSchema(schema, {
        excludeAll: true,
        includes: ["nestedRef.stringProp"]
      });
      expect(types.length).toEqual(1);
    });

    it("uses overrides option to innject the properties", async () => {
      const types = generator.getZapierSchema(schema, {
        overrides: new Map([["dateProp", { required: true }]])
      });
      const dateProp = types.find(type => type.key === "dateProp");
      expect(dateProp).toEqual(
        expect.objectContaining({
          required: true
        })
      );
    });

    it("prefers overrides over exiting props", async () => {
      const types = generator.getZapierSchema(schema, {
        overrides: new Map([["dateProp", { description: "My description" }]])
      });
      const dateProp = types.find(type => type.key === "dateProp");
      expect(dateProp).toEqual(
        expect.objectContaining({
          description: "My description"
        })
      );
    });
  });

  it("flatten all nested types", async () => {
    const types = generator.getZapierSchema(schema);
    expect(types.length).toEqual(15);
  });

  it("uses Zapier unsercore keys", async () => {
    const key = "nestedRef";
    const schemas = generator.getZapierSchema(schema);
    const startWithDoubleUnderscore = schemas
      .map((prop: any) => prop.key)
      .filter(propKey => propKey.startsWith(key))
      .filter((keyInList: string) => !keyInList.includes(key + "__"));

    expect(startWithDoubleUnderscore.length).toEqual(0);
  });
  it(" supports array with nestedref items", async () => {
    const key = "arryOfNestedRefs";
    const schemas = generator.getZapierSchema(schema);

    const filteredItems = schemas.filter(f => f.key.startsWith(key));
    expect(
      filteredItems
    ).toMatchObject([
      { key: 'arryOfNestedRefs__stringProp', type: 'string' },
      { key: 'arryOfNestedRefs__otherStringProp', type: 'string' }
    ]);
  });
});