import os
import sys
from datetime import datetime

# Agregar el directorio raíz del proyecto al PATH
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import create_app
from backend.services.recordatorio_service import RecordatorioService

def main():
    print(f"🚀 Iniciando procesamiento de recordatorios - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Crear app y contexto
    app = create_app()
    
    with app.app_context():
        try:
            # Procesar recordatorios pendientes
            resultado = RecordatorioService.procesar_recordatorios_pendientes()
            
            # Log del resultado
            print(f"📊 Resultado del procesamiento:")
            print(f"   - Recordatorios procesados: {resultado['procesados']}")
            print(f"   - Emails enviados: {resultado['enviados']}")
            print(f"   - Errores: {resultado['errores']}")
            print(f"   - Timestamp: {resultado['timestamp']}")
            
            if resultado['enviados'] > 0:
                print(f"✅ Se enviaron {resultado['enviados']} recordatorios exitosamente")
            
            if resultado['errores'] > 0:
                print(f"❌ {resultado['errores']} recordatorios fallaron")
                
            if resultado['procesados'] == 0:
                print("ℹ️ No hay recordatorios pendientes para enviar")
            
        except Exception as e:
            print(f"💥 Error crítico procesando recordatorios: {str(e)}")
            import traceback
            traceback.print_exc()
            sys.exit(1)
    
    print(f"🏁 Procesamiento completado - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()