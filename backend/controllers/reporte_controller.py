from flask import Blueprint, request, jsonify
from backend.services.reporte_service import ReporteService

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
