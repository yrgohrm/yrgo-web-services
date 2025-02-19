export const markdown = `
# Fortunes API

The API is very simple and has five endpoints that return JSON data.

If you use the API wrong it will return a HTTP 400 error code.

## GET /fortunes/random

Returns a random fortune as a json-object.

{ fortune: '...' }

## GET /fortunes/short

Returns a short random fortune (160 characters or less) as a json-object.
Same format as for \`/fortunes/random\`.

## GET /fortunes/showerthought

Returns a shower thought as a json-object.
Same format as for \`/fortunes/random\`.

## GET /fortunes/traditional

Returns a traditional (Unix) fortune as a json-object.
Same format as for \`/fortunes/random\`.

## GET /fortunes/query?q=<query>

Query all fortunes for matching fortunes. Will return a list of all fortunes
that contains the sent string as a substring (case sensitive). The query must
contain at least three characters.

Will return a list of fortunes in the same format as \`/fortunes/random\`.
`;
