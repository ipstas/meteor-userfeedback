import '../common/collection.js';
import {_userFeedbackCol} from '../common/collection.js';

publishComposite('_userfeedback', function() {
	this.unblock();
	return {
		find(){
			return _userFeedbackCol.find({});
		},
		children: [
			{
				find(record) {	
					return Meteor.users.find({_id: record.userId},{limit:1, fields: {username: 1}});
				}
			}
		]
	}
});