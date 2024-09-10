import crypto from 'crypto'
import { init } from '@paralleldrive/cuid2';
import { Resource } from 'sst';

export const isProdStage = () => Resource.App.stage === 'production'

export const hashPassword = (p: string): string => {
  const hash = crypto.createHash('md5');

  hash.update(p);
  return hash.digest('hex')
}

export const useProdResourcesForLocal = (): boolean => (process.env.USE_PROD === 'true')

export const createId = init({
  length: 15,
  fingerprint: 'sqquid-glue-prod'
})

export const useLocalTableName = (localName?: string) => {
  return useProdResourcesForLocal() && localName && process.env[localName]
}

export const delay = async (millis: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, millis)
  })
}