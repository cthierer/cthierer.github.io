---
title: wallaby
route: /project/wallaby
feed:
  - projects
description: |
  An injectable application to bookmark your place in the Marvel Comics web
  reader.
start_date: 2017-01-15
end_date: 2017-02-04
color:
  bg: "#2b76cb"
logo:
  link: ./wallaby.svg
link: https://wallaby.builds.solutions/
repo:
  host: github
  link: https://github.com/cthierer/wallaby
ci:
  host: travis
  link: https://travis-ci.org/cthierer/wallaby
  status: https://travis-ci.org/cthierer/wallaby.svg?branch=master
docs:
  link: https://wallaby.builds.solutions/docs/
tags:
  - side-project
  - redis
  - koa
  - node
  - riot
  - netlify
  - heroku
---

### Problem

Although present in the mobile applications, the [Marvel comics][marvel] web
reader does not have the capability to save your spot in a comic. This is
problematic if you are interrupted while reading and close your browser, or
if your session times out; you will have to "hunt" to find your spot again
later.

---

### Solution

The **wallaby** application can be injected into the Marvel web reader,
"scrape" metadata about the comic and the user's current position in the comic,
and persist it for the user to retrieve later. The scraped information
("bookmarks") are able to be retrieved across multiple devices, linked to a
specific user via their GitHub account.

From the [**wallaby**][wallaby] homepage, the user:

  1. Drags the [bookmarklet][bookmarklet] link into the browser's bookmark
    toolbar.
  2. Loads the Marvel reader application.
  3. Starts reading a comic.
  4. Clicks the bookmarklet shortcut in the browser's toolbar.

When executed, the bookmarklet will inject the **wallaby** client application
into the Marvel reader toolbar, creating a seamless experience with the rest of
the reader.

![Marvel reader with wallaby loaded][wallaby-toolbar]
{: .text-center }

Clicking the icon in the toolbar sends an API request to the **wallaby** API,
which persists the data. The next time the user visits the **wallaby**
homepage, they will see the bookmark in the "Recent Bookmarks" listing, as
well as a link to take them right back to where they left off.

[![Wallaby homepage showing user's library][wallaby-library]][wallaby-library]
{: .text-center }

---

### Implementation

The **wallaby** application is a Javascript client application, backed by a
RESTful JSON API.

#### Client

The client application has two parts:

  1.  The code that is injected into the Marvel application.
  2.  The application homepage, which allows the user to view, filter, and
    manage bookmarks in their library.

Both applications use the same [Riot.js][riot] tags. The tags define their
own logic and styles, making them self-contained: the bookmarklet only has to
insert a single script, which injects the appropriate tags to tie into the
Marvel client. The client code is transpiled using [Babel][babel], packaged
using [Webpack][webpack], and hosted on [Netlify][netlify].

#### Server

The server application is implemented using [Koa2][koa], is backed by
a [Redis][redis] database, and runs on [Heroku][heroku].

The API exposes the following [endpoints][code-router]:

  * `/auth`: the only non-JSON endpoint; this triggers the OAuth2 flow. Right
    now, the only supported OAuth provider is GitHub. OAuth is only used to
    authenticate the user - after the flow is complete, the application issues
    an application-specific session token, which the user includes in the
    `Authorization` header of future requests.

  * `/sessions`: allows users to extend their session (preventing a session
    timeout) (`PUT /sessions`), and logout (`DELETE /sessions`).

  * `/bookmarks`: provides the capability to query for bookmarks (`GET`),
    create a bookmark (`POST`), and delete existing bookmarks (`DELETE`).
    When querying for bookmarks, the user may filter by collection by passing
    the `collection` query string parameter.

  * `/collections`: list all of the collections of bookmarks the user has
    (`GET`). A "collection" is a group of one or more bookmarks, grouped by
    the comic series. For example, all bookmarks for comics belonging to
    [_Darth Vader (2015)_][darth-vader] would be grouped under the
    "Darth Vader (2015)" collection.

---

### Points of interest

* Uses Redis as a persistence tier, mainly because it is easy to use, and I was
  looking to play around with it a bit. However, [in some places][todo-branching]
  the code became a bit convoluted. Redis may not be the best long-term
  persistence tier as data structures and filtering on those data structures
  gets more complex.

* Uses [proxies][mdn-proxy] to hook into the Marvel client application to
  trigger actions, such as [refreshing the user's **wallaby** session][example-proxy]
  each time the user navigates in the Marvel application.

* The client kicks off the OAuth flow by programmatically opening a new window,
  which redirects the user to the OAuth provider to authenticate, then back to
  the Koa application to complete the second phase of the OAuth verification.
  Control is passed back to the original window using [`postMessage`][example-postmessage].

* Includes a home-grown [data migration][migration] task that runs automatically
  during deployment to handle transforming data in the Redis database. It
  automatically pulls data transformation functions from the source code
  directory, determines which ones apply to the current deployment, and runs
  them on the database.

* Uses Javascript to [manipulate JSON files][mdn-files] to [export][file-export]
  and [import][file-import] bookmarks.

[babel]: https://babeljs.io/
[bookmarklet]: https://en.wikipedia.org/wiki/Bookmarklet
[code-router]: https://github.com/cthierer/wallaby/blob/master/src/router.js
[darth-vader]: http://marvel.com/comics/series/19379/darth_vader_2015_-_present
[example-postmessage]: https://github.com/cthierer/wallaby/blob/master/src/templates/auth-success.hbs#L12
[example-proxy]: https://github.com/cthierer/wallaby/blob/master/src/tags/bookmark-button.tag#L48
[file-export]: https://github.com/cthierer/wallaby/blob/master/src/tags/export.tag#L25
[file-import]: https://github.com/cthierer/wallaby/blob/master/src/tags/import.tag#L13
[heroku]: https://www.heroku.com
[koa]: https://github.com/koajs/koa/tree/v2.x
[marvel]: http://marvel.com/comics
[migration]: https://github.com/cthierer/wallaby/blob/master/src/data/index.js
[mdn-files]: https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications
[mdn-proxy]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[netlify]: https://www.netlify.com/
[redis]: https://redis.io/
[riot]: http://riotjs.com/
[todo-branching]: https://github.com/cthierer/wallaby/blob/f7f67fa453d68e4caebabd2dff182e68017aac98/src/modules/bookmarks/middleware/list.js#L42
[wallaby]: https://wallaby.builds.solutions
[wallaby-library]: ./library.png
[wallaby-toolbar]: ./toolbar.png
[webpack]: https://webpack.github.io/
