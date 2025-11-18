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

            # Ignorar turnos cancelados al validar superposición
            if getattr(turno, 'estado', None) == 'cancelado':
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

            # Ignorar turnos cancelados al validar superposición
            if getattr(turno, 'estado', None) == 'cancelado':
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

        # Validar rango horario permitido: entre 08:00 y 20:00 (el turno debe finalizar a las 20:00 o antes)
        hora_inicio_minutos = TurnoService.convertir_hora_a_minutos(hora)
        hora_fin_minutos = hora_inicio_minutos + duracion_minutos
        MIN_PERMITIDO = 8 * 60  # 08:00
        MAX_FIN_PERMITIDO = 20 * 60  # 20:00

        if hora_inicio_minutos < MIN_PERMITIDO or hora_fin_minutos > MAX_FIN_PERMITIDO:
            raise ValueError("Los turnos solo se pueden crear entre las 08:00 y las 20:00 (el turno debe finalizar a las 20:00 o antes).")

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
        # Si se intenta marcar como completado, verificar que la fecha/hora ya haya ocurrido
        if nuevo_estado == "completado":
            try:
                # Se espera que `turno.fecha` sea una cadena ISO (YYYY-MM-DD) y `turno.hora` HH:MM
                scheduled_dt = datetime.fromisoformat(f"{turno.fecha}T{turno.hora}")
            except Exception:
                raise ValueError("Formato de fecha/hora del turno inválido.")

            if datetime.now() < scheduled_dt:
                raise ValueError("No se puede marcar como completado antes de la fecha/hora programada.")

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
    
    @staticmethod
    def atender_turno(id_turno, diagnostico, tratamiento, observaciones):
        """Atiende un turno: crea historial clínico y marca turno como completado"""
        from backend.repositories.historial_clinico_repository import HistorialClinicoRepository
        from datetime import datetime
        
        # Validar que el turno exista
        turno = TurnoRepository.obtener_por_id(id_turno)
        if not turno:
            raise ValueError("Turno no encontrado")
        
        # Validar que el turno esté pendiente
        if turno.estado == "completado":
            raise ValueError("Este turno ya fue atendido")
        if turno.estado == "cancelado":
            raise ValueError("No se puede atender un turno cancelado")
        
        # Crear historial clínico
        historial = HistorialClinicoRepository.crear(
            paciente_id=turno.paciente_id,
            turno_id=id_turno,
            diagnostico=diagnostico,
            tratamiento=tratamiento,
            observaciones=observaciones,
            fecha_atencion=datetime.now()
        )
        
        # Cambiar estado del turno a completado
        TurnoService.cambiar_estado(id_turno, "completado")
        
        return {
            "msg": "Turno atendido correctamente",
            "historial": historial.to_dict(),
            "turno": turno.to_dict()
        }
