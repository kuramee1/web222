from django.urls import path
from. import views

urlpatterns = [
    path('', views.index, name='index'),
    path('create-task/', views.create_task, name='create_task'),
    path('get-tasks/', views.get_tasks, name='get_tasks'),
    path('delete-task/<int:task_id>/', views.delete_task, name='delete_task'),
    path('update-task/<int:task_id>/', views.update_task, name='update_task'),
    path('toggle-completed/<int:task_id>/', views.toggle_completed, name='toggle_completed'),
]
