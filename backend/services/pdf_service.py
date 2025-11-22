from io import BytesIO
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.platypus.flowables import KeepTogether
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT


class PDFService:
    """Servicio para generar reportes en formato PDF usando ReportLab"""
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(PDFService, cls).__new__(cls)
        return cls._instance
    
    @staticmethod
    def get_instance():
        if PDFService._instance is None:
            PDFService._instance = PDFService()
        return PDFService._instance
    
    def generar_reporte_completo(self, data_reporte, filtros):
        """
        Genera un PDF completo con todos los reportes
        
        Args:
            data_reporte: dict con keys: turnosMedico, turnosPorEsp, pacientesAtendidos, asistencia
            filtros: dict con keys: medico_id, medico_nombre, desde, hasta
        
        Returns:
            BytesIO con el PDF generado
        """
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=50,
            leftMargin=50,
            topMargin=50,
            bottomMargin=50
        )
        
        # Estilos
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Title'],
            fontSize=24,
            textColor=colors.HexColor('#007bff'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#007bff'),
            spaceAfter=12,
            spaceBefore=20
        )
        normal_style = styles['Normal']
        
        # Contenido del documento
        story = []
        
        # Título principal
        story.append(Paragraph("📊 Reporte de Turnos Médicos", title_style))
        story.append(Spacer(1, 0.2 * inch))
        
        # Información del período
        info_data = [
            ['Período del Reporte', ''],
            ['Desde:', filtros.get('desde', 'Sin especificar')],
            ['Hasta:', filtros.get('hasta', 'Sin especificar')],
        ]
        
        if filtros.get('medico_nombre'):
            info_data.append(['Médico:', filtros['medico_nombre']])
        
        info_data.append(['Fecha de generación:', datetime.now().strftime('%d/%m/%Y %H:%M:%S')])
        
        info_table = Table(info_data, colWidths=[2*inch, 4*inch])
        info_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#007bff')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8f9fa')),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ]))
        story.append(info_table)
        story.append(Spacer(1, 0.3 * inch))
        
        # 1. Listado de Turnos por Médico
        turnos_medico = data_reporte.get('turnosMedico', [])
        if turnos_medico and filtros.get('medico_id'):
            story.append(Paragraph("🩺 Listado de Turnos por Médico", heading_style))
            
            turnos_data = [['Fecha', 'Hora', 'Paciente', 'Especialidad', 'Estado']]
            for turno in turnos_medico:
                turnos_data.append([
                    turno.get('fecha', ''),
                    turno.get('hora', ''),
                    f"{turno.get('paciente_nombre', '')} {turno.get('paciente_apellido', '')}",
                    turno.get('especialidad_nombre', ''),
                    turno.get('estado', '').upper()
                ])
            
            turnos_table = Table(turnos_data, colWidths=[1*inch, 0.8*inch, 2*inch, 1.5*inch, 1*inch])
            turnos_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#007bff')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8f9fa')]),
            ]))
            
            story.append(turnos_table)
            story.append(Spacer(1, 0.1 * inch))
            story.append(Paragraph(f"<b>Total de turnos: {len(turnos_medico)}</b>", normal_style))
            story.append(Spacer(1, 0.3 * inch))
        
        # 2. Cantidad de Turnos por Especialidad
        turnos_esp = data_reporte.get('turnosPorEsp', [])
        if turnos_esp:
            story.append(Paragraph("📚 Cantidad de Turnos por Especialidad", heading_style))
            
            esp_data = [['Especialidad', 'Cantidad']]
            for esp in turnos_esp:
                esp_data.append([
                    esp.get('especialidad_nombre', ''),
                    str(esp.get('cantidad', 0))
                ])
            
            esp_table = Table(esp_data, colWidths=[4.5*inch, 1.5*inch])
            esp_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#007bff')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (0, -1), 'LEFT'),
                ('ALIGN', (1, 0), (1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTNAME', (1, 1), (1, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8f9fa')]),
            ]))
            
            story.append(esp_table)
            story.append(Spacer(1, 0.3 * inch))
        
        # 3. Pacientes Atendidos
        pacientes = data_reporte.get('pacientesAtendidos', {})
        if pacientes and pacientes.get('total', 0) > 0:
            story.append(Paragraph("👥 Pacientes Atendidos en el Período", heading_style))
            story.append(Paragraph(f"<b>Total: {pacientes['total']}</b>", normal_style))
            story.append(Spacer(1, 0.1 * inch))
            
            lista_pacientes = pacientes.get('pacientes', [])
            if lista_pacientes:
                pac_data = [['Nombre', 'Apellido', 'DNI', 'Email', 'Teléfono']]
                for pac in lista_pacientes:
                    pac_data.append([
                        pac.get('nombre', ''),
                        pac.get('apellido', ''),
                        pac.get('dni', ''),
                        pac.get('email', '—'),
                        pac.get('telefono', '—')
                    ])
                
                pac_table = Table(pac_data, colWidths=[1.2*inch, 1.2*inch, 1*inch, 1.8*inch, 1*inch])
                pac_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#007bff')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, 0), 9),
                    ('FONTSIZE', (0, 1), (-1, -1), 8),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
                    ('TOPPADDING', (0, 0), (-1, -1), 5),
                    ('GRID', (0, 0), (-1, -1), 1, colors.grey),
                    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8f9fa')]),
                ]))
                
                story.append(pac_table)
                story.append(Spacer(1, 0.3 * inch))
        
        # 4. Estadísticas de Asistencia
        asistencia = data_reporte.get('asistencia', {})
        if asistencia:
            story.append(Paragraph("📊 Estadísticas de Asistencia", heading_style))
            
            stats_data = [
                ['Tipo', 'Cantidad'],
                ['✓ Asistencias', str(asistencia.get('asistencias', 0))],
                ['✗ Inasistencias', str(asistencia.get('inasistencias', 0))],
                ['⏳ Pendientes', str(asistencia.get('pendientes', 0))],
                ['TOTAL', str(asistencia.get('total', 0))]
            ]
            
            stats_table = Table(stats_data, colWidths=[3*inch, 2*inch])
            stats_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#007bff')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#d4edda')),
                ('TEXTCOLOR', (0, 1), (-1, 1), colors.HexColor('#155724')),
                ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#f8d7da')),
                ('TEXTCOLOR', (0, 2), (-1, 2), colors.HexColor('#721c24')),
                ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#e2e3e5')),
                ('TEXTCOLOR', (0, 3), (-1, 3), colors.HexColor('#383d41')),
                ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#007bff')),
                ('TEXTCOLOR', (0, 4), (-1, 4), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('ALIGN', (1, 0), (1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTNAME', (0, 4), (-1, 4), 'Helvetica-Bold'),
                ('FONTNAME', (1, 1), (1, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 11),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ]))
            
            story.append(stats_table)
            story.append(Spacer(1, 0.5 * inch))
        
        # Footer
        story.append(Spacer(1, 0.3 * inch))
        footer_style = ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.grey,
            alignment=TA_CENTER
        )
        story.append(Paragraph("Sistema de Gestión de Turnos Médicos", footer_style))
        story.append(Paragraph(f"Reporte generado automáticamente el {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}", footer_style))
        
        # Construir PDF
        doc.build(story)
        buffer.seek(0)
        return buffer
