const path = require('path');
const util = require('util');

const { testClient } = require('../server/index.js');

const { GraphTester } = require('../../dist/audit-graph');

const getSnapshotPath = (fileName) => path.join('..', '__snapshots__', `${fileName}.shot`);

describe('Queries', () => {
    it('use GraphTester to test all root queries', async () => {
        const graphTester = new GraphTester({ testClient });
        await graphTester.initialize();

        for await (let queryData of graphTester.rootQueries()) {
            const snapshotPath = getSnapshotPath(queryData.name);
            expect(queryData).toMatchSpecificSnapshot(snapshotPath);
        }
    });
});