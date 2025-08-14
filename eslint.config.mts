import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    rules: {
      "semi": [2, "always"],
      "@typescript-eslint/naming-convention": ["warn",
        {
          "selector": "function",
          "format": ["camelCase", "PascalCase"]
        },
        {
          "selector": "enumMember",
          "format": ["UPPER_CASE"]
        }],
      "quotes": [
        "error",
        "double",
        {
          "avoidEscape": true,
          "allowTemplateLiterals": true
        }
      ],
    },
  },
  tseslint.configs.recommended,
]);
