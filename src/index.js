/**
 * @prettier
 * @flow
 */

import fetchUser from './fetchUser';
import type {User as InternalUser} from './fetchUser';

// TODO: Remove eslint-disable when we exporte more functions
// eslint-disable-next-line import/prefer-default-export
export {fetchUser};
export type User = InternalUser;
