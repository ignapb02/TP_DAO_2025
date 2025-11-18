import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'turnero.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configuración de Email
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')  # Tu email de Gmail
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')  # Tu contraseña de aplicación de Gmail
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_USERNAME')
