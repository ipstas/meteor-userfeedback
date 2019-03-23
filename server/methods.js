import '../common/collection.js';
import {_userFeedbackCol} from '../common/collection.js';
Meteor.methods({
	'feedback.comment'(params) {
		if (!params) return console.warn('empty comment');
		console.log('feedback.comment', params, params.modifier.$set['comments.$.comment']);
		var obj = {};
		obj.comment = params.modifier.$set['comments.$.comment'];
		obj.userId = this.userId;
		obj.createdAt = new Date();
		
		_userFeedbackCol.update(params._id,{$addToSet:{comments: obj}});
	},
	'feedback.vote'(params) {
		if (!this.userId) return console.warn('empty vote', this);
		var voted = _userFeedbackCol.findOne(params._id).votes.length;
		if (_userFeedbackCol.findOne({_id: params._id, votes: this.userId}))
			_userFeedbackCol.update(params._id,{$set: {voted: voted - 1}, $pull:{votes: this.userId}} );
		else
			_userFeedbackCol.update(params._id,{$set: {voted: voted + 1}, $addToSet:{votes: this.userId}});
	},
	'feedback.status'(params) {
		let admin = Roles.userIsInRole(this.userId, ['admin'], 'admGroup') || Roles.userIsInRole(this.userId, ['admin']);
		if (!admin) return console.warn('non auth status change by', this.userId, params);
		//if (params.status == 'submitted') params.status = null;
		var updated = _userFeedbackCol.update(params._id,{$set: {status: params.status}});
		//_userFeedbackCol.update(params._id,{$set: {status: 'selected'}});
		if (params.debug) console.log('feedback.status', updated, 'params:', params, 'coll:', _userFeedbackCol.findOne(params._id));
	},

});