/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "ApiRouter": {
      "type": "sst.aws.Router"
      "url": string
    }
    "AppDb": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "Auth": {
      "publicKey": string
      "type": "sst.aws.Auth"
    }
    "AuthApiDomain": {
      "type": "sst.aws.Router"
      "url": string
    }
    "AuthAuthenticator": {
      "name": string
      "type": "sst.aws.Function"
      "url": string
    }
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
