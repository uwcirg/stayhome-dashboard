
import dashboard
import flask

@dashboard.app.route('/', methods=["GET"])
def main(methods=["GET"]):
    """ Main route, entry point for react. """ 
    return flask.render_template('index.html')
