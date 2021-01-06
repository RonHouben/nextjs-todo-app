/**
 * @license
 * Copyright (c) 2018-present, Loomble Inc <opensource@loomble.com>
 * Copyright (c) 2018-preset, Jay Rylan <jay@jayrylan.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Included documentation is from "[HTTP request methods][MDN]" by
 * [Mozilla Contributors][Contributors] and licensed under
 * [CC-BY-SA 4.0][CC-BY-SA].
 *
 * [MDN]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 * [Contributors]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods$history
 * [CC-BY-SA]: https://creativecommons.org/licenses/by-sa/4.0/legalcode
 */

/**
 * HTTP request methods.
 *
 * HTTP defines a set of request methods to indicate the desired action to be
 * performed for a given resource. Although they can also be nouns, these
 * request methods are sometimes referred as HTTP verbs. Each of them implements
 * a different semantic, but some common features are shared by a group of them:
 * e.g. a request method can be safe, idempotent, or cacheable.
 *
 * @public
 */
export enum HTTPMethod {
  /**
   * The `CONNECT` method establishes a tunnel to the server identified by the
   * target resource.
   */
  CONNECT = 'CONNECT',

  /**
   * The `DELETE` method deletes the specified resource.
   */
  DELETE = 'DELETE',

  /**
   * The `GET` method requests a representation of the specified resource.
   * Requests using GET should only retrieve data.
   */
  GET = 'GET',

  /**
   * The `HEAD` method asks for a response identical to that of a GET request,
   * but without the response body.
   */
  HEAD = 'HEAD',

  /**
   * The `OPTIONS` method is used to describe the communication options for the
   * target resource.
   */
  OPTIONS = 'OPTIONS',

  /**
   * The PATCH method is used to apply partial modifications to a resource.
   */
  PATCH = 'PATCH',

  /**
   * The `POST` method is used to submit an entity to the specified resource,
   * often causing a change in state or side effects on the server.
   */
  POST = 'POST',

  /**
   * The `PUT` method replaces all current representations of the target
   * resource with the request payload.
   */
  PUT = 'PUT',

  /**
   * The `TRACE` method performs a message loop-back test along the path to the
   * target resource.
   */
  TRACE = 'TRACE',
}

/**
 * @public
 */
export default HTTPMethod
