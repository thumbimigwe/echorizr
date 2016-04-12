from django.conf.urls import include, url
from django.contrib import admin
from todoListApp.views import ToDoList

admin.autodiscover()

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', ToDoList.as_view(), name='home'),
]
