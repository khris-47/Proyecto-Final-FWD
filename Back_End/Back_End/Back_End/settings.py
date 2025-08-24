
from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-qmnjy*7u2t0&5(d1r9#y80rymck$8m5utz-@_zz#yrz84jeb8l'


DEBUG = True

ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'api',
    'corsheaders',
    'storages',

]

# Credenciales para AWS
AWS_ACCESS_KEY_ID = 'AKIAR6VIF7QEU5CF2EWE'
AWS_SECRET_ACCESS_KEY = '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'
AWS_STORAGE_BUCKET_NAME = 'tc-almacenamiento'
AWS_S3_REGION_NAME = 'us-east-2'
AWS_S3_CUSTOM_DOMAIN = f"{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com"

# Opciones de archivos publicos
AWS_DEFAULT_ACL = 'public-read'     # se usara para obtener las url publicas
AWS_QUERYSTRING_AUTH = False        # evitamos firmas temporales

# Backend de archivos estaticos/media
DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"


REST_FRAMEWORK ={
    'DEFAULT_AUTHENTICATION_CLASSES':(
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}


SIMPLE_JWT ={
    'ACCESS_TOKEN_LIFETIME':timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME':timedelta(minutes=65),
}


MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'Back_End.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'Back_End.wsgi.application'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'TC782',
        'USER': 'root',
        'PASSWORD':'1234',
        'HOST': '127.0.0.1',
        'PORT':'3306'

    }
}


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]


# Configuración de envío de correo con Gmail
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'tc782.pruebas@gmail.com' 
EMAIL_HOST_PASSWORD = 'hpgnxrzhwcjeujuj'  # Contraseña generada desde Gmail
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
