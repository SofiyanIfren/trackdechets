import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import { mergePermissions } from "./utils";
import { mergeValidationRules } from "./common/middlewares/schema-validation";

// Merge GraphQL schema by merging types, resolvers, permissions and validations
// definitions from differents modules

const typesArray = fileLoader(`${__dirname}/**/*.graphql`, {
  recursive: true
});
const typeDefs = mergeTypes(typesArray, { all: true });

const resolversArray = fileLoader(`${__dirname}/**/resolvers.ts`, {
  recursive: true
});
const resolvers = mergeResolvers(resolversArray);

const permissionsArray = fileLoader(`${__dirname}/**/permissions.ts`, {
  recursive: true
});

const permissions = mergePermissions(permissionsArray);

const validationArray = fileLoader(`${__dirname}/**/schema-validation.ts`, {
  recursive: true
});

const validations = mergeValidationRules(validationArray);

export { typeDefs, resolvers, permissions, validations };