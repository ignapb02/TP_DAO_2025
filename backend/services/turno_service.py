from backend.repositories.turno_repository import TurnoRepository
from backend.repositories.medico_repository import MedicoRepository
from backend.repositories.paciente_repository import PacienteRepository
from backend.repositories.medico_especialidad_repository import MedicoEspecialidadRepository
from datetime import datetime, timedelta

class TurnoService:

    @staticmethod
    def convertir_hora_a_minutos(hora_str):
        """Convierte una hora en formato HH:MM a minutos desde las 00:00"""
        try:
            horas, minutos = map(int, hora_str.split(':'))
            return horas * 60 + minutos
        except:
            raise ValueError("Formato de hora inválido. Usa HH:MM")

    @staticmethod
    def validar_superposicion(medico_id, fecha, hora_inicio, duracion_minutos, turno_id_excluir=None):
        """Valida que no haya turnos superpuestos para el médico en la fecha y hora dada"""
        turnos_medico = TurnoRepository.obtener_por_medico(medico_id)
        
        # Convertir hora de entrada a minutos
        hora_inicio_minutos = TurnoService.convertir_hora_a_minutos(hora_inicio)
        hora_fin_minutos = hora_inicio_minutos + duracion_minutos
        
        for turno in turnos_medico:
            # Excluir el turno que se está editando
            if turno_id_excluir and turno.id_turno == turno_id_excluir:
                continue
            
            # Solo validar turnos en la misma fecha
            if turno.fecha != fecha:
                continue
            
            # Convertir hora del turno existente a minutos
            turno_inicio_minutos = TurnoService.convertir_hora_a_minutos(turno.hora)
            turno_fin_minutos = turno_inicio_minutos + turno.duracion_minutos
            
            # Verificar si hay superposición
            if (hora_inicio_minutos < turno_fin_minutos and hora_fin_minutos > turno_inicio_minutos):
                # Hay superposición
                hora_fin = f"{hora_fin_minutos // 60:02d}:{hora_fin_minutos % 60:02d}"
                turno_fin = f"{turno_fin_minutos // 60:02d}:{turno_fin_minutos % 60:02d}"
                raise ValueError(
                    f"El médico ya tiene un turno en este horario. "
                    f"Tu turno: {hora_inicio}-{hora_fin}. "
                    f"Turno existente: {turno.hora}-{turno_fin}"
                )

    @staticmethod
    def validar_superposicion_paciente(paciente_id, fecha, hora_inicio, duracion_minutos, turno_id_excluir=None):
        """Valida que un paciente no tenga turnos superpuestos en la misma fecha (independientemente del médico)."""
        turnos_paciente = TurnoRepository.obtener_por_paciente(paciente_id)

        hora_inicio_minutos = TurnoService.convertir_hora_a_minutos(hora_inicio)
        hora_fin_minutos = hora_inicio_minutos + duracion_minutos

        for turno in turnos_paciente:
            if turno_id_excluir and turno.id_turno == turno_id_excluir:
                continue

            if turno.fecha != fecha:
                continue

            turno_inicio_minutos = TurnoService.convertir_hora_a_minutos(turno.hora)
            turno_fin_minutos = turno_inicio_minutos + turno.duracion_minutos

            if (hora_inicio_minutos < turno_fin_minutos and hora_fin_minutos > turno_inicio_minutos):
                hora_fin = f"{hora_fin_minutos // 60:02d}:{hora_fin_minutos % 60:02d}"
                turno_fin = f"{turno_fin_minutos // 60:02d}:{turno_fin_minutos % 60:02d}"
                raise ValueError(
                    f"El paciente ya tiene un turno en este horario. "
                    f"Tu turno: {hora_inicio}-{hora_fin}. "
                    f"Turno existente: {turno.hora}-{turno_fin}"
                )

    @staticmethod
    def crear_turno(paciente_id, medico_id, especialidad_id, fecha, hora, duracion_minutos=30):

        # Validar existencia
        paciente = PacienteRepository.obtener_por_id(paciente_id)
        medico = MedicoRepository.obtener_por_id(medico_id)

        if not paciente:
            raise ValueError("Paciente inexistente.")
        if not medico:
            raise ValueError("Médico inexistente.")

        # Validar que el médico tenga esa especialidad
        if not MedicoEspecialidadRepository.obtener(medico_id, especialidad_id):
            raise ValueError("El médico no posee esa especialidad.")
        
        # Validar duración
        if not isinstance(duracion_minutos, int) or duracion_minutos <= 0:
            raise ValueError("La duración debe ser un número positivo en minutos.")
        
        if duracion_minutos > 480:  # Máximo 8 horas
            raise ValueError("La duración no puede exceder 480 minutos (8 horas).")

        # Validar superposición
        # Verificar superposición para el médico
        TurnoService.validar_superposicion(medico_id, fecha, hora, duracion_minutos)
        # Verificar superposición para el paciente (no puede tener dos turnos solapados en la misma fecha)
        TurnoService.validar_superposicion_paciente(paciente_id, fecha, hora, duracion_minutos)

        # Crear turno
        return TurnoRepository.crear(
            paciente_id, medico_id, especialidad_id, fecha, hora, duracion_minutos
        )

    @staticmethod
    def cambiar_estado(id_turno, nuevo_estado):
        turno = TurnoRepository.obtener_por_id(id_turno)
        if not turno:
            raise ValueError("Turno inexistente.")
        
        turno.estado = nuevo_estado
        updated = TurnoRepository.actualizar(id_turno, estado=nuevo_estado)
        return updated

    @staticmethod
    def cancelar_turno(id_turno):
        return TurnoService.cambiar_estado(id_turno, "cancelado")

    @staticmethod
    def obtener_turnos_medico(id_medico):
        return TurnoRepository.obtener_por_medico(id_medico)

    @staticmethod
    def obtener_turnos_paciente(id_paciente):
        return TurnoRepository.obtener_por_paciente(id_paciente)

    @staticmethod
    def obtener_todos_turnos():
        return TurnoRepository.obtener_todos()
