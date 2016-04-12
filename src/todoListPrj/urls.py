from django.conf.urls import include, url
from django.contrib import admin
from todoListApp.views import ToDoList
from django.conf import settings
from django.conf.urls import include, patterns, url

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', ToDoList.as_view(), name='home'),    
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += patterns('',
        url(r'^__debug__/', include(debug_toolbar.urls)),
    )