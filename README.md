# Stayhome Dashboard

Dashboard presentation of Stayhome.app useage and protected resources.

All views require Keycloak authentication.  Keycloak roles determine authorization scopes.

### Setup
#
1) `git clone <this repository>`
2) `mkvirtualenv stayhome-dashboard`
3) `pip install nodeenv`
4) `nodeenv --python-virtualenv`
5) `pip install -e .`
6) `npm install .`

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
