//export const Collections = {};
//export const Schemas = {};
//const SimpleSchema = require('simpl-schema');
//import Mongo  from 'mongo';
import SimpleSchema  from 'simpl-schema';
import { AutoForm } from 'meteor/aldeed:autoform';
SimpleSchema.extendOptions(['autoform']);

export const _userFeedbackCol = new Mongo.Collection('_userfeedback');	
export const _userFeedbackSchema = new SimpleSchema({
	title: {
    type: String,
		max: 127,
  },  
	titleUniq: {
    type: String,
    autoform: {
			omit: true,
      afFieldInput: {
        type: 'hidden'
      }
    }
  },
	text: {
    type: String,
		min: 100,
		autoform: {
			rows: 3,
		},
  },  
	tags: {
    type: Array,
		optional: true,
		autoform: {
			type: 'tags'
		}
  }, 
	'tags.$': {
		type: String,
		optional: true,
		autoform: {
			type: 'tags'
		}
  },
	votes: {
    type: Array,
		optional: true,
    autoform: {
			omit: true,
      afFieldInput: {
        type: 'hidden'
      }
    }
  }, 
	'votes.$': {
    type: String,
		optional: true,
  },
	voted:{
		type: Number,
		optional: true,
    autoform: {
			omit: true,
      afFieldInput: {
        type: 'hidden'
      }
		}
	},
	comments: {
    type: Array,
		optional: true,
    autoform: {
			omit: true,
      afFieldInput: {
        type: 'hidden'
      }
    }
  },
	'comments.$': {
    type: Object,
		optional: true,
  },
	'comments.$.userId': {
    type: String,
  }, 
	'comments.$.comment': {
    type: String,
  }, 
	'comments.$.createdAt': {
    type: String,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      }
    },
  }, 
	status: {
    type: String,
		optional: true,
		autoform: {
			type: 'select-radio',
			options: function (){return[{label:"submitted",value: "submitted"},{label:"selected",value:'selected'},{label:"in progress",value:'progress'},{label:"closed",value:'closed'}]},
			omit: true,
      afFieldInput: {
        type: 'hidden'
      }
    }
  },
	createdAt: {
    type: Date,
		optional: true,
    label: 'Date',
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      }
    },
    autoform: {
			omit: true,
      afFieldInput: {
        type: 'hidden'
      }
    }
  },
	userId: {
    type: String,
    autoform: {
      type: "hidden",
      label: false
    },
    regEx: SimpleSchema.RegEx.Id,
    defaultValue: function () {
			console.log('collection userId', this);
      if (Meteor.isClient && this.isInsert) {
        return Meteor.userId();
      }
    },
  },

});
//Collections._userFeedbackCol.attachSchema(Schemas._userFeedbackCol);
/* _userFeedbackCol.allow({
  insert: function () {
		if (Roles.userIsInRole(this.userId, ['admin'], 'adm-group')) 
			return true;
  },
  update: function () {
		if (Roles.userIsInRole(this.userId, ['admin'], 'adm-group')) 
			return true;
  },
  remove: function () {
		if (Roles.userIsInRole(this.userId, ['admin'], 'adm-group')) 
			return true;
  }
}); */