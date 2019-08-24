# What is Audit-Graph?

Audit-Graph is a library that takes advantage of GraphQL's strongly-typed and introspective nature to provide an automated request-response system for snapshot testing.

With traditional REST endpoints, you would mock a new API using an endpoint and explicitly test it. Audit-Graph discovers your new endpoint (or root operation) and gives you the opportunity to save it in a snapshot. What used to be hundreds of lines of code in API tests could become a dozen!

This is very much a work in progress, but it's looking promising.

## Is this meant to replace traditional testing?

The purpose of this library is to offer the ability to perform exhaustive tests on your GraphQL API, removing what I'd consider to be "boilerplate" tests that check for trivial conditions. You absolutely should still have tests for everything else, and tests for your GraphQL API that might test for tangential items not covered in snapshots (e.g. profiling, or if a particular function was called).

## Example

[Here's](https://github.com/taran-gill/audit-graph/blob/master/test/component/index.test.js) an example of what your snapshot testing would look like.
I've used the library to verify changes in my fixtures.

To make snapshot testing easier to navigate with Audit-Graph, I used [jest-specific-snapshot](https://github.com/igor-dv/jest-specific-snapshot) for the task.

You can view the snapshots resulting from the project in [this folder](https://github.com/taran-gill/audit-graph/tree/master/test/__snapshots__)

## Roadmap

There's still a _lot_ that needs to be done before I'd consider this ready for use:

- Properly use package.json hooks for deployment
- Consider mutations/subscriptions
- Create documentation for API
- Improve test coverage/methodology w.r.t. fixtures
- Include a CI pipeline