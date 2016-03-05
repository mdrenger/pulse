#!/usr/bin/env python

from flask_frozen import Freezer
from pulse import app
from app import models

freezer = Freezer(app)

# Currently unused sites:

#@freezer.register_generator
#def agency_files():
#    for agency in models.Agency.all():
#        yield 'agency', { 'slug': agency['slug'] }
#
#@freezer.register_generator
#def domain_files():
#    for domain in models.Domain.all():
#        yield 'domain', { 'hostname': domain['domain'] }

@freezer.register_generator
def data_files():
    yield '/data/reports/https.json'
    yield '/data/domains/https.json'
    yield '/data/domains/https.csv'
    yield '/data/agencies/https.json'

if __name__ == '__main__':
    freezer.freeze()