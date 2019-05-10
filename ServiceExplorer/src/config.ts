import {ImmutableObject} from 'seamless-immutable';

export interface Config{
  serviceURL: string;
  hasMetadata: boolean;
}

export type IMConfig = ImmutableObject<Config>;