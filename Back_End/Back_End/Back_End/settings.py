
from pathlib import Path
from datetime import timedelta
import cloudinary

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
    'cloudinary',
    'cloudinary_storage',

]

REST_FRAMEWORK ={
    'DEFAULT_AUTHENTICATION_CLASSES':(
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}


SIMPLE_JWT ={
    'ACCESS_TOKEN_LIFETIME':timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME':timedelta(days=1),
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
        'PASSWORD':'Cris270814',
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

# Límite de tamaño de carga: 20 MB (en bytes)
# tal parece que cloudinary no permite mas alla de 10 mb al ser plan gratuito, pero, dejo esto aqui por algun futuro uso
DATA_UPLOAD_MAX_MEMORY_SIZE = 20 * 1024 * 1024  # 20 MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 20 * 1024 * 1024  # 20 MB



DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': 'dxwanm9n2',
    'API_KEY': '156424214735841',
    'API_SECRET': 'aSeXB_khgGC8bORnp9PyNsXxacA',
}

cloudinary.config(
    cloud_name=CLOUDINARY_STORAGE['CLOUD_NAME'],
    api_key=CLOUDINARY_STORAGE['API_KEY'],
    api_secret=CLOUDINARY_STORAGE['API_SECRET'],
    secure=True
)

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# Configuración de envío de correo con Gmail
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'tc782.pruebas@gmail.com' 
EMAIL_HOST_PASSWORD = 'hpgnxrzhwcjeujuj'  # Contraseña generada desde Gmail
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
