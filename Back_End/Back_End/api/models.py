from django.db import models


# Para los usuarios y grupos (roles) se usan los modelos genericos de Django
from django.contrib.auth import get_user_model
User = get_user_model()


# ===========================================================================
# -- Tablas Principales -----------------------------------------------------
# ===========================================================================

# -- Modelado de Ubicaciones --------------------------------------
class Ubicaciones (models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField()
    portada = models.TextField()

    def __str__(self):
        return self.nombre
    
# -- Estados que tendran la mayoria de EndPoints ------------------
class Estados (models.Model):
    tipoEstado = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.tipoEstado

# -- Modelado de los cuentos --------------------------------------
class Cuentos (models.Model):
    portada = models.TextField() # imagen
    nombre_Cuento = models.CharField(max_length=250, unique=True)
    cuento = models.TextField() # pdf
    fecha_creacion = models.DateField(auto_now_add=True)
    ubicacion = models.ForeignKey(Ubicaciones, on_delete=models.CASCADE)
    estado = models.ForeignKey(Estados, on_delete=models.CASCADE)
    

    def __str__(self):
        return self.nombre_cuento

# -- Modelado de las Entrevistas ----------------------------------  
class Entrevistas (models.Model):
    entrevista = models.TextField()
    nombre_Persona = models.CharField(max_length=250)
    descripcion = models.TextField()
    fecha_creacion = models.DateField(auto_now_add=True)
    ubicacion = models.ForeignKey(Ubicaciones, on_delete=models.CASCADE)
    estado = models.ForeignKey(Estados, on_delete=models.CASCADE) 

    def __str__(self):
        return self.nombre_Persona
    
# -- Modelado de los comentarios de las personas -----------------
class Comentarios (models.Model):
    comentario =  models.TextField()
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha_creacion = models.DateField(auto_now_add=True)

# -- Modelado de los formularios de emprendimientos -------------
class Emprendimiento (models.Model):
    Nombre_Emprendimiento = models.CharField(max_length=250)
    Propietario = models.CharField(max_length=250)
    contacto = models.CharField(max_length=20)
    foto =  models.TextField()
    Descripcion = models.TextField()
    fecha_creacion = models.DateField(auto_now_add=True)
    ubicacion = models.ForeignKey(Ubicaciones, on_delete=models.CASCADE)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)

# -- Modelado para el primer Inicio de sesion --------------------
class VerificacionPrimerLogin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    codigo = models.IntegerField()
    creacion = models.DateTimeField(auto_now_add=True)
    verificado = models.BooleanField(default=False)


# ===========================================================================
# -- Auditorias -------------------------------------------------------------
# ===========================================================================


# -- Aduitoria de las Entrevistas --------------------------------------
class Auditoria_Entrevistas (models.Model):
    tipoMovimiento = models.CharField(max_length=30)
    descripcion = models.TextField()
    fechaMovimiento = models.DateTimeField(auto_now_add=True)
    entrevista = models.CharField(max_length=250)

    def __str__(self):
        return self.id

# -- Auditoria de los Cuentos -----------------------------------------
class Auditoria_Cuentos (models.Model):
    tipoMovimiento = models.CharField(max_length=30)
    descripcion = models.TextField()
    fechaMovimiento = models.DateTimeField(auto_now_add=True)
    cuento = models.CharField(max_length=250)

    def __str__(self):
        return self.id

# -- Auditoria para los usuarios -------------------------------------
class Auditoria_User (models.Model):
    tipoMovimiento = models.CharField(max_length=30)
    descripcion = models.TextField()
    fechaMovimiento = models.DateTimeField(auto_now_add=True)
    user = models.CharField(max_length=50)

    def __str__(self):
        return self.id