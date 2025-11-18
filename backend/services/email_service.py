from flask_mail import Mail, Message
from flask import current_app
import os

class EmailService:
    mail = None
    
    @staticmethod
    def init_mail(app):
        """Inicializar Flask-Mail con la aplicación"""
        # Configuración SMTP - usar variables de entorno o valores por defecto para desarrollo
        app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
        app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', '587'))
        app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'true').lower() == 'true'
        app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL', 'false').lower() == 'true'
        app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', '')
        app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD', '')
        app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', 'turnero@clinica.com')
        
        EmailService.mail = Mail(app)
        return EmailService.mail
    
    @staticmethod
    def enviar_recordatorio_turno(turno, paciente, medico, especialidad):
        """Enviar email de recordatorio de turno"""
        if not EmailService.mail:
            print("⚠️ EmailService no inicializado - simulating email send")
            return EmailService._simulate_email(turno, paciente, medico, especialidad)
        
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
            
            EmailService.mail.send(msg)
            print(f"✅ Email enviado a {paciente.email} para turno {turno.id_turno}")
            return True
            
        except Exception as e:
            print(f"❌ Error enviando email a {paciente.email}: {str(e)}")
            raise e
    
    @staticmethod
    def _simulate_email(turno, paciente, medico, especialidad):
        """Simular envío de email para desarrollo/testing"""
        print(f"""
        📧 SIMULANDO ENVÍO DE EMAIL:
        Para: {paciente.email or 'NO_EMAIL'}
        Asunto: Recordatorio: Turno médico - {turno.fecha} {turno.hora}
        
        Estimado/a {paciente.nombre} {paciente.apellido},
        Le recordamos su turno:
        - Fecha: {turno.fecha}
        - Hora: {turno.hora}
        - Médico: Dr./Dra. {medico.nombre} {medico.apellido}
        - Especialidad: {especialidad.nombre}
        
        ✅ Email simulado exitosamente
        """)
        return True
    
    @staticmethod
    def test_email_config():
        """Verificar configuración de email"""
        if not EmailService.mail:
            return {"status": "error", "message": "EmailService no inicializado"}
        
        config = current_app.config
        return {
            "status": "ok",
            "server": config.get('MAIL_SERVER'),
            "port": config.get('MAIL_PORT'),
            "username": config.get('MAIL_USERNAME'),
            "default_sender": config.get('MAIL_DEFAULT_SENDER'),
            "tls": config.get('MAIL_USE_TLS'),
            "ssl": config.get('MAIL_USE_SSL')
        }