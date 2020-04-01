from flask import (
    Blueprint,
    current_app,
    jsonify,
    make_response,
    redirect,
    render_template,
)
import requests

from dashboard.bearer_auth import BearerAuth
from dashboard.extensions import oidc


api_blueprint = Blueprint('dashboard-api', __name__)


@api_blueprint.route('/', methods=["GET"])
@oidc.require_login
def main(methods=["GET"]):
    """ Main route, entry point for react. """
    token = oidc.get_access_token()
    if token is None or not oidc.validate_token(token):
        return redirect('logout')
    return render_template('index.html')


@api_blueprint.route('/Patient', methods=["GET"])
@oidc.require_login
def patients_list(methods=["GET"]):
    """ Crude demo for direct access to HAPI Patient list

    NB - the Keycloak user must possess the `admin` role (set w/i Keycloak UI)
    to view all patients.

    """
    token = oidc.get_access_token()
    if token is None or not oidc.validate_token(token):
        return redirect('logout')

    url = current_app.config.get('MAP_API') + 'Patient'
    params = {'_count': 1000}
    resp = requests.get(url, auth=BearerAuth(token), params=params)
    resp.raise_for_status()
    return jsonify(resp.json())


@api_blueprint.route('/logout', methods=["GET"])
def logout(methods=["GET"]):
    oidc.logout()
    message = 'Logged out.  Return to <a href="/">Dashboard</a>'
    return make_response(message)
