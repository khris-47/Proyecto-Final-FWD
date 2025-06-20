# Generated by Django 5.2 on 2025-05-20 20:09

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Auditoria_Cuentos',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipoMovimiento', models.CharField(max_length=30)),
                ('descripcion', models.TextField()),
                ('fechaMovimiento', models.DateTimeField(auto_now_add=True)),
                ('cuento', models.CharField(max_length=250)),
            ],
        ),
        migrations.CreateModel(
            name='Auditoria_Entrevistas',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipoMovimiento', models.CharField(max_length=30)),
                ('descripcion', models.TextField()),
                ('fechaMovimiento', models.DateTimeField(auto_now_add=True)),
                ('entrevista', models.CharField(max_length=250)),
            ],
        ),
        migrations.CreateModel(
            name='Auditoria_User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipoMovimiento', models.CharField(max_length=30)),
                ('descripcion', models.TextField()),
                ('fechaMovimiento', models.DateTimeField(auto_now_add=True)),
                ('user', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Estados',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipoEstado', models.CharField(max_length=20, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Ubicaciones',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=50, unique=True)),
                ('descripcion', models.TextField()),
                ('portada', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Comentarios',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comentario', models.TextField()),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Entrevistas',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entrevista', models.TextField()),
                ('nombre_Persona', models.CharField(max_length=250)),
                ('descripcion', models.TextField()),
                ('fecha_creacion', models.DateField(auto_now_add=True)),
                ('estado', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.estados')),
                ('ubicacion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.ubicaciones')),
            ],
        ),
        migrations.CreateModel(
            name='Cuentos',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('portada', models.TextField()),
                ('nombre_Cuento', models.CharField(max_length=250, unique=True)),
                ('cuento', models.TextField()),
                ('fecha_creacion', models.DateField(auto_now_add=True)),
                ('estado', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.estados')),
                ('ubicacion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.ubicaciones')),
            ],
        ),
    ]
