const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const fs = require("fs");
const path = require("path");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const schemaPath = path.join(__dirname, "../configs/scheme_schema.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const validate = ajv.compile(schema);

describe("Scheme Configurations Validation", () => {
  it("should successfully validate nfst.json against scheme_schema.json", () => {
    const nfstPath = path.join(__dirname, "../configs/nfst.json");
    const nfstConfig = JSON.parse(fs.readFileSync(nfstPath, "utf8"));
    const valid = validate(nfstConfig);
    if (!valid) {
      console.error("Validation Errors for nfst.json:", validate.errors);
    }
    expect(valid).toBe(true);
  });

  it("should successfully validate nos_st.json against scheme_schema.json", () => {
    const nosPath = path.join(__dirname, "../configs/nos_st.json");
    const nosConfig = JSON.parse(fs.readFileSync(nosPath, "utf8"));
    const valid = validate(nosConfig);
    if (!valid) {
      console.error("Validation Errors for nos_st.json:", validate.errors);
    }
    expect(valid).toBe(true);
  });
});
