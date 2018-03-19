import { observable, action } from 'mobx';
import agent from '../agent';

/**
 * Handle user actions and state
 */
class UserStore {

  /**
   * The currently logged in user.  Expecting an object containing:
   * {
   *   username: STRING,
   *   _id: INT user database id
   * }
   * @type {object}
   */
  @observable currentUser;

  /**
   * Loading state for fetching the user; true if we're accessing the db, false if we've fetched the user
   * @type {boolean}
   */
  @observable loadingUser;

  /**
   * Pending values for updating user data, such as resetting username or password
   */
  @observable updatingUser;
  @observable updatingUserErrors;

  /**
   * Fetch user from the db.  On the server side the auth token will be read to determine
   * if they are authorized
   * @returns {Promise<any>}
   */
  @action pullUser() {
    this.loadingUser = true;
    return agent.Auth
      .current()
      .then(action((user) => {
        return this.currentUser = user.result.user;
      }))
      .finally(action(() => { this.loadingUser = false; }))
  }

  /**
   * Log out
   */
  @action forgetUser() {
    this.currentUser = undefined;
  }
}

export default new UserStore();
