#!/usr/bin/env python3
"""Check the PUBLIC HTTP path after deploying Flask and materialized nginx assets.

Checks /, /leaderboard and /replay plus their versioned, same-origin code
resources. An API health check cannot detect missing nginx static directories.
Optional --include-media also checks fonts, images and videos with HEAD requests.
No admin routes, cookies, API keys or authenticated endpoints are accessed.
"""
import argparse,concurrent.futures,json,re
from collections import deque
from html.parser import HTMLParser
from urllib.error import HTTPError,URLError
from urllib.parse import urljoin,urlsplit
from urllib.request import HTTPRedirectHandler,Request,build_opener

PAGES=('/','/leaderboard','/replay')
CODE_EXTENSIONS=('.js','.mjs','.css','.html','.json','.wasm')
MEDIA_EXTENSIONS=('.woff','.woff2','.png','.jpg','.jpeg','.webp','.gif','.svg','.mp4')
STATIC=re.compile(r'/static/[a-f0-9]{16}/(?:assets|replay-assets)/[A-Za-z0-9_./-]+')
IMPORT=re.compile(r'''(?:\b(?:import|export)\b\s*(?:[^;\n"']*?\bfrom\s*)?|\bimport\s*\(\s*|\bnew\s+URL\s*\(\s*)["']([^"']+)["']''')
CSS_URL=re.compile(r'''(?:url\(\s*["']?|@import\s*["'])([^"'\s)]+)''')


def origin(url):
 parsed=urlsplit(url)
 return parsed.scheme,parsed.netloc


class PageLinks(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.scripts=[]
 def handle_starttag(self,tag,attrs):
  values=dict(attrs)
  if tag=='script' and values.get('src'):self.links.append(values['src']);self.scripts.append(values['src'])
  if tag=='link' and values.get('href') and set(values.get('rel','').split())&{'stylesheet','modulepreload','preload'}:self.links.append(values['href'])
  if tag in ('iframe','img','video','source') and values.get('src'):self.links.append(values['src'])


class SameOriginRedirect(HTTPRedirectHandler):
 def __init__(self,base):self.base=base
 def redirect_request(self,request,fp,code,message,headers,newurl):
  parsed=urlsplit(newurl)
  if origin(newurl)!=origin(self.base) or (parsed.path not in PAGES and not STATIC.fullmatch(parsed.path)):
   raise ValueError('Redirect outside the public asset scope')
  return super().redirect_request(request,fp,code,message,headers,newurl)


def asset_url(base,current,value,include_media):
 url=urljoin(current,value);parsed=urlsplit(url)
 extensions=CODE_EXTENSIONS+MEDIA_EXTENSIONS if include_media else CODE_EXTENSIONS
 if origin(url)!=origin(base) or not STATIC.fullmatch(parsed.path) or '..' in parsed.path.split('/') or not parsed.path.endswith(extensions):return None
 return parsed._replace(query='',fragment='').geturl()


def fetch(base,url,timeout,max_bytes):
 path=urlsplit(url).path;binary=path.endswith(MEDIA_EXTENSIONS+('.wasm',));method='HEAD' if binary else 'GET'
 request=Request(url,method=method,headers={'User-Agent':'HALLS-Public-Asset-Check/1','Accept-Encoding':'identity','Cache-Control':'no-cache'})
 try:
  with build_opener(SameOriginRedirect(base)).open(request,timeout=timeout) as response:
   status=response.status;mime=response.headers.get_content_type();body=b'' if binary else response.read(max_bytes+1)
   if status!=200:return {'url':url,'error':'http_status','status':status}
   expected=('text/javascript','application/javascript','application/ecmascript','text/ecmascript') if path.endswith(('.js','.mjs')) else ('text/css',) if path.endswith('.css') else ('application/json',) if path.endswith('.json') else ('text/html',) if path in PAGES or path.endswith('.html') else None
   if expected and mime not in expected:return {'url':url,'error':'content_type','contentType':mime,'expected':list(expected)}
   if binary and mime=='text/html':return {'url':url,'error':'content_type','contentType':mime}
   if len(body)>max_bytes:return {'url':url,'error':'body_budget'}
   return {'url':url,'status':status,'contentType':mime,'text':body.decode('utf-8') if not binary else ''}
 except HTTPError as error:return {'url':url,'error':'http_status','status':error.code}
 except (URLError,TimeoutError,UnicodeError,ValueError,OSError) as error:return {'url':url,'error':'request_failed','detail':str(error)}


def check_public_assets(base,*,expected_version=None,include_media=False,timeout=15,workers=4,max_resources=256,max_bytes=8*1024*1024):
 parsed=urlsplit(base)
 if parsed.scheme not in ('http','https') or not parsed.netloc or parsed.username or parsed.password or parsed.path not in ('','/') or parsed.query or parsed.fragment:raise ValueError('Use a public origin URL without credentials, paths or query parameters')
 if expected_version is not None and not re.fullmatch('[a-f0-9]{16}',expected_version):raise ValueError('Expected version must be a 16-digit asset hash')
 base=base.rstrip('/');pending=deque(base+path for path in PAGES);seen=set(pending);checked=[];issues=[]
 with concurrent.futures.ThreadPoolExecutor(max_workers=max(1,min(workers,8))) as executor:
  while pending:
   batch=[pending.popleft() for _ in range(min(len(pending),max(1,min(workers,8))))]
   for result in executor.map(lambda url:fetch(base,url,timeout,max_bytes),batch):
    url=result['url'];path=urlsplit(url).path;checked.append({k:v for k,v in result.items() if k!='text'})
    if result.get('error'):issues.append({k:v for k,v in result.items() if k!='text'});continue
    text=result['text'];links=list(STATIC.findall(text))
    if result['contentType']=='text/html':
     parser=PageLinks();parser.feed(text);links.extend(parser.links)
     if path in PAGES:
      scripts=[asset_url(base,url,value,include_media) for value in parser.scripts];scripts=[value for value in scripts if value]
      if not scripts:issues.append({'url':url,'error':'missing_versioned_script'})
      if expected_version and path in ('/','/leaderboard') and not any(urlsplit(value).path==f'/static/{expected_version}/assets/site-entry.js' for value in scripts):issues.append({'url':url,'error':'entry_version_mismatch','expectedVersion':expected_version})
    if path.endswith(('.js','.mjs')):links.extend(IMPORT.findall(text))
    if result['contentType']=='text/css':links.extend(CSS_URL.findall(text))
    for value in links:
     dependency=asset_url(base,url,value,include_media)
     if not dependency or dependency in seen:continue
     if len(seen)>=max_resources:
      issues.append({'url':url,'error':'resource_budget','maximum':max_resources});pending.clear();break
     seen.add(dependency);pending.append(dependency)
 return {'ok':not issues,'origin':base,'expectedVersion':expected_version,'includeMedia':include_media,'checkedCount':len(checked),'issues':issues,'resources':checked}


if __name__=='__main__':
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('origin');parser.add_argument('--expected-version');parser.add_argument('--include-media',action='store_true');parser.add_argument('--timeout',type=float,default=15);parser.add_argument('--workers',type=int,default=4);parser.add_argument('--output')
 args=parser.parse_args();result=check_public_assets(args.origin,expected_version=args.expected_version,include_media=args.include_media,timeout=args.timeout,workers=args.workers);encoded=json.dumps(result,ensure_ascii=False,indent=2)+'\n'
 if args.output:
  from pathlib import Path
  Path(args.output).write_text(encoded)
 print(encoded,end='');raise SystemExit(0 if result['ok'] else 1)
