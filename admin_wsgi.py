"""WSGI entry point for the local administration service."""
import os
from app import app

app.config.update(
 ADMIN_SERVICE=True,
 TRUSTED_HOSTS=os.environ.get('HALLS_ADMIN_HOSTS','localhost,127.0.0.1,[::1]').split(','),
)
