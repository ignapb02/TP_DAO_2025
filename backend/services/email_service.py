from flask_mail import Mail, Message
from flask import current_app
import os


class EmailService:
   
    _instance = None
    _mail = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmailService, cls).__new__(cls)
        return cls._instance
    
    @classmethod
    def get_instance(cls):
        
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
    
    @classmethod
    def init_mail(cls, app):
        
        # Configuración SMTP - usar variables de entorno o valores por defecto para desarrollo
        app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
        app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', '587'))
        app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'true').lower() == 'true'
        app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL', 'false').lower() == 'true'
        app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', '')
        app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD', '')
        app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', 'turnero@clinica.com')
        
        if cls._mail is None:
            cls._mail = Mail(app)
        else:
            cls._mail.init_app(app)
        
        return cls._mail
    
    @classmethod
    def get_mail(cls):
        """Retorna la instancia de Flask-Mail"""
        return cls._mail
    
    @classmethod
    def enviar_recordatorio_turno(cls, turno, paciente, medico, especialidad):
        """Enviar email de recordatorio de turno"""
        if not cls._mail:
            print("⚠️ EmailService no inicializado - simulating email send")
            return cls._simulate_email(turno, paciente, medico, especialidad)
        
        if not paciente.email:
            raise ValueError(f"El paciente {paciente.nombre} {paciente.apellido} no tiene email registrado")
        
        try:
            subject = f"Recordatorio: Turno médico - {turno.fecha} {turno.hora}"
            
            # Plantilla HTML del email
            html_body = f"""
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #007bff; text-align: center;">🏥 Recordatorio de Turno Médico</h2>
                    
                    <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p>Estimado/a <strong>{paciente.nombre} {paciente.apellido}</strong>,</p>
                        
                        <p>Le recordamos que tiene un turno programado:</p>
                        
                        <div style="border-left: 4px solid #007bff; padding-left: 20px; margin: 20px 0;">
                            <p><strong>📅 Fecha:</strong> {turno.fecha}</p>
                            <p><strong>⏰ Hora:</strong> {turno.hora}</p>
                            <p><strong>🩺 Médico:</strong> Dr./Dra. {medico.nombre} {medico.apellido}</p>
                            <p><strong>📚 Especialidad:</strong> {especialidad.nombre}</p>
                            <p><strong>⏱️ Duración:</strong> {turno.duracion_minutos} minutos</p>
                        </div>
                        
                        <div style="background-color: #e7f3ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
                            <p style="margin: 0;"><strong>💡 Recuerde:</strong></p>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Llegar 10 minutos antes de la cita</li>
                                <li>Traer DNI y obra social</li>
                                <li>Si no puede asistir, cancele con anticipación</li>
                            </ul>
                        </div>
                        
                        <p>Saludos cordiales,<br>
                        <strong>Turnero Médico</strong></p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Versión texto plano
            text_body = f"""
            Recordatorio de Turno Médico
            
            Estimado/a {paciente.nombre} {paciente.apellido},
            
            Le recordamos que tiene un turno programado:
            
            Fecha: {turno.fecha}
            Hora: {turno.hora}
            Médico: Dr./Dra. {medico.nombre} {medico.apellido}
            Especialidad: {especialidad.nombre}
            Duración: {turno.duracion_minutos} minutos
            
            Recuerde:
            - Llegar 10 minutos antes de la cita
            - Traer DNI y obra social
            - Si no puede asistir, cancele con anticipación
            
            Saludos cordiales,
            Turnero Médico
            """
            
            msg = Message(
                subject=subject,
                recipients=[paciente.email],
                html=html_body,
                body=text_body
            )
            
            cls._mail.send(msg)
            print(f"✅ Email enviado a {paciente.email} para turno {turno.id_turno}")
            return True
            
        except Exception as e:
            print(f"❌ Error enviando email a {paciente.email}: {str(e)}")
            raise e
    
    
    @classmethod
    def enviar_credenciales_medico(cls, medico, password):
        """Enviar email con credenciales de acceso al médico"""
        if not cls._mail:
            print("⚠️ EmailService no inicializado - simulating email send")
            return cls._simulate_credenciales_email(medico, password)
        
        if not medico.email:
            raise ValueError(f"El médico {medico.nombre} {medico.apellido} no tiene email registrado")
        
        try:
            subject = "Bienvenido al Sistema de Turnos - Credenciales de Acceso"
            
            # Plantilla HTML del email
            html_body = f"""
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #007bff; text-align: center;">🏥 Bienvenido al Sistema de Turnos</h2>
                    
                    <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p>Estimado/a <strong>Dr./Dra. {medico.nombre} {medico.apellido}</strong>,</p>
                        
                        <p>Se ha creado una cuenta para usted en el Sistema de Turnos Médicos.</p>
                        
                        <div style="background-color: #e7f3ff; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #007bff;">
                            <p style="margin: 0 0 10px 0;"><strong>🔐 Sus credenciales de acceso:</strong></p>
                            <p style="margin: 5px 0;"><strong>Usuario (Email):</strong> {medico.email}</p>
                            <p style="margin: 5px 0;"><strong>Contraseña:</strong> {password}</p>
                            <p style="margin: 5px 0;"><strong>Matrícula:</strong> {medico.matricula}</p>
                        </div>
                        
                        <div style="background-color: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #ffc107;">
                            <p style="margin: 0;"><strong>⚠️ Importante:</strong></p>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Por favor, cambie su contraseña al iniciar sesión por primera vez</li>
                                <li>No comparta estas credenciales con nadie</li>
                                <li>Guarde este correo en un lugar seguro</li>
                            </ul>
                        </div>
                        
                        <p>Puede acceder al sistema utilizando su email como usuario y la contraseña proporcionada.</p>
                        
                        <p>Saludos cordiales,<br>
                        <strong>Administración - Turnero Médico</strong></p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Versión texto plano
            text_body = f"""
            Bienvenido al Sistema de Turnos Médicos
            
            Estimado/a Dr./Dra. {medico.nombre} {medico.apellido},
            
            Se ha creado una cuenta para usted en el Sistema de Turnos Médicos.
            
            Sus credenciales de acceso:
            Usuario (Email): {medico.email}
            Contraseña: {password}
            Matrícula: {medico.matricula}
            
            IMPORTANTE:
            - Por favor, cambie su contraseña al iniciar sesión por primera vez
            - No comparta estas credenciales con nadie
            - Guarde este correo en un lugar seguro
            
            Puede acceder al sistema utilizando su email como usuario y la contraseña proporcionada.
            
            Saludos cordiales,
            Administración - Turnero Médico
            """
            
            msg = Message(
                subject=subject,
                recipients=[medico.email],
                html=html_body,
                body=text_body
            )
            
            cls._mail.send(msg)
            print(f"✅ Email de credenciales enviado a {medico.email}")
            return True
            
        except Exception as e:
            print(f"❌ Error enviando email a {medico.email}: {str(e)}")
            raise e
    