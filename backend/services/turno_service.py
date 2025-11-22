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
        turno = TurnoRepository.crear(
            paciente_id, medico_id, especialidad_id, fecha, hora, duracion_minutos
        )
        
        # Crear recordatorio automático
        try:
            from backend.services.recordatorio_service import RecordatorioService
            RecordatorioService.crear_recordatorio_automatico_para_turno(turno.id_turno, 24)
            print(f"✅ Recordatorio automático creado para turno {turno.id_turno}")
        except Exception as e:
            print(f"⚠️ No se pudo crear recordatorio automático para turno {turno.id_turno}: {str(e)}")
        
        # Enviar email de confirmación al paciente
        try:
            from backend.services.email_service import EmailService
            from backend.repositories.especialidad_repository import EspecialidadRepository
            
            # Obtener datos completos
            paciente_obj = PacienteRepository.obtener_por_id(paciente_id)
            medico_obj = MedicoRepository.obtener_por_id(medico_id)
            especialidad_obj = EspecialidadRepository.obtener_por_id(especialidad_id)
            
            EmailService.enviar_confirmacion_turno(turno, paciente_obj, medico_obj, especialidad_obj)
            print(f"✅ Email de confirmación enviado a {paciente_obj.email}")
        except Exception as e:
            print(f"⚠️ No se pudo enviar email de confirmación: {str(e)}")
            # No fallar la creación si el email falla
        
        return turno

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
    def obtener_turno(id_turno):
        """Obtener un turno por ID"""
        turno = TurnoRepository.obtener_por_id(id_turno)
        if not turno:
            raise ValueError("Turno no encontrado")
        return turno
    
    @staticmethod
    def actualizar_turno(id_turno, paciente_id, medico_id, especialidad_id, fecha, hora, duracion_minutos=30):
        """Actualizar un turno existente con validaciones"""
        from backend.repositories.paciente_repository import PacienteRepository
        from backend.repositories.medico_repository import MedicoRepository
        from backend.repositories.medico_especialidad_repository import MedicoEspecialidadRepository
        
        # Verificar que el turno existe
        turno = TurnoRepository.obtener_por_id(id_turno)
        if not turno:
            raise ValueError("Turno no encontrado")
        
        # Validar existencia de entidades relacionadas
        if paciente_id:
            paciente = PacienteRepository.obtener_por_id(paciente_id)
            if not paciente:
                raise ValueError("Paciente inexistente")
        
        if medico_id:
            medico = MedicoRepository.obtener_por_id(medico_id)
            if not medico:
                raise ValueError("Médico inexistente")
        
        # Validar especialidad del médico
        if medico_id and especialidad_id:
            if not MedicoEspecialidadRepository.obtener(medico_id, especialidad_id):
                raise ValueError("El médico no posee esa especialidad")
        
        # Validar duración
        if duracion_minutos is not None:
            if not isinstance(duracion_minutos, int) or duracion_minutos <= 0:
                raise ValueError("La duración debe ser un número positivo en minutos")
            if duracion_minutos > 480:
                raise ValueError("La duración no puede exceder 480 minutos (8 horas)")
        
        # Validar rango horario si se actualiza la hora
        if hora is not None:
            hora_inicio_minutos = TurnoService.convertir_hora_a_minutos(hora)
            hora_fin_minutos = hora_inicio_minutos + (duracion_minutos or turno.duracion_minutos)
            MIN_PERMITIDO = 8 * 60  # 08:00
            MAX_FIN_PERMITIDO = 20 * 60  # 20:00
            
            if hora_inicio_minutos < MIN_PERMITIDO or hora_fin_minutos > MAX_FIN_PERMITIDO:
                raise ValueError("Los turnos solo se pueden programar entre las 08:00 y las 20:00")
        
        # Validar superposiciones si se cambian datos clave
        if any([medico_id, fecha, hora, duracion_minutos]):
            nuevo_medico_id = medico_id or turno.medico_id
            nueva_fecha = fecha or turno.fecha
            nueva_hora = hora or turno.hora
            nueva_duracion = duracion_minutos or turno.duracion_minutos
            
            # Verificar superposición para el médico (excluyendo el turno actual)
            TurnoService.validar_superposicion(nuevo_medico_id, nueva_fecha, nueva_hora, nueva_duracion, id_turno)
            
            # Verificar superposición para el paciente (excluyendo el turno actual)
            nuevo_paciente_id = paciente_id or turno.paciente_id
            TurnoService.validar_superposicion_paciente(nuevo_paciente_id, nueva_fecha, nueva_hora, nueva_duracion, id_turno)
        
        # Actualizar campos
        campos_actualizar = {}
        if paciente_id is not None:
            campos_actualizar['paciente_id'] = paciente_id
        if medico_id is not None:
            campos_actualizar['medico_id'] = medico_id
        if especialidad_id is not None:
            campos_actualizar['especialidad_id'] = especialidad_id
        if fecha is not None:
            campos_actualizar['fecha'] = fecha
        if hora is not None:
            campos_actualizar['hora'] = hora
        if duracion_minutos is not None:
            campos_actualizar['duracion_minutos'] = duracion_minutos
        
        return TurnoRepository.actualizar(id_turno, **campos_actualizar)
    
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
    
    @staticmethod
    def obtener_turnos_pendientes_hoy():
        """Obtener todos los turnos pendientes para hoy"""
        from datetime import date
        
        todos_turnos = TurnoRepository.obtener_todos()
        fecha_hoy = date.today().isoformat()
        
        # Filtrar turnos de hoy con estado pendiente
        turnos_hoy = [
            turno for turno in todos_turnos
            if turno.fecha == fecha_hoy and turno.estado == "pendiente"
        ]
        
        # Ordenar por hora
        turnos_hoy.sort(key=lambda t: t.hora)
        
        return turnos_hoy
    
    @staticmethod
    def obtener_horarios_disponibles(medico_id, fecha, duracion_nuevo_turno=30):
        """Obtener horarios disponibles y ocupados para un médico en una fecha considerando la duración del nuevo turno"""
        # Obtener turnos existentes del médico en esa fecha
        turnos_medico = TurnoRepository.obtener_por_medico(medico_id)
        turnos_fecha = [t for t in turnos_medico if t.fecha == fecha and t.estado != 'cancelado']
        
        print(f"🔍 Verificando horarios para médico {medico_id} en fecha {fecha}")
        print(f"📋 Turnos existentes: {len(turnos_fecha)}")
        print(f"⏱️ Duración nuevo turno: {duracion_nuevo_turno} minutos")
        
        # Horario de trabajo: 08:00 a 20:00
        hora_inicio = 8 * 60  # 08:00 en minutos
        hora_fin = 20 * 60    # 20:00 en minutos
        intervalo = 30        # Intervalos de 30 minutos
        
        horarios = []
        for minutos in range(hora_inicio, hora_fin, intervalo):
            hora_str = f"{minutos // 60:02d}:{minutos % 60:02d}"
            
            # Calcular el fin del nuevo turno propuesto
            nuevo_turno_fin = minutos + duracion_nuevo_turno
            
            # Verificar que el turno no exceda las 20:00
            if nuevo_turno_fin > hora_fin:
                horarios.append({
                    "hora": hora_str,
                    "disponible": False
                })
                continue
            
            # Verificar si hay conflicto con turnos existentes
            ocupado = False
            for turno in turnos_fecha:
                turno_inicio = TurnoService.convertir_hora_a_minutos(turno.hora)
                turno_fin_existente = turno_inicio + turno.duracion_minutos
                
                # Verificar si hay superposición entre el nuevo turno y el turno existente
                # Hay superposición si:
                # - El nuevo turno empieza antes de que termine el turno existente Y
                # - El nuevo turno termina después de que empiece el turno existente
                if minutos < turno_fin_existente and nuevo_turno_fin > turno_inicio:
                    ocupado = True
                    print(f"❌ {hora_str} ocupado: nuevo turno [{minutos}-{nuevo_turno_fin}] solapa con turno existente [{turno_inicio}-{turno_fin_existente}]")
                    break
            
            if not ocupado:
                print(f"✅ {hora_str} disponible")
            
            horarios.append({
                "hora": hora_str,
                "disponible": not ocupado
            })
        
        return horarios
