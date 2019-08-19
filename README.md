# What is Audit-Graph?

Audit-Graph is a library that takes advantage of GraphQL's strongly-typed and introspective nature to provide an automated request-response system for snapshot testing.

With traditional REST endpoints, you would mock a new API using an endpoint and explicitly test it. Audit-Graph discovers your new endpoint (or root operation) and gives you the opportunity to save it in a snapshot. What used to be hundreds of lines of code in API tests could become a dozen!

This is very much a work in progress, but it's looking promising.

## Is this meant to replace traditional testing?

The purpose of this library is to offer the ability to perform exhaustive tests on your GraphQL API, removing what I'd consider to be "boilerplate" tests that check for trivial conditions. You absolutely should still have tests for everything else, and tests for your GraphQL API that might test for tangential items not covered in snapshots (e.g. profiling, or if a particular function was called).

