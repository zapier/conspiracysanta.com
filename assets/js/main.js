var SEND_ENDPOINT = '/api/conspiracy/start';

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
    return React.DOM.form({className: 'form-inline', role: 'form', onSubmit: this.props.onMemberAdd},
      React.DOM.div({className: 'form-group'}, 
        React.DOM.input({type: 'text', autocomplete: 'off', className: 'form-control', name: 'name', placeholder: 'Name', onChange: this.props.onMemberEdit, value: this.props.member.name})
      ),
      ' ',
      React.DOM.div({className: 'form-group'}, 
        React.DOM.input({type: 'email', autocomplete: 'off', className: 'form-control', name: 'email', placeholder: 'Email', onChange: this.props.onMemberEdit, value: this.props.member.email})
      ),
      ' ',
      React.DOM.button({className: 'btn btn-success', type: 'submit'}, 'Add!')
    );
  }
});
MemberForm = React.createFactory(MemberForm);

var MemberList = React.createClass({
  propTypes: {
    optionalArrayOf: React.PropTypes.arrayOf(React.PropTypes.object)
  },
  render: function() {
    var _this = this;
    return React.DOM.ul(null,
      _.map(this.props.members, function(member, i) {
        return React.DOM.li(null,
          '' + member.name + ' <' + member.email + '> ',
          React.DOM.a({href: 'Javascript:', onClick: (function(event) { _this.props.onMemberDelete(event, i); }), className: 'text-danger'}, '×')
        );
      })
    )
  }
});
MemberList = React.createFactory(MemberList);

var SendMembers = React.createClass({
  propTypes: {
    optionalArrayOf: React.PropTypes.arrayOf(React.PropTypes.object)
  },
  getInitialState: function() {
    return {
      errorMessage: null,
      sending: false,
      sent: false
    };
  },
  sendEmails: function(event) {
    var _this = this;
    this.setState({sending: true, errorMessage: null});
    $.ajax({
      url: SEND_ENDPOINT,
      type: 'POST',
      data: JSON.stringify(this.props.members),
      contentType: 'application/json; charset=utf-8'
    }).done(function(data, textStatus, jqXHR) {
      _this.setState({sent: true});
    }).fail(function(jqXHR, textStatus, errorThrown) {
      _this.setState({errorMessage: 'We hit an error.', sending: false});
    });
  },
  canClick: function() {
    if ((!this.props.members.length) || this.state.sending || this.state.sent) {
      return false;
    }
    return true;
  },
  render: function() {
    var linkProps = {className: 'btn btn-success', role: 'button'};
    if (this.canClick()) {
      linkProps.onClick = this.sendEmails;
    } else {
      linkProps.disabled = 'disabled';
    }

    var copy = 'Start the conspiracy!';
    if (this.state.sending)
      copy = 'Sending emails...';
    if (this.state.sent)
      copy = 'Sent! Check your inboxes.';
    if (this.state.errorMessage)
      copy = 'Try again!';

    return React.DOM.p(null,
      React.DOM.a(linkProps, copy),
      ' ',
      this.state.errorMessage
    )
  }
});
SendMembers = React.createFactory(SendMembers);

var Dashboard = React.createClass({
  getInitialState: function() {
    return {
      members: [],
      currentMember: {}
    };
  },
  onMemberEdit: function(event) {
    var currentMember = this.state.currentMember;
    currentMember[event.target.name] = event.target.value;
    this.setState({currentMember: currentMember});
  },
  onMemberAdd: function(event) {
    event.preventDefault();
    var currentMember = this.state.currentMember;
    if (_.isEmpty(currentMember.name) || _.isEmpty(currentMember.email)) {
      return;
    }
    this.setState({
      members: this.state.members.concat([currentMember]),
      currentMember: {}
    });
  },
  onMemberDelete: function(event, index) {
    event.preventDefault();
    var newMembers = _.clone(this.state.members);
    newMembers.splice(index, 1)
    this.setState({
      members: newMembers
    });
  },
  render: function() {
    return React.DOM.div(null,
      React.DOM.h3(null, 'Who is part of the conspiracy?'),
      React.DOM.p(null, 'Anyone listed here will get the kick off all the email threads to start the conspiracy. We will not ever email you again for any reason.'),
      MemberList({members: this.state.members, onMemberDelete: this.onMemberDelete}),
      MemberForm({member: this.state.currentMember, onMemberEdit: this.onMemberEdit, onMemberAdd: this.onMemberAdd}),
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
