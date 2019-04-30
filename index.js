export const name = module.id;

import SimpleSchema  from 'simpl-schema';
import { AutoForm } from 'meteor/aldeed:autoform';
import 'bootstrap-tagsinput';

import './client/userfeedback.js';
import './client/modal.js';
import './client/route.js';

import {_userFeedbackSchema} from './common/collection.js';
import {_userFeedbackCol} from './common/collection.js';
import {hooksDefault} from './common/hooks.js';

console.log('[ipstas:userfeedback] index imported:', name, this);

//import './server/publish.js';