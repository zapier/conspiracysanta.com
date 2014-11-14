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
    return React.DOM.form({className: 'form-inline', role: 'form'},
      React.DOM.div({className: 'form-group'}, 
        React.DOM.input({type: 'text', className: 'form-control', name: 'name', placeholder: 'Name', onChange: this.props.memberChange})
      ),
      ' ',
      React.DOM.div({className: 'form-group'}, 
        React.DOM.input({type: 'email', className: 'form-control', name: 'email', placeholder: 'Email', onChange: this.props.memberChange})
      ),
      ' ',
      React.DOM.a({className: 'btn btn-success', role: 'button', onClick: this.props.memberSave}, 'Add!')
    );
  }
});
MemberForm = React.createFactory(MemberForm);

var Member = React.createClass({
  render: function() {
    return React.DOM.p(null, 'Member here: ' + this.props.member.name + ' ' + this.props.member.email);
  }
});
Member = React.createFactory(Member);

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

var MemberList = React.createClass({
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
    var newMember = this.state.editingMember;
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
      _.map(this.state.members, function(member, i) {
        return Member({member: member, index: i});
      }),
      MemberForm({memberChange: this.memberChange, memberSave: this.memberSave}),
      SendMembers({members: this.state.members})
    );
  }
});
MemberList = React.createFactory(MemberList);


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
      return MemberList();
    } else {
      return GetStarted({onStart: this.onStart});
    }
  }
});
GlobalApp = React.createFactory(GlobalApp);


React.render(GlobalApp(), document.getElementById('react-app'));
