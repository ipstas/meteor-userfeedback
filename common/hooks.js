// import { AutoForm } from 'meteor/aldeed:autoform';
// import {Collections} from '/imports/api/links/collections.js';
// import {Schemas} from '/imports/api/links/collections.js';

// var docId = new ReactiveVar();
import { Random } from 'meteor/random';

export const hooksDefault = {
  formToDoc: function(doc) {
		doc.titleUniq = doc.title + '-' + Random.id(4);
		doc.userId = Meteor.userId();
		doc.status = 'submitted';
		doc.votes = [];
		doc.comments = [];
		doc.createdAt = new Date();
		console.log('hooksDefault formToDoc typeless hooksDefault', doc, '\nthis:', this);
    // alter doc
    return doc;
  },
	before: {
		insert: function (doc) {
			console.log('hooksDefault insert', doc, '\nthis:', this);
			return doc;
		},		
/* 		update: function (doc) {
			console.log('hooksDefault update', doc, '\nthis:', this);
		} */
  },
/*   after: {
    // Replace `formType` with the form `type` attribute to which this hook applies
    console.log('hooksDefault insert', doc, '\nthis:', this);
  }, */
  onSubmit: function(insertDoc, updateDoc, currentDoc) {
		console.log("hooksDefault onSubmit hook hooksDefault called with arguments", insertDoc, updateDoc, currentDoc, '\nthis:', this);
		this.done();
  },
  onError: function () {
    console.log("hooksDefault onError hook hooksDefault called with arguments", '\context:', this);
		if (arguments[1].reason)
			Bert.alert(arguments[1].reason, 'danger');
		else if (arguments[1].message)
			Bert.alert(arguments[1].message, 'danger');
  },
	onSuccess: function (doc) {
		console.log("hooksDefault onSuccess on hooksDefault input/update/method forms!", this, '\ndoc:', doc);
		FlowRouter.setQueryParams({request: null});
	},

};