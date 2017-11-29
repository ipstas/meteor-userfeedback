## Meteor userfeedback 

 
## Installation

In a Meteor app directory, enter:

```
$ meteor add ipstas:userfeedback
```

## Example usage

```javascript
FlowRouter.route('/feedback', {
  name: 'feedback',
  action() {
    BlazeLayout.render('layout', { nav: 'navuser', main: '_userFeedback' });
		if (window.ll) ll('tagScreen', name);
  },
});
```

```html
<a class="{{isActiveRoute 'feedback'}}" href="/feedback"><i class="fa fa-commenting-o" aria-hidden="true"></i> Requests</a>
```
