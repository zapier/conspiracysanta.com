import os
import bottle
import requests
import misaka

from bottle import run, get, static_file, route, request, response

MAILGUN_BASE = 'https://api.mailgun.net/v2'
MAILGUN_FROM = os.environ.get('MAILGUN_FROM', None)
MAILGUN_DOMAIN = os.environ.get('MAILGUN_DOMAIN', None)
MAILGUN_API_KEY = os.environ.get('MAILGUN_API_KEY', None)

MAX_MEMBERS = 100

SUBJECT_TEMPLATE = '{name} - Conspiracy Santa'
BODY_TEMPLATE = '''
Your mission, should you choose to accept it, is to select the most awesome of gift(s) for {name}. The details of the mission are simple:

* Reply-all to share information or cool stories about {name}
* Synthesize information and begin discussion of *awesome gift ideas*
* Gift ideas should fall under any of the following:
  * Relevant to their interests
  * Thoughtful or meaningful
  * Funny or cutesy
  * Just plain cool
* Sum price of gift(s) must stay under the decided $$$ amount
* Once a concensus is met, an appointed member will arrange to get said gift(s)
* Be careful not to leak the information to {name}, check which thread you are replying to and the to/cc/bcc addresses before sending!

Good luck!
-Conspiracy Santa

*Powered by [Conspiracy Santa](http://conspiracysanta.com/) and [Zapier](https://zapier.com/).*
'''


@get('/js/<filename:re:.*\.js>')
def javascripts(filename):
    return static_file(filename, root='assets/js')

@get('/css/<filename:re:.*\.css>')
def stylesheets(filename):
    return static_file(filename, root='assets/css')

@get('/img/<filename:re:.*\.(jpg|png|gif|ico)>')
def images(filename):
    return static_file(filename, root='assets/img')

@get('/fonts/<filename:re:.*\.(eot|ttf|woff|svg)>')
def fonts(filename):
    return static_file(filename, root='assets/fonts')


@route('/')
def home():
    return static_file('base.html', root='assets/html')

@route('/api/conspiracy/start', method='POST')
def start_conspiracy():
    members = request.json

    # validate the members!
    valid_members = True

    if not members or not isinstance(members, list):
        valid_members = False

    for member in members:
        if not (isinstance(member, dict) and member.get('name') and member.get('email')):
            valid_members = False

    if len(members) > MAX_MEMBERS:
        valid_members = False

    if not valid_members:
        response.status = 403
        return {
            'success': False,
            'errors': ['Provide some JSON like [{"name": "Joe", "email": "joe@example.com"}]!']
        }

    MAILGUN_ENDPOINT = '{}/{}/messages'.format(MAILGUN_BASE, MAILGUN_DOMAIN)

    # now email the members!
    for member in members:
        pruned = [m for m in members if m != member]
        to = u','.join([m['email'] for m in pruned])
        subject = SUBJECT_TEMPLATE.format(**member)
        body = BODY_TEMPLATE.format(**member)

        html = misaka.html(body)
        payload = {
            'from': 'Conspiracy Santa <{}>'.format(MAILGUN_FROM),
            'to': to,
            'subject': subject,
            'html': html
        }
        response = requests.post(MAILGUN_ENDPOINT, data=payload, auth=('api', MAILGUN_API_KEY))
        response.raise_for_status()

    return {
        'success': True
    }


if __name__ == '__main__':
    run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

app = bottle.default_app()
