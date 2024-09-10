/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "KvStore": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "RestApi": {
      "name": string
      "type": "sst.aws.Function"
      "url": string
    }
  }
}
export {}
