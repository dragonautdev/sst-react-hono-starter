/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
import "sst"
export {}
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
    "AuthApiDomain": {
      "type": "sst.aws.Router"
      "url": string
    }
    "AuthFn": {
      "publicKey": string
      "type": "sst.aws.Auth"
    }
    "AuthFnAuthenticator": {
      "name": string
      "type": "sst.aws.Function"
      "url": string
    }
    "KvStore": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "PostgresDb": {
      "clusterArn": string
      "database": string
      "host": string
      "password": string
      "port": number
      "secretArn": string
      "type": "sst.aws.Postgres"
      "username": string
    }
    "RestApi": {
      "name": string
      "type": "sst.aws.Function"
      "url": string
    }
    "TrpcApi": {
      "type": "sst.aws.Router"
      "url": string
    }
    "TrpcApiFn": {
      "name": string
      "type": "sst.aws.Function"
      "url": string
    }
    "dashboard": {
      "type": "sst.aws.Nextjs"
      "url": string
    }
  }
}
