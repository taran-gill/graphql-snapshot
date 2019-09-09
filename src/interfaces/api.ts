import { validOptions } from './options';

export interface graphTesterInputs {
    testClient: any,
    options?: validOptions
};

export interface graphTesterApi {
    queries: any
};