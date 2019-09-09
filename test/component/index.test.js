import path from 'path';

import { testClient } from '../server/index.js';

import { graphTester } from '../../src/controller/graphql-snapshot.ts';

const getSnapshotPath = (fileName) => path.join('..', '__snapshots__', `${fileName}.shot`);

describe('Queries', () => {
    it('use GraphTester to test all root queries', async () => {
        const options = { maxDepth: 3 }
        const graphTestRunner = await graphTester({ testClient, options });

        for await (let queryData of graphTestRunner.queries()) {
            const snapshotPath = getSnapshotPath(queryData.name);
            expect(queryData).toMatchSpecificSnapshot(snapshotPath);
        }
    });
});