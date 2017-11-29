import '../common/collection.js';
import {_userFeedbackCol} from '../common/collection.js';

Meteor.publish('_userfeedback', function() {
	return _userFeedbackCol.find({});
});