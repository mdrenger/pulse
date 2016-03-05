#!/usr/bin/env python

from flask_frozen import Freezer
from pulse import app
from app import models

app.config['FREEZER_BASE_URL'] = 'https://robbi5.github.io/pulse/'

freezer = Freezer(app)

# Currently unused sites:

#@freezer.register_generator
#def agency_files():
#    for agency in models.Agency.all():
#        yield 'agency', { 'slug': agency['slug'] }

#@freezer.register_generator
#def domain_files():
#    for domain in models.Domain.all():
#        yield 'domain', { 'hostname': domain['domain'] }

@freezer.register_generator
def report_files():
    yield 'report', { 'report_name': 'https' }
    yield 'agency_report', { 'report_name': 'https' }
    yield 'domain_report', { 'report_name': 'https', 'ext': 'json' }
    yield 'domain_report', { 'report_name': 'https', 'ext': 'csv' }

if __name__ == '__main__':
    freezer.freeze()