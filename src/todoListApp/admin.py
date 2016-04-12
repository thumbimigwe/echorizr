from django.contrib import admin

from.models import toDo

# Register your models here.

@admin.register(toDo)
class toDoAdmin(admin.ModelAdmin):
    list_display = ("description", "done")
    list_editable = ('done',)

#admin.site.register(toDo, toDoAdmin)