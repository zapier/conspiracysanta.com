var SEND_ENDPOINT = '/api/conspiracy/start';
var R = React.DOM;

var GetStarted = React.createClass({
  render: function() {
    var title = 'A Better Secret Santa for Teams';
    var copyLine1 = 'Work together to find each other the perfect Holiday gifts!';
    var copyLine2 = 'It\'s free and happens entirely over email.';
    return R.div({className: 'jumbotron'},
      R.h1(null, title),
      R.hr(),
      R.p({className: 'lead'}, copyLine1),
      R.p({className: 'lead'}, copyLine2),
      R.a({
        className: 'btn btn-lg',
        onClick: this.props.onStart,
        role: 'button'}, 'Play!'),
      R.div({className: 'micro'},
        R.a({
          href: 'https://zapier.com/blog/conspiracy-santa/',
          role: 'button'}, 'Tell me how it works.')
      )
    )
  }
});
var GetStarted = React.createFactory(GetStarted);

// the form that
var MemberForm = React.createClass({
  render: function() {
    return R.form({className: 'form-inline', role: 'form', onSubmit: this.props.onMemberAdd},
      R.div({className: 'form-group'},
        R.input({
          type: 'text',
          autocomplete: 'off',
          className: 'form-control',
          name: 'name',
          placeholder: 'Name',
          onChange: this.props.onMemberEdit,
          value: this.props.member.name})
      ),
      ' ',
      R.div({className: 'form-group'},
        R.input({
          type: 'email',
          autocomplete: 'off',
          className: 'form-control',
          name: 'email',
          placeholder: 'Email',
          onChange: this.props.onMemberEdit,
          value: this.props.member.email})
      ),
      ' ',
      R.button({className: 'btn btn-success', type: 'submit'}, 'Add')
    );
  }
});
var MemberForm = React.createFactory(MemberForm);

var MemberList = React.createClass({
  propTypes: {
    optionalArrayOf: React.PropTypes.arrayOf(React.PropTypes.object)
  },
  render: function() {
    var _this = this;
    return R.ul({className: 'members'},
      _.map(this.props.members, function(member, i) {
        return R.li(null,
          '' + member.name + ' <' + member.email + '> ',
          R.a({
            href: 'Javascript:',
            onClick: (function(event) { _this.props.onMemberDelete(event, i); }),
            className: 'text-danger'}, '×')
        );
      })
    )
  }
});
var MemberList = React.createFactory(MemberList);

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

    var copy = 'Start the Conspiracy';
    if (this.state.sending)
      copy = 'Sending emails...';
    if (this.state.sent)
      copy = 'Sent! Check your inboxes.';
    if (this.state.errorMessage)
      copy = 'Try again!';

    return R.p(null,
      R.a(linkProps, copy),
      ' ',
      this.state.errorMessage
    )
  }
});
var SendMembers = React.createFactory(SendMembers);

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
    return R.div(null,
      R.h3(null, 'Add Your Fellow Conspirators'),
      R.p(null, 'Add a name and email for each team member with whom you want to play Conpiracy Santa.'),
      R.p(null, 'Once you start the conspiracy, we\'ll begin an email thread for each team member with everyone CC\'d except the gift recipient for that thread.'),
      R.p(null, 'After that, it\'s all up to you to pick jolly gifts for each other. We won\'t email you again.'),
      MemberList({members: this.state.members, onMemberDelete: this.onMemberDelete}),
      MemberForm({member: this.state.currentMember, onMemberEdit: this.onMemberEdit, onMemberAdd: this.onMemberAdd}),
      SendMembers({members: this.state.members})
    );
  }
});
var Dashboard = React.createFactory(Dashboard);


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
var GlobalApp = React.createFactory(GlobalApp);


React.render(GlobalApp(), document.getElementById('react-app'));
