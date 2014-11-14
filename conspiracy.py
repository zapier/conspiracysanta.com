import os
import bottle

from bottle import run, get, static_file, route

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


if __name__ == '__main__':
    run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

app = bottle.default_app()
