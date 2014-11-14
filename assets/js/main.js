var GetStarted = React.createClass({
    render: function() {
        return React.DOM.div({className: "jumbotron"}, 
          React.DOM.h1(null, "A Better Secret Santa for Teams"), 
          React.DOM.p({className: "lead"}, "Let the whole team work together to find the perfect gifts for everyone! It is 100% free and happens entirely over email."), 
          React.DOM.p(null, React.DOM.a({className: "btn btn-lg btn-success", href: "#", role: "button"}, "Let's Do It!"))
        )
    }
});
GetStarted = React.createFactory(GetStarted);

var GlobalApp = React.createClass({
    render: function() {
        return GetStarted();
    }
});
GlobalApp = React.createFactory(GlobalApp);

React.render(GlobalApp(), document.getElementById('react-app'));
