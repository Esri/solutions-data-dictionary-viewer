import {ImmutableObject} from 'seamless-immutable';

export interface Config{
  serviceURL: string;
  hasMetadata: boolean;
  allowUrlLookup: boolean;
  useCache: boolean;
  cachePath: string;
  cacheId: string;
}

export type IMConfig = ImmutableObject<Config>;