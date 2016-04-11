from django.contrib import admin

from.models import toDo

# Register your models here.

class toDoAdmin(admin.ModelAdmin):
    list_display = ("description", "done")

admin.site.register(toDo, toDoAdmin)