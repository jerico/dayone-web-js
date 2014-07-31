# dayone-web-js

A reimplementation of Day One iOS interface for the web.

The idea is I can fire up a commandline app and view my journal in the browser.

There will be a different ways of filtering the content:
- Showing the last 7 days
- Showing what happened years ago today
- By tag
- By length of entry
- Morning or night time
- Etc

Front-page will be like a dashboard that you can pin different views.

At it's current state, it's just a proof-of-concept. It just currently reads Journal.dayone on the same directory.

Implemented using:
- [nedb](https://github.com/louischatriot/nedb)
- [express](https://github.com/strongloop/expressjs.com)
- [plist-parser](https://github.com/jacobbudin/plist-parser)
