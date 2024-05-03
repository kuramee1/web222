from django.shortcuts import render
from django.http import JsonResponse
from.models import Task
import json

def index(request):
    tasks = Task.objects.all()
    return render(request, 'manager/index.html', {'tasks': tasks})

def create_task(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        title = data.get('title', '')
        description = data.get('description', '')
        if title:
            task = Task.objects.create(title=title, description=description)
            return JsonResponse({'success': True, 'id': task.id})
        else:
            return JsonResponse({'success': False, 'error': 'Title is required'}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

def get_tasks(request):
    if request.method == 'GET':
        tasks = Task.objects.all()
        task_list = [{'id': task.id, 'title': task.title, 'description': task.description, 'completed': task.completed} for task in tasks]
        return JsonResponse(task_list, safe=False)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

def delete_task(request, task_id):
    if request.method == 'DELETE':
        try:
            task = Task.objects.get(id=task_id)
            task.delete()
            return JsonResponse({'success': True})
        except Task.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Task not found'}, status=404)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

def update_task(request, task_id):
    if request.method == 'PUT':
        try:
            task = Task.objects.get(id=task_id)
            data = json.loads(request.body)
            task.description = data.get('description', '')
            task.save()
            return JsonResponse({'success': True})
        except Task.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Task not found'}, status=404)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


def toggle_completed(request, task_id):
    if request.method == 'PATCH':
        try:
            task = Task.objects.get(id=task_id)
            task.completed = not task.completed
            task.save()
            return JsonResponse({'success': True})
        except Task.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Task not found'}, status=404)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
