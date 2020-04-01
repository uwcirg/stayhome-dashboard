import dashboard
from flask import (
    current_app,
    jsonify,
    make_response,
    redirect,
    render_template,
)
import requests

from dashboard import oidc


class BearerAuth(requests.auth.AuthBase):
    def __init__(self, token):
        self.token = token

    def __call__(self, r):
        r.headers['Authorization'] = f"Bearer {self.token}"
        return r


@dashboard.app.route('/', methods=["GET"])
@oidc.require_login
def main(methods=["GET"]):
    """ Main route, entry point for react. """
    token = oidc.get_access_token()
    if token is None or not oidc.validate_token(token):
        return redirect('logout')
    return render_template('index.html')


@dashboard.app.route('/Patient', methods=["GET"])
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


@dashboard.app.route('/logout', methods=["GET"])
def logout(methods=["GET"]):
    oidc.logout()
    message = 'logged out.  Return to <a href="/Patient">Patient List</a>'
    return make_response(message)
