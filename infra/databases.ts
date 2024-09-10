export const database = new sst.aws.Dynamo("KvStore", {
  transform: {
    table: {
      name: `${$app.name}-${$app.stage}-kvstore`,
    }
  },
  fields: {
    pk: "string",
    sk: "string",
  },
  primaryIndex: {
    hashKey: "pk",
    rangeKey: "sk",
  },
});