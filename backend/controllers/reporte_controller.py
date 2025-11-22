from flask import Blueprint, request, jsonify, send_file
from backend.services.reporte_service import ReporteService
from backend.services.pdf_service import PDFService
from datetime import datetime

reporte_bp = Blueprint('reporte_bp', __name__, url_prefix="/reportes")


@reporte_bp.get("/turnos-por-medico")
def turnos_por_medico():
    medico_id = request.args.get("medico_id", type=int)
    if not medico_id:
        return jsonify({"error": "Parámetro 'medico_id' es requerido"}), 400
    desde = request.args.get("desde")
    hasta = request.args.get("hasta")
    data = ReporteService.turnos_por_medico(medico_id, desde, hasta)
    return jsonify(data)


@reporte_bp.get("/cantidad-turnos-por-especialidad")
def cantidad_turnos_por_especialidad():
    desde = request.args.get("desde")
    hasta = request.args.get("hasta")
    data = ReporteService.cantidad_turnos_por_especialidad(desde, hasta)
    return jsonify(data)


@reporte_bp.get("/pacientes-atendidos")
def pacientes_atendidos():
    desde = request.args.get("desde")
    hasta = request.args.get("hasta")
    data = ReporteService.pacientes_atendidos(desde, hasta)
    return jsonify(data)


@reporte_bp.get("/asistencia")
def asistencia():
    desde = request.args.get("desde")
    hasta = request.args.get("hasta")
    data = ReporteService.asistencia_vs_inasistencias(desde, hasta)
    return jsonify(data)


@reporte_bp.get("/pdf")
def generar_pdf():
    """
    Genera un PDF completo con todos los reportes
    Query params: medico_id (opcional), desde (opcional), hasta (opcional)
    """
    medico_id = request.args.get("medico_id", type=int)
    desde = request.args.get("desde")
    hasta = request.args.get("hasta")
    
    # Recopilar todos los datos
    data_reporte = {
        'turnosMedico': [],
        'turnosPorEsp': ReporteService.cantidad_turnos_por_especialidad(desde, hasta),
        'pacientesAtendidos': ReporteService.pacientes_atendidos(desde, hasta),
        'asistencia': ReporteService.asistencia_vs_inasistencias(desde, hasta)
    }
    
    # Filtros para el PDF
    filtros = {
        'desde': desde,
        'hasta': hasta
    }
    
    # Si hay medico_id, obtener turnos y nombre del médico
    if medico_id:
        from backend.services.medico_service import MedicoService
        data_reporte['turnosMedico'] = ReporteService.turnos_por_medico(medico_id, desde, hasta)
        
        # Obtener nombre del médico
        medico = MedicoService.obtener_por_id(medico_id)
        if medico:
            filtros['medico_id'] = medico_id
            filtros['medico_nombre'] = f"{medico.nombre} {medico.apellido}"
    
    # Generar PDF
    pdf_service = PDFService.get_instance()
    pdf_buffer = pdf_service.generar_reporte_completo(data_reporte, filtros)
    
    # Nombre del archivo
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"reporte_turnos_{timestamp}.pdf"
    
    return send_file(
        pdf_buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=filename
    )
