# Stayhome Dashboard

Dashboard presentation of Stayhome.app useage and protected resources.

All views require Keycloak authentication.  Keycloak roles determine authorization scopes.

### Setup
#
1) `git clone <this repository>`
2) * mkvirtualenv stayhome-dashboard
3) * pip install nodeenv
4) * nodeenv --python-virtualenv
5) * pip install -e .
6) * npm install .

### Run
#
1) Run the script located in the `dashboard/bin` directory:
   * `dashboard/bin/dashboardrun.sh`
