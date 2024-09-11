export const kvStore = new sst.aws.Dynamo("KvStore", {
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

export const appDb = new sst.aws.Dynamo("AppDb", {
  transform: {
    table: {
      name: `${$app.name}-${$app.stage}-app`,
    }
  },
  fields: {
    pk: "string",
    sk: "string",
    gsi1pk: "string",
    gsi1sk: "string",
    gsi2pk: "string",
    gsi2sk: "string"
  },
  primaryIndex: {
    hashKey: "pk",
    rangeKey: "sk",
  },
  globalIndexes: {
    GSI1: {
      hashKey: 'gsi1pk',
      rangeKey: 'gsi1sk',
      projection: 'all'
    },
    GSI2: {
      hashKey: 'gsi2pk',
      rangeKey: 'gsi2sk',
      projection: 'all'
    },
  }
});