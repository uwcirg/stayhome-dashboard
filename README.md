# Stayhome Dashboard

Dashboard presentation of Stayhome.app useage and protected resources.

All views require Keycloak authentication.  Keycloak roles determine authorization scopes.

### Setup
#
1) `git clone <this repository>`
2) `cp client_secrets.json.default client_secrets.json`  # Edit to fit
3) `mkvirtualenv stayhome-dashboard`
4) `pip install nodeenv`
5) `nodeenv --python-virtualenv`
6) `pip install -e .`
7) `npm install .`

### Run
#
1) Run the script located in the `dashboard/bin` directory:
   * `dashboard/bin/dashboardrun.sh`

Head over to `localhost:8000`, you should see: **Hi! From cookiecutter-flask-react**

Try `localhost:8000/Patient` as a Keycloak user with the `admin` role to see
a list of all patients.

### Resources
#
* Initial structure built using [cookiecutter-react-flask](https://github.com/arberx/cookiecutter-react-flask)
