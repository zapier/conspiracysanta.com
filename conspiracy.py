import os
import bottle

@bottle.route('/')
def hello_world():
    return '<h1>Hello Bottle!</h1>'

if __name__ == '__main__':
    bottle.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

app = bottle.default_app()
