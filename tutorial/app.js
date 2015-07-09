// tutorial1-raw.js
var CommentBox = React.createClass({displayName: 'CommentBox',
  render: function() {
    return (
      React.DOM.div({className: "commentBox"},
        "Hello, world! I am a CommentBox."
      )
    );
  }
});
React.renderComponent(
  CommentBox(null),
  document.getElementById('content')
);
