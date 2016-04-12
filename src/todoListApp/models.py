from __future__ import unicode_literals
from django.db import models

# Create your models here.
class ToDo(models.Model):
    
    description = models.CharField(max_length=225)
    description = models.TextField() #Like a TEXT field
    done = models.BooleanField(default=False)
    created = models.DateTimeField() #Like a DATETIME field