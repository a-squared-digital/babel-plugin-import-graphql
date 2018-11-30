export const missingOptionalDep = `The 'graphql-tag' package must be installed when using the 'runtime' option.

Ways to resolve this error:
1. Run 'npm i graphql-tag' or 'yarn add graphql-tag' to install the missing dependency
2. Disable the 'runtime' option to parse your GraphQL files at compile-time
`

export const missingQuotations = `You need to use quotations when using #import.

Could you have possibly been wanting #importu?
`

export const nonExistentFile = filename => `File ${filename} could not be found.`
