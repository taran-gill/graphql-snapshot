import path from 'path'
import util from 'util';

import { testClient } from '../server/index.js';

import { GraphTester } from '../../src/controller/audit-graph.ts';

const getSnapshotPath = (fileName) => path.join('..', '__snapshots__', `${fileName}.shot`);

describe('Queries', () => {
    it('use GraphTester to test all root queries', async () => {
        const options = { maxDepth: 3 }
        const graphTester = new GraphTester({ testClient, options });
        await graphTester.initialize();

        for await (let queryData of graphTester.rootQueries()) {
            const snapshotPath = getSnapshotPath(queryData.name);
            expect(queryData).toMatchSpecificSnapshot(snapshotPath);
        }
    });
});