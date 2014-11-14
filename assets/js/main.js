var GetStarted = React.createClass({
  render: function() {
    var title = 'A Better Secret Santa for Teams';
    var copy = 'Let the whole team work together to find the perfect gifts for everyone! It is 100% free and happens entirely over email.';
    return React.DOM.div({className: 'jumbotron'}, 
      React.DOM.h1(null, title), 
      React.DOM.p({className: 'lead'}, copy), 
      React.DOM.p(null,
        React.DOM.a({className: 'btn btn-lg btn-success', onClick: this.props.onStart, role: 'button'}, 'Let\'s Do It!')
      )
    )
  }
});
GetStarted = React.createFactory(GetStarted);

// the form that 
var MemberForm = React.createClass({
  render: function() {
    return React.DOM.form({className: 'form-inline', role: 'form', onSubmit: this.props.memberSave},
      React.DOM.div({className: 'form-group'}, 
        React.DOM.input({type: 'text', autocomplete: 'off', className: 'form-control', name: 'name', placeholder: 'Name', onChange: this.props.memberChange, value: this.props.member.name})
      ),
      ' ',
      React.DOM.div({className: 'form-group'}, 
        React.DOM.input({type: 'email', autocomplete: 'off', className: 'form-control', name: 'email', placeholder: 'Email', onChange: this.props.memberChange, value: this.props.member.email})
      ),
      ' ',
      React.DOM.button({className: 'btn btn-success', type: 'submit'}, 'Add!')
    );
  }
});
MemberForm = React.createFactory(MemberForm);

var MemberList = React.createClass({
  render: function() {
    return React.DOM.ul(null,
      _.map(this.props.members, function(member, i) {
        return React.DOM.li(null, '' + member.name + ' ' + member.email);
      })
    )
  }
});
MemberList = React.createFactory(MemberList);

var SendMembers = React.createClass({
  sendEmails: function(event) {
    // TODO: API call
  },
  render: function() {
    if (!this.props.members.length) {
      return null
    }
    return React.DOM.p(null, React.DOM.a({className: 'btn btn-success', role: 'button', onClick: this.sendEmails}, 'Start the conspiracy!'))
  }
});
SendMembers = React.createFactory(SendMembers);

var Dashboard = React.createClass({
  getInitialState: function() {
    return {
      sent: false,
      members: [],
      editingMember: {}
    };
  },
  memberChange: function(event) {
    var newMember = this.state.editingMember;
    newMember[event.target.name] = event.target.value;
    this.setState({editingMember: newMember});
  },
  memberSave: function(event) {
    event.preventDefault();
    var newMember = this.state.editingMember;
    if (_.isEmpty(newMember.name) || _.isEmpty(newMember.email)) {
      return;
    }
    this.setState({
      members: this.state.members.concat([newMember]),
      editingMember: {}
    });
  },
  sentEmails: function(event) {
    this.setState({sent: !this.state.sent});
  },
  render: function() {
    return React.DOM.div(null,
      React.DOM.h3(null, 'Who is part of the conspiracy?'),
      React.DOM.p(null, 'Anyone listed here will get the kick off all the email threads to start the conspiracy. We will not ever email you again for any reason.'),
      MemberList({members: this.state.members}),
      MemberForm({member: this.state.editingMember, memberChange: this.memberChange, memberSave: this.memberSave}),
      SendMembers({members: this.state.members})
    );
  }
});
Dashboard = React.createFactory(Dashboard);


var GlobalApp = React.createClass({
  getInitialState: function() {
    return {
      started: false
    };
  },
  onStart: function(event) {
    this.setState({started: !this.state.started});
  },
  render: function() {
    if (this.state.started) {
      return Dashboard();
    } else {
      return GetStarted({onStart: this.onStart});
    }
  }
});
GlobalApp = React.createFactory(GlobalApp);


React.render(GlobalApp(), document.getElementById('react-app'));
