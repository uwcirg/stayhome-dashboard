from flask import (
    Blueprint,
    abort,
    current_app,
    jsonify,
    make_response,
    redirect,
    render_template,
    request,
    safe_join,
    send_from_directory,
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

    return send_from_directory(
        # todo: remove templates directory reference; index.html isn't a jinja template
        safe_join(current_app.static_folder, 'templates'),
        'index.html'
    )


@api_blueprint.route('/<string:resource_type>', methods=["GET"])
@oidc.require_login
def resource_bundle(resource_type, methods=["GET"]):
    """Query HAPI for resource_type and return as JSON FHIR Bundle

    :param resource_type: The FHIR Resource type, i.e. `Patient` or `CarePlan`
    :param search criteria: Include query string arguments to pass to HAPI
      as additional search criteria.  Example: /CarePlan?subject=Patient/8

    """
    token = oidc.get_access_token()
    if token is None or not oidc.validate_token(token):
        return redirect('logout')

    url = current_app.config.get('MAP_API') + resource_type
    params = {'_count': 1000}
    params.update(request.args)
    resp = requests.get(url, auth=BearerAuth(token), params=params)
    try:
        resp.raise_for_status()
    except requests.exceptions.HTTPError as err:
        abort(err.response.status_code, err)

    return jsonify(resp.json())


@api_blueprint.route(
    '/<string:resource_type>/<int:resource_id>', methods=["GET"])
@oidc.require_login
def resource_by_id(resource_type, resource_id, methods=["GET"]):
    """Query HAPI for individual resource; return JSON FHIR Resource
    """
    token = oidc.get_access_token()
    if token is None or not oidc.validate_token(token):
        return redirect('logout')

    url = f"{current_app.config.get('MAP_API')}{resource_type}/{resource_id}"
    resp = requests.get(url, auth=BearerAuth(token))
    try:
        resp.raise_for_status()
    except requests.exceptions.HTTPError as err:
        abort(err.response.status_code, err)

    return jsonify(resp.json())


@api_blueprint.route('/logout', methods=["GET"])
def logout(methods=["GET"]):
    token = oidc.user_loggedin and oidc.get_access_token()
    if token and oidc.validate_token(token):
        # Direct POST to Keycloak necessary to clear KC domain browser cookie
        logout_uri = oidc.client_secrets['userinfo_uri'].replace(
            'userinfo', 'logout')
        data = {
            'client_id': oidc.client_secrets['client_id'],
            'client_secret': oidc.client_secrets['client_secret'],
            'refresh_token': oidc.get_refresh_token()}
        result = requests.post(logout_uri, auth=BearerAuth(token), data=data)
        result.raise_for_status()

    oidc.logout()  # clears local cookie only

    message = 'Logged out.  Return to <a href="/">Stayhome Dashboard</a>'
    return make_response(message)
