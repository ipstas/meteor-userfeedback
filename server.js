import SimpleSchema  from 'simpl-schema';
import { AutoForm } from 'meteor/aldeed:autoform';
import {_userFeedbackSchema} from './common/collection.js';
import {_userFeedbackCol} from './common/collection.js';
import {hooksDefault} from './common/hooks.js';

import './server/methods.js';
import './server/publish.js';