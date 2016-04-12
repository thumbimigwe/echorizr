from django.shortcuts import render
from django.views.generic import ListView

from .models import ToDo

# Create your views here.
class ToDoList(ListView):

    model = ToDo
    template_name = 'todo/index.html'