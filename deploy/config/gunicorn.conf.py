bind = '0.0.0.0:8081'
worker_class = 'sync'
loglevel = 'warn'
accesslog = '/app/logs/access.log'
acceslogformat = "%(h)s %(l)s %(u)s %(t)s %(r)s %(s)s %(b)s %(f)s %(a)s"
errorlog = '/app/logs/access.log'
