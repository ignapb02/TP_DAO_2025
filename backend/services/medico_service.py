from backend.repositories.medico_repository import MedicoRepository
import re

class MedicoService:

    @staticmethod
    def validar_email(email):
        patron = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(patron, email):
            raise ValueError("El formato del email no es válido.")
    
    @staticmethod
    def validar_dni(dni):
        dni_str = str(dni).strip() if dni else ""
        if not dni_str or len(dni_str) == 0:
            raise ValueError("El DNI es requerido.")
        if not dni_str.isdigit():
            raise ValueError("El DNI debe contener solo números.")
    
    @staticmethod
    def registrar_medico(nombre, apellido, matricula, email, dni, telefono=None, password=None, rol='medico'):
        # Validaciones básicas
        nombre_str = str(nombre).strip() if nombre is not None else ""
        apellido_str = str(apellido).strip() if apellido is not None else ""
        matricula_str = str(matricula).strip() if matricula is not None else ""
        email_str = str(email).strip() if email is not None else ""

        if not nombre_str:
            raise ValueError("El nombre del médico es requerido.")
        if not apellido_str:
            raise ValueError("El apellido del médico es requerido.")
        if not matricula_str:
            raise ValueError("La matrícula es requerida.")
        if not email_str:
            raise ValueError("El email es requerido.")
        
        # Validar formato de email
        MedicoService.validar_email(email_str)
        
        # Validar DNI
        MedicoService.validar_dni(dni)
        
        # Validación: matrícula única
        medicos = MedicoRepository.obtener_todos()
        if any(str(m.matricula) == matricula_str for m in medicos):
            raise ValueError("La matrícula ya está registrada.")
        if any(str(m.email) == email_str for m in medicos):
            raise ValueError("El email ya está registrado.")
        if any(str(m.dni) == str(dni) for m in medicos):
            raise ValueError("El DNI ya está registrado.")

        return MedicoRepository.crear(nombre_str, apellido_str, matricula_str, email_str, dni, telefono, password, rol)

    @staticmethod
    def obtener_todos():
        return MedicoRepository.obtener_todos()

    @staticmethod
    def obtener_medico(id_medico):
        medico = MedicoRepository.obtener_por_id(id_medico)
        if not medico:
            raise ValueError("Médico no encontrado.")
        return medico

    @staticmethod
    def actualizar_medico(id_medico, **datos):
        # Validar que el médico exista
        medico_actual = MedicoRepository.obtener_por_id(id_medico)
        if not medico_actual:
            raise ValueError("Médico no encontrado.")
        
        # Validar email si se proporciona
        if 'email' in datos and datos['email']:
            datos_email_str = str(datos['email']).strip()
            MedicoService.validar_email(datos_email_str)
            # Verificar que no haya otro médico con ese email
            otros_medicos = [m for m in MedicoRepository.obtener_todos() if m.id_medico != id_medico]
            if any(str(m.email) == datos_email_str for m in otros_medicos):
                raise ValueError("El email ya está registrado por otro médico.")
        
        # Validar DNI si se proporciona
        if 'dni' in datos and datos['dni']:
            MedicoService.validar_dni(datos['dni'])
            otros_medicos = [m for m in MedicoRepository.obtener_todos() if m.id_medico != id_medico]
            if any(str(m.dni) == str(datos['dni']) for m in otros_medicos):
                raise ValueError("El DNI ya está registrado por otro médico.")
        
        # Validar matrícula si se proporciona
        if 'matricula' in datos and datos['matricula']:
            matricula_datos = str(datos['matricula']).strip()
            otros_medicos = [m for m in MedicoRepository.obtener_todos() if m.id_medico != id_medico]
            if any(str(m.matricula) == matricula_datos for m in otros_medicos):
                raise ValueError("La matrícula ya está registrada.")
        
        # Si password está vacío, quitarlo de datos (no actualizar)
        if 'password' in datos and not datos['password']:
            del datos['password']
        
        medico = MedicoRepository.actualizar(id_medico, **datos)
        if not medico:
            raise ValueError("Error al actualizar el médico.")
        return medico

    @staticmethod
    def eliminar_medico(id_medico):
        from backend.repositories.turno_repository import TurnoRepository
        
        # Verificar si el médico tiene turnos asignados
        turnos = TurnoRepository.obtener_por_medico(id_medico)
        if turnos:
            turnos_pendientes = [t for t in turnos if t.estado == 'pendiente']
            if turnos_pendientes:
                raise ValueError(f"No se puede eliminar el médico porque tiene {len(turnos_pendientes)} turno(s) pendiente(s) asignado(s).")
            else:
                raise ValueError(f"No se puede eliminar el médico porque tiene {len(turnos)} turno(s) histórico(s) asociado(s).")
        
        try:
            ok = MedicoRepository.eliminar(id_medico)
            if not ok:
                raise ValueError("Médico no encontrado.")
            return ok
        except ValueError:
            raise
