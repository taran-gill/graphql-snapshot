# GraphQL-Snapshot &middot; [![CircleCI](https://circleci.com/gh/taran-gill/graphql-snapshot.svg?style=svg)](https://circleci.com/gh/taran-gill/graphql-snapshot) [![codecov](https://codecov.io/gh/taran-gill/graphql-snapshot/branch/master/graph/badge.svg?token=5SQQUxzV4J)](https://codecov.io/gh/taran-gill/graphql-snapshot)

GraphQL-Snapshot is a library that takes advantage of GraphQL's strongly-typed and introspective nature to provide an automated request-response system for snapshot testing.

With traditional REST endpoints, you would mock a new API using an endpoint and explicitly test it. GraphQL-Snapshot discovers your new endpoint (or root operation) and gives you the opportunity to save it in a snapshot. What used to be hundreds of lines of code in API tests could become a dozen!

This is very much a work in progress, but it's looking promising.

## Is this meant to replace traditional testing?

The purpose of this library is to offer the ability to perform exhaustive tests on your GraphQL API, removing what I'd consider to be "boilerplate" tests that check for trivial conditions. You absolutely should still have tests for everything beyond trivialities, and tests for your GraphQL API that might test for tangential items not covered in snapshots (e.g. profiling, or if a particular function was called).

## Example

```javascript
import { graphTester } from 'graphql-snapshot';

/* Initialize a GraphQL client that has a query() method. For reference, I used ApolloServer's test client. */
const testClient = new TestClient();

describe('Snapshot testing', () => {
    it('use GraphTester to test all root queries', async () => {
        const options = { maxDepth: 3 }
        const graphTestRunner = await graphTester({ testClient, options });

        for await (let queryData of graphTestRunner.queries()) {
            const snapshotPath = getSnapshotPath(queryData.name);

            // toMatchSpecificSnapshot is a custom matcher. See below for details.
            expect(queryData).toMatchSpecificSnapshot(snapshotPath);
        }
    });
});

```

[Here's](https://github.com/taran-gill/graphql-snapshot/blob/master/test/component/index.test.js) an example of what your snapshot testing would look like.
I've used the library to verify changes in my fixtures.

To make snapshot testing easier to navigate with GraphQL-Snapshot, I used [jest-specific-snapshot](https://github.com/igor-dv/jest-specific-snapshot) for the task.

You can view the snapshots resulting from the project in [this folder](https://github.com/taran-gill/graphql-snapshot/tree/master/test/__snapshots__).

## Roadmap

There's still a _lot_ that needs to be done before I'd consider this ready for use:

- Consider mutations/subscriptions
- Create documentation for API