import SimpleSchema  from 'simpl-schema';
import moment  from 'moment';
import 'bootstrap-tagsinput';
import { AutoForm } from 'meteor/aldeed:autoform';

import './userfeedback.html';
import '../common/collection.js';

import {Collections} from '../common/collection.js';
import {Schemas} from '../common/collection.js';
import {_userFeedbackSchema} from '../common/collection.js';
import {_userFeedbackCol} from '../common/collection.js';
import {hooksDefault} from '../common/hooks.js';

window._userFeedbackCol = _userFeedbackCol;

AutoForm.addHooks('_requestForm', hooksDefault);

Template._userFeedback.onCreated( () => {
	let t = Template.instance();
	t.request =  new ReactiveVar(FlowRouter.getQueryParam('request'));
	if (Session.get('debug')) console.log('coll and sch:', _userFeedbackSchema, _userFeedbackCol);
});
Template._userFeedback.helpers({
	request(){
		let t = Template.instance();
		return FlowRouter.getQueryParam('request');
	},
});
Template._userFeedback.events({
	'click .xlSubmitFeature'(e,t){
		//t.request.set('new');
		//console.log('click .xlSubmitFeature', e, this);
		FlowRouter.setQueryParams({request: 'new'});
	},
	'click .signIn'(e,t){
		
	}
});

Template._userListFeed.onCreated( () => {
	let t = Template.instance();

	t.xlSort = new ReactiveVar();
	t.list =  new ReactiveVar({userId: Meteor.userId()});
	t.ready = new ReactiveVar(true);
	t.next = new ReactiveVar(4);
	t.limit = new ReactiveVar(8);
	t.sort = new ReactiveVar({createdAt: -1});
	t.loaded = new ReactiveVar(0);
	t.recordId = new ReactiveVar();
	t.commentId = new ReactiveVar();
	t.hoverOver = new ReactiveVar();
	
	var sub;
	t.autorun(function(){
		if (FlowRouter.getParam("username")) {
			t.list.set({username: FlowRouter.getParam("username")});
			sub = t.subscribe('_userfeedback',{
				username: FlowRouter.current().params.username,
				limit: t.limit.get(),
				sort: t.sort.get()
			});
		} else {
			t.list.set({userId: Meteor.userId()});	
			sub = t.subscribe('_userfeedback',{
				userId: Meteor.userId(),
				limit: t.limit.get(),
				sort: t.sort.get()
			});
		}
		t.ready.set(sub.ready());
		if (Session.get('debug')) console.log('_userfeedback sub', sub, t.list.get(), t.sort.get(), t.limit.get());		
	})	
	
	t.autorun(function(){
		if (!t.ready.get()) return;
		t.loaded.set(_userFeedbackCol.find().count());
	});	
});
Template._userListFeed.onRendered(()=> {

});
Template._userListFeed.helpers({
	admin(){
		let admin = Roles.userIsInRole(Meteor.userId(), ['admin'], 'admGroup') || Roles.userIsInRole(Meteor.userId(), ['admin']);
		return admin;
	},
	xlSort(){
		return FlowRouter.getQueryParam('sort') || 'All';
	},
	record(){
		var sorted = FlowRouter.getQueryParam('sort');
		var sublist = {}, sort = {createdAt: -1};
		if (sorted == 'recent')
			sort = {'comments.createdAt': -1};
		else if (sorted == 'popular')
			sort = {votes: -1};
		if (sorted == 'owned')
			sublist.userId = Meteor.userId();
		else if (sorted == 'voted')
			sublist = {'comments.userId': Meteor.userId()};
		else if (sorted == 'closed')
			sublist = {status: 'closed'};
		let admin = Roles.userIsInRole(Meteor.userId(), ['admin'], 'admGroup') || Roles.userIsInRole(Meteor.userId(), ['admin']);
		if (!sublist.status && sorted != 'owned' && !admin)
			sublist.status = {$ne: 'submitted'};
		var list = {$or: [{userId: Meteor.userId()}, sublist]};
		var data = _userFeedbackCol.find(list,{sort: sort});
		if (Session.get('debug')) console.log('_userFeedbackCol:', list, sort, data.count(), data.fetch());
		return data;
	},
	status(){
		if (!this.status)
			return 'submitted';
		else 
			return this.status;
	},
	createdAt(){
		var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		//return this.createdAt.toLocaleDateString();
		return moment.duration(new Date() - this.createdAt).humanize();
	},
	votesCount(){
		var count = 0;
		if (this.votes)
			count = this.votes.length;
		return count;
	},
	commentsCount(){
		var count = 0;
		if (this.comments)
			count = this.comments.length;
		return count;
	},
	user(){
		return Meteor.users.findOne(this.userId);
	},
	now(){
		return new Date();
	},
	myvoted(){
		if (Session.get('debug')) console.log('voted', this.votes, _.findWhere(this.votes, Meteor.userId()));
		if (_.findWhere(this.votes, Meteor.userId()))
			return 'xlVoted';
	},
	recordId(){
		let t = Template.instance();
		return t.recordId.get();
	},
	commentId(){
		let t = Template.instance();
		return t.commentId.get();
	},
	schema(){
		//console.log('Schemas:', Schemas);
		return _userFeedbackSchema;
	},
	collection(){
		//console.log('Collections:', Collections);
		return _userFeedbackCol;
	},
	schemaComment(){
		return {
			comment: {
				type: String
			}
		}
	},
	hoverOver(){
		let t = Template.instance();
		return t.hoverOver.get();
	},
	debug(){
		if (Session.get('debug')) console.log('debug', this);
	}

});
Template._userListFeed.events({
	'click .xlSort' (e,t){
		if (Session.get('debug')) console.log('click xlSort', e, e.currentTarget.id);
		var sort = e.currentTarget.id;
		if (sort == 'all') sort = null;
		FlowRouter.setQueryParams({sort:sort});
		t.xlSort.set(sort);
	},
	'mouseover .xlVote'(e,t){
		//console.log('over hoverOver', this);
		t.hoverOver.set(this._id);
	},
	'mouseleave .xlVote'(e,t){
		//console.log('left  hoverOver', this);
		t.hoverOver.set();
	},
	'click .xlVote' (e,t){
		//.console.log('click xlVote', this);
		if (Meteor.userId())
			Meteor.call('feedback.vote',{_id: this._id});
	},
	'click .xlComment' (e,t){
		if (Session.get('debug')) console.log('click commentId', this);
		t.commentId.set(this._id);
	},
	'click .xlRecord' (e,t){
		if (Session.get('debug')) console.log('click recordId', this);
		t.recordId.set(this._id);
	},
	'click .xlDelete' (e,t){
		_userFeedbackCol.remove(this._id);
	},
	'click .xlStatus' (e,t){
		e.preventDefault();
		if (Session.get('debug')) console.log('click xlStatus', this, e);
		//Meteor.call('feedback.vote',{_id: this._id});
	},
	'click .dropdown-menu' (e,t){
		e.preventDefault();
		if (Session.get('debug')) console.log('click xlStatusMenu', this, e.target.text);
		Meteor.call('feedback.status',{status: e.target.text, _id: this._id});
	},
	'click .closeForm' (e,t){
		e.preventDefault();	
		t.recordId.set();
		t.commentId.set();
		if (Session.get('debug')) console.log('closeForm', e,t,this);
	},
	'click .hideModal'(){
		Modal.hide();
	}
});

Template._userListSide.onCreated( () => {
	let t = Template.instance();

	t.xlSort = new ReactiveVar();
	t.list =  new ReactiveVar({userId: Meteor.userId()});
	t.ready = new ReactiveVar(true);
	t.next = new ReactiveVar(4);
	t.limit = new ReactiveVar(8);
	t.sort = new ReactiveVar({createdAt: -1});
	t.loaded = new ReactiveVar(0);
	t.recordId = new ReactiveVar();
	t.commentId = new ReactiveVar();
	t.hoverOver = new ReactiveVar();
	
	var sub;
	t.autorun(function(){
		if (FlowRouter.getParam("username")) {
			t.list.set({username: FlowRouter.getParam("username")});
			sub = t.subscribe('_userfeedback',{
				username: FlowRouter.current().params.username,
				limit: t.limit.get(),
				sort: t.sort.get()
			});
		} else {
			t.list.set({userId: Meteor.userId()});	
			sub = t.subscribe('_userfeedback',{
				userId: Meteor.userId(),
				limit: t.limit.get(),
				sort: t.sort.get()
			});
		}
		t.ready.set(sub.ready());
		if (Session.get('debug')) console.log('_userfeedback sub', sub, t.list.get(), t.sort.get(), t.limit.get());		
	})	
	
	t.autorun(function(){
		if (!t.ready.get()) return;
		t.loaded.set(_userFeedbackCol.find().count());
	});	
});
Template._userListSide.onRendered(()=> {

});
Template._userListSide.helpers({
	xlSort(){
		return FlowRouter.getQueryParam('sort');
	},
	top3(){
		var sorted = FlowRouter.getQueryParam('sort');
		var sort = {voted: -1};
		var list = {status: {$ne: 'submitted'}};
		var data = _userFeedbackCol.find(list,{sort: sort, limit: 3});
		if (Session.get('debug')) console.log('_userFeedbackCol top3:', list, sort, data.count(), data.fetch());
		return data;
	},	
	recentCommented(){
		var sorted = FlowRouter.getQueryParam('sort');
		var sort = {'comments.createdAt': -1};
		var list = {status: {$ne: 'submitted'}};
		var data = _userFeedbackCol.find(list,{sort: sort, limit: 3});
		if (Session.get('debug')) console.log('_userFeedbackCol top3:', list, sort, data.count(), data.fetch());
		return data;
	},	
	recentCreated(){
		var sorted = FlowRouter.getQueryParam('sort');
		var sort = {createdAt: -1};
		var list = {status: {$ne: 'submitted'}};
		var data = _userFeedbackCol.find(list,{sort: sort, limit: 3});
		if (Session.get('debug')) console.log('_userFeedbackCol top3:', list, sort, data.count(), data.fetch());
		return data;
	},
	status(){
		if (!this.status)
			return 'submitted';
		else 
			return this.status;
	},
	createdAt(){
		var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		//return this.createdAt.toLocaleDateString();
		return moment.duration(new Date() - this.createdAt).humanize();
	},
	votesCount(){
		var count = 0;
		if (this.votes)
			count = this.votes.length;
		return count;
	},
	commentsCount(){
		var count = 0;
		if (this.comments)
			count = this.comments.length;
		return count;
	},
	user(){
		return Meteor.users.findOne(this.userId);
	},
	now(){
		return new Date();
	},
	myvoted(){
		if (Session.get('debug')) console.log('voted', this.votes, _.findWhere(this.votes, Meteor.userId()));
		if (_.findWhere(this.votes, Meteor.userId()))
			return 'xlVoted';
	},
	recordId(){
		let t = Template.instance();
		return t.recordId.get();
	},
	commentId(){
		let t = Template.instance();
		return t.commentId.get();
	},
	schema(){
		//console.log('Schemas:', Schemas);
		return _userFeedbackSchema;
	},
	collection(){
		//console.log('Collections:', Collections);
		return _userFeedbackCol;
	},
	schemaComment(){
		return {
			comment: {
				type: String
			}
		}
	},
	hoverOver(){
		let t = Template.instance();
		return t.hoverOver.get();
	},
	debug(){
		if (Session.get('debug')) console.log('debug', this);
	}

});
Template._userListSide.events({
	'click .xlSort' (e,t){
		if (Session.get('debug')) console.log('click xlSort', e, e.currentTarget.id);
		var sort = e.currentTarget.id;
		if (sort == 'all') sort = null;
		FlowRouter.setQueryParams({sort:sort});
		t.xlSort.set(sort);
	},
	'mouseover .xlVote'(e,t){
		//console.log('over hoverOver', this);
		t.hoverOver.set(this._id);
	},
	'mouseleave .xlVote'(e,t){
		//console.log('left  hoverOver', this);
		t.hoverOver.set();
	},
	'click .xlVote' (e,t){
		//console.log('click xlVote', this);
		Meteor.call('feedback.vote',{_id: this._id});
	},
	'click .xlComment' (e,t){
		if (Session.get('debug')) console.log('click commentId', this);
		t.commentId.set(this._id);
	},
	'click .xlRecord' (e,t){
		if (Session.get('debug')) console.log('click recordId', this);
		t.recordId.set(this._id);
	},
	'click .xlDelete' (e,t){
		_userFeedbackCol.remove(this._id);
	},
	'click .xlStatus' (e,t){
		e.preventDefault();
		if (Session.get('debug')) console.log('click xlStatus', this, e);
		//Meteor.call('feedback.vote',{_id: this._id});
	},
	'click .dropdown-menu' (e,t){
		e.preventDefault();
		if (Session.get('debug')) console.log('click xlStatusMenu', this, e.target.text);
		Meteor.call('feedback.status',{status: e.target.text, _id: this._id});
	},
	'click .closeForm' (e,t){
		e.preventDefault();	
		t.recordId.set();
		t.commentId.set();
		if (Session.get('debug')) console.log('closeForm', e,t,this);
	},
	'click .hideModal'(){
		Modal.hide();
	}
});

Template._userRequest.onCreated( () => {
	let t = Template.instance();
 
	t.list =  new ReactiveVar({userId: Meteor.userId()});
	t.ready = new ReactiveVar(true);
	t.next = new ReactiveVar(4);
	t.limit = new ReactiveVar(8);
	t.sort = new ReactiveVar({createdAt: -1});
	t.loaded = new ReactiveVar(0);
	t.recordId = new ReactiveVar();
	t.commentId = new ReactiveVar();
	
	var sub;
	t.autorun(function(){		
		t.list.set({titleUniq: FlowRouter.getQueryParam("request")});
		sub = t.subscribe('_userfeedback',{
			titleUniq: FlowRouter.getQueryParam("request"),
			limit: t.limit.get(),
			sort: t.sort.get()
		});

		t.ready.set(sub.ready());
		if (Session.get('debug')) console.log('_userfeedback sub', sub, t.list.get(), t.sort.get(), t.limit.get());		
	})	
	
	t.autorun(function(){
		if (!t.ready.get()) return;
		t.loaded.set(_userFeedbackCol.find().count());
	});	
});
Template._userRequest.onRendered(()=> {

});
Template._userRequest.helpers({
	record(){
		var data = _userFeedbackCol.findOne({titleUniq: FlowRouter.getQueryParam("request")});
		if (Session.get('debug')) console.log('_userFeedbackCol _userRequest:', {titleUniq: FlowRouter.getQueryParam("request")}, data);
		return data;
	},
	status(){
		if (!this.status)
			return 'submitted';
		else 
			return this.status;
	},
	createdAt(){
		var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		//return this.createdAt.toLocaleDateString();
		return moment.duration(new Date() - this.createdAt).humanize();
	},
	votesCount(){
		var count = 0;
		if (this.votes)
			count = this.votes.length;
		return count;
	},
	commentsCount(){
		var count = 0;
		if (this.comments)
			count = this.comments.length;
		return count;
	},
	user(){
		return Meteor.users.findOne(this.userId);
	},
	now(){
		return new Date();
	},
	recordId(){
		let t = Template.instance();
		return t.recordId.get();
	},	
	commentId(){
		let t = Template.instance();
		return t.commentId.get();
	},
	schema(){
		//console.log('Schemas:', Schemas);
		return _userFeedbackSchema;
	},
	collection(){
		//console.log('Collections:', Collections);
		return _userFeedbackCol;
	},
	schemaComment(){
		return {
			comment: {
				type: String
			}
		}		
	},
	debug(){
		console.log('debug', this);
	}

});
Template._userRequest.events({
	'click .backToFeedback' (e,t){
		e.preventDefault();
		FlowRouter.setQueryParams({request: null});
	},
	'click .xlSubmitComment' (e,t){
		if (Session.get('debug')) console.log('click commentId', this);
		t.commentId.set(this._id);
	},		
	'click .xlRecord' (e,t){
		if (Session.get('debug')) console.log('click recordId', this);
		t.recordId.set(this._id);
	},			
	'click .xlVote' (e,t){
		//console.log('click xlVote', this);
		Meteor.call('feedback.vote',{_id: this._id});
	},
	'click .xlDelete' (e,t){
		_userFeedbackCol.remove(this._id);
	},	
	'click .closeForm' (e,t){
		e.preventDefault();	
		t.recordId.set();
		t.commentId.set();
		if (Session.get('debug')) console.log('closeForm', e,t,this);
	},
	'click .hideModal'(){
		Modal.hide();
	}
});


Template._addNewRequest.helpers({
	doc(){
		var doc = {userId: Meteor.userId()};
		return doc;
	},
	schema(){
		//console.log('Schemas:', Schemas);
		return _userFeedbackSchema;
	},
	collection(){
		//console.log('Collections:', Collections);
		return _userFeedbackCol;
	},
	debug(){
		if (Session.get('debug')) console.log('debug', this);
	}
});
Template._addNewRequest.events({

});