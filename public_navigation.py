"""Server-selected public navigation; never includes private judging settings."""
import re

_UPLOAD_ENTRY=re.compile(r'''<a\b(?=[^>]*\shref\s*=\s*(["'])/upload(?:[?#][^"']*)?\1)[^>]*>.*?</a\s*>''',re.I|re.S)

def public_upload_links(html,enabled):
 return html if enabled else _UPLOAD_ENTRY.sub('',html)
