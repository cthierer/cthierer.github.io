---
title: redtail
route: /project/redtail
feed:
  - projects
description: |
  A full-stack data application for tracking rodent infestations near food
  establishments in Baltimore City.
start_date: 2016-11-20
color:
  bg: "#6d0e0e"
logo:
  link: ./redtail.svg
repo:
  host: github
  link: https://github.com/cthierer/redtail
docs:
  link: http://redtail.builds.solutions/docs
tags:
  - side-project
  - mysql
  - express
  - node
  - riot
  - bootstrap
  - heroku
---

### Problem

To extract, transform, and normalize data from [_Open Baltimore_][data-baltimore],
and build a Javascript application that:

  * Provides basic CRUD operations through a REST API.
  * Allows the user to visualize, filter, and sort data in the UI.
  * Explores how to write custom instrumentation to track information about
    requests, such as how much memory the server consumes while fulfilling a
    request.

---

### Solution

The **redtail** application pulls data about Baltimore
[neighborhoods][data-neighborhoods], [restaurants][data-restaurants], and
rodents reported through the city's [311 service][data-311]. This information
is normalized into a database intended to track rodent reports and their
geographic proximity to food establishments.

The application plots rodent reports and food establishments on a map. Users
can sort data by the number of rodents or number of establishments, and may
filter data to only show results from certain neighborhoods. The application
also provides the capability for users to report, edit, and delete rodent
sightings.

[![Redtail application with active filter][redtail-filtered]][redtail-filtered]
{: .text-center }

---

### Implementation

The application can be broken down into four core parts:

  * [A task][src-populate] to retrieve data from _Open Baltimore_ and insert it
    into a [MySQL][mysql] database via [Sequelize][sequelize] ORM.

  * An [Express][express]-based [RESTful API][src-server], which handles
    interacting with the MySQL database using JSON over HTTP.

  * A [Riot.js][riot] [single-page application][src-client], which plots data
    from the Express application onto [Mapbox][mapbox] using [leaflet.js][leaflet],
    and allows the user to: search by neighborhood, sort by number of rodents
    reported, report a new rodent sighting, and update/delete existing rodent
    sightings.

  * [A profiler][src-profiler] intended to inject itself into the Express
    application and instrument metrics for tracking memory usage and response
    time of the API.

Source code is transpiled using [Babel][babel], packaged using [Webpack][webpack],
and run on [Heroku][heroku].

---

### Points of interest

* [State management][src-state] is pretty basic, and would benefit from either
  a refactor, or replacing with a library.

* Modules with both client-side and browser-side components have some
  duplication of code between the "actions" and "middleware" (actions being
  code that is executed on the client to change state, and middleware being
  code that is executed on the server to fulfill a request). My intention was
  to bring these things closer (i.e., the middleware should use the same
  actions that the client does), but that proved to be a bigger task than I
  was prepared for.

* Tracking memory per request proved to be difficult to implement. The
  implemented solution attempts to track this metric; however, I would question
  its accuracy for two reasons: I couldn't find a reliable mechanism to track
  requests across event loop ticks, and I couldn't account for garbage
  collection.

  Each request requires database I/O, during which the Node process may perform
  other operations, possibly for other requests. Therefore, taking a memory
  snapshot before and after each request would be unreliable - it could include
  memory allocations from other requests. In this solution, I attempt to
  "ignore" memory usage from other requests by tracking during which tick the
  database I/O is resolved, and discarding any memory usage between the start
  and end of I/O. However, this is still an estimate, as other operations may
  still be processed during the same tick.

  Node also performs garbage collection at its convenience, which decreases the
  heap size. There are libraries to track garbage collection events, but then
  it is still not possible to identify memory freed specific to a given
  request. One could also attempt to "control" garbage collection by starting
  Node with the "expose-gc" flag and manually triggering it, but this is
  something that doesn't seem appropriate in a real (production) environment.
  So, the end result is that in calculating my "estimate", I simply discard
  any de-allocations, providing a maximum estimate for the request.

* Modules should be organized more concisely. For example, since "agencies",
  "sources", and "statuses" are all related to "rodents", they should all be
  part of the "rodents" module, rather than each being their own (small)
  modules.


[babel]: https://babeljs.io/
[data-baltimore]: https://data.baltimorecity.gov/
[data-neighborhoods]: https://data.baltimorecity.gov/dataset/nhood_2010/h3fx-54q3
[data-restaurants]: https://data.baltimorecity.gov/resource/abuv-d2r2
[data-311]: https://data.baltimorecity.gov/resource/q7s2-a6pd
[express]: http://expressjs.com/
[heroku]: https://www.heroku.com
[leaflet]: http://leafletjs.com/
[mapbox]: https://www.mapbox.com/
[mysql]: https://www.mysql.com/
[redtail-filtered]: ./landing.png
[riot]: http://riotjs.com/
[sequelize]: http://docs.sequelizejs.com/en/v3/
[src-client]: https://github.com/cthierer/redtail/blob/master/src/client.js
[src-populate]: https://github.com/cthierer/redtail/blob/master/src/bin/populateData.js
[src-profiler]: https://github.com/cthierer/redtail/tree/master/src/modules/profiler
[src-server]: https://github.com/cthierer/redtail/blob/master/src/server.js
[src-state]: https://github.com/cthierer/redtail/blob/master/src/modules/core/models/state.js
[webpack]: https://webpack.github.io/
